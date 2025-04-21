'use client';

import { useState } from 'react';
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 簡易バリデーション
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    setError('');

    // ここにログイン処理を実装（API 叩くなど）
    console.log('ログイン', { email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h2>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <div className="mb-4">
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
          className="w-full bg-blue-600 text-white border border-blue-600 py-2 rounded-lg hover:bg-blue-900 transition"
        >
          ログイン
        </button>

		<div className="text-base mt-5 text-center text-blue-600 hover:underline hover:text-blue-900">
			<Link href="/password">パスワードをお忘れの方はこちら</Link>
		</div>
      </form>
    </div>
  );
}
