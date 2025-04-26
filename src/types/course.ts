export type CourseDto = {
	id: string;
	thumbnailUrl: string;
	title: string;
	description: string;
};

export type CoursePageDto = {
	courseDtos: CourseDto[];
	pageNum: number;
	pageSize: number;
	totalSize: number;
};