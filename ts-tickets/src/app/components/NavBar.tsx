'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Film, Calendar, Building, Ticket, Users } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import useAuth from "@/hooks/useAuth";
import {useAuthContext} from "@/contexts/AuthContext";
import {Button} from "@/components/ui/button";

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Movies Management', href: '/movies', icon: Film },
    { name: 'Séances Management', href: '/seances', icon: Calendar },
    { name: 'Salles Management', href: '/salles', icon: Building },
    { name: 'Reservations & Tickets', href: '/reservations', icon: Ticket },
    { name: 'Users Management', href: '/users', icon: Users },
];

const Navbar = () => {
    const pathname = usePathname();


    const {isLoggedIn} = useAuthContext();

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>

                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {
                                menuItems.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} passHref>
                                            <NavigationMenuLink
                                                className={cn(
                                                    'flex items-center justify-between px-4 py-2 rounded-lg',
                                                    pathname === item.href
                                                        ? 'bg-primary text-background'
                                                        : 'text-primary',
                                                )}
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {item.name}
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink className="flex items-center justify-between px-4 py-2 rounded-lg">
                            Documentation
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default Navbar;
