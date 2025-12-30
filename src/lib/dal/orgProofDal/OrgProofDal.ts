import { ImageMetadata } from "@/lib/schemas/proof/ImageMetadata";
import { Prisma } from "@prisma/client";
import {prisma} from "../../../../prisma/prismaClient"

export class OrgProofDal{
    async create(orgId: string, input: ImageMetadata[], tx?:Prisma.TransactionClient){
        const client = tx ?? prisma
        return await client.orgProofFile.createMany({
            data: input.map((proof) => ({
                organizationId: orgId,
                platform: proof.platform,
                storagePath: proof.storagePath,
                contentType: proof.contentType,
                sizeBytes: proof.sizeBytes,
                originalName: proof.originalName
            }))
        })
    }
}

export const orgProofDal = new OrgProofDal()