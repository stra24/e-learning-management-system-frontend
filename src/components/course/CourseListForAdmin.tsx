"use client";
import CourseCard from "@/components/course/CourseCard";
import { useApiRequest } from "@/hooks/useApiRequest";
import { CourseDto, CoursePageDto } from "@/types/course";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CourseListForAdmin() {
	// コースリスト 
	const [courseDtos, setCourseDtos] = useState<CourseDto[]>([]);

	// コース一覧取得API
	const {
		executeApi: executeFindCoursesApi,
		isLoading: isLoadingFindCoursesApi,
		isError: isErrorFindCoursesApi
	} = useApiRequest();

	// コース削除API
	const {
		executeApi: executeDeleteCourseApi,
	} = useApiRequest();

	const deleteCourse = async (courseId: string) => {
		await executeDeleteCourseApi(`http://localhost:8080/api/courses/${courseId}`, 'DELETE');
		const findCoursesApiResponse = await executeFindCoursesApi('http://localhost:8080/api/courses', 'GET');
		findCoursesApiResponse?.json().then((coursePageDto: CoursePageDto) => {
			setCourseDtos(coursePageDto.courseDtos);
		})
	};

	useEffect(() => {
		const fetchData = async () => {
			const findCoursesApiResponse = await executeFindCoursesApi('http://localhost:8080/api/courses', 'GET');
			findCoursesApiResponse?.json().then((coursePageDto: CoursePageDto) => {
				setCourseDtos(coursePageDto.courseDtos);
			})
		}
		fetchData();
	}, [executeFindCoursesApi])

	if (isErrorFindCoursesApi) return <div>エラーが発生しました</div>;
	if (isLoadingFindCoursesApi) return <div>読み込み中...</div>;

	return (
		<>
			<div className="max-w-[1100px] mx-auto relative py-18">
				{/* タイトルを中央に配置（表の中央基準） */}
				<h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold">
					コース一覧
				</h1>

				{/* ボタンを右に配置 */}
				<div className="flex justify-end">
					<Link
						href="/admin/courses/new"
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
					>
						コースを新規作成
					</Link>
				</div>
			</div>

			{/* コースカード一覧 */}
			<div className="mx-auto grid grid-cols-3 gap-6 w-fit items-start pb-10">
				{courseDtos.map((course) => (
					<CourseCard
						key={course.id}
						courseId={course.id}
						imageUrl={course.thumbnailUrl}
						title={course.title}
						description={course.description}
						progress={65}
						isAdmin={true}
						onDelete={deleteCourse}
					/>
				))}
			</div>
		</>
	);
}
