// cancelara las reservas vencidas
import cron from 'node-cron'
import { cancelExpiredReservationsHandler } from './controllers/reservationController'

// Ejecutar cada minuto
cron.schedule('* * * * *', async () => {
  console.log('Verificando reservas expiradas...')
  await cancelExpiredReservationsHandler({}, {})
})
