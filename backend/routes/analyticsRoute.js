import express from 'express'
import { getDashboardData, trackVisit } from '../controllers/analyticsController.js'
import adminAuth from '../middleware/adminAuth.js'

const analyticsRouter = express.Router();

analyticsRouter.get('/dashboard', adminAuth, getDashboardData); // Admin only
analyticsRouter.post('/track-visit', trackVisit); // Public (for frontend)

export default analyticsRouter;