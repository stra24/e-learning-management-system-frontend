"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import MultiColumnPageTitle from "@/components/page-title/MultiColumnPageTitle";

export default function CourseCreateForm() {
	const router = useRouter();  // クライアントサイドでのみ利用

	// フォームの状態管理
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);  // プレビュー用の状態
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	// サムネイル画像変更時の処理
	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setThumbnail(file);

			// プレビュー用にURL.createObjectURLで一時的なURLを作成
			const previewUrl = URL.createObjectURL(file);
			setThumbnailPreview(previewUrl);
		}
	};

	// フォーム送信時の処理
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// ここでフォーム送信処理（例えばAPI呼び出し）を行います
		console.log("コース情報:", { thumbnail, title, description });

		// 登録後、一覧画面にリダイレクト
		router.push("/admin/courses/list");
	};

	return (
		<>
			{/* タイトル */}
			<div className="px-4 max-w-[1000px] mx-auto">
				<MultiColumnPageTitle title="コース作成" />
			</div>

			{/* フォーム */}
			<div className="mx-auto max-w-[1000px] px-4">
				<form onSubmit={handleSubmit} className="space-y-6">
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
						{thumbnailPreview && (
							<div className="mt-4">
								<img
									src={thumbnailPreview}
									alt="サムネイル画像プレビュー"
									className="max-w-[300px] max-h-[300px] object-cover rounded-md"  // 画像の最大幅と高さを指定
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
