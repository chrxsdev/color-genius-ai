import type { ReactNode } from 'react';

interface HomePageProps {
  children?: ReactNode;
}

const HomePage = ({}: HomePageProps) => {
  return (
    <main>
      <header>
        <h1>Welcome to Color Genius AI</h1>
        <p>Your AI-powered color palette generator</p>
      </header>
    </main>
  );
};

export default HomePage;