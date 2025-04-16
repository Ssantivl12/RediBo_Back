// cancelara las reservas vencidas
import cron from 'node-cron'
import { cancelarExpiradas } from './controllers/reservas.controller';

setInterval(() => {
  cancelarExpiradas({} as any, { status: () => ({ json: () => {} }) } as any);
}, 60 * 1000); // Cada 1 minuto

