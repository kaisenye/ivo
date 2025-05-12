// MentionContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const MentionContext = createContext();

export const MentionProvider = ({ children }) => {
  const [mentionValues, setMentionValues] = useState({});
  
  // Function to extract and initialize mention values from document
  const extractMentionsFromDocument = (node) => {
    if (!node) return;
    
    // If it's a mention node, add it to our values
    if (node.type === 'mention' && node.id && (node.value !== undefined || node.children?.[0]?.text !== undefined)) {
      // Get text value
      const value = node.children?.[0]?.text;
      
      setMentionValues(prev => ({
        ...prev,
        [node.id]: value
      }));
    }
    
    // Recursively process children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(extractMentionsFromDocument);
    }
  };
  
  const updateMention = (id, newValue) => {
    setMentionValues(prev => ({
      ...prev,
      [id]: newValue
    }));
  };
  
  return (
    <MentionContext.Provider value={{ 
      mentionValues, 
      updateMention,
      extractMentionsFromDocument
    }}>
      {children}
    </MentionContext.Provider>
  );
};

export const useMention = () => useContext(MentionContext);