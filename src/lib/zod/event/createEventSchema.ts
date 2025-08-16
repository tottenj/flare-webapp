import z from "zod";

export const CreateEventSchema =  z.object({
    title: z.string(),
    description: z.string().optional(),
    

})