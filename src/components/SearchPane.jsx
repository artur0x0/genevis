import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useVis } from '../context/VisContext';

const SearchPane = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { genes } = useData();
  const { activeFilters, setActiveFilters } = useVis();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
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
      geneFilter: { name: gene, index: index + 1 }
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
    <div className="relative w-full md:w-[600px] md:absolute md:left-1/2 md:-translate-x-1/2 md:top-4">
      {/* Search input container with fixed height */}
      <div className="h-12">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search"
          className="w-full h-full rounded-lg bg-white/90 backdrop-blur-sm shadow pl-4 pr-10"
        />
        <Search
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white/90 backdrop-blur-sm border rounded-lg shadow-lg max-h-60 overflow-auto">
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

      {/* Selected gene chip - Absolute positioned below search */}
      {activeFilters.geneFilter && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm shadow">
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