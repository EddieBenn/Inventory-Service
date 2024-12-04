import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: true })
  inStock: boolean;

  @Prop({ required: true, default: 0 })
  stock: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
