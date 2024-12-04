import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    example: 'unisex black glasses',
    description: 'The name of the item',
  })
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
    example: 'https://www.image.com',
    description: 'Image url of the item',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    example: 1000,
    description: 'The price of the item',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: true, description: 'Availability check for item' })
  @IsNotEmpty()
  @IsString()
  inStock: boolean;

  @ApiProperty({
    example: 10,
    description: 'The number of an item available',
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}

export interface InventoryFilter {
  name?: string;
  price?: string;
  inStock?: boolean;
  stock?: string;
  start_date?: string;
  end_date?: string;
  size?: number;
  page?: number;
}
