type ContractOperation = 
  | { type: 'INSERT_NODE', node: Node, parentId: string, index?: number }
  | { type: 'UPDATE_NODE', id: string, changes: Partial<Node> }
  | { type: 'MOVE_NODE', id: string, newParentId: string, index?: number }
  | { type: 'DELETE_NODE', id: string }
  | { type: 'UPDATE_VARIABLE', id: string, value: any }
  | { type: 'ADD_REFERENCE', sourceId: string, targetId: string }
  | { type: 'RECOMPUTE_NUMBERING' };