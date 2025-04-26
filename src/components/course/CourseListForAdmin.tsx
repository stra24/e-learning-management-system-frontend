"use client";
import CourseCard from "@/components/course/CourseCard";
import Link from "next/link";

export default function CourseListForAdmin() {
	return (
		<>
			<div className="max-w-[1100px] mx-auto relative py-18">
				{/* タイトルを中央に配置（表の中央基準） */}
				<h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold">
					コース一覧
				</h1>

				{/* ボタンを右に配置 */}
				<div className="flex justify-end">
					<Link
						href="/admin/courses/new"
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
					>
						コースを新規作成
					</Link>
				</div>
			</div>

			{/* コースカード一覧 */}
			<div className="mx-auto grid grid-cols-3 gap-6 w-fit items-start pb-10">
				<CourseCard
					imageUrl="/sample.png"
					title="Java入門完全攻略ああああああああああああああああああああああああ"
					progress={65}
					description="このコースではJavaの基本からオブジェクト指向、例外処理、Stream APIまで学べます。"
					isAdmin={true}
				/>
				<CourseCard
					imageUrl="/sample.png"
					title="SQL入門完全攻略"
					progress={65}
					description="このコースではSQLの基本を学べます。"
					isAdmin={true}
				/>
				<CourseCard
					imageUrl="/sample.png"
					title="Git完全攻略"
					progress={30}
					description="このコースではGitとGitHubの基礎からチーム開発まで学べます。"
					isAdmin={true}
				/>
				<CourseCard
					imageUrl="/sample.png"
					title="Spring Boot入門"
					progress={0}
					description="このコースではSpring Bootの基本的な使い方を学びます。"
					isAdmin={true}
				/>
				<CourseCard
					imageUrl="/sample.png"
					title="Docker完全攻略"
					progress={10}
					description="このコースではDockerの導入からコンテナ化まで学びます。"
					isAdmin={true}
				/>
			</div>
		</>
	);
}
