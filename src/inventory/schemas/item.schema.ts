import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
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

  createdAt: Date;

  updatedAt: Date;
}
export const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
