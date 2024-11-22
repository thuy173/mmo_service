import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Banner: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchKey, setSearchKey] = useState<string>('');

    document.addEventListener('DOMContentLoaded', () => {
        const interBubble = document.querySelector<HTMLDivElement>('.interactive')!;
        let curX = 0;
        let curY = 0;
        let tgX = 0;
        let tgY = 0;

        function move() {
            curX += (tgX - curX) / 20;
            curY += (tgY - curY) / 20;
            interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
            requestAnimationFrame(() => {
                move();
            });
        }

        window.addEventListener('mousemove', (event) => {
            tgX = event.clientX;
            tgY = event.clientY;
        });

        move();
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value)
    }

    const handleSearch = () => {
        if (searchKey) {
            navigate(`/product?search=${searchKey}`)
        }
    };

    return (
        <div className='relative overflow-hidden'>
            <div className="h-[80vh] w-full flex items-center justify-center opacity-80 select-none top-0 left-0 absolute z-10">
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-8xl font-extrabold text-center mb-8 text-white dark:text-gray-200'>Buy Verified Accounts, <br />Securely Fast! </h1>
                    <Input
                        type="text"
                        placeholder={t('searchProduct')}
                        className='w-96 py-6'
                        value={searchKey}
                        onChange={handleInputChange}
                    />
                    <Button className='mt-3 px-10' onClick={handleSearch}>
                        {t('search')}
                    </Button>
                </div>
            </div>
            <div className="gradient-bg z-0">
                <svg xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>
                <div className="gradients-container">
                    <div className="g1"></div>
                    <div className="g2"></div>
                    <div className="g3"></div>
                    <div className="g4"></div>
                    <div className="g5"></div>
                    <div className="interactive"></div>
                </div>
            </div>
        </div>
    )
}

export default Banner