import { SearchStatColumns } from "@/components/app/admin/searchStat/search-stat-column";
import { SearchStatDataTable } from "@/components/app/admin/searchStat/search-stat-table";
import { Button } from "@/components/ui/button";
import { useSearchStatsQuery } from "@/redux/api/searchStatApi";
import { Link } from "react-router";

export default function SearchStat() {
	const { data } = useSearchStatsQuery({});
	const searchStat = data?.data || [];

	return (
		<div>
			<div className="flex justify-end items-center">
				<Button>
					<Link to="/admin/create-search-stat">
						Create Search Stat
					</Link>
				</Button>
			</div>
			<div className="mt-5">
				<SearchStatDataTable
					columns={SearchStatColumns}
					data={searchStat}
				/>
			</div>
		</div>
	);
}
