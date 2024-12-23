// InfoPanel.js
export const InfoPanel = ({ selectedPoint }) => {
    if (!selectedPoint) return null;
  
    return (
      <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow backdrop-blur-sm">
        <h3 className="font-medium mb-2">Selected Point:</h3>
        <p>
          Cell Line:{' '}
          <a
            href={`https://depmap.org/portal/cell_line/${selectedPoint.cellLine}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {selectedPoint.cellLine}
          </a>
        </p>
        <p>
          Gene:{' '}
          <a
            href={`https://depmap.org/portal/gene/${selectedPoint.gene.split(" ")[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {selectedPoint.gene}
          </a>
        </p>
        <p>Expression: {selectedPoint.originalExpression.toFixed(3)}</p>
      </div>
    );
  };

  export default InfoPanel;