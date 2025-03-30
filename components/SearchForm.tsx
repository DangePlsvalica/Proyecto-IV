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
        placeholder="Buscar por nombre de proyecto"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[320px] h-[32px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
      <button
        type="submit"
        className="border px-3 h-[32px] text-[15px] font-semibold bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchForm;
