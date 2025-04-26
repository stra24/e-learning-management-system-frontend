"use client";
import { useState } from "react";

export default function LessonDetailForAdmin() {
	const [videoUrl, setVideoUrl] = useState("https://drive.google.com/file/d/1NO83lbAkhlDD6h3xbX0CX8rUbdUcInuD/preview");
	const [title, setTitle] = useState("第1回：Javaとは？");
	const [description, setDescription] = useState(
		"このレッスンではJavaの概要について説明します。Javaがどのような場面で使われているのか、またその特徴について学びましょう。"
	);

	const handleUpdate = () => {
		// TODO: 更新処理（APIリクエストなど）
		console.log("更新:", { videoUrl, title, description });
		alert("更新しました（仮）");
	};

	return (
		<div className="flex-1 pt-10 px-10 pb-20 overflow-y-auto relative">
			{/* 動画URL */}
			<div className="mb-4">
				<label className="block mb-1 font-semibold">動画URL</label>
				<input
					type="text"
					value={videoUrl}
					onChange={(e) => setVideoUrl(e.target.value)}
					className="w-full border border-gray-300 rounded px-3 py-2"
				/>
			</div>

			{/* 動画プレビュー */}
			<div className="h-[60vh] aspect-video mx-auto mb-6">
				{videoUrl ? (
					<iframe className="w-full h-full" src={videoUrl} title="動画" allowFullScreen></iframe>
				) : (
					<div className="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
						動画URLを入力すると、ここにプレビューが表示されます
					</div>
				)}
			</div>

			{/* レッスンタイトル */}
			<div className="mb-4">
				<label className="block mb-1 font-semibold">レッスンタイトル</label>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full border border-gray-300 rounded px-3 py-2 text-xl font-bold"
				/>
			</div>

			{/* レッスン説明 */}
			<div className="mb-4">
				<label className="block mb-1 font-semibold">レッスン説明</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={10}
					className="w-full border border-gray-300 rounded px-3 py-2 text-base"
				/>
			</div>

			{/* 保存ボタン */}
			<div className="flex justify-end mt-6">
				<button
					onClick={handleUpdate}
					className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-blue-900 transition cursor-pointer"
				>
					保存
				</button>
			</div>
		</div>
	);
}
