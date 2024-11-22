import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { LoginRequest } from '@/models/auth'
import { loginUser } from '@/store/auth/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const form = useForm<LoginRequest>({
        defaultValues: {
            username: '',
            password: '',
        },
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.auth);

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    const onSubmit = async (data: LoginRequest) => {
        try {
            const resultAction = await dispatch(loginUser(data))
            toast({
                title: 'Successful',
                description: 'Login successfully!',
            })
            if (loginUser.fulfilled.match(resultAction)) {
                navigate('/');
            }
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Login failed!',
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
                <div className='bg-white px-36 flex flex-col justify-between py-5'>
                    <div className='h-full flex flex-col items-center justify-center'>
                        <h3 className="text-3xl font-semibold">{t('loginTitle')}</h3>
                        <p>{t('loginDescription')}</p>
                        <FormProvider {...form}>
                            <Form {...form}>
                                <div className='flex flex-col gap-5 w-full pt-8'>
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
                                    <Button className='w-full' onClick={() => form.handleSubmit(onSubmit)()}>
                                        {loading ? t('loggingIn') : t('login')}
                                    </Button>
                                </div>
                            </Form>
                        </FormProvider>
                        <div className='pt-10'>
                            <p className='text-center'>{t('notHaveAccount')} <Link to={'/sign-up'} className='text-orange-500 font-semibold underline'>{t('createAnAccount')}</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login