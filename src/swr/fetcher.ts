export const fetcherWithJWT = async (url: string) => {
	// クッキーからJWTを取得
	const token = document.cookie
		.split('; ')
		.find(row => row.startsWith('JWT='))?.split('=')[1]; // CookieからJWTを取得

	let headers = {};
	if (token) {
		console.log('JWTがクッキーに見つかりました');
		headers = {
			'Authorization': `Bearer ${token}`, // AuthorizationヘッダーにJWTをセット
		};
	} else {
		console.log('JWTがクッキーに見つかりません');
	}

	
	const res = await fetch(url, {
		headers,
		credentials: 'include', // クロスサイトでもクッキーを送信する
	});

	if (!res.ok) {
		console.log('リクエストに失敗しました');
		throw new Error('リクエストに失敗しました');
	}

	return res.json(); // レスポンスのJSONを返す
};