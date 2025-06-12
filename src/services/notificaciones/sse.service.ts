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
        // Configurar encabezados para SSE y CORS
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        
        // Configurar tiempo de espera del socket
        req.socket.setTimeout(0);
        req.socket.setNoDelay(true);
        req.socket.setKeepAlive(true);
        
        // Enviar evento inicial para confirmar conexión
        res.write(`event: conectado\ndata: {"id":"${idUsuario}"}\n\n`);
    
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

        // Enviar un ping inicial para mantener la conexión viva
        res.write(':\n\n');
    }
  
    desconectarCliente(idUsuario: number): void {
        if (this.clients.has(idUsuario)) {
            const res = this.clients.get(idUsuario);
            if (res) {
                try {
                    res.end();
                } catch (error) {
                    console.error(`Error al cerrar conexión del usuario ${idUsuario}:`, error);
                }
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
            
            res.write(mensaje);
            
            console.log(`Notificación enviada exitosamente al usuario ${idUsuario}`);
        } catch (error) {
            console.error(`Error al enviar notificación al usuario ${idUsuario}:`, error);
            this.desconectarCliente(idUsuario);
        }
    }
  
    enviarPing(): void {
        let totalUsuarios = 0;
        
        this.clients.forEach((res, idUsuario) => {
            try {
                res.write(':\n\n');
                totalUsuarios++;
            } catch (error) {
                console.error(`Error al enviar ping al usuario ${idUsuario}:`, error);
                this.desconectarCliente(idUsuario);
            }
        });
        
        if (totalUsuarios > 0) {
            console.log(`Ping enviado a ${totalUsuarios} conexiones activas`);
        }
    }

    listarClientesConectados(): string {
        const usuarios = Array.from(this.clients.keys());
        return usuarios.length > 0 
            ? usuarios.map(id => `Usuario: ${id}`).join('\n')
            : 'No hay usuarios conectados';
    }
}

export { SSEService };