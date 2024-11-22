import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { PageResponse } from '@/models/pageResponse'
import { fDate } from '@/utils/formatDate'
import { Transaction } from '@/models/transaction'
import { fMoney } from '@/utils/formatNumber'
import { cn } from '@/lib/utils'

type TableDataProps = {
    transactions: PageResponse<Transaction>;
}

const TableData: React.FC<TableDataProps> = ({ transactions }) => {
    return (
        <>
            <Table className='border rounded dark:bg-slate-900'>
                <TableHeader className='bg-gray-100'>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-end">Initial balance</TableHead>
                        <TableHead className="text-end">Balance change</TableHead>
                        <TableHead className="text-end">Current balance</TableHead>
                        <TableHead>Reason</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.content?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className='text-nowrap'>{fDate(new Date(item.createdAt), "yyyy-MM-dd hh:mm:ss")}</TableCell>
                            <TableCell className="text-end text-yellow-500 font-semibold">
                                {fMoney(item.balanceBefore)}đ
                            </TableCell>
                            <TableCell className={cn("text-end font-semibold",
                                item.balanceBefore > item.balanceAfter ? "text-red-500" : "text-green-500"
                            )}>
                                {fMoney(item.amount)}đ
                            </TableCell>
                            <TableCell className="text-end text-blue-500 font-semibold">
                                {fMoney(item.balanceAfter)}đ
                            </TableCell>
                            <TableCell className='text-nowrap w-full'>{item.reason}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default TableData
