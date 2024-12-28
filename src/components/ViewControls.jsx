import React from 'react';

const ViewControls = ({ viewMode, setViewMode }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow">
      <div className="p-2">
        <div className="flex gap-2 md:justify-center">
          <button
            onClick={() => setViewMode('gene')}
            className={`px-3 py-1.5 rounded text-sm ${
              viewMode === 'gene'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-medium font-medium hidden md:inline">Gene View</span>
            <span className="md:hidden">Gene</span>
          </button>
          <button
            onClick={() => setViewMode('cell')}
            className={`px-3 py-1.5 rounded text-sm whitespace-nowrap ${
              viewMode === 'cell'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-medium font-medium hidden md:inline">Cell Line View</span>
            <span className="md:hidden">Cell Line</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewControls;