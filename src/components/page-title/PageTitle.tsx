type PageTitleProps = {
	title: string;
};

export default function PageTitle({ title }: PageTitleProps) {
	return <h1 className="w-full flex items-center justify-center text-3xl font-bold py-18 mt-[60px]">{title}</h1>;
}