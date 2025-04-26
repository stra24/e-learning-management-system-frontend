"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // lucide-reactを使用（インストールしていなければ `npm i lucide-react`）

const lessonGroups = [
  {
    id: 1,
    groupTitle: "Javaの準備",
    lessons: [
      { id: 1, title: "第1回：Javaとは？ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ" },
      { id: 2, title: "第2回：変数と型" },
      { id: 3, title: "第2回：変数と型" },
      { id: 4, title: "第2回：変数と型" },
      { id: 5, title: "第2回：変数と型" },
      { id: 6, title: "第2回：変数と型" },
      { id: 7, title: "第2回：変数と型" },
      { id: 8, title: "第2回：変数と型" },
      { id: 9, title: "第2回：変数と型" },
      { id: 10, title: "第2回：変数と型" },
      { id: 2, title: "第2回：変数と型" },
      { id: 2, title: "第2回：変数と型" },
      { id: 2, title: "第2回：変数と型" },
      { id: 2, title: "第2回：変数と型" },
      { id: 2, title: "第2回：変数と型" },
      { id: 2, title: "第2回：変数と型" },
      { id: 2, title: "第2回：変数と型" },
      { id: 2, title: "第2回：変数と型" },
    ],
  },
  {
    id: 2,
    groupTitle: "Javaの基本文法",
    lessons: [
      { id: 3, title: "第3回：条件分岐" },
      { id: 4, title: "第4回：繰り返し処理" },
    ],
  },
];

export default function LessonListSidebar() {
  const [openGroups, setOpenGroups] = useState(
    lessonGroups.map((group) => group.id) // 初期状態：すべて開いている
  );

  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

	return (
		<div className="w-120 h-screen p-3 overflow-y-scroll">
			<h2 className="text-xl mb-4">Java講座</h2>
			<ul className="mb-11">
				{lessonGroups.map((group) => {
					const isOpen = openGroups.includes(group.id);
					return (
						<div
							key={group.id}
							className="border border-gray-300 rounded-sm mb-2"
						>
							{/* レッスングループ */}
							<div
								className="flex justify-between items-center text-base text-white px-2 py-2 rounded-tl-sm rounded-tr-sm cursor-pointer bg-blue-900"
								onClick={() => toggleGroup(group.id)}
							>
								<span>{group.groupTitle}</span>
								<div>
									{isOpen ? (
										<ChevronUp size={16} className="text-white" />
									) : (
										<ChevronDown size={16} className="text-white" />
									)}
								</div>
							</div>

							{/* レッスン */}
							{isOpen && (
							<div className="">
								<ul>
									{group.lessons.map((lesson) => (
										<li
										key={lesson.id}
										className="text-base text-gray-800 mb-0 p-2 hover:bg-blue-200 cursor-pointer border-b border-gray-300"
										>
											{lesson.title}
										</li>
									))}
								</ul>
							</div>
							)}
						</div>
					);
				})}
			</ul>
		</div>
	);
}
