import EmptyData from '@/components/common/EmptyData';
import PagingContent from '@/components/common/PagingContent';
import { Pagination } from '@/components/ui/pagination';
import TableData from '@/sections/product/TableData';
import { fetchProducts } from '@/store/product/productSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const Product: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const searchKey = searchParams.get('search');
    const page = searchParams.get('page');

    const [currentPage, setCurrentPage] = useState<number>(1);

    const dispatch = useDispatch<AppDispatch>();
    const { products } = useSelector((state: RootState) => state.products);

    const pageSize = 10;

    useEffect(() => {
        if (page) {
            setCurrentPage(Number(page))
        }
    }, [page])

    useEffect(() => {
        if (page === '1') {
            if (searchKey) {
                navigate(`/product?search=${searchKey}`)
            } else {
                navigate(`/product/category/${categoryId}`)
            }
        }
    }, [page, navigate, searchKey, categoryId])

    useEffect(() => {
        dispatch(fetchProducts({
            name: searchKey || '',
            subCatId: Number(categoryId) || 0,
            pageNumber: currentPage - 1,
            pageSize: pageSize,
            sortField: '',
            sortDirection: ''
        }));
    }, [searchKey, currentPage, categoryId, dispatch]);

    const handleSelectPage = (page: number) => {
        if (searchKey) {
            navigate(`/product?search=${searchKey}&page=${page}`)
        } else {
            navigate(`/product/category/${categoryId}?page=${page}`)
        }
    }

    const handleNextPage = () => {
        if (!products.last) {
            handleSelectPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (!products.first) {
            handleSelectPage(currentPage - 1)
        }
    }

    return (
        <div className="w-full h-full">
            <div className="container py-10">
                {categoryId && (
                    <h2 className='font-semibold mb-5 dark:text-white'>{products.content?.[0]?.productSubCategory.name}</h2>
                )}
                {searchKey && (
                    <h2 className='font-semibold mb-5 dark:text-white'>{t('productsRelatedKeyword')} '<span className='text-blue-700'>{searchKey}</span>'</h2>
                )}
                {products.totalElements > 0 ? (
                    <>
                        <TableData productData={products} />
                        <div className="py-5">
                            <Pagination className="justify-between">
                                <p className="text-muted-foreground">Showing {products.numberOfElements} of {products.totalElements} Results</p>
                                <PagingContent
                                    data={products}
                                    currentPage={currentPage}
                                    handlePrevPage={handlePrevPage}
                                    handleNextPage={handleNextPage}
                                    handleSelectPage={handleSelectPage}
                                />
                            </Pagination>
                        </div>
                    </>
                ) : (
                    <EmptyData message={t('noProductsFound')} />
                )}
            </div>
        </div>
    )
}

export default Product