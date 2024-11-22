import { Pagination } from "@/components/ui/pagination"
import React, { useEffect, useState } from 'react'
import ContentSection from '../components/ContentSection'
import { PageResponse } from '@/models/pageResponse'
import { Transaction } from '@/models/transaction'
import transactionService from '@/services/transactionService'
import TableData from "./TableData"
import PagingContent from "@/components/common/PagingContent"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import DatePicker from "@/components/common/DatePicker"
import SelectDaysRange from "@/components/common/SelectDaysRange"
import useDebounce from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import SelectRowShow from "@/components/common/SelectRowShow"

const Transactions: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchReason, setSearchReason] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedDaysRange, setSelectedDaysRange] = useState<string>('0');
    const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
    const [transactionsRes, setTransactionsRes] = useState<PageResponse<Transaction>>({} as PageResponse<Transaction>)

    const debouncedSearchReason = useDebounce(searchReason, 500);

    useEffect(() => {
        if (page) {
            setCurrentPage(Number(page))
        }
    }, [page])

    useEffect(() => {
        if (page === '1') {
            navigate('/profile/transactions')
        }
    }, [page, navigate])

    useEffect(() => {
        const fetchData = async (
            reason?: string,
            createdAt?: string,
            daysRange?: number,
            pageNumber?: number,
            pageSize?: number,
            sortField?: string,
            sortDirection?: string,
        ) => {
            try {
                const resData = await transactionService.getTransactions(reason, createdAt, daysRange, pageNumber, pageSize, sortField, sortDirection)
                setTransactionsRes(resData)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData(debouncedSearchReason, selectedDate, Number(selectedDaysRange), currentPage - 1, Number(selectedPageSize), 'createdAt', 'DESC')
    }, [debouncedSearchReason, selectedDate, selectedDaysRange, currentPage, selectedPageSize])

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchReason(e.target.value)
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
        setSearchReason('')
        setSelectedDate('')
        setSelectedDaysRange('0')
    }

    const handleSelectPage = (page: number) => {
        navigate(`/profile/transactions?page=${page}`)
    }

    const handleNextPage = () => {
        if (!transactionsRes.last) {
            handleSelectPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (!transactionsRes.first) {
            handleSelectPage(currentPage - 1)
        }
    }

    return (
        <ContentSection title={t('navbar.transactions')}>
            <>
                <div className="flex gap-3 items-center justify-end pb-5">
                    <Input
                        value={searchReason}
                        placeholder={t('reason')}
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
                <TableData transactions={transactionsRes} />
                <div className="py-5">
                    <Pagination className="justify-between">
                        <div className="flex gap-3 items-center">
                            <SelectRowShow
                                selectedItem={selectedPageSize}
                                onSelect={handleSelectPageSize}
                            />
                            <p className="text-muted-foreground">Showing {transactionsRes.numberOfElements} of {transactionsRes.totalElements} Results</p>
                        </div>
                        <PagingContent
                            data={transactionsRes}
                            currentPage={currentPage}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                            handleSelectPage={handleSelectPage}
                        />
                    </Pagination>
                </div>
            </>
        </ContentSection>
    )
}

export default Transactions