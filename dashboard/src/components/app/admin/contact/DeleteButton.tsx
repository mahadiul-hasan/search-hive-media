/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteContactMutation } from "@/redux/api/contactApi";
import toast from "react-hot-toast";

export default function DeleteButton(id: any) {
	const [deleteUser, { isLoading }] = useDeleteContactMutation();
	const deleteHandler = async (id: any) => {
		try {
			const res = await deleteUser(id.id);
			if ("data" in res) {
				toast.success(res.data.message);
			} else if ("error" in res) {
				// @ts-expect-error since TS doesn't know the exact shape
				toast.error(res?.error?.data || "An unknown error occurred.");
			}
		} catch (err: any) {
			toast.error(err.message);
		}
	};

	return (
		<span
			className="text-red-600 hover:text-red-600"
			onClick={() => deleteHandler(id)}
		>
			{isLoading ? "Deleting..." : "Delete Contact"}
		</span>
	);
}
