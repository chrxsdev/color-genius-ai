import { getCurrentUser } from '@/actions/auth.actions';
import { AppLayoutClient } from '@/presentation/components/layouts';

const AppLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getCurrentUser();

  return <AppLayoutClient user={user}>{children}</AppLayoutClient>;
};

export default AppLayout;
