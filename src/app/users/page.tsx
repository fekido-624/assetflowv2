"use client";

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { getUsers, addUser, updateUser, deleteUser } from '@/lib/actions';
import { User, UserRole } from '@/lib/types';
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
import { Search, Plus, Edit2, Trash2, UserPlus, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentUser] = useState(store.getCurrentUser());

  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    username: '',
    password: '',
    role: 'User'
  });

  // Security Check: Only Admins can access this page
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Admin') {
      router.push('/dashboard');
    } else {
      refresh();
    }
  }, [currentUser, router]);

  const refresh = async () => {
    const data = await getUsers();
    setUsers(data as User[]);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // If password is empty, don't update it to avoid overwriting with empty string
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        
        await updateUser(editingUser.id, updateData);
      } else {
        await addUser(formData);
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ username: '', password: '', role: 'User' });
      refresh();
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const startEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      password: '', // Don't show password
      role: u.role
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (id === currentUser?.id) {
       alert("You cannot delete your own account.");
       return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
      refresh();
    }
  };

  if (!currentUser || currentUser.role !== 'Admin') return null;

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
            <h1 className="text-3xl font-bold text-primary font-headline">User Management</h1>
            <p className="text-muted-foreground">Manage login accounts and system permissions.</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              setEditingUser(null);
              setFormData({ username: '', password: '', role: 'User' });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6">
                <Plus className="mr-2 h-5 w-5" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                  <UserPlus className="text-primary w-6 h-6" />
                  <span>{editingUser ? 'Edit User' : 'Create New Account'}</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input 
                    required 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value.toLowerCase()})} 
                    placeholder="e.g. jameel_it"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{editingUser ? 'New Password (Leave blank to keep current)' : 'Password'}</Label>
                  <Input 
                    required={!editingUser}
                    type="password"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>System Role</Label>
                  <Select value={formData.role} onValueChange={(v: UserRole) => setFormData({...formData, role: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Administrator (Full Access)</SelectItem>
                      <SelectItem value="User">Standard User (View Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-6">
                  <Button type="submit" className="w-full h-12 text-lg">
                    {editingUser ? 'Update Account' : 'Create Account'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-secondary/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search by username..." 
              className="pl-10 bg-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-secondary/10">
            <TableRow>
              <TableHead className="font-bold">Username</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <TableRow key={u.id} className="hover:bg-accent/5 transition-colors">
                  <TableCell className="font-medium flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {u.username[0].toUpperCase()}
                    </div>
                    <span>{u.username}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={u.role === 'Admin' ? 'default' : 'outline'}
                      className={u.role === 'Admin' ? 'bg-primary border-transparent' : 'text-muted-foreground'}
                    >
                      {u.role === 'Admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(u)} className="text-primary hover:bg-primary/10">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(u.id)} 
                        className="text-destructive hover:bg-destructive/10"
                        disabled={u.id === currentUser?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
