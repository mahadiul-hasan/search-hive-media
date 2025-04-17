import { ClickColumns } from "@/components/app/admin/click/click-column";
import { ClickDataTable } from "@/components/app/admin/click/click-table";
import { useGetAllShortUrlQuery } from "@/redux/api/clickApi";

export default function ClickStat() {
	const { data } = useGetAllShortUrlQuery({});
	const shortUrl = data?.data || [];

	return (
		<div className="mt-5">
			<ClickDataTable columns={ClickColumns} data={shortUrl} />
		</div>
	);
}
