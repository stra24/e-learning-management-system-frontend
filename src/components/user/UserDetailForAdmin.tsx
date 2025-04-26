"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import MultiColumnPageTitle from "@/components/page-title/MultiColumnPageTitle";
import { fetcherWithJWT } from "@/swr/fetcher";
import { UserDto } from "@/types/user";

interface UserDetail {
	userId: string;
	realName: string;
	emailAddress: string;
	userName: string;
	createdAt: string;
	lastLogin: string;
	progress: number;
	thumbnailUrl: string;
}

export default function UserDetailForAdmin() {
	const router = useRouter();
	const userId = useParams().userId;

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [user, setUser] = useState<UserDetail>({
		userId: '',
		realName: '',
		emailAddress: '',
		userName: '',
		createdAt: '',
		lastLogin: '',
		progress: 0,
		thumbnailUrl: '',
	});

	// APIからユーザーデータを取得
	const { data: userData, error: userError } = useSWR<UserDto>(
		userId ? `http://localhost:8080/api/users/${userId}` : null,
		fetcherWithJWT
	);

	// ユーザー情報が取得できたら状態を更新
	useEffect(() => {
		if (userData) {
			setUser({
				userId: userData.id,
				realName: userData.realName,
				emailAddress: userData.emailAddress,
				userName: userData.userName,
				createdAt: userData.createdAt,
				lastLogin: "",
				progress: 50,
				thumbnailUrl: userData.thumbnailUrl ?? '',
			});
		}
	}, [userData]);

	// ユーザー情報を変更する関数
	const changeUserInfo = (field: keyof UserDetail, value: string | number) => {
		if (user) {
			setUser((prev) => ({
				...prev,
				[field]: value,
			}));
		}
	};

	// ユーザー情報を保存する関数
	const saveUser = () => {
		console.log("保存されたユーザー:", user);

		// TODO ユーザー情報を保存するAPI

		router.push("/admin/users");
	};

	// 画像変更処理
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setUser((prev) => ({
				...prev,
				thumbnailUrl: reader.result as string,
			}));
		};
		reader.readAsDataURL(file);
	};

	// 画像アップロード用ボタンをクリック
	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	// ユーザー編集　かつ　ユーザー取得中の場合
	if (userId && !userData) {
		return <div>読み込み中...</div>;
	}

	if (userError) {
		return <div>エラーが発生しました。</div>;
	}

	return (
		<div className="max-w-lg mx-auto">
			<MultiColumnPageTitle title="ユーザー詳細" />

			<div className="flex flex-col items-center mt-8 mb-6">
				{/* サムネイル画像 */}
				<div className="relative group cursor-pointer" onClick={triggerFileInput}>
					<Image
						src="/noname.png"
						alt="サムネイル"
						className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-md transition duration-300 group-hover:opacity-80"
						width={500}
						height={500}
					/>
					<div className="absolute inset-0 flex items-center justify-center text-sm text-white font-semibold bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition">
						画像を変更
					</div>
				</div>

				<input
					type="file"
					accept="image/*"
					ref={fileInputRef}
					className="hidden"
					onChange={handleImageChange}
				/>
			</div>

			<form className="space-y-6 pb-10">
				{/* ユーザーID */}
				{userId &&
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-500">ユーザーID</label>
						<input
							type="text"
							className="w-full border rounded px-3 py-2 text-gray-400 bg-gray-100"
							value={user?.userId}
							readOnly
						/>
					</div>
				}

				{/* 氏名 */}
				<div>
					<label className="block text-sm font-medium mb-1">氏名</label>
					<input
						type="text"
						className="w-full border rounded px-3 py-2"
						value={user?.realName}
						onChange={(e) => changeUserInfo("realName", e.target.value)}
					/>
				</div>

				{/* メールアドレス */}
				<div>
					<label className="block text-sm font-medium mb-1">メールアドレス</label>
					<input
						type="email"
						className="w-full border rounded px-3 py-2"
						value={user?.emailAddress}
						onChange={(e) => changeUserInfo("emailAddress", e.target.value)}
					/>
				</div>

				{/* ユーザー名 */}
				<div>
					<label className="block text-sm font-medium mb-1">ユーザー名</label>
					<input
						type="text"
						className="w-full border rounded px-3 py-2"
						value={user?.userName}
						onChange={(e) => changeUserInfo("userName", e.target.value)}
					/>
				</div>

				{/* 作成日時 */}
				{userId &&
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-500">作成日時</label>
						<input
							type="text"
							className="w-full border rounded px-3 py-2 text-gray-400 bg-gray-100"
							value={user?.createdAt}
							readOnly
						/>
					</div>
				}

				{/* 最終ログイン日時 */}
				{userId &&
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-500">最終ログイン日時</label>
						<input
							type="text"
							className="w-full border rounded px-3 py-2 text-gray-400 bg-gray-100"
							value={user?.lastLogin}
							readOnly
						/>
					</div>
				}

				{/* 進捗率 */}
				{userId &&
					<div>
						<label className="block text-sm font-medium mb-1">進捗率 (%)</label>
						<input
							type="number"
							className="w-full border rounded px-3 py-2 text-gray-400 bg-gray-100"
							value={user?.progress}
							readOnly
						/>
					</div>
				}

				{/* 保存ボタン */}
				<div className="flex justify-end mt-6">
					<button
						type="button"
						className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
						onClick={saveUser}
					>
						保存
					</button>
				</div>
			</form>
		</div>
	);
}
