import { FlareUser as FlareUserModel } from '@/app/generated/prisma';
import { CreateUserDto } from '@/lib/prisma/dtos/UserDto';
import userService from '@/lib/prisma/services/userService';
import FlareUserService from '@/lib/prisma/services/FlareUserService/flareUserService';

export default class FlareUser {
  private service: FlareUserService;
  private data: Partial<FlareUserModel>;

  constructor(data: FlareUserModel) {
    this.data = data;
    this.service = new FlareUserService();
  }

  static async create(userData: CreateUserDto) {
    const { account_type, ...rest } = userData;
    const toSend: CreateUserDto = { account_type: 'org', ...rest };
    const service = new userService();
    await service.createUser(toSend);
  }
}
