import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { SensorDataResponseDto } from './dtos';
import { SensorErrors } from './error-codes';
import { SensorData } from './interface';
import { DbSensorRepository } from './repository';
import { SensorDataService } from './sensor-data.service';

describe('SensorDataService', () => {
  let service: SensorDataService;
  let mockDbSensorRepository: jest.Mocked<Partial<DbSensorRepository>>;
  let mockLoggerError: jest.SpyInstance;

  const mockSensorData = {
    temperature: 25,
    humidity: 60,
    createdAt: '2021-01-01T00:00:00Z',
  } as SensorData;

  const validObjectId = new Types.ObjectId().toHexString();

  beforeEach(async () => {
    mockDbSensorRepository = {
      createSensorData: jest.fn(),
      findAllSensorData: jest.fn(),
      findSensorDataById: jest.fn(),
      updateSensorDataById: jest.fn(),
      removeSensorDataById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorDataService,
        { provide: DbSensorRepository, useValue: mockDbSensorRepository },
      ],
    }).compile();

    service = module.get<SensorDataService>(SensorDataService);
    mockLoggerError = jest
      .spyOn(service['logger'], 'error')
      .mockImplementation(jest.fn());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addSensorData', () => {
    it('should add sensor data successfully', async () => {
      mockDbSensorRepository.createSensorData.mockResolvedValue(mockSensorData);

      const result = await service.addSensorData({
        temperature: 25,
        humidity: 60,
      });

      expect(result).toEqual(SensorDataResponseDto.createFrom(mockSensorData));
      expect(mockDbSensorRepository.createSensorData).toHaveBeenCalledWith({
        temperature: 25,
        humidity: 60,
      });
    });
  });

  describe('getAllSensorsData', () => {
    it('should return all sensors data', async () => {
      mockDbSensorRepository.findAllSensorData.mockResolvedValue([
        mockSensorData,
      ]);

      const result = await service.getAllSensorsData();

      expect(result).toEqual(
        SensorDataResponseDto.createFromArray([mockSensorData]),
      );
      expect(mockDbSensorRepository.findAllSensorData).toHaveBeenCalled();
    });
  });

  describe('getSensorDataById', () => {
    it('should return sensor data by id', async () => {
      mockDbSensorRepository.findSensorDataById.mockResolvedValue(
        mockSensorData,
      );

      const result = await service.getSensorDataById(validObjectId);

      expect(result).toEqual(SensorDataResponseDto.createFrom(mockSensorData));
      expect(mockDbSensorRepository.findSensorDataById).toHaveBeenCalledWith(
        validObjectId,
      );
    });

    it('should throw error if sensor data not found', async () => {
      mockDbSensorRepository.findSensorDataById.mockResolvedValue(null);

      await expect(service.getSensorDataById('1')).rejects.toThrow(
        new HttpException(
          SensorErrors.SENSOR_DATA_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('updateSensorDataById', () => {
    it('should update sensor data successfully', async () => {
      mockDbSensorRepository.findSensorDataById.mockResolvedValue(
        mockSensorData,
      );
      mockDbSensorRepository.updateSensorDataById.mockResolvedValue(
        mockSensorData,
      );

      const result = await service.updateSensorDataById(validObjectId, {
        temperature: 30,
        humidity: 70,
      });

      expect(result).toEqual(SensorDataResponseDto.createFrom(mockSensorData));
      expect(mockDbSensorRepository.updateSensorDataById).toHaveBeenCalledWith(
        validObjectId,
        { temperature: 30, humidity: 70 },
      );
    });

    it('should throw error if sensor data not found during update', async () => {
      mockDbSensorRepository.findSensorDataById.mockResolvedValue(null);

      await expect(
        service.updateSensorDataById('1', { temperature: 30, humidity: 70 }),
      ).rejects.toThrow(
        new HttpException(
          SensorErrors.SENSOR_DATA_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw error if update fails', async () => {
      mockDbSensorRepository.findSensorDataById.mockResolvedValue(
        mockSensorData,
      );
      mockDbSensorRepository.updateSensorDataById.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(
        service.updateSensorDataById(validObjectId, {
          temperature: 30,
          humidity: 70,
        }),
      ).rejects.toThrow(
        new HttpException(
          SensorErrors.SENSOR_DATA_UPDATE_FAILED,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(mockLoggerError).toHaveBeenCalledWith(
        'Failed to update sensor data: Update failed',
      );
    });
  });

  describe('deleteSensorDataById', () => {
    it('should delete sensor data successfully', async () => {
      mockDbSensorRepository.findSensorDataById.mockResolvedValue(
        mockSensorData,
      );
      mockDbSensorRepository.removeSensorDataById.mockResolvedValue(undefined);

      await service.deleteSensorDataById(validObjectId);

      expect(mockDbSensorRepository.removeSensorDataById).toHaveBeenCalledWith(
        validObjectId,
      );
    });

    it('should throw error if sensor data not found during delete', async () => {
      mockDbSensorRepository.findSensorDataById.mockResolvedValue(null);

      await expect(service.deleteSensorDataById('1')).rejects.toThrow(
        new HttpException(
          SensorErrors.SENSOR_DATA_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw error if delete fails', async () => {
      mockDbSensorRepository.findSensorDataById.mockResolvedValue(
        mockSensorData,
      );
      mockDbSensorRepository.removeSensorDataById.mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(service.deleteSensorDataById(validObjectId)).rejects.toThrow(
        new HttpException(
          SensorErrors.SENSOR_DATA_DELETE_FAILED,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(mockLoggerError).toHaveBeenCalledWith(
        'Failed to delete sensor data: Delete failed',
      );
    });
  });
});
