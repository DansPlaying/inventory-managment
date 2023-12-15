'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, Cart, Inventory } from "./icons";


const links = [
    {
        title: 'General',
        href: '/',
        icon: HomeIcon,
    },
    {
        title: 'Inventario',
        href: '/stock',
        icon: Inventory,
    },
    {
        title: 'Crédito',
        href: '/creditControl',
        icon: Cart,
    },
];


export default function SideNav() {
    // const pathName = usePathname()
    return (
        <nav className="relative ">
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.title}
                        href={link.href}
                        className="flex grow items-center justify-center"
                    >
                        <LinkIcon />
                    </Link>
                );
            })}
        </nav>
    );
}