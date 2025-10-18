import { getCurrentUser } from '@/lib/supabase/actions';
import { signOut } from '../auth/sign-in/actions';

const DashboardPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className='mx-auto p-4'>
      <h1 className='text-white'>Dashboard</h1>
      <p className='text-white'>User Information: {user?.user_metadata.full_name}</p>
      <form>
        <button
          className='text-white hover:text-white/50 cursor-pointer'
          formAction={signOut}
        >
          Logout
        </button>
      </form>
    </div>
  );
};

export default DashboardPage;
