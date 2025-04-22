// app/news/page.tsx
"use client";
import PageTitle from "@/app/components/page-title/PageTitle";
import { useRouter } from 'next/navigation';

export default function NewsList() {
	const router = useRouter();
	const toNewsDetailPage = (newsId: string) => {
		router.push("/news/" + newsId);
	};

	const newsList = [
		{
			id: 1,
			date: "2025年1月1日",
			title: "大事なお知らせ①",
		},
		{
			id: 2,
			date: "2025年1月2日",
			title: "大事なお知らせ②",
		},
		{
			id: 3,
			date: "2025年1月3日",
			title: "大事なお知らせ③",
		},
		{
			id: 4,
			date: "2025年1月4日",
			title: "新機能リリースのお知らせ",
		},
	];

	return (
		<>
			<PageTitle title="お知らせ一覧" />
			<div className="max-w-[800px] mx-auto mt-8 px-4">
				<ul className="divide-y divide-gray-200">
					{newsList.map((news) => (
						<li
							key={news.id}
							className="py-4 hover:bg-gray-200 px-2 transition cursor-pointer"
							onClick={() => toNewsDetailPage(`${news.id}`)}
						>
							<div className="text-gray-600 text-sm">{news.date}</div>
							<div className="text-lg font-medium text-gray-800 mt-1">{news.title}</div>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
