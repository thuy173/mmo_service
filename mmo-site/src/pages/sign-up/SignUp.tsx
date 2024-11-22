import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { FormProvider, useForm } from 'react-hook-form'
import { SignUpRequest } from '@/models/auth'
import authService from '@/services/authService'
import { useTranslation } from 'react-i18next'
import { removeItemLocalStorage } from '@/utils/localStorage'

const SignUp: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const form = useForm<SignUpRequest>({
        defaultValues: {
            fullName: '',
            username: '',
            password: '',
            email: '',
            phone: '',
        },
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    const onSubmit = async (data: SignUpRequest) => {
        removeItemLocalStorage("accessToken")
        try {
            await authService.signUp(data)
            toast({
                title: 'Successful',
                description: 'Sign up successfully!',
            })
            navigate('/login')
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Sign up failed!',
            })
        }
    }

    return (
        <>
            <div className="w-full min-h-screen grid grid-cols-2 bg-authentication">
                <div className='p-10'>
                    <Link to={'/'} className='flex gap-3 text-4xl font-bold dark:text-white'>
                        <img src="https://i.pinimg.com/564x/b8/20/f5/b820f5048c062ec36a5f66d8c7e7a5b5.jpg"
                            alt="logo"
                            className='w-12 h-12 object-cover rounded-full'
                        />
                        <span className='text-white'>CapSolver</span>
                    </Link>
                </div>
                <div className='bg-white  px-36 flex flex-col justify-between py-5'>
                    <div className='h-full flex flex-col items-center justify-center'>
                        <h3 className="text-3xl font-semibold">{t('signUpTitle')}</h3>
                        <p>{t('signUpDescription')}</p>
                        <FormProvider {...form}>
                            <Form {...form}>
                                <div className='flex flex-col gap-5 w-full pt-8'>
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        rules={{ required: t('fullNameRequired') }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('fullName')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('fullName')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        rules={{
                                            required: t('usernameRequired'),
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('username')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('username')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        rules={{
                                            required: t('passwordRequired'),
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('password')}</FormLabel>
                                                <div className="relative grid">
                                                    <FormControl>
                                                        <Input type={showPassword ? 'text' : 'password'} placeholder={t('password')} className='pe-8' {...field} />
                                                    </FormControl>
                                                    <Button
                                                        type='button'
                                                        size={'icon'}
                                                        variant={'link'}
                                                        className='absolute right-0'
                                                        onClick={togglePassword}
                                                    >
                                                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        rules={{
                                            required: t('emailRequired'),
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('email')}</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder={t('email')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        rules={{
                                            required: t('phoneRequired'),
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('phone')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('phone')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className='w-full' onClick={() => form.handleSubmit(onSubmit)()}>
                                        {t('createAnAccount')}
                                    </Button>
                                </div>
                            </Form>
                        </FormProvider>
                        <div className='pt-10'>
                            <p className='text-center'>{t('haveAccount')} <Link to={'/login'} className='text-orange-500 font-semibold underline'>{t('login')}</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp