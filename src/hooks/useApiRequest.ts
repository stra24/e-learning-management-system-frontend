import { getJWTFromCookie } from '@/lib/jwtUtil';
import { useState, useCallback } from 'react';

// クッキーからJWTを取得する関数
function getJWTOrDummyFromCookie(): string {
	const jwt = getJWTFromCookie();
	return jwt || "dummy";
}

// リクエストヘッダーを取得する関数
function getRequestHeaders(
	jwt: string,
	body?: Record<string, unknown> | FormData
): HeadersInit {
	const headers: HeadersInit = {
		'Authorization': `Bearer ${jwt}`,
	};

	if (body && !(body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
	}

	return headers;
}

// APIリクエストを実行するカスタムフック
export function useApiRequest() {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [response, setResponse] = useState<Response | null>(null);

	const executeApi = useCallback(
		async (url: string, method: string, body?: Record<string, unknown> | FormData) => {
			setIsLoading(true);
			setIsError(false);
			setResponse(null);

			const jwt = getJWTOrDummyFromCookie();
			const headers = getRequestHeaders(jwt, body);

			try {
				const response = await fetch(
					url,
					{
						method,
						headers,
						credentials: 'include',
						body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
					}
				);

				if (response.status === 403) {
					alert('認証エラー');
					setIsError(true);
					setIsLoading(false);
					return;
				}

				setResponse(response);
				return response;
			} catch (error) {
				console.error('APIエラー:', error);
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return { executeApi, isLoading, isError, response };
}
