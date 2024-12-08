import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { FileUploadService } from 'src/utils/cloudinary';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        exchanges: [{ name: 'inventory_exchange', type: 'topic' }],
        uri: configService.get('RABBITMQ_URI'),
        connectionInitOptions: { wait: true, timeout: 20000 },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, ConfigService, FileUploadService],
})
export class InventoryModule {}
