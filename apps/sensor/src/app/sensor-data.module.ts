import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorDataGateway } from './gateways';
import { DbSensorRepository } from './repository';
import { SensorDataSchema } from './schemas';
import { SensorDataController } from './sensor-data.controller';
import { SensorDataService } from './sensor-data.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: 'SensorData', schema: SensorDataSchema },
    ]),
  ],

  controllers: [SensorDataController],
  providers: [SensorDataService, DbSensorRepository, SensorDataGateway],
})
export class SensorDataModule {}
