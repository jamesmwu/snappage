export default function getText(setReport) {
    const text = document.body.innerText;
    setReport(text);
    // document.body.innerHTML = text;
}