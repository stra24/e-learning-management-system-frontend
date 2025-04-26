import LessonListSidebar from "@/components/sidebar/LessonListSidebar";
import LessonDetail from "@/components/lesson/LessonDetail";
import Header from "@/components/Header";

export default function Home() {
	return (
		<div>
			<Header />
			<div className="flex mt-[60px]">
				{/* サイドバー部分 */}
				<div className="w-120 max-h-screen fixed overflow-y-auto border border-r-1 border-gray-300">
					<LessonListSidebar />
				</div>

				{/* メインコンテンツ部分 */}
				<div className="flex-1 max-h-screen ml-[30rem]">
					<LessonDetail />
				</div>
			</div>
		</div>
	);
  }