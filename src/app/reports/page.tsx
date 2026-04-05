"use client";

import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, FileSpreadsheet, Filter, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (type: string) => {
    setIsExporting(type);
    // Simulate export generation
    setTimeout(() => {
      setIsExporting(null);
      toast({
        title: "Export Successful",
        description: `Your ${type} report has been generated and downloaded.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-primary transition-colors">
          <Link href="/dashboard" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <header>
          <h1 className="text-3xl font-bold text-primary font-headline">Inventory Reports</h1>
          <p className="text-muted-foreground">Generate and export filtered asset data for administrative use.</p>
        </header>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
          title="Consolidated Asset List" 
          description="A complete dump of all hardware assets registered in the system."
          loading={isExporting === 'consolidated'}
          onExport={() => handleExport('consolidated')}
        />
        <ReportCard 
          title="Assets by Wing" 
          description="Grouped report showing asset distribution across Wing 1 to 4."
          loading={isExporting === 'wing'}
          onExport={() => handleExport('wing')}
        />
        <ReportCard 
          title="Ownership & Rental" 
          description="Detailed breakdown of 'Sewaan' vs 'Kerajaan' acquisition types."
          loading={isExporting === 'ownership'}
          onExport={() => handleExport('ownership')}
        />
        <ReportCard 
          title="Staff Assignment Registry" 
          description="Report mapping every asset to its currently assigned personnel."
          loading={isExporting === 'staff'}
          onExport={() => handleExport('staff')}
        />
        <ReportCard 
          title="Consumables Report" 
          description="Printer inventory and toner codes for procurement planning."
          loading={isExporting === 'printer'}
          onExport={() => handleExport('printer')}
        />
        <ReportCard 
          title="Asset Status Summary" 
          description="Snapshot of active, damaged, and disposed equipment."
          loading={isExporting === 'status'}
          onExport={() => handleExport('status')}
        />
      </div>

      <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <FileSpreadsheet className="w-32 h-32" />
        </div>
        <CardContent className="p-10 space-y-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold font-headline">Advanced Reporting Tool</h2>
            <p className="text-primary-foreground/80">Customize your report by selecting specific departments, wings, and date ranges. Export in .xlsx or .csv format.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 h-12 px-8">
              <Filter className="mr-2 h-5 w-5" />
              Open Custom Filters
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-12 px-8">
              <Download className="mr-2 h-5 w-5" />
              Download Full DB Backup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportCard({ title, description, loading, onExport }: { 
  title: string, 
  description: string, 
  loading: boolean,
  onExport: () => void 
}) {
  return (
    <Card className="hover:shadow-md transition-all group border-border/50">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
          <FileSpreadsheet className="text-primary w-6 h-6" />
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{title}</CardTitle>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full h-10 border-primary/20 text-primary hover:bg-primary hover:text-white"
          onClick={onExport}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
