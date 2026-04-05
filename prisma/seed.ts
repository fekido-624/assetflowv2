import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.user.createMany({
    data: [
      { username: 'admin', password: 'Password123!', role: 'Admin' },
      { username: 'user', password: 'password', role: 'User' }
    ]
  })

  await prisma.staff.createMany({
    data: [
      { id: 1, nama: 'Ahmad bin Ali', jawatan: 'Pegawai Teknologi Maklumat', gred: 'F41', email: 'ahmad@gov.my', bahagian: 'BTM', wing: 'Wing 1', status_perjawatan: 'Tetap' },
      { id: 2, nama: 'Siti Aminah', jawatan: 'Penolong Pegawai IT', gred: 'FA29', email: 'siti@gov.my', bahagian: 'Pentadbiran', wing: 'Wing 2', status_perjawatan: 'Tetap' },
    ]
  })

  await prisma.asset.create({
    data: { id: 1, staff_id: 1, jenis_asset: 'Laptop', jenama: 'Dell', model: 'Latitude 5420', jenis_perolehan: 'Sewaan Berpusat', tahun_perolehan: '2022', kod_sewaan: 'SWN-2022-001', no_siri: 'DELL-998877', lokasi: 'Aras 2', status: 'Aktif' }
  })

  await prisma.printer.create({
    data: { id: 1, staff_id: 2, jenis_perolehan: 'Hak Milik Kerajaan', tahun_perolehan: '2021', no_pendaftaran: 'KPA/123/456', no_siri: 'HP-PRT-001', jenama: 'HP', jenis: 'LaserJet', kod_toner: 'CF217A' }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
