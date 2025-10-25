import { handleSignUp } from '@/lib/formActions/auth/signUpHandlers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
 
  try {
    const contentType = req.headers.get('content-type') || '';
    let accountType: string | undefined;
    let formData: FormData;

    if (contentType.includes('application/json')) {
      // ✅ If JSON
      const body = await req.json();
      accountType = body.account_type;
      formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    } else {
      
      formData = await req.formData();
      accountType = formData.get('account_type') as string;
    }

    if (!accountType) return NextResponse.json({ error: 'Missing account type' }, { status: 400 });

    const result = await handleSignUp(accountType, formData);

    const statusCode = result.status === 'success' ? 200 : 400;
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
