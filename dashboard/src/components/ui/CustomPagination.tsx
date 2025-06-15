import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
	currentPage: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	maxVisiblePages?: number; // Optional: controls how many page buttons to show
}

export function CustomPagination({
	currentPage,
	totalItems,
	itemsPerPage,
	onPageChange,
	maxVisiblePages = 5,
}: PaginationProps) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) return null;

	// Calculate visible page range
	const getVisiblePages = () => {
		const half = Math.floor(maxVisiblePages / 2);
		let start = Math.max(1, currentPage - half);
		const end = Math.min(totalPages, start + maxVisiblePages - 1);

		// Adjust if we're at the end
		if (end - start + 1 < maxVisiblePages) {
			start = Math.max(1, end - maxVisiblePages + 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const visiblePages = getVisiblePages();

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="flex-1 text-sm text-muted-foreground">
				Showing page {currentPage} of {totalPages} • Total {totalItems}{" "}
				items
			</div>
			<div className="flex items-center space-x-2">
				{/* First page button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(1)}
					disabled={currentPage === 1}
					className="hidden sm:inline-flex"
				>
					<ChevronsLeft className="h-4 w-4" />
				</Button>

				{/* Previous page button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="sr-only">Previous</span>
				</Button>

				{/* Page numbers */}
				<div className="flex space-x-1">
					{visiblePages[0] > 1 && (
						<>
							<Button
								variant={
									currentPage === 1 ? "default" : "outline"
								}
								size="sm"
								onClick={() => onPageChange(1)}
							>
								1
							</Button>
							{visiblePages[0] > 2 && (
								<span className="flex items-center px-2 text-sm">
									...
								</span>
							)}
						</>
					)}

					{visiblePages.map((page) => (
						<Button
							key={page}
							variant={
								currentPage === page ? "default" : "outline"
							}
							size="sm"
							onClick={() => onPageChange(page)}
						>
							{page}
						</Button>
					))}

					{visiblePages[visiblePages.length - 1] < totalPages && (
						<>
							{visiblePages[visiblePages.length - 1] <
								totalPages - 1 && (
								<span className="flex items-center px-2 text-sm">
									...
								</span>
							)}
							<Button
								variant={
									currentPage === totalPages
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => onPageChange(totalPages)}
							>
								{totalPages}
							</Button>
						</>
					)}
				</div>

				{/* Next page button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className="h-4 w-4" />
					<span className="sr-only">Next</span>
				</Button>

				{/* Last page button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages}
					className="hidden sm:inline-flex"
				>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
