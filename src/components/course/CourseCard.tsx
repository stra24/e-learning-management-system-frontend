import { useRouter } from 'next/navigation';
import Thumbnail from '../Thumbnail';

type CourseCardProps = {
	courseId: string;
	imageUrl: string;
	title: string;
	progress: number; // 0〜100
	description: string;
	isAdmin: boolean;
	onDelete?: (courseId: string) => void;
};

export default function CourseCard({ courseId, imageUrl, title, progress, description, isAdmin, onDelete }: CourseCardProps) {
	const router = useRouter();

	const toLessonPage = () => {
		if (isAdmin) {
			router.push(`/admin/courses/${courseId}/edit`);
		} else {
			router.push(`/courses/${courseId}/lessons`);
		}
	};

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation(); // 親カードクリックを無効化
		if (onDelete) {
			onDelete(courseId);
		}
	};

	return (
		<div
			onClick={toLessonPage}
			className="relative w-[20rem] rounded-sm overflow-hidden shadow-lg bg-white flex flex-col group hover:cursor-pointer border border-gray-200"
		>
			{/* ホバー時の背景オーバーレイ */}
			<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity duration-200 pointer-events-none z-10" />

			{/* サムネイル画像 */}
			<div className="relative aspect-[16/9] overflow-hidden">
				<Thumbnail thumbnailUrl={imageUrl} alt={title} className="object-cover transition-transform transform duration-200 group-hover:scale-120" />

				{/* 削除ボタン（右上に重ねる） */}
				{isAdmin && (
					<button
						onClick={handleDelete}
						className="absolute bottom-2 right-2 text-lg bg-red-500 text-white px-4 py-2.5 rounded hover:bg-white hover:text-red-500 hover:cursor-pointer z-20"
					>
						削除
					</button>
				)}
			</div>

			{/* 説明概要 */}
			<div className="p-3 flex flex-col justify-between">
				<div>
					{/* コースタイトル */}
					<h2 className="text-lg font-semibold mb-2 line-clamp-3">{title}</h2>

					{/* コース説明 */}
					<p className="text-sm text-gray-600 mb-3 line-clamp-3">{description}</p>
				</div>

				{!isAdmin && (
					<div>
						{/* 進捗バー */}
						<div className="h-1 bg-gray-200 rounded-full mb-1.5">
							<div
								className="h-1 bg-blue-600 rounded-full transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>

						{/* 進捗率表示 */}
						<p className="text-sm text-left text-gray-500 mt-1">{progress}% 完了</p>
					</div>
				)}
			</div>
		</div>
	);
}
