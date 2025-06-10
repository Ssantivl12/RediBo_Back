//src/services/notificaciones/sse.service.ts
import { Request, Response } from 'express';

class SSEService {
    private static instance: SSEService;
    private clients: Map<number, Response> = new Map();
    private pingInterval: NodeJS.Timeout;
  
    private constructor() {
      console.log('Servicio SSE inicializado');
      // Enviar ping cada 30 segundos para mantener conexiones activas
      this.pingInterval = setInterval(() => this.enviarPing(), 30000);
    }

    public static getInstance(): SSEService {
        if (!SSEService.instance) {
            SSEService.instance = new SSEService();
        }
        return SSEService.instance;
    }
  
    conectarCliente(idUsuario: number, req: Request, res: Response): void {
        try {
            // Si ya existe una conexión para este usuario, la desconectamos primero
            if (this.clients.has(idUsuario)) {
                console.log(`Desconectando conexión anterior para el usuario ${idUsuario}`);
                this.desconectarCliente(idUsuario);
            }

            // Configurar encabezados para evitar problemas de conectividad
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache, no-transform');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
            // Configurar tiempo de espera del socket a un valor alto
            req.socket.setTimeout(0);
            req.socket.setNoDelay(true);
            req.socket.setKeepAlive(true);
            
            // Enviar evento inicial para confirmar conexión
            const mensajeInicial = `event: conectado\ndata: {"id":"${idUsuario}","status":"connected"}\n\n`;
            res.write(mensajeInicial);
        
            // Guardar la conexión del cliente
            this.clients.set(idUsuario, res);
            console.log(`Usuario ${idUsuario} conectado al SSE`);
            console.log('Usuarios conectados:', this.listarClientesConectados());
        
            // Cerrar conexión cuando el cliente se desconecte
            req.on('close', () => {
                console.log(`Usuario ${idUsuario} cerró la conexión`);
                this.desconectarCliente(idUsuario);
            });
            
            req.on('error', (error) => {
                console.error(`Error en la conexión del usuario ${idUsuario}:`, error);
                this.desconectarCliente(idUsuario);
            });

            // Enviar un ping inmediato para verificar la conexión
            res.write(':\n\n');
        } catch (error) {
            console.error(`Error al conectar cliente SSE para usuario ${idUsuario}:`, error);
            this.desconectarCliente(idUsuario);
            throw error;
        }
    }
  
    desconectarCliente(idUsuario: number): void {
        if (this.clients.has(idUsuario)) {
            const res = this.clients.get(idUsuario);
            try {
                // Intentar cerrar la conexión de manera limpia
                if (res && !res.writableEnded) {
                    res.write(`event: desconectado\ndata: {"id":"${idUsuario}","status":"disconnected"}\n\n`);
                    res.end();
                }
            } catch (error) {
                console.error(`Error al cerrar la conexión del usuario ${idUsuario}:`, error);
            }
            this.clients.delete(idUsuario);
            console.log(`Usuario ${idUsuario} desconectado`);
            console.log('Usuarios conectados:', this.listarClientesConectados());
        }
    }
  
    enviarNotificacion({ evento, data, idUsuario }: { evento: string, data: any, idUsuario: number }): void {
        console.log(`Buscando conexión para el usuario ${idUsuario}`);
        console.log('Usuarios conectados:', this.listarClientesConectados());
        
        const res = this.clients.get(idUsuario);
        
        if (!res) {
            console.log(`No hay conexión para el usuario ${idUsuario}`);
            return; 
        }
    
        const mensaje = `event: ${evento}\ndata: ${JSON.stringify(data)}\n\n`;
        
        try {
            console.log(`Enviando notificación al usuario ${idUsuario}`);
            console.log('Mensaje SSE:', mensaje);
            
            if (!res.writableEnded) {
                res.write(mensaje);
                if (typeof (res as any).flush === 'function') {
                    (res as any).flush();
                }
            } else {
                console.log(`Conexión cerrada para usuario ${idUsuario}, desconectando...`);
                this.desconectarCliente(idUsuario);
            }
            
            console.log(`Notificación enviada exitosamente al usuario ${idUsuario}`);
        } catch (error) {
            console.error(`Error al enviar notificación al usuario ${idUsuario}:`, error);
            this.desconectarCliente(idUsuario);
        }
    }
  
    enviarPing(): void {
        let totalUsuarios = 0;
        const usuariosConectados = Array.from(this.clients.keys());
        
        console.log('Enviando ping a usuarios conectados:', usuariosConectados);
        
        this.clients.forEach((res, idUsuario) => {
            try {
                if (!res.writableEnded) {
                    res.write(':\n\n');
                    totalUsuarios++;
                    console.log(`Ping enviado exitosamente al usuario ${idUsuario}`);
                } else {
                    console.log(`Conexión cerrada para usuario ${idUsuario}, desconectando...`);
                    this.desconectarCliente(idUsuario);
                }
            } catch (error) {
                console.error(`Error al enviar ping al usuario ${idUsuario}:`, error);
                this.desconectarCliente(idUsuario);
            }
        });
        
        if (totalUsuarios > 0) {
            console.log(`Ping enviado a ${totalUsuarios} conexiones activas`);
            console.log('Estado actual de conexiones:', this.listarClientesConectados());
        } else {
            console.log('No hay conexiones activas para enviar ping');
        }
    }
      
    cleanup(): void {
        clearInterval(this.pingInterval);
        // Desconectar todos los clientes al limpiar
        this.clients.forEach((_, idUsuario) => {
            this.desconectarCliente(idUsuario);
        });
    }

    listarClientesConectados(): string {
        const usuarios = Array.from(this.clients.keys());
        return usuarios.length > 0 
            ? usuarios.map(id => `Usuario: ${id}`).join('\n')
            : 'No hay usuarios conectados';
    }
}

export { SSEService };