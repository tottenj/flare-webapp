"use client"
import PrimaryButton from "@/components/buttons/primaryButton/PrimaryButton";
import TextInput from "@/components/inputs/textInput/TextInput";
import FlareUser, { PlainUser } from "@/lib/classes/flareUser/FlareUser";
import editUser from "@/lib/formActions/editUser/editUser";
import useCustomUseForm from "@/lib/hooks/useForm/useCustomUseForm";

export default function EditUserForm({close, user}: {close?: () => void, user?: PlainUser}) {
  const {action} = useCustomUseForm(editUser, "Edited Information", undefined, close)


  return (
    <div className="flex flex-col gap-4">
      <h1>Edit My Profile</h1>
      <form action={action}>
        <TextInput defaultVal={user?.name ?? ""} label="Name" name="name" size="Medium"/>
        <PrimaryButton type="submit" text="Submit" />
      </form>
    </div>
  );
}