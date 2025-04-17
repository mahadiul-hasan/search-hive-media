/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";

export default function ProfilePage({ user }: any) {
	return (
		<Card className="w-full">
			<CardHeader className="flex items-center justify-between gap-4">
				{/* Left: Avatar + Name */}
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
					</Avatar>
					<div>
						<CardTitle className="text-xl font-semibold">
							{user?.name || "No Name"}
						</CardTitle>
					</div>
				</div>

				{/* Right: Email + Role */}
				<div className="text-right space-y-1">
					<h4 className="text-sm font-medium text-gray-800">
						Email: {user.email || "—"}
					</h4>
					<h4 className="text-sm text-gray-600">
						Role: {user.role || "—"}
					</h4>
				</div>
			</CardHeader>
			<hr />
			<CardContent className="space-y-8">
				<div className="text-sm text-gray-700 space-y-4">
					<h5 className="font-semibold text-center text-gray-800">
						Personal Details
					</h5>
					<div className="border border-gray-300 rounded divide-y divide-gray-300 overflow-hidden">
						{[
							["Phone", user.personalDetails?.phone],
							["Skype", user.personalDetails?.skype],
							["Telegram", user.personalDetails?.telegram],
							["LinkedIn", user.personalDetails?.linkedin],
							["Company", user.personalDetails?.companyName],
							["Address", user.personalDetails?.address],
							["Country", user.personalDetails?.country],
							["State", user.personalDetails?.state],
							["ZIP", user.personalDetails?.zip],
							["VAT", user.personalDetails?.vat],
							["Balance", user.personalDetails?.balance ?? "0"],
							["Timezone", user.personalDetails?.timezone],
							["Currency", user.personalDetails?.currency],
						].map(([label, value], i) => (
							<div key={i} className="grid grid-cols-2">
								<div className="p-2 font-medium border-r border-gray-300">
									{label}
								</div>
								<div className="p-2">{value || "—"}</div>
							</div>
						))}
					</div>
				</div>

				<hr />

				<div className="text-sm text-gray-700 space-y-4">
					<h5 className="font-semibold text-center text-gray-800">
						Payment Details
					</h5>
					<div className="border border-gray-300 rounded divide-y divide-gray-300 overflow-hidden">
						{[
							["Method", user.paymentDetails?.method],
							["Account", user.paymentDetails?.account],
						].map(([label, value], i) => (
							<div key={i} className="grid grid-cols-2">
								<div className="p-2 font-medium border-r border-gray-300">
									{label}
								</div>
								<div className="p-2">{value || "—"}</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>

			<hr />
			<CardFooter className="flex justify-between">
				<Button variant="destructive">
					<Link to={`/${user.role}/change-password`}>
						Change Password
					</Link>
				</Button>
				<Button>
					<Link to={`/${user.role}/update-profile/${user._id}`}>
						Update Profile
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
