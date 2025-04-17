import { ChangePasswordForm } from "@/components/app/change-password-form";

export default function ChangePassword() {
	return (
		<div className="flex w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<ChangePasswordForm />
			</div>
		</div>
	);
}
