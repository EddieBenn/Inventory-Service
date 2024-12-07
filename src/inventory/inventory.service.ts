import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateInventoryDto,
  InventoryFilter,
} from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { Model } from 'mongoose';
import { buildInventoryFilter } from 'src/common/filters/query.filter';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async createInventory(body: CreateInventoryDto): Promise<Item> {
    const createdItem = new this.itemModel(body);
    const savedItem = await createdItem.save();
    await this.amqpConnection.publish('inventory_exchange', 'stock.created', {
      id: savedItem.id,
      name: savedItem.name,
      stock: savedItem.stock,
    });

    return savedItem;
  }

  async checkStockAvailability(
    itemId: string,
    quantity: number,
  ): Promise<boolean> {
    const item = await this.itemModel.findById(itemId).exec();
    if (!item) {
      throw new HttpException(
        `Item with id: ${itemId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (item.stock >= Number(quantity)) {
      return true;
    } else {
      return false;
    }
  }

  async deductStock(itemId: string, quantity: number): Promise<Item> {
    const item = await this.itemModel.findById(itemId).exec();

    if (!item) {
      throw new HttpException(
        `Item with id: ${itemId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (item.stock < Number(quantity)) {
      throw new HttpException(
        `Insufficient stock for item with id: ${itemId}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    item.stock -= Number(quantity);
    return await item.save();
  }

  async getAllInventories(queryParams?: InventoryFilter) {
    const page = queryParams?.page ? Number(queryParams.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const skip = (page - 1) * size;
    const query = await buildInventoryFilter(queryParams);

    const inventories = await this.itemModel
      .find(query)
      .skip(skip)
      .limit(size)
      .sort({ createdAt: -1 });
    const count = await this.itemModel.countDocuments(query);

    const totalPages = Math.ceil(count / size);

    return {
      inventories,
      pagination: {
        totalRows: count,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getInventoryById(id: string): Promise<Item> {
    const inventory = await this.itemModel.findById(id).exec();
    if (!inventory?.id) {
      throw new HttpException(
        `inventory with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return inventory;
  }

  async updateInventoryById(
    id: string,
    data: UpdateInventoryDto,
  ): Promise<Item> {
    const updatedInventory = await this.itemModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();

    if (!updatedInventory) {
      throw new HttpException(
        `Inventory with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.amqpConnection.publish('inventory_exchange', 'stock.updated', {
      id: updatedInventory.id,
      name: updatedInventory.name,
      stock: updatedInventory.stock,
    });

    return updatedInventory;
  }

  async deleteInventoryById(id: string): Promise<{ message: string }> {
    const inventory = await this.itemModel.findByIdAndDelete(id).exec();
    if (!inventory) {
      throw new HttpException(
        `Inventory with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: `Inventory with id: ${id} successfully deleted` };
  }
}
