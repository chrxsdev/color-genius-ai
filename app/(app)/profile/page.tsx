import { getProfile } from '@/actions/profile.actions';
import { Avatar } from '@/presentation/components/profile/Avatar';
import { ProfileForm } from '@/presentation/components/profile/ProfileForm';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const { data: profile, error } = await getProfile();

  if (error || !profile) {
    redirect('/auth/sign-in');
  }

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
              <Avatar avatarUrl={profile.avatar_url} username={profile.full_name ?? 'User'} />
            </div>
            <div className='flex-1'>
              <ProfileForm userInfo={{ full_name: profile.full_name ?? '' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
