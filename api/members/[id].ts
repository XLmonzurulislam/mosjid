import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../_lib/mongodb";
import { Member } from "../_lib/Member";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    return res.status(200).json(member);
  }

  if (req.method === "PUT") {
    const { name, phone, address, monthlyAmount, isActive } = req.body;
    const member = await Member.findByIdAndUpdate(id, { name, phone, address, monthlyAmount, isActive }, { new: true });
    if (!member) return res.status(404).json({ error: "Member not found" });
    return res.status(200).json(member);
  }

  if (req.method === "DELETE") {
    const member = await Member.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    return res.status(200).json({ success: true, message: "Member deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
