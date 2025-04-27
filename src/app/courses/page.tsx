"use client";
import useSWR from 'swr';
import { fetcherWithJWT } from '@/swr/fetcher';
import { useRouter } from 'next/navigation';
import PageTitle from "@/components/page-title/PageTitle";
import CourseCard from "@/components/course/CourseCard";
import Header from "@/components/Header";
import Link from "next/link";
import { CoursePageDto } from '@/types/course';
import { NewsPageDto } from '@/types/news';
import { convertDateString } from '@/lib/dateUtil';

export default function Home() {
	const router = useRouter();

	const { data: findCoursesApiResponse, error: findCoursesApiError } =
		useSWR<CoursePageDto>('http://localhost:8080/api/courses', fetcherWithJWT);

	const { data: findNewsApiResponse, error: findNewsApiError } =
		useSWR<NewsPageDto>('http://localhost:8080/api/news', fetcherWithJWT);

	const toNewsDetailPage = (event: React.MouseEvent<HTMLDivElement>) => {
		const newsId = event.currentTarget.id;
		router.push("/news/" + newsId);
	};

	if (findCoursesApiError || findNewsApiError) return <div>エラーが発生しました</div>;
	if (!findCoursesApiResponse || !findNewsApiResponse) return <div>読み込み中...</div>;

	return (
		<>
			<Header />
			<PageTitle title="Javaエンジニア養成講座" />

			{/* お知らせ欄 */}
			<div className="border border-gray-300 mx-auto max-w-[1000px] rounded-sm overflow-hidden shadow-md flex flex-col mb-18">
				<div className="text-center py-4">
					<h2 className="text-xl font-semibold">お知らせ</h2>
				</div>
				<div className="px-6 py-4">
					{findNewsApiResponse.newsDtos.map((news) => (
						<div
							key={news.id}
							id={news.id}
							className="border-b border-gray-200 p-2 hover:bg-gray-200 flex items-center hover:cursor-pointer"
							onClick={toNewsDetailPage}
						>
							<p className="text-gray-600 text-sm pr-5">{convertDateString(news.createdAt)}</p>
							<p className="text-gray-600 text-md font-medium">{news.title}</p>
						</div>
					))}
				</div>
				<div className="flex justify-center mb-6">
					<Link href="/news" passHref>
						<button className="border border-blue-600 text-blue-600 px-2 py-1 rounded-sm text-md hover:bg-blue-600 hover:text-white transition duration-100 hover:cursor-pointer">
							もっと見る
						</button>
					</Link>
				</div>
			</div>

			<div className="mx-auto grid grid-cols-3 gap-6 w-fit items-start pb-10">
				{findCoursesApiResponse.courseDtos.map((course) => (
					<CourseCard
						key={course.id}
						imageUrl="/course_thumbnail_sample.png"
						title={course.title}
						description={course.description}
						progress={65}
						isAdmin={false}
					/>
				))}
			</div>
		</>
	);
}
