import { ContactDataTable } from "@/components/app/admin/contact/contact-table";
import { useContactsQuery } from "@/redux/api/contactApi";
import { ContactColumns } from "@/components/app/admin/contact/contact-column";

export default function Contacts() {
	const { data } = useContactsQuery({});

	const contacts = data?.data || [];

	return (
		<div className="mt-5">
			<ContactDataTable columns={ContactColumns} data={contacts} />
		</div>
	);
}
