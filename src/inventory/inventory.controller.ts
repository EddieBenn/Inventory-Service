import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateInventoryDto,
  InventoryFilter,
} from './dto/create-inventory.dto';
import {
  UpdateInventoryDto,
  UpdateInventoryResponseDto,
} from './dto/update-inventory.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadService } from 'src/utils/cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationResponseDto } from './dto/paginate.dto';
import { ResponseMessage } from 'src/common/interceptors/response.decorator';
@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @ApiOperation({ summary: 'Create Inventory' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiCreatedResponse({ type: CreateInventoryDto })
  @ApiBadRequestResponse()
  @ApiConsumes('multipart/form-data')
  @ResponseMessage('Inventory successfully created')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createInventory(
    @Body() body: CreateInventoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new HttpException(`Image not found`, HttpStatus.NOT_FOUND);
      }
      const uploadedPhoto = await this.fileUploadService.uploadFile(file);
      if (uploadedPhoto) {
        body.image = uploadedPhoto.secure_url;
      }

      return this.inventoryService.createInventory(body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Check Stock Availability' })
  @ApiOkResponse({ description: 'Stock availability status returned' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  @ApiBadRequestResponse()
  @ResponseMessage('Stock check successful')
  @Get('check-stock/:id')
  async checkStockAvailability(
    @Param('id') id: string,
    @Query('quantity') quantity: number,
  ) {
    try {
      const isAvailable = await this.inventoryService.checkStockAvailability(
        id,
        quantity,
      );
      return { isAvailable };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Deduct Stock from Inventory' })
  @ApiOkResponse({ description: 'Stock successfully deducted' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  @ApiBadRequestResponse({ description: 'Insufficient stock' })
  @ResponseMessage('Stock deduction successful')
  @Put('deduct-stock/:id')
  async deductStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    try {
      return this.inventoryService.deductStock(id, quantity);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get All Inventories' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'price', required: false, type: Number })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  @ApiQuery({ name: 'stock', required: false, type: Number })
  @ApiOkResponse({
    type: PaginationResponseDto,
    description: 'Paginated list of inventories',
  })
  @ApiBadRequestResponse()
  @ResponseMessage('All inventories successfully fetched')
  @Get()
  async getAllInventories(@Query() query?: InventoryFilter) {
    try {
      return this.inventoryService.getAllInventories(query);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One Inventory' })
  @ApiOkResponse({
    type: CreateInventoryDto,
    description: 'Inventory successfully fetched',
  })
  @ApiNotFoundResponse({ description: 'Inventory not found' })
  @ApiBadRequestResponse()
  @ResponseMessage('Inventory successfully fetched')
  @Get(':id')
  async getInventoryById(@Param('id') id: string) {
    try {
      return this.inventoryService.getInventoryById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update Inventory' })
  @ApiBody({ type: UpdateInventoryResponseDto })
  @ApiOkResponse({ description: 'Inventory successfully updated' })
  @ApiBadRequestResponse()
  @ResponseMessage('Inventory successfully updated')
  @Put(':id')
  updateInventoryById(
    @Param('id') id: string,
    @Body() body: UpdateInventoryDto,
  ) {
    try {
      return this.inventoryService.updateInventoryById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Inventory' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('Inventory successfully deleted')
  @Delete(':id')
  deleteInventoryById(@Param('id') id: string) {
    try {
      return this.inventoryService.deleteInventoryById(id);
    } catch (error) {
      throw error;
    }
  }
}
