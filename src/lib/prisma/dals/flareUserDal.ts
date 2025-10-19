import prisma from '../prisma';

export default class flareUserDal {
  async createFlareUser(id: string) {
    await prisma.flareUser.create({
      data: {
        user_id: id,
      },
    });
  }
}
