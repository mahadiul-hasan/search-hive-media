/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Route, Routes } from "react-router";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./components/Layout";
import { getUserInfo } from "./services/auth.service";
import CreateUser from "./pages/admin/users/CreateUser";
import Users from "./pages/admin/users/Users";
import UpdateUser from "./pages/admin/users/UpdateUser";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import UserUpdate from "./pages/UserUpdate";
import Contacts from "./pages/admin/contacts/Contacts";
import SearchFeed from "./pages/admin/searchFeed/SearchFeed";
import CreateSearchFeed from "./pages/admin/searchFeed/CreateSearchFeed";
import UpdateSearchFeed from "./pages/admin/searchFeed/UpdateSearchFeed";
import SearchStat from "./pages/admin/searchStat/SearchStat";
import CreateSearchStat from "./pages/admin/searchStat/CreateSearchStat";
import UpdateSearchStat from "./pages/admin/searchStat/UpdateSearchStat";
import ClickStat from "./pages/admin/ClickStat/ClickStat";
import ClickDetails from "./pages/admin/ClickStat/ClickDetails";
import UserSearchFeed from "./pages/user/searchFeed/UserSearchFeed";
import Report from "./pages/user/reports/Report";

function App() {
	const user = getUserInfo() as any;
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Navigate
						to={user ? `/${user.role}/dashboard` : "/login"}
						replace
					/>
				}
			/>

			<Route path="/login" element={<Login />} />

			<Route element={<PrivateRoute user={user} allowedRole="admin" />}>
				<Route path="/admin" element={<Layout />}>
					<Route path="dashboard" element={<AdminDashboard />} />
					<Route path="users" element={<Users />} />
					<Route path="create-user" element={<CreateUser />} />
					<Route path="update-user/:id" element={<UpdateUser />} />
					<Route path="update-profile/:id" element={<UserUpdate />} />
					<Route path="profile" element={<Profile />} />
					<Route
						path="change-password"
						element={<ChangePassword />}
					/>
					<Route path="contacts" element={<Contacts />} />
					<Route path="search-feeds" element={<SearchFeed />} />
					<Route
						path="create-search-feed"
						element={<CreateSearchFeed />}
					/>
					<Route
						path="update-search-feed/:id"
						element={<UpdateSearchFeed />}
					/>
					<Route path="search-stats" element={<SearchStat />} />
					<Route
						path="create-search-stat"
						element={<CreateSearchStat />}
					/>
					<Route
						path="update-search-stat/:id"
						element={<UpdateSearchStat />}
					/>
					<Route path="click-stats" element={<ClickStat />} />
					<Route
						path="click-stats/:shortUrl"
						element={<ClickDetails />}
					/>
				</Route>
			</Route>

			<Route element={<PrivateRoute user={user} allowedRole="user" />}>
				<Route path="/user" element={<Layout />}>
					<Route path="dashboard" element={<UserDashboard />} />
					<Route path="update-profile/:id" element={<UserUpdate />} />
					<Route path="profile" element={<Profile />} />
					<Route
						path="change-password"
						element={<ChangePassword />}
					/>
					<Route path="search-feed" element={<UserSearchFeed />} />
					<Route path="reports" element={<Report />} />
				</Route>
			</Route>

			{/* Fallback for unknown routes */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;
