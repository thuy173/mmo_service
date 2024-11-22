import React from 'react'
import { Link } from 'react-router-dom'

const Logo: React.FC = () => {
    return (
        <Link to={'/'} className='flex gap-3 text-4xl font-bold dark:text-white'>
            <img src="https://i.pinimg.com/564x/b8/20/f5/b820f5048c062ec36a5f66d8c7e7a5b5.jpg"
                alt="logo"
                className='w-12 h-12 object-cover rounded-full'
            />
            <span>CapSolver</span>
        </Link>
    )
}

export default Logo