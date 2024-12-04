import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}

export class UpdateInventoryResponseDto {
  @ApiProperty({
    example: 'unisex black glasses',
    description: 'The name of the item',
  })
  name: string;

  @ApiProperty({
    example: 'most comfortable black glasses for both genders',
    description: 'Brief summary of the item',
  })
  description: string;

  @ApiProperty({
    example: 'https://www.image.com',
    description: 'Image url of the item',
  })
  image: string;

  @ApiProperty({
    example: 1000,
    description: 'The price of the item',
  })
  price: number;

  @ApiProperty({ example: true, description: 'Availability check for item' })
  inStock: boolean;

  @ApiProperty({
    example: 10,
    description: 'The number of an item available',
  })
  stock: number;
}
