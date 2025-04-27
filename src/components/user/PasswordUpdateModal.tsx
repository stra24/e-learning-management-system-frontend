import { FC, useState } from "react";

interface PasswordUpdateModalProps {
  setIsPasswordUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordUpdateModal: FC<PasswordUpdateModalProps> = ({
  setIsPasswordUpdateModalOpen,
}) => {
  // パスワードの状態を管理するState
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // パスワード更新処理
  const updatePassword = () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      alert("すべての項目を入力してください");
      return;
    }

    // パスワード更新API呼び出し処理をここに追加

    setIsPasswordUpdateModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={() => setIsPasswordUpdateModalOpen(false)}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないようにする
      >
        <h2 className="text-lg font-semibold mb-6 text-center">パスワードの変更</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在のパスワード
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            新しいパスワード
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-600 hover:underline hover:cursor-pointer"
            onClick={() => setIsPasswordUpdateModalOpen(false)}
          >
            キャンセル
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
            onClick={updatePassword}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdateModal;
