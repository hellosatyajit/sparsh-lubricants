import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{auth.user.name}</span>
                        <span className="text-muted-foreground truncate text-xs">{auth.user.email}</span>
                    </div>
                </div>
                <Button variant="destructive" asChild>
                    <Link className="block w-full cursor-pointer" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                        <LogOutIcon className="mr-2" />
                        Log out
                    </Link>
                </Button>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
