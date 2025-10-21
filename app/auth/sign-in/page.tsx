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
    <div className='mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='min-h-[calc(100vh-250px)] flex flex-col justify-center items-center'>
        {/* Header Section */}
        <div className='text-center mb-14'>
          <h1 className='text-5xl font-bold tracking-tight text-white mb-4'>Welcome!</h1>
          <p className='text-2lg text-subtitle mx-auto font-light'>
            Sign in to save your palettes, access them anywhere, and share with the community.
          </p>
        </div>

        {/* Sign In Section */}
        <div className='space-y-8 text-center'>
          <button
            className='flex flex-row justify-center items-center w-96 bg-primary p-4 gap-x-2 rounded-2xl text-white font-bold hover:bg-primary/90 cursor-pointer'
            onClick={handleGoogleSignIn}
            type='button'
          >
            <span className='bg-white rounded-full'>
              <FcGoogle size={20} />
            </span>
            Continue with Google
          </button>
          <div>
            <Link prefetch={false} href='/' className='text-sm text-subtitle hover:text-white/70 underline'>
              Go back to Palette
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
