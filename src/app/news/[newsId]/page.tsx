import Header from "@/app/components/Header";
import NewsDetail from "@/app/components/news/NewsDetail";

export interface NewsDetailProps {
  params: {
    newsId: string;
  };
}

export default function NewsPage({ params: { newsId } }: NewsDetailProps) {
  console.log("newsId:", newsId);
  return (
    <>
      <Header />
      <NewsDetail newsId={newsId} />
    </>
  );
}