'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import useSWRMutation from 'swr/mutation';
import { fetchResponseWithJWT } from '@/swr/fetcher';

const Header = () => {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toTopPage = () => {
		router.push('/courses');
	};

	const toMyAccountPage = () => {
		router.push('/account');
	};

	const logout = async () => {
		try {
			await fetchResponseWithJWT('http://localhost:8080/api/logout', 'POST');
		} catch (error) {
			console.error('ログアウトAPIエラー', error);
		}

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