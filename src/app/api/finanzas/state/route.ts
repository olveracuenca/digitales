import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const config = await prisma.finanzasState.findUnique({
      where: { id: 'default' }
    });

    const debts = await prisma.finanzasDebt.findMany();
    const fixedExpenses = await prisma.finanzasFixedExpense.findMany();
    const transactions = await prisma.finanzasTransaction.findMany({ orderBy: { fecha: 'desc' } });
    const cajitas = await prisma.finanzasCajita.findMany();
    const cajitasMovimientos = await prisma.finanzasCajitaMovement.findMany({ orderBy: { fecha: 'desc' } });
    const paidItems = await prisma.finanzasPaidItem.findMany();

    const paidItemsByWeek: Record<string, boolean> = {};
    paidItems.forEach(item => {
      paidItemsByWeek[item.key] = item.value;
    });

    if (!config && debts.length === 0 && fixedExpenses.length === 0) {
       // Return empty so the frontend uses its defaults
       return NextResponse.json({ state: null });
    }

    const state = {
      sueldoMensual: config?.sueldoMensual ?? 20000,
      ahorroMeta: config?.ahorroMeta ?? 2000,
      gustosMeta: config?.gustosMeta ?? 1500,
      imprevistosMeta: config?.imprevistosMeta ?? 1050,
      debts,
      fixedExpenses,
      transactions,
      cajitas,
      cajitasMovimientos,
      paidItemsByWeek
    };

    return NextResponse.json({ state });
  } catch (error) {
    console.error('Error fetching finanzas state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { state } = await req.json();
    
    if (!state) {
      return NextResponse.json({ error: 'No state provided' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.finanzasState.upsert({
        where: { id: 'default' },
        update: {
          sueldoMensual: state.sueldoMensual,
          ahorroMeta: state.ahorroMeta,
          gustosMeta: state.gustosMeta,
          imprevistosMeta: state.imprevistosMeta
        },
        create: {
          id: 'default',
          sueldoMensual: state.sueldoMensual,
          ahorroMeta: state.ahorroMeta,
          gustosMeta: state.gustosMeta,
          imprevistosMeta: state.imprevistosMeta
        }
      });

      await tx.finanzasDebt.deleteMany();
      if (state.debts && state.debts.length > 0) {
        await tx.finanzasDebt.createMany({
          data: state.debts.map((d: any) => ({
            id: d.id,
            nombre: d.nombre,
            acreedor: d.acreedor,
            inicial: d.inicial,
            mensual: d.mensual,
            dia: d.dia,
            quincena: d.quincena,
            restante: d.restante,
            fin: d.fin,
            color: d.color
          }))
        });
      }

      await tx.finanzasFixedExpense.deleteMany();
      if (state.fixedExpenses && state.fixedExpenses.length > 0) {
        await tx.finanzasFixedExpense.createMany({
          data: state.fixedExpenses.map((f: any) => ({
            id: f.id,
            concepto: f.concepto,
            categoria: f.categoria,
            monto: f.monto,
            dia: f.dia,
            quincena: f.quincena,
            pagado: f.pagado || false
          }))
        });
      }

      await tx.finanzasTransaction.deleteMany();
      if (state.transactions && state.transactions.length > 0) {
        await tx.finanzasTransaction.createMany({
          data: state.transactions.map((t: any) => ({
            id: t.id,
            fecha: t.fecha,
            semanaNum: t.semanaNum,
            concepto: t.concepto,
            categoria: t.categoria,
            metodo: t.metodo,
            monto: t.monto,
            tipo: t.tipo,
            paidKey: t.paidKey || null,
            debtId: t.debtId || null,
            cmovId: t.cmovId || null,
            cajitaId: t.cajitaId || null
          }))
        });
      }

      await tx.finanzasCajita.deleteMany();
      if (state.cajitas && state.cajitas.length > 0) {
        await tx.finanzasCajita.createMany({
          data: state.cajitas.map((c: any) => ({
            id: c.id,
            nombre: c.nombre,
            tipoCajita: c.tipoCajita || 'AHORRO',
            asignado: c.asignado || 'Mío',
            color: c.color || 'indigo',
            icono: c.icono || 'wallet',
            meta: c.meta || 0,
            limiteCredito: c.limiteCredito || 0,
            diaCorte: c.diaCorte || 1,
            diaPago: c.diaPago || 15,
            descripcion: c.descripcion || '',
            creadaEn: c.creadaEn || new Date().toISOString()
          }))
        });
      }

      await tx.finanzasCajitaMovement.deleteMany();
      if (state.cajitasMovimientos && state.cajitasMovimientos.length > 0) {
        await tx.finanzasCajitaMovement.createMany({
          data: state.cajitasMovimientos.map((m: any) => ({
            id: m.id,
            cajitaId: m.cajitaId,
            txId: m.txId || null,
            tipo: m.tipo,
            monto: m.monto,
            concepto: m.concepto,
            fecha: m.fecha,
            creadoEn: m.creadoEn || new Date().toISOString()
          }))
        });
      }

      await tx.finanzasPaidItem.deleteMany();
      if (state.paidItemsByWeek) {
        const paidItemData = Object.entries(state.paidItemsByWeek).map(([key, value]) => ({
          key,
          value: Boolean(value)
        }));
        if (paidItemData.length > 0) {
          await tx.finanzasPaidItem.createMany({
            data: paidItemData
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving finanzas state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
