import PageTitle from "@/components/page-title/PageTitle";
import Header from "@/components/Header";
import UserDetail from "@/components/user/UserDetail";

export default function MyAccount() {
	return (
		<>
			<Header />
			<div>
				{/* タイトル */}
				<PageTitle title="マイアカウント" />

				{/* アカウント情報 */}
				<UserDetail />
			</div>
		</>
	);
}
