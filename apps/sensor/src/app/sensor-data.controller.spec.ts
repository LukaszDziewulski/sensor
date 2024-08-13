import { Test, TestingModule } from '@nestjs/testing';
import { AddSensorDataDto, UpdateSensorDataDto } from './dtos';
import { SensorDataResponseDto } from './dtos/sensor-data-response.dto';
import { SensorDataController } from './sensor-data.controller';
import { SensorDataService } from './sensor-data.service';

describe('SensorDataController', () => {
  let controller: SensorDataController;
  let mockSensorDataService: jest.Mocked<Partial<SensorDataService>>;

  const mockAddSensorDataDto: AddSensorDataDto = {
    temperature: 25,
    humidity: 60,
  };

  const mockSensorDataResponseDto: SensorDataResponseDto = {
    id: '1',
    temperature: 25,
    humidity: 60,
    createdAt: '2021-01-01T00:00:00Z',
  };

  const mockUpdateSensorDataDto: UpdateSensorDataDto = {
    temperature: 46,
    humidity: 80,
  };

  beforeEach(async () => {
    mockSensorDataService = {
      addSensorData: jest.fn(),
      getSensorDataById: jest.fn(),
      getAllSensorsData: jest.fn(),
      updateSensorDataById: jest.fn(),
      deleteSensorDataById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorDataController],
      providers: [
        {
          provide: SensorDataService,
          useValue: mockSensorDataService,
        },
      ],
    }).compile();

    controller = module.get<SensorDataController>(SensorDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addSensorData', () => {
    it('should add new sensor data', async () => {
      mockSensorDataService.addSensorData.mockResolvedValue(
        mockSensorDataResponseDto,
      );

      const result = await controller.addSensorData(mockAddSensorDataDto);

      expect(result).toEqual(mockSensorDataResponseDto);
      expect(mockSensorDataService.addSensorData).toHaveBeenCalledWith(
        mockAddSensorDataDto,
      );
    });

    it('should handle errors when adding sensor data fails', async () => {
      const error = new Error('Failed to add sensor data');
      mockSensorDataService.addSensorData.mockRejectedValue(error);

      await expect(
        controller.addSensorData(mockAddSensorDataDto),
      ).rejects.toThrow('Failed to add sensor data');
      expect(mockSensorDataService.addSensorData).toHaveBeenCalledWith(
        mockAddSensorDataDto,
      );
    });
  });

  describe('getSensorDataById', () => {
    it('should return sensor data by id', async () => {
      mockSensorDataService.getSensorDataById.mockResolvedValue(
        mockSensorDataResponseDto,
      );

      const result = await controller.getSensorDataById('1');

      expect(result).toEqual(mockSensorDataResponseDto);
      expect(mockSensorDataService.getSensorDataById).toHaveBeenCalledWith('1');
    });

    it('should handle errors when fetching sensor data by id fails', async () => {
      const error = new Error('Sensor data not found');
      mockSensorDataService.getSensorDataById.mockRejectedValue(error);

      await expect(controller.getSensorDataById('1')).rejects.toThrow(
        'Sensor data not found',
      );
      expect(mockSensorDataService.getSensorDataById).toHaveBeenCalledWith('1');
    });
  });

  describe('getAllSensorsData', () => {
    it('should return all sensor data', async () => {
      mockSensorDataService.getAllSensorsData.mockResolvedValue([
        mockSensorDataResponseDto,
      ]);

      const result = await controller.getAllSensorsData();

      expect(result).toEqual([mockSensorDataResponseDto]);
      expect(mockSensorDataService.getAllSensorsData).toHaveBeenCalled();
    });

    it('should handle errors when fetching all sensor data fails', async () => {
      const error = new Error('Failed to fetch all sensor data');
      mockSensorDataService.getAllSensorsData.mockRejectedValue(error);

      await expect(controller.getAllSensorsData()).rejects.toThrow(
        'Failed to fetch all sensor data',
      );
      expect(mockSensorDataService.getAllSensorsData).toHaveBeenCalled();
    });
  });

  describe('updateSensorData', () => {
    it('should update sensor data by id', async () => {
      mockSensorDataResponseDto.temperature = 46;
      mockSensorDataResponseDto.humidity = 80;
      mockSensorDataService.updateSensorDataById.mockResolvedValue(
        mockSensorDataResponseDto,
      );

      const result = await controller.updateSensorData(
        '1',
        mockUpdateSensorDataDto,
      );

      expect(result).toEqual(mockSensorDataResponseDto);
      expect(mockSensorDataService.updateSensorDataById).toHaveBeenCalledWith(
        '1',
        mockUpdateSensorDataDto,
      );
    });

    it('should handle errors when updating sensor data fails', async () => {
      const error = new Error('Failed to update sensor data');
      mockSensorDataService.updateSensorDataById.mockRejectedValue(error);

      await expect(
        controller.updateSensorData('1', mockUpdateSensorDataDto),
      ).rejects.toThrow('Failed to update sensor data');
      expect(mockSensorDataService.updateSensorDataById).toHaveBeenCalledWith(
        '1',
        mockUpdateSensorDataDto,
      );
    });
  });

  describe('deleteSensorDataById', () => {
    it('should delete sensor data by id', async () => {
      const result = await controller.deleteSensorDataById('1');

      expect(result).toBeUndefined();
      expect(mockSensorDataService.deleteSensorDataById).toHaveBeenCalledWith(
        '1',
      );
    });

    it('should handle errors when deleting sensor data fails', async () => {
      const error = new Error('Failed to delete sensor data');
      mockSensorDataService.deleteSensorDataById.mockRejectedValue(error);

      await expect(controller.deleteSensorDataById('1')).rejects.toThrow(
        'Failed to delete sensor data',
      );
      expect(mockSensorDataService.deleteSensorDataById).toHaveBeenCalledWith(
        '1',
      );
    });
  });
});
