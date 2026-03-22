import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./_lib/mongodb";
import { Member } from "./_lib/Member";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  if (req.method === "GET") {
    const members = await Member.find().sort({ name: 1 });
    return res.status(200).json(members);
  }

  if (req.method === "POST") {
    const { name, phone, address, monthlyAmount, isActive } = req.body;
    const member = new Member({ name, phone, address, monthlyAmount: monthlyAmount ?? 0, isActive: isActive ?? true });
    await member.save();
    return res.status(201).json(member);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
