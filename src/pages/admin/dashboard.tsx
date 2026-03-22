import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Settings, PlusCircle } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, isChecking } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isChecking && !isAdmin) {
      setLocation("/admin/login");
    }
  }, [isAdmin, isChecking, setLocation]);

  if (isChecking || !isAdmin) return null;

  const actions = [
    {
      title: "চাঁদা গ্রহণ করুন",
      description: "সদস্যদের মাসিক চাঁদা এন্ট্রি করুন",
      icon: PlusCircle,
      href: "/admin/donations",
      color: "bg-emerald-500",
    },
    {
      title: "সদস্য পরিচালনা",
      description: "নতুন সদস্য যোগ করুন বা তথ্য আপডেট করুন",
      icon: Users,
      href: "/admin/members",
      color: "bg-blue-500",
    },
    {
      title: "রিপোর্ট দেখুন",
      description: "যেকোনো মাসের বিস্তারিত রিপোর্ট",
      icon: FileText,
      href: "/reports",
      color: "bg-purple-500",
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">অ্যাডমিন প্যানেল</h1>
        <p className="text-muted-foreground mt-1">মসজিদ পরিচালনা প্যানেলে স্বাগতম</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((action, i) => (
          <Link key={i} href={action.href}>
            <Card className="h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer border-transparent hover:border-primary/20 group">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl ${action.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{action.title}</h3>
                <p className="text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
