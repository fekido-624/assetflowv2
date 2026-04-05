"use client";

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Staff, Wing } from '@/lib/types';
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
import { Search, Plus, Edit2, Trash2, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [userRole, setUserRole] = useState(store.getCurrentUser()?.role);

  const [formData, setFormData] = useState<Omit<Staff, 'id'>>({
    nama: '',
    jawatan: '',
    gred: '',
    email: '',
    bahagian: '',
    wing: 'Wing 1',
    status_perjawatan: 'Tetap'
  });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => setStaff(store.getStaff());

  const filteredStaff = staff.filter(s => 
    s.nama.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      store.updateStaff(editingStaff.id, formData);
    } else {
      store.addStaff(formData);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      nama: '', jawatan: '', gred: '', email: '', bahagian: '', wing: 'Wing 1', status_perjawatan: 'Tetap'
    });
    refresh();
  };

  const startEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      store.deleteStaff(id);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Staff Directory</h1>
          <p className="text-muted-foreground">Manage organization personnel and contact details.</p>
        </div>
        
        {userRole === 'Admin' && (
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingStaff(null);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6">
                <Plus className="mr-2 h-5 w-5" />
                Add New Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                  <UserPlus className="text-primary w-6 h-6" />
                  <span>{editingStaff ? 'Edit Staff' : 'Add Staff Member'}</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Full Name</Label>
                    <Input required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Position (Jawatan)</Label>
                    <Input required value={formData.jawatan} onChange={e => setFormData({...formData, jawatan: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade (Gred)</Label>
                    <Input required value={formData.gred} onChange={e => setFormData({...formData, gred: e.target.value})} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Email</Label>
                    <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Department (Bahagian)</Label>
                    <Input required value={formData.bahagian} onChange={e => setFormData({...formData, bahagian: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Wing</Label>
                    <Select value={formData.wing} onValueChange={(v: Wing) => setFormData({...formData, wing: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wing 1">Wing 1</SelectItem>
                        <SelectItem value="Wing 2">Wing 2</SelectItem>
                        <SelectItem value="Wing 3">Wing 3</SelectItem>
                        <SelectItem value="Wing 4">Wing 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Employment Status</Label>
                    <Input required value={formData.status_perjawatan} onChange={e => setFormData({...formData, status_perjawatan: e.target.value})} />
                  </div>
                </div>
                <DialogFooter className="pt-6">
                  <Button type="submit" className="w-full h-12 text-lg">{editingStaff ? 'Save Changes' : 'Create Staff Record'}</Button>
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
              placeholder="Search staff by name or email..." 
              className="pl-10 bg-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-secondary/10">
            <TableRow>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Position</TableHead>
              <TableHead className="font-bold">Wing</TableHead>
              <TableHead className="font-bold">Bahagian</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              {userRole === 'Admin' && <TableHead className="text-right font-bold">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((s) => (
                <TableRow key={s.id} className="hover:bg-accent/5 transition-colors">
                  <TableCell className="font-medium">{s.nama}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{s.jawatan}</span>
                      <span className="text-xs text-muted-foreground">{s.gred}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold text-primary border-primary/20 bg-primary/5">
                      {s.wing}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.bahagian}</TableCell>
                  <TableCell className="text-muted-foreground">{s.email}</TableCell>
                  {userRole === 'Admin' && (
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(s)} className="text-primary hover:bg-primary/10">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={userRole === 'Admin' ? 6 : 5} className="h-32 text-center text-muted-foreground italic">
                  No staff members found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}