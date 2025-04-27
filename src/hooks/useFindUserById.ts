import useSWR, { mutate } from 'swr';
import { fetcherWithJWT } from '@/swr/fetcher';
import { UserDto } from '@/types/user'; // UserDtoの型をインポート

// findUserByIdをカスタムHookとして定義
export const useFindUserById = (userId: string) => {
	const { data, error } = useSWR<UserDto>(
		`http://localhost:8080/api/users/${userId}`,
		fetcherWithJWT,
		{
			revalidateOnMount: false, // コンポーネントマウント時に自動でリクエストしない
		}
	);

	// APIを手動で呼び出すための関数
	const triggerFetch = () => {
		if (userId) {
			mutate(`http://localhost:8080/api/users/${userId}`); // 手動でデータをフェッチ
		}
	};

	return {
		userData: data,
		isLoading: !error && !data,
		isError: error,
		triggerFetch,
	};
};