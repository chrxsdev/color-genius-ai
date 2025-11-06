import { getProfile } from '@/actions/profile.actions';
import { AppLayoutClient } from '@/presentation/components/layouts';

const AppLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getProfile();

  return <AppLayoutClient user={user.data}>{children}</AppLayoutClient>;
};

export default AppLayout;
