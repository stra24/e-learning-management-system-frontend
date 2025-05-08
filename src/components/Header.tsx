'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { getJWTFromCookie, getSubjectFromJWT } from '@/lib/jwtUtil';
import { UserDto } from '@/features/user/types';

const Header = () => {
	const router = useRouter();

	// リフレッシュトークンAPI
	const {
		executeApi: executeRefreshTokenApi,
	} = useApiRequest();

	// ログアウトAPI
	const {
		executeApi: executeLogoutApi,
	} = useApiRequest();

	// ユーザー取得API
	const {
		executeApi: executeFindUserByIdApi,
		response: responseOfFindUserByIdApi
	} = useApiRequest();

	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toTopPage = async () => {
		try {
			// リフレッシュトークンを使用して JWT を更新
			await executeRefreshTokenApi('http://localhost:8080/api/auth/refresh', 'GET');

			// 新しい JWT をクッキーから取得
			const newToken = getJWTFromCookie();

			if (!newToken) {
				// トークンがない場合、ログインページへリダイレクト
				router.push("/login");
				return;
			}

			// JWT から userId を取得して、ユーザー取得APIを実行。
			const userId = getSubjectFromJWT(newToken);
			await executeFindUserByIdApi(`http://localhost:8080/api/users/${userId}`, 'GET');
		} catch (err) {
			// リフレッシュトークンAPI失敗時
			console.log('リフレッシュトークンAPI - 失敗')
			console.log(err);
		}
	};

	const toMyAccountPage = () => {
		router.push('/account');
	};

	const logout = async () => {
		await executeLogoutApi('http://localhost:8080/api/logout', 'POST');

		// 最後に画面遷移
		router.push('/login');
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// メニューが存在している、かつ、メニューの外側を押したとき
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		// クリーンアップ
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	useEffect(() => {
		// API結果を待ってから画面遷移を行う。
		if (responseOfFindUserByIdApi) {
			responseOfFindUserByIdApi.json().then((response: UserDto) => {
				if (response.userRole === '管理者') {
					router.push('/admin/users');
				} else {
					router.push('/courses');
				}
			})
		}
	}, [responseOfFindUserByIdApi, router]);

	return (
		<header className="fixed top-0 left-0 w-full bg-blue-900 text-white shadow z-50">
			<div className="flex justify-between items-center h-[60px] px-3">
				{/* 左側：画面タイトル */}
				<h1 onClick={toTopPage} className="text-xl hover:cursor-pointer">Javaエンジニア養成講座</h1>

				{/* 右側：ハンバーガーメニュー＋メニューモーダル */}
				<div className="relative" ref={menuRef}>
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="focus:outline-none flex items-center hover:cursor-pointer"
					>
						{isOpen ? <X size={30} /> : <Menu size={30} />}
					</button>

					{isOpen && (
						<div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md">
							<ul className="py-2">
								<li onClick={toMyAccountPage} className="p-2 text-md hover:bg-gray-200 cursor-pointer">マイアカウント</li>
								<li onClick={logout} className="p-2 text-md hover:bg-gray-200 cursor-pointer">ログアウト</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;