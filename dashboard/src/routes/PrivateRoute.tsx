import { UserProps } from "@/types/auth";
import { Navigate, Outlet } from "react-router";

interface RoleBasedRouteProps {
	user: UserProps;
	allowedRole: "admin" | "user";
}

const PrivateRoute = ({ user, allowedRole }: RoleBasedRouteProps) => {
	if (!user || !user.email) {
		return <Navigate to="/login" replace />;
	}

	if (user.role !== allowedRole) {
		// Optional: redirect to their correct dashboard
		return <Navigate to={`/${user.role}/dashboard`} replace />;
	}

	return <Outlet />;
};

export default PrivateRoute;
