'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams, usePathname  } from 'next/navigation'; // next/navigation からインポート
import useSWR from "swr";
import { UserDto } from "@/types/user";
import { fetcherWithJWT, fetchResponseWithJWT } from "@/swr/fetcher";
import PasswordUpdateModal from "./PasswordUpdateModal";
import Thumbnail from "../Thumbnail";

export default function UserDetail() {
	const router = useRouter();
	const paramUserId = useParams().userId; // URL パラメータから userId を取得
	const pathname = usePathname();
	const isNewUser = pathname === '/admin/users/new';
	// 画面に表示するState
	const [realName, setRealName] = useState("");
	const [userName, setUserName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [thumbnailUrl, setThumbnailUrl] = useState("")
	const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);

	// パスワード関連のState
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// モーダルのState
	const [isPasswordUpdateModalOpen, setIsPasswordUpdateModalOpen] = useState(false);

	// 認証にまつわるState
	const [userId, setUserId] = useState<string | null>(null);

	// サムネイル画像を変更する関数
	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedThumbnailFile(file); // ファイルを保存
			setThumbnailUrl(URL.createObjectURL(file)); // プレビュー表示だけ
		}
	};

	// ユーザー情報を保存する関数（後で実装）
	const handleSave = async () => {
		try {
			let uploadedThumbnailPath = thumbnailUrl; // 初期は今のパス

			// もし新しいサムネイルが選ばれてたらアップロードする
			if (selectedThumbnailFile) {
				const formData = new FormData();
				formData.append("file", selectedThumbnailFile);

				// 画像アップロードAPIを呼び出し
				const uploadResponse = await fetchResponseWithJWT('http://localhost:8080/api/files/upload', 'POST', formData);

				if (!uploadResponse.ok) {
					throw new Error('サムネイルアップロード失敗');
				}

				// アップロードしたファイルのパスを取得
				uploadedThumbnailPath = await uploadResponse.text(); // 新しいパスを取得
			}

			// ユーザー情報を更新する
			const updateResponse = await fetchResponseWithJWT(
				`http://localhost:8080/api/users/${userId}`,
				'PUT',
				{
					userId,
					realName,
					userName,
					emailAddress,
					thumbnailUrl: uploadedThumbnailPath, // 新しいサムネイルパスを使う
				}
			);

			if (!updateResponse.ok) {
				throw new Error('ユーザー情報更新失敗');
			}

			alert('保存しました！');
		} catch (error) {
			console.error(error);
			alert('保存に失敗しました');
		}
	};


	// JWT の有効期限が切れている場合にトークンをリフレッシュし、userId を取得
	useEffect(() => {
		const refreshAndSetToken = async () => {
			try {
				// リフレッシュトークンを使用して JWT を更新
				await fetchResponseWithJWT('http://localhost:8080/api/auth/refresh');

				// 新しい JWT をクッキーから取得
				const newToken = document.cookie
					.split("; ")
					.find((row) => row.startsWith("JWT="))
					?.split("=")[1] || null;

				if (!newToken) {
					// トークンがない場合、ログインページへリダイレクト
					router.push("/login");
					return;
				}

				// JWT から userId を取得
				const parsedUserId = JSON.parse(atob(newToken.split(".")[1])).sub;
				setUserId(parsedUserId);
			} catch (error) {
				console.error("トークンリフレッシュ失敗", error);
				router.push("/login");
			}
		};

		if (paramUserId) {
			// ユーザー編集画面の場合
			setUserId(Array.isArray(paramUserId) ? paramUserId[0] : paramUserId);
		} else if(isNewUser) {
			// ユーザー新規画面の場合
			setUserId("")
			setRealName("");
			setUserName("");
			setEmailAddress("");
			setThumbnailUrl("");
		} else {
			// マイアカウント画面の場合
			refreshAndSetToken();
		}
	}, [isNewUser, paramUserId, router]);

	// userId がセットされたらユーザー情報を取得するための API 呼び出し
	const { data: userData, error: userError } = useSWR<UserDto>(
		userId ? `http://localhost:8080/api/users/${userId}` : null,
		fetcherWithJWT
	);

	// ユーザー情報を取得したら、State にセットする
	useEffect(() => {
		if (userData) {
			setUserName(userData.userName);
			setRealName(userData.realName);
			setEmailAddress(userData.emailAddress);
			if (userData.thumbnailUrl) {
				setThumbnailUrl(userData.thumbnailUrl);
			}
		}
	}, [userData, isPasswordUpdateModalOpen, paramUserId]);

	// ロード中・エラー時の処理
	if (!isNewUser && (!userId || !userData)) {
		return <div>読み込み中...</div>;
	}

	if (userError) {
		return <div>エラーが発生しました。</div>;
	}

	return (
		<div className="max-w-3xl mx-auto">
			<div className="border border-gray-300 rounded overflow-hidden">
				{[
					{
						label: "氏名",
						value: (
							<input
								type="text"
								value={realName}
								onChange={(e) => setRealName(e.target.value)}
								autoComplete="off"
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
								autoComplete="off"
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
								autoComplete="off"
								className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
							/>
						),
					},
					isNewUser && {
						label: "パスワード",
						value: (
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="new-password"
								className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
							/>
						),
					},
					isNewUser && {
						label: "確認用パスワード",
						value: (
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								autoComplete="new-password"
								className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
							/>
						),
					},
					{
						label: "サムネイル画像",
						value: (
							<div className="flex items-center gap-4">
								<div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
									{thumbnailUrl
										? (
											<Thumbnail thumbnailUrl={thumbnailUrl} />
										)
										:
										<div></div>
									}
								</div>
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
				].map((item, index) => (
					item && (
						<div key={index} className="grid grid-cols-[180px_1fr]">
							<div className="bg-gray-100 px-4 py-4 border-b border-gray-300 border-r">
								<span className="text-gray-700 font-medium">{item.label}</span>
							</div>

							<div className="bg-white px-4 py-4 border-b border-gray-300">
								{item.value}
							</div>
						</div>
					)
				))}
			</div>

			<div className="flex justify-end py-6">
				{
					!isNewUser && (
						<button
							className="px-6 py-3 mr-3 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
							onClick={() => setIsPasswordUpdateModalOpen(true)}
						>
							パスワードを変更する
						</button>
					)
				}
				<button
					className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
					onClick={() => handleSave()}
				>
					保存
				</button>
			</div>

			{/* パスワード変更モーダル */}
			{isPasswordUpdateModalOpen && (
				<PasswordUpdateModal setIsPasswordUpdateModalOpen={setIsPasswordUpdateModalOpen}
				/>
			)}
		</div>
	);
};