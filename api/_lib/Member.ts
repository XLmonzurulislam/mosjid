import mongoose, { Schema, Document } from "mongoose";

export interface IMember extends Document {
  name: string;
  phone?: string;
  address?: string;
  monthlyAmount: number;
  isActive: boolean;
  createdAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    monthlyAmount: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Member = mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);
