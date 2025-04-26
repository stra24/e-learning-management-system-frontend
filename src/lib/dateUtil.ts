export const convertDateString = (input: string): string => {
	const date = new Date(input);

	if (isNaN(date.getTime())) {
		throw new Error("Invalid date format");
	}

	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 月は0始まり
	const day = date.getDate();

	return `${year}年${month}月${day}日`;
};

export const convertDateTimeString = (input: string): string => {
	const date = new Date(input);

	if (isNaN(date.getTime())) {
		throw new Error("Invalid date format");
	}

	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 月は0始まり
	const day = date.getDate();
	const hour = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	// 0埋め関数
	const padZero = (num: number) => num.toString().padStart(2, '0');

	return `${year}/${padZero(month)}/${padZero(day)} ${padZero(hour)}:${padZero(minutes)}:${padZero(seconds)}`;
};