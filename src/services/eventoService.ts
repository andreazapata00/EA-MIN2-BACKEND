import { IEvento, EventoModel } from '../models/eventoModel.js';

export const registrarEvento = async (data: Partial<IEvento>): Promise<IEvento> => {
  return await new EventoModel(data).save();
};
