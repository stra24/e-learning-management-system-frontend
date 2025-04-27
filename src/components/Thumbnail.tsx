const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Thumbnail({ thumbnailUrl }: { thumbnailUrl: string }) {
  const imageSrc = thumbnailUrl.startsWith('blob:')
    ? thumbnailUrl
    : `${API_URL}${thumbnailUrl}`;

  return (
    <img
      src={imageSrc}
      alt="Thumbnail Image"
    />
  );
}