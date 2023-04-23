import React, { useState } from 'react';
import './App.css';
import shorten from './summarization';
import * as DOMPurify from "dompurify";
import html2md from "html-to-md";

let contentSelector;
function getContainer() {
  let selectedContainer;

  if (contentSelector && document.querySelector(contentSelector)) {
    selectedContainer = document.querySelector(contentSelector);
  } else if (document.head.querySelector("meta[name='articleBody'")) {
    selectedContainer = document.createElement("div");
    selectedContainer.innerHTML = DOMPurify.sanitize(
      document.head
        .querySelector("meta[name='articleBody'")
        .getAttribute("content")
    );
  } else {
    const numWordsOnPage = document.body.innerText.match(/\S+/g).length;
    let ps = document.body.querySelectorAll("p");

    // Find the paragraphs with the most words in it
    let pWithMostWords = document.body,
      highestWordCount = 0;

    if (ps.length === 0) {
      ps = document.body.querySelectorAll("div");
    }

    ps.forEach((p) => {
      if (
        p.offsetHeight !== 0
      ) {
        //  Make sure it's visible on the regular page
        const myInnerText = p.innerText.match(/\S+/g);
        if (myInnerText) {
          const wordCount = myInnerText.length;
          if (wordCount > highestWordCount) {
            highestWordCount = wordCount;
            pWithMostWords = p;
          }
        }
      }

      // Remove elements in JR that were hidden on the original page
      if (p.offsetHeight === 0) {
        p.dataset.simpleDelete = true;
      }
    });

    // Keep selecting more generally until over 2/5th of the words on the page have been selected
    selectedContainer = pWithMostWords;
    let wordCountSelected = highestWordCount;

    while (
      wordCountSelected / numWordsOnPage < 0.4 &&
      selectedContainer != document.body &&
      selectedContainer.parentElement.innerText
    ) {
      selectedContainer = selectedContainer.parentElement;
      wordCountSelected = selectedContainer.innerText.match(/\S+/g).length;
    }

    // Make sure a single p tag is not selected
    if (selectedContainer.tagName === "P") {
      selectedContainer = selectedContainer.parentElement;
    }
  }

  return selectedContainer;
}

function getContentOfArticle() {
  // let pageSelectedContainer = getContainer();
  let pageSelectedContainer = document.body;
  let content = pageSelectedContainer.textContent.trim();
  console.log(content);
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
            console.log(content);
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
