import { useState, useEffect } from 'react';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (responseData && responseData.roll_number) {
      document.title = responseData.roll_number;
    }
  }, [responseData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setJsonError('');
    setResponseData(null);
    setSubmitted(false);
    setSelectedOptions([]);

    let parsed;
    try {
      parsed = JSON.parse(inputValue);
    } catch (error) {
      setJsonError('Invalid JSON format.');
      return;
    }

    if (!parsed.data) {
      setJsonError('JSON must have a "data" property.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      if (!res.ok) {
        setJsonError('API call failed with status ' + res.status);
        return;
      }

      const data = await res.json();
      setResponseData(data);
      setSubmitted(true);
    } catch (error) {
      setJsonError('Error while calling the API.');
    }
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedOptions(prev =>
      checked ? [...prev, value] : prev.filter(option => option !== value)
    );
  };

  const renderFilteredResponse = () => {
    if (!responseData) return null;
    const filtered = {};
    if (selectedOptions.includes('Numbers')) {
      filtered.numbers = responseData.numbers;
    }
    if (selectedOptions.includes('Alphabets')) {
      filtered.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes('Highest alphabet')) {
      filtered.highest_alphabet = responseData.highest_alphabet;
    }
    return (
      <div>
        {filtered.numbers && <p><strong>Numbers:</strong> {filtered.numbers.join(', ')}</p>}
        {filtered.alphabets && <p><strong>Alphabets:</strong> {filtered.alphabets.join(', ')}</p>}
        {filtered.highest_alphabet && <p><strong>Highest Alphabet:</strong> {filtered.highest_alphabet.join(', ')}</p>}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Enter JSON Data</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          cols="50"
          placeholder='Example: { "data": ["A", "C", "z", "2", "3"] }'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <br />
        <button type="submit" className="btn">Submit</button>
      </form>
      {jsonError && <p className="error">{jsonError}</p>}
      
      {submitted && responseData && (
        <div className="response-container">
          <h2>Multi-Select Filter</h2>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" value="Alphabets" onChange={handleOptionChange} /> Alphabets
            </label>
            <label>
              <input type="checkbox" value="Numbers" onChange={handleOptionChange} /> Numbers
            </label>
            <label>
              <input type="checkbox" value="Highest alphabet" onChange={handleOptionChange} /> Highest alphabet
            </label>
          </div>
          <div className="response-box">
            <h3>Filtered Response:</h3>
            {renderFilteredResponse()}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;