import { Staff, Asset, Printer, AssetHistory, User, UserRole } from './types';

// Mock Initial Data
const INITIAL_STAFF: Staff[] = [
  { id: 1, nama: 'Ahmad bin Ali', jawatan: 'Pegawai Teknologi Maklumat', gred: 'F41', email: 'ahmad@gov.my', bahagian: 'BTM', wing: 'Wing 1', status_perjawatan: 'Tetap' },
  { id: 2, nama: 'Siti Aminah', jawatan: 'Penolong Pegawai IT', gred: 'FA29', email: 'siti@gov.my', bahagian: 'Pentadbiran', wing: 'Wing 2', status_perjawatan: 'Tetap' },
];

const INITIAL_ASSETS: Asset[] = [
  { id: 1, staff_id: 1, jenis_asset: 'Laptop', jenama: 'Dell', model: 'Latitude 5420', jenis_perolehan: 'Sewaan Berpusat', tahun_perolehan: '2022', kod_sewaan: 'SWN-2022-001', no_siri: 'DELL-998877', lokasi: 'Aras 2', status: 'Aktif' },
];

const INITIAL_PRINTERS: Printer[] = [
  { id: 1, staff_id: 2, jenis_perolehan: 'Hak Milik Kerajaan', tahun_perolehan: '2021', no_pendaftaran: 'KPA/123/456', no_siri: 'HP-PRT-001', jenama: 'HP', jenis: 'LaserJet', kod_toner: 'CF217A' },
];

class DataStore {
  private staff: Staff[] = INITIAL_STAFF;
  private assets: Asset[] = INITIAL_ASSETS;
  private printers: Printer[] = INITIAL_PRINTERS;
  private history: AssetHistory[] = [];
  private currentUser: User | null = null;

  // Authentication
  login(role: UserRole) {
    this.currentUser = { id: 1, username: role === 'Admin' ? 'admin_user' : 'staff_user', role };
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Staff
  getStaff() { return [...this.staff]; }
  addStaff(s: Omit<Staff, 'id'>) {
    const newStaff = { ...s, id: Math.max(0, ...this.staff.map(x => x.id)) + 1 };
    this.staff.push(newStaff);
    return newStaff;
  }
  updateStaff(id: number, s: Partial<Staff>) {
    this.staff = this.staff.map(x => x.id === id ? { ...x, ...s } : x);
  }
  deleteStaff(id: number) {
    this.staff = this.staff.filter(x => x.id !== id);
  }

  // Assets
  getAssets() { return [...this.assets]; }
  addAsset(a: Omit<Asset, 'id'>) {
    const newAsset = { ...a, id: Math.max(0, ...this.assets.map(x => x.id)) + 1 };
    this.assets.push(newAsset);
    return newAsset;
  }
  updateAsset(id: number, a: Partial<Asset>, updatedBy: string) {
    const oldAsset = this.assets.find(x => x.id === id);
    if (oldAsset && a.jenis_perolehan && a.jenis_perolehan !== oldAsset.jenis_perolehan) {
      this.history.push({
        id: Math.max(0, ...this.history.map(x => x.id)) + 1,
        asset_id: id,
        jenis_perolehan_lama: oldAsset.jenis_perolehan,
        jenis_perolehan_baru: a.jenis_perolehan,
        tarikh_tukar: new Date().toISOString().split('T')[0],
        ditukar_oleh: updatedBy,
        catatan: `Changed from ${oldAsset.jenis_perolehan} to ${a.jenis_perolehan}`
      });
    }
    this.assets = this.assets.map(x => x.id === id ? { ...x, ...a } : x);
  }
  deleteAsset(id: number) {
    this.assets = this.assets.filter(x => x.id !== id);
  }

  // Printers
  getPrinters() { return [...this.printers]; }
  addPrinter(p: Omit<Printer, 'id'>) {
    const newPrinter = { ...p, id: Math.max(0, ...this.printers.map(x => x.id)) + 1 };
    this.printers.push(newPrinter);
    return newPrinter;
  }
  updatePrinter(id: number, p: Partial<Printer>) {
    this.printers = this.printers.map(x => x.id === id ? { ...x, ...p } : x);
  }
  deletePrinter(id: number) {
    this.printers = this.printers.filter(x => x.id !== id);
  }

  // History
  getHistory(assetId?: number) {
    if (assetId) return this.history.filter(x => x.asset_id === assetId);
    return [...this.history];
  }
}

export const store = new DataStore();