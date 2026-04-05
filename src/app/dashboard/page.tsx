"use client";

import { useEffect, useState } from 'react';
import { getStaff, getAssets, getPrinters } from '@/lib/actions';
import { Asset, Staff } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Monitor, Printer, PieChart, BarChart3, TrendingUp } from 'lucide-react';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  Pie,
  PieChart as RePieChart,
  Legend
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    staff: 0,
    assets: 0,
    printers: 0,
    byWing: [] as any[],
    byType: [] as any[]
  });

  useEffect(() => {
    const fetchData = async () => {
      const staff = await getStaff() as Staff[];
      const assets = await getAssets() as Asset[];
      const printers = await getPrinters();

      const wings = ['Wing 1', 'Wing 2', 'Wing 3', 'Wing 4'];
      const wingData = wings.map(w => ({
        name: w,
        total: assets.filter((a: Asset) => staff.find((s: Staff) => s.id === a.staff_id)?.wing === w).length
      }));

      const types = ['Sewaan Berpusat', 'Sewaan Sendiri', 'Hak Milik Kerajaan'];
      const typeData = types.map(t => ({
        name: t,
        value: assets.filter((a: Asset) => a.jenis_perolehan === t).length
      }));

      setStats({
        staff: staff.length,
        assets: assets.length,
        printers: printers.length,
        byWing: wingData,
        byType: typeData
      });
    };

    fetchData();
  }, []);

  const COLORS = ['#2952A3', '#26DBBB', '#60A5FA', '#34D399'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">System Overview</h1>
        <p className="text-muted-foreground text-lg">Real-time metrics for IT inventory and personnel.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-6">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Staff</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.staff}</p>
            </div>
          </CardContent>
          <div className="h-1 bg-primary/20" />
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-6">
            <div className="p-4 bg-accent/10 rounded-2xl">
              <Monitor className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Assets</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.assets}</p>
            </div>
          </CardContent>
          <div className="h-1 bg-accent/20" />
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-6">
            <div className="p-4 bg-blue-400/10 rounded-2xl">
              <Printer className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Printers</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats.printers}</p>
            </div>
          </CardContent>
          <div className="h-1 bg-blue-400/20" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md border-none bg-white p-6">
          <CardHeader className="px-0 pt-0 pb-6 flex flex-row items-center space-x-3">
            <BarChart3 className="text-primary w-5 h-5" />
            <CardTitle className="text-xl font-bold text-primary">Asset Distribution by Wing</CardTitle>
          </CardHeader>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byWing}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="shadow-md border-none bg-white p-6">
          <CardHeader className="px-0 pt-0 pb-6 flex flex-row items-center space-x-3">
            <PieChart className="text-accent w-5 h-5" />
            <CardTitle className="text-xl font-bold text-primary">Ownership Type Breakdown</CardTitle>
          </CardHeader>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={stats.byType}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}