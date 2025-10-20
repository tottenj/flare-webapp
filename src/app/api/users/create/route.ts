import { CreateUserDto } from '@/lib/prisma/dtos/UserDto';
import userService from '@/lib/prisma/services/userService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const service = new userService();

  try {
    const data = await req.json();
    const userData:CreateUserDto = {account_type: data.account_type, email: data.email}
    await service.createUser(userData);
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    await service.deleteUser();
    return NextResponse.json('Server Error', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}
