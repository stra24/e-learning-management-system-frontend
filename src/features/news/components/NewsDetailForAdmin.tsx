"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MultiColumnPageTitle from "@/components/page-title/MultiColumnPageTitle";
import { useApiRequest } from "@/hooks/useApiRequest";

interface NewsDetailProps {
	newsId?: string;
	// 新規作成であるか（true: 新規作成、false: 更新）
	isNew: boolean;
}

export default function NewsDetail(props: NewsDetailProps) {
	const router = useRouter();

	// 仮の初期データ（後でAPI連携可能）
	const initialNewsMap: Record<string, { date: string; title: string; content: string }> = {
		"1": {
			date: "2025-01-01",
			title: "大事なお知らせ①",
			content: "新年あけましておめでとうございます。今年もよろしくお願いします。",
		},
		"2": {
			date: "2025-01-02",
			title: "大事なお知らせ②",
			content: "新機能のリリース予定についてのお知らせです。",
		},
		"3": {
			date: "2025-01-03",
			title: "大事なお知らせ③",
			content: "メンテナンスのお知らせです。1月5日にサーバーメンテナンスを行います。",
		},
	};

	const [date, setDate] = useState("");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const news = initialNewsMap[props.newsId as string];
	useEffect(
		() => {
			if (news) {
				setDate(news.date);
				setTitle(news.title);
				setContent(news.content);
			}
		},
		[news]
	);

	const handleUpdate = () => {
		// 本来はAPIを呼んで保存する処理
		router.push("/admin/news");
	};

const handleDelete =async (newsId: String) => {
		if (confirm("本当に削除しますか？")) {
			// 削除API呼び出し予定
			await executeDeleteNewsApi(`http://localhost:8080/api/news/${newsId}`, 'DELETE');
			router.push("/admin/news");
		}
	};

	if (!props.isNew && !news) {
		return (
			<>
				<MultiColumnPageTitle title="お知らせ詳細" />
				<p className="text-center mt-10 text-gray-500">お知らせが見つかりませんでした。</p>
			</>
		);
	}

	return (
		<div className="max-w-[800px] mx-auto px-4">
			<MultiColumnPageTitle title="お知らせ詳細" />

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="w-full border border-gray-300 rounded px-3 py-2"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full border border-gray-300 rounded px-3 py-2"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows={6}
						className="w-full border border-gray-300 rounded px-3 py-2"
					></textarea>
				</div>

				<div className="flex space-x-4">
					<button
						onClick={handleUpdate}
						className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
					>
						保存
					</button>

					{!props.isNew && (
						<button
							onClick={handleDelete}
							className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700 transition cursor-pointer"
						>
							削除
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
