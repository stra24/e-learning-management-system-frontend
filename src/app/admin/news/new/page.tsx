import Header from "@/app/components/Header";
import NewsDetailForAdmin from "@/app/components/news/NewsDetailForAdmin";
import SidebarForAdmin from "@/app/components/sidebar/SidebarForAdmin";

export interface NewsDetailProps {
	params: {
		newsId: string;
	};
}

export default function NewsPage({ params: { newsId } }: NewsDetailProps) {
	console.log("newsId:", newsId);
	return (
		<>
			<Header />
			<div className="flex mt-[60px]"> {/* 画面全体を高さを使用 */}
				{/* サイドバー部分 */}
				<div className="w-70 max-h-screen fixed border border-r-1 border-gray-300">
					<SidebarForAdmin />
				</div>

				{/* メインコンテンツ部分 */}
				<div className="flex-1 max-h-screen ml-[17.5rem]">
					<NewsDetailForAdmin isNew={true} />
				</div>
			</div>
		</>
	);
}