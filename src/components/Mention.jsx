import { useMention } from '../context/MentionContext';

const Mention = ({ id, text, color }) => {
  const { mentionValues } = useMention();
  
  // Use the value from the context if available, otherwise use the passed text
  const displayText = mentionValues[id] || text;
  
  return (
    <span 
      className="px-2 py-0.5 rounded text-xs font-base text-white" 
      style={{ backgroundColor: color }}
      data-mention-id={id}
    >
      {displayText}
    </span>
  );
};

export default Mention; 