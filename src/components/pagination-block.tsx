"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationBlockProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function PaginationBlock({
    page,
    totalPages,
    onPageChange,
}: PaginationBlockProps) {

    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const range = 2;
        const start = Math.max(0, page - range);
        const end = Math.min(totalPages - 1, page + range);
        
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages();

    return (
        <Pagination>
            <PaginationContent>

                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(Math.max(page - 1, 0))}
                        className={page === 0 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Page Numbers */}
                {visiblePages.map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink
                            isActive={page === p}
                            onClick={() => onPageChange(p)}
                        >
                            {p + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            onPageChange(Math.min(page + 1, totalPages - 1))
                        }
                        className={
                            page === totalPages - 1
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    );
}