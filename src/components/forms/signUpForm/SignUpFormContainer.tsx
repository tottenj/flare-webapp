'use client';
import { useRouter } from "next/navigation";
import SignUpFormPresentational from "./SignUpFormPresentational";
import firebaseSignUpHelper from "@/lib/auth/firebaseSignUpHelper";
import { signUpAction } from "@/lib/auth/signUpAction";
import { signOut } from "firebase/auth";
import { useFormAction } from "@/lib/hooks/useFormAction";
import { auth } from "@/lib/firebase/auth/configs/clientApp";
import { ActionResult } from "@/lib/types/ActionResult";

export default function SignUpFormContainer() {
  const router = useRouter();
  
    async function submitAction(formData: FormData): Promise<ActionResult<null>> {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
  
      try {
        const idToken = await firebaseSignUpHelper(email, password)
        const result = await signUpAction({ idToken });
        await signOut(auth);
        return result;
      } catch {
        return {
          ok: false,
          error: {
            code: 'CLIENT_SIGNUP_FAILED',
            message: 'Unable to sign up. Please try again.',
          },
        };
      }
    }
  
    const { action, pending, error, validationErrors } = useFormAction(submitAction, {
      onSuccess: () => {
        router.push('/confirmation');
      },
    });



  return (
    <SignUpFormPresentational
      pending={pending}
      error={error?.message}
      validationErrors={validationErrors}
      onSubmit={action}
    />
  );
}
