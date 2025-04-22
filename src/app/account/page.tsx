"use client";

import { useState } from "react";
import PageTitle from "@/app/components/page-title/PageTitle";
import Header from "@/app/components/Header";

export default function MyAccount() {
	const [userName, setUserName] = useState("yamada_taro");
	const [fullName, setFullName] = useState("山田 太郎");
	const [email, setEmail] = useState("taro@example.com");
	const [thumbnailUrl, setThumbnailUrl] = useState("/profile.png");

	const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedThumbnail(file);
			setThumbnailUrl(URL.createObjectURL(file)); // 一時的に表示
		}
	};


	const [newUserName, setNewUserName] = useState("");

	// ユーザー名の変更
	const [isUserNameUpdateModalOpen, setIsUserNameUpdateModalOpen] = useState(false);
	const updateUserName = () => {
		if (newUserName.trim()) {
			setUserName(newUserName);
		}
		setIsUserNameUpdateModalOpen(false);
	};

	const [isPasswordUpdateModalOpen, setIsPasswordUpdateModalOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const updatePassword = () => {
		if (!currentPassword.trim() || !newPassword.trim()) {
			alert("すべての項目を入力してください");
			return;
		}

		// リセット & 閉じる
		setCurrentPassword("");
		setNewPassword("");
		setIsPasswordUpdateModalOpen(false);
	};

	return (
		<>
			<Header />
			<div className="max-w-3xl mx-auto">
				{/* タイトル */}
				<PageTitle title="マイアカウント" />

				{/* アカウント情報 */}
				<div className="border border-gray-300 rounded overflow-hidden">
					{[
						{
							label: "氏名",
							value: fullName,
						},
						{
							label: "メールアドレス",
							value: email,
						},
						{
							label: "サムネイル画像",
							value: (
								<div className="flex items-center gap-4">
									<img
										src={thumbnailUrl}
										alt="サムネイル"
										className="w-32 h-32 rounded-full object-cover object-center border border-gray-300"
									/>
									<label className="text-blue-600 hover:underline hover:cursor-pointer">
										変更
										<input
											type="file"
											accept="image/*"
											onChange={handleThumbnailChange}
											className="hidden"
										/>
									</label>
								</div>
							),
						},
						{
							label: "ユーザー名",
							value: (
								<div className="flex items-center gap-4">
									<span className="text-gray-900 font-medium">{userName}</span>
									<button
										className="text-blue-600 hover:underline hover:cursor-pointer"
										onClick={() => {
											setNewUserName(userName);
											setIsUserNameUpdateModalOpen(true);
										}}
									>
										変更
									</button>
								</div>
							),
						},
						{
							label: "パスワード",
							value:
								<button
									className="text-blue-600 hover:underline hover:cursor-pointer"
									onClick={() => setIsPasswordUpdateModalOpen(true)}
								>
									変更
								</button>,
						},
					].map((item, index) => (
						<div key={index} className="grid grid-cols-[180px_1fr]">
							{/* 項目名 */}
							<div className="bg-gray-100 px-4 py-4 border-b border-gray-300 border-r">
								<span className="text-gray-700 font-medium">{item.label}</span>
							</div>

							{/* 値 */}
							<div className="bg-white px-4 py-4 border-b border-gray-300">
								{item.value}
							</div>
						</div>
					))}
				</div>

				{/* ユーザー名変更モーダル */}
				{isUserNameUpdateModalOpen && (
					<div
						className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
						onClick={() => setIsUserNameUpdateModalOpen(false)}
					>
						<div
							className="bg-white opacity-100 rounded-lg p-6 w-full max-w-md shadow-lg"
							onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じない
						>
							<h2 className="text-lg font-semibold mb-6 text-center">ユーザー名の変更</h2>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									現在のユーザー名
								</label>
								<div className="bg-gray-200 p-2 rounded text-sm">{userName}</div>
							</div>

							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									新しいユーザー名
								</label>
								<input
									type="text"
									value=""
									onChange={(e) => setNewUserName(e.target.value)}
									className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
								/>
							</div>

							<div className="flex justify-end gap-3">
								<button
									className="px-4 py-2 text-gray-600 hover:underline hover:cursor-pointer"
									onClick={() => setIsUserNameUpdateModalOpen(false)}
								>
									キャンセル
								</button>
								<button
									className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
									onClick={updateUserName}
								>
									保存
								</button>
							</div>
						</div>
					</div>
				)}

				{isPasswordUpdateModalOpen && (
					<div
						className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
						onClick={() => setIsPasswordUpdateModalOpen(false)}
					>
						<div
							className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							<h2 className="text-lg font-semibold mb-6 text-center">パスワードの変更</h2>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									現在のパスワード
								</label>
								<input
									type="password"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
									className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
								/>
							</div>

							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									新しいパスワード
								</label>
								<input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
								/>
							</div>

							<div className="flex justify-end gap-3">
								<button
									className="px-4 py-2 text-gray-600 hover:underline hover:cursor-pointer"
									onClick={() => setIsPasswordUpdateModalOpen(false)}
								>
									キャンセル
								</button>
								<button
									className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
									onClick={updatePassword}
								>
									保存
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
