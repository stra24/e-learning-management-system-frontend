"use client";
import { useApiRequest } from '@/hooks/useApiRequest';
import { useRouter } from 'next/navigation';
import PageTitle from "@/components/page-title/PageTitle";
import CourseCard from "@/components/course/CourseCard";
import Header from "@/components/Header";
import Link from "next/link";
import { convertDateString } from '@/lib/dateUtil';
import { useEffect, useState } from 'react';
import { NewsDto, NewsPageDto } from '@/types/news';
import { CourseDto, CoursePageDto } from '@/types/course';

export default function Home() {
	const router = useRouter();

	// コースリスト 
	const [courseDtos, setCourseDtos] = useState<CourseDto[]>([]);

	// お知らせリスト 
	const [newsDtos, setNewsDtos] = useState<NewsDto[]>([]);

	// コース一覧取得API
	const {
		executeApi: executeFindCoursesApi,
		isLoading: isLoadingFindCoursesApi,
		isError: isErrorFindCoursesApi,
		response: responseOfFindCoursesApi
	} = useApiRequest();

	// お知らせ一覧取得API
	const {
		executeApi: executeFindNewsApi,
		isLoading: isLoadingFindNewsApi,
		isError: isErrorFindNewsApi,
		response: responseOfFindNewsApi
	} = useApiRequest();

	const toNewsDetailPage = (event: React.MouseEvent<HTMLDivElement>) => {
		const newsId = event.currentTarget.id;
		router.push("/news/" + newsId);
	};

	useEffect(() => {
		const fetchData = async () => {
			const findCoursesApiResponse = await executeFindCoursesApi('http://localhost:8080/api/courses', 'GET');
			findCoursesApiResponse?.json().then((coursePageDto: CoursePageDto) => {
				setCourseDtos(coursePageDto.courseDtos);
			})

			const findNewsApiResponse = await executeFindNewsApi('http://localhost:8080/api/news', 'GET');
			findNewsApiResponse?.json().then((newsPageDto: NewsPageDto) => {
				setNewsDtos(newsPageDto.newsDtos);
			})
		}
		fetchData();
	}, [executeFindCoursesApi, executeFindNewsApi])

	if (isErrorFindCoursesApi || isErrorFindNewsApi) return <div>エラーが発生しました</div>;
	if (isLoadingFindCoursesApi || isLoadingFindNewsApi) return <div>読み込み中...</div>;

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
					{newsDtos.map((news) => (
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
				{courseDtos.map((course) => (
					<CourseCard
						key={course.id}
						courseId={course.id}
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
