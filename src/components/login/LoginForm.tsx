'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import useSWRMutation from 'swr/mutation';

const loginFetcher = async (url: string, { arg }: { arg: { emailAddress: string, password: string } }) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
	credentials: 'include',
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error('Failed to login');
  }

  return response; // ログイン成功時のレスポンスを返す
};

export default function LoginForm() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { trigger, isMutating } = useSWRMutation(
    'http://localhost:8080/api/login', // APIのエンドポイント
    loginFetcher
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 簡易バリデーション
    if (!emailAddress || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    setError('');

    try {
      // ログイン処理
      await trigger({ emailAddress, password });
      console.log('ログイン成功。クッキーはこちら:', document.cookie);
	  // コース一覧画面に遷移
	  router.push('/courses');

    } catch (err) {
	  console.log(err);
      setError('ログインに失敗しました。再試行してください。');
    }
  };

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
          className="w-full bg-blue-600 text-white border border-blue-600 py-2 rounded-lg hover:bg-blue-900 transition"
          disabled={isMutating}
        >
          {isMutating ? 'ログイン中...' : 'ログイン'}
        </button>

        <div className="text-base mt-5 text-center text-blue-600 hover:underline hover:text-blue-900">
          <Link href="/password">パスワードをお忘れの方はこちら</Link>
        </div>
      </form>
    </div>
  );
}
