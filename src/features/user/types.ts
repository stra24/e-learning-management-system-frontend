export type UserDto = {
	id: string
	emailAddress: string
	realName: string
	userName: string
	thumbnailUrl: string | null
	userRole: string
	createdAt: string
}

export type UserPageDto = {
	userDtos: UserDto[]
	pageNum: number
	pageSize: number
	totalSize: number
}