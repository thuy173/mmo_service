import React from 'react'
import '@/styles/spinner.css'
import { cn } from '@/lib/utils';

type SpinnerProps = {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
    return (
        <div className={cn("spinner center z-50", className)}>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
        </div>
    )
}

export default Spinner