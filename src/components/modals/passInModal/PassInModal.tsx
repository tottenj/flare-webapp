import { useState } from "react";
import Modal from "../mainModal/MainModal";

export default function PassInModal({children}: {children: React.ReactNode}) {
  const [open, setOpen] = useState(false)

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      {children}
    </Modal>
  );
}
