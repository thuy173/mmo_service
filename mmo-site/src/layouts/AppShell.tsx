import React from 'react'
import Header from './header/Header';
import Navbar from './header/Navbar';
import Footer from './footer/Footer';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

const AppShell: React.FC = () => {
    return (
        <div className='relative h-full bg-background'>
            <div className="sticky top-0 z-50">
                <header className="bg-white dark:bg-dark">
                    <Header />
                </header>
                <nav className="bg-white dark:bg-dark">
                    <Navbar />
                </nav>
            </div>
            <main className="min-h-[50vh] bg-gray-50 dark:bg-dark">
                <Outlet />
            </main>
            <footer className='bg-white dark:bg-slate-900 dark:text-white'>
                <Footer />
            </footer>
            <Toaster />
        </div>
    )
}

export default AppShell