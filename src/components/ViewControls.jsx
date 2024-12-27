import React from 'react';

const ViewControls = ({ viewMode, setViewMode }) => {
  return (
    <div className="bg-white/90 p-3 rounded-lg shadow backdrop-blur-sm">
      <h3 className="font-medium mb-2">View Mode</h3>
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('gene')}
          className={`flex-1 px-3 py-1.5 rounded text-sm ${
            viewMode === 'gene' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
        >
          Gene
        </button>
        <button
          onClick={() => setViewMode('cell')}
          className={`flex-1 px-3 py-1.5 rounded text-sm ${
            viewMode === 'cell' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
        >
          Cell Line
        </button>
      </div>
    </div>
  );
};

export default ViewControls;