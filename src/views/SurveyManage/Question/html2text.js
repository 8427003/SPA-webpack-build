export default function html2text(html) {
    if (html === undefined || html === '') {
        return html;
    }

    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;

    return tmp.textContent || tmp.innerText || "";
}
