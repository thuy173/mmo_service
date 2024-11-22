import { sideNavItems } from '@/data/sideNavItems'
import SideNav from '@/sections/profile/SideNav'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Profile: React.FC = () => {
    return (
        <div className='container py-10'>
            <div className='flex flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-8 lg:space-y-0'>
                <aside className='top-0 lg:sticky lg:w-96'>
                    <SideNav items={sideNavItems} />
                </aside>
                <div className='flex-1 w-full md:overflow-y-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Profile