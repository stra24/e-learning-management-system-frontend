"use client";
import PageTitle from "@/app/components/page-title/PageTitle";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserListForAdmin() {
	const router = useRouter();

	// 仮ユーザーデータ（本番はAPIで取得予定）
	const users = [
		{
			id: 1, name: "山田 太郎", email: "taro@example.com", username: "taro123",
			thumbnailUrl: "/noname.png", lastLogin: "2025-04-21 18:30", progress: 85,
			createdAt: "2025-03-15 10:00"
		},
		{
			id: 2, name: "佐藤 花子", email: "hanako@example.com", username: "hanako_s",
			thumbnailUrl: "/noname.png", lastLogin: "2025-04-20 09:15", progress: 42,
			createdAt: "2025-03-16 12:20"
		},
		{
			id: 3, name: "田中 一郎", email: "ichiro@example.com", username: "ichiro_t",
			thumbnailUrl: "/noname.png", lastLogin: "2025-04-18 12:45", progress: 100,
			createdAt: "2025-03-14 11:50"
		},
		{
			id: 4, name: "中村 次郎", email: "jiro@example.com", username: "jiro_n",
			thumbnailUrl: "/noname.png", lastLogin: "2025-04-18 14:20", progress: 60,
			createdAt: "2025-03-17 09:10"
		},
		{
			id: 5, name: "高橋 さゆり", email: "sayuri@example.com", username: "sayuri_t",
			thumbnailUrl: "/noname.png", lastLogin: "2025-04-17 08:00", progress: 78,
			createdAt: "2025-03-13 13:30"
		},
		{
			id: 6, name: "加藤 健", email: "ken@example.com", username: "ken_k",
			thumbnailUrl: "/noname.png", lastLogin: "2025-04-15 17:00", progress: 90,
			createdAt: "2025-03-12 15:40"
		},
	];

	// ページネーション
	const itemsPerPage = 3;
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(users.length / itemsPerPage);

	const handleRowClick = (id: number) => {
		router.push(`/admin/users/${id}/edit`);
	};

	const handleDelete = (e: React.MouseEvent, id: number) => {
		e.stopPropagation();
		alert(`ユーザーID ${id} を削除します（実装は後ほど）`);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div className="max-w-[1500px] mx-auto px-4">
			<div className="relative py-18">
				{/* タイトルを中央に配置（表の中央基準） */}
				<h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold">
					ユーザー一覧
				</h1>

				{/* ボタンを右に配置 */}
				<div className="flex justify-end">
					<button
						onClick={() => router.push("/admin/users/create")}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
					>
						ユーザー登録
					</button>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ユーザーID</th>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">サムネイル</th>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">氏名</th>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">メールアドレス</th>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ユーザー名</th>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">作成日時</th>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">最終ログイン日時</th>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">進捗率</th>
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{currentUsers.map((user) => (
							<tr
								key={user.id}
								className="hover:bg-gray-100 cursor-pointer transition"
								onClick={() => handleRowClick(user.id)}
							>
								<td className="px-4 py-1">{user.id}</td>
								<td className="px-4 py-1">
									<img
										src={user.thumbnailUrl}
										alt={user.name}
										className="w-14 h-14 rounded-full object-cover"
									/>
								</td>
								<td className="px-4 py-1">{user.name}</td>
								<td className="px-4 py-1">{user.email}</td>
								<td className="px-4 py-1">{user.username}</td>
								<td className="px-4 py-1">{user.createdAt}</td>
								<td className="px-4 py-1">{user.lastLogin}</td>
								<td className="px-4 py-1">{user.progress}%</td>
								<td className="px-4 py-1">
									<button
										className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
										onClick={(e) => handleDelete(e, user.id)}
									>
										削除
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* ページネーション */}
				<div className="flex items-center justify-center mt-6">
					<button
						onClick={handlePrevPage}
						disabled={currentPage === 1}
						className="px-3 py-1 text-base bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200 enabled:cursor-pointer"
					>
						前へ
					</button>
					<span className="mx-3 text-base text-gray-700">
						{currentPage} / {totalPages} ページ
					</span>
					<button
						onClick={handleNextPage}
						disabled={currentPage === totalPages}
						className="px-3 py-1 text-base bg-gray-200 rounded hover:bg-gray-400 disabled:opacity-50 disabled:hover:bg-transparent enabled:cursor-pointer"
					>
						次へ
					</button>
				</div>
			</div>
		</div>
	);
}
