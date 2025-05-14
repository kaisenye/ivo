// Base node interface
interface Node {
  id: string;           // Unique identifier for each node
  type: NodeType;       // Type discriminator
  parent?: string;      // Reference to parent node ID
  children?: string[];  // References to child node IDs
  metadata?: Record<string, any>; // Extensible metadata
}

// Node type discriminator
type NodeType = 'document' | 'block' | 'clause' | 'paragraph' | 'heading' | 
                'list' | 'list-item' | 'mention' | 'text';

// Document root
interface DocumentNode extends Node {
  type: 'document';
  title: string;
  version: number;     // For versioning/history
  lastModified: Date;
}

// Text leaf node
interface TextNode extends Node {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// Mention/variable node
interface MentionNode extends Node {
  type: 'mention';
  variableId: string;   // Reference to variable definition
  color: string;
}

// Clause node with numbering info
interface ClauseNode extends Node {
  type: 'clause';
  title?: string;
  level: number;        // Nesting level
  number?: number;      // Assigned number (can be computed)
  references?: string[]; // IDs of clauses that reference this clause
}