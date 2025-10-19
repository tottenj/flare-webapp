"use server"

import { convertFormData } from "@/lib/zod/convertFormData"
import { CreateOrgSchema } from "@/lib/zod/org/createOrgSchema"

export default async function signUpOrg(formData:FormData) {
    const result = convertFormData(CreateOrgSchema, formData)
    if(!result.success) throw new Error("Invalid Organization Data")
    const {data} = result
    if(data.password != data.confirmPassword) throw new Error("Passwords must match")
    
    
    

}