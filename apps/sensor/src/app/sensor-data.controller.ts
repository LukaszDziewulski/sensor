import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AddSensorDataDto,
  SensorDataResponseDto,
  UpdateSensorDataDto,
} from './dtos';
import { SensorDataService } from './sensor-data.service';

@ApiTags('Sensors Data')
@Controller()
export class SensorDataController {
  constructor(private readonly sensorsService: SensorDataService) {}

  @ApiOperation({ summary: 'add new sensor data' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sensor data successfully created',
    type: SensorDataResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/sensors')
  async addSensorData(
    @Body() addSensorDataDto: AddSensorDataDto,
  ): Promise<SensorDataResponseDto> {
    return this.sensorsService.addSensorData(addSensorDataDto);
  }

  @ApiOperation({ summary: 'get sensor data by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns sensor data by id',
    type: SensorDataResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/sensors/:sensorDataId')
  async getSensorDataById(
    @Param('sensorDataId') id: string,
  ): Promise<SensorDataResponseDto> {
    return this.sensorsService.getSensorDataById(id);
  }

  @ApiOperation({ summary: 'get all sensors data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all sensor data',
    type: [SensorDataResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/sensors')
  async getAllSensorsData(): Promise<SensorDataResponseDto[]> {
    return this.sensorsService.getAllSensorsData();
  }

  @ApiOperation({ summary: 'delete sensor data by id' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Sensor data successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('sensors/:sensorDataId')
  async deleteSensorDataById(@Param('sensorDataId') id: string): Promise<void> {
    return this.sensorsService.deleteSensorDataById(id);
  }

  @ApiOperation({ summary: 'update sensor data by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sensor data successfully updated',
    type: SensorDataResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Patch('sensors/:sensorDataId')
  async updateSensorData(
    @Param('sensorDataId') id: string,
    @Body() updateSensorDataDto: UpdateSensorDataDto,
  ): Promise<SensorDataResponseDto> {
    return this.sensorsService.updateSensorDataById(id, updateSensorDataDto);
  }
}
