import { HttpException, HttpStatus } from '@nestjs/common';
import { InventoryFilter } from 'src/inventory/dto/create-inventory.dto';

export const buildInventoryFilter = async (queryParams: InventoryFilter) => {
  const query: Record<string, any> = {};

  if (queryParams?.name) query['name'] = queryParams.name.toLowerCase();
  if (queryParams?.price) query['price'] = queryParams.price;
  if (queryParams?.inStock) query['inStock'] = queryParams.inStock;
  if (queryParams?.stock) query['stock'] = queryParams.stock;

  if (queryParams?.startDate && queryParams?.endDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.startDate)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['createdAt'] = {};
    if (queryParams.startDate) {
      query['createdAt'].$gte = new Date(queryParams.startDate);
    }
    if (queryParams.endDate) {
      query['createdAt'].$lte = new Date(queryParams.endDate);
    }
  }
  return query;
};
