import SidebarForAdmin from "@/components/sidebar/SidebarForAdmin";
import Header from "@/components/Header";
import NewsListForAdmin from "@/features/news/components/NewsListForAdmin";

export default function Home() {
	return (
		<div>
			<Header />
			<div className="flex mt-[60px]"> {/* 画面全体を高さを使用 */}
				{/* サイドバー部分 */}
				<div className="w-70 max-h-screen fixed border border-r-1 border-gray-300">
					<SidebarForAdmin />
				</div>

				{/* メインコンテンツ部分 */}
				<div className="flex-1 max-h-screen ml-[17.5rem]">
					<NewsListForAdmin />
				</div>
			</div>
		</div>
	);
}