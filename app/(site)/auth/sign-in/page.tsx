'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { signInWithGoogle } from '@/actions/auth.actions';
import { ROUTES } from '@/utils/constants/routes';

export const SignIn = () => {
  const params = useSearchParams();
  const hintedNext = params.get('next') ?? ROUTES.dashboard;

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(hintedNext);
  };

  return (
    <div className='mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 animate__animated animate__fadeInDown'>
      <div className='min-h-[calc(100vh-250px)] flex flex-col justify-center items-center'>
        {/* Header Section */}
        <div className='text-center md:mb-10 mb-8 px-2'>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 sm:mb-4'>Welcome!</h1>
          <p className='text-base text-subtitle mx-auto font-light max-w-md'>
            Sign in to save your palettes, access them anywhere, and share with the community.
          </p>
        </div>

        {/* Sign In Section */}
        <div className='space-y-6 sm:space-y-8 text-center w-full max-w-md px-4'>
          <button
            className='flex flex-row justify-center items-center w-full bg-primary p-3 sm:p-4 gap-x-2 rounded-2xl text-white text-sm sm:text-base font-bold hover:bg-primary/90 cursor-pointer'
            onClick={handleGoogleSignIn}
            type='button'
          >
            <span className='bg-white rounded-full'>
              <FcGoogle size={20} />
            </span>
            Continue with Google
          </button>
          <div className='flex justify-center items-center gap-x-2 flex-wrap'>
            <Link prefetch={false} href='/' className='text-xs sm:text-sm text-subtitle hover:text-white/70 underline'>
              Go back to Palette
            </Link>
            <span className='text-subtitle text-xs sm:text-sm'>or</span>
            <Link prefetch={false} href='/explore' className='text-xs sm:text-sm text-subtitle hover:text-white/70 underline'>
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
