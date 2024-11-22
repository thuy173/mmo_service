import { PageResponse } from '@/models/pageResponse';
import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
type PagingContentProps<T> = {
    data: PageResponse<T>;
    currentPage: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handleSelectPage: (page: number) => void;
};

const PagingContent = <T,>({
    data,
    currentPage,
    handlePrevPage,
    handleNextPage,
    handleSelectPage,
}: PagingContentProps<T>) => {
    const getPaginationItems = () => {
        const pages = [];
        const totalPages = data.totalPages;

        // Show the first page if the current page is greater than 4
        if (currentPage > 3) {
            pages.push(
                <PaginationItem key={1}>
                    <PaginationLink onClick={() => handleSelectPage(1)}>1</PaginationLink>
                </PaginationItem>
            );
        }

        // Show ellipsis before the current range if needed
        if (currentPage > 4) {
            pages.push(
                <PaginationItem key="left-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Show two pages before the current page
        for (let i = Math.max(currentPage - 2, 1); i < currentPage; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => handleSelectPage(i)}>{i}</PaginationLink>
                </PaginationItem>
            );
        }

        // Show the current page
        pages.push(
            <PaginationItem key={currentPage}>
                <PaginationLink isActive>{currentPage}</PaginationLink>
            </PaginationItem>
        );

        // Show two pages after the current page
        for (let i = currentPage + 1; i <= Math.min(currentPage + 2, totalPages); i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => handleSelectPage(i)}>{i}</PaginationLink>
                </PaginationItem>
            );
        }

        // Show ellipsis after the current range if needed
        if (currentPage < totalPages - 3) {
            pages.push(
                <PaginationItem key="right-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Show the last page if the current page is far from the end
        if (currentPage < totalPages - 2) {
            pages.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => handleSelectPage(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }

        return pages;
    };

    return (
        <PaginationContent>
            <PaginationItem onClick={handlePrevPage}>
                <PaginationPrevious />
            </PaginationItem>
            {getPaginationItems()}
            <PaginationItem onClick={handleNextPage}>
                <PaginationNext />
            </PaginationItem>
        </PaginationContent>
    );
}

export default PagingContent;
