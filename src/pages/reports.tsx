import { useState } from "react";
import { useGetSummary, useGetDonations, useGetMembers } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { BENGALI_MONTHS, getCurrentBengaliMonth, getCurrentYear, formatCurrency, toBengaliNumber } from "@/lib/utils";

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentBengaliMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  const { data: summary, isLoading: loadSummary } = useGetSummary({ month: selectedMonth, year: selectedYear });
  const { data: donations, isLoading: loadDonations } = useGetDonations({ month: selectedMonth, year: selectedYear });
  const { data: members, isLoading: loadMembers } = useGetMembers();

  const isLoading = loadSummary || loadDonations || loadMembers;
  const years = [getCurrentYear(), (parseInt(getCurrentYear()) - 1).toString(), (parseInt(getCurrentYear()) - 2).toString()];
  const unpaidMembers = members?.filter(m => !donations?.some(d => d.memberId === m._id)) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">মাসিক রিপোর্ট</h1>
          <p className="text-muted-foreground mt-1">যেকোনো মাসের রিপোর্ট দেখুন</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            className="flex h-12 w-full md:w-40 rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary outline-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {BENGALI_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            className="flex h-12 w-full md:w-32 rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary outline-none"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map(y => <option key={y} value={y}>{toBengaliNumber(y)}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium mb-2">মোট আদায়</p>
                <h3 className="text-2xl font-bold text-primary">{formatCurrency(summary?.totalCollected || 0)}</h3>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium mb-2">মোট বকেয়া</p>
                <h3 className="text-2xl font-bold text-destructive">{formatCurrency(summary?.totalDue || 0)}</h3>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium mb-2">চাঁদা দিয়েছেন</p>
                <h3 className="text-2xl font-bold text-emerald-700">{toBengaliNumber(summary?.paidCount || 0)} জন</h3>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium mb-2">চাঁদা দেননি</p>
                <h3 className="text-2xl font-bold text-amber-700">{toBengaliNumber(summary?.unpaidCount || 0)} জন</h3>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <div className="bg-emerald-500 text-white p-4 rounded-t-2xl font-bold text-lg">
                যারা চাঁদা দিয়েছেন ({toBengaliNumber(donations?.length || 0)})
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {donations?.map(d => (
                  <div key={d._id} className="flex justify-between items-center p-4 border-b border-border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-bold">{d.memberName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(d.paidAt).toLocaleDateString('bn-BD')}</p>
                    </div>
                    <span className="font-bold text-emerald-600">{formatCurrency(d.amount)}</span>
                  </div>
                ))}
                {donations?.length === 0 && <div className="p-8 text-center text-muted-foreground">কেউ চাঁদা দেননি</div>}
              </div>
            </Card>

            <Card>
              <div className="bg-destructive text-white p-4 rounded-t-2xl font-bold text-lg">
                বকেয়া তালিকা ({toBengaliNumber(unpaidMembers.length)})
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {unpaidMembers.map(m => (
                  <div key={m._id} className="flex justify-between items-center p-4 border-b border-border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-bold">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.phone || 'নম্বর নেই'}</p>
                    </div>
                    <span className="font-bold text-destructive">{formatCurrency(m.monthlyAmount)}</span>
                  </div>
                ))}
                {unpaidMembers.length === 0 && <div className="p-8 text-center text-muted-foreground">সবাই চাঁদা দিয়েছেন!</div>}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
