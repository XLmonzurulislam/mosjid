import { useGetSummary } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentBengaliMonth, getCurrentYear, formatCurrency, toBengaliNumber } from "@/lib/utils";
import { Wallet, Users, CheckCircle2, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const month = getCurrentBengaliMonth();
  const year = getCurrentYear();

  const { data: summary, isLoading, error } = useGetSummary({ month, year });

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (error || !summary) {
    return <div className="text-center py-20 text-destructive font-bold">ডেটা লোড করতে সমস্যা হয়েছে।</div>;
  }

  const stats = [
    {
      title: "মোট সংগৃহীত (চলতি মাস)",
      value: formatCurrency(summary.totalCollected),
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "মোট বকেয়া (চলতি মাস)",
      value: formatCurrency(summary.totalDue),
      icon: AlertCircle,
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      title: "চাঁদা দিয়েছেন",
      value: `${toBengaliNumber(summary.paidCount)} জন`,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      title: "চাঁদা দেননি",
      value: `${toBengaliNumber(summary.unpaidCount)} জন`,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-100"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="relative rounded-3xl overflow-hidden bg-primary p-8 sm:p-12 shadow-2xl shadow-primary/30">
        <img
          src="/images/islamic-bg.png"
          alt="Islamic Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="relative z-10 text-primary-foreground">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">মাসিক সারসংক্ষেপ</h1>
          <p className="text-xl opacity-90">
            মাস: <span className="font-bold text-accent">{month} {toBengaliNumber(year)}</span>
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl">
            <Users className="w-5 h-5 text-accent" />
            <span className="font-semibold text-lg">মোট সদস্য: {toBengaliNumber(summary.totalMembers)} জন</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-muted-foreground font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-foreground font-display">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
