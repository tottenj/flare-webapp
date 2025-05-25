"use client"

import Modal from "@/components/modals/mainModal/MainModal"
import useUnifiedUser from "@/lib/hooks/useUnifiedUser"
import { useState } from "react"

export default function AddEventForm() {
    const user  = useUnifiedUser()
    const [open, setOpen] = useState(false)

    if(!user.loading && !user){
        
    }

  return (
    <Modal isOpen={open} onClose={() => {}}>
        <form>


            <input type="hidden" value={user.user?.uid}/>
        </form>
    </Modal>
  )
}