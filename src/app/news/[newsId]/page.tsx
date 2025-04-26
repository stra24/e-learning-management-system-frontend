import Header from "@/components/Header";
import NewsDetail from "@/components/news/NewsDetail";

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