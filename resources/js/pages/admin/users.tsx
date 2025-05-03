import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import { User, userFormSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
    },
];

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    users: PaginatedData<User>;
}

export default function Users({ users }: Props) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    console.log(users);

    const form = useForm<{
        name: string;
        email: string;
        password: string;
        role: 'admin' | 'sales' | 'guest';
    }>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'guest',
        },
    });

    useEffect(() => {
        if (isAddOpen) {
            form.setValue('name', '');
            form.setValue('email', '');
            form.setValue('password', '');
            form.setValue('role', 'guest');
            setSelectedUser(null);
        }
    }, [isAddOpen]);

    const onSubmit = async (data: any) => {
        data["password_confirmation"] = data["password"];
        if (selectedUser) {
            await router.put(`/admin/users/${selectedUser.id}`, data, {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedUser(null);
                    form.reset();
                },
            });
        } else {
            await router.post('/admin/users', data, {
                onSuccess: () => {
                    setIsAddOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        form.reset({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: number) => {
        await router.delete(`/admin/users/${id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedUser(null);
            },
        });
    };

    const UserFormDialog = ({ isOpen, onOpenChange, title }: { isOpen: boolean; onOpenChange: (open: boolean) => void; title: string }) => (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{selectedUser ? 'New Password (optional)' : 'Password'}</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="sales">Sales</SelectItem>
                                            <SelectItem value="guest">Guest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );

    const AddUserDialog = () => (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
                <Button>Add User</Button>
            </DialogTrigger>
            <UserFormDialog isOpen={isAddOpen} onOpenChange={setIsAddOpen} title="Add New User" />
        </Dialog>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <AdminLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Users" description="Manage users" cta={<AddUserDialog />} />

                    <div className="overflow-hidden rounded-lg border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="pl-4">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="capitalize">{user.role}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                                    Edit
                                                </Button>
                                                <Dialog open={isDeleteOpen && selectedUser?.id === user.id} onOpenChange={setIsDeleteOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => setSelectedUser(user)}>
                                                            Delete
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete User</DialogTitle>
                                                        </DialogHeader>
                                                        <p>Are you sure you want to delete this user?</p>
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button variant="destructive" onClick={() => handleDelete(user.id!)}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {users.last_page > 1 && (
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={users.current_page === 1}
                                    onClick={() => router.get(`/admin/users?page=${users.current_page - 1}`)}
                                >
                                    <ChevronLeftIcon />
                                </Button>
                                {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === users.current_page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => router.get(`/admin/users?page=${page}`)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={users.current_page === users.last_page}
                                    onClick={() => router.get(`/admin/users?page=${users.current_page + 1}`)}
                                >
                                    <ChevronRightIcon />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <UserFormDialog isOpen={isEditOpen} onOpenChange={setIsEditOpen} title="Edit User" />
            </AdminLayout>
        </AppLayout>
    );
}
