import React, { useState } from 'react';
import { X } from 'lucide-react';

// Popup Component
const InfoPopup = ({ onClose }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);
  
    const handleClose = () => {
      if (dontShowAgain) {
        document.cookie = "hideDataPopup=true;max-age=31536000;path=/"; // 1 year expiry
      }
      onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
      
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Welcome to Genevis!
            </h2>
            
            <div className="text-gray-800">
              <p className="mb-6 leading-relaxed">
                You are about to view an interactive 3D visualization of gene expression strength across all cell lines from the latest DepMap dataset. 
                This data set has been filtered to include only negative gene expressions stronger than -2.186, which correlates to 1 sigma and larger deviations from the mean.
                Clicking on a bar in the graph will provide information about the cell line and the gene that it represents, with links to the DepMap portal for more information.
              </p>
      
              <div className="text-sm text-gray-600 mb-4">
                Citation: DepMap, Broad (2024). DepMap 24Q4 Public. Figshare+. Dataset.{" "}
                <a
                  href="https://doi.org/10.25452/figshare.plus.27993248.v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://doi.org/10.25452/figshare.plus.27993248.v1
                </a>
              </div>
      
              <div className="mb-6">
                <a
                  href="https://depmap.org/portal/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Learn more about the complete dataset →
                </a>
              </div>
      
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dontShow"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="dontShow" className="text-sm text-gray-600">
                  Don't show this message again
                </label>
              </div>
            </div>
          </div>
        </div>
      );
}

export default InfoPopup;