import { createContext, useRef } from 'react';

export const ClauseContext = createContext({
  clauseCount: 0,
  incrementClauseCount: () => {},
});

export const ClauseProvider = ({ children }) => {
  const clauseCountRef = useRef(0);

  const incrementClauseCount = () => {
    clauseCountRef.current += 1;
    return clauseCountRef.current;
  };

  return (
    <ClauseContext.Provider value={{ 
      clauseCount: clauseCountRef.current, 
      incrementClauseCount 
    }}>
      {children}
    </ClauseContext.Provider>
  );
}; 