import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  memberId: mongoose.Types.ObjectId;
  memberName: string;
  amount: number;
  month: string;
  year: string;
  note?: string;
  paidAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    memberName: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    note: { type: String },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Donation =
  mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema);
