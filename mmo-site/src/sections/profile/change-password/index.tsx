import React from 'react'
import ContentSection from '../components/ContentSection'
import ChangePassForm from './ChangePassForm'
import { useTranslation } from 'react-i18next'

const ChangePassword: React.FC = () => {
    const { t } = useTranslation();

    return (
        <ContentSection title={t('changePassword')}>
            <ChangePassForm />
        </ContentSection>
    )
}

export default ChangePassword