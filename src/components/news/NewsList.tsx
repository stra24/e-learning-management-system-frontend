// app/news/page.tsx
"use client";
import PageTitle from "@/components/page-title/PageTitle";
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { fetcherWithJWT } from '@/swr/fetcher';
import { NewsPageDto } from '@/types/news';
import { convertDateString } from '@/lib/dateUtil';

export default function NewsList() {
	const router = useRouter();
	const toNewsDetailPage = (newsId: string) => {
		router.push("/news/" + newsId);
	};

	const { data: findNewsApiResponse, error: findNewsApiError } =
		useSWR<NewsPageDto>('http://localhost:8080/api/news', fetcherWithJWT);

	if (findNewsApiError) return <div>エラーが発生しました</div>;
	if (!findNewsApiResponse) return <div>読み込み中...</div>;

	return (
		<>
			<PageTitle title="お知らせ一覧" />
			<div className="max-w-[800px] mx-auto mt-8 px-4">
				<ul className="divide-y divide-gray-200">
					{findNewsApiResponse.newsDtos.map((newsDto) => (
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
