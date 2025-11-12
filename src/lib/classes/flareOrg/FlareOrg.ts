import { FlareOrg as FlareOrgModel } from '@/app/generated/prisma';
import FlareOrgService from '@/lib/prisma/services/FlareOrgService/flareOrgService';
import { createOrgDtoType } from '@/lib/prisma/dtos/FlareOrgDto';
import { CreateUserDto } from '@/lib/prisma/dtos/UserDto';
import userService from '@/lib/prisma/services/UserService/userService';

export default class FlareOrg {
  private service: FlareOrgService;
  private data: Partial<FlareOrgModel>;

  constructor(data: FlareOrgModel) {
    this.data = data;
    this.service = new FlareOrgService();
  }

  static async create(userData: CreateUserDto, data: createOrgDtoType) {
    const { account_type, ...rest } = userData;
    const toSend: CreateUserDto = { account_type: 'org', ...rest };
    const service = new userService();
    await service.createUser(toSend, data);
  }
}
