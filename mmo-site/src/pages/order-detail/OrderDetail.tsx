import EmptyData from '@/components/common/EmptyData';
import { Button } from '@/components/ui/button';
import { OrderResponse } from '@/models/order';
import TableData from '@/sections/order-detail/TableData'
import orderService from '@/services/orderService';
import { ArrowLeftIcon, ClipboardIcon, CloudDownloadIcon, Trash2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { deleteOrder } from '@/store/order/orderSlice'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const OrderDetail: React.FC = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [orderDetail, setOrderDetail] = useState<OrderResponse>({} as OrderResponse);
    const [accounts, setAccounts] = useState<string[]>([]);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await orderService.getOrderById(id ? id : '')
                setOrderDetail(data)
                const accountsArray = data.accounts?.split('\n').filter(line => line.trim() !== '');
                setAccounts(accountsArray)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [id])

    const handleCopy = () => {
        navigator.clipboard.writeText(orderDetail.accounts)
    };

    const handleDownload = () => {
        const blob = new Blob([orderDetail.accounts], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${orderDetail.orderCode}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };


    const handleDelete = async () => {
        try {
            await dispatch(deleteOrder(id ? id : ''))
            toast({
                title: 'Delete order Successful',
                description: 'Your order has been deleted successfully!',
            })
            navigate('/order-history')
        } catch (error) {
            toast({
                title: 'Delete order failed',
                description: 'Your order deletion failed!',
            })
        }
    }

    return (
        <div className="w-full h-full">
            <div className="container py-10">
                {orderDetail.id ? (
                    <>
                        <div className='flex items-center justify-between mb-3'>
                            <Button size='sm' asChild>
                                <Link to={'/order-history'}>
                                    <ArrowLeftIcon size={18} />
                                    {t('back')}
                                </Link>
                            </Button>
                            <div className='flex gap-1'>
                                <Button
                                    size='sm'
                                    className='text-white bg-teal-500 hover:bg-teal-500/80'
                                    onClick={handleCopy}
                                    disabled={!orderDetail.accounts}
                                >
                                    <ClipboardIcon size={18} className='me-1' />
                                    {t('copy')}
                                </Button>
                                <Button
                                    size='sm'
                                    className='text-white bg-blue-500 hover:bg-blue-500/80'
                                    onClick={handleDownload}
                                    disabled={!orderDetail.accounts}
                                >
                                    <CloudDownloadIcon size={18} className='me-1' />
                                    {t('download')}
                                </Button>
                                <Button
                                    size='sm'
                                    variant='destructive'
                                    onClick={handleDelete}
                                >
                                    <Trash2Icon size={18} className='me-1' />
                                    {t('delete')}
                                </Button>
                            </div>
                        </div>
                        <p className='mb-3'>{t('orderCode')}: <strong>{orderDetail.orderCode}</strong></p>
                        <div className="border rounded-2xl p-5 mb-10">
                            <h4 className="font-semibold mb-2">{t('product')}: {orderDetail.product?.name}</h4>
                            <div className="flex gap-3 mb-5">
                                <span className='bg-lime-500 text-white px-2 py-0.5 rounded'>{t('quantityPurchased')}: {orderDetail.quantity}</span>
                                <span className='bg-amber-500 text-white px-2 py-0.5 rounded'>{t('amount')}: {orderDetail.amount}đ</span>
                            </div>
                            <p>{orderDetail.product?.description}</p>
                        </div>
                        <h3 className='font-semibold mb-5 dark:text-white'>{t('orderDetail')}</h3>
                        <TableData accounts={accounts} />
                    </>
                ) : (
                    <EmptyData message={t('orderNotFound')} />
                )}
            </div>
        </div>
    )
}

export default OrderDetail