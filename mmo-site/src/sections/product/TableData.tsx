import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faGlobe, faHourglassHalf, faTags } from '@fortawesome/free-solid-svg-icons'
import PurchaseDialog from '@/components/purchase-dialog/PurchaseDialog'
import { Button } from '@/components/ui/button'
import { PageResponse } from '@/models/pageResponse'
import { ShortProduct } from '@/models/product'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { countryFlags } from '@/data/countryFlags'

type TableDataProps = {
    productData: PageResponse<ShortProduct>;
}

const TableData: React.FC<TableDataProps> = ({ productData }) => {
    const { t } = useTranslation();

    return (
        <>
            <Table className='rounded-2xl bg-gray-100 dark:bg-slate-900'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">ID</TableHead>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead className="text-center"><FontAwesomeIcon icon={faHourglassHalf} className='me-1' />Live</TableHead>
                        <TableHead className="text-center"><FontAwesomeIcon icon={faGlobe} className='me-1' />{t('country')}</TableHead>
                        <TableHead className="text-center"><FontAwesomeIcon icon={faTags} className='me-1' />{t('price')} (VND)</TableHead>
                        <TableHead className="text-center"><FontAwesomeIcon icon={faCartShopping} className='me-1' />{t('quantity')}</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productData.content?.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium text-center dark:text-white">{index + 1}</TableCell>
                            <TableCell className='font-semibold dark:text-white'>
                                <Link to={`/product/${item.id}`} className='hover:underline'>{item.name}</Link>
                            </TableCell>
                            <TableCell className="text-center dark:text-white">3-5min</TableCell>
                            <TableCell className="flex items-center justify-center">
                                {countryFlags[item.countryCode] || item.countryCode}
                            </TableCell>
                            <TableCell className="text-center dark:text-white">{item.sellPrice}</TableCell>
                            <TableCell className="text-center">
                                <span className='py-2 px-3 rounded-md bg-red-500 text-white font-medium text-base'>
                                    {item.availableAccountQty}
                                </span>
                            </TableCell>
                            <TableCell className="flex items-center justify-center">
                                <PurchaseDialog product={item}>
                                    <Button
                                        size={'sm'}
                                        disabled={item.availableAccountQty <= 0}
                                    >
                                        {item.availableAccountQty > 0 ? t('buy') : t('soldOut')}
                                    </Button>
                                </PurchaseDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default TableData