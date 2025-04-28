export function getJWTFromCookie(): string | null {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith("JWT="))
		?.split("=")[1] || null;
}

export function getSubjectFromJWT(token: string): string {
	return JSON.parse(atob(token.split(".")[1])).sub
}
