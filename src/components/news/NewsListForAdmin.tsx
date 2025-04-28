"use client";

import { useRouter } from 'next/navigation';
import { NewsDto, NewsPageDto } from '@/types/news';
import { convertDateString } from '@/lib/dateUtil';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useEffect, useState } from 'react';

export default function NewsList() {
	const router = useRouter();

	// お知らせリスト 
	const [newsDtos, setNewsDtos] = useState<NewsDto[]>([]);

	// お知らせ一覧取得API
	const {
		executeApi: executeFindNewsApi,
		isLoading: isLoadingFindNewsApi,
		isError: isErrorFindNewsApi
	} = useApiRequest();

	const toNewsDetailPage = (newsId: string) => {
		router.push("/admin/news/" + newsId + "/edit");
	};

	const handleDelete = (newsId: string) => {
		console.log(`ニュースID ${newsId} を削除します`);
	};

	useEffect(() => {
		const fetchData = async () => {
			const findNewsApiResponse = await executeFindNewsApi('http://localhost:8080/api/news', 'GET');
			findNewsApiResponse?.json().then((newsPageDto: NewsPageDto) => {
				setNewsDtos(newsPageDto.newsDtos);
			})
		}
		fetchData();
	}, [executeFindNewsApi])

	if (isErrorFindNewsApi) return <div>エラーが発生しました</div>;
	if (isLoadingFindNewsApi) return <div>読み込み中...</div>;

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
				{newsDtos.map((newsDto) => (
					<li
						key={newsDto.id}
						className="py-4 px-2 flex justify-between items-center hover:bg-gray-100 transition cursor-pointer"
						onClick={() => toNewsDetailPage(`${newsDto.id}`)}
					>
						<div>
							<div className="text-gray-600 text-sm">
								{convertDateString(newsDto.createdAt)}
							</div>
							<div className="text-lg font-medium text-gray-800 mt-1">
								{newsDto.title}
							</div>
						</div>

						<button
							onClick={() => handleDelete(newsDto.id)}
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
