// Normalized state 
interface ContractState {
    // Nodes stored by ID for O(1) access
    nodes: {
      [id: string]: Node;
    };
    
    // Document structure
    documentId: string;   // Root document ID
    nodeOrder: string[];  // Ordered list of top-level nodes
    
    // Variables/mentions
    variables: {
      [id: string]: {
        id: string;
        name: string;
        value: any;
        type: 'text' | 'date' | 'number' | 'currency';
        occurrences: string[]; // IDs of mention nodes using this variable
      }
    };
    
    // History for undo/redo
    history: {
      past: Array<Partial<ContractState>>;
      future: Array<Partial<ContractState>>;
    };
    
    // UI state
    ui: {
      selectedNodeId?: string;
      editingNodeId?: string;
      expandedNodes: Set<string>;
    };
}