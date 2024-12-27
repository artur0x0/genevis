import React, { useState, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useVis } from '../context/VisContext';

const SearchPane = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { genes, geneIndices } = useData();
  const { activeFilters, setActiveFilters } = useVis();
  const searchRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Create suggestions with their indices
    const matchingGenes = genes
      .map((gene, index) => ({ gene, index }))
      .filter(({ gene }) => gene.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 10);

    setSuggestions(matchingGenes);
    setShowSuggestions(true);
  };

  const handleSelectGene = ({ gene, index }) => {
    setActiveFilters(prev => ({
      ...prev,
      geneFilter: { name: gene, index: index + 1 } // +1 because first column is cell line
    }));
    
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRemoveGene = () => {
    setActiveFilters(prev => {
      const { geneFilter, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] z-10">
      <div className="relative" ref={searchRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search"
          className="w-full p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow pl-4 pr-10"
        />
        <Search 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.map(({ gene, index }) => (
              <button
                key={index}
                onClick={() => handleSelectGene({ gene, index })}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {gene}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected gene chip */}
      {activeFilters.geneFilter && (
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm shadow">
            {activeFilters.geneFilter.name}
            <button
              onClick={handleRemoveGene}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPane;