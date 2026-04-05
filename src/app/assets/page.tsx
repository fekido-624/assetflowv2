"use client";

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Asset, AssetType, AcquisitionType, AssetStatus, Staff } from '@/lib/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Plus, Edit2, Trash2, Laptop, Info, BrainCircuit, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { summarizeAssetHistory } from '@/ai/flows/asset-history-summarizer';
import { cn } from '@/lib/utils';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [userRole, setUserRole] = useState(store.getCurrentUser()?.role);
  
  // GenAI Summary State
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<Asset, 'id'>>({
    staff_id: null,
    jenis_asset: 'PC',
    jenama: '',
    model: '',
    jenis_perolehan: 'Hak Milik Kerajaan',
    tahun_perolehan: new Date().getFullYear().toString(),
    no_siri: '',
    lokasi: '',
    status: 'Aktif',
    no_pendaftaran: '',
    kod_sewaan: ''
  });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setAssets(store.getAssets());
    setStaffList(store.getStaff());
  };

  const filteredAssets = assets.filter(a => {
    const staff = staffList.find(s => s.id === a.staff_id);
    const searchTerm = search.toLowerCase();
    return (
      a.no_siri.toLowerCase().includes(searchTerm) ||
      a.jenama.toLowerCase().includes(searchTerm) ||
      a.model.toLowerCase().includes(searchTerm) ||
      (a.no_pendaftaran?.toLowerCase().includes(searchTerm)) ||
      (a.kod_sewaan?.toLowerCase().includes(searchTerm)) ||
      (staff?.nama.toLowerCase().includes(searchTerm))
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset) {
      store.updateAsset(editingAsset.id, formData, store.getCurrentUser()?.username || 'System');
    } else {
      store.addAsset(formData);
    }
    setIsModalOpen(false);
    setEditingAsset(null);
    refresh();
  };

  const startEdit = (a: Asset) => {
    setEditingAsset(a);
    setFormData({ ...a });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this asset?')) {
      store.deleteAsset(id);
      refresh();
    }
  };

  const handleSummarize = async (assetId: number) => {
    setIsSummarizing(true);
    setSummaryModalOpen(true);
    setSummary(null);
    try {
      const history = store.getHistory(assetId);
      if (history.length === 0) {
        setSummary("No history available for this asset yet.");
      } else {
        const result = await summarizeAssetHistory({
          assetId,
          assetHistory: history
        });
        setSummary(result.summary);
      }
    } catch (err) {
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">IT Assets</h1>
          <p className="text-muted-foreground">Manage hardware inventory and assignments.</p>
        </div>
        
        {userRole === 'Admin' && (
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingAsset(null);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6">
                <Plus className="mr-2 h-5 w-5" />
                Register Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                  <Laptop className="text-primary w-6 h-6" />
                  <span>{editingAsset ? 'Edit Asset' : 'Register New Asset'}</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assign to Staff</Label>
                    <Select 
                      value={formData.staff_id?.toString() || 'unassigned'} 
                      onValueChange={(v) => setFormData({...formData, staff_id: v === 'unassigned' ? null : parseInt(v)})}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Staff" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staffList.map(s => (
                          <SelectItem key={s.id} value={s.id.toString()}>{s.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Asset Type</Label>
                    <Select value={formData.jenis_asset} onValueChange={(v: AssetType) => setFormData({...formData, jenis_asset: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="Tablet">Tablet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Brand (Jenama)</Label>
                    <Input required value={formData.jenama} onChange={e => setFormData({...formData, jenama: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Acquisition Type</Label>
                    <Select value={formData.jenis_perolehan} onValueChange={(v: AcquisitionType) => setFormData({...formData, jenis_perolehan: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sewaan Berpusat">Sewaan Berpusat</SelectItem>
                        <SelectItem value="Sewaan Sendiri">Sewaan Sendiri</SelectItem>
                        <SelectItem value="Hak Milik Kerajaan">Hak Milik Kerajaan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year (Tahun Perolehan)</Label>
                    <Input required value={formData.tahun_perolehan} onChange={e => setFormData({...formData, tahun_perolehan: e.target.value})} />
                  </div>
                  
                  {formData.jenis_perolehan === 'Hak Milik Kerajaan' && (
                    <div className="space-y-2 col-span-2">
                      <Label>Registration No (Kew PA)</Label>
                      <Input required value={formData.no_pendaftaran} onChange={e => setFormData({...formData, no_pendaftaran: e.target.value})} />
                    </div>
                  )}
                  
                  {formData.jenis_perolehan.includes('Sewaan') && (
                    <div className="space-y-2 col-span-2">
                      <Label>Rental Code (Kod Sewaan)</Label>
                      <Input required value={formData.kod_sewaan} onChange={e => setFormData({...formData, kod_sewaan: e.target.value})} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Serial Number</Label>
                    <Input required value={formData.no_siri} onChange={e => setFormData({...formData, no_siri: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input required value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Asset Status</Label>
                    <Select value={formData.status} onValueChange={(v: AssetStatus) => setFormData({...formData, status: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Rosak">Rosak</SelectItem>
                        <SelectItem value="Lupus">Lupus</SelectItem>
                        <SelectItem value="Dipinjam">Dipinjam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="pt-6">
                  <Button type="submit" className="w-full h-12 text-lg">Save Asset Details</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-secondary/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search by SN, Model, or Staff..." 
              className="pl-10 bg-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-secondary/10">
            <TableRow>
              <TableHead className="font-bold">Type/Brand</TableHead>
              <TableHead className="font-bold">S/N</TableHead>
              <TableHead className="font-bold">Assigned To</TableHead>
              <TableHead className="font-bold">Acquisition</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((a) => {
              const staff = staffList.find(s => s.id === a.staff_id);
              return (
                <TableRow key={a.id} className="hover:bg-accent/5 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-primary">{a.jenis_asset} - {a.jenama}</span>
                      <span className="text-xs text-muted-foreground">{a.model}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{a.no_siri}</TableCell>
                  <TableCell>
                    {staff ? (
                      <div className="flex flex-col">
                        <span className="text-sm">{staff.nama}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{staff.bahagian}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {a.jenis_perolehan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase",
                      a.status === 'Aktif' ? 'bg-accent text-white' : 
                      a.status === 'Rosak' ? 'bg-destructive text-white' : 'bg-slate-400 text-white'
                    )}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {userRole === 'Admin' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSummarize(a.id)}
                          className="text-accent hover:bg-accent/10"
                          title="AI History Summary"
                        >
                          <BrainCircuit className="h-4 w-4" />
                        </Button>
                      )}
                      {userRole === 'Admin' && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => startEdit(a)} className="text-primary hover:bg-primary/10">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {userRole === 'User' && (
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={summaryModalOpen} onOpenChange={setSummaryModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
              <BrainCircuit className="text-accent w-6 h-6" />
              <span>Asset Lifecycle Summary (AI Generated)</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 min-h-[150px] relative">
            {isSummarizing ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
                <p className="text-muted-foreground animate-pulse">Analyzing audit trail logs...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {summary}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSummaryModalOpen(false)}>Close Summary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
