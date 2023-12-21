'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiBoxList, CiHome, CiShoppingCart } from "react-icons/ci";
import clsx from 'clsx';

const links = [
  {
    title: 'General',
    href: '/',
    icon: <CiHome />,
  },
  {
    title: 'Inventario',
    href: '/dashboard/stock',
    icon: <CiBoxList />,
  },
  {
    title: 'Crédito',
    href: '/dashboard/creditControl',
    icon: <CiShoppingCart />,
  },
];

export default function SideNav() {
  const pathName = usePathname()
  return (
    <nav className="flex items-center justify-center py-6">
      <ul className="flex flex-col gap-11 items-center">
        {
          links.map((link) => {
            return (
              <li key={link.title}>
                <Link
                  key={link.title}
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
                  <div className={clsx("opacity-0 invisible bg-gray-600 text-white text-sm rounded p-2 absolute top-1/2 left-full ml-2 transform -translate-y-1/2 transition-opacity duration-300 group-hover:opacity-100 group-hover:visible", {
                    "scale-75 left-2/3": pathName !== link.href
                  })}>
                    {link.title}
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
