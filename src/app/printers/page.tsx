"use client";

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Printer, AcquisitionType, Staff } from '@/lib/types';
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
import { Search, Plus, Edit2, Trash2, Printer as PrinterIcon, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function PrintersPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);
  const [userRole, setUserRole] = useState(store.getCurrentUser()?.role);

  const [formData, setFormData] = useState<Omit<Printer, 'id'>>({
    staff_id: null,
    jenis_perolehan: 'Hak Milik Kerajaan',
    tahun_perolehan: new Date().getFullYear().toString(),
    no_siri: '',
    jenama: '',
    jenis: '',
    kod_toner: '',
    no_pendaftaran: '',
    kod_sewaan: ''
  });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setPrinters(store.getPrinters());
    setStaffList(store.getStaff());
  };

  const filteredPrinters = printers.filter(p => {
    const searchTerm = search.toLowerCase();
    return (
      p.no_siri.toLowerCase().includes(searchTerm) ||
      p.jenama.toLowerCase().includes(searchTerm) ||
      p.kod_toner.toLowerCase().includes(searchTerm)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrinter) {
      store.updatePrinter(editingPrinter.id, formData);
    } else {
      store.addPrinter(formData);
    }
    setIsModalOpen(false);
    setEditingPrinter(null);
    refresh();
  };

  const startEdit = (p: Printer) => {
    setEditingPrinter(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-primary transition-colors">
          <Link href="/dashboard" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">Printer Management</h1>
            <p className="text-muted-foreground">Monitor printing equipment and consumable requirements.</p>
          </div>
          
          {userRole === 'Admin' && (
            <Dialog open={isModalOpen} onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) setEditingPrinter(null);
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6">
                  <Plus className="mr-2 h-5 w-5" />
                  Register Printer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                    <PrinterIcon className="text-primary w-6 h-6" />
                    <span>{editingPrinter ? 'Edit Printer' : 'Register New Printer'}</span>
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Assignee</Label>
                      <Select value={formData.staff_id?.toString() || 'unassigned'} onValueChange={(v) => setFormData({...formData, staff_id: v === 'unassigned' ? null : parseInt(v)})}>
                        <SelectTrigger><SelectValue placeholder="Select Staff" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {staffList.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.nama}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Acquisition Type</Label>
                      <Select value={formData.jenis_perolehan} onValueChange={(v: AcquisitionType) => setFormData({...formData, jenis_perolehan: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sewaan Berpusat">Sewaan Berpusat</SelectItem>
                          <SelectItem value="Hak Milik Kerajaan">Hak Milik Kerajaan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Brand (Jenama)</Label>
                      <Input required value={formData.jenama} onChange={e => setFormData({...formData, jenama: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Type (Model/Jenis)</Label>
                      <Input required value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Toner Code</Label>
                      <Input required value={formData.kod_toner} onChange={e => setFormData({...formData, kod_toner: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Serial Number</Label>
                      <Input required value={formData.no_siri} onChange={e => setFormData({...formData, no_siri: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter className="pt-6">
                    <Button type="submit" className="w-full h-12 text-lg">Save Printer Info</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-secondary/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search printers by S/N or brand..." 
              className="pl-10 bg-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-secondary/10">
            <TableRow>
              <TableHead className="font-bold">Device</TableHead>
              <TableHead className="font-bold">Serial Number</TableHead>
              <TableHead className="font-bold">Toner Code</TableHead>
              <TableHead className="font-bold">Assigned To</TableHead>
              <TableHead className="font-bold">Acquisition</TableHead>
              {userRole === 'Admin' && <TableHead className="text-right font-bold">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrinters.map((p) => {
              const staff = staffList.find(s => s.id === p.staff_id);
              return (
                <TableRow key={p.id} className="hover:bg-accent/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <PrinterIcon className="w-4 h-4 text-primary" />
                      <span className="font-medium">{p.jenama} {p.jenis}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{p.no_siri}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">{p.kod_toner}</Badge>
                  </TableCell>
                  <TableCell>{staff ? staff.nama : <span className="text-muted-foreground italic">Shared/Pool</span>}</TableCell>
                  <TableCell><Badge variant="outline">{p.jenis_perolehan}</Badge></TableCell>
                  {userRole === 'Admin' && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="text-primary hover:bg-primary/10">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
