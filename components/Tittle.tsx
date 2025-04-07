interface TitleSectionProps {
    title: string; // Prop para personalizar el título
  }
  
  export default function TitleSection({ title }: TitleSectionProps) {
    return (
      <div className="flex flex-col items-start justify-between pl-6 py-3">
        <h1 className="text-xl max-[500px]:text-xl">{title}</h1>
      </div>
    );
  }
  