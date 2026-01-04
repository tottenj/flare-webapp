import z from "zod";

export const ImageMetadataSchema= z.object({
      storagePath: z.string(),
      contentType: z.string().optional(),
      sizeBytes: z.number().optional(),
      originalName: z.string().optional(),
})


export type ImageMetadata = z.infer<typeof ImageMetadataSchema>;
