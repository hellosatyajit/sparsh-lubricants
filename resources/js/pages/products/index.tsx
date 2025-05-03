import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Product, productFormSchema } from '@/lib/schema';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';

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
    products: PaginatedData<Product>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

export default function Products({ products }: Props) {
    console.log(products);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const form = useForm({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            category: '',
            description: '',
            price: 0,
        },
    });

    useEffect(() => {
        if (isAddOpen) {
            form.setValue('name', '');
            form.setValue('category', '');
            form.setValue('description', '');
            form.setValue('price', 0);
            setSelectedProduct(null);
        }
    }, [isAddOpen]);

    const onSubmit = async (data: any) => {
        if (selectedProduct) {
            await router.put(`/products/${selectedProduct.id}`, data, {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedProduct(null);
                    form.reset();
                },
            });
        } else {
            await router.post('/products', data, {
                onSuccess: () => {
                    setIsAddOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        form.reset({
            name: product.name,
            category: product.category || '',
            description: product.description || '',
            price: product.price,
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (id: number) => {
        await router.delete(`/products/${id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedProduct(null);
            },
        });
    };

    const AddProductDialog = () => (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
                <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }: { field: FieldValues }) => (
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
                            name="category"
                            render={({ field }: { field: FieldValues }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }: { field: FieldValues }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }: { field: FieldValues }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
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

    return (
        <AppLayout breadcrumbs={breadcrumbs} cta={<AddProductDialog />}>
            <Head title="Products" />
            <div className="mx-auto w-full max-w-7xl p-2 sm:p-6 lg:p-8">
                <div className="rounded-lg border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-4">Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="max-w-52">Description</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="pl-4">{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell className="max-w-52 truncate" title={product.description || ''}>
                                        {product.description}
                                    </TableCell>
                                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                                Edit
                                            </Button>
                                            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" size="sm" onClick={() => setSelectedProduct(product)}>
                                                        Delete
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Product</DialogTitle>
                                                    </DialogHeader>
                                                    <p>Are you sure you want to delete this product?</p>
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button variant="destructive" onClick={() => handleDelete(product.id!)}>
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
                </div>
                {products.last_page > 1 && (
                    <div className="flex items-center justify-between border-t px-4 py-3">
                        <div className="flex flex-1 justify-between sm:hidden"></div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{products.from}</span> to <span className="font-medium">{products.to}</span>{' '}
                                    of <span className="font-medium">{products.total}</span> results
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={products.current_page === 1}
                                    onClick={() => router.get(`/products?page=${products.current_page - 1}`)}
                                >
                                    <ChevronLeftIcon />
                                </Button>
                                {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === products.current_page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => router.get(`/products?page=${page}`)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={products.current_page === products.last_page}
                                    onClick={() => router.get(`/products?page=${products.current_page + 1}`)}
                                >
                                    <ChevronRightIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }: { field: FieldValues }) => (
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
                                name="category"
                                render={({ field }: { field: FieldValues }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }: { field: FieldValues }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }: { field: FieldValues }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Save</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
