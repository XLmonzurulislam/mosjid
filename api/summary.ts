import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./_lib/mongodb";
import { Member } from "./_lib/Member";
import { Donation } from "./_lib/Donation";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const { month, year } = req.query;
  const now = new Date();
  const targetMonth = (month as string) || String(now.getMonth() + 1).padStart(2, "0");
  const targetYear = (year as string) || String(now.getFullYear());

  const allMembers = await Member.find({ isActive: true });
  const donations = await Donation.find({ month: targetMonth, year: targetYear });

  const paidMemberIds = new Set(donations.map((d) => d.memberId.toString()));
  const totalCollected = donations.reduce((sum, d) => sum + d.amount, 0);
  const paidCount = paidMemberIds.size;
  const unpaidCount = allMembers.length - paidCount;
  const expectedTotal = allMembers.reduce((sum, m) => sum + m.monthlyAmount, 0);
  const totalDue = expectedTotal - totalCollected;

  return res.status(200).json({
    totalMembers: allMembers.length,
    totalCollected,
    totalDue: Math.max(0, totalDue),
    paidCount,
    unpaidCount: Math.max(0, unpaidCount),
    month: targetMonth,
    year: targetYear,
  });
}
