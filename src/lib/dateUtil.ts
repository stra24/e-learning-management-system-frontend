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