"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  Printer, 
  History, 
  FileText, 
  LogOut,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { store } from '@/lib/store';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Staff Management', href: '/staff', icon: Users },
  { name: 'Asset Management', href: '/assets', icon: Monitor },
  { name: 'Printer Management', href: '/printers', icon: Printer },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(store.getCurrentUser());

  useEffect(() => {
    setUser(store.getCurrentUser());
  }, []);

  const handleLogout = () => {
    store.logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 bg-white border-r border-border shadow-sm z-50">
      <div className="p-6 flex items-center space-x-3 border-b border-border/50">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Monitor className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-headline font-bold text-primary">AssetFlow</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md transition-all font-medium",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              )}>
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
        {user.role === 'Admin' && (
          <Link href="/history">
            <div className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-md transition-all font-medium",
              pathname.startsWith('/history') 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-primary"
            )}>
              <History className="w-5 h-5" />
              <span>Audit Trail</span>
            </div>
          </Link>
        )}
        {user.role === 'Admin' && (
          <Link href="/users">
            <div className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-md transition-all font-medium",
              pathname.startsWith('/users') 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-primary"
            )}>
              <ShieldCheck className="w-5 h-5" />
              <span>User Management</span>
            </div>
          </Link>
        )}
      </div>

      <div className="p-6 border-t border-border/50 space-y-4">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs">
            {user.role[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate w-32">{user.username}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{user.role}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-destructive/5 hover:text-destructive h-11"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}