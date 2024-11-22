import Logo from '@/components/logo/Logo'
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
    return (
        <>
            <div className="grid grid-cols-4 space-x-10 container py-10">
                <div className='flex flex-col'>
                    <Logo />
                    <span className='text-gray-400 mt-3'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium cumque quas nihil. Officiis, omnis dicta iure suscipit aperiam.</span>
                </div>
                <div className='flex flex-col'>
                    <h3 className="text-2xl font-semibold pb-4 mb-3 footer-title dark:footer-title-dark">About us</h3>
                    <Link to={'/'} className='mb-3 hover:underline'>Giới thiệu</Link>
                    <Link to={'/'} className='mb-3 hover:underline'>Điều khoản dịch vụ</Link>
                </div>
                <div className='flex flex-col'>
                    <h3 className="text-2xl font-semibold pb-4 mb-3 footer-title dark:footer-title-dark">Contact</h3>
                    <Link to={'/'} className='mb-3 hover:underline'><FontAwesomeIcon icon={faEnvelope} /> admin@domain.com</Link>
                    <Link to={'/'} className='mb-3 hover:underline'><FontAwesomeIcon icon={faPhone} /> 0988888XXX</Link>
                    <Link to={'/'} className='mb-3 hover:underline'><FontAwesomeIcon icon={faLocationDot} /> 1Hd- 50, 010 Avenue, NY 90001 United States</Link>
                </div>
                <div className='flex flex-col'>
                    <h3 className="text-2xl font-semibold pb-4 mb-3 footer-title dark:footer-title-dark">Connect</h3>
                    <Link to={'/'} className='mb-3 hover:underline'>Chính sách</Link>
                    <Link to={'/'} className='mb-3 hover:underline'>Câu hỏi thường gặp</Link>
                    <Link to={'/'} className='mb-3 hover:underline'>Liên hệ chúng tôi</Link>
                    <Link to={'/'} className='mb-3 hover:underline'>Tài liệu API</Link>
                </div>
            </div>
            <div className="w-full py-3 text-center bg-black text-white">
                Copyright &copy; 2024 Design by MMO
            </div>
        </>
    )
}

export default Footer