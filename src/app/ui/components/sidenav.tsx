'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiBoxList, CiHome, CiShoppingCart } from "react-icons/ci";

const links = [
  {
    title: 'General',
    href: '/',
    icon: <CiHome />,
  },
  {
    title: 'Inventario',
    href: '/stock',
    icon: <CiBoxList />,
  },
  {
    title: 'Crédito',
    href: '/creditControl',
    icon: <CiShoppingCart />,
  },
];

export default function SideNav() {
  // const pathName = usePathname()
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
                  className="block text-light text-2xl"
                >
                  {link.icon}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
