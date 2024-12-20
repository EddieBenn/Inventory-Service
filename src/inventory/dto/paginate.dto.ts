import { ApiProperty } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventory.dto';

export class PaginationMetadataDto {
  @ApiProperty({
    example: 100,
    description: 'The total number of inventories',
  })
  totalRows: number;

  @ApiProperty({
    example: 10,
    description: 'Number of inventories per page',
  })
  perPage: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if there is a next page',
  })
  hasNextPage: boolean;
}

export class PaginationResponseDto {
  @ApiProperty({
    type: [CreateInventoryDto],
    description: 'Array of inventory objects',
  })
  inventory: CreateInventoryDto[];

  @ApiProperty({
    type: PaginationMetadataDto,
    description: 'Pagination metadata',
  })
  pagination: PaginationMetadataDto;
}
