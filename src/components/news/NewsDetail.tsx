"use client";

import { useParams } from 'next/navigation';
import PageTitle from "@/components/page-title/PageTitle";
import { fetcherWithJWT } from '@/swr/fetcher';
import { NewsDto } from '@/types/news';
import useSWR from 'swr';
import { convertDateString } from '@/lib/dateUtil';

export default function NewsDetail() {
	const newsId = useParams().newsId;

	const { data: findNewsByIdApiResponse, error: findNewsByIdApiError } =
		useSWR<NewsDto>('http://localhost:8080/api/news/' + newsId, fetcherWithJWT);

	if (findNewsByIdApiError) return <div>エラーが発生しました</div>;
	if (!findNewsByIdApiResponse) return <div>読み込み中...</div>;

	if (!findNewsByIdApiResponse) {
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
				<div className="text-sm text-gray-500 mb-2">{convertDateString(findNewsByIdApiResponse.createdAt)}</div>
				<h2 className="text-2xl font-bold mb-4">{findNewsByIdApiResponse.title}</h2>
				<p className="text-gray-700 leading-relaxed whitespace-pre-line">{findNewsByIdApiResponse.content}</p>
			</div>
		</>
	);
}
