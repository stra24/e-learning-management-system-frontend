"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import PageTitle from "@/components/page-title/PageTitle";
import Header from "@/components/Header";
import { fetcherWithJWT, fetchResponseWithJWT } from '@/swr/fetcher';
import type { UserDto } from "@/types/user";
import Image from "next/image";

export default function MyAccount() {
	const router = useRouter();

	// 画面に表示するState
	const [realName, setRealName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [thumbnailUrl, setThumbnailUrl] = useState("/profile.png");
	const [userName, setUserName] = useState("");

	// 変更にまつわるState
	const [newUserName, setNewUserName] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	// モーダルのオープン状態を表すState
	const [isUserNameUpdateModalOpen, setIsUserNameUpdateModalOpen] = useState(false);
	const [isPasswordUpdateModalOpen, setIsPasswordUpdateModalOpen] = useState(false);

	// 認証にまつわるState
	const [userId, setUserId] = useState<string | null>(null);

	// サムネイル画像を変更する関数
	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setThumbnailUrl(URL.createObjectURL(file));

			// TODO ユーザー情報変更APIを実行する。	
		}
	};

	// ユーザー名を変更する関数
	const updateUserName = () => {
		if (newUserName.trim()) {
			setUserName(newUserName);
		}

		// TODO ユーザー情報変更APIを実行する。

		setIsUserNameUpdateModalOpen(false);
	};

	// パスワードを変更する関数
	const updatePassword = () => {
		if (!currentPassword.trim() || !newPassword.trim()) {
			alert("すべての項目を入力してください");
			return;
		}

		// TODO ユーザー情報変更APIを実行する。

		setIsPasswordUpdateModalOpen(false);
	};

	// JWTの有効期限が切れている可能性があるため、トークンリフレッシュをする。
	useEffect(() => {
		const refreshAndSetToken = async () => {
			try {
				await fetchResponseWithJWT('http://localhost:8080/api/auth/refresh');

				const newToken = document.cookie
					.split("; ")
					.find((row) => row.startsWith("JWT="))
					?.split("=")[1] || null;

				if (!newToken) {
					router.push("/login");
					return;
				}

				const parsedUserId = JSON.parse(atob(newToken.split(".")[1])).sub;
				setUserId(parsedUserId);
			} catch (error) {
				console.error("リフレッシュ失敗", error);
				router.push("/login");
			}
		};

		refreshAndSetToken();
	}, [router]);

	// トークンリフレッシュが完了したら（userIdがセットされたら）、ユーザー情報取得APIを実行する。
	const { data: userData, error: userError } = useSWR<UserDto>(
		userId ? `http://localhost:8080/api/users/${userId}` : null,
		fetcherWithJWT
	);

	// ユーザー情報取得APIの結果が返ってきたら（userDataを受け取ったら）、各項目のStateにセットする。
	useEffect(() => {
		if (userData) {
			setUserName(userData.userName);
			setRealName(userData.realName);
			setEmailAddress(userData.emailAddress);
			if (userData.thumbnailUrl) {
				setThumbnailUrl(userData.thumbnailUrl);
			}
		}
	}, [userData]);

	if (!userId || !userData) {
		return <div>読み込み中...</div>;
	}

	if (userError) {
		return <div>エラーが発生しました。</div>;
	}

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
							value: realName,
						},
						{
							label: "メールアドレス",
							value: emailAddress,
						},
						{
							label: "サムネイル画像",
							value: (
								<div className="flex items-center gap-4">
									<Image
										src="/profile.png"
										alt="サムネイル"
										className="w-32 h-32 rounded-full object-cover object-center border border-gray-300"
										width={500}
										height={500}
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
						className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
						onClick={() => setIsUserNameUpdateModalOpen(false)}
					>
						<div
							className="bg-white opacity-100 rounded-lg p-6 w-full max-w-md shadow-lg"
							onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じない
						>
							<h2 className="text-lg font-semibold mb-6 text-center">
								ユーザー名の変更
							</h2>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									現在のユーザー名
								</label>
								<div className="bg-gray-200 p-2 rounded text-sm">
									{userName}
								</div>
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
						className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
						onClick={() => setIsPasswordUpdateModalOpen(false)}
					>
						<div
							className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							<h2 className="text-lg font-semibold mb-6 text-center">
								パスワードの変更
							</h2>

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
