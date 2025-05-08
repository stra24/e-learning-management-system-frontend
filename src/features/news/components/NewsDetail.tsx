"use client";

import { useParams } from 'next/navigation';
import PageTitle from "@/components/page-title/PageTitle";
import { NewsDto } from '@/features/news/types';
import { convertDateString } from '@/lib/dateUtil';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useEffect, useState } from 'react';

export default function NewsDetail() {
	const newsId = useParams().newsId;

	// お知らせリスト 
	const [newsDto, setNewsDto] = useState<NewsDto | null>(null);

	// お知らせ取得API
	const {
		executeApi: executeFindNewsByIdApi,
		isLoading: isLoadingFindNewsByIdApi,
		isError: isErrorFindNewsByIdApi
	} = useApiRequest();

	useEffect(() => {
		const fetchData = async () => {
			const findNewsByIdApiResponse = await executeFindNewsByIdApi(`http://localhost:8080/api/news/${newsId}`, 'GET');
			findNewsByIdApiResponse?.json().then((newsDto: NewsDto) => {
				setNewsDto(newsDto);
			})
		}
		fetchData();
	}, [executeFindNewsByIdApi, newsId])

	if (isErrorFindNewsByIdApi) return <div>エラーが発生しました</div>;
	if (isLoadingFindNewsByIdApi) return <div>読み込み中...</div>;

	if (!newsDto) {
		return (
			<>
				<PageTitle title="お知らせ詳細" />
				<div className="text-center mt-20">
					<p className="text-gray-500 text-lg">お知らせが見つかりませんでした。</p>
				</div>
			</>
		);
	}

	return (
		<>
			<PageTitle title="お知らせ詳細" />
			<div className="max-w-[800px] mx-auto mt-10 px-4">
				<div className="text-sm text-gray-500 mb-2">{convertDateString(newsDto.createdAt)}</div>
				<h2 className="text-2xl font-bold mb-4">{newsDto.title}</h2>
				<p className="text-gray-700 leading-relaxed whitespace-pre-line">{newsDto.content}</p>
			</div>
		</>
	);
}
