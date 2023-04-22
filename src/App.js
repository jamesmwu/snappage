import React, { useState } from 'react';
import './App.css';
import shorten from './summarization';


function App() {
  const [report, setReport] = useState('');

  function execute() {
    /* eslint-disable no-undef */
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTabId },
          function: () => {
            // return document.body.innerText; 
            const headingsAndParagraphs = document.querySelectorAll('p');
            let text = '';
            for (let i = 0; i < headingsAndParagraphs.length; i++) {
              text += headingsAndParagraphs[i].textContent + ' ';
            }
            return text;
          }
        },
        (results) => {
          const summary = shorten(results[0].result, 10);
          setReport(summary);
        }
      );
    });
  }

  return (
    <div className="container">
      <h1 className="title">Snappage</h1>
      <button className="button" onClick={execute}>Summarize</button>
      <p className="report">{report}</p>
    </div>
  );
}

export default App;
