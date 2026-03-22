import { useState } from "react";
import { useGetMembers, useGetDonations } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCurrentBengaliMonth, getCurrentYear, formatCurrency, toBengaliNumber } from "@/lib/utils";
import { Search, CheckCircle2, XCircle } from "lucide-react";

export default function MembersList() {
  const month = getCurrentBengaliMonth();
  const year = getCurrentYear();
  const [search, setSearch] = useState("");

  const { data: members, isLoading: loadingMembers } = useGetMembers();
  const { data: donations, isLoading: loadingDonations } = useGetDonations({ month, year });

  const isLoading = loadingMembers || loadingDonations;

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const filteredMembers = members?.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone && m.phone.includes(search))
  ) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">সদস্য তালিকা</h1>
          <p className="text-muted-foreground mt-1">চলতি মাসের চাঁদার অবস্থা ({month} {toBengaliNumber(year)})</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            className="pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const hasPaid = donations?.some(d => d.memberId === member._id);
          return (
            <Card key={member._id} className="overflow-hidden">
              <div className={`h-2 w-full ${hasPaid ? 'bg-emerald-500' : 'bg-destructive'}`} />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{member.phone || 'মোবাইল নম্বর নেই'}</p>
                  </div>
                  {hasPaid ? (
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />পরিশোধিত
                    </div>
                  ) : (
                    <div className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" />বকেয়া
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">মাসিক চাঁদা:</span>
                  <span className="font-bold text-lg">{formatCurrency(member.monthlyAmount)}</span>
                </div>
              </div>
            </Card>
          );
        })}
        {filteredMembers.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">কোনো সদস্য পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
}
