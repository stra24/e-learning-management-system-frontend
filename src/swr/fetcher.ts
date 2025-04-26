// SWR用: 必ず JSON を返す
export const fetcherWithJWT = async (url: string) => {
	const token = getJWTFromCookie();

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
		credentials: 'include',
	});

	if (!res.ok) {
		console.log('リクエストに失敗しました');
		throw new Error('リクエストに失敗しました');
	}

	return res.json();
};

// 通常fetch用: Responseそのまま返す
export const fetchResponseWithJWT = async (url: string) => {
	const token = getJWTFromCookie();

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
		credentials: 'include',
	});

	return res; // ここでは res.json() しない！
};

// JWT取得共通化
function getJWTFromCookie(): string {
	const token = document.cookie
		.split('; ')
		.find(row => row.startsWith('JWT='))?.split('=')[1];

	return token || "dummy";
}