import { ReportColumns } from "@/components/app/user/reports/report-column";
import { ReportDataTable } from "@/components/app/user/reports/report-table";
import Loader from "@/components/Loader";
import { useMySearchStatQuery } from "@/redux/api/searchStatApi";

export default function Report() {
	const { data, isLoading } = useMySearchStatQuery({});
	const reports = data?.data;

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<ReportDataTable columns={ReportColumns} data={reports} />
			)}
		</>
	);
}
