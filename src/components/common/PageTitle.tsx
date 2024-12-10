interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="text-2xl font-bold text-gray-800">{title}</h1>;
};

export default PageTitle;