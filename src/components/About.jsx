// AboutPage.jsx
export const About = () => {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">About Genevis</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="text-gray-700 mb-4">
            Genevis is a 3D visualization tool for exploring gene expression data from the DepMap dataset. 
            This tool allows researchers to interactively explore relationships in significant gene expressions across all of DepMap's cell lines in one place.
            Additional tools to sort, filter and heatmap the data are coming soon.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Source</h2>
          <p className="text-gray-700 mb-4">
            The data visualized in this tool comes from the DepMap project at the Broad Institute. The current version 
            uses the 24Q4 Public release.
          </p>
          <p className="text-gray-700 mb-4">
            Citation: DepMap, Broad (2024). DepMap 24Q4 Public. Figshare+. Dataset.{' '}
            <a
              href="https://doi.org/10.25452/figshare.plus.27993248.v1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://doi.org/10.25452/figshare.plus.27993248.v1
            </a>
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
          <p className="text-gray-700 mb-4">
            The visualization allows you to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>View gene expression data in a 3D space</li>
            <li>Switch between Gene View and Cell Line View modes</li>
            <li>Click on data points to see detailed information</li>
            <li>Access direct links to the DepMap portal for more information</li>
          </ul>
        </section>
      </div>
    );
  };

export default About;