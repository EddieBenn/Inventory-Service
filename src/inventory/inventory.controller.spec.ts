import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { FileUploadService } from 'src/utils/cloudinary';
import {
  CreateInventoryDto,
  InventoryFilter,
} from './dto/create-inventory.dto';
import { Item } from './schemas/item.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { buildInventoryFilter } from 'src/common/filters/query.filter';

jest.mock('../common/filters/query.filter', () => ({
  buildInventoryFilter: jest.fn(),
}));

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: DeepMocked<InventoryService>;
  let fileService: DeepMocked<FileUploadService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: createMock<InventoryService>(),
        },
        {
          provide: FileUploadService,
          useValue: createMock<FileUploadService>(),
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get(InventoryService);
    fileService = module.get(FileUploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('fileService should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('createInventory', () => {
    const mockInventoryPayload = new CreateInventoryDto();
    const mockExpectedResponse = new Item();

    const mockFileUploadResponse = {
      secure_url: 'https://www.photourl.com',
      message: 'Here is yout image url',
      name: 'Image Url',
      http_code: 201,
      url: 'https://www.photourl.com',
    };

    const file = {
      originalname: 'profile.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test-image'),
      size: 1024,
    } as Express.Multer.File;

    it('should create inventory', async () => {
      jest
        .spyOn(service, 'createInventory')
        .mockResolvedValue(mockExpectedResponse);
      jest
        .spyOn(fileService, 'uploadFile')
        .mockResolvedValue(mockFileUploadResponse);

      const createdInventory = await controller.createInventory(
        mockInventoryPayload,
        file,
      );

      expect(createdInventory).toEqual(mockExpectedResponse);
      expect(service.createInventory).toHaveBeenCalledTimes(1);
    });

    it('should throw error if no correct inventory payload', async () => {
      mockInventoryPayload.name = '';
      mockInventoryPayload.description = '';

      jest
        .spyOn(service, 'createInventory')
        .mockRejectedValue(
          new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
        );

      try {
        await controller.createInventory(mockInventoryPayload, file);
      } catch (error) {
        expect(error.message).toBe('Bad Request');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('getAllInventories', () => {
    const mockItem = {
      name: 'Sunglasses',
      description: 'Stylish sunglasses',
      image: 'image_url',
      price: 1000,
      inStock: true,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: 'some_id',
      __v: 0,
    };

    const mockQueryParams: InventoryFilter = {
      page: 1,
      size: 10,
      name: 'Sunglasses',
      price: 1000,
      inStock: true,
      stock: 20,
    };

    const expectedResult = {
      inventories: [mockItem as any],
      pagination: {
        totalRows: 30,
        perPage: 10,
        currentPage: 1,
        totalPages: Math.ceil(30 / 10),
        hasNextPage: 1 < Math.ceil(30 / 10),
      },
    };

    it('should return all inventories with pagination', async () => {
      (buildInventoryFilter as jest.Mock).mockResolvedValue(mockQueryParams);

      jest
        .spyOn(service, 'getAllInventories')
        .mockResolvedValue(expectedResult);

      const allTransactions =
        await controller.getAllInventories(mockQueryParams);

      expect(allTransactions).toEqual(expectedResult);
      expect(service.getAllInventories).toHaveBeenCalledWith(mockQueryParams);
    });

    it('should throw error on failure', async () => {
      mockQueryParams.page = -1;
      mockQueryParams.size = 2;

      jest
        .spyOn(service, 'getAllInventories')
        .mockRejectedValue(
          new HttpException(
            'Invalid query parameters',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.getAllInventories(mockQueryParams);
      } catch (error) {
        expect(error.message).toBe('Invalid query parameters');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getInventoryById', () => {
    const itemId = '6750c908ac3253143a7c8d35';

    it('should get one inventory', async () => {
      const inventory = new Item();
      jest.spyOn(service, 'getInventoryById').mockResolvedValue(inventory);

      const getInventory = await controller.getInventoryById(itemId);

      expect(getInventory).toEqual(inventory);
      expect(service.getInventoryById).toHaveBeenCalledWith(itemId);
    });

    it('should throw error if inventory not found', async () => {
      jest
        .spyOn(service, 'getInventoryById')
        .mockRejectedValue(
          new HttpException(
            `inventory with id: ${itemId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.getInventoryById(itemId);
      } catch (error) {
        expect(error.message).toBe(`inventory with id: ${itemId} not found`);
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('deleteInventoryById', () => {
    const itemId = '6750c908ac3253143a7c8d35';

    it('should delete the inventory by id', async () => {
      const mockMessage = {
        message: `Inventory with id: ${itemId} successfully deleted`,
      };

      jest.spyOn(service, 'deleteInventoryById').mockResolvedValue(mockMessage);

      const result = await controller.deleteInventoryById(itemId);

      expect(result).toEqual(mockMessage);
      expect(service.deleteInventoryById).toHaveBeenCalledWith(itemId);
    });

    it('should throw an error if inventory not found', async () => {
      jest
        .spyOn(service, 'deleteInventoryById')
        .mockRejectedValue(
          new HttpException(
            `Inventory with id: ${itemId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.deleteInventoryById(itemId);
      } catch (error) {
        expect(error.message).toBe(`Inventory with id: ${itemId} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('updateInventoryById', () => {
    const itemId = '6750c908ac3253143a7c8d35';
    const updateData = new Item();

    it('should update and return the inventory', async () => {
      jest.spyOn(service, 'updateInventoryById').mockResolvedValue(updateData);

      const result = await controller.updateInventoryById(itemId, updateData);

      expect(result).toEqual(updateData);
      expect(service.updateInventoryById).toHaveBeenCalledWith(
        itemId,
        updateData,
      );
    });

    it('should throw an error if inventory not found', async () => {
      jest
        .spyOn(service, 'updateInventoryById')
        .mockRejectedValue(
          new HttpException(
            `Inventory with id: ${itemId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.updateInventoryById(itemId, updateData);
      } catch (error) {
        expect(error.message).toBe(`Inventory with id: ${itemId} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('checkStockAvailability', () => {
    const itemId = '6750c908ac3253143a7c8d35';
    const quantity = 5;

    it('should return true if stock is available', async () => {
      jest.spyOn(service, 'checkStockAvailability').mockResolvedValue(true);
      const result = await controller.checkStockAvailability(itemId, quantity);

      expect(result).toEqual({ isAvailable: true });
      expect(service.checkStockAvailability).toHaveBeenCalledWith(
        itemId,
        quantity,
      );
    });

    it('should return false if stock is not available', async () => {
      jest.spyOn(service, 'checkStockAvailability').mockResolvedValue(false);
      const result = await controller.checkStockAvailability(itemId, quantity);

      expect(result).toEqual({ isAvailable: false });
      expect(service.checkStockAvailability).toHaveBeenCalledWith(
        itemId,
        quantity,
      );
    });

    it('should throw an error if item is not found', async () => {
      jest
        .spyOn(service, 'checkStockAvailability')
        .mockRejectedValue(
          new HttpException(
            `Item with id: ${itemId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.checkStockAvailability(itemId, quantity);
      } catch (error) {
        expect(error.message).toBe(`Item with id: ${itemId} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }

      expect(service.checkStockAvailability).toHaveBeenCalledWith(
        itemId,
        quantity,
      );
    });
  });

  describe('deductStock', () => {
    const itemId = '6750c908ac3253143a7c8d35';
    const quantity = 3;
    const mockExpectedResponse = new Item();

    it('should deduct stock and return the updated item', async () => {
      jest
        .spyOn(service, 'deductStock')
        .mockResolvedValue(mockExpectedResponse);

      const result = await controller.deductStock(itemId, quantity);

      expect(result).toEqual(mockExpectedResponse);
      expect(service.deductStock).toHaveBeenCalledWith(itemId, quantity);
    });

    it('should throw an error if the item is not found', async () => {
      jest
        .spyOn(service, 'deductStock')
        .mockRejectedValue(
          new HttpException(
            `Item with id: ${itemId} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.deductStock(itemId, quantity);
      } catch (error) {
        expect(error.message).toBe(`Item with id: ${itemId} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }

      expect(service.deductStock).toHaveBeenCalledWith(itemId, quantity);
    });

    it('should throw an error if there is insufficient stock', async () => {
      jest
        .spyOn(service, 'deductStock')
        .mockRejectedValue(
          new HttpException(
            `Insufficient stock for item with id: ${itemId}`,
            HttpStatus.BAD_REQUEST,
          ),
        );

      try {
        await controller.deductStock(itemId, quantity);
      } catch (error) {
        expect(error.message).toBe(
          `Insufficient stock for item with id: ${itemId}`,
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }

      expect(service.deductStock).toHaveBeenCalledWith(itemId, quantity);
    });
  });
});
