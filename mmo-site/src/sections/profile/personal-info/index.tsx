import React from 'react'
import ContentSection from '../components/ContentSection'
import ProfileForm from './ProfileForm'
import AvatarForm from './AvatarForm'
import { useTranslation } from 'react-i18next'

const PersonalInfo: React.FC = () => {
    const { t } = useTranslation();

    return (
        <ContentSection title={t('personalInfo')}>
            <div className="flex">
                <div className="px-10 py-5">
                    <AvatarForm />
                </div>
                <div className="flex-1">
                    <ProfileForm />
                </div>
            </div>
        </ContentSection>
    )
}

export default PersonalInfo