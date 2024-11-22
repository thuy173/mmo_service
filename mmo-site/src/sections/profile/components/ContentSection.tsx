import { Separator } from '@/components/ui/separator'
import React from 'react'

type ContentSectionProps = {
    title: string
    children: JSX.Element
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, children }) => {
    return (
        <div className='flex flex-1 flex-col border rounded-xl p-5 bg-background'>
            <div className='flex-none'>
                <h3 className='text-lg font-semibold'>{title}</h3>
            </div>
            <Separator className='my-4 flex-none' />
            <div className='faded-bottom -mx-4 flex-1 overflow-auto scroll-smooth px-4 md:pb-10'>
                <div>{children}</div>
            </div>
        </div>
    )
}

export default ContentSection