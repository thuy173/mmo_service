import { Pagination } from "@/components/ui/pagination"
import PostCard from '@/components/card/PostCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShortPost } from '@/models/post'
import { PostCategory } from '@/models/postCategory';
import postCategoryService from '@/services/postCategoryService';
import postService from '@/services/postService';
import { SearchIcon, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { PageResponse } from "@/models/pageResponse";
import useDebounce from "@/hooks/useDebounce";
import EmptyData from "@/components/common/EmptyData";
import { useNavigate, useSearchParams } from "react-router-dom";
import PagingContent from "@/components/common/PagingContent";
import { useTranslation } from "react-i18next";

const Blog: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedCatId, setSelectedCatId] = useState<number>();
    const [searchKey, setSearchKey] = useState<string>('');
    const [postRes, setPostRes] = useState<PageResponse<ShortPost>>({} as PageResponse<ShortPost>);
    const [postCategories, setPostCategories] = useState<PostCategory[]>([]);

    const pageSize = 12;
    const debouncedSearchKey = useDebounce(searchKey, 500);

    useEffect(() => {
        if (page) {
            setCurrentPage(Number(page))
        }
    }, [page])

    useEffect(() => {
        if (page === '1') {
            navigate('/blogs')
        }
    }, [page, navigate])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await postCategoryService.getAllPostCategories()
                setPostCategories(data.content)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        const fetchPostData = async (
            title: string,
            postCategoryId: number | undefined,
            pageNumber: number,
            pageSize: number,
            sortField: string,
            sortDirection: string,
        ) => {
            try {
                const data = await postService.getAllPosts(title, postCategoryId, pageNumber, pageSize, sortField, sortDirection)
                setPostRes(data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchPostData(debouncedSearchKey, selectedCatId, currentPage - 1, pageSize, 'createdAt', 'DESC')
    }, [currentPage, debouncedSearchKey, selectedCatId])

    const handleSelectCat = (value: string) => {
        if (value === '0') {
            setSelectedCatId(undefined)
        } else {
            setSelectedCatId(Number(value))
        }

        setCurrentPage(1)
    }

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value)
        setCurrentPage(1)
    }

    const handleSelectPage = (page: number) => {
        navigate(`/blogs?page=${page}`)
    }

    const handleNextPage = () => {
        if (!postRes.last) {
            handleSelectPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (!postRes.first) {
            handleSelectPage(currentPage - 1)
        }
    }

    return (
        <div className='container py-10'>
            <div className="flex items-center justify-end gap-5 mb-5">
                <Select onValueChange={handleSelectCat}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('allCategories')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='0'>{t('allCategories')}</SelectItem>
                        {postCategories.map((postCategory) => (
                            <SelectItem
                                key={postCategory.id}
                                value={postCategory.id.toString()}
                            >
                                {postCategory.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="relative inline-flex items-center">
                    <Input
                        placeholder={t('searchPost')}
                        className='w-72 pe-9'
                        value={searchKey}
                        onChange={handleSearchInput}
                    />
                    {searchKey.length > 0 ? (
                        <button type="button"
                            className='absolute right-3 p-1 rounded-full hover:bg-secondary'
                            onClick={() => setSearchKey('')}
                        >
                            <XIcon size={12} />
                        </button>
                    ) : (
                        <SearchIcon size={18} className='absolute right-3' />
                    )}
                </div>
            </div>
            <h2 className="font-semibold mb-5">{t('newestPosts')}</h2>
            {postRes.totalElements > 0 ? (
                <>
                    <div className="grid grid-cols-4 gap-5 mb-5">
                        {postRes.content.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                    <div className="py-5">
                        <Pagination>
                            <PagingContent
                                data={postRes}
                                currentPage={currentPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handleSelectPage={handleSelectPage}
                            />
                        </Pagination>
                    </div>
                </>
            ) : (
                <EmptyData message={t('noPostsFound')} />
            )}
        </div>
    )
}

export default Blog