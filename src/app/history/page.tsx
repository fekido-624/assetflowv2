"use client";

import { useEffect, useState } from 'react';
import { getHistory, getAssets } from '@/lib/actions';
import { AssetHistory, Asset } from '@/lib/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, ArrowRight, UserCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<AssetHistory[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const historyData = await getHistory();
      const assetsData = await getAssets();
      setHistory(historyData as AssetHistory[]);
      setAssets(assetsData as Asset[]);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-primary transition-colors">
          <Link href="/dashboard" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <header>
          <h1 className="text-3xl font-bold text-primary font-headline">Audit Trail</h1>
          <p className="text-muted-foreground">Historical records of asset acquisition type changes.</p>
        </header>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/10">
            <TableRow>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Asset Info</TableHead>
              <TableHead className="font-bold">Transition</TableHead>
              <TableHead className="font-bold">Updated By</TableHead>
              <TableHead className="font-bold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length > 0 ? (
              history.map((h) => {
                const asset = assets.find(a => a.id === h.asset_id);
                return (
                  <TableRow key={h.id}>
                    <TableCell className="text-sm font-medium">{h.tarikh_tukar}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{asset?.jenama} {asset?.model}</span>
                        <span className="text-xs text-muted-foreground font-mono">{asset?.no_siri}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-[10px]">{h.jenis_perolehan_lama}</Badge>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <Badge className="text-[10px] bg-accent">{h.jenis_perolehan_baru}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <UserCircle className="w-4 h-4 text-primary/60" />
                        <span className="text-sm">{h.ditukar_oleh}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {h.catatan}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                  No changes have been logged in the audit trail yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
