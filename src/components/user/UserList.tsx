"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import { fetcherWithJWT, fetchResponseWithJWT } from "@/swr/fetcher";
import { UserPageDto } from "@/types/user";
import { convertDateTimeString } from "@/lib/dateUtil";
import Thumbnail from "../Thumbnail";

export default function UserList() {
	const router = useRouter();

	const { data: findUsersApiResponse, error: findUsersApiError, mutate: reloadUsers } =
		useSWR<UserPageDto>('http://localhost:8080/api/users', fetcherWithJWT);

	// 1ページで表示する件数
	const [pageSize, setPageSize] = useState(10);

	// ページ番号
	const [pageNum, setPageNum] = useState(1);

	// 合計ページ数
	const [totalPageNum, setTotalPageNum] = useState(1);

	// ユーザー詳細画面に遷移する関数
	const toUserDetailView = (id: string) => {
		router.push(`/admin/users/${id}/edit`);
	};

	// ユーザーを削除する関数
	const deleteUser = async (e: React.MouseEvent, userId: string) => {
		e.stopPropagation();
		await fetchResponseWithJWT(
			`http://localhost:8080/api/users/${userId}`,
			'DELETE'
		);
		await reloadUsers();
	};

	const handlePrevPage = () => {
		// TODO 要実装
	};

	const handleNextPage = () => {
		// TODO 要実装
	};

	useEffect(() => {
		if (findUsersApiResponse) {
			setTotalPageNum(Math.ceil(findUsersApiResponse.totalSize / pageSize));
		}
	}, [findUsersApiResponse, pageSize]);


	if (findUsersApiError) return <div>エラーが発生しました</div>;
	if (!findUsersApiResponse) return <div>読み込み中...</div>;

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
						onClick={() => router.push("/admin/users/new")}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap hover:cursor-pointer"
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
							<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">権限</th>
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
						{findUsersApiResponse.userDtos.map((user) => (
							<tr
								key={user.id}
								className="hover:bg-gray-200 cursor-pointer transition"
								onClick={() => toUserDetailView
									(user.id)}
							>
								<td className="px-4 py-1">{user.id}</td>
								<td className="px-4 py-1">
									<div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300">
										{user.thumbnailUrl
											? (
												<Thumbnail thumbnailUrl={user.thumbnailUrl} />
											)
											:
											<div></div>
										}
									</div>
								</td>
								<td className="px-4 py-1">{user.userRole}</td>
								<td className="px-4 py-1">{user.realName}</td>
								<td className="px-4 py-1">{user.emailAddress}</td>
								<td className="px-4 py-1">{user.userName}</td>
								<td className="px-4 py-1">{convertDateTimeString(user.createdAt)}</td>
								<td className="px-4 py-1">実装中</td>
								<td className="px-4 py-1">実装中</td>
								<td className="px-4 py-1">
									<button
										className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 hover:cursor-pointer"
										onClick={(e) => deleteUser(e, user.id)}
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
						disabled={pageNum === 1}
						className="px-3 py-1 text-base bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200 enabled:cursor-pointer"
					>
						前へ
					</button>
					<span className="mx-3 text-base text-gray-700">
						{pageNum} / {totalPageNum} ページ
					</span>
					<button
						onClick={handleNextPage}
						disabled={pageNum === totalPageNum}
						className="px-3 py-1 text-base bg-gray-200 rounded hover:bg-gray-400 disabled:opacity-50 disabled:hover:bg-transparent enabled:cursor-pointer"
					>
						次へ
					</button>
				</div>
			</div>
		</div>
	);
}
