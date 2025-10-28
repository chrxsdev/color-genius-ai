import { Avatar } from '@/presentation/components/profile/Avatar';
import { ProfileForm } from '@/presentation/components/profile/ProfileForm';

const ProfilePage = () => {
  return (
    <div className='max-w-7xl mx-auto p-8'>
      <div className='mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tighter text-white'>Profile</h1>
      </div>

      <div className='border-2 border-neutral-variant/20 rounded-xl md:p-10 p-6'>
        <div>
          <p className='text-white text-lg font-bold border-b border-neutral-variant/20 pb-4'>Personal Information</p>
        </div>
        <div className='grid lg:grid-cols-[1fr_2fr] grid-cols gap-8 mt-6'>
          <div className='text-white'>
            <h3 className='font-bold'>Profile Photo</h3>
            <p className='text-subtitle text-sm'>Update your photo and personal details</p>
          </div>
          <div className='flex lg:flex-row flex-col justify-between'>
            <div className='text-center'>
              <Avatar />
            </div>
            <div className='flex-1'>
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
