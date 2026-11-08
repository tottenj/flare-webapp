import UserAuthPresentational from '@/components/auth/user/userAuthPresentational/UserAuthPresentational';

export default async function SignIn() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <UserAuthPresentational isSignup={false} />
    </div>
  );
}
