'use server'

import prisma from './db'
import { revalidatePath } from 'next/cache'

// Authentication
export async function login(username: string, password?: string) {
  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (user && user.password === password) {
    // In a real app, you would set a session cookie here.
    // For now, we will just return the user object.
    return { id: user.id, username: user.username, role: user.role }
  }
  return null
}

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { username: 'asc' }
  })
}

export async function addUser(data: any) {
  const user = await prisma.user.create({ data })
  revalidatePath('/users')
  return user
}

export async function updateUser(id: number, data: any) {
  const user = await prisma.user.update({
    where: { id },
    data
  })
  revalidatePath('/users')
  return user
}

export async function deleteUser(id: number) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/users')
}

// Reports
export async function getReportData(type: string) {
  switch (type) {
    case 'consolidated':
      return await prisma.asset.findMany({ include: { staff: true } });
    case 'staff':
      return await prisma.staff.findMany({ include: { assets: true, printers: true } });
    case 'printer':
      return await prisma.printer.findMany({ include: { staff: true } });
    case 'history':
      return await prisma.assetHistory.findMany({ include: { asset: true } });
    default:
      return await prisma.asset.findMany({ include: { staff: true } });
  }
}

// Staff
export async function getStaff() {
  return await prisma.staff.findMany({
    include: {
      assets: true,
      printers: true
    }
  })
}

export async function addStaff(data: any) {
  const staff = await prisma.staff.create({ data })
  revalidatePath('/staff')
  return staff
}

export async function updateStaff(id: number, data: any) {
  const staff = await prisma.staff.update({
    where: { id },
    data
  })
  revalidatePath('/staff')
  return staff
}

export async function deleteStaff(id: number) {
  await prisma.staff.delete({ where: { id } })
  revalidatePath('/staff')
}

// Assets
export async function getAssets() {
  return await prisma.asset.findMany({
    include: {
      staff: true
    }
  })
}

export async function addAsset(data: any) {
  const asset = await prisma.asset.create({ data })
  revalidatePath('/assets')
  revalidatePath('/dashboard')
  return asset
}

export async function updateAsset(id: number, data: any, updatedBy: string) {
  const oldAsset = await prisma.asset.findUnique({ where: { id } })
  
  if (oldAsset && data.jenis_perolehan && data.jenis_perolehan !== oldAsset.jenis_perolehan) {
    await prisma.assetHistory.create({
      data: {
        asset_id: id,
        jenis_perolehan_lama: oldAsset.jenis_perolehan,
        jenis_perolehan_baru: data.jenis_perolehan,
        tarikh_tukar: new Date().toISOString().split('T')[0],
        ditukar_oleh: updatedBy,
        catatan: `Changed from ${oldAsset.jenis_perolehan} to ${data.jenis_perolehan}`
      }
    })
  }

  const asset = await prisma.asset.update({
    where: { id },
    data
  })
  revalidatePath('/assets')
  revalidatePath('/dashboard')
  return asset
}

export async function deleteAsset(id: number) {
  await prisma.asset.delete({ where: { id } })
  revalidatePath('/assets')
  revalidatePath('/dashboard')
}

// Printers
export async function getPrinters() {
  return await prisma.printer.findMany({
    include: {
      staff: true
    }
  })
}

export async function addPrinter(data: any) {
  const printer = await prisma.printer.create({ data })
  revalidatePath('/printers')
  return printer
}

export async function updatePrinter(id: number, data: any) {
  const printer = await prisma.printer.update({
    where: { id },
    data
  })
  revalidatePath('/printers')
  return printer
}

export async function deletePrinter(id: number) {
  await prisma.printer.delete({ where: { id } })
  revalidatePath('/printers')
}

// History
export async function getHistory(assetId?: number) {
  if (assetId) {
    return await prisma.assetHistory.findMany({
      where: { asset_id: assetId },
      orderBy: { tarikh_tukar: 'desc' }
    })
  }
  return await prisma.assetHistory.findMany({
    orderBy: { tarikh_tukar: 'desc' },
    include: { asset: true }
  })
}
