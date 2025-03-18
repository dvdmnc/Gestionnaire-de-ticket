'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    SidebarProvider,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Film, Calendar, Building, Ticket, Users } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Movies Management', href: '/movies', icon: Film },
    { name: 'Séances Management', href: '/seances', icon: Calendar },
    { name: 'Salles Management', href: '/salles', icon: Building },
    { name: 'Reservations & Tickets', href: '/reservations', icon: Ticket },
    { name: 'Users Management', href: '/users', icon: Users },
];

const AppSidebar = () => {
    const pathname = usePathname();

    return (
        <SidebarProvider>
            <SidebarTrigger className="p-2 text-white bg-gray-700 hover:bg-gray-600">
                Toggle Sidebar
            </SidebarTrigger>
            <Sidebar className="bg-gray-800 text-gray-900">
                <SidebarTrigger className="p-2 text-white bg-gray-700 hover:bg-gray-600">
                    Toggle Sidebar
                </SidebarTrigger>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'flex items-center p-2 rounded-md hover:bg-gray-700',
                                                    pathname === item.href && 'bg-gray-700'
                                                )}
                                            >
                                                <item.icon className="mr-2 h-5 w-5" />
                                                {item.name}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
};

export default AppSidebar;
