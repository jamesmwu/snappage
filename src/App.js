import './App.css';
import getText from './summarization';

function App() {

  function execute() {
    /* eslint-disable no-undef */
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTabId },
          function: () => { getText(); }
        }
      );
    });
  }

  return (
    <div className="App">
      <button onClick={execute}>Summarize</button>
    </div>
  );
}

export default App;