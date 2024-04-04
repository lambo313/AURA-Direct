import React from 'react';

interface SearchBarProps {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (searchText: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, setSearchText, onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setSearchText(newText);
    onSearch(newText);
  };

  return (
    <form className="relative w-full flex-center">
      <input
        type="text"
        placeholder="Search for a title or meaning"
        value={searchText}
        onChange={handleSearchChange}
        required
        className="search_input peer"
      />
    </form>
  );
};

export default SearchBar;
