import { CreateDbUserSchema } from '@/lib/prisma/dtos/UserDto';
import userService from '@/lib/prisma/services/userService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const service = new userService();

  try {
    const data = await req.json();
    const {account_type, email} = data
    const dto = CreateDbUserSchema.safeParse({account_type, email});
    if (!dto.success)
      return NextResponse.json('Invalid data', {
        status: 400,
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    await service.createUser(dto.data);
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
