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
} from "../ui/form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useForgotPasswordMutation } from "@/redux/api/authApi";

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const navigate = useNavigate();
	const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
	const formSchema = z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await forgotPassword(values.email);
			if ("data" in res) {
				toast.success(res.data.message);
				navigate("/login");
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
						Forgot Password
					</CardTitle>
					<p>
						Please provide email address to get forgot-password link
					</p>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="example@gmail.com"
												type="email"
												{...field}
											/>
										</FormControl>
										<Link
											to="/login"
											className="flex justify-end text-blue-500"
										>
											Login
										</Link>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-center items-center">
								<Button type="submit">
									{isLoading ? "Submitting..." : "Submit"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
