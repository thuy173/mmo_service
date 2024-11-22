import Achievements from '@/sections/home/Achievements';
import Banner from '@/sections/home/Banner';
import React from 'react';
import { motion } from 'framer-motion';
import TopProducts from '@/sections/home/TopProducts';
import ShortLiveTable from '@/sections/home/ShortLiveTable';
import NewestPosts from '@/sections/home/NewestPosts';

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
    return (
        <>
            <div className="w-full h-full pb-20">
                <Banner />
                <motion.div
                    className="w-full h-full flex justify-center -top-10 relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    variants={sectionVariants}
                    transition={{ duration: 0.5 }}
                >
                    <Achievements />
                </motion.div>
                <div className="flex flex-col gap-y-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false }}
                        variants={sectionVariants}
                        transition={{ duration: 0.5 }}
                    >
                        <ShortLiveTable />
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false }}
                        variants={sectionVariants}
                        transition={{ duration: 0.5 }}
                    >
                        <TopProducts />
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false }}
                        variants={sectionVariants}
                        transition={{ duration: 0.5 }}
                    >
                        <NewestPosts />
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Home;
