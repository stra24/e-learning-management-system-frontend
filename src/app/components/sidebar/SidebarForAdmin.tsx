"use client";

import Link from "next/link";

export default function SidebarForAdmin() {
	const sections = [
		{ id: "courses", label: "コース一覧", href: "/admin/courses" },
		{ id: "users", label: "ユーザー一覧", href: "/admin/users" },
		{ id: "news", label: "お知らせ一覧", href: "/admin/news" },
	];

	return (
		<div className="w-70 h-screen py-4 border-r border-gray-300 bg-white">
			<h2 className="text-xl font-semibold mb-6 px-3">管理者メニュー</h2>
			<ul className="space-y-2">
				{sections.map((section) => (
					<li key={section.id}>
						<Link
							href={section.href}
							className="block px-3 py-2 text-gray-800 text-lg hover:bg-gray-700 hover:text-white transition"
						>
							{section.label}
						</Link>
					</li>
				))}
			</ul>

		</div>
	);
}
