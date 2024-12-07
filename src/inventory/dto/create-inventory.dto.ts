import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    example: 'unisex black glasses',
    description: 'The name of the item',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'most comfortable black glasses for both genders',
    description: 'Brief summary of the item',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image url of the item',
  })
  image: string;

  @ApiProperty({
    example: 1000,
    description: 'The price of the item',
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @ApiProperty({ example: true, description: 'Availability check for item' })
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  inStock: boolean;

  @ApiProperty({
    example: 10,
    description: 'The number of an item available',
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  stock: number;
}

export interface InventoryFilter {
  name?: string;
  price?: number;
  inStock?: boolean;
  stock?: number;
  startDate?: string;
  endDate?: string;
  size?: number;
  page?: number;
}
