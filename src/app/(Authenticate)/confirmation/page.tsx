import { buttonVariants } from '@heroui/react';
import FlareLogo from '@/components/flare/configurableLogo/ConfigurableLogo';
import Link from 'next/link';
import HeroCard from '@/components/ui/HeroCard/HeroCard';

export default function Confirmation() {
  return (
    <HeroCard className="mt-8 mx-auto w-full max-w-lg text-center">
      <HeroCard.Content className="flex flex-col items-center gap-8 p-8 sm:p-12">
        <FlareLogo size={150} showWordmark={false} />

        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-3xl font-bold">Check Your Email!</h1>

          <p className="text-muted">
            Thanks for signing up! We've sent you a verification link. Please check your inbox to
            activate your account.
          </p>
        </div>

        <Link href="/signin" className={buttonVariants({ variant: 'primary' })}>
          Go to Login
        </Link>
      </HeroCard.Content>
    </HeroCard>
  );
}
