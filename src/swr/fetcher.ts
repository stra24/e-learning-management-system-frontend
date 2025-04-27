// SWR用: 必ず JSON を返す
export const fetcherWithJWT = async (url: string) => {
	const token = getJWTFromCookie();

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
		credentials: 'include',
	});

	if (res.status === 403) {
		window.location.href = '/login';
		throw new Error('認証エラー: ログイン画面へリダイレクトしました');
	}

	if (!res.ok) {
		console.log('リクエストに失敗しました');
		throw new Error('リクエストに失敗しました');
	}

	return res.json();
};

// 通常fetch用: Responseそのまま返す
export const fetchResponseWithJWT = async (
	url: string, 
	method: string = 'GET', 
	body?: Record<string, unknown> | FormData
) => {
	const token = getJWTFromCookie();

	const headers: HeadersInit = {
		'Authorization': `Bearer ${token}`,
	};

	// body が FormData でない場合のみ Content-Type を設定
	if (body && !(body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
	}

	const res = await fetch(url, {
		method,
		headers,
		credentials: 'include',
		body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
	});

	if (res.status === 403) {
		window.location.href = '/login';
		throw new Error('認証エラー: ログイン画面へリダイレクトしました');
	}

	return res; // JSONを返さず、レスポンスそのまま返す
};


// JWT取得共通化
function getJWTFromCookie(): string {
	const token = document.cookie
		.split('; ')
		.find(row => row.startsWith('JWT='))?.split('=')[1];

	return token || "dummy";
}