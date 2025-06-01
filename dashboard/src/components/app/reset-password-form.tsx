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
import { useNavigate, useParams } from "react-router";
import { useResetPasswordMutation } from "@/redux/api/authApi";

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const { token } = useParams();
	console.log(token);
	const navigate = useNavigate();
	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	const formSchema = z
		.object({
			password: z
				.string({
					required_error: "Password is required",
				})
				.min(6, "Password must be at least 6 characters"),
			confirmPassword: z.string({
				required_error: "Confirm Password is required",
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords do not match",
			path: ["confirmPassword"],
		});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!token) {
			toast.error("Missing reset token.");
			return;
		}

		try {
			const { password } = values;
			const res = await resetPassword({ token, password });

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
						Reset Password
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="New password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Confirm password"
												{...field}
											/>
										</FormControl>
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
