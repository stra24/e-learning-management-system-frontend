"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from 'next/navigation';
import MultiColumnPageTitle from "@/components/page-title/MultiColumnPageTitle";
import Thumbnail from "@/components/Thumbnail";
import { useApiRequest } from "@/hooks/useApiRequest";
import { CourseDto } from "@/features/course/types";

export default function CourseDetail() {
	const router = useRouter();

	const paramCourseId = useParams().courseId; // URL パラメータから courseId を取得
	const pathname = usePathname();
	const isNewCourse = pathname === '/admin/courses/new';

	// フォーム
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	// 認証にまつわるState
	const [courseId, setCourseId] = useState<string | null>(null);

	// ファイルアップロードAPI
	const {
		executeApi: executeUploadFileApi,
		isLoading: isLoadingUploadFileApi,
		isError: isErrorUploadFileApi,
		response: responseOfUploadFileApi
	} = useApiRequest();

	// コース新規作成API
	const {
		executeApi: executeCreateCourseApi,
		isLoading: isLoadingCreateCourseApi,
		isError: isErrorCreateCourseApi,
		response: responseOfCreateCourseApi
	} = useApiRequest();

	// コース更新API
	const {
		executeApi: executeUpdateCourseApi,
		isLoading: isLoadingUpdateCourseApi,
		isError: isErrorUpdateCourseApi,
		response: responseOfUpdateCourseApi
	} = useApiRequest();

	// コース取得API
	const {
		executeApi: executeFindCourseByIdApi,
		isLoading: isLoadingFindCourseByIdApi,
		response: responseOfFindCourseByIdApi,
		isError: isErrorFindCourseByIdApi
	} = useApiRequest();

	// サムネイル画像変更時の関数
	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setThumbnailFile(file); // ファイル
			setThumbnailUrl(URL.createObjectURL(file)); // ファイルのURL
		}
	};

	// フォーム送信時の処理
	const handleSave = async () => {
		try {
			let uploadedThumbnailPath = thumbnailUrl;

			// もし新しいサムネイルが選ばれてたらアップロードする
			if (thumbnailFile) {
				const formData = new FormData();
				formData.append("file", thumbnailFile);

				// 画像アップロードAPIを呼び出し
				const uploadFileApiResponse = await executeUploadFileApi('http://localhost:8080/api/files/upload', 'POST', formData);

				if (!uploadFileApiResponse?.ok) {
					throw new Error('サムネイルアップロード失敗');
				}

				// アップロードしたファイルのパスを取得
				uploadedThumbnailPath = await uploadFileApiResponse.text();
			}

			if (isNewCourse) {
				// コース情報を新規作成する
				const createCourseApiResponse = await executeCreateCourseApi(
					`http://localhost:8080/api/courses`,
					'POST',
					{
						title,
						description,
						thumbnailUrl: uploadedThumbnailPath,
					}
				);

				if (!createCourseApiResponse?.ok) {
					throw new Error('コース新規作成 - 失敗');
				}
			} else {
				// コース情報を更新する
				const updateCourseApiResponse = await executeUpdateCourseApi(
					`http://localhost:8080/api/courses/${courseId}`,
					'PUT',
					{
						courseId,
						title,
						description,
						thumbnailUrl: uploadedThumbnailPath,
					}
				);

				if (!updateCourseApiResponse?.ok) {
					throw new Error('コース更新 - 失敗');
				}
			}

			alert('保存しました！');
			router.push('/admin/courses');
		} catch (error) {
			console.error(error);
			alert('保存に失敗しました');
		}
	};

	useEffect(() => {
		if (paramCourseId) {
			// コース編集画面の場合
			setCourseId(Array.isArray(paramCourseId) ? paramCourseId[0] : paramCourseId);
		} else {
			// コース新規画面の場合
			setCourseId("")
			setTitle("");
			setDescription("");
			setThumbnailUrl("");
		}
	}, [paramCourseId, router]);

	// courseId がセットされたら（編集画面だったら）、コース情報取得を行う。
	useEffect(() => {
		if (courseId && !isNewCourse) {
			executeFindCourseByIdApi(`http://localhost:8080/api/courses/${courseId}`, 'GET');
		}
	}, [courseId, isNewCourse, executeFindCourseByIdApi]);

	useEffect(() => {
		const fetchData = async () => {
			if (courseId && !isNewCourse) {
				const findCourseByIdApiResponse = await executeFindCourseByIdApi(`http://localhost:8080/api/courses/${courseId}`, 'GET');
				findCourseByIdApiResponse?.json().then((courseDto: CourseDto) => {
					setTitle(courseDto.title);
					setDescription(courseDto.description);
					setThumbnailUrl(courseDto.thumbnailUrl);
				})
			}
		}
		fetchData();
	}, [courseId, executeFindCourseByIdApi, isNewCourse])

	return (
		<>
			{/* タイトル */}
			<div className="px-4 max-w-[1000px] mx-auto">
				<MultiColumnPageTitle title={isNewCourse ? "コース新規作成" : "コース編集"} />
			</div>

			{/* フォーム */}
			<div className="mx-auto max-w-[1000px] px-4">
				<form onSubmit={handleSave} className="space-y-6">
					{/* サムネイル画像 */}
					<div>
						<label className="block text-gray-700 font-semibold">サムネイル画像</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleThumbnailChange}
							className="mt-2 px-4 py-2 border rounded-md w-full"
						/>

						{/* 画像プレビュー */}
						{thumbnailUrl && (
							<div className="mt-4">
								<Thumbnail
									thumbnailUrl={thumbnailUrl}
									alt="サムネイル画像プレビュー"
									className="max-w-[300px] max-h-[300px] object-cover rounded-md"
								/>
							</div>
						)}
					</div>

					{/* コースタイトル */}
					<div>
						<label className="block text-gray-700 font-semibold">コースタイトル</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="コースのタイトルを入力"
							required
							className="mt-2 px-4 py-2 border rounded-md w-full"
						/>
					</div>

					{/* コース概要 */}
					<div>
						<label className="block text-gray-700 font-semibold">コース概要</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="コースの概要を入力"
							required
							rows={4}
							className="mt-2 px-4 py-2 border rounded-md w-full"
						/>
					</div>

					{/* 登録ボタン */}
					<div className="flex justify-end">
						<button
							type="submit"
							className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-900 transition"
						>
							登録
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
