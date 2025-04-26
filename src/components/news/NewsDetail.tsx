// app/news/[id]/page.tsx
import PageTitle from "@/components/page-title/PageTitle";

interface NewsDetailProps {
	newsId: string;
}

export default function NewsDetail(props: NewsDetailProps) {
	const newsId: string = props.newsId;

	// 仮のデータ（後でAPI連携に変更可能）
	const newsMap: Record<string, { date: string; title: string; content: string }> = {
		"1": {
			date: "2025年1月1日",
			title: "大事なお知らせ①",
			content: "新年あけましておめでとうございます。今年もよろしくお願いします。",
		},
		"2": {
			date: "2025年1月2日",
			title: "大事なお知らせ②",
			content: "新機能のリリース予定についてのお知らせです。ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
		},
		"3": {
			date: "2025年1月3日",
			title: "大事なお知らせ③",
			content: "メンテナンスのお知らせです。1月5日にサーバーメンテナンスを行います。",
		},
	};

	const news = newsMap[newsId];

	if (!news) {
		return (
			<>
				<PageTitle title="お知らせ詳細" />
				<div className="text-center mt-20">
					<p className="text-gray-500 text-lg">お知らせが見つかりませんでした。</p>
				</div>
			</>
		);
	}

	return (
		<>
			<PageTitle title="お知らせ詳細" />
			<div className="max-w-[800px] mx-auto mt-10 px-4">
				<div className="text-sm text-gray-500 mb-2">{news.date}</div>
				<h2 className="text-2xl font-bold mb-4">{news.title}</h2>
				<p className="text-gray-700 leading-relaxed whitespace-pre-line">{news.content}</p>
			</div>
		</>
	);
}
