/* =========================================================
   SIGNATURE STUDIO
   MAIN APPLICATION
========================================================= */


/* =========================================================
   GLOBAL APPLICATION STATE
========================================================= */

const App = {

    selectedElement: null,

    zoom: 1,

    history: [],

    historyIndex: -1,

    elements: [],

    settings: {

        autoSave: true,

        template: "modern"

    }

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) => {

    return document.querySelector(selector);

};


const $$ = (selector) => {

    return document.querySelectorAll(selector);

};


/* =========================================================
   INITIALIZE APPLICATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});


function initializeApp() {

    console.log(
        "Signature Studio initialized"
    );


    setupElementSelection();

    setupElementButtons();

    setupToolbar();

    setupModalEvents();

    setupQuickActions();

    setupKeyboardShortcuts();

    saveHistory();

}


/* =========================================================
   ELEMENT SELECTION
========================================================= */

function setupElementSelection() {

    const canvas = $("#signatureCanvas");


    canvas.addEventListener(
        "click",
        (event) => {

            const element =
                event.target.closest(
                    ".signature-block"
                );


            if (!element) {

                deselectElement();

                return;

            }


            selectElement(element);

        }
    );

}


function selectElement(element) {

    $$(".signature-block")
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


    element.classList.add(
        "selected"
    );


    App.selectedElement = element;


    renderProperties(element);

}


function deselectElement() {

    $$(".signature-block")
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


    App.selectedElement = null;


    renderEmptyProperties();

}


/* =========================================================
   ELEMENT BUTTONS
========================================================= */

function setupElementButtons() {

    $$(".element-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const type =
                        button.dataset.element;


                    addElement(type);

                }
            );

        });

}


/* =========================================================
   ADD ELEMENT
========================================================= */

function addElement(type) {

    const canvas =
        $("#signatureCanvas");


    const element =
        document.createElement("div");


    const id =
        "element-" +
        Date.now();


    element.className =
        "signature-block";


    element.dataset.id =
        id;


    element.dataset.type =
        type;


    element.setAttribute(
        "tabindex",
        "0"
    );


    const content =
        document.createElement("div");


    content.className =
        "element-content";


    switch (type) {

        case "text":

            content.textContent =
                "New Text";

            break;


        case "heading":

            content.textContent =
                "New Heading";

            break;


        case "link":

            content.textContent =
                "Click Here";

            break;


        case "image":

            content.textContent =
                "Image";

            break;


        case "logo":

            content.textContent =
                "Logo";

            break;


        case "banner":

            content.textContent =
                "Banner";

            break;


        case "social":

            content.textContent =
                "Social Media";

            break;


        case "divider":

            content.textContent =
                "────────────";

            break;


        case "button":

            content.textContent =
                "Button";

            break;


        case "spacer":

            content.innerHTML =
                "&nbsp;";

            content.style.height =
                "25px";

            break;


        default:

            content.textContent =
                "New Element";

    }


    element.appendChild(
        content
    );


    canvas.appendChild(
        element
    );


    selectElement(
        element
    );


    saveHistory();

}


/* =========================================================
   PROPERTIES PANEL
========================================================= */

function renderEmptyProperties() {

    $("#propertiesPanel").innerHTML = `

        <div class="empty-properties">

            <div class="empty-icon">
                ⚙
            </div>

            <h3>
                No Element Selected
            </h3>

            <p>
                Select an element from the
                canvas to customize it.
            </p>

        </div>

    `;

}


function renderProperties(element) {

    const type =
        element.dataset.type;


    const content =
        element.querySelector(
            ".element-content"
        );


    $("#propertiesPanel").innerHTML = `

        <div class="property-section">

            <div class="property-title">
                Element
            </div>

            <div class="property-type">
                ${type.toUpperCase()}
            </div>

        </div>


        <div class="property-section">

            <label>
                Content
            </label>

            <textarea
                id="propertyContent"
                rows="4"
            >${content.innerText}</textarea>

        </div>


        <div class="property-section">

            <label>
                Font Size
            </label>

            <input
                type="number"
                id="fontSizeInput"
                value="${parseInt(
                    getComputedStyle(content).fontSize
                ) || 14}"
            >

        </div>


        <div class="property-section">

            <label>
                Text Color
            </label>

            <input
                type="color"
                id="textColorInput"
                value="${rgbToHex(
                    getComputedStyle(content).color
                )}"
            >

        </div>


        <div class="property-section">

            <label>
                Alignment
            </label>

            <select id="textAlignInput">

                <option value="left">
                    Left
                </option>

                <option value="center">
                    Center
                </option>

                <option value="right">
                    Right
                </option>

            </select>

        </div>

    `;


    bindPropertyEvents(
        element,
        content
    );

}


/* =========================================================
   PROPERTY EVENTS
========================================================= */

function bindPropertyEvents(
    element,
    content
) {


    const contentInput =
        $("#propertyContent");


    const fontSizeInput =
        $("#fontSizeInput");


    const colorInput =
        $("#textColorInput");


    const alignInput =
        $("#textAlignInput");


    if (contentInput) {

        contentInput.addEventListener(
            "input",
            () => {

                content.textContent =
                    contentInput.value;

                saveHistory();

            }
        );

    }


    if (fontSizeInput) {

        fontSizeInput.addEventListener(
            "input",
            () => {

                content.style.fontSize =
                    fontSizeInput.value +
                    "px";

                saveHistory();

            }
        );

    }


    if (colorInput) {

        colorInput.addEventListener(
            "input",
            () => {

                content.style.color =
                    colorInput.value;

                saveHistory();

            }
        );

    }


    if (alignInput) {

        alignInput.value =
            getComputedStyle(
                content
            ).textAlign;


        alignInput.addEventListener(
            "change",
            () => {

                content.style.textAlign =
                    alignInput.value;

                saveHistory();

            }
        );

    }

}


/* =========================================================
   TOOLBAR
========================================================= */

function setupToolbar() {

    $("#zoomInBtn")
        .addEventListener(
            "click",
            () => {

                App.zoom += 0.1;

                applyZoom();

            }
        );


    $("#zoomOutBtn")
        .addEventListener(
            "click",
            () => {

                App.zoom -= 0.1;

                if (App.zoom < 0.5) {

                    App.zoom = 0.5;

                }

                applyZoom();

            }
        );


    $("#previewBtn")
        .addEventListener(
            "click",
            openPreview
        );


    $("#exportBtn")
        .addEventListener(
            "click",
            exportHTML
        );


    $("#undoBtn")
        .addEventListener(
            "click",
            undo
        );


    $("#redoBtn")
        .addEventListener(
            "click",
            redo
        );

}


function applyZoom() {

    const canvas =
        $("#signatureCanvas");


    canvas.style.transform =
        `scale(${App.zoom})`;


    $("#zoomValue")
        .textContent =
        Math.round(
            App.zoom * 100
        ) + "%";

}


/* =========================================================
   QUICK ACTIONS
========================================================= */

function setupQuickActions() {

    $("#uploadImageBtn")
        .addEventListener(
            "click",
            () => {

                $("#imageInput").click();

            }
        );


    $("#imageInput")
        .addEventListener(
            "change",
            handleImageUpload
        );


    $("#deleteSelectedBtn")
        .addEventListener(
            "click",
            deleteSelected
        );


    $("#duplicateSelectedBtn")
        .addEventListener(
            "click",
            duplicateSelected
        );


    $("#templatesBtn")
        .addEventListener(
            "click",
            openTemplateModal
        );

}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

function handleImageUpload(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image file."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            addImageElement(
                e.target.result
            );

        };


    reader.readAsDataURL(file);

}


function addImageElement(
    src
) {

    const canvas =
        $("#signatureCanvas");


    const element =
        document.createElement("div");


    element.className =
        "signature-block";


    element.dataset.id =
        "image-" + Date.now();


    element.dataset.type =
        "image";


    element.setAttribute(
        "tabindex",
        "0"
    );


    const image =
        document.createElement("img");


    image.src =
        src;


    image.alt =
        "Uploaded image";


    image.style.maxWidth =
        "100%";


    image.style.display =
        "block";


    element.appendChild(
        image
    );


    canvas.appendChild(
        element
    );


    selectElement(
        element
    );


    saveHistory();

}


/* =========================================================
   DELETE
========================================================= */

function deleteSelected() {

    if (!App.selectedElement) {

        return;

    }


    App.selectedElement.remove();


    App.selectedElement =
        null;


    renderEmptyProperties();


    saveHistory();

}


/* =========================================================
   DUPLICATE
========================================================= */

function duplicateSelected() {

    if (!App.selectedElement) {

        return;

    }


    const clone =
        App.selectedElement.cloneNode(
            true
        );


    clone.dataset.id =
        "element-" + Date.now();


    App.selectedElement
        .after(clone);


    selectElement(
        clone
    );


    saveHistory();

}


/* =========================================================
   PREVIEW
========================================================= */

function openPreview() {

    const canvas =
        $("#signatureCanvas");


    $("#previewContent")
        .innerHTML =
        canvas.innerHTML;


    $("#previewModal")
        .hidden = false;

}


function closePreview() {

    $("#previewModal")
        .hidden = true;

}


/* =========================================================
   EXPORT
========================================================= */

function exportHTML() {

    const canvas =
        $("#signatureCanvas");


    const html =
        canvas.innerHTML;


    const fullHTML = `

<div style="
    font-family: Arial, sans-serif;
">
${html}
</div>

    `.trim();


    const blob =
        new Blob(
            [fullHTML],
            {
                type:
                    "text/html"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "email-signature.html";


    link.click();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   MODALS
========================================================= */

function setupModalEvents() {

    $("#closePreviewModal")
        .addEventListener(
            "click",
            closePreview
        );


    $("#previewModal")
        .querySelector(
            ".modal-overlay"
        )
        .addEventListener(
            "click",
            closePreview
        );


    $("#closeTemplateModal")
        .addEventListener(
            "click",
            closeTemplateModal
        );


    $("#templateModal")
        .querySelector(
            ".modal-overlay"
        )
        .addEventListener(
            "click",
            closeTemplateModal
        );

}


/* =========================================================
   TEMPLATE MODAL
========================================================= */

function openTemplateModal() {

    $("#templateModal")
        .hidden = false;


    renderTemplates();

}


function closeTemplateModal() {

    $("#templateModal")
        .hidden = true;

}


/* =========================================================
   TEMPLATES
========================================================= */

function renderTemplates() {

    const grid =
        $("#templateGrid");


    const templates = [

        "Modern",

        "Corporate",

        "Minimal",

        "Creative",

        "Elegant",

        "Dark"

    ];


    grid.innerHTML =
        "";


    templates.forEach(
        name => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "template-card";


            card.innerHTML = `

                <div class="template-preview">

                    <div style="
                        padding:20px;
                        font-family:Arial;
                    ">

                        <strong>
                            ${name}
                        </strong>

                        <br>

                        <small>
                            Professional
                            Signature
                        </small>

                    </div>

                </div>

                <div class="template-name">
                    ${name}
                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    applyTemplate(
                        name
                    );

                }
            );


            grid.appendChild(
                card
            );

        }
    );

}


function applyTemplate(
    name
) {

    const canvas =
        $("#signatureCanvas");


    canvas.innerHTML = `

        <div
            class="signature-block"
            data-id="template-name"
            data-type="heading"
            tabindex="0"
        >

            <div
                class="element-content"
                style="
                    font-size:26px;
                    font-weight:800;
                    color:#111;
                "
            >
                Your Name
            </div>

        </div>


        <div
            class="signature-block"
            data-id="template-role"
            data-type="text"
            tabindex="0"
        >

            <div
                class="element-content"
                style="
                    font-size:14px;
                    color:#555;
                "
            >
                Your Position
            </div>

        </div>


        <div
            class="signature-block"
            data-id="template-company"
            data-type="text"
            tabindex="0"
        >

            <div
                class="element-content"
                style="
                    font-size:13px;
                    color:#777;
                "
            >
                Your Company
            </div>

        </div>


        <div
            class="signature-block"
            data-id="template-contact"
            data-type="text"
            tabindex="0"
        >

            <div
                class="element-content"
                style="
                    font-size:12px;
                    color:#555;
                "
            >
                email@example.com
                |
                +91 00000 00000
                |
                website.com
            </div>

        </div>

    `;


    closeTemplateModal();


    setupElementSelection();


    saveHistory();


    updateStatus(
        `${name} template loaded`
    );

}


/* =========================================================
   HISTORY
========================================================= */

function saveHistory() {

    const canvas =
        $("#signatureCanvas");


    const state =
        canvas.innerHTML;


    App.history =
        App.history.slice(
            0,
            App.historyIndex + 1
        );


    App.history.push(
        state
    );


    App.historyIndex =
        App.history.length - 1;


    if (App.history.length > 50) {

        App.history.shift();

        App.historyIndex--;

    }


    updateStatus(
        "Saved"
    );

}


function restoreHistory(
    index
) {

    if (
        index < 0 ||
        index >= App.history.length
    ) {

        return;

    }


    $("#signatureCanvas")
        .innerHTML =
        App.history[index];


    App.historyIndex =
        index;


    deselectElement();

}


function undo() {

    if (
        App.historyIndex <= 0
    ) {

        return;

    }


    restoreHistory(
        App.historyIndex - 1
    );

}


function redo() {

    if (
        App.historyIndex >=
        App.history.length - 1
    ) {

        return;

    }


    restoreHistory(
        App.historyIndex + 1
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() ===
                "z"
            ) {

                event.preventDefault();

                undo();

            }


            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() ===
                "y"
            ) {

                event.preventDefault();

                redo();

            }


            if (
                event.key ===
                "Delete"
            ) {

                deleteSelected();

            }

        }
    );

}


/* =========================================================
   STATUS
========================================================= */

function updateStatus(
    message
) {

    const status =
        $("#statusText");


    if (status) {

        status.textContent =
            message;

    }

}


/* =========================================================
   RGB → HEX
========================================================= */

function rgbToHex(
    rgb
) {

    if (!rgb) {

        return "#000000";

    }


    const result =
        rgb.match(
            /\d+/g
        );


    if (!result) {

        return "#000000";

    }


    return "#" +
        result
            .slice(0, 3)
            .map(
                x =>
                    parseInt(
                        x
                    )
                    .toString(16)
                    .padStart(
                        2,
                        "0"
                    )
            )
            .join("");

      }
