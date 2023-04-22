import React, { useState } from 'react';
import './App.css';
import getText from './summarization';

function App() {
  const [report, setReport] = useState('');

  function execute() {
    /* eslint-disable no-undef */
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTabId },
          function: () => { return document.body.innerText; }
        },
        (results) => { setReport(results[0].result); }
      );
    });
  }

  return (
    <div className="App">
      <h1>Snappage</h1>
      <button onClick={execute}>Summarize</button>
      <p>{report}</p>
    </div>
  );
}

export default App;
