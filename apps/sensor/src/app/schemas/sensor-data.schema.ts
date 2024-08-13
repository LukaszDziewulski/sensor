import { Schema } from 'mongoose';

export const SensorDataSchema = new Schema({
  temperature: Number,
  humidity: Number,
  createdAt: { type: String, default: () => new Date().toISOString() },
});
