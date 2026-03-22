import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const publicNav = [
    { name: 'ড্যাশবোর্ড', href: '/', icon: LayoutDashboard },
    { name: 'সদস্য তালিকা', href: '/members', icon: Users },
    { name: 'রিপোর্ট', href: '/reports', icon: FileText },
  ];

  const adminNav = [
    { name: 'অ্যাডমিন প্যানেল', href: '/admin', icon: Settings },
    { name: 'সদস্য পরিচালনা', href: '/admin/members', icon: Users },
    { name: 'চাঁদা গ্রহণ', href: '/admin/donations', icon: FileText },
  ];

  const navItems = isAdmin ? [...publicNav, ...adminNav] : publicNav;

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary overflow-hidden">
                <img src="/images/mosque-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-primary leading-none">মসজিদ 123</h1>
                <p className="text-sm text-muted-foreground">চাঁদা ম্যানেজমেন্ট</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              {!isAdmin ? (
                <Link
                  href="/admin/login"
                  className="ml-4 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all"
                >
                  লগইন
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="ml-4 p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all flex items-center gap-2 font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  লগআউট
                </button>
              )}
            </nav>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-md pt-24 px-4">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "p-4 rounded-xl text-lg font-semibold flex items-center gap-3",
                    isActive ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            {!isAdmin ? (
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 p-4 rounded-xl text-lg font-semibold border-2 border-primary/20 text-primary text-center"
              >
                অ্যাডমিন লগইন
              </Link>
            ) : (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="mt-4 p-4 rounded-xl text-lg font-semibold bg-destructive/10 text-destructive flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                লগআউট
              </button>
            )}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
