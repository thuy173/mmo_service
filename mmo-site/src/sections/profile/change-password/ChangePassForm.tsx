import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { ChangePassRequest } from '@/models/user'
import userService from '@/services/userService'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const ChangePassForm: React.FC = () => {
    const { t } = useTranslation();
    const { toast } = useToast();

    const form = useForm<ChangePassRequest>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const { watch } = form;
    const newPassword = watch('newPassword');

    const onSubmit = async (data: ChangePassRequest) => {
        try {
            await userService.updatePassword(data)
            toast({
                title: 'Successful',
                description: 'Change password successfully!',
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Your current password is not match!',
            })
        }
    }

    return (
        <FormProvider {...form}>
            <Form {...form}>
                <div className="grid grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        rules={{ required: t('currentPasswordRequired') }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('currentPassword')}</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder={t('currentPassword')} {...field} autoComplete="new-password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        rules={{
                            required: t('newPasswordRequired'),
                            minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('newPassword')}</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder={t('newPassword')} {...field} autoComplete="new-password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        rules={{
                            required: t('confirmPasswordRequired'),
                            validate: (value) => value === newPassword || 'Confirm password do not match',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('confirmPassword')}</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder={t('confirmPassword')} {...field} autoComplete="new-password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button className='w-full mt-5' onClick={() => form.handleSubmit(onSubmit)()}>
                    {t('changePassword')}
                </Button>
            </Form>
        </FormProvider>
    )
}

export default ChangePassForm