"use client";
import PageTitle from "@/app/components/PageTitle";
import CourseCard from "@/app/components/CourseCard";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data));
  }, []);

  return (
    <>
		<PageTitle title="Javaエンジニア養成講座" />

		{/* お知らせ欄 */}
		<div className="border border-gray-300 mx-auto max-w-[800px] rounded-sm overflow-hidden shadow-md flex flex-col mb-10">
			{/* タイトル */}
			<div className="text-center py-4">
				<h2 className="text-sm font-semibold">お知らせ</h2>
			</div>

			{/* お知らせリスト */}
			<div className="px-6 py-4">
				<div className="border-t border-gray-200 p-2 hover:bg-gray-100">
					<p className="text-gray-600 text-xs">2025年1月1日　大事なお知らせ</p>
				</div>
				<div className="border-t border-gray-200 p-2 hover:bg-gray-100">
					<p className="text-gray-600 text-xs">2025年1月2日　大事なお知らせ</p>
				</div>
				<div className="border-t border-gray-200 p-2 hover:bg-gray-100">
					<p className="text-gray-600 text-xs">2025年1月3日　大事なお知らせ</p>
				</div>
			</div>

			{/* Moreボタン */}
			<div className="flex justify-center mb-6">
				<Link href="/news" passHref>
					<button className="border border-blue-600 text-blue-600 px-2 py-1 rounded-sm text-xs hover:bg-blue-600 hover:text-white transition duration-100">
						もっと見る
					</button>
				</Link>
			</div>
		</div>

		<div className="mx-auto grid grid-cols-3 gap-6 w-fit items-start">
			<CourseCard
				imageUrl="/sample.png"
				title="Java入門完全攻略あああああああああああああああああああああああああああああああああああああ"
				progress={65}
				description="このコースではJavaの基本からオブジェクト指向、例外処理、Stream APIまで学べます。あああああああああああああ"
			/>
			<CourseCard
				imageUrl="/sample.png"
				title="SQL入門完全攻略"
				progress={65}
				description="このコースではSQLの基本を学べます。"
			/>
			<CourseCard
				imageUrl="/sample.png"
				title="SQL入門完全攻略"
				progress={65}
				description="このコースではSQLの基本を学べます。"
			/>
			<CourseCard
				imageUrl="/sample.png"
				title="SQL入門完全攻略"
				progress={65}
				description="このコースではSQLの基本を学べます。"
			/>
			<CourseCard
				imageUrl="/sample.png"
				title="SQL入門完全攻略"
				progress={65}
				description="このコースではSQLの基本を学べます。"
			/>
		</div>
    </>
  );
}
