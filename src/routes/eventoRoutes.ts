import { Router } from 'express';
import { obtenerEventos } from '../controllers/eventoController.js';

const router = Router();

// Endpoint: GET /api/eventos
router.get('/', obtenerEventos);

export default router;
