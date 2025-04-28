'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from 'next/navigation';
import { UserDto } from "@/types/user";
import PasswordUpdateModal from "./PasswordUpdateModal";
import Thumbnail from "../Thumbnail";
import { useApiRequest } from "@/hooks/useApiRequest";
import { getJWTFromCookie, getSubjectFromJWT } from "@/lib/jwtUtil";

export default function UserDetail() {
	const router = useRouter();

	const paramUserId = useParams().userId; // URL パラメータから userId を取得
	const pathname = usePathname();
	const isNewUser = pathname === '/admin/users/new';

	// 画面に表示するState
	const [realName, setRealName] = useState<string>("");
	const [userName, setUserName] = useState<string>("");
	const [emailAddress, setEmailAddress] = useState<string>("");
	const [thumbnailUrl, setThumbnailUrl] = useState<string>("")
	const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
	const [userRole, setUserRole] = useState<string>("GENERAL")

	// パスワード関連のState
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	// モーダルのState
	const [isPasswordUpdateModalOpen, setIsPasswordUpdateModalOpen] = useState<boolean>(false);

	// 認証にまつわるState
	const [userId, setUserId] = useState<string | null>(null);

	// ファイルアップロードAPI
	const {
		executeApi: executeUploadFileApi,
		isLoading: isLoadingUploadFileApi,
		isError: isErrorUploadFileApi,
		response: responseOfUploadFileApi
	} = useApiRequest();

	// ユーザー新規作成API
	const {
		executeApi: executeCreateUserApi,
		isLoading: isLoadingCreateUserApi,
		isError: isErrorCreateUserApi,
		response: responseOfCreateUserApi
	} = useApiRequest();

	// ユーザー更新API
	const {
		executeApi: executeUpdateUserApi,
		isLoading: isLoadingUpdateUserApi,
		isError: isErrorUpdateUserApi,
		response: responseOfUpdateUserApi
	} = useApiRequest();

	// リフレッシュトークンAPI
	const {
		executeApi: executeRefreshTokenApi,
	} = useApiRequest();

	// ユーザー取得API
	const {
		executeApi: executeFindUserByIdApi,
		isLoading: isLoadingFindUserByIdApi,
		response: responseOfFindUserByIdApi,
		isError: isErrorFindUserByIdApi
	} = useApiRequest();

	// サムネイル画像を変更する関数
	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedThumbnailFile(file); // ファイルを保存
			setThumbnailUrl(URL.createObjectURL(file)); // プレビュー表示だけ
		}
	};

	// ユーザー情報を保存する関数
	const handleSave = async () => {
		try {
			if (isNewUser && password != confirmPassword) {
				throw new Error('パスワードが一致しません。');
			}

			let uploadedThumbnailPath = thumbnailUrl;

			// もし新しいサムネイルが選ばれてたらアップロードする
			if (selectedThumbnailFile) {
				const formData = new FormData();
				formData.append("file", selectedThumbnailFile);

				// 画像アップロードAPIを呼び出し
				const uploadFileApiResponse = await executeUploadFileApi('http://localhost:8080/api/files/upload', 'POST', formData);

				if (!uploadFileApiResponse?.ok) {
					throw new Error('サムネイルアップロード失敗');
				}

				// アップロードしたファイルのパスを取得
				uploadedThumbnailPath = await uploadFileApiResponse.text(); // 新しいパスを取得
			}

			if (isNewUser) {
				// ユーザー情報を新規作成する
				const createUserApiResponse = await executeCreateUserApi(
					`http://localhost:8080/api/users`,
					'POST',
					{
						realName,
						userName,
						emailAddress,
						password,
						confirmPassword,
						thumbnailUrl: uploadedThumbnailPath,
						userRole,
					}
				);

				if (!createUserApiResponse?.ok) {
					throw new Error('ユーザー新規作成 - 失敗');
				}
			} else {
				// ユーザー情報を更新する
				const updateUserApiResponse = await executeUpdateUserApi(
					`http://localhost:8080/api/users/${userId}`,
					'PUT',
					{
						userId,
						realName,
						userName,
						emailAddress,
						thumbnailUrl: uploadedThumbnailPath,
					}
				);

				if (!updateUserApiResponse?.ok) {
					throw new Error('ユーザー更新 - 失敗');
				}
			}

			alert('保存しました！');
			router.push('/admin/users');
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
				await executeRefreshTokenApi('http://localhost:8080/api/auth/refresh', 'GET');

				// 新しい JWT をクッキーから取得
				const newToken = getJWTFromCookie();

				if (!newToken) {
					alert("トークンがありません")
					return;
				}

				// JWT から userId を取得
				setUserId(getSubjectFromJWT(newToken));
			} catch (error) {
				console.error("トークンリフレッシュ失敗", error);
				// router.push("/login");
				alert("トークンリフレッシュ失敗")
			}
		};

		if (paramUserId) {
			// ユーザー編集画面の場合
			setUserId(Array.isArray(paramUserId) ? paramUserId[0] : paramUserId);
		} else if (isNewUser) {
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
	}, [executeRefreshTokenApi, isNewUser, paramUserId, router]);

	// userId がセットされたら（新規画面以外でしかセットされない）、ユーザー情報取得を行う。
	useEffect(() => {
		if (userId && !isNewUser) {
			executeFindUserByIdApi(`http://localhost:8080/api/users/${userId}`, 'GET');
		}
	}, [executeFindUserByIdApi, userId, isNewUser]);

	// ユーザー情報を取得したら、State にセットする
	useEffect(() => {
		if (responseOfFindUserByIdApi) {
			responseOfFindUserByIdApi.json().then((userDto: UserDto) => {
				setUserName(userDto.userName);
				setRealName(userDto.realName);
				setEmailAddress(userDto.emailAddress);
				if (userDto.thumbnailUrl) {
					setThumbnailUrl(userDto.thumbnailUrl);
				}
				setUserRole(userDto.userRole == '管理者' ? 'ADMIN' : 'GENERAL');
			})
		}
	}, [isPasswordUpdateModalOpen, paramUserId, responseOfFindUserByIdApi]);

	// 新規画面の場合、ユーザー取得処理は行わないので、新規画面以外かつユーザー取得レスポンスがまだ返ってきていない場合はロード画面とする。
	if (!isNewUser && (!userId || !responseOfFindUserByIdApi)) {
		return <div>読み込み中...</div>;
	}

	if (isErrorFindUserByIdApi) {
		return <div>エラーが発生しました。</div>;
	}

	return (
		<div className="max-w-3xl mx-auto">
			<div className="border border-gray-300 rounded overflow-hidden">
				{[
					{
						label: "権限",
						value: (
							<select
								value={userRole}
								onChange={(e) => setUserRole(e.target.value)}
								className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
							>
								<option value="GENERAL">一般</option>
								<option value="ADMIN">管理者</option>
							</select>
						),
					},
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
											<Thumbnail thumbnailUrl={thumbnailUrl} alt="サムネイル画像" />
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