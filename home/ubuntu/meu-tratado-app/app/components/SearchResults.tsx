interface SearchResult {
  title: string;
  start_page: number;
  end_page: number;
  excerpt: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Digite algo para pesquisar no tratado médico
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <div key={index} className="result-card">
          <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
          <p className="text-gray-600 mb-4">{result.excerpt}</p>
          <div className="text-sm text-gray-500">
            Páginas: {result.start_page} - {result.end_page}
          </div>
        </div>
      ))}
    </div>
  );
}