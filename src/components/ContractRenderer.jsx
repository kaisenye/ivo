import { useState, useEffect } from 'react';
import NodeRenderer from './NodeRenderer';
import { ClauseProvider } from '../context/ClauseContext';
import { MentionProvider, useMention } from '../context/MentionContext';

// Inner component that uses MentionContext
const ContractContent = ({ processedData }) => {
  const { extractMentionsFromDocument } = useMention();
  
  useEffect(() => {
    // Extract and initialize all mentions from the processed data
    if (processedData && processedData[0]) {
      extractMentionsFromDocument(processedData[0]);
    }
  }, [processedData, extractMentionsFromDocument]);
  
  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      {processedData[0]?.children.map((node, i) => (
        <NodeRenderer key={i} node={node} />
      ))}
    </div>
  );
};

// Main component
const ContractRenderer = ({ data }) => {
  const [processedData, setProcessedData] = useState(data);
  
  useEffect(() => {
    // Deep clone the data to avoid mutating the original
    const clonedData = JSON.parse(JSON.stringify(data));
    
    // Process the data to assign clause numbers at each nesting level
    const processData = (nodes, nestLevel = 0, levelClauseCounts = {}) => {
      // Track clause counts for each nesting level - pass it down so it's retained across nested calls
      const clauseCounts = { ...levelClauseCounts };
      
      const processNode = (node) => {
        if (!node) return node;
        
        // If it's a clause node, assign a clause number for its level
        if (node.type === 'clause') {
          // Initialize counter for this nesting level if it doesn't exist
          if (!clauseCounts[nestLevel]) {
            clauseCounts[nestLevel] = 0;
          }
          
          // Increment the counter for this level
          clauseCounts[nestLevel]++;
          
          // Assign the clause number
          node.clauseNumber = clauseCounts[nestLevel];
          
          // Process children with increased nesting level
          if (node.children && Array.isArray(node.children)) {
            node.children = processData(node.children, nestLevel + 1, clauseCounts);
          }
        } else {
          // For non-clause nodes, process children with same nesting level
          // but pass the existing clause counts to maintain numbering
          if (node.children && Array.isArray(node.children)) {
            node.children = processData(node.children, nestLevel, clauseCounts);
          }
        }
        
        return node;
      };
      
      return nodes.map(processNode);
    };
    
    // Process the entire data structure
    const processed = clonedData.map(item => {
      if (item.children) {
        const clauseCounts = {};
        item.children = processData(item.children, 0, clauseCounts);
      }
      return item;
    });
    
    setProcessedData(processed);
  }, [data]);

  return (
    <MentionProvider>
      <ClauseProvider>
        <ContractContent processedData={processedData} />
      </ClauseProvider>
    </MentionProvider>
  );
};

export default ContractRenderer; 