import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSensorDataDto } from '../dtos';
import { AddSensorDataDto } from '../dtos/add-sensor-data.dto';
import { SensorData } from '../interface/sensor-data.interface';

@Injectable()
export class DbSensorRepository {
  constructor(
    @InjectModel('SensorData')
    private readonly sensorDataModel: Model<SensorData>
  ) {}

  async createSensorData(
    createSensorDataDto: AddSensorDataDto
  ): Promise<SensorData> {
    const createdSensorData = new this.sensorDataModel({
      ...createSensorDataDto,
      createdAt: new Date().toISOString(),
    });
    return createdSensorData.save();
  }

  async findAllSensorData(): Promise<SensorData[]> {
    return this.sensorDataModel.find().exec();
  }

  async findSensorDataById(sensorDataId: string): Promise<SensorData> {
    return this.sensorDataModel.findById(sensorDataId).exec();
  }

  async updateSensorDataById(
    sensorDataId: string,
    updateSensorDataDto: UpdateSensorDataDto
  ): Promise<SensorData> {
    return this.sensorDataModel
      .findByIdAndUpdate(sensorDataId, updateSensorDataDto, { new: true })
      .exec();
  }

  async removeSensorDataById(sensorDataId: string): Promise<void> {
    await this.sensorDataModel.findByIdAndDelete(sensorDataId).exec();
  }
}
