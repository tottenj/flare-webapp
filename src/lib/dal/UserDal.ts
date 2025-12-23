import { Prisma, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UniqueConstraintError } from "../errors/DalErrors";
import {prisma} from "../../../prisma/prismaClient"


export class UserDal {
  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { firebaseUid },
    });
  }

  async create(input: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({ data: input });
  }

  async createIfNotExists(input: Prisma.UserCreateInput): Promise<User> {
    const existing = await this.findByFirebaseUid(input.firebaseUid);
    if (existing) return existing;
    try{
    return await this.create(input);
    }catch(e){
      if(e instanceof PrismaClientKnownRequestError && e.code === "p2002"){
        throw new UniqueConstraintError()
      }
      throw e
    }
  }

  async markEmailVerified(firebaseUid: string): Promise<User> {
    return await prisma.user.update({
      where: { firebaseUid },
      data: {
        emailVerified: true,
        status: 'ACTIVE',
      },
    });
  }
}

export const userDal = new UserDal();
