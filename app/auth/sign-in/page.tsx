'use client';

import { FcGoogle } from 'react-icons/fc';

export const SignIn = () => {
  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='min-h-[calc(100vh-250px)] flex flex-col justify-center items-center'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold tracking-tight text-white mb-4'>Welcome!</h1>
          <p className='text-2lg text-subtitle mx-auto font-light'>
            Sign In to access your saved palettes and start sharing with the community.
          </p>
        </div>

        {/* Sign In Section */}
        <div className='space-y-4'>
          <button
            className='flex flex-row justify-center items-center min-w-xl bg-primary p-4 gap-x-2 rounded-2xl text-white font-bold hover:bg-primary/90 cursor-pointer'
            onClick={() => console.log('sign in with google...')}
            type='button'
          >
            <span className='bg-white rounded-full'>
              <FcGoogle size={20} />
            </span>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
