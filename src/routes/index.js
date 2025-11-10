// src/routes/index.js
import { Router } from 'express';

// 🧩 Core system routes
import AuthRoutes from './AuthRoutes.js';
import PaymentRoutes from './PaymentRoutes.js';
import UserRoutes from './UserRoutes.js';
import OrganizationRoutes from './OrganizationRoutes.js';
import SessionRoutes from './SessionRoutes.js';

// 🏏 Cricket routes
import CricketRoutes from './CricketRoutes.js';

// 🗳️ Election Management routes
import ElectionRoutes from './ElectionRoutes.js';
import CandidateRoutes from './CandidateRoutes.js';
import VoterRoutes from './VoterRoutes.js';
import VoteRoutes from './VoteRoutes.js';
import ElectionResultRoutes from './ElectionResultRoutes.js';

import ChatRoutes from './ChatRoutes.js'
const router = Router();

// 🩺 Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '🌟 API is healthy!' });
});

// 🧩 Core routes
router.use('/organizations', OrganizationRoutes);
router.use('/users', UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/payments', PaymentRoutes);
router.use('/session', SessionRoutes);

// 🏏 Cricket routes
router.use('/cricket', CricketRoutes);

// 🗳️ Election Management routes
router.use('/elections', ElectionRoutes);
router.use('/candidates', CandidateRoutes);
router.use('/voters', VoterRoutes);
router.use('/votes', VoteRoutes);
router.use('/results', ElectionResultRoutes);

router.use('/chat', ChatRoutes);

export default router;
