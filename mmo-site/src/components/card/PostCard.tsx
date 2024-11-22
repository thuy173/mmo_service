import { ShortPost } from '@/models/post'
import React from 'react'
import Picture from '../picture/Picture';
import { fDate } from '@/utils/formatDate';
import { Link } from 'react-router-dom';

type PostCardProps = {
    post: ShortPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <div className='flex flex-col gap-1'>
            <Picture
                isAvatar={false}
                src={post.thumbnailUrl}
                alt={post.title}
                className='w-full aspect-square object-cover mb-2'
            />
            <span className="text-sm text-muted-foreground">{fDate(post.updatedAt, "dd/MM/yyyy")}</span>
            <h6 className="font-semibold hover:underline">
                <Link to={`/blogs/post/${post.id}`}>{post.title}</Link>
            </h6>
            <p className="line-clamp-2 text-muted-foreground">
                {post.shortContent}
            </p>
        </div>
    )
}

export default PostCard