'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApiRequest } from '@/hooks/useApiRequest';
import { getJWTFromCookie, getSubjectFromJWT } from '@/lib/jwtUtil';
import { UserDto } from '@/features/user/types';

export default function LoginForm() {
	const router = useRouter();
	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [rememberMe, setRememberMe] = useState(false);

	// ユーザー取得API
	const {
		executeApi: executeFindUserByIdApi,
		isLoading: isLoadingFindUserByIdApi,
		response: responseOfFindUserByIdApi
	} = useApiRequest();

	// ログインAPI
	const {
		executeApi: executeLoginApi,
		isLoading: isLoadingLoginApi,
	} = useApiRequest();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await executeLoginApi('http://localhost:8080/api/login', 'POST', { emailAddress, password });

			// 新しい JWT をクッキーから取得
			const newToken = getJWTFromCookie();
			console.log('token: ' + newToken)
			if (!newToken) {
				// ログインAPIでJWTがクッキーに登録されるため、運用上ここに処理が渡ることは起こりえないが、後続の処理でnullでないことを確約してある必要があるため、実装。
				router.push("/login");
				return;
			}

			// JWT から userId を取得して、ユーザー取得APIを実行。
			const userId = getSubjectFromJWT(newToken);
			await executeFindUserByIdApi(`http://localhost:8080/api/users/${userId}`, 'GET');
		} catch (err) {
			// ログインAPI失敗時
			console.log('ログインAPI - 失敗')
			console.log(err);
		}
	};

	useEffect(() => {
		// API結果を待ってから画面遷移を行う。
		if (responseOfFindUserByIdApi) {
			responseOfFindUserByIdApi.json().then((response: UserDto) => {
				if (response.userRole === '管理者') {
					router.push('/admin/courses');
				} else {
					router.push('/courses');
				}
			})
		}
	}, [responseOfFindUserByIdApi, router]);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h2>

				{error && <div className="text-red-500 text-sm mb-4">{error}</div>}

				<div className="mb-4">
					<label htmlFor="emailAddress" className="block text-gray-700 mb-1">
						メールアドレス
					</label>
					<input
						type="emailAddress"
						id="emailAddress"
						className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						value={emailAddress}
						onChange={(e) => setEmailAddress(e.target.value)}
						required
					/>
				</div>

				<div className="mb-6">
					<label htmlFor="password" className="block text-gray-700 mb-1">
						パスワード
					</label>
					<input
						type="password"
						id="password"
						className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<div className="flex items-center justify-center mb-6">
					<input
						type="checkbox"
						id="remember"
						className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
						checked={rememberMe}
						onChange={(e) => setRememberMe(e.target.checked)}
					/>
					<label htmlFor="remember" className="ml-2 text-gray-700">
						ログイン状態を保持する
					</label>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white border border-blue-600 py-2 rounded-lg hover:bg-blue-900 transition hover:cursor-pointer"
					disabled={isLoadingLoginApi}
				>
					{isLoadingLoginApi || isLoadingFindUserByIdApi ? 'ログイン中...' : 'ログイン'}
				</button>

				<div className="text-base mt-5 text-center text-blue-600 hover:underline hover:text-blue-900">
					<Link href="/password">パスワードをお忘れの方はこちら</Link>
				</div>
			</form>
		</div>
	);
}
