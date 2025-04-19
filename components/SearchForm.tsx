import { MdOutlineSearch } from "react-icons/md";

interface SearchFormProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <form className="flex items-center gap-3" onSubmit={(e) => e.preventDefault()}>
      <MdOutlineSearch />
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[320px] h-[32px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
    </form>
  );
};

export default SearchForm;
