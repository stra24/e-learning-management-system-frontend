type PageTitleProps = {
	title: string;
  };
  
export default function PageTitle({ title }: PageTitleProps) {
	return (
		<div className="w-full h-[110px] flex items-center justify-center">
			<h1 className="text-2xl font-bold">{title}</h1>
		</div>
	);
}