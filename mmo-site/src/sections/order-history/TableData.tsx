import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { PageResponse } from '@/models/pageResponse'
import { Link } from 'react-router-dom'
import { OrderResponse } from '@/models/order'
import { fDate } from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import { CloudDownloadIcon, Trash2Icon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { deleteManyOrders, deleteOrder } from '@/store/order/orderSlice'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'

type TableDataProps = {
    orderData: PageResponse<OrderResponse>;
}

const TableData: React.FC<TableDataProps> = ({ orderData }) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const isAllSelected = selectedIds.length === orderData.content?.length;

    const dispatch = useDispatch<AppDispatch>();

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(orderData.content?.map(item => item.id) || []);
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDownload = (fileName: string, accounts: string) => {
        const blob = new Blob([accounts ? accounts : ''], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleDelete = async (id: string) => {
        try {
            dispatch(deleteOrder(id))
            toast({
                title: 'Delete order Successful',
                description: 'Your order has been deleted successfully!',
            })
        } catch (error) {
            toast({
                title: 'Delete order failed',
                description: 'Your order deletion failed!',
            })
        }
    }

    const handleDeleteMany = async () => {
        try {
            dispatch(deleteManyOrders(selectedIds))
            toast({
                title: 'Delete many orders Successful',
                description: 'Your orders have been deleted successfully!',
            })
        } catch (error) {
            toast({
                title: 'Delete many orders failed',
                description: 'Your orders deletion failed!',
            })
        }
    }

    return (
        <>
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-5 mb-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant='destructive'>
                                <Trash2Icon size={18} className='me-2' />
                                {t('delete')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{t('deleteConfirm')}</DialogTitle>
                                <DialogDescription>
                                    {t('deleteConfirmDescription')}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-center">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        {t('cancel')}
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="button" variant='destructive' onClick={handleDeleteMany}>
                                        {t('yes')}
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <p>Delete {selectedIds.length} orders</p>
                </div>
            )}
            <Table className='rounded-2xl bg-gray-100 dark:bg-slate-900'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-8">
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={toggleSelectAll}
                            />
                        </TableHead>
                        <TableHead>{t('orderCode')}</TableHead>
                        <TableHead className="text-center">{t('product')}</TableHead>
                        <TableHead className="text-end">{t('quantity')}</TableHead>
                        <TableHead className="text-end">{t('amount')}</TableHead>
                        <TableHead className='text-center'>{t('time')}</TableHead>
                        <TableHead className='text-center'>{t('action')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orderData.content?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium text-center dark:text-white">
                                <Checkbox
                                    checked={selectedIds.includes(item.id)}
                                    onCheckedChange={() => toggleSelect(item.id)}
                                />
                            </TableCell>
                            <TableCell className={cn("dark:text-white", !item.isDeleted && "font-semibold")}>
                                {item.isDeleted ? (
                                    <span>{item.orderCode}</span>
                                ) : (
                                    <Link to={`/order/${item.id}`} className='hover:underline'>{item.orderCode}</Link>
                                )}
                            </TableCell>
                            <TableCell className="text-center dark:text-white">{item.product.name}</TableCell>
                            <TableCell className="text-end">
                                <span className='rounded-md bg-blue-500 text-white font-medium px-1.5 py-0.5'>
                                    {item.quantity}
                                </span>
                            </TableCell>
                            <TableCell className="text-end">
                                <span className='rounded-md bg-red-500 text-white font-medium px-1.5 py-0.5'>
                                    {item.amount}đ
                                </span>
                            </TableCell>
                            <TableCell className='text-center'>{fDate(new Date(item.createdAt), "yyyy-MM-dd hh:mm:ss")}</TableCell>
                            <TableCell className='space-x-1 text-center'>
                                {item.isDeleted ? (
                                    <strong className='text-destructive'>{t('orderDeleted')}</strong>
                                ) : (
                                    <>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size='icon'
                                                        className='text-teal-500 bg-teal-500/10 hover:text-white hover:bg-teal-500'
                                                        onClick={() => handleDownload(item.orderCode, item.accounts)}
                                                    >
                                                        <CloudDownloadIcon size={18} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('download')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size='icon'
                                                        className='text-destructive bg-destructive/10 hover:text-white hover:bg-destructive'
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2Icon size={18} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('delete')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default TableData
