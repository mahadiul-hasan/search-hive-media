/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
	useSingleUserQuery,
	useUpdateUserOwnMutation,
} from "@/redux/api/userApi";
import Loader from "@/components/Loader";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import CustomSelect from "../ui/CustomSelect";
import {
	currencyOptions,
	roleOptions,
	timezoneOptions,
} from "@/utils/SelectFields";

export function UpdateUserOwnForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const navigate = useNavigate();
	const params = useParams();
	const userId = params.id as string;
	const { data, isLoading } = useSingleUserQuery(userId);
	const user = data?.data;

	const [updateUserOwn, { isLoading: isUpdating }] =
		useUpdateUserOwnMutation();

	const formSchema = z.object({
		name: z.string().optional(),
		email: z.string().email().optional(),
		role: z.string().optional(),
		personalDetails: z
			.object({
				phone: z.string().optional(),
				skype: z.string().optional(),
				telegram: z.string().optional(),
				linkedin: z.string().optional(),
				balance: z.string().optional(),
				address: z.string().optional(),
				companyName: z.string().optional(),
				vat: z.string().optional(),
				country: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				timezone: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		paymentDetails: z
			.object({
				method: z.string().optional(),
				account: z.string().optional(),
			})
			.optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			role: "",
			personalDetails: {
				phone: "",
				skype: "",
				telegram: "",
				linkedin: "",
				balance: "0",
				address: "",
				companyName: "",
				vat: "",
				country: "",
				state: "",
				zip: "",
				timezone: "",
				currency: "",
			},
			paymentDetails: {
				method: "",
				account: "",
			},
		},
	});

	useEffect(() => {
		if (user) {
			form.reset({
				name: user.name || "",
				email: user.email || "",
				role: user.role || "",
				personalDetails: {
					phone: user.personalDetails?.phone || "",
					skype: user.personalDetails?.skype || "",
					telegram: user.personalDetails?.telegram || "",
					linkedin: user.personalDetails?.linkedin || "",
					balance: user.personalDetails?.balance || "0",
					address: user.personalDetails?.address || "",
					companyName: user.personalDetails?.companyName || "",
					vat: user.personalDetails?.vat || "",
					country: user.personalDetails?.country || "",
					state: user.personalDetails?.state || "",
					zip: user.personalDetails?.zip || "",
					timezone: user.personalDetails?.timezone || "",
					currency: user.personalDetails?.currency || "",
				},
				paymentDetails: {
					method: user.paymentDetails?.method || "",
					account: user.paymentDetails?.account || "",
				},
			});
		}
	}, [form, user]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			values.role = user.role;
			const res = await updateUserOwn({ ...values });
			if ("data" in res) {
				toast.success(res.data.message);
				return navigate(`/${user.role}/profile`);
			} else if ("error" in res) {
				// @ts-expect-error since TS doesn't know the exact shape
				toast.error(res?.error?.data || "An unknown error occurred.");
			}
		} catch (err: any) {
			toast.error(err.message);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl text-center">
						Update User Info
					</CardTitle>
				</CardHeader>

				{isLoading ? (
					<Loader />
				) : (
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								<div className="flex flex-col md:flex-row gap-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter full name"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter email address"
														type="email"
														disabled
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<CustomSelect
										label="Role"
										name="role"
										form={form}
										data={user}
										options={roleOptions}
										disabled={true}
									/>

									<FormField
										control={form.control}
										name="personalDetails.phone"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Phone</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter phone number"
														type="tel"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<FormField
										control={form.control}
										name="personalDetails.skype"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Skype</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter Skype ID"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="personalDetails.telegram"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Telegram</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter Telegram username"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<FormField
										control={form.control}
										name="personalDetails.linkedin"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>LinkedIn</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter LinkedIn profile URL"
														type="url"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="personalDetails.balance"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Balance</FormLabel>
												<FormControl>
													<Input
														placeholder="00"
														type="text"
														disabled
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<FormField
										control={form.control}
										name="personalDetails.address"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Address</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter address"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="personalDetails.companyName"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													Company Name
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter company name"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<FormField
										control={form.control}
										name="personalDetails.vat"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>VAT</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter VAT number"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="personalDetails.country"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Country</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter country"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<FormField
										control={form.control}
										name="personalDetails.state"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>State</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter state"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="personalDetails.zip"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>ZIP Code</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter ZIP code"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<CustomSelect
										label="TimeZone"
										name="personalDetails.timezone"
										form={form}
										data={user?.personalDetails}
										options={timezoneOptions}
									/>
									<CustomSelect
										label="Currency"
										name="personalDetails.currency"
										form={form}
										data={user?.personalDetails}
										options={currencyOptions}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-4">
									<FormField
										control={form.control}
										name="paymentDetails.method"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													Payment Method
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., PayPal, Bank"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="paymentDetails.account"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													Payment Account
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter account detail"
														type="text"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex justify-center items-center">
									<Button type="submit">
										{isUpdating
											? "Updating..."
											: "Update User"}
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
