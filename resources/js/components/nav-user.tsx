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
            <SidebarMenuItem className='space-y-2'>
                <Button variant="outline" asChild>
                    <Link href="/settings" className="h-auto w-full flex items-center gap-2 text-left text-sm">
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{auth.user.name}</span>
                            <span className="text-muted-foreground truncate text-xs">{auth.user.email}</span>
                        </div>
                    </Link>
                </Button>
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
