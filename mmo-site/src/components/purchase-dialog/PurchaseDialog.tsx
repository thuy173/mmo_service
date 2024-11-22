import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../ui/button'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Product, ShortProduct } from '@/models/product'
import { OrderRequest } from '@/models/order'
import { useToast } from '../ui/use-toast'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { createOrder } from '@/store/order/orderSlice'
import { fMoney } from '@/utils/formatNumber'
import { XIcon } from 'lucide-react'
import useDebounce from '@/hooks/useDebounce'
import couponService from '@/services/couponService'
import { Coupon } from '@/models/coupon'
import { cn } from '@/lib/utils'

type PurchaseDialogProps = {
    product: ShortProduct | Product;
    children: JSX.Element;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({ product, children }) => {
    const { toast } = useToast();

    const [quantity, setQuantity] = useState<number>(1);
    const [couponKey, setCouponKey] = useState<string>('');
    const [coupon, setCoupon] = useState<Coupon>({} as Coupon);
    const [couponErrMsg, setCouponErrMsg] = useState<string>('');
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [orderData, setOrderData] = useState<OrderRequest>({
        productId: product.id,
        couponId: 0,
        quantity: 1,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const debouncedSearchKey = useDebounce(couponKey, 500);
    const dispatch = useDispatch<AppDispatch>();

    const handleQuantityPlus = () => {
        setQuantity(prev => {
            const newQuantity = prev < product.availableAccountQty ? prev + 1 : prev;
            setOrderData(prevData => ({
                ...prevData,
                quantity: newQuantity,
            }));
            return newQuantity;
        });
    }

    const handleQuantityMinus = () => {
        setQuantity(prev => {
            const newQuantity = prev > 1 ? prev - 1 : 1;
            setOrderData(prevData => ({
                ...prevData,
                quantity: newQuantity,
            }));
            return newQuantity;
        });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setOrderData((prevData) => ({
            ...prevData,
            [id]: value,
            quantity: Math.max(1, parseInt(e.target.value) || 1),
        }))
    }

    const handleCouponInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponKey(e.target.value)
    }

    useEffect(() => {
        const fetchCoupon = async (productId: number, code: string) => {
            try {
                const data = await couponService.searchCoupon(productId, code)
                setCoupon(data)
                setCouponErrMsg('')
            } catch (error) {
                setCoupon({} as Coupon)
                setCouponErrMsg('Coupon has expired or is invalid')
            }
        }

        if (debouncedSearchKey) {
            fetchCoupon(product.id, debouncedSearchKey)
        }
    }, [debouncedSearchKey, product])

    useEffect(() => {
        const amount = product.sellPrice * quantity;
        if (coupon.minOrderAmount === 0 && coupon.maxOrderAmount > 0 && amount > coupon.maxOrderAmount) {
            setCouponErrMsg(`Amount exceeds the maximum allowed order amount of ${coupon.maxOrderAmount}.`)
        } else if (coupon.minOrderAmount > 0 && coupon.maxOrderAmount === 0 && amount < coupon.minOrderAmount) {
            setCouponErrMsg(`Amount is less than the minimum required order amount of ${coupon.minOrderAmount}.`)
        } else if (
            coupon.minOrderAmount > 0 &&
            coupon.maxOrderAmount > 0 &&
            (amount < coupon.minOrderAmount || amount > coupon.maxOrderAmount)
        ) {
            setCouponErrMsg(`Amount must be between ${coupon.minOrderAmount} and ${coupon.maxOrderAmount}.`)
        } else {
            setCouponErrMsg('')
        }

    }, [couponKey, coupon, product, quantity])

    useEffect(() => {
        if (coupon.id && !couponErrMsg) {
            setDiscountAmount(product.sellPrice * quantity * (coupon.discount / 100))
            setOrderData((prevData) => ({
                ...prevData,
                couponId: coupon.id,
            }))
        } else {
            setDiscountAmount(0)
            setOrderData((prevData) => ({
                ...prevData,
                couponId: 0,
            }))
        }
    }, [coupon, product, couponErrMsg, quantity])

    const handleOrder = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            await dispatch(createOrder(orderData))
            setIsLoading(false)
            setIsDialogOpen(false)
            setCouponKey('')
            setCouponErrMsg('')
            toast({
                title: 'Order Successful',
                description: 'Your order has been placed successfully!',
            })
        } catch (error) {
            setIsLoading(false)
            toast({
                title: 'Order failed',
                description: 'Your order failed!',
            })
        } finally {
            setIsLoading(false)
            setQuantity(1)
            setCouponKey('')
            setCouponErrMsg('')
            setOrderData({
                productId: product.id,
                couponId: 0,
                quantity: 1,
            })
        }
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogTitle></DialogTitle>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <h3 className='text-2xl font-semibold mb-3'>{product?.name}</h3>
                            <div className="flex gap-3">
                                <span className='bg-lime-500 text-white px-2 py-0.5 rounded'>Kho hàng: {product?.availableAccountQty}</span>
                                <span className='bg-amber-500 text-white px-2 py-0.5 rounded'>Đã bán: {product?.soldAccountQty}</span>
                            </div>
                            <div className="flex gap-5 py-3">
                                <h3 className="text-xl font-semibold text-red-500 line-through">{fMoney(product?.sellPrice)}đ</h3>
                                <h3 className="text-2xl font-semibold">{fMoney(product?.sellPrice)}đ</h3>
                            </div>
                            <strong>Description: </strong>
                            <DialogDescription>{product?.shortDescription}</DialogDescription>
                        </div>
                        <div className="flex flex-col mt-6">
                            <Table className='border bg-gray-100 mb-5'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={2} className="text-center">Purchase Information</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium w-[130px] border p-2">Số dư của tôi:</TableCell>
                                        <TableCell className="text-end text-xl font-semibold p-2">
                                            {fMoney(1234)}đ
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium w-[130px] border p-2">Số lượng cần mua:</TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 p-2">
                                            <Button
                                                size={'icon'}
                                                className='rounded w-9 h-9'
                                                onClick={handleQuantityMinus}
                                                disabled={quantity === 1}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </Button>
                                            <Input
                                                type='number'
                                                id='quantity'
                                                value={quantity}
                                                onChange={handleInputChange}
                                                min={1}
                                                className='w-24 h-10 text-center'
                                            />
                                            <Button
                                                size={'icon'}
                                                className='rounded w-9 h-9'
                                                onClick={handleQuantityPlus}
                                                disabled={quantity === product.availableAccountQty}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium w-[130px] border p-2">Mã giảm giá:</TableCell>
                                        <TableCell className="text-end p-2">
                                            <div className="relative">
                                                <div className="relative flex items-center">
                                                    <Input
                                                        type='text'
                                                        name='couponCode'
                                                        value={couponKey}
                                                        onChange={handleCouponInput}
                                                        placeholder='Nhập mã giảm giá nếu có'
                                                        className={cn('pe-8',
                                                            couponErrMsg && 'outline-red-500'
                                                        )}
                                                    />
                                                    {couponKey !== '' && (
                                                        <button
                                                            type='button'
                                                            className='absolute right-2 bg-black/60 text-white rounded-full p-0.5'
                                                            onClick={() => setCouponKey('')}
                                                        >
                                                            <XIcon size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className='text-start text-xs text-red-500'>
                                                    {couponErrMsg}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium w-[130px] border p-2">Thành tiền:</TableCell>
                                        <TableCell className="text-end text-lg font-semibold p-2">
                                            {fMoney(product.sellPrice * quantity)}đ
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium w-[130px] border p-2">Số tiền giảm:</TableCell>
                                        <TableCell className="text-end text-lg font-semibold p-2">
                                            {fMoney(discountAmount)}đ
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium w-[130px] border p-2">Tổng tiền thanh toán:</TableCell>
                                        <TableCell className="text-end text-lg font-semibold p-2">
                                            {fMoney(product.sellPrice * quantity - discountAmount)}đ
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Button
                                onClick={handleOrder}
                                disabled={isLoading || product.availableAccountQty < quantity}
                            >
                                Purchase
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PurchaseDialog