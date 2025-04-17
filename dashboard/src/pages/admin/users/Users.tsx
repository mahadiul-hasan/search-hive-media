import { Button } from "@/components/ui/button";
import { useUsersQuery } from "@/redux/api/userApi";
import { Link } from "react-router";
import { UserDataTable } from "@/components/app/admin/user/user-table";
import { UserColumns } from "@/components/app/admin/user/user-column";

export default function Users() {
	const { data } = useUsersQuery({});

	const users = data?.data || [];

	return (
		<div>
			<div className="flex justify-end items-center">
				<Button>
					<Link to="/admin/create-user">Create User</Link>
				</Button>
			</div>
			<div className="mt-5">
				<UserDataTable columns={UserColumns} data={users} />
			</div>
		</div>
	);
}
