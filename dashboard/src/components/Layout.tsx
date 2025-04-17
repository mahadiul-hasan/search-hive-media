/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet, redirect } from "react-router";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useMediaQuery } from "@uidotdev/usehooks";
import { getUserInfo, isLoggedIn } from "@/services/auth.service";

const Layout = () => {
	const userLoggedIn = isLoggedIn();
	const isDesktopDevice = useMediaQuery("(min-width: 768px)");
	const [collapsed, setCollapsed] = useState(!isDesktopDevice);

	const sidebarRef = useRef(null);

	useEffect(() => {
		setCollapsed(!isDesktopDevice);
	}, [isDesktopDevice]);

	useClickOutside([sidebarRef], () => {
		if (!isDesktopDevice && !collapsed) {
			setCollapsed(true);
		}
	});

	useEffect(() => {
		if (!userLoggedIn) {
			redirect("/login");
		}
	}, [userLoggedIn]);

	const { name, role } = getUserInfo() as any;

	return (
		<div className="min-h-screen bg-white transition-colors">
			<div
				className={cn(
					"pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
					!collapsed &&
						"max-md:pointer-events-auto max-md:z-50 max-md:opacity-30"
				)}
			/>
			<Sidebar ref={sidebarRef} collapsed={collapsed} role={role} />
			<div
				className={cn(
					"transition-[margin] duration-300",
					collapsed ? "md:ml-[70px]" : "md:ml-[240px]"
				)}
			>
				<Header
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					name={name}
				/>
				<div className="overflow-y-auto overflow-x-hidden p-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default Layout;
