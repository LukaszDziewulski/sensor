import { Document } from 'mongoose';

export interface SensorData extends Document {
  readonly temperature: number;
  readonly humidity: number;
  readonly createdAt: string;
}
