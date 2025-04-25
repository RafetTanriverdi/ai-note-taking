import Link from 'next/link';
import Image from 'next/image';
import { shadow } from '@rt/styles/utils';
import { Button } from '@rt/components/ui/button';
import DarkModeToggle from '@rt/components/DarkModeToggle';
import LogOutButton from '@rt/components/LogOutButton';
import { getUser } from '@rt/auth/server';

async function Header() {
  const user = await getUser();
  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <Link className="item-end flex gap-2" href="/">
        <Image
          src="/goatius.png"
          height={60}
          width={60}
          alt="Logo"
          className="rounded-full"
          priority
        />
        <h1 className="flex flex-col pb-1 text-2xl leading-6 font-semibold">
          AI <span>Notes</span>
        </h1>
      </Link>
      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild className="hidden sm:block">
              <Link href="/sign-up">SignUp</Link>
            </Button>
            <Button asChild variant={'outline'}>
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
