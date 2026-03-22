import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  useGetMembers,
  useGetDonations,
  useCreateDonation,
  useDeleteDonation,
  getGetDonationsQueryKey,
  getGetSummaryQueryKey
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BENGALI_MONTHS, getCurrentBengaliMonth, getCurrentYear, formatCurrency, toBengaliNumber } from "@/lib/utils";
import { CheckCircle2, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageDonations() {
  const { isAdmin, isChecking } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentBengaliMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [search, setSearch] = useState("");
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (!isChecking && !isAdmin) setLocation("/admin/login");
  }, [isAdmin, isChecking, setLocation]);

  const { data: members, isLoading: loadMembers } = useGetMembers();
  const { data: donations, isLoading: loadDonations } = useGetDonations({ month: selectedMonth, year: selectedYear });

  const createMutation = useCreateDonation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDonationsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() });
        toast({ title: "সফল", description: "চাঁদা গ্রহণ করা হয়েছে।" });
        setMemberId("");
        setAmount(0);
      }
    }
  });

  const deleteMutation = useDeleteDonation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDonationsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() });
        toast({ title: "সফল", description: "চাঁদা এন্ট্রি মুছে ফেলা হয়েছে।" });
      }
    }
  });

  const handleRecordDonation = () => {
    if (!memberId || amount <= 0) {
      toast({ title: "ভুল", description: "সদস্য এবং টাকার পরিমাণ নির্বাচন করুন।", variant: "destructive" });
      return;
    }
    createMutation.mutate({ data: { memberId, amount, month: selectedMonth, year: selectedYear } });
  };

  const handleDelete = (id: string) => {
    if (confirm("আপনি কি নিশ্চিত?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (isChecking || !isAdmin) return null;

  const years = [getCurrentYear(), (parseInt(getCurrentYear()) - 1).toString(), (parseInt(getCurrentYear()) - 2).toString()];
  const unpaidMembers = members?.filter(m => !donations?.some(d => d.memberId === m._id)) || [];
  const filteredUnpaid = unpaidMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone && m.phone.includes(search))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">চাঁদা গ্রহণ</h1>
          <p className="text-muted-foreground mt-1">সদস্যদের থেকে চাঁদা এন্ট্রি করুন</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="flex h-12 w-full md:w-40 rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary outline-none" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {BENGALI_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="flex h-12 w-full md:w-32 rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary outline-none" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {years.map(y => <option key={y} value={y}>{toBengaliNumber(y)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-primary/20 shadow-xl">
          <div className="bg-primary p-6 rounded-t-2xl text-primary-foreground">
            <h2 className="text-2xl font-bold font-display">নতুন এন্ট্রি</h2>
            <p className="opacity-90 mt-1">{selectedMonth} {toBengaliNumber(selectedYear)}</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">সদস্য খুঁজুন (বকেয়া তালিকা থেকে)</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input placeholder="নাম দিয়ে খুঁজুন..." className="pl-12" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="border border-border rounded-xl max-h-60 overflow-y-auto bg-muted/20">
                {filteredUnpaid.map(m => (
                  <div
                    key={m._id}
                    onClick={() => { setMemberId(m._id); setAmount(m.monthlyAmount); }}
                    className={`p-3 border-b border-border cursor-pointer flex justify-between items-center transition-colors ${memberId === m._id ? 'bg-primary/10 border-primary' : 'hover:bg-white'}`}
                  >
                    <div>
                      <p className="font-bold">{m.name}</p>
                      <p className="text-xs text-muted-foreground">মাসিক: {formatCurrency(m.monthlyAmount)}</p>
                    </div>
                    {memberId === m._id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </div>
                ))}
                {filteredUnpaid.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground">বকেয়া সদস্য নেই বা খুঁজে পাওয়া যায়নি।</div>}
              </div>
              {memberId && (
                <div className="pt-4 border-t border-border">
                  <label className="block text-sm font-bold mb-2">টাকার পরিমাণ</label>
                  <div className="flex gap-4">
                    <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="text-xl font-bold" />
                    <Button onClick={handleRecordDonation} disabled={createMutation.isPending} className="px-8">
                      {createMutation.isPending ? "অপেক্ষা করুন..." : "জমা দিন"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="bg-emerald-50 p-6 rounded-t-2xl border-b border-emerald-100">
            <h2 className="text-xl font-bold text-emerald-800">পরিশোধিত তালিকা ({toBengaliNumber(donations?.length || 0)})</h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {loadDonations ? (
              <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
            ) : (
              donations?.map(d => (
                <div key={d._id} className="flex justify-between items-center p-4 border-b border-border hover:bg-muted/30">
                  <div>
                    <p className="font-bold text-lg">{d.memberName}</p>
                    <p className="text-sm text-muted-foreground">{new Date(d.paidAt).toLocaleDateString('bn-BD')} তারিখে</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-emerald-600 text-lg">{formatCurrency(d.amount)}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(d._id)} className="text-destructive hover:bg-destructive/10 w-8 h-8 p-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            {donations?.length === 0 && <div className="p-8 text-center text-muted-foreground">এই মাসে এখনো কোনো চাঁদা জমা হয়নি।</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
