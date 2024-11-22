import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { products } from '@/data/table'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faGlobe, faHourglassHalf, faTags } from '@fortawesome/free-solid-svg-icons'
import PurchaseDialog from '@/components/purchase-dialog/PurchaseDialog'

const ShortLiveTable: React.FC = () => {
    return (
        <div className='container'>
            <h2 className='text-5xl font-semibold mb-5 dark:text-white'>Short Live Hotmail</h2>
            <Table className='rounded-2xl bg-gray-100 dark:bg-slate-900'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center"><FontAwesomeIcon icon={faHourglassHalf} /> Live</TableHead>
                        <TableHead className="text-center"><FontAwesomeIcon icon={faGlobe} /> Country</TableHead>
                        <TableHead className="text-center"><FontAwesomeIcon icon={faTags} /> Price</TableHead>
                        <TableHead className="text-center"><FontAwesomeIcon icon={faCartShopping} /> Quantity</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((item, index) => (
                        <TableRow key={item.name}>
                            <TableCell className="font-medium text-center dark:text-white">{index + 1}</TableCell>
                            <TableCell className='dark:text-white'>{item.name}</TableCell>
                            <TableCell className="text-center dark:text-white">{item.live}</TableCell>
                            <TableCell className="flex items-center justify-center">
                                <img src="https://dongvanfb.net/_nuxt/vn.dfdf7f52.svg" alt="" className='w-8 h-8 object-contain' />
                            </TableCell>
                            <TableCell className="text-center dark:text-white">{item.price}</TableCell>
                            <TableCell className="text-center">
                                <span className='py-2 px-3 rounded-md bg-red-500 text-white font-medium text-base'>
                                    {item.quantity}
                                </span>
                            </TableCell>
                            <TableCell className="flex items-center justify-center">
                                <PurchaseDialog product={item}>
                                    <Button size={'sm'}>Buy</Button>
                                </PurchaseDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ShortLiveTable