import { ApiProperty } from '@nestjs/swagger';
import { SensorData } from '../interface';

export class SensorDataResponseDto {
  @ApiProperty({ example: 25 })
  id: string;

  @ApiProperty({ example: 25 })
  temperature: number;

  @ApiProperty({ example: 60 })
  humidity: number;

  @ApiProperty({ example: '2021-01-01T00:00:00Z' })
  createdAt: string;

  static createFrom(sensorData: SensorData): SensorDataResponseDto {
    const dto = new SensorDataResponseDto();
    dto.id = sensorData.id;
    dto.temperature = sensorData.temperature;
    dto.humidity = sensorData.humidity;
    dto.createdAt = sensorData.createdAt;
    return dto;
  }

  static createFromArray(
    sensorDataArray: SensorData[]
  ): SensorDataResponseDto[] {
    return sensorDataArray.map(SensorDataResponseDto.createFrom);
  }
}
