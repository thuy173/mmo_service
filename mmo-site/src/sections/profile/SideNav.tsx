import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { logoutUser } from '@/store/auth/authSlice'
import { AppDispatch } from '@/store/store'
import { LogOutIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
        icon: JSX.Element
    }[]
}

const SideNav: React.FC<SideNavProps> = ({ className, items, ...props }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [val, setVal] = useState(pathname ?? '/profile');

    const dispatch = useDispatch<AppDispatch>();

    const handleSelect = (e: string) => {
        setVal(e)
        navigate(e)
    }

    const handleLogout = async () => {
        dispatch(logoutUser())
        navigate('/')
    }

    return (
        <>
            <div className='p-1 md:hidden'>
                <Select value={val} onValueChange={handleSelect}>
                    <SelectTrigger className='h-12 sm:w-48'>
                        <SelectValue placeholder='Theme' />
                    </SelectTrigger>
                    <SelectContent>
                        {items.map((item) => (
                            <SelectItem key={item.href} value={item.href}>
                                <div className='flex gap-x-4 px-2 py-1'>
                                    <span className='scale-125'>{item.icon}</span>
                                    <span className='text-md'>{item.title}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='hidden w-full overflow-x-auto px-1 md:block'>
                <nav
                    className={cn(
                        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
                        className
                    )}
                    {...props}
                >
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                buttonVariants({ variant: 'ghost' }),
                                "text-base py-6 justify-start border bg-background",
                                pathname === item.href
                                    ? 'bg-secondary text-primary font-semibold hover:bg-secondary border-blue-600'
                                    : 'hover:bg-transparent hover:underline',
                            )}
                        >
                            <span className='mr-2'>{item.icon}</span>
                            {item.title}
                        </Link>
                    ))}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='ghost' className='text-base py-6 justify-start border bg-background'>
                                <LogOutIcon size={18} className='mr-2' />
                                {t('logout')}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t('logoutConfirm')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('logoutConfirmDescription')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={handleLogout}>
                                        {t('yes')}
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </nav>
            </div>
        </>
    )
}

export default SideNav