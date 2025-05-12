import { useState } from 'react';
import ContractRenderer from './components/ContractRenderer';
import originalData from './assets/input.json';
import testCaseData from './assets/test.json';
import './App.css';

function App() {
  const [useTestCase, setUseTestCase] = useState(false);
  const contractData = useTestCase ? testCaseData : originalData;

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="flex justify-end p-4">
        <button 
          onClick={() => setUseTestCase(!useTestCase)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {useTestCase ? 'Show Original Data' : 'Show Test Cases'}
        </button>
      </div>
      <ContractRenderer data={contractData} />
    </div>
  )
}

export default App
