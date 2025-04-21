type PageTitleProps = {
	title: string;
  };
  
  export default function PageTitle({ title }: PageTitleProps) {
	return <h1 className="w-full flex items-center justify-center text-3xl font-bold p-10">{title}</h1>;
  }