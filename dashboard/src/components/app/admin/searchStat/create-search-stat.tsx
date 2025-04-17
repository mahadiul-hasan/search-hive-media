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
import { useSearchFeedsQuery } from "@/redux/api/searchFeedApi";
import { useCreateSearchStatMutation } from "@/redux/api/searchStatApi";
import { ISearchFeed } from "@/types/searchFeed";
import CustomSelect from "@/components/ui/CustomSelect";

export function SearchStatForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const [create, { isLoading }] = useCreateSearchStatMutation();
	const { data } = useSearchFeedsQuery({});
	const feeds = data?.data || [];
	const navigate = useNavigate();

	const feedOptions = feeds?.map((feed: ISearchFeed) => {
		return {
			label: feed?.name,
			value: feed?._id,
		};
	});

	const formSchema = z.object({
		searches: z.string().optional(),
		valid: z.string().optional(),
		mistake: z.string().optional(),
		monetized: z.string().optional(),
		unique_ips: z.string().optional(),
		visitors: z.string().optional(),
		ctr: z.string().optional(),
		coverage: z.string().optional(),
		clicks: z.string().optional(),
		epc: z.string().optional(),
		rpm: z.string().optional(),
		revenue: z.string().optional(),

		ip: z.string().optional(),
		os: z.string().optional(),
		browser: z.string().optional(),
		device: z.string().optional(),
		domain: z.string().optional(),
		keyword: z.string().optional(),
		searchFeed: z.string({
			required_error: "Feed ID is required",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			searches: "",
			valid: "",
			mistake: "",
			monetized: "",
			unique_ips: "",
			visitors: "",
			ctr: "",
			coverage: "",
			clicks: "",
			epc: "",
			rpm: "",
			revenue: "",
			ip: "",
			os: "",
			browser: "",
			device: "",
			domain: "",
			keyword: "",
			searchFeed: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await create({ ...values });
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
						Create Search Stat
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
									name="searches"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Searches</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter total searches"
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
									name="valid"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Valid</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter valid clicks"
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
									name="mistake"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Errors</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter errors clicks"
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
									name="monetized"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Monetized</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter monetized"
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
									name="unique_ips"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Unique IP's</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter unique ips"
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
									name="visitors"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Visitors</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter total visitors"
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
									name="ctr"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>CTR</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter ctr"
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
									name="coverage"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Coverage</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter coverage"
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
									name="clicks"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Clicks</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter clicks"
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
									name="epc"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>EPC</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter epc"
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
									name="rpm"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>RPM</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter rpm"
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
									name="revenue"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Revenue</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter revenue"
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
									name="ip"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>IP Address</FormLabel>
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
									data={feeds}
									options={feedOptions}
								/>
							</div>

							<div className="flex justify-center items-center">
								<Button type="submit">
									{isLoading
										? "Creating..."
										: "Create Search Stat"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
