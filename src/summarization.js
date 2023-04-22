export default function getText() {
    const text = document.body.innerText;
    document.body.innerHTML = text;
}