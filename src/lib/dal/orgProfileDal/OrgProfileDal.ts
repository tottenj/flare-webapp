import { OrgProfileDomainProps } from "@/lib/domain/orgProfileDomain/OrgProfileDomain";
import { prisma } from '../../../../prisma/prismaClient';
import { Prisma } from "@prisma/client";




export class OrgProfileDal{
    async create(input: OrgProfileDomainProps, tx?:Prisma.TransactionClient){
        const client = tx ?? prisma
        const org = await client.organizationProfile.create({data: input})
        return org
    }

}

export const orgProfileDal = new OrgProfileDal()