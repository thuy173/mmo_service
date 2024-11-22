import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { UserRequest } from '@/models/user'
import userService from '@/services/userService'
import React, { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useTranslation } from 'react-i18next'

const ProfileForm: React.FC = () => {
    const { t } = useTranslation();
    const { toast } = useToast();

    const form = useForm<UserRequest>({
        defaultValues: {
            fullName: '',
            username: '',
            email: '',
            phone: '',
        },
    });
    const { user, loadingProfile } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        form.reset({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            phone: user.phone,
        });
    }, [user, form])

    const onSubmit = async (data: UserRequest) => {
        try {
            await userService.updateUser(data)
            toast({
                title: 'Successful',
                description: 'Update profile successfully!',
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Update profile failed!',
            })
        }
    }

    return (
        <FormProvider {...form}>
            <Form {...form}>
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
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('username')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('username')} {...field} readOnly />
                            </FormControl>
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
                <div className="flex justify-end mt-5">
                    <Button
                        onClick={() => form.handleSubmit(onSubmit)()}
                        disabled={loadingProfile || !form.formState.isDirty}
                    >
                        {t('saveChange')}
                    </Button>
                </div>
            </Form>
        </FormProvider>
    )
}

export default ProfileForm