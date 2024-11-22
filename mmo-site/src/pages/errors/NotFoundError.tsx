import { Button } from '@/components/ui/button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const NotFoundError: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className='h-svh'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
                <span className='font-medium'>{t('404Title')}</span>
                <p className='text-center text-muted-foreground'>
                    {t('404Description')}
                </p>
                <div className='mt-6 flex gap-4'>
                    <Button variant={'outline'} onClick={() => navigate(-1)}>
                        {t('goBack')}
                    </Button>
                    <Button onClick={() => navigate('/')}>{t('backToHome')}</Button>
                </div>
            </div>
        </div>
    )
}

export default NotFoundError