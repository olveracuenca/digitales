"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function saveInvitation(templateId: string, data: any) {
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

    return { success: true, slug: invitation.slug };
  } catch (error) {
    console.error("Error saving invitation:", error);
    return { success: false, error: "Error interno al guardar la invitación" };
  }
}
