// app/news/page.tsx
"use client";
import PageTitle from "@/app/components/page-title/PageTitle";
import { useRouter } from 'next/navigation';

export default function NewsList() {
	const router = useRouter();

	const toNewsDetailPage = (newsId: string) => {
		router.push("/admin/news/" + newsId + "/edit");
	};

	const handleDelete = (newsId: number) => {
		console.log(`ニュースID ${newsId} を削除します`);
	};

	const newsList = [
		{ id: 1, date: "2025年1月1日", title: "大事なお知らせ①" },
		{ id: 2, date: "2025年1月2日", title: "大事なお知らせ②" },
		{ id: 3, date: "2025年1月3日", title: "大事なお知らせ③" },
		{ id: 4, date: "2025年1月4日", title: "新機能リリースのお知らせ" },
	];

	return (
		<div className="max-w-[800px] mx-auto px-4">
			<div className="relative py-18">
				{/* タイトルを中央に配置（表の中央基準） */}
				<h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold">
					お知らせ一覧
				</h1>

				{/* ボタンを右に配置 */}
				<div className="flex justify-end">
					<button
						onClick={() => router.push("/admin/news/new")}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap cursor-pointer"
					>
						お知らせを新規作成
					</button>
				</div>
			</div>

			{/* お知らせ一覧 */}
			<ul className="divide-y divide-gray-200">
				{newsList.map((news) => (
					<li
						key={news.id}
						className="py-4 px-2 flex justify-between items-center hover:bg-gray-100 transition cursor-pointer"
						onClick={() => toNewsDetailPage(`${news.id}`)}
					>
						<div>
							<div className="text-gray-600 text-sm">{news.date}</div>
							<div className="text-lg font-medium text-gray-800 mt-1">
								{news.title}
							</div>
						</div>

						<button
							onClick={() => handleDelete(news.id)}
							className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
						>
							削除
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
