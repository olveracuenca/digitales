"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { deleteInvitation } from "@/app/actions/invitation";
import styles from "../users/users.module.css";
import { useRouter } from "next/navigation";

export default function DeleteInvitationButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta invitación? Esta acción no se puede deshacer.")) {
      return;
    }
    setLoading(true);
    const res = await deleteInvitation(id);
    setLoading(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Error al eliminar");
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading} className={styles.editBtn} style={{color: '#ef4444', opacity: loading ? 0.5 : 1}} title="Eliminar Invitación">
      <Trash size={16} />
    </button>
  );
}
