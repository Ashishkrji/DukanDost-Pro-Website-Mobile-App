import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
  name: string;
  location: string;
  isMain: boolean;
  shopId: mongoose.Types.ObjectId;
}

const WarehouseSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String },
  isMain: { type: Boolean, default: false },
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true }
}, { timestamps: true });

export default mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
