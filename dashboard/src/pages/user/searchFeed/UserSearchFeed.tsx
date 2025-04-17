import { UserSearchFeedColumns } from "@/components/app/user/searchFeed/search-feed-column";
import { UserSearchFeedDataTable } from "@/components/app/user/searchFeed/search-feed-table";
import { useMySearchFeedQuery } from "@/redux/api/searchFeedApi";

export default function UserSearchFeed() {
	const { data } = useMySearchFeedQuery({});
	const searchFeeds = data?.data || [];

	return (
		<div className="mt-5">
			<UserSearchFeedDataTable
				columns={UserSearchFeedColumns}
				data={searchFeeds}
			/>
		</div>
	);
}
