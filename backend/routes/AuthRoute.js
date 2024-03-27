import express from 'express';
import {
    Login,
    LogOut,
    Me
} from '../controllers/Auth.js';

const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.post('/logout', LogOut);

export default router;