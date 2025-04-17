/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronsLeft } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { removeUserInfo } from "@/services/auth.service";
import { Link, useNavigate } from "react-router";
import avatar from "@/assets/avatar.jpg";
import { useLogoutMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

export const Header = ({ collapsed, setCollapsed, name }: any) => {
	const navigate = useNavigate();
	const [logout, { isLoading }] = useLogoutMutation();

	const logOut = async () => {
		try {
			const res = await logout({});
			if ("data" in res) {
				removeUserInfo("accessToken");
				toast.success(res.data.message);
				navigate("/login");
			} else if ("error" in res) {
				// @ts-expect-error since TS doesn't know the exact shape
				toast.error(res?.error?.data || "An unknown error occurred.");
			}
		} catch (err: any) {
			toast.error(err.message);
		}
	};

	return (
		<header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors">
			<div className="flex items-center gap-x-3">
				<Button
					variant="outline"
					className="btn-ghost size-10"
					onClick={() => setCollapsed(!collapsed)}
				>
					<ChevronsLeft className={collapsed && "rotate-180"} />
				</Button>
			</div>
			<div className="flex items-center gap-x-3">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className="cursor-pointer">
							<AvatarImage src={avatar} />
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>{name}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link to="profile">Profile</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link to="change-password">Change Password</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={logOut}
						>
							{isLoading ? "Loading..." : "Logout"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
};
