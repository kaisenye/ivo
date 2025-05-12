import React from 'react';
import Mention from './Mention';

const NodeRenderer = ({ node, nestLevel = 0 }) => {
  const renderNode = (node, nestLevel = 0) => {
    if (typeof node === 'string') return node;

    const { type, children, text, bold, underline, italic, color, id } = node;

    const applyMarks = (content) => {
      let className = "";
      if (bold) className += " font-bold";
      if (underline) className += " underline";
      if (italic) className += " italic";
      
      // Handle newlines in text
      if (typeof content === 'string' && content.includes('\n')) {
        const lines = content.split('\n');
        return (
          <span className={className.trim() || undefined}>
            {lines.map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </span>
        );
      }
      
      return <span className={className.trim() || undefined}>{content}</span>;
    };

    // If it's a text node, apply marks and return
    if (text !== undefined) {
      return applyMarks(text);
    }

    // Handle special case where a p contains block elements
    if (type === 'p' && children) {
      // Check if any child is a block element
      const hasBlockChildren = children.some(child => 
        child.type === 'clause' || child.type === 'block' || child.type === 'h1' || 
        child.type === 'h4' || child.type === 'ul' || child.type === 'p'
      );
      
      if (hasBlockChildren) {
        // For paragraphs with clause children, render without the paragraph container
        // This allows the clause to be treated as a top-level element
        return <>{children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>)}</>;
      }
    }

    // Calculate indentation for nested clauses
    const indentClass = nestLevel > 0 ? `pl-${Math.min(nestLevel * 4, 12)}` : '';

    switch (type) {
      case 'block':
        return <div className={`mb-4 text-left ${indentClass}`}>{children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>)}</div>;
      case 'clause':
        // Format clause numbering based on nest level
        let clauseLabel;
        if (nestLevel === 0) {
          clauseLabel = `${node.clauseNumber || ''}.`;
        } else {
          // For nested clauses, use (a), (b), (c), etc.
          const letter = String.fromCharCode(96 + (node.clauseNumber || 1)); // 'a' is 97 in ASCII
          clauseLabel = `(${letter})`;
        }
        
        // Find if there's an h4 or p child to combine with the clause label
        const h4Index = children?.findIndex(child => child.type === 'h4');
        const pIndex = children?.findIndex(child => child.type === 'p');
        
        // Determine which element to inline with the clause number
        let inlineIndex = -1;
        let inlineType = null;
        
        if (h4Index !== -1) {
          inlineIndex = h4Index;
          inlineType = 'h4';
        } else if (pIndex !== -1) {
          inlineIndex = pIndex;
          inlineType = 'p';
        }
        
        return (
          <div className={`mb-4 text-left ${indentClass}`}>
            {inlineIndex !== -1 ? (
              // If there's an h4 or p, we'll handle it specially and skip it in the normal children rendering
              <div className={nestLevel > 0 ? "pl-4" : ""}>
                {children?.map((child, i) => 
                  i === inlineIndex ? (
                    // Render element with clause label prepended
                    <div key={i} className={`${inlineType === 'h4' ? 'text-lg' : ''} mb-1 text-left flex items-start`}>
                      <div className="flex-1 text-sm">
                        <span className="font-base mr-2">
                          {clauseLabel}
                        </span>
                        {child.children?.map((grandChild, j) => <React.Fragment key={j}>{renderNode(grandChild, nestLevel)}</React.Fragment>)}
                      </div>
                    </div>
                  ) : (
                    <React.Fragment key={i}>{renderNode(child, nestLevel + 1)}</React.Fragment>
                  )
                )}
              </div>
            ) : (
              // Original rendering if no h4 or p is found
              <>
                <div className="font-bold">{clauseLabel}</div>
                <div className={nestLevel > 0 ? "pl-4" : ""}>
                  {children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel + 1)}</React.Fragment>)}
                </div>
              </>
            )}
          </div>
        );
      case 'h1':
        return <h1 className="text-3xl mb-2 text-left font-bold">{children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>)}</h1>;
      case 'h4':
        return <h4 className={`text-lg mb-1 text-left ${indentClass}`}>{children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>)}</h4>;
      case 'p':
        return <p className={`mb-2 text-left ${indentClass}`}>{children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>)}</p>;
      case 'ul':
        return <ul className={`list-disc pl-6 text-left ${indentClass}`}>{children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>)}</ul>;
      case 'li':
        return <li className="text-left">{children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>)}</li>;
      case 'lic':
        return <span className="text-left">{children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>)}</span>;
      case 'mention':
        return <Mention id={id} text={children?.[0]?.text} color={color} />;
      default:
        return applyMarks(children?.map((child, i) => <React.Fragment key={i}>{renderNode(child, nestLevel)}</React.Fragment>));
    }
  };

  return renderNode(node, nestLevel);
};

export default NodeRenderer; 