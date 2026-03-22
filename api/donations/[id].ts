import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../_lib/mongodb";
import { Donation } from "../_lib/Donation";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "DELETE") {
    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    return res.status(200).json({ success: true, message: "Donation deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
