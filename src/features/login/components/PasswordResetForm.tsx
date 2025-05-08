'use client';

import { useState } from 'react';

export default function PasswordResetForm() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			setError('メールアドレスを入力してください。');
			return;
		}

		setError('');
		setMessage('パスワードリセットリンクを送信しました。');

		// 実際にはここでAPIなどにリクエストを送信
		console.log('リセットリンク送信', email);
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
			>
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">パスワードリセット</h2>

				{error && <div className="text-red-500 text-sm mb-4">{error}</div>}
				{message && <div className="text-green-600 text-sm mb-4">{message}</div>}

				<div className="mb-6">
					<label htmlFor="email" className="block text-gray-700 mb-1">
						メールアドレス
					</label>
					<input
						type="email"
						id="email"
						className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white border border-blue-600 py-2 rounded-lg hover:bg-blue-900 transition"
				>
					パスワードリセットリンクを送信
				</button>
			</form>
		</div>
	);
}
