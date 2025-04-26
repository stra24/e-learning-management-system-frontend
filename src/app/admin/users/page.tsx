'use client'

import type { UserPageDto } from "@/types/user";
import useSWR from "swr";
import SidebarForAdmin from "@/components/sidebar/SidebarForAdmin";
import Header from "@/components/Header";
import UserListForAdmin from "@/components/user/UserListForAdmin";

const fetcher = (url: string): Promise<UserPageDto> =>
	fetch(url).then(res => {
		if (!res.ok) throw new Error('Network error')
		return res.json()
	}
);

export default function Home() {
	const { data, error, isLoading } = useSWR<UserPageDto>('http://localhost:8080/api/users', fetcher);

	if (isLoading) return <div>読み込み中...</div>
	if (error) return <div>エラーが発生しました: {error.message}</div>

		console.log(data);
	return (
		<div>
			<Header />
			<div className="flex mt-[60px]"> {/* 画面全体を高さを使用 */}
				{/* サイドバー部分 */}
				<div className="w-70 max-h-screen fixed border border-r-1 border-gray-300">
					<SidebarForAdmin />
				</div>

				{/* メインコンテンツ部分 */}
				<div className="flex-1 max-h-screen ml-[17.5rem]">
					<UserListForAdmin />
				</div>
			</div>
		</div>
	);
}