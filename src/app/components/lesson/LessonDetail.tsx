export default function LessonDetail() {
	return (
	  <div className="flex-1 pt-10 px-10 overflow-y-auto">
		<div className="h-[80vh] aspect-video mx-auto mb-2">
		  {/* 本番ではReactPlayerやiframeを入れて動画を表示 */}
		  <iframe
			className="w-full h-full"
			src="https://drive.google.com/file/d/1NO83lbAkhlDD6h3xbX0CX8rUbdUcInuD/preview"
			title="YouTube video player"
			allowFullScreen
		  ></iframe>
		</div>
		<h1 className="text-2xl font-bold my-4">第1回：Javaとは？</h1>
		<p className="text-base">
		  このレッスンではJavaの概要について説明します。Javaがどのような場面で使われているのか、またその特徴について学びましょう。
		  ああああああああああああああああああああああああああああああああああああああああああああああああ
		  ああああああああああああああああああああああああああああああああああああああああああああああああ
		  ああああああああああああああああああああああああああああああああああああああああああああああああ
		  ああああああああああああああああああああああああああああああああああああああああああああああああ
		  ああああああああああああああああああああああああああああああああああああああああああああああああ
		  ああああああああああああああああああああああああああああああああああああああああああああああああ
		  ああああああああああああああああああああああああああああああああああああああああああああああああ
		  ああああああああああああああああああああああああああああああああああああああああああああああああ
		</p>
	  </div>
	);
  }