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
import Loader from "@/components/Loader";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useSearchFeedsQuery } from "@/redux/api/searchFeedApi";
import {
	useSingleSearchStatQuery,
	useUpdateSearchStatMutation,
} from "@/redux/api/searchStatApi";
import CustomSelect from "@/components/ui/CustomSelect";
import { ISearchFeed } from "@/types/searchFeed";

export function UpdateSearchStatForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const navigate = useNavigate();
	const params = useParams();
	const searchStatId = params.id as string;
	const { data, isLoading } = useSingleSearchStatQuery(searchStatId);
	const searchStat = data?.data;

	const { data: feedsData } = useSearchFeedsQuery({});
	const feeds = feedsData?.data || [];

	const searchFeedOption = feeds.map((feed: ISearchFeed) => {
		return {
			label: feed.name,
			value: feed._id,
		};
	});

	const [updateSearchStat, { isLoading: isUpdating }] =
		useUpdateSearchStatMutation();

	// const navigate = useNavigate();
	const formSchema = z.object({
		searches: z.number().optional(),
		valid: z.number().optional(),
		mistake: z.number().optional(),
		monetized: z.number().optional(),
		unique_ips: z.number().optional(),
		visitors: z.number().optional(),
		ctr: z.number().optional(),
		coverage: z.number().optional(),
		clicks: z.number().optional(),
		epc: z.number().optional(),
		rpm: z.number().optional(),
		revenue: z.number().optional(),

		ip: z.string().optional(),
		os: z.string().optional(),
		browser: z.string().optional(),
		device: z.string().optional(),
		domain: z.string().optional(),
		keyword: z.string().optional(),
		searchFeed: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			searches: 0,
			valid: 0,
			mistake: 0,
			monetized: 0,
			unique_ips: 0,
			visitors: 0,
			ctr: 0,
			coverage: 0,
			clicks: 0,
			epc: 0,
			rpm: 0,
			revenue: 0,
			ip: "",
			os: "",
			browser: "",
			device: "",
			domain: "",
			keyword: "",
			searchFeed: "",
		},
	});

	useEffect(() => {
		if (searchStat) {
			form.reset({
				searches: searchStat.searches || 0,
				valid: searchStat.valid || 0,
				mistake: searchStat.mistake || 0,
				monetized: searchStat.monetized || 0,
				unique_ips: searchStat.unique_ips || 0,
				visitors: searchStat.visitors || 0,
				ctr: searchStat.ctr || 0,
				coverage: searchStat.coverage || 0,
				clicks: searchStat.clicks || 0,
				epc: searchStat.epc || 0,
				rpm: searchStat.rpm || 0,
				revenue: searchStat.revenue || 0,
				ip: searchStat.ip || "",
				os: searchStat.os || "",
				browser: searchStat.browser || "",
				device: searchStat.device || "",
				domain: searchStat.domain || "",
				keyword: searchStat.keyword || "",
				searchFeed: searchStat.searchFeed._id || "",
			});
		}
	}, [form, searchStat]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Create a copy of the values
			const bodyData = { ...values };

			const res = await updateSearchStat({
				id: searchStatId,
				body: bodyData,
			});
			if ("data" in res) {
				toast.success(res.data.message);
				return navigate("/admin/search-stats");
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
						Update Search Stat
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
										name="searches"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Searches</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter total searches"
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="valid"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Valid</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter valid clicks"
														type="number"
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
										name="mistake"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Errors</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter errors clicks"
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="monetized"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Monetized</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter monetized"
														type="number"
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
										name="unique_ips"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													Unique IP's
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter unique ips"
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="visitors"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Visitors</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter total visitors"
														type="number"
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
										name="ctr"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>CTR</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter ctr"
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="coverage"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Coverage</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter coverage"
														type="number"
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
										name="clicks"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Clicks</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter clicks"
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="epc"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>EPC</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter epc"
														type="number"
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
										name="rpm"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>RPM</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter rpm"
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="revenue"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Revenue</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter revenue"
														type="number"
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
										name="ip"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>
													IP Address
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter IP address"
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
										name="os"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>OS</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter os"
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
										name="browser"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Browser</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter browser"
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
										name="device"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Device</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter device"
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
										name="domain"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Domain</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter domain"
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
										name="keyword"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Keyword</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter keyword"
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
										label="Search Feed"
										name="searchFeed"
										form={form}
										data={searchStat.searchFeed}
										options={searchFeedOption}
										disabled={true}
									/>
								</div>

								<div className="flex justify-center items-center">
									<Button type="submit">
										{isUpdating
											? "Updating..."
											: "Update Search Stat"}
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
