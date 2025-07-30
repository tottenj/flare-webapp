"use client"

import PrimaryButton from "@/components/buttons/primaryButton/PrimaryButton";
import PlaceSearch from "@/components/inputs/placeSearch/PlaceSearch";
import TextArea from "@/components/inputs/textArea/TextArea";
import TextInput from "@/components/inputs/textInput/TextInput";
import FlareOrg, { PlainOrg } from "@/lib/classes/flareOrg/FlareOrg";
import editOrganization from "@/lib/formActions/editOrganization/editOrganization";
import { useActionToast } from "@/lib/hooks/useActionToast/useActionToast";
import flareLocation from "@/lib/types/Location";
import { useActionState, useState } from "react";

export default function EditOrgForm({org}: {org: PlainOrg}) {
    const [state, action, pending] = useActionState(editOrganization, {message: ""})
    const [loc, setloc] = useState<flareLocation | null>(null);
    

    useActionToast(state, pending, {successMessage: "Edited My Information", loadingMessage: "loading"})

  return (
    <form action={action}>
      <h1>Edit My Details</h1>
      <TextInput label="Organization Name" name="name" defaultVal={org.name} />
      <TextInput type="email" label="Email" name="email" defaultVal={org.email || ''} />
      <PlaceSearch
        lab="Location"
        loc={setloc}
        defVal={{ label: org.locationName || '', value: org.locationId || '' }}
      />
      {loc && <input type="hidden" name="location" required={true} value={JSON.stringify(loc)} />}
      <PrimaryButton text="Submit" type="submit" />
    </form>
  );
}
