import ProfilePage from "@/components/app/profile-page";
import Loader from "@/components/Loader";
import { useMeQuery } from "@/redux/api/userApi";

export default function Profile() {
	const { data, isLoading } = useMeQuery({});
	const user = data?.data || [];

	return (
		<div className="flex w-full items-center justify-center">
			{isLoading ? <Loader /> : <ProfilePage user={user} />}
		</div>
	);
}
