/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../../ui/form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useCreateSearchFeedMutation } from "@/redux/api/searchFeedApi";
import { useUsersQuery } from "@/redux/api/userApi";
import CustomSelect from "@/components/ui/CustomSelect";
import { IUser } from "@/types/user";
import {
	countryOptions,
	searchEngineOption,
	statusOption,
} from "@/utils/SelectFields";
import { MultiSelect } from "@/components/ui/MultiSelect";

export function SearchFeedForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const [create, { isLoading }] = useCreateSearchFeedMutation();
	const { data } = useUsersQuery({});
	const users = data?.data || [];
	const navigate = useNavigate();

	const userOptions = users?.map((user: IUser) => {
		return {
			label: user?.name,
			value: user?._id,
		};
	});

	const formSchema = z.object({
		name: z.string({
			required_error: "Name is required",
		}),
		search_cap: z.string({
			required_error: "Search cap is required",
		}),
		search_engine: z.enum(["google", "bing", "yahoo", "duckduckgo"]),
		status: z.enum(["active", "inactive"]).optional(),
		tid_level: z.string().optional(),
		type_integration: z.string().optional(),
		type_search: z.string().optional(),
		type_traffic: z.string().optional(),
		original_url: z.string().url(),
		countries: z.array(
			z.string({
				required_error: "Country is required",
			})
		),
		user: z.string({
			required_error: "User ID is required",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			search_cap: "",
			search_engine: "google",
			status: "active",
			tid_level: "",
			type_integration: "",
			type_search: "",
			type_traffic: "",
			original_url: "",
			countries: [],
			user: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await create({ ...values });
			if ("data" in res) {
				toast.success(res.data.message);
				return navigate("/admin/search-feeds");
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
						Create Search Feed
					</CardTitle>
				</CardHeader>
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
									name="search_cap"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Search Cap</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter search cap"
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
									label="Search Engine"
									name="search_engine"
									form={form}
									options={searchEngineOption}
								/>
								<CustomSelect
									label="Status"
									name="status"
									form={form}
									options={statusOption}
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-4">
								<FormField
									control={form.control}
									name="tid_level"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Tid Level</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter tid level"
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
									name="type_integration"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>
												Type Integration
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter type integration"
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
									name="type_search"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Search Type</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter search type"
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
									name="type_traffic"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Traffic Type</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter traffic type"
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
									name="original_url"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Original Url</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter original url"
													type="url"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<MultiSelect
									label="Countries"
									name="countries"
									form={form}
									options={countryOptions}
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-4">
								<CustomSelect
									label="User"
									name="user"
									form={form}
									options={userOptions}
								/>
							</div>

							<div className="flex justify-center items-center">
								<Button type="submit">
									{isLoading
										? "Creating..."
										: "Create Search Feed"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
