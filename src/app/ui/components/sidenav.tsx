'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiBoxList, CiHome, CiShoppingCart } from "react-icons/ci";
import clsx from 'clsx';
import ThemeToggle from './theme-toggle';

const links = [
  {
    title: 'Home',
    href: '/',
    icon: <CiHome />,
  },
  {
    title: 'Inventory',
    href: '/dashboard/stock',
    icon: <CiBoxList />,
  },
  {
    title: 'Credit',
    href: '/dashboard/creditControl',
    icon: <CiShoppingCart />,
  },
];

export default function SideNav() {
  const pathName = usePathname()
  return (
    <nav className="flex flex-row md:flex-col items-center justify-between px-4 py-3 md:px-0 md:py-6 md:h-full relative z-[100]">
      <ul className="flex flex-row md:flex-col gap-4 md:gap-11 items-center">
        {
          links.map((link) => {
            return (
              <li key={link.title}>
                <Link
                  href={link.href}
                  className={
                    clsx("block text-2xl p-3 rounded-lg transition-colors group relative", {
                      'text-accentPrimary bg-accentSecondary hover:scale-100': pathName === link.href,
                    }, {
                      'hover:scale-125': pathName !== link.href,
                    }
                    )
                  }
                >
                  {link.icon}
                  <div className={clsx("hidden md:block opacity-0 invisible text-sm rounded p-2 absolute top-1/2 left-full ml-2 transform -translate-y-1/2 transition-opacity duration-300 group-hover:opacity-100 group-hover:visible z-[999] whitespace-nowrap", {
                    "scale-75 left-2/3": pathName !== link.href
                  })}
                  style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid', color: 'var(--color-foreground)' }}
                  >
                    {link.title}
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
      <ThemeToggle />
    </nav>
  );
}
