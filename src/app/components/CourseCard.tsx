import Image from "next/image";

type CourseCardProps = {
	imageUrl: string;
	title: string;
	progress: number; // 0〜100
	description: string;
  };
  
export default function CourseCard({ imageUrl, title, progress, description }: CourseCardProps) {
	return (
		<div className="relative max-w-[15rem] rounded-sm overflow-hidden shadow-md bg-white flex flex-col group">
			{/* ホバー時の背景オーバーレイ */}
			<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none z-10" />


			{/* サムネイル画像 */}
			<div className="relative aspect-[16/9] overflow-hidden">
				<Image src={imageUrl} alt={title} fill className="object-cover transition-transform transform duration-200 group-hover:scale-120"/>
			</div>
			
			{/* 説明概要 */}
			<div className="p-3 flex flex-col justify-between">
				<div>
					{/* コースタイトル */}
					<h2 className="text-base font-semibold mb-2 line-clamp-3">{title}</h2>

					{/* コース説明 */}
					<p className="text-xs text-gray-600 mb-3 line-clamp-3">{description}</p>
				</div>

				<div>
					{/* 進捗バー */}
					<div className="h-1 bg-gray-200 rounded-full mb-1.5">
						<div
							className="h-1 bg-blue-600 rounded-full transition-all duration-300"
							style={{ width: `${progress}%` }}
						>
						</div>
					</div>

					{/* 進捗率表示 */}
					<p className="text-xs text-left text-gray-500 mt-1">{progress}% 完了</p>
				</div>
			</div>
		</div>
	);
}