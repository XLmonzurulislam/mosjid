import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setLocation("/admin");
    } else {
      setError("পাসওয়ার্ড ভুল হয়েছে!");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-primary flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg absolute -bottom-8">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardContent className="pt-40 pb-8 px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-display text-foreground">অ্যাডমিন লগইন</h2>
            <p className="text-muted-foreground mt-2">প্যানেলে প্রবেশ করতে পাসওয়ার্ড দিন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="পাসওয়ার্ড..."
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="text-center text-lg tracking-widest"
              />
              {error && <p className="text-destructive text-sm mt-2 text-center font-medium">{error}</p>}
            </div>
            <Button type="submit" className="w-full text-lg">
              প্রবেশ করুন
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
