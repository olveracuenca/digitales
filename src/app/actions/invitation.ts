"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function getInvitationById(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return null;
    
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return null;

    const inv = await prisma.invitation.findUnique({ where: { id } });
    if (!inv || inv.userId !== user.id) return null;
    
    return inv;
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return null;
  }
}

export async function saveInvitation(templateId: string, data: any, invitationId?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: "No autorizado" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Asegurarse de que exista el template en la DB (mockeado para demo)
    await prisma.template.upsert({
      where: { id: templateId },
      update: {},
      create: {
        id: templateId,
        name: `Plantilla ${templateId}`,
        eventType: "General",
        defaultData: "{}",
      }
    });

    if (invitationId) {
      // Intentar actualizar la invitación existente
      const existing = await prisma.invitation.findUnique({ where: { id: invitationId } });
      if (existing && existing.userId === user.id) {
        const updated = await prisma.invitation.update({
          where: { id: invitationId },
          data: {
            data: JSON.stringify(data),
          }
        });
        return { success: true, slug: updated.slug, id: updated.id };
      }
    }

    // Generar un slug único basado en el eventName o el título
    const baseSlug = (data.eventName || data.title || "evento")
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    
    // Verificar unicidad del slug
    while (await prisma.invitation.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Guardar la invitación
    const invitation = await prisma.invitation.create({
      data: {
        slug,
        userId: user.id,
        templateId,
        data: JSON.stringify(data),
        isPublished: true,
      },
    });

    return { success: true, slug: invitation.slug, id: invitation.id };
  } catch (error) {
    console.error("Error saving invitation:", error);
    return { success: false, error: "Error interno al guardar la invitación" };
  }
}

export async function deleteInvitation(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: "No autorizado" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    const inv = await prisma.invitation.findUnique({ where: { id } });
    if (!inv || inv.userId !== user.id) {
        return { success: false, error: "Invitación no encontrada o no autorizada" };
    }

    await prisma.invitation.delete({
      where: { id },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return { success: false, error: "Error interno al eliminar la invitación" };
  }
}

export async function createGuestPass(invitationId: string, name: string, count: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "No autorizado" };

    const pass = await prisma.guestPass.create({
      data: {
        name,
        passCount: count,
        invitationId
      }
    });
    return { success: true, pass };
  } catch (error) {
    console.error("Error creating pass:", error);
    return { success: false, error: "Error interno al crear el pase" };
  }
}

export async function getGuestPasses(invitationId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "No autorizado" };

    const passes = await prisma.guestPass.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, passes };
  } catch (error) {
    console.error("Error fetching passes:", error);
    return { success: false, error: "Error interno al cargar los pases" };
  }
}

export async function deleteGuestPass(passId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "No autorizado" };

    await prisma.guestPass.delete({
      where: { id: passId }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting pass:", error);
    return { success: false, error: "Error interno al eliminar el pase" };
  }
}

export async function submitRsvp(
  invitationId: string, 
  name: string, 
  status: string, 
  companions: number = 0,
  guestPassId?: string
) {
  try {
    const data: any = {
      invitationId,
      name,
      status,
      companions
    };
    if (guestPassId) {
      data.guestPassId = guestPassId;
    }
    const rsvp = await prisma.rsvp.create({
      data
    });
    return { success: true, rsvp };
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return { success: false, error: "Error interno al procesar la confirmación" };
  }
}

export async function getRsvps(invitationId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "No autorizado" };

    const rsvps = await prisma.rsvp.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, rsvps };
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return { success: false, error: "Error interno al cargar las confirmaciones" };
  }
}
