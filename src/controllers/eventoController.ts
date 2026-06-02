import { Request, Response, NextFunction } from 'express';
import { EventoModel } from '../models/eventoModel.js';

export const obtenerEventos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { from, to } = req.query;
    const filter: Record<string, unknown> = {};

    // Si Grafana nos manda un rango de fechas, lo aplicamos
    if (from || to) {
      filter.createdAt = {};
      if (from) (filter.createdAt as any).$gte = new Date(from as string);
      if (to) (filter.createdAt as any).$lte = new Date(to as string);
    }

    // Buscamos los últimos eventos (límite de 1000 para no saturar la RAM)
    const eventos = await EventoModel.find(filter).sort({ createdAt: -1 }).limit(1000).lean();

    // Devolvemos un array puro de JSON, ideal para el plugin Infinity de Grafana
    res.status(200).json(eventos);
  } catch (error) {
    next(error); // Pasamos el error a tu globalErrorHandler
  }
};
