import { Schema, model, Types } from 'mongoose';

export const eventTypes = [
  'NUEVO_VENDEDOR', // Nuevas empresas publicadas / sellers
  'NUEVO_COMPRADOR', // Nuevos compradores registrados
  'VISITA_OFERTA', // Visitas a fichas de empresas
  'CONTACTO_INICIADO', // Contactos iniciados por compradores
  'MENSAJE_ENVIADO', // Mensajes enviados en la plataforma
  'LEAD_GENERADO', // Leads generados (interés en comprar)
  'OFERTA_VENDIDA', // Tiempo medio para vender una empresa
  'COMPRADOR_ENCONTRADO' // Tiempo medio para encontrar comprador
] as const;

/**
 * @openapi
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *           description: ID autogenerado de MongoDB
 *           example: '64f1a2b3c4d5e6f7a8b9c0d1'
 *         type:
 *           type: string
 *           enum: [NUEVO_VENDEDOR, NUEVO_COMPRADOR, VISITA_OFERTA, CONTACTO_INICIADO, MENSAJE_ENVIADO, LEAD_GENERADO, OFERTA_VENDIDA, COMPRADOR_ENCONTRADO]
 *           description: Tipo de evento registrado para analíticas
 *           example: 'VISITA_OFERTA'
 *         userId:
 *           type: string
 *           description: ID del usuario que detonó la acción (opcional)
 *           example: '64f1a2b3c4d5e6f7a8b9c0d1'
 *         ofertaId:
 *           type: string
 *           description: ID de la oferta relacionada con el evento (opcional)
 *           example: '64f1a2b3c4d5e6f7a8b9c0d1'
 *         metadata:
 *           type: object
 *           description: Datos extra del evento (ej. tiempo transcurrido en días para OFERTA_VENDIDA)
 *           example: { daysToSell: 45 }
 *         createdAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           readOnly: true
 *           format: date-time
 */
export interface IEvento {
  _id?: Types.ObjectId;
  type: (typeof eventTypes)[number];
  userId?: Types.ObjectId;
  ofertaId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

const eventoSchema = new Schema<IEvento>(
  {
    type: {
      type: String,
      required: true,
      enum: eventTypes,
      index: true // Índice clave: Grafana filtrará por este campo
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false,
      index: true
    },
    ofertaId: {
      type: Schema.Types.ObjectId,
      ref: 'Oferta',
      required: false,
      index: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false
    }
  },
  {
    timestamps: true // Esto nos da el `createdAt`
  }
);

// Índice compuesto para acelerar las consultas de Grafana por tipo de evento y fecha
eventoSchema.index({ type: 1, createdAt: -1 });

export const EventoModel = model<IEvento>('Evento', eventoSchema);
