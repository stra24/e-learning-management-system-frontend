"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";

const initialLessonGroups = [
  {
    id: 1,
    groupTitle: "Javaの準備",
    lessons: [
      { id: 1, title: "第1回：Javaとは？" },
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

export default function LessonListSidebarForAdmin({
  setDeleteTarget,
  setShowDeleteModal,
}: {
  setDeleteTarget: React.Dispatch<React.SetStateAction<any>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [lessonGroups, setLessonGroups] = useState(initialLessonGroups);
  const [openGroups, setOpenGroups] = useState(lessonGroups.map((g) => g.id));

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState("");

  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleDeleteGroup = (groupId: number) => {
    const group = lessonGroups.find((g) => g.id === groupId);
    setDeleteTarget({
      type: "group",
      groupId,
      groupTitle: group?.groupTitle ?? "",
    });
    setShowDeleteModal(true);
  };

  const handleDeleteLesson = (groupId: number, lessonId: number) => {
    const group = lessonGroups.find((g) => g.id === groupId);
    const lesson = group?.lessons.find((l) => l.id === lessonId);
    setDeleteTarget({
      type: "lesson",
      groupId,
      groupTitle: group?.groupTitle ?? "",
      lessonId,
      lessonTitle: lesson?.title ?? "",
    });
    setShowDeleteModal(true);
  };

  const handleCreateGroup = () => {
    if (newGroupTitle.trim() === "") return;

    const newGroup = {
      id: Date.now(), // 仮の一意なID
      groupTitle: newGroupTitle.trim(),
      lessons: [],
    };

    setLessonGroups((prev) => [...prev, newGroup]);
    setOpenGroups((prev) => [...prev, newGroup.id]); // 作ったグループも開いた状態に
    setNewGroupTitle("");
    setIsCreatingGroup(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateGroup();
    } else if (e.key === "Escape") {
      setIsCreatingGroup(false);
      setNewGroupTitle("");
    }
  };

  return (
    <div className="w-120 h-screen p-3 overflow-y-scroll">
      <h2 className="text-xl mb-4">Java講座</h2>
      <ul className="mb-11">
        {lessonGroups.map((group) => {
          const isOpen = openGroups.includes(group.id);
          return (
            <div key={group.id} className="border border-gray-300 rounded-sm mb-2">
              <div className="flex justify-between items-center text-base text-white px-2 py-2 cursor-pointer bg-blue-900">
                <span onClick={() => toggleGroup(group.id)} className="flex-1">
                  {group.groupTitle}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id);
                    }}
                    className="text-white hover:text-red-400"
                    title="グループ削除"
                  >
                    <Trash2 size={16} />
                  </button>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-white" />
                  ) : (
                    <ChevronDown size={16} className="text-white" />
                  )}
                </div>
              </div>

              {isOpen && (
                <ul>
                  {group.lessons.map((lesson) => (
                    <li
                      key={lesson.id + lesson.title}
                      className="flex justify-between items-center text-base text-gray-800 p-2 hover:bg-blue-200 cursor-pointer border-b border-gray-300"
                    >
                      <span>{lesson.title}</span>
                      <button
                        onClick={() => handleDeleteLesson(group.id, lesson.id)}
                        className="text-gray-500 hover:text-red-500"
                        title="レッスン削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
					<li
						className="text-blue-600 font-semibold p-2 hover:bg-blue-100 cursor-pointer border-gray-300"
						onClick={() => alert("右の画面がレッスン編集画面にかわる")}
					>
						＋ レッスンを作成
					</li>
                </ul>
              )}
            </div>
          );
        })}

        {/* グループ追加のエリア */}
        {isCreatingGroup ? (
          <li className="p-2">
            <input
              type="text"
              className="w-full p-2 border border-blue-400 rounded-sm focus:outline-none focus:ring focus:border-blue-500"
              placeholder="新しいレッスングループ名を入力してEnter"
              value={newGroupTitle}
              onChange={(e) => setNewGroupTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </li>
        ) : (
          <li
            className="text-blue-600 font-semibold p-2 hover:bg-blue-100 cursor-pointer border border-dashed border-blue-400 rounded-sm text-center"
            onClick={() => setIsCreatingGroup(true)}
          >
            ＋ レッスングループを作成
          </li>
        )}
      </ul>
    </div>
  );
}
