import Spinner from '@/components/common/Spinner';
import Picture from '@/components/picture/Picture';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AppDispatch, RootState } from '@/store/store';
import { updateAvatar } from '@/store/user/userSlice';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

const AvatarForm: React.FC = () => {
    const { t } = useTranslation();

    const [preview, setPreview] = useState<string | null>('');
    const [fileUpload, setFileUpload] = useState<File>();

    const dispatch = useDispatch<AppDispatch>();
    const { user, loadingAvatar } = useSelector((state: RootState) => state.user);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileUpload(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (fileUpload) {
            dispatch(updateAvatar(fileUpload))
        }
    }, [fileUpload, dispatch])

    return (
        <div className="flex flex-col gap-5">
            <div className="relative">
                {loadingAvatar && (
                    <div className='w-44 h-44 bg-background/80 absolute'>
                        <Spinner />
                    </div>
                )}
                <Picture isAvatar={true} src={preview || user.avatar} alt="avatar" className="w-44 h-44 border rounded-full object-cover" />
            </div>
            <input type="file" accept="image/*" id="avatar" className="hidden" onChange={handleImageChange} />
            <Button asChild>
                <Label htmlFor="avatar">{t('changeAvatar')}</Label>
            </Button>
        </div>
    );
};

export default AvatarForm;
