import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./_lib/mongodb";
import { Donation } from "./_lib/Donation";
import { Member } from "./_lib/Member";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  if (req.method === "GET") {
    const { memberId, month, year } = req.query;
    const filter: Record<string, unknown> = {};
    if (memberId) filter.memberId = memberId;
    if (month) filter.month = month;
    if (year) filter.year = year;
    const donations = await Donation.find(filter).sort({ paidAt: -1 });
    return res.status(200).json(donations);
  }

  if (req.method === "POST") {
    const { memberId, amount, month, year, note } = req.body;
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ error: "Member not found" });
    const donation = new Donation({ memberId, memberName: member.name, amount, month, year, note, paidAt: new Date() });
    await donation.save();
    return res.status(201).json(donation);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
