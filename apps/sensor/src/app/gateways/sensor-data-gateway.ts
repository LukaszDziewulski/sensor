import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Server, WebSocket } from 'ws';
import { AddSensorDataDto } from '../dtos';
import { SensorDataService } from '../sensor-data.service';

@WebSocketGateway()
export class SensorDataGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sensorDataService: SensorDataService) {}

  @SubscribeMessage('sensor_data')
  async handleSensorData(
    @MessageBody() createSensorDataDto: AddSensorDataDto,
    @ConnectedSocket() client: WebSocket,
  ) {
    const dtoInstance = plainToInstance(AddSensorDataDto, createSensorDataDto);

    if (!(await this.validateSensorData(dtoInstance, client))) {
      return;
    }

    await this.sensorDataService.addSensorData(dtoInstance);
    this.server.emit('new_sensor_data', dtoInstance);
    client.send(
      JSON.stringify({
        event: 'sensor_data_added',
        data: {
          message: 'Sensor data added successfully',
          receivedData: dtoInstance,
        },
      }),
    );
  }

  private async validateSensorData(
    dtoInstance: AddSensorDataDto,
    client: WebSocket,
  ): Promise<boolean> {
    try {
      await validateOrReject(dtoInstance);
      return true;
    } catch (errors) {
      client.send(
        JSON.stringify({
          event: 'sensor_data_error',
          data: {
            message: 'Invalid data received',
            errors,
          },
        }),
      );
      return false;
    }
  }
}
