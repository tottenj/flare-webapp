"use server"

import { ActionResponse } from "@/lib/types/ActionResponse"
import { zodFieldErrors } from "@/lib/utils/error/zodFeildErrors"
import { convertFormData } from "@/lib/zod/convertFormData"
import { CreateOrgSchema } from "@/lib/zod/org/createOrgSchema"

export default async function signUpOrg(formData:FormData): Promise<ActionResponse> {
    const result = convertFormData(CreateOrgSchema, formData)
    if(!result.success) return {status: "error", message:"Invalid Data", errors:zodFieldErrors(result.error)}
    const {data} = result
    if(data.password != data.confirmPassword) return {status:"error", message:"Passwords must match"}

    return {status:"success", message:"Created Organization"}
    
    
    

}