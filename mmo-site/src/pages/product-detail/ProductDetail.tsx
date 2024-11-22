import Picture from '@/components/picture/Picture'
import { Button } from '@/components/ui/button'
import { fetchProductById, fetchProducts } from '@/store/product/productSlice'
import { AppDispatch, RootState } from '@/store/store'
import { fMoney } from '@/utils/formatNumber'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

const ProductDetail: React.FC = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { products, product } = useSelector((state: RootState) => state.products);

    const pageSize = 9;

    useEffect(() => {
        dispatch(fetchProductById(Number(id)));
    }, [id, dispatch]);

    useEffect(() => {
        dispatch(fetchProducts({
            name: '',
            subCatId: product.productSubCategory?.id,
            pageNumber: 0,
            pageSize: pageSize,
            sortField: '',
            sortDirection: ''
        }));
    }, [product, dispatch]);

    return (
        <div className='container space-y-5 py-10'>
            <div className="flex items-start gap-5">
                <div className="w-96 bg-orange-50 p-5 border rounded-2xl">
                    <Picture src={product.image} alt={product.name} className='w-full h-full object-cover rounded-xl' />
                </div>
                <div className="flex-1 space-y-2 bg-green-50 p-5 border rounded-2xl">
                    <div className="inline-flex gap-3">
                        <Picture src={product.productSubCategory?.icon} alt={product.productSubCategory?.name} className='w-12 h-12 object-cover rounded-lg border' />
                        <h3 className='font-medium'>{product.productSubCategory?.name}</h3>
                    </div>
                    <div className="flex gap-3">
                        <div className='px-2 py-1 rounded-lg border border-orange-200 bg-yellow-50'>
                            {t('stock')}:
                            <span className="font-semibold"> {product.availableAccountQty}</span>
                        </div>
                        <div className='px-2 py-1 rounded-lg border border-blue-200 bg-blue-50'>
                            {t('sold')}:
                            <span className="font-semibold"> {product.soldAccountQty}</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3 py-2">
                        <h4 className="text-red-500 line-through">{fMoney(product.sellPrice)}đ</h4>
                        <h3>{fMoney(product.sellPrice)}đ</h3>
                    </div>
                    <div>{product.shortDescription}</div>
                    <div className="w-1/2">
                        <Button
                            className='w-full mt-5 text-base rounded-full'
                            disabled={product.availableAccountQty <= 0}
                        >
                            {product.availableAccountQty > 0 ? t('buyNow') : t('outOfStock')}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-5 border rounded-2xl">
                <h5 className='font-semibold mb-3'>{t('productDetail')}</h5>
                <p>{product.detailDescription}</p>
            </div>
            <div className="p-5 border rounded-2xl">
                <h5 className='font-semibold mb-3'>{t('otherProducts')}</h5>
                <div className="grid grid-cols-3 gap-3">
                    {products.content?.map((product) => (
                        <div key={product.id} className="flex items-center justify-between gap-1 p-2 border rounded-lg">
                            <div className="flex gap-2">
                                <img src={product.image} alt={product.name} className='w-16 h-16 border rounded-md object-cover' />
                                <div>
                                    <Link to={`/product/${product.id}`} className='line-clamp-2 leading-5 font-semibold'>{product.name}</Link>
                                    <h5 className='font-semibold text-orange-500'>{fMoney(product.sellPrice)}đ</h5>
                                </div>
                            </div>
                            <div className='text-center'>
                                <p className='text-xs text-muted-foreground'>{t('quantity')}</p>
                                <h6 className='font-semibold'>{product.availableAccountQty}</h6>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductDetail