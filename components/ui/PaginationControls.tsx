"use client";

import Link from "next/link";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={`?page=${currentPage - 1}`}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark text-sm font-medium rounded-lg transition-all hover:shadow-md"
        >
          <span className="material-icons text-sm">chevron_left</span>
          Anterior
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/10 text-nordic-dark/30 text-sm font-medium rounded-lg cursor-not-allowed select-none">
          <span className="material-icons text-sm">chevron_left</span>
          Anterior
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={`?page=${page}`}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? "bg-nordic-dark text-white shadow-sm"
                : "bg-white border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque hover:shadow-md"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={`?page=${currentPage + 1}`}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark text-sm font-medium rounded-lg transition-all hover:shadow-md"
        >
          Siguiente
          <span className="material-icons text-sm">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/10 text-nordic-dark/30 text-sm font-medium rounded-lg cursor-not-allowed select-none">
          Siguiente
          <span className="material-icons text-sm">chevron_right</span>
        </span>
      )}
    </div>
  );
}
