const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ThumbnailProps {
	thumbnailUrl: string;
	alt: string;
	className?: string;
}

export default function Thumbnail({ thumbnailUrl, alt, className }: ThumbnailProps) {
	const imageSrc = thumbnailUrl.startsWith('blob:')
		? thumbnailUrl
		: `${API_URL}${thumbnailUrl}`;

	return (
		<img
			src={imageSrc}
			alt={alt}
			className={className}
		/>
	);
}