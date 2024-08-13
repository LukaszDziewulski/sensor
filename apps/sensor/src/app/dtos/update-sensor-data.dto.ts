import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateSensorDataDto {
  @IsNumber()
  @Min(-100)
  @Max(1000)
  @ApiProperty({ example: 25 })
  temperature: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    example: 60,
  })
  humidity: number;
}
