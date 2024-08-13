import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AddSensorDataDto {
  @IsNumber()
  @Min(-100)
  @Max(1000)
  @IsNotEmpty({ message: 'Temperature is required' })
  @ApiProperty({ example: 25, required: true })
  temperature: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty({ message: 'Humidity is required' })
  @ApiProperty({
    example: 60,
    required: true,
  })
  humidity: number;
}
