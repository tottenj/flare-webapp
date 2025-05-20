"use client"

import { useActionState, useState } from "react"
import PrimaryButton from "../primaryButton/PrimaryButton"
import Modal from "@/components/modals/mainModal/MainModal"
import addEvent from "@/lib/formActions/addEvent/addEvent"
import { useActionToast } from "@/lib/hooks/useActionToast/useActionToast"

export default function AddEventButton() {
  const initialState = {message: ''}
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, pending] = useActionState(addEvent, initialState)

  useActionToast(state, pending, {
    successMessage: "YAY",
    loadingMessage: "loading"
  })

  return (
    <>
    <PrimaryButton size="small" text="Add Event" click={() => setIsOpen(true)}/>
    <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <form action={action}>
            <h3 className="font-nunito font-bold text-center text-lg">Add Event</h3>
        </form>
    </Modal>
    </>
  )
}