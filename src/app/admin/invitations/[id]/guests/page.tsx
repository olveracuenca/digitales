import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import GuestList from "./GuestList";

const prisma = new PrismaClient();

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>No autorizado</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return <div>Usuario no encontrado</div>;

  const invitation = await prisma.invitation.findUnique({
    where: { id },
  });

  if (!invitation || invitation.userId !== user.id) {
    notFound();
  }

  const passes = await prisma.guestPass.findMany({
    where: { invitationId: id },
    orderBy: { createdAt: "desc" },
  });

  const rsvps = await prisma.rsvp.findMany({
    where: { invitationId: id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-fade-in" style={{ padding: "2rem" }}>
      <GuestList 
        invitationId={id} 
        initialPasses={passes}
        initialRsvps={rsvps}
        invitationSlug={invitation.slug} 
      />
    </div>
  );
}
