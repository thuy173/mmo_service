import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { ShortPost } from '@/models/post'
import postService from '@/services/postService'
import Picture from '@/components/picture/Picture'
import { fDate } from '@/utils/formatDate'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NewestPosts: React.FC = () => {
    const { t } = useTranslation();
    const [newestPosts, setNewestPosts] = useState<ShortPost[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await postService.getAllPosts('', undefined, undefined, 3, 'createdAt', 'DESC')
                setNewestPosts(data.content)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            <div className='container'>
                <h2 className='text-5xl font-semibold mb-5 dark:text-white'>{t('newestPosts')}</h2>
                <div className="grid grid-cols-3 items-center gap-3">
                    {newestPosts.map((post) => (
                        <Card key={post.id} className="flex items-center w-full rounded-2xl">
                            <CardContent className='flex p-3'>
                                <Picture src={post.thumbnailUrl} alt="" className='w-40 h-40 object-cover rounded-xl me-3' />
                                <div>
                                    <span className="text-gray-400 text-sm">
                                        <FontAwesomeIcon icon={faCalendarDays} /> {fDate(post.updatedAt, "dd/MM/yyyy")}
                                    </span>
                                    <CardTitle className='line-clamp-2 text-lg hover:underline'>
                                        <Link to={`/blogs/post/${post.id}`}>{post.title}</Link>
                                    </CardTitle>
                                    <CardDescription className='line-clamp-3'>{post.shortContent}</CardDescription>
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}

export default NewestPosts