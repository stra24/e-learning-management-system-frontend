'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null); // ハンバーガーメニュー全体の参照
  
	useEffect(() => {
	  const handleClickOutside = (event: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
		  setIsOpen(false); // メニュー外をクリックしたら閉じる
		}
	  };
  
	  if (isOpen) {
		document.addEventListener('mousedown', handleClickOutside);
	  } else {
		document.removeEventListener('mousedown', handleClickOutside);
	  }
  
	  // クリーンアップ
	  return () => {
		document.removeEventListener('mousedown', handleClickOutside);
	  };
	}, [isOpen]);

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-900 text-white shadow z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-2.5 px-3">
        {/* 左側：画面タイトル */}
        <h1>eラーニング管理システム</h1>

        {/* 右側：ハンバーガーメニュー */}
        <div className="relative" ref={menuRef}>
          <button 
		  	onClick={() => setIsOpen(!isOpen)} 
			className="focus:outline-none flex items-center"
		  >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">マイアカウント</li>
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">ログアウト</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;