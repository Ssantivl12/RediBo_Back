import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface ConexionSSE {
  idUsuario: number;
  conexionId: string;
  response: Response;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

class SSEService {
    private static instance: SSEService;
    private conexiones: Map<string, ConexionSSE> = new Map();
    private conexionesPorUsuario: Map<number, Set<string>> = new Map();
    private usuariosParaConectar: Set<number> = new Set();
    private pingInterval: NodeJS.Timeout;
    private readonly MAX_CONEXIONES_POR_USUARIO = 4; 
  
    private constructor() {
      console.log('Servicio SSE inicializado');
      this.pingInterval = setInterval(() => this.enviarPing(), 30000);
    }

    public static getInstance(): SSEService {
        if (!SSEService.instance) {
            SSEService.instance = new SSEService();
        }
        return SSEService.instance;
    }

    marcarUsuarioParaConexion(idUsuario: number): void {
        this.usuariosParaConectar.add(idUsuario);
        console.log(`Usuario ${idUsuario} marcado para conexión SSE automática`);
    }

    private debeConectarseAutomaticamente(idUsuario: number): boolean {
        return this.usuariosParaConectar.has(idUsuario);
    }

    private limpiarMarcaConexion(idUsuario: number): void {
        this.usuariosParaConectar.delete(idUsuario);
    }
    private manejarLimiteConexiones(idUsuario: number): void {
        const conexionesUsuario = this.conexionesPorUsuario.get(idUsuario);
        
        if (conexionesUsuario && conexionesUsuario.size >= this.MAX_CONEXIONES_POR_USUARIO) {
            // Obtener la conexión más antigua
            const conexionesArray = Array.from(conexionesUsuario);
            const conexiones = conexionesArray.map(id => ({
                id,
                timestamp: this.conexiones.get(id)?.timestamp
            })).filter(c => c.timestamp);

            // Ordenar por timestamp (más antigua primero)
            conexiones.sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
            
            // Desconectar la más antigua
            const conexionMasAntigua = conexiones[0];
            if (conexionMasAntigua) {
                console.log(`Límite de conexiones alcanzado para usuario ${idUsuario}. Desconectando conexión más antigua: ${conexionMasAntigua.id}`);
                this.desconectarPorConexionId(conexionMasAntigua.id);
            }
        }
    }

    conectarCliente(idUsuario: number, req: Request, res: Response): string {
        this.manejarLimiteConexiones(idUsuario);
        
        // Generar ID único para esta conexión específica
        const conexionId = uuidv4();
        
        // Configurar encabezados SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        
        // Configurar socket
        req.socket.setTimeout(0);
        req.socket.setNoDelay(true);
        req.socket.setKeepAlive(true);
        
        const esConexionAutomatica = this.debeConectarseAutomaticamente(idUsuario);
        
        // Crear objeto de conexión
        const conexion: ConexionSSE = {
            idUsuario,
            conexionId,
            response: res,
            timestamp: new Date(),
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress
        };

        // Guardar la conexión
        this.conexiones.set(conexionId, conexion);
        
        // Actualizar índice por usuario
        if (!this.conexionesPorUsuario.has(idUsuario)) {
            this.conexionesPorUsuario.set(idUsuario, new Set());
        }
        this.conexionesPorUsuario.get(idUsuario)!.add(conexionId);

        // Solo enviar evento inicial si NO es automática
        if (!esConexionAutomatica) {
            res.write(`event: conectado\ndata: {"conexionId":"${conexionId}","idUsuario":"${idUsuario}"}\n\n`);
        }

        console.log(`Usuario ${idUsuario} conectado al SSE${esConexionAutomatica ? ' (automático)' : ''} - Conexión: ${conexionId}`);
        console.log(`Total conexiones del usuario ${idUsuario}: ${this.conexionesPorUsuario.get(idUsuario)?.size || 0}`);
        
        if (esConexionAutomatica) {
            this.limpiarMarcaConexion(idUsuario);
        }

        // Manejar desconexión
        req.on('close', () => {
            console.log(`Conexión ${conexionId} del usuario ${idUsuario} cerrada`);
            this.desconectarPorConexionId(conexionId);
        });
        
        req.on('error', (error) => {
            console.error(`Error en conexión ${conexionId} del usuario ${idUsuario}:`, error);
            this.desconectarPorConexionId(conexionId);
        });

        return conexionId;
    }

    desconectarPorConexionId(conexionId: string): void {
        const conexion = this.conexiones.get(conexionId);
        if (!conexion) return;

        const idUsuario = conexion.idUsuario;
        
        // Remover de conexiones
        this.conexiones.delete(conexionId);
        
        // Actualizar índice por usuario
        const conexionesUsuario = this.conexionesPorUsuario.get(idUsuario);
        if (conexionesUsuario) {
            conexionesUsuario.delete(conexionId);
            if (conexionesUsuario.size === 0) {
                this.conexionesPorUsuario.delete(idUsuario);
            }
        }

        console.log(`Conexión ${conexionId} del usuario ${idUsuario} desconectada`);
        console.log(`Conexiones restantes del usuario ${idUsuario}: ${conexionesUsuario?.size || 0}`);
    }

    desconectarUsuario(idUsuario: number): void {
        const conexionesUsuario = this.conexionesPorUsuario.get(idUsuario);
        if (!conexionesUsuario) return;

        const conexionesADesconectar = Array.from(conexionesUsuario);
        conexionesADesconectar.forEach(conexionId => {
            this.desconectarPorConexionId(conexionId);
        });

        this.limpiarMarcaConexion(idUsuario);
        console.log(`Todas las conexiones del usuario ${idUsuario} han sido desconectadas`);
    }

    enviarNotificacion({ evento, data, idUsuario }: { evento: string, data: any, idUsuario: number }): void {
        console.log(`Enviando notificación al usuario ${idUsuario}`);
        
        const conexionesUsuario = this.conexionesPorUsuario.get(idUsuario);
        if (!conexionesUsuario || conexionesUsuario.size === 0) {
            console.log(`No hay conexiones activas para el usuario ${idUsuario}`);
            return;
        }

        const mensaje = `event: ${evento}\ndata: ${JSON.stringify(data)}\n\n`;
        let conexionesExitosas = 0;
        let conexionesFallidas = 0;

        conexionesUsuario.forEach(conexionId => {
            const conexion = this.conexiones.get(conexionId);
            if (!conexion) {
                conexionesFallidas++;
                return;
            }

            try {
                conexion.response.write(mensaje);
                if (typeof (conexion.response as any).flush === 'function') {
                    (conexion.response as any).flush();
                }
                conexionesExitosas++;
            } catch (error) {
                console.error(`Error al enviar a conexión ${conexionId}:`, error);
                this.desconectarPorConexionId(conexionId);
                conexionesFallidas++;
            }
        });

        console.log(`Notificación enviada al usuario ${idUsuario}: ${conexionesExitosas} exitosas, ${conexionesFallidas} fallidas`);
    }

    enviarPing(): void {
        let totalConexiones = 0;
        let conexionesFallidas = 0;

        this.conexiones.forEach((conexion, conexionId) => {
            try {
                conexion.response.write(':\n\n');
                totalConexiones++;
            } catch (error) {
                console.error(`Error al enviar ping a conexión ${conexionId}:`, error);
                this.desconectarPorConexionId(conexionId);
                conexionesFallidas++;
            }
        });

        if (totalConexiones > 0) {
            console.log(`Ping enviado a ${totalConexiones} conexiones activas (${conexionesFallidas} fallidas)`);
        }
    }

    estaConectado(idUsuario: number): boolean {
        const conexionesUsuario = this.conexionesPorUsuario.get(idUsuario);
        return conexionesUsuario ? conexionesUsuario.size > 0 : false;
    }

    obtenerNumeroConexiones(idUsuario: number): number {
        const conexionesUsuario = this.conexionesPorUsuario.get(idUsuario);
        return conexionesUsuario ? conexionesUsuario.size : 0;
    }

    listarClientesConectados(): string {
        const usuariosConectados = Array.from(this.conexionesPorUsuario.entries());
        
        if (usuariosConectados.length === 0) {
            return 'No hay usuarios conectados';
        }

        return usuariosConectados
            .map(([idUsuario, conexiones]) => 
                `Usuario ${idUsuario}: ${conexiones.size} conexión(es)`)
            .join('\n');
    }

    obtenerEstadisticasDetalladas() {
        const usuarios = Array.from(this.conexionesPorUsuario.entries());
        const conexionesDetalle = Array.from(this.conexiones.entries());

        return {
            totalUsuarios: usuarios.length,
            totalConexiones: conexionesDetalle.length,
            maxConexionesPorUsuario: this.MAX_CONEXIONES_POR_USUARIO, 
            usuariosPorConexiones: usuarios.map(([idUsuario, conexiones]) => ({
                idUsuario,
                numeroConexiones: conexiones.size,
                conexiones: Array.from(conexiones).map(conexionId => {
                    const conexion = this.conexiones.get(conexionId);
                    return {
                        conexionId,
                        timestamp: conexion?.timestamp,
                        userAgent: conexion?.userAgent,
                        ip: conexion?.ip
                    };
                })
            })),
            usuariosPendientes: Array.from(this.usuariosParaConectar)
        };
    }

    cleanup(): void {
        clearInterval(this.pingInterval);
        this.conexiones.clear();
        this.conexionesPorUsuario.clear();
        this.usuariosParaConectar.clear();
    }
}

export { SSEService };