import { Prisma } from '@/app/generated/prisma';
import prisma from '../prisma';

export default class UserDal {
  async createUser(data: any) {
    return await prisma.user.create({
      data,
    });
  }

  async getOne(id:string , select: Prisma.UserSelect){
    return await prisma.user.findUnique({
      where:{id},
      select
    })
  }


  async delete(id:string){
    await prisma.user.delete({
      where:{id}
    })
  }
}
