import { Statistics } from '@/models/statistics'
import statisticsService from '@/services/statisticsService';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

const Achievements: React.FC = () => {
    const { t } = useTranslation();
    const [statistics, setStatistics] = useState<Statistics>({} as Statistics);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resData = await statisticsService.getStatistics()
                setStatistics(resData)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            <div className="w-fit h-full grid grid-cols-3 gap-5">
                <div className="w-[300px] h-full flex flex-col items-center justify-center border bg-white rounded-2xl p-5 dark:bg-dark">
                    <h3 className="text-4xl font-bold dark:text-white">{statistics.users}</h3>
                    <span className="text-sm text-gray-400">{t('customers')}</span>
                </div>
                <div className="w-[300px] h-full flex flex-col items-center justify-center border bg-white rounded-2xl p-5 dark:bg-dark">
                    <h3 className="text-4xl font-bold dark:text-white">{statistics.products}</h3>
                    <span className="text-sm text-gray-400">{t('products')}</span>
                </div>
                <div className="w-[300px] h-full flex flex-col items-center justify-center border bg-white rounded-2xl p-5 dark:bg-dark">
                    <h3 className="text-4xl font-bold dark:text-white">{statistics.orders}</h3>
                    <span className="text-sm text-gray-400">{t('orders')}</span>
                </div>
            </div>
        </>
    )
}

export default Achievements