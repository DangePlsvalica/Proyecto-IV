interface TitleSectionProps {title: string;}

export default function TitleSection({ title }: TitleSectionProps) {
  const animationStyles = `
    @keyframes typing {
      from { width: 45%; }
      to { width: 100%; }
    }
    @keyframes cursor-blink {
      0%, 100% { border-right-color: transparent; }
      50% { border-right-color: #111; }
    }
    @keyframes hide-cursor {
      to { border-right-color: transparent; }
    }
    .typewriter h1 {
      animation: 
        typing 0.5s steps(30, end),
        cursor-blink 0.5s step-end 6,
        hide-cursor 0s step-end 3.5s forwards;
    }
  `;

  return (
    <div className="flex flex-col items-start justify-between pl-6 py-3">
      <style>{animationStyles}</style>
      <div className="typewriter">
        <h1 className="text-xl font-bold tracking-widest text-[#111] overflow-hidden whitespace-nowrap border-r-[0.15em] border-r-transparent max-[500px]:text-xl">
          {title}
        </h1>
      </div>
    </div>
  );
}