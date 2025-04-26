"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import MultiColumnPageTitle from "@/components/page-title/MultiColumnPageTitle";

export default function UserDetailForAdmin() {
	const router = useRouter();

	const fileInputRef = useRef<HTMLInputElement>(null);

	// 仮データ（本来はparams.idなどで取得）
	const [user, setUser] = useState({
		id: 1,
		name: "山田 太郎",
		email: "taro@example.com",
		username: "taro123",
		thumbnailUrl: "/noname.png",
		createdAt: "2025-01-15 10:00",
		lastLogin: "2025-04-21 18:30",
		progress: 85,
	});

	const handleChange = (field: string, value: string | number) => {
		setUser((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		console.log("保存されたユーザー:", user);
		// ここでAPI呼び出し → 保存処理など
		router.push("/admin/users");
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setUser((prev) => ({ ...prev, thumbnailUrl: reader.result as string }));
		};
		reader.readAsDataURL(file);
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="max-w-lg mx-auto">
			<MultiColumnPageTitle title="ユーザー詳細" />

			<div className="flex flex-col items-center mt-8 mb-6">
				<div
					className="relative group cursor-pointer"
					onClick={triggerFileInput}
				>
					<img
						src={user.thumbnailUrl}
						alt={user.name}
						className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-md transition duration-300 group-hover:opacity-80"
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
				<div>
					<label className="block text-sm font-medium mb-1 text-gray-500">
						ユーザーID
					</label>
					<input
						type="text"
						className="w-full border rounded px-3 py-2 text-gray-400 bg-gray-100"
						value={user.id}
						readOnly
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">氏名</label>
					<input
						type="text"
						className="w-full border rounded px-3 py-2"
						value={user.name}
						onChange={(e) => handleChange("name", e.target.value)}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">メールアドレス</label>
					<input
						type="email"
						className="w-full border rounded px-3 py-2"
						value={user.email}
						onChange={(e) => handleChange("email", e.target.value)}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">ユーザー名</label>
					<input
						type="text"
						className="w-full border rounded px-3 py-2"
						value={user.username}
						onChange={(e) => handleChange("username", e.target.value)}
					/>
				</div>

				{/* 作成日時 */}
				<div>
					<label className="block text-sm font-medium mb-1 text-gray-500">
						作成日時
					</label>
					<input
						type="text"
						className="w-full border rounded px-3 py-2 text-gray-400 bg-gray-100"
						value={user.createdAt}
						readOnly
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1 text-gray-500">
						最終ログイン日時
					</label>
					<input
						type="text"
						className="w-full border rounded px-3 py-2 text-gray-400 bg-gray-100"
						value={user.lastLogin}
						readOnly
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">進捗率 (%)</label>
					<input
						type="number"
						className="w-full border rounded px-3 py-2 text-gray-400 bg-gray-100"
						value={user.progress}
						readOnly
					/>
				</div>

				<div className="flex justify-end mt-6">
					<button
						type="button"
						className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
						onClick={handleSave}
					>
						保存
					</button>
				</div>
			</form>
		</div>
	);
}
