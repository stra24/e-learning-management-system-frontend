export type NewsDto = {
	id: string;
	title: string;
	content: string;
	createdAt: string;
};

export type NewsPageDto = {
	newsDtos: NewsDto[];
	pageNum: number;
	pageSize: number;
	totalSize: number;
};