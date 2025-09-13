import Logo from '@/components/flare/logo/Logo';
import PrimaryLink from '@/components/Links/PrimaryLink/PrimaryLink';

export default function Confirmation() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="flex h-auto min-h-1/2 w-3/4 flex-col items-center justify-around gap-2 rounded-xl bg-white p-4 text-center lg:w-1/2">
        <div>
          <Logo size={100} />
        </div>
        <div>
          <h1>Thank You For Signing Up!</h1>
          <p>Please Check Your Email To Verify Your Account!</p>
        </div>
        
        <div className="flex w-3/4 justify-center">
          <PrimaryLink link="/signin" linkText="Go To Login" />
        </div>
      </div>
    </div>
  );
}
