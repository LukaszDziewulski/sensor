import { Test, TestingModule } from '@nestjs/testing';
import { Server, WebSocket } from 'ws';
import { AddSensorDataDto } from '../dtos';
import { SensorDataService } from '../sensor-data.service';
import { SensorDataGateway } from './sensor-data-gateway';

jest.mock('ws');

describe('SensorDataGateway', () => {
  let gateway: SensorDataGateway;
  let sensorDataService: SensorDataService;
  let mockServer: Server;
  let mockWebSocket: WebSocket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorDataGateway,
        {
          provide: SensorDataService,
          useValue: {
            addSensorData: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<SensorDataGateway>(SensorDataGateway);
    sensorDataService = module.get<SensorDataService>(SensorDataService);
    mockServer = new Server();
    mockWebSocket = new WebSocket('ws://localhost');
    gateway.server = mockServer;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle valid sensor data correctly', async () => {
    const dto = new AddSensorDataDto();
    dto.temperature = 25;
    dto.humidity = 50;

    jest.spyOn(sensorDataService, 'addSensorData').mockResolvedValue({
      id: '123',
      temperature: 25,
      humidity: 50,
      createdAt: new Date().toISOString(),
    });

    const clientSendSpy = jest.spyOn(mockWebSocket, 'send');
    const serverEmitSpy = jest.spyOn(mockServer, 'emit');

    await gateway.handleSensorData(dto, mockWebSocket);

    expect(sensorDataService.addSensorData).toHaveBeenCalledWith(dto);
    expect(serverEmitSpy).toHaveBeenCalledWith('new_sensor_data', dto);
    expect(clientSendSpy).toHaveBeenCalledWith(expect.any(String));
  });

  it('should handle invalid sensor data and send an error message', async () => {
    const dto = new AddSensorDataDto();
    dto.temperature = -101;
    dto.humidity = 101;

    const clientSendSpy = jest.spyOn(mockWebSocket, 'send');

    await gateway.handleSensorData(dto, mockWebSocket);

    expect(clientSendSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid data received'),
    );
  });

  it('should handle missing temperature data and send an error message', async () => {
    const dto = new AddSensorDataDto();
    dto.humidity = 50;

    const clientSendSpy = jest.spyOn(mockWebSocket, 'send');

    await gateway.handleSensorData(dto, mockWebSocket);

    expect(clientSendSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid data received'),
    );
  });

  it('should handle missing humidity data and send an error message', async () => {
    const dto = new AddSensorDataDto();

    const clientSendSpy = jest.spyOn(mockWebSocket, 'send');

    await gateway.handleSensorData(dto, mockWebSocket);

    expect(clientSendSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid data received'),
    );
  });

  it('should emit the correct event when data is successfully added', async () => {
    const dto = new AddSensorDataDto();
    dto.temperature = 22;
    dto.humidity = 60;

    const clientSendSpy = jest.spyOn(mockWebSocket, 'send');
    const serverEmitSpy = jest.spyOn(mockServer, 'emit');

    await gateway.handleSensorData(dto, mockWebSocket);

    expect(serverEmitSpy).toHaveBeenCalledWith('new_sensor_data', dto);
    expect(clientSendSpy).toHaveBeenCalledWith(
      expect.stringContaining('sensor_data_added'),
    );
  });
});
