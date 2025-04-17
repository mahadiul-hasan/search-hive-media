import { SearchFeedColumns } from "@/components/app/admin/searchFeed/search-feed-column";
import { SearchFeedDataTable } from "@/components/app/admin/searchFeed/search-feed-table";
import { Button } from "@/components/ui/button";
import { useSearchFeedsQuery } from "@/redux/api/searchFeedApi";
import { Link } from "react-router";

export default function SearchFeed() {
	const { data } = useSearchFeedsQuery({});
	const searchFeed = data?.data || [];

	return (
		<div>
			<div className="flex justify-end items-center">
				<Button>
					<Link to="/admin/create-search-feed">
						Create Search Feed
					</Link>
				</Button>
			</div>
			<div className="mt-5">
				<SearchFeedDataTable
					columns={SearchFeedColumns}
					data={searchFeed}
				/>
			</div>
		</div>
	);
}
