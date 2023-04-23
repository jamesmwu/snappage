import React, { useState } from 'react';
import './App.css';
import shorten from './summarization';
import * as DOMPurify from "dompurify";
import html2md from "html-to-md";

function getContainer() {
  // let containers = document.getElementsByTagName('article');
  // console.log(containers);
  // let maxTextLength = -1;
  // let maxTextContainer = null;

  // for (let i = 0; i < containers.length; i++) {
  //   let textLength = containers[i].innerText.length;
  //   if (textLength > maxTextLength) {
  //     maxTextLength = textLength;
  //     maxTextContainer = containers[i];
  //   }
  // }

  // return maxTextContainer;
  return document.body;
}


function getContentOfArticle() {
  // let pageSelectedContainer = getContainer();
  let pageSelectedContainer = document.body;
  let content = pageSelectedContainer.textContent.trim();
  // console.log(content);
  return content;
}


// function getContentOfArticle() {
//   let pageSelectedContainer = getContainer();

//   const pattern1 = /<a\b[^>]*>(.*?)<\/a>/gi;
//   pageSelectedContainer.innerHTML = DOMPurify.sanitize(
//     pageSelectedContainer.innerHTML.replace(pattern1, "")
//   );
//   const pattern2 = new RegExp("<br/?>[ \r\ns]*<br/?>", "g");
//   pageSelectedContainer.innerHTML = DOMPurify.sanitize(
//     pageSelectedContainer.innerHTML.replace(pattern2, "</p><p>")
//   );

//   let content = DOMPurify.sanitize(pageSelectedContainer.innerHTML);
//   console.log(content);
//   // content = html2md(content);
//   return content;
// }

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
            // const headingsAndParagraphs = document.querySelectorAll('p');
            // let text = '';
            // for (let i = 0; i < headingsAndParagraphs.length; i++) {
            //   text += headingsAndParagraphs[i].textContent + ' ';
            // }
            // return text;
            let content = getContentOfArticle();
            return content;
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
