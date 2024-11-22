import PostCard from '@/components/card/PostCard';
import Picture from '@/components/picture/Picture';
import { Button } from '@/components/ui/button';
import { Post, ShortPost } from '@/models/post';
import postService from '@/services/postService';
import { fDate } from '@/utils/formatDate';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'

const PostDetail: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [postDetail, setPostDetail] = useState<Post>({} as Post);
    const [relatedPosts, setRelatedPost] = useState<ShortPost[]>([]);

    useEffect(() => {
        const fetchData = async (id: number) => {
            try {
                const data = await postService.getPostById(id)
                setPostDetail(data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData(Number(id))
    }, [id])

    useEffect(() => {
        const fetchData = async (id: number) => {
            try {
                const data = await postService.getAllPosts('', id, undefined, 4)
                setRelatedPost(data.content)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData(Number(id))
    }, [id])

    return (
        <div className='container py-20'>
            <div className="text-center space-y-5">
                <h3 className="font-semibold">{postDetail.title}</h3>
                <p>{fDate(postDetail.updatedAt, "dd/MM/yyyy")}</p>
                <p className="text-muted-foreground">{postDetail.shortContent}</p>
                <Picture src={postDetail.thumbnailUrl} alt="" className='w-full' />
            </div>
            <div className="text-justify pt-5 pb-20">
                {postDetail.content}
            </div>
            <div className="flex items-center justify-between py-5">
                <h3 className="font-semibold">{t('relatedPosts')}</h3>
                <Button variant='outline' className='rounded-3xl font-semibold'>
                    {t('viewAllPosts')}
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-5">
                {relatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

export default PostDetail