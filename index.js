// @ts-check
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />



/** @param {string} content
 * @return {string}
*/
const getTitle = (content) => content.split("\n")[0] || "Untitled";

/** @param {string} title
 * @return {void}
*/
const updateTitle = (title) => {
    document.title = title;
    const url = new URL(location.href);
    if (url.search !== title) {
        url.search = title
        history.pushState(null, "", url);
    }
}

/** @param {string} content
 *@param {string} prevTitle
 * @return {void}
*/
const emitChange = (content, prevTitle) => {
    localStorage.removeItem(prevTitle);
    const title = makeUniqueTitle(getTitle(content));
    localStorage.setItem(title, content);
    updateTitle(title);
}


const textArea = document.getElementById("editor");
let prevTitle = decodeURIComponent(location.search.slice(1) || "Untitled");
if (textArea instanceof HTMLTextAreaElement) {
    textArea.value = localStorage.getItem(prevTitle) ?? prevTitle;
    updateTitle(prevTitle);

    /** @param {string} title
     * @return {void}
    */
    const load = (title) => {
        const content = localStorage.getItem(title) ?? title;
        textArea.value = content;
        emitChange(content, title);
    }

    textArea.addEventListener("input", () => {
        emitChange(textArea.value, prevTitle);
        prevTitle = getTitle(textArea.value);
    });

    const pageList = document.getElementById("page-list");
    if (pageList instanceof HTMLUListElement) {
        const updateList = () => {
            pageList.textContent = "";
            const titles = [...Array(localStorage.length).keys()].flatMap((i) => { const title = localStorage.key(i); return title === null ? [] : [title] }).sort();

            for (const title of titles) {
                const li = document.createElement("li");
                li.textContent = title;
                li.addEventListener("click", () => {
                    load(title);
                    prevTitle = title;
                    updateList();
                    globalThis.scrollTo(0, 0);
                });
                pageList.append(li);
            }
        }
        updateList();
        globalThis.addEventListener("storage", () => {
            updateList();
        })

        const newButton = document.getElementById("new");
        if (newButton instanceof HTMLButtonElement) {
            newButton.addEventListener("click", () => {
                prevTitle = makeUniqueTitle("Untitled")
                load(prevTitle);
                updateList();
            });
        }
    }
}



/** @param {string} title
 * @return {string}
 */
const makeUniqueTitle = (title) => {
    let count = 1;
    let newTitle = title;
    while (localStorage.getItem(newTitle) !== null) {
        newTitle = `${title}_${count++}`;
    }
    return newTitle;
}