import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  AddSensorDataDto,
  SensorDataResponseDto,
  UpdateSensorDataDto,
} from './dtos';
import { SensorErrors } from './error-codes';
import { DbSensorRepository } from './repository';

@Injectable()
export class SensorDataService {
  private readonly logger = new Logger(SensorDataService.name);
  constructor(private readonly sensorRepository: DbSensorRepository) {}

  async addSensorData(
    createSensorDataDto: AddSensorDataDto,
  ): Promise<SensorDataResponseDto> {
    const createdSensorData = await this.sensorRepository.createSensorData(
      createSensorDataDto,
    );
    return SensorDataResponseDto.createFrom(createdSensorData);
  }

  async getAllSensorsData(): Promise<SensorDataResponseDto[]> {
    const sensors = await this.sensorRepository.findAllSensorData();
    return SensorDataResponseDto.createFromArray(sensors);
  }

  async getSensorDataById(
    sensorDataId: string,
  ): Promise<SensorDataResponseDto> {
    if (!Types.ObjectId.isValid(sensorDataId)) {
      throw new HttpException(
        SensorErrors.SENSOR_DATA_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const sensor = await this.sensorRepository.findSensorDataById(sensorDataId);

    if (!sensor) {
      throw new HttpException(
        SensorErrors.SENSOR_DATA_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return SensorDataResponseDto.createFrom(sensor);
  }

  async updateSensorDataById(
    sensorDataId: string,
    updateSensorDataDto: UpdateSensorDataDto,
  ): Promise<SensorDataResponseDto> {
    await this.getSensorDataById(sensorDataId);
    try {
      const updatedSensorData =
        await this.sensorRepository.updateSensorDataById(
          sensorDataId,
          updateSensorDataDto,
        );
      return SensorDataResponseDto.createFrom(updatedSensorData);
    } catch (error) {
      this.logger.error(`Failed to update sensor data: ${error.message}`);
      throw new HttpException(
        SensorErrors.SENSOR_DATA_UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSensorDataById(sensorDataId: string): Promise<void> {
    await this.getSensorDataById(sensorDataId);
    try {
      await this.sensorRepository.removeSensorDataById(sensorDataId);
    } catch (error) {
      this.logger.error(`Failed to delete sensor data: ${error.message}`);
      throw new HttpException(
        SensorErrors.SENSOR_DATA_DELETE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
