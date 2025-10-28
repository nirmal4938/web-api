import { Router } from 'express';
// import AuthRoutes from './AuthRoutes'
import AuthRoutes from './AuthRoutes.js'
import PaymentRoutes from './PaymentRoutes.js'
import UserRoutes from './UserRoutes.js';
import OrganizationRoutes from './OrganizationRoutes.js'

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '🌟 API is healthy!' });
});
router.use('/organizations', OrganizationRoutes);
router.use('/users', UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/payments', PaymentRoutes);


export default router;
