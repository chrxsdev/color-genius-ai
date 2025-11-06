'use client';

import Link from 'next/link';

interface LinkButtonProps {
  to: string;
  className?: string;
  text: string;
  buttonStyle: 'hyperlink' | 'button';
}

export const LinkButton = ({ to, className = '', text, buttonStyle = 'hyperlink' }: LinkButtonProps) => {
  const linkStyle = {
    hyperlink: {
      className: 'text-white hover:text-primary px-4',
    },
    button: {
      className:
        'flex h-10 items-center justify-center rounded-2xl bg-primary px-5 font-bold text-button-text transition-colors duration-200 ease-in-out hover:bg-primary/90',
    },
  }[buttonStyle];

  return (
    <Link href={to} className={`text-sm cursor-pointer transition-colors ${linkStyle.className} ${className}`}>
      {text}
    </Link>
  );
};
