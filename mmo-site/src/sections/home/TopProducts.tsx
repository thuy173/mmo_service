import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHourglassHalf, faTags } from '@fortawesome/free-solid-svg-icons'
import PurchaseDialog from '@/components/purchase-dialog/PurchaseDialog'
import Picture from '@/components/picture/Picture'
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/store/product/productSlice'
import { fMoney } from '@/utils/formatNumber'
import { useTranslation } from 'react-i18next'

const TopProducts: React.FC = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch<AppDispatch>();
    const { products } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(fetchProducts({ name: '', pageNumber: 0, pageSize: 10 }));
    }, [dispatch]);

    return (
        <div className='container'>
            <h2 className='text-5xl font-semibold mb-5 dark:text-white'>{t('topProducts')}</h2>
            <div className="grid grid-cols-4 items-center gap-3">
                {products.content?.map((product) => (
                    <Card key={product.id} className="w-full rounded-2xl">
                        <CardHeader className='p-2 relative'>
                            <Picture src={product.image} alt={product.productCode} className='w-full h-44 object-cover rounded-xl' />
                            <Picture src={product.productSubCategory.icon} alt={product.productSubCategory.name} className='w-12 h-12 object-cover rounded-xl absolute -bottom-3 left-8 border' />
                            <span className="text-xs px-2.5 py-1 rounded-3xl text-white bg-black absolute bottom-4 right-4">
                                {product.productSubCategory.name}
                            </span>
                            <Picture src="https://dongvanfb.net/_nuxt/vn.dfdf7f52.svg" alt="" className='w-6 h-4.5 object-cover rounded absolute top-2 right-4' />
                        </CardHeader>
                        <CardContent className='pt-6'>
                            <CardTitle className='line-clamp-2 text-xl'>{product.name}</CardTitle>
                            <CardDescription>{product.shortDescription}</CardDescription>
                            <div className="flex flex-col pt-5 gap-3">
                                <div className="flex items-center justify-between">
                                    <span><FontAwesomeIcon icon={faHourglassHalf} /> Live</span>
                                    <span className='font-semibold'>12 months</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span><FontAwesomeIcon icon={faCartShopping} /> {t('quantity')}</span>
                                    <p className="bg-gray-100 px-2 rounded-3xl">
                                        <span className='font-semibold text-gradient'>{product.availableAccountQty}</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span><FontAwesomeIcon icon={faTags} /> {t('price')}</span>
                                    <span className='text-2xl font-semibold text-orange-500'>{fMoney(product.sellPrice)}đ</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center gap-3">
                            <Button variant="outline" className='rounded-3xl' asChild>
                                <Link to={`/product/${product.id}`}>
                                    {t('viewProduct')}
                                </Link>
                            </Button>
                            <PurchaseDialog product={product}>
                                <Button variant="default" className='rounded-3xl' disabled={product.availableAccountQty <= 0}>
                                    {product.availableAccountQty > 0 ? t('buyNow') : t('outOfStock')}
                                </Button>
                            </PurchaseDialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default TopProducts