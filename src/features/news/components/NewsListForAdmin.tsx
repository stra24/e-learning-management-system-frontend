"use client";

import { useRouter } from "next/navigation";
import { NewsDto, NewsPageDto } from "@/features/news/types";
import { convertDateString } from "@/lib/dateUtil";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useEffect, useState } from "react";

export default function NewsList() {
  const router = useRouter();

  // 1ページで表示する件数
  const [pageSize, setPageSize] = useState(10);

  // ページ番号
  const [pageNum, setPageNum] = useState(1);

  // 合計ページ数
  const [totalPageNum, setTotalPageNum] = useState(1);

  // お知らせリスト
  const [newsDtos, setNewsDtos] = useState<NewsDto[]>([]);

  // お知らせ一覧取得API
  const {
    executeApi: executeFindNewsApi,
    isLoading: isLoadingFindNewsApi,
    isError: isErrorFindNewsApi,
    response: responseOfFindNewsApi,
  } = useApiRequest();

  //お知らせ詳細画面遷移
  const toNewsDetailView = (id: String) => {
    router.push(`/admin/news/${id}/edit`);
  };

  // お知らせ削除API
  const { executeApi: executeDeleteNewsApi } = useApiRequest();

  const toNewsDetailPage = (newsId: string) => {
    router.push("/admin/news/" + newsId + "/edit");
  };

  // 削除ボタンを押すと発火するイベント
  const handleDelete = async (e: React.MouseEvent, newsId: string) => {
    console.log(`ニュースID ${newsId} を削除します`);
    e.stopPropagation();
    await executeDeleteNewsApi(
      `http://localhost:8080/api/news/${newsId}`,
      "DELETE"
    );
    await executeFindNewsApi("http://localhost:8080/api/news", "GET");
  };

  useEffect(() => {
    const fetchData = async () => {
      const findNewsApiResponse = await executeFindNewsApi(
        "http://localhost:8080/api/news",
        "GET"
      );
      findNewsApiResponse?.json().then((newsPageDto: NewsPageDto) => {
        setNewsDtos(newsPageDto.newsDtos);
      });
    };
    fetchData();
  }, [executeFindNewsApi]);

  // 削除処理した時に発動
  useEffect(() => {
    if (responseOfFindNewsApi) {
      responseOfFindNewsApi.json().then((response: NewsPageDto) => {
        setPageSize(response.pageSize);
        setPageNum(response.pageNum);
        setTotalPageNum(Math.ceil(response.totalSize / response.pageSize));
        setNewsDtos(response.newsDtos);
      });
    }
  }, [responseOfFindNewsApi]);

  if (isErrorFindNewsApi) return <div>エラーが発生しました</div>;
  if (isLoadingFindNewsApi) return <div>読み込み中...</div>;

  return (
    <div className="max-w-[800px] mx-auto px-4">
      <div className="relative py-18">
        {/* タイトルを中央に配置（表の中央基準） */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold">
          お知らせ一覧
        </h1>

        {/* ボタンを右に配置 */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/admin/news/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap cursor-pointer"
          >
            お知らせを新規作成
          </button>
        </div>
      </div>

      {/* お知らせ一覧 */}
      <ul className="divide-y divide-gray-200">
        {newsDtos.map((newsDto) => (
          <li
            key={newsDto.id}
            className="py-4 px-2 flex justify-between items-center hover:bg-gray-100 transition cursor-pointer"
            onClick={() => toNewsDetailPage(`${newsDto.id}`)}
          >
            <div>
              <div className="text-gray-600 text-sm">
                {convertDateString(newsDto.createdAt)}
              </div>
              <div className="text-lg font-medium text-gray-800 mt-1">
                {newsDto.title}
              </div>
            </div>

            <button
              onClick={(e) => handleDelete(e, newsDto.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
