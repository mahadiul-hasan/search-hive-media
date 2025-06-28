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
// import { useNavigate } from "react-router";
import { useUsersQuery } from "@/redux/api/userApi";
import Loader from "@/components/Loader";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
	useSingleSearchFeedQuery,
	useUpdateSearchFeedMutation,
} from "@/redux/api/searchFeedApi";
import { IUser } from "@/types/user";
import CustomSelect from "@/components/ui/CustomSelect";
import {
	countryOptions,
	searchEngineOption,
	statusOption,
} from "@/utils/SelectFields";
import { MultiSelect } from "@/components/ui/MultiSelect";

export function UpdateSearchFeedForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const navigate = useNavigate();
	const params = useParams();
	const searchFeedId = params.id as string;
	const { data, isLoading } = useSingleSearchFeedQuery(searchFeedId);
	const searchFeed = data?.data;

	const { data: userData } = useUsersQuery({});
	const users = userData?.data || [];

	const userOptions = users.map((user: IUser) => {
		return {
			label: user.name,
			value: user._id,
		};
	});

	const [updateSearchFeed, { isLoading: isUpdating }] =
		useUpdateSearchFeedMutation();

	const formSchema = z.object({
		feedId: z.string().optional(),
		name: z.string().optional(),
		search_cap: z.string().optional(),
		search_engine: z
			.enum(["google", "bing", "yahoo", "duckduckgo"])
			.optional(),
		status: z.enum(["active", "inactive"]).optional(),
		tid_level: z.string().optional(),
		type_integration: z.string().optional(),
		type_search: z.string().optional(),
		type_traffic: z.string().optional(),
		original_url: z.string().url(),
		countries: z.array(z.string().optional()),
		user: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			feedId: "",
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

	useEffect(() => {
		if (searchFeed) {
			form.reset({
				feedId: searchFeed.feedId || "",
				name: searchFeed.name || "",
				search_cap: searchFeed.search_cap || "",
				search_engine: searchFeed.search_engine || "google",
				status: searchFeed.status || "active",
				tid_level: searchFeed.tid_level || "",
				type_integration: searchFeed.type_integration || "",
				type_search: searchFeed.type_search || "",
				type_traffic: searchFeed.type_traffic || "",
				original_url: searchFeed.original_url || "",
				countries: searchFeed.countries || [],
				user: searchFeed.user._id || "",
			});
		}
	}, [form, searchFeed]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Create a copy of the values
			const bodyData = { ...values };

			const res = await updateSearchFeed({
				id: searchFeedId,
				body: bodyData,
			});
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
						Update Search Feed
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
										name="feedId"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Feed Id</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter feed id"
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
										name="name"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter feed name"
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
										name="search_cap"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													Search Cap
												</FormLabel>
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
									<CustomSelect
										label="Search Engine"
										name="search_engine"
										form={form}
										options={searchEngineOption}
									/>
								</div>
								<div className="flex flex-col md:flex-row gap-4">
									<CustomSelect
										label="Status"
										name="status"
										form={form}
										options={statusOption}
									/>
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
								</div>
								<div className="flex flex-col md:flex-row gap-4">
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
									<FormField
										control={form.control}
										name="type_search"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													Search Type
												</FormLabel>
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
								</div>
								<div className="flex flex-col md:flex-row gap-4">
									<FormField
										control={form.control}
										name="type_traffic"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													Traffic Type
												</FormLabel>
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
									<FormField
										control={form.control}
										name="original_url"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													Original Url
												</FormLabel>
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
								</div>
								<div className="flex flex-col md:flex-row gap-4">
									<MultiSelect
										label="Countries"
										name="countries"
										form={form}
										options={countryOptions}
									/>
									<CustomSelect
										label="User"
										name="user"
										form={form}
										options={userOptions}
									/>
								</div>

								<div className="flex justify-center items-center">
									<Button type="submit">
										{isUpdating
											? "Updating..."
											: "Update Search Feed"}
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
