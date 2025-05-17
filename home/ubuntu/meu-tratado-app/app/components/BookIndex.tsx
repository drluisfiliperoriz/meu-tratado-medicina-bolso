interface Chapter {
  title: string;
  start_page: number;
  end_page: number;
  sections: any[];
}

interface BookIndexProps {
  chapters: Chapter[];
}

export default function BookIndex({ chapters }: BookIndexProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#00B894]">
        Índice do Tratado
      </h2>
      {chapters.map((chapter, index) => (
        <div key={index} className="chapter-card">
          <h3 className="text-lg font-semibold">{chapter.title}</h3>
          <p className="text-sm text-gray-500 mt-2">
            Páginas: {chapter.start_page} - {chapter.end_page}
          </p>
          {chapter.sections && chapter.sections.length > 0 && (
            <ul className="mt-2 ml-4 space-y-1">
              {chapter.sections.map((section, sIndex) => (
                <li key={sIndex} className="text-gray-600 text-sm">
                  • {section}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}