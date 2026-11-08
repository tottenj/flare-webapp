import GoogleSignInButton from '@/components/buttons/googleButton/SignInWithGoogleButton';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import FlareLogo from '@/components/flare/configurableLogo/ConfigurableLogo';
import UserAuthFormContainer from '@/components/forms/userAuthForm/UserAuthFormContainer';
import HeroSeparatorWithContent from '@/components/ui/HeroSeparator/HeroSeparatorWithContent';

export default function UserAuthPresentational({ isSignup = false }: { isSignup?: boolean }) {
  return (
    <div className="grid w-full grid-cols-1 overflow-hidden rounded-md shadow-md md:grid-cols-2">
      <div className="dark text-foreground bg-surface hidden h-full flex-col gap-8 text-xl text-balance md:flex md:p-12">
        <div className="flex flex-col gap-4">
          <p className="text-accent font-bold uppercase">Welcome to Flare</p>
          <p className="font-heading text-4xl font-bold">Your Next Experience Starts Here</p>
        </div>
        <p className="text-muted">Find your people. Discover events and communities around you.</p>

        <FlareLogo size={300} showWordmark={false} />

        <p className="text-muted">Ignite Community</p>
      </div>
      <div className="light bg-surface text-foreground flex flex-col gap-4 p-12 text-lg md:text-xl">
        <h1 className="text-2xl font-bold md:text-4xl">
          {isSignup ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="text-muted">{isSignup ? 'Join the Community' : 'Sign in to continue'}</p>

        <div className="flex flex-1 flex-col justify-end gap-8">
          <div className="flex flex-col gap-4">
            <GoogleSignInButton signIn={!isSignup} />
            <HeroButton fullWidth variant="outline">
              Continue With Apple
            </HeroButton>
          </div>

          <HeroSeparatorWithContent className="flex-1">
            <p className="text-muted text-base">
              {isSignup ? 'or sign up with email' : 'or sign in with email'}
            </p>
          </HeroSeparatorWithContent>
          <UserAuthFormContainer isSignup={isSignup} />

          <p className="text-muted text-center text-lg text-balance">
            {isSignup ? 'Already Have An Account?' : "Don't Have An Account?"}{' '}
            <a
              href={isSignup ? '/signin' : '/signup'}
              className="text-accent hover:text-accent-hover transition-all duration-300 ease-in-out"
            >
              {isSignup ? 'Log In' : 'Sign Up'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
