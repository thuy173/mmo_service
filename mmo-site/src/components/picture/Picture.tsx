import React from 'react'
import DefaultImg from '@/assets/default-img.png'
import DefaultAvatar from '@/assets/default-avatar.png'

type Props = {
    isAvatar?: boolean;
    src: string;
    alt: string;
    className?: string;
}

const Picture: React.FC<Props> = ({ isAvatar = false, src, alt, className }) => {

    if (!src) {
        if (isAvatar) {
            src = DefaultAvatar;
        } else {
            src = DefaultImg;
        }
    }

    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (isAvatar) {
            event.currentTarget.src = DefaultAvatar;
        } else {
            event.currentTarget.src = DefaultImg;
        }

        // prevent infinity loop when default image error
        event.currentTarget.onerror = null;
    };

    return (
        <>
            <img src={src} alt={alt} className={`${className}`} onError={handleError} />
        </>
    )
}

export default Picture