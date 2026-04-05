export type Wing = 'Wing 1' | 'Wing 2' | 'Wing 3' | 'Wing 4';
export type AcquisitionType = 'Sewaan Berpusat' | 'Sewaan Sendiri' | 'Hak Milik Kerajaan';
export type AssetStatus = 'Aktif' | 'Rosak' | 'Lupus' | 'Dipinjam';
export type AssetType = 'PC' | 'Laptop' | 'Phone' | 'Tablet';
export type UserRole = 'Admin' | 'User';

export interface Staff {
  id: number;
  nama: string;
  jawatan: string;
  gred: string;
  email: string;
  bahagian: string;
  wing: Wing;
  status_perjawatan: string;
}

export interface Asset {
  id: number;
  staff_id: number | null;
  jenis_asset: AssetType;
  jenama: string;
  model: string;
  jenis_perolehan: AcquisitionType;
  nama_projek?: string;
  tahun_perolehan: string;
  no_pendaftaran?: string;
  kod_sewaan?: string;
  no_siri: string;
  catatan?: string;
  status_asset?: string;
  lokasi: string;
  status: AssetStatus;
  tarikh_serah?: string;
  tarikh_pulang?: string;
}

export interface Printer {
  id: number;
  staff_id: number | null;
  jenis_perolehan: AcquisitionType;
  nama_projek?: string;
  tahun_perolehan: string;
  no_pendaftaran?: string;
  kod_sewaan?: string;
  no_siri: string;
  jenama: string;
  jenis: string;
  kod_toner: string;
  catatan?: string;
}

export interface AssetHistory {
  id: number;
  asset_id: number;
  jenis_perolehan_lama: string;
  jenis_perolehan_baru: string;
  tarikh_tukar: string;
  ditukar_oleh: string;
  catatan?: string;
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
}