export const vocabTem = (word, type, engDef, thaiDef) => {
    const li = document.createElement('li');
    li.innerHTML = `
        <p><b>${word}</b></p>
        <ul>
            <li>
                <div class="flex-box">
                    <p>Type: </p>
                    <p>${type}</p>
                </div>
                <div class="flex-box">
                    <p>EN: </p>
                    <p>${engDef}</p>
                </div>
            </li>
            <li>
                <div class="flex-box">
                    <p>TH: </p>
                    <p>${thaiDef}</p>
                </div>
            </li>
        </ul>`;
    return li;
};
