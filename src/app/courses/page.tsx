"use client";
import useSWR from 'swr';
import { fetcherWithJWT } from '@/swr/fetcher';
import { useRouter } from 'next/navigation';
import PageTitle from "@/app/components/page-title/PageTitle";
import CourseCard from "@/app/components/course/CourseCard";
import Header from "@/app/components/Header";
import Link from "next/link";

type CourseDto = {
	id: string;
	thumbnailUrl: string;
	title: string;
	description: string;
};

type CoursePageDto = {
	courseDtos: CourseDto[];
	pageNum: number;
	pageSize: number;
	totalSize: number;
};

export default function Home() {
	const router = useRouter();

	const { data: courseResponse, error } = useSWR<CoursePageDto>('http://localhost:8080/api/courses', fetcherWithJWT);

	const toNewsDetailPage = (event: React.MouseEvent<HTMLDivElement>) => {
		const newsId = event.currentTarget.id;
		router.push("/news/" + newsId);
	};

	if (error) return <div>エラーが発生しました</div>;
	if (!courseResponse) return <div>読み込み中...</div>;

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
					<div id="1" className="border-b border-gray-200 p-2 hover:bg-gray-100 hover:cursor-pointer" onClick={toNewsDetailPage}>
						<p className="text-gray-600 text-md">2025年1月1日　大事なお知らせ</p>
					</div>
					<div id="2" className="border-b border-gray-200 p-2 hover:bg-gray-100 hover:cursor-pointer" onClick={toNewsDetailPage}>
						<p className="text-gray-600 text-md">2025年1月2日　大事なお知らせ</p>
					</div>
					<div id="3" className="border-gray-200 p-2 hover:bg-gray-100 hover:cursor-pointer" onClick={toNewsDetailPage}>
						<p className="text-gray-600 text-md">2025年1月3日　大事なお知らせ</p>
					</div>
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
				{courseResponse.courseDtos.map((course) => (
					<CourseCard
						key={course.id}
						imageUrl="/sample.png"
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
