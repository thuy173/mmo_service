import DatePicker from "@/components/common/DatePicker"
import EmptyData from "@/components/common/EmptyData"
import PagingContent from "@/components/common/PagingContent"
import SelectDaysRange from "@/components/common/SelectDaysRange"
import SelectRowShow from "@/components/common/SelectRowShow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import useDebounce from "@/hooks/useDebounce"
import TableData from '@/sections/order-history/TableData'
import { fetchOrders } from "@/store/order/orderSlice"
import { AppDispatch, RootState } from "@/store/store"
import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"

const OrderHistory: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchOrderCode, setSearchOrderCode] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedDaysRange, setSelectedDaysRange] = useState<string>('0');
    const [selectedPageSize, setSelectedPageSize] = useState<string>('10');

    const dispatch = useDispatch<AppDispatch>();
    const { orders } = useSelector((state: RootState) => state.orders);

    const debouncedSearchCode = useDebounce(searchOrderCode, 500);

    useEffect(() => {
        if (page) {
            setCurrentPage(Number(page))
        }
    }, [page])

    useEffect(() => {
        if (page === '1') {
            navigate('/order-history')
        }
    }, [page, navigate])

    useEffect(() => {
        dispatch(fetchOrders({
            orderCode: debouncedSearchCode.trim(),
            createdAt: selectedDate,
            daysRange: Number(selectedDaysRange),
            pageNumber: currentPage - 1,
            pageSize: Number(selectedPageSize),
            sortField: 'createdAt',
            sortDirection: 'DESC'
        }))
    }, [debouncedSearchCode, selectedDate, selectedDaysRange, currentPage, selectedPageSize, dispatch])

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchOrderCode(e.target.value)
        setCurrentPage(1)
    }

    const handleSelectDate = (date: Date | undefined) => {
        setCurrentPage(1)
        if (date) {
            const correctedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            const formattedDate = correctedDate.toISOString().split('T')[0] + 'T00:00:00';
            setSelectedDate(formattedDate);
            setSelectedDaysRange('0')
        } else {
            setSelectedDate('');
        }
    }

    const handleSelectDaysRange = (value: string) => {
        if (selectedDate) {
            setSelectedDaysRange('0')
        } else {
            setSelectedDaysRange(value)
            setCurrentPage(1)
        }
    }

    const handleSelectPageSize = (value: string) => {
        setSelectedPageSize(value)
        setCurrentPage(1)
    }

    const handleResetFilter = () => {
        setCurrentPage(1)
        setSearchOrderCode('')
        setSelectedDate('')
        setSelectedDaysRange('0')
    }

    const handleSelectPage = (page: number) => {
        navigate(`/order-history?page=${page}`)
    }

    const handleNextPage = () => {
        if (!orders.last) {
            handleSelectPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (!orders.first) {
            handleSelectPage(currentPage - 1)
        }
    }

    return (
        <div className="w-full h-full">
            <div className="container py-10">
                <h2 className='text-4xl font-semibold mb-5 dark:text-white'>{t('navbar.orderHistory')}</h2>
                <div className="flex gap-3 items-center justify-end pb-5">
                    <Input
                        value={searchOrderCode}
                        placeholder={t('orderCode')}
                        className="w-80"
                        onChange={handleSearchInput}
                    />
                    <DatePicker
                        date={selectedDate ? new Date(selectedDate) : undefined}
                        setDate={handleSelectDate}
                    />
                    <SelectDaysRange
                        selectedItem={selectedDaysRange}
                        onSelect={handleSelectDaysRange}
                    />
                    <Button variant='destructive' onClick={handleResetFilter}>
                        {t('clearFilter')}
                    </Button>
                </div>
                {orders.totalElements > 0 ? (
                    <>
                        <TableData orderData={orders} />
                        <div className="py-5">
                            <Pagination className="justify-between">
                                <div className="flex gap-3 items-center">
                                    <SelectRowShow
                                        selectedItem={selectedPageSize}
                                        onSelect={handleSelectPageSize}
                                    />
                                    <p className="text-muted-foreground">Showing {orders.numberOfElements} of {orders.totalElements} Results</p>
                                </div>
                                <PagingContent
                                    data={orders}
                                    currentPage={currentPage}
                                    handlePrevPage={handlePrevPage}
                                    handleNextPage={handleNextPage}
                                    handleSelectPage={handleSelectPage}
                                />
                            </Pagination>
                        </div>
                    </>
                ) : (
                    <EmptyData message={t('noOrdersFound')} />
                )}
            </div>
        </div>
    )
}

export default OrderHistory