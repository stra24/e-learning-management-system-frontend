'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import { UserDto } from "@/types/user";
import Image from "next/image";
import { fetcherWithJWT, fetchResponseWithJWT } from "@/swr/fetcher";
import PasswordUpdateModal from "./PasswordUpdateModal";

export default function UserDetail() {
	const router = useRouter();

	// 画面に表示するState
	const [realName, setRealName] = useState("");
	const [userName, setUserName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [thumbnailUrl, setThumbnailUrl] = useState("/profile.png");

	// モーダルのオープン状態を表すState
	const [isPasswordUpdateModalOpen, setIsPasswordUpdateModalOpen] = useState(false);

	// 認証にまつわるState
	const [userId, setUserId] = useState<string | null>(null);

	const handleSave = () => {
		// TODO ユーザー情報登録・更新APIを呼び出す。
	};

	// サムネイル画像を変更する関数
	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setThumbnailUrl(URL.createObjectURL(file));

			// TODO ユーザー情報変更APIを実行する。	
		}
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
			<div className="border border-gray-300 rounded overflow-hidden">
				{[
					{
						label: "氏名",
						value: (
							<input
								type="text"
								value={realName}
								onChange={(e) => setRealName(e.target.value)}
								className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
							/>
						),
					},
					{
						label: "ユーザー名",
						value: (
							<input
								type="text"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
							/>
						),
					},
					{
						label: "メールアドレス",
						value: (
							<input
								type="email"
								value={emailAddress}
								onChange={(e) => setEmailAddress(e.target.value)}
								className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
							/>
						),
					},
					{
						label: "サムネイル画像",
						value: (
							<div className="flex items-center gap-4">
								<Image
									src={"/profile.png"}
									// src={thumbnailUrl || "/profile.png"}
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
						label: "パスワード",
						value: (
							<button
								className="text-blue-600 hover:underline hover:cursor-pointer"
								onClick={() => setIsPasswordUpdateModalOpen(true)}
							>
								変更
							</button>
						),
					},
				].map((item, index) => (
					<div key={index} className="grid grid-cols-[180px_1fr]">
						<div className="bg-gray-100 px-4 py-4 border-b border-gray-300 border-r">
							<span className="text-gray-700 font-medium">{item.label}</span>
						</div>

						<div className="bg-white px-4 py-4 border-b border-gray-300">
							{item.value}
						</div>
					</div>
				))}
			</div>

			{/* 保存ボタンを表の下に配置し、右寄せ */}
			<div className="flex justify-end py-6">
				<button
					className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
					onClick={() => handleSave()}
				>
					保存
				</button>
			</div>

			{/* パスワード変更モーダル */}
			{isPasswordUpdateModalOpen && (
				<PasswordUpdateModal setIsPasswordUpdateModalOpen={setIsPasswordUpdateModalOpen} />
			)}
		</>
	);
};
