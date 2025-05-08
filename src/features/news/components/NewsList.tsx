"use client";

import PageTitle from "@/components/page-title/PageTitle";
import { useRouter } from 'next/navigation';
import { NewsDto, NewsPageDto } from '@/features/news/types';
import { convertDateString } from '@/lib/dateUtil';
import { useEffect, useState } from "react";
import { useApiRequest } from "@/hooks/useApiRequest";

export default function NewsList() {
	const router = useRouter();
	const toNewsDetailPage = (newsId: string) => {
		router.push("/news/" + newsId);
	};

	// お知らせリスト 
	const [newsDtos, setNewsDtos] = useState<NewsDto[]>([]);

	// お知らせ一覧取得API
	const {
		executeApi: executeFindNewsApi,
		isLoading: isLoadingFindNewsApi,
		isError: isErrorFindNewsApi
	} = useApiRequest();

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
		<>
			<PageTitle title="お知らせ一覧" />
			<div className="max-w-[800px] mx-auto mt-8 px-4">
				<ul className="divide-y divide-gray-200">
					{newsDtos.map((newsDto) => (
						<li
							key={newsDto.id}
							className="py-4 hover:bg-gray-200 px-2 transition cursor-pointer"
							onClick={() => toNewsDetailPage(`${newsDto.id}`)}
						>
							<div className="text-gray-600 text-sm">{convertDateString(newsDto.createdAt)}</div>
							<div className="text-lg font-medium text-gray-800 mt-1">{newsDto.title}</div>
						</li>

					))}
				</ul>
			</div>
		</>
	);
}
