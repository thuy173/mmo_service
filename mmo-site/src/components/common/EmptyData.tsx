import React from 'react'
import EmptyBoxImg from '@/assets/empty-box.svg'
import { cn } from '@/lib/utils';

interface EmptyDataProps extends React.HTMLAttributes<HTMLElement> {
    message: string;
}

const EmptyData: React.FC<EmptyDataProps> = ({ message, className }) => {
    return (
        <div className='flex flex-col items-center'>
            <img src={EmptyBoxImg} alt="empty-box" className={cn('w-44 mb-5', className)} />
            <p className='text-muted-foreground'>{message}</p>
        </div>
    )
}

export default EmptyData