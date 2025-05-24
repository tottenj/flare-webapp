import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import Logo from '@/components/flare/logo/Logo';
import LinkInput from '@/components/inputs/link/LinkInput';
import Image from 'next/image';
import Link from 'next/link';

export default function Confirmation() {
  return (
    <div className="gradientBackFull flex items-center justify-center">
      <div className="flex h-1/2 w-1/2 flex-col items-center justify-around rounded-xl bg-white p-4 text-center">
        <div>
          <Logo size={150} />
        </div>
        <div>
          <h1>Thank You For Signing Up!</h1>
          <p>Please Check Your Email To Verify Your Account!</p>
        </div>
       <LinkInput text='Go To Login' href='/signin'/>
      </div>
    </div>
  );
}




