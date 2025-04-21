"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PostPaginationProps {
  total: number
  page: number
  limit: number
}

/**
 * Generates an array of page numbers with possible ellipsis indicators for pagination
 */
function generatePaginationItems(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  // For small number of pages, show all page numbers
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // For larger number of pages, show a subset with ellipsis
  const items: (number | 'ellipsis')[] = [1]

  // Logic for showing ellipsis and relevant page numbers
  if (currentPage <= 3) {
    items.push(2, 3, 4, 'ellipsis', totalPages)
  } else if (currentPage >= totalPages - 2) {
    items.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    items.push(
      'ellipsis',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis',
      totalPages
    )
  }

  return items
}

export function PostPagination({ total, page, limit }: PostPaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit)
  
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null

  // Function to create URL with the updated page parameter
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }
  
  // Generate page items array
  const paginationItems = generatePaginationItems(page, totalPages)

  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={page > 1 ? createPageURL(page - 1) : '#'}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {paginationItems.map((item, index) => (
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink 
                href={createPageURL(item)}
                isActive={page === item}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        ))}

        <PaginationItem>
          <PaginationNext
            href={page < totalPages ? createPageURL(page + 1) : '#'}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : undefined}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PostPagination