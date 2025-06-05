import { SSEService } from './sse.service';

export class SSEInitializerService {
    private static instance: SSEInitializerService;
    private sseService: SSEService;

    private constructor() {
        this.sseService = SSEService.getInstance();
    }

    public static getInstance(): SSEInitializerService {
        if (!SSEInitializerService.instance) {
            SSEInitializerService.instance = new SSEInitializerService();
        }
        return SSEInitializerService.instance;
    }

    public inicializarSSEParaUsuario(idUsuario: number): void {
        try {
            this.sseService.marcarUsuarioParaConexion(idUsuario);
            console.log(`✅ Usuario ${idUsuario} marcado para conexión SSE automática`);
        } catch (error) {
            console.error(`❌ Error al inicializar SSE para usuario ${idUsuario}:`, error);
            // No lanzamos el error para no afectar el proceso de login
        }
    }

    public usuarioConectado(idUsuario: number): boolean {
        return this.sseService.estaConectado(idUsuario);
    }

    public obtenerNumeroConexiones(idUsuario: number): number {
        return this.sseService.obtenerNumeroConexiones(idUsuario);
    }

    public desconectarUsuario(idUsuario: number): void {
        try {
            this.sseService.desconectarUsuario(idUsuario);
            console.log(`✅ Usuario ${idUsuario} desconectado de SSE`);
        } catch (error) {
            console.error(`❌ Error al desconectar usuario ${idUsuario} de SSE:`, error);
        }
    }
}