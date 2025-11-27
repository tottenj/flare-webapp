'use server';
import userService from '@/lib/prisma/services/UserService/userService';
import { CreateUserDto } from '@/lib/prisma/dtos/UserDto';
import { ActionResponse } from '../types/ActionResponse';

export default async function createFlareUserFromSession({
  accountType,
  email,
}: {
  accountType: 'user' | 'org';
  email: string;
}): Promise<ActionResponse> {
  const dto: CreateUserDto = {
    email,
    account_type: accountType,
  };
  const service = new userService();
  try {
    await service.createUser(dto);
    return { status: 'success', message: 'Flare user created successfully' };
  } catch (error) {
    return { status: 'error', message: 'Error creating Flare user' };
  }
}
