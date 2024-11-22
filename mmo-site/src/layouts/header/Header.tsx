import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import Logo from '@/components/logo/Logo';
import Picture from '@/components/picture/Picture';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fMoney } from '@/utils/formatNumber';
import { fetchWallet } from '@/store/user/userSlice';
import { useTranslation } from 'react-i18next';
import enImg from '@/assets/flag/flag-us.svg'
import viImg from '@/assets/flag/flag-vn.svg'

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [searchKey, setSearchKey] = useState<string>('');
    const [lang, setLang] = useState<string>('vi');

    const dispatch = useDispatch<AppDispatch>();
    const { user, wallet } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchWallet());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value)
    }

    const handleSearch = () => {
        if (searchKey) {
            navigate(`/product?search=${searchKey}`)
        }
    };

    const toggleLanguage = () => {
        if (lang === 'vi') {
            i18n.changeLanguage('en');
            setLang('en')
        } else if (lang === 'en') {
            i18n.changeLanguage('vi');
            setLang('vi')
        } else {
            i18n.changeLanguage('vi');
            setLang('vi')
        }
    };

    return (
        <>
            <div className="w-full flex items-center justify-between px-5 py-3">
                <Logo />
                <div className="flex relative items-center">
                    <Input
                        type='text'
                        placeholder={t('searchProduct')}
                        className="w-96 rounded ps-5 pe-12 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        value={searchKey}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                    />
                    <Button
                        variant={'secondary'}
                        className='absolute right-0'
                        onClick={handleSearch}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </Button>
                </div>
                <div className="flex items-center gap-x-3">
                    <button
                        onClick={toggleLanguage}
                    >
                        {lang === 'vi' ? (
                            <img src={viImg} alt='flag-vi' className='w-8' />
                        ) : (
                            <img src={enImg} alt='flag-us' className='w-8' />
                        )}
                    </button>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-x-2">
                            <Link to={'/profile'}>
                                <Picture
                                    isAvatar={true}
                                    src={user.avatar}
                                    alt={user.fullName}
                                    className='w-12 h-12 object-cover border rounded-full'
                                />
                            </Link>
                            <div className='flex flex-col'>
                                <span className='text-sm leading-4'>{t('accountBalance')}</span>
                                <span className='text-lg font-semibold'>{fMoney(wallet.balance)}đ</span>
                            </div>
                        </div>
                    ) : (
                        <Link to={'/login'}>
                            <Button variant={'outline'} size={'lg'} className='text-md rounded-3xl uppercase tracking-wide'>
                                {t('login')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}

export default Header