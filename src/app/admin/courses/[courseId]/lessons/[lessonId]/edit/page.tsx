'use client';

import { useState } from "react";
import Header from "@/components/Header";
import LessonDetailForAdmin from "@/features/lesson/components/LessonDetailForAdmin";
import LessonListSidebarForAdmin from "@/components/sidebar/LessonListSidebarForAdmin";

export default function Home() {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<{
		type: "group" | "lesson";
		groupId: number;
		lessonId?: number;
		groupTitle?: string; // グループ名を追加
		lessonTitle?: string; // レッスン名を追加
	} | null>(null);

	const confirmDelete = () => {
		if (!deleteTarget) return;

		// ここで削除のロジックを実行（LessonListSidebarForAdminの状態更新）
		if (deleteTarget.type === "group") {
			// グループ削除処理
			console.log("Delete group:", deleteTarget.groupId);
		} else if (deleteTarget.type === "lesson" && deleteTarget.lessonId !== undefined) {
			// レッスン削除処理
			console.log("Delete lesson:", deleteTarget.lessonId);
		}

		setShowDeleteModal(false); // モーダルを閉じる
		setDeleteTarget(null); // 削除対象をリセット
	};

	const cancelDelete = () => {
		setShowDeleteModal(false); // モーダルを閉じる
		setDeleteTarget(null); // 削除対象をリセット
	};

	return (
		<div>
			<Header />
			<div className="flex mt-[60px]">
				{/* サイドバー部分 */}
				<div className="w-120 max-h-screen fixed overflow-y-auto border border-r-1 border-gray-300">
					<LessonListSidebarForAdmin setDeleteTarget={setDeleteTarget} setShowDeleteModal={setShowDeleteModal} />
				</div>

				{/* メインコンテンツ部分 */}
				<div className="flex-1 max-h-screen ml-[30rem]">
					<LessonDetailForAdmin />
				</div>
			</div>

			{/* モーダル表示 */}
			{showDeleteModal && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					{/* 背景（黒くて半透明） */}
					<div className="absolute inset-0 bg-black opacity-70 z-40"></div>

					{/* モーダル本体 */}
					<div className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-50">
						<p className="mb-4 text-lg font-semibold text-gray-800">
							本当に削除してもいいですか？ <br />
							{deleteTarget?.type === "group" && deleteTarget.groupTitle ? (
								<span>・レッスングループ「{deleteTarget.groupTitle}」</span>
							) : null}
							{deleteTarget?.type === "lesson" && deleteTarget.lessonTitle ? (
								<span>・レッスン「{deleteTarget.lessonTitle}」</span>
							) : null}
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={confirmDelete}
								className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
							>
								削除する
							</button>
							<button
								onClick={cancelDelete}
								className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
							>
								キャンセル
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
