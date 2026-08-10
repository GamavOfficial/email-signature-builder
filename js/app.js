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
   PART 1 — PARAGRAPH / HEADING CORE
========================================================= */

function addElement(type) {

    const canvas =
        $("#signatureCanvas");

    if (!canvas) {
        return;
    }


    /* -----------------------------------------------------
       Backward compatibility

       Old button may still send:
       "text"

       New system uses:
       "paragraph"
    ----------------------------------------------------- */

    if (type === "text") {
        type = "paragraph";
    }


    /* -----------------------------------------------------
       Create main element
    ----------------------------------------------------- */

    const element =
        document.createElement("div");


    /* -----------------------------------------------------
       Unique ID
    ----------------------------------------------------- */

    const id =
        "element-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 7);


    /* -----------------------------------------------------
       Base classes / data
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       Content element
    ----------------------------------------------------- */

    const content =
        document.createElement("div");


    content.className =
        "element-content";


    content.style.boxSizing =
        "border-box";


    /* -----------------------------------------------------
       Element type
    ----------------------------------------------------- */

    switch (type) {


        /* =================================================
           PARAGRAPH
        ================================================= */

        case "paragraph":

            content.textContent =
                "New Paragraph";


            content.style.fontSize =
                "14px";


            content.style.color =
                "#555555";


            content.style.lineHeight =
                "1.5";


            break;


        /* =================================================
           HEADING
        ================================================= */

        case "heading":

            content.textContent =
                "New Heading";


            content.style.fontSize =
                "26px";


            content.style.fontWeight =
                "800";


            content.style.color =
                "#111111";


            content.style.lineHeight =
                "1.2";


            break;


        /* =================================================
           LINK

           Professional Link Engine will replace this
           element when the Link button is used.
        ================================================= */

        case "link":

            content.textContent =
                "Click Here";


            break;


        /* =================================================
           LOGO

           Professional Media Engine handles the
           actual image creation.
        ================================================= */

        case "logo":

            content.textContent =
                "Logo";


            break;


        /* =================================================
           BANNER

           Professional Media Engine handles the
           actual image creation.
        ================================================= */

        case "banner":

            content.textContent =
                "Banner";


            break;


        /* =================================================
           SOCIAL MEDIA
        ================================================= */

        case "social":

            content.textContent =
                "Social Media";


            break;


        /* =================================================
           BUTTON

           Professional Link Engine handles the
           actual button creation.
        ================================================= */

        case "button":

            content.textContent =
                "Button";


            break;


        /* =================================================
           DIVIDER
        ================================================= */

        case "divider":

            content.textContent =
                "────────────";


            break;


        /* =================================================
           SPACER
        ================================================= */

        case "spacer":

            content.innerHTML =
                "&nbsp;";


            content.style.height =
                "25px";


            break;


        /* =================================================
           UNKNOWN ELEMENT
        ================================================= */

        default:

            content.textContent =
                "New Element";

    }


    /* -----------------------------------------------------
       Add content to block
    ----------------------------------------------------- */

    element.appendChild(
        content
    );


    /* -----------------------------------------------------
       Add block to canvas
    ----------------------------------------------------- */

    canvas.appendChild(
        element
    );


    /* -----------------------------------------------------
       Select newly created element
    ----------------------------------------------------- */

    selectElement(
        element
    );


    /* -----------------------------------------------------
       Save undo / redo history
    ----------------------------------------------------- */

    saveHistory();


    /* -----------------------------------------------------
       Status
    ----------------------------------------------------- */

    if (typeof updateStatus === "function") {

        updateStatus(
            `${type.charAt(0).toUpperCase() + type.slice(1)} added`
        );

    }

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

    if (!content) {
        return;
    }

    const computed =
        getComputedStyle(content);

    const fontSize =
        parseInt(
            computed.fontSize
        ) || 14;

    const letterSpacing =
        parseFloat(
            computed.letterSpacing
        ) || 0;

    const lineHeight =
        computed.lineHeight === "normal"
            ? 1.4
            : parseFloat(
                computed.lineHeight
            ) || 1.4;

    const padding =
        parseInt(
            computed.paddingTop
        ) || 0;

    const margin =
        parseInt(
            computed.marginTop
        ) || 0;

    const radius =
        parseInt(
            computed.borderRadius
        ) || 0;

    const textColor =
        rgbToHex(
            computed.color
        );

    const backgroundColor =
        rgbToHex(
            computed.backgroundColor
        );

    const fontWeight =
        computed.fontWeight;

    const fontStyle =
        computed.fontStyle;

    const decoration =
        computed.textDecorationLine;


    $("#propertiesPanel").innerHTML = `

        <!-- =============================================
             ELEMENT
        ============================================== -->

        <div class="property-section">

            <div class="property-title">
                Element
            </div>

            <div class="property-type">
                ${type.toUpperCase()}
            </div>

        </div>


        <!-- =============================================
             CONTENT
        ============================================== -->

        <div class="property-section">

            <label>
                Content
            </label>

            <textarea
                id="propertyContent"
                rows="4"
            >${escapeHTML(
                content.innerText
            )}</textarea>

        </div>


        <!-- =============================================
             FONT FAMILY
        ============================================== -->

        <div class="property-section">

            <label>
                Font Family
            </label>

            <select
                id="fontFamilyInput"
            >

                <option
                    value="Arial, sans-serif"
                >
                    Arial
                </option>

                <option
                    value="Helvetica, sans-serif"
                >
                    Helvetica
                </option>

                <option
                    value="Verdana, sans-serif"
                >
                    Verdana
                </option>

                <option
                    value="Georgia, serif"
                >
                    Georgia
                </option>

                <option
                    value="Times New Roman, serif"
                >
                    Times New Roman
                </option>

                <option
                    value="Courier New, monospace"
                >
                    Courier New
                </option>

                <option
                    value="Trebuchet MS, sans-serif"
                >
                    Trebuchet MS
                </option>

            </select>

        </div>


        <!-- =============================================
             FONT SIZE
        ============================================== -->

        <div class="property-section">

            <label>
                Font Size
            </label>

            <div class="stepper">

                <button
                    type="button"
                    data-text-action="decrease"
                >
                    −
                </button>

                <input
                    type="number"
                    id="fontSizeInput"
                    min="6"
                    max="120"
                    value="${fontSize}"
                >

                <button
                    type="button"
                    data-text-action="increase"
                >
                    +
                </button>

            </div>

        </div>


        <!-- =============================================
             TEXT FORMATTING
        ============================================== -->

        <div class="property-section">

            <label>
                Formatting
            </label>

            <div class="text-format-grid">

                <button
                    type="button"
                    class="text-format-btn ${
                        fontWeight >= 600
                            ? "active"
                            : ""
                    }"
                    data-text-action="bold"
                    title="Bold"
                >
                    B
                </button>

                <button
                    type="button"
                    class="text-format-btn ${
                        fontStyle === "italic"
                            ? "active"
                            : ""
                    }"
                    data-text-action="italic"
                    title="Italic"
                >
                    I
                </button>

                <button
                    type="button"
                    class="text-format-btn ${
                        decoration.includes(
                            "underline"
                        )
                            ? "active"
                            : ""
                    }"
                    data-text-action="underline"
                    title="Underline"
                >
                    U
                </button>

                <button
                    type="button"
                    class="text-format-btn"
                    data-text-action="reset"
                    title="Reset"
                >
                    ↺
                </button>

            </div>

        </div>


        <!-- =============================================
             TEXT COLOR
        ============================================== -->

        <div class="property-section">

            <label>
                Text Color
            </label>

            <div class="color-control">

                <input
                    type="color"
                    id="textColorInput"
                    value="${textColor}"
                >

                <div
                    class="color-value"
                    id="textColorValue"
                >
                    ${textColor.toUpperCase()}
                </div>

            </div>

        </div>


        <!-- =============================================
             BACKGROUND COLOR
        ============================================== -->

        <div class="property-section">

            <label>
                Background Color
            </label>

            <div class="color-control">

                <input
                    type="color"
                    id="backgroundColorInput"
                    value="${backgroundColor}"
                >

                <div class="color-value">
                    ${backgroundColor.toUpperCase()}
                </div>

            </div>

        </div>


        <!-- =============================================
             ALIGNMENT
        ============================================== -->

        <div class="property-section">

            <label>
                Alignment
            </label>

            <div class="alignment-grid">

                <button
                    type="button"
                    class="align-btn ${
                        computed.textAlign === "left"
                            ? "active"
                            : ""
                    }"
                    data-text-action="align-left"
                >
                    ⬅
                </button>

                <button
                    type="button"
                    class="align-btn ${
                        computed.textAlign === "center"
                            ? "active"
                            : ""
                    }"
                    data-text-action="align-center"
                >
                    ↔
                </button>

                <button
                    type="button"
                    class="align-btn ${
                        computed.textAlign === "right"
                            ? "active"
                            : ""
                    }"
                    data-text-action="align-right"
                >
                    ➡
                </button>

            </div>

        </div>


        <!-- =============================================
             LETTER SPACING
        ============================================== -->

        <div class="property-section">

            <label>
                Letter Spacing
            </label>

            <div class="range-row">

                <input
                    type="range"
                    id="letterSpacingInput"
                    min="-2"
                    max="10"
                    step="0.5"
                    value="${letterSpacing}"
                >

                <span
                    class="range-value"
                    id="letterSpacingValue"
                >
                    ${letterSpacing}px
                </span>

            </div>

        </div>


        <!-- =============================================
             LINE HEIGHT
        ============================================== -->

        <div class="property-section">

            <label>
                Line Height
            </label>

            <div class="range-row">

                <input
                    type="range"
                    id="lineHeightInput"
                    min="0.8"
                    max="3"
                    step="0.1"
                    value="${lineHeight}"
                >

                <span
                    class="range-value"
                    id="lineHeightValue"
                >
                    ${lineHeight}
                </span>

            </div>

        </div>


        <!-- =============================================
             SPACING
        ============================================== -->

        <div class="property-section">

            <label>
                Spacing
            </label>

            <div class="property-two-column">

                <div>

                    <label>
                        Padding
                    </label>

                    <input
                        type="number"
                        id="paddingInput"
                        min="0"
                        max="100"
                        value="${padding}"
                    >

                </div>


                <div>

                    <label>
                        Margin
                    </label>

                    <input
                        type="number"
                        id="marginInput"
                        min="0"
                        max="100"
                        value="${margin}"
                    >

                </div>

            </div>

        </div>


        <!-- =============================================
             BORDER RADIUS
        ============================================== -->

        <div class="property-section">

            <label>
                Border Radius
            </label>

            <div class="range-row">

                <input
                    type="range"
                    id="radiusInput"
                    min="0"
                    max="100"
                    step="1"
                    value="${radius}"
                >

                <span
                    class="range-value"
                    id="radiusValue"
                >
                    ${radius}px
                </span>

            </div>

        </div>


        <!-- =============================================
             ACTIONS
        ============================================== -->

        <div class="property-section">

            <div class="property-actions">

                <button
                    type="button"
                    class="property-action-btn"
                    data-text-action="reset"
                >
                    Reset Style
                </button>

                <button
                    type="button"
                    class="property-action-btn danger"
                    id="propertyDeleteBtn"
                >
                    Delete
                </button>

            </div>

        </div>

    `;


    /* =====================================================
       FONT FAMILY VALUE
    ===================================================== */

    const fontFamilyInput =
        $("#fontFamilyInput");

    if (fontFamilyInput) {

        fontFamilyInput.value =
            computed.fontFamily;

    }


    /* =====================================================
       RANGE LIVE VALUES
    ===================================================== */

    const letterInput =
        $("#letterSpacingInput");

    const letterValue =
        $("#letterSpacingValue");

    if (letterInput && letterValue) {

        letterInput.addEventListener(
            "input",
            function () {

                letterValue.textContent =
                    this.value + "px";

            }
        );

    }


    const lineInput =
        $("#lineHeightInput");

    const lineValue =
        $("#lineHeightValue");

    if (lineInput && lineValue) {

        lineInput.addEventListener(
            "input",
            function () {

                lineValue.textContent =
                    this.value;

            }
        );

    }


    const radiusInput =
        $("#radiusInput");

    const radiusValue =
        $("#radiusValue");

    if (radiusInput && radiusValue) {

        radiusInput.addEventListener(
            "input",
            function () {

                radiusValue.textContent =
                    this.value + "px";

            }
        );

    }


    /* =====================================================
       DELETE FROM PROPERTY PANEL
    ===================================================== */

    const deleteButton =
        $("#propertyDeleteBtn");

    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function () {

                if (
                    typeof deleteSelected ===
                    "function"
                ) {

                    deleteSelected();

                }

            }
        );

    }


    /* =====================================================
       OLD PROPERTY EVENTS
    ===================================================== */

    bindPropertyEvents(
        element,
        content
    );

}


/* =========================================================
   PROPERTY EVENTS
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

/* =========================================================
   PROPERTY EVENTS
   PART 3 — PARAGRAPH + HEADING
========================================================= */

function bindPropertyEvents(
    element,
    content
) {

    if (!element || !content) {
        return;
    }


    /* =====================================================
       CONTENT
    ===================================================== */

    const contentInput =
        $("#propertyContent");

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


    /* =====================================================
       FONT FAMILY
    ===================================================== */

    const fontFamilyInput =
        $("#fontFamilyInput");

    if (fontFamilyInput) {

        fontFamilyInput.addEventListener(
            "change",
            () => {

                content.style.fontFamily =
                    fontFamilyInput.value;

                saveHistory();

            }
        );

    }


    /* =====================================================
       FONT SIZE
    ===================================================== */

    const fontSizeInput =
        $("#fontSizeInput");


    function setFontSize(value) {

        let size =
            parseInt(value, 10);


        if (
            Number.isNaN(size)
        ) {
            size = 14;
        }


        size =
            Math.max(
                6,
                Math.min(
                    120,
                    size
                )
            );


        content.style.fontSize =
            size + "px";


        if (fontSizeInput) {
            fontSizeInput.value =
                size;
        }


        saveHistory();

    }


    if (fontSizeInput) {

        fontSizeInput.addEventListener(
            "input",
            () => {

                setFontSize(
                    fontSizeInput.value
                );

            }
        );

    }


    /* =====================================================
       FONT SIZE + / -
    ===================================================== */

    $$(
        '[data-text-action="increase"]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const current =
                    parseInt(
                        getComputedStyle(
                            content
                        ).fontSize,
                        10
                    ) || 14;


                setFontSize(
                    current + 1
                );

            }
        );

    });


    $$(
        '[data-text-action="decrease"]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const current =
                    parseInt(
                        getComputedStyle(
                            content
                        ).fontSize,
                        10
                    ) || 14;


                setFontSize(
                    current - 1
                );

            }
        );

    });


    /* =====================================================
       TEXT COLOR
    ===================================================== */

    const colorInput =
        $("#textColorInput");


    if (colorInput) {

        colorInput.addEventListener(
            "input",
            () => {

                content.style.color =
                    colorInput.value;


                const value =
                    $("#textColorValue");


                if (value) {

                    value.textContent =
                        colorInput.value
                            .toUpperCase();

                }


                saveHistory();

            }
        );

    }


    /* =====================================================
       BACKGROUND COLOR
    ===================================================== */

    const backgroundInput =
        $("#backgroundColorInput");


    if (backgroundInput) {

        backgroundInput.addEventListener(
            "input",
            () => {

                content.style.backgroundColor =
                    backgroundInput.value;


                saveHistory();

            }
        );

    }


    /* =====================================================
       BOLD
    ===================================================== */

    const boldButton =
        document.querySelector(
            '[data-text-action="bold"]'
        );


    if (boldButton) {

        boldButton.addEventListener(
            "click",
            () => {

                const current =
                    getComputedStyle(
                        content
                    ).fontWeight;


                const isBold =
                    parseInt(
                        current,
                        10
                    ) >= 600;


                content.style.fontWeight =
                    isBold
                        ? "400"
                        : "700";


                boldButton.classList.toggle(
                    "active",
                    !isBold
                );


                saveHistory();

            }
        );

    }


    /* =====================================================
       ITALIC
    ===================================================== */

    const italicButton =
        document.querySelector(
            '[data-text-action="italic"]'
        );


    if (italicButton) {

        italicButton.addEventListener(
            "click",
            () => {

                const isItalic =
                    getComputedStyle(
                        content
                    ).fontStyle === "italic";


                content.style.fontStyle =
                    isItalic
                        ? "normal"
                        : "italic";


                italicButton.classList.toggle(
                    "active",
                    !isItalic
                );


                saveHistory();

            }
        );

    }


    /* =====================================================
       UNDERLINE
    ===================================================== */

    const underlineButton =
        document.querySelector(
            '[data-text-action="underline"]'
        );


    if (underlineButton) {

        underlineButton.addEventListener(
            "click",
            () => {

                const decoration =
                    getComputedStyle(
                        content
                    ).textDecorationLine;


                const isUnderline =
                    decoration.includes(
                        "underline"
                    );


                content.style.textDecoration =
                    isUnderline
                        ? "none"
                        : "underline";


                underlineButton.classList.toggle(
                    "active",
                    !isUnderline
                );


                saveHistory();

            }
        );

    }


    /* =====================================================
       ALIGNMENT
    ===================================================== */

    const alignmentActions = [
        "left",
        "center",
        "right"
    ];


    alignmentActions.forEach(
        alignment => {

            const button =
                document.querySelector(
                    `[data-text-action="align-${alignment}"]`
                );


            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                () => {

                    content.style.textAlign =
                        alignment;


                    $$(
                        ".align-btn"
                    ).forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    saveHistory();

                }
            );

        }
    );


    /* =====================================================
       LETTER SPACING
    ===================================================== */

    const letterInput =
        $("#letterSpacingInput");


    const letterValue =
        $("#letterSpacingValue");


    if (letterInput) {

        letterInput.addEventListener(
            "input",
            () => {

                const value =
                    parseFloat(
                        letterInput.value
                    ) || 0;


                content.style.letterSpacing =
                    value + "px";


                if (letterValue) {

                    letterValue.textContent =
                        value + "px";

                }


                saveHistory();

            }
        );

    }


    /* =====================================================
       LINE HEIGHT
    ===================================================== */

    const lineInput =
        $("#lineHeightInput");


    const lineValue =
        $("#lineHeightValue");


    if (lineInput) {

        lineInput.addEventListener(
            "input",
            () => {

                const value =
                    parseFloat(
                        lineInput.value
                    ) || 1.4;


                content.style.lineHeight =
                    value;


                if (lineValue) {

                    lineValue.textContent =
                        value;

                }


                saveHistory();

            }
        );

    }


    /* =====================================================
       PADDING
    ===================================================== */

    const paddingInput =
        $("#paddingInput");


    if (paddingInput) {

        paddingInput.addEventListener(
            "input",
            () => {

                const value =
                    Math.max(
                        0,
                        parseInt(
                            paddingInput.value,
                            10
                        ) || 0
                    );


                content.style.padding =
                    value + "px";


                saveHistory();

            }
        );

    }


    /* =====================================================
       MARGIN
    ===================================================== */

    const marginInput =
        $("#marginInput");


    if (marginInput) {

        marginInput.addEventListener(
            "input",
            () => {

                const value =
                    Math.max(
                        0,
                        parseInt(
                            marginInput.value,
                            10
                        ) || 0
                    );


                content.style.margin =
                    value + "px";


                saveHistory();

            }
        );

    }


    /* =====================================================
       BORDER RADIUS
    ===================================================== */

    const radiusInput =
        $("#radiusInput");


    const radiusValue =
        $("#radiusValue");


    if (radiusInput) {

        radiusInput.addEventListener(
            "input",
            () => {

                const value =
                    Math.max(
                        0,
                        parseInt(
                            radiusInput.value,
                            10
                        ) || 0
                    );


                content.style.borderRadius =
                    value + "px";


                if (radiusValue) {

                    radiusValue.textContent =
                        value + "px";

                }


                saveHistory();

            }
        );

    }


    /* =====================================================
       RESET STYLE
    ===================================================== */

    $$(
        '[data-text-action="reset"]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                content.style.fontFamily =
                    "";

                content.style.fontSize =
                    "";

                content.style.fontWeight =
                    "";

                content.style.fontStyle =
                    "";

                content.style.textDecoration =
                    "";

                content.style.color =
                    "";

                content.style.backgroundColor =
                    "";

                content.style.textAlign =
                    "";

                content.style.letterSpacing =
                    "";

                content.style.lineHeight =
                    "";

                content.style.padding =
                    "";

                content.style.margin =
                    "";

                content.style.borderRadius =
                    "";


                saveHistory();


                renderProperties(
                    element
                );

            }
        );

    });

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


    /* =====================================================
       COPY SIGNATURE
    ===================================================== */

    const copyButton =
        $("#copySignatureBtn");


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            copySignature
        );

    }

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
   PROFESSIONAL EMAIL SIGNATURE COPY ENGINE
   WEB → GMAIL / EMAIL CLIENT
========================================================= */

async function copySignature() {

    const canvas =
        $("#signatureCanvas");

    if (!canvas) {
        updateStatus("Signature canvas not found");
        return;
    }


    /* =====================================================
       CLONE EDITOR
    ===================================================== */

    const clone =
        canvas.cloneNode(true);


    /* =====================================================
       REMOVE EDITOR-ONLY ATTRIBUTES
    ===================================================== */

    clone.removeAttribute("id");

    clone.style.transform = "none";
    clone.style.zoom = "1";

    clone
        .querySelectorAll("*")
        .forEach(node => {

            node.classList.remove(
                "selected",
                "professional-link",
                "professional-image"
            );

            node.removeAttribute("tabindex");
            node.removeAttribute("contenteditable");

            node.removeAttribute("data-id");
            node.removeAttribute("data-type");
            node.removeAttribute(
                "data-click-handler-installed"
            );

        });


    /* =====================================================
       INLINE ALL COMPUTED STYLES
    ===================================================== */

    const originalNodes =
        canvas.querySelectorAll("*");

    const clonedNodes =
        clone.querySelectorAll("*");


    const styleProperties = [

        "display",
        "position",

        "width",
        "height",

        "min-width",
        "min-height",

        "max-width",
        "max-height",

        "box-sizing",

        "margin",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",

        "padding",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",

        "font-family",
        "font-size",
        "font-weight",
        "font-style",
        "font-variant",

        "line-height",
        "letter-spacing",

        "color",

        "background",
        "background-color",
        "background-image",
        "background-repeat",
        "background-position",
        "background-size",

        "text-align",
        "text-decoration",
        "text-transform",

        "vertical-align",
        "white-space",

        "border",
        "border-width",
        "border-style",
        "border-color",
        "border-radius",

        "overflow",

        "opacity",

        "float",

        "word-break",
        "word-wrap",

        "text-indent",

        "vertical-align"

    ];


    originalNodes.forEach(
        (original, index) => {

            const cloned =
                clonedNodes[index];

            if (!cloned) {
                return;
            }


            const computed =
                window.getComputedStyle(
                    original
                );


            styleProperties.forEach(
                property => {

                    const value =
                        computed.getPropertyValue(
                            property
                        );

                    if (
                        value &&
                        value !== "initial"
                    ) {

                        cloned.style.setProperty(
                            property,
                            value
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       CLEAN IMAGES
    ===================================================== */

    clone
        .querySelectorAll("img")
        .forEach(image => {

            const width =
                image.getAttribute("width") ||
                image.style.width;

            const height =
                image.getAttribute("height") ||
                image.style.height;


            image.style.display =
                "block";

            image.style.border =
                image.style.border ||
                "0";

            image.style.outline =
                "none";

            image.style.textDecoration =
                "none";

            image.style.maxWidth =
                image.style.maxWidth ||
                "100%";


            if (width) {

                image.setAttribute(
                    "width",
                    parseInt(width, 10) || width
                );

            }


            if (height && height !== "auto") {

                image.setAttribute(
                    "height",
                    parseInt(height, 10) || height
                );

            }


            image.removeAttribute("loading");
            image.removeAttribute("draggable");

        });


    /* =====================================================
       CONVERT IMAGE HYPERLINKS
    ===================================================== */

    clone
        .querySelectorAll("img")
        .forEach(image => {

            const imageLink =
                image.dataset.link;

            if (!imageLink) {
                return;
            }


            const wrapper =
                document.createElement("a");


            wrapper.href =
                ensureHttps(
                    imageLink
                );


            const target =
                image.dataset.linkTarget === "same"
                    ? "_self"
                    : "_blank";


            wrapper.target =
                target;


            if (
                target === "_blank"
            ) {

                wrapper.rel =
                    "noopener noreferrer";

            }


            wrapper.style.display =
                "inline-block";

            wrapper.style.textDecoration =
                "none";

            wrapper.style.border =
                "0";

            wrapper.style.outline =
                "none";


            image.parentNode.insertBefore(
                wrapper,
                image
            );


            wrapper.appendChild(
                image
            );

        });


    /* =====================================================
       CLEAN NORMAL LINKS
    ===================================================== */

    clone
        .querySelectorAll("a")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (href) {

                link.href =
                    ensureHttps(href);

            }


            link.style.textDecoration =
                link.style.textDecoration ||
                "none";


            link.style.border =
                link.style.border ||
                "0";


            link.style.outline =
                "none";


            link.removeAttribute(
                "data-url"
            );

            link.removeAttribute(
                "data-target"
            );

        });


    /* =====================================================
       REMOVE EDITOR DATA
    ===================================================== */

    clone
        .querySelectorAll("*")
        .forEach(node => {

            node.removeAttribute(
                "data-src"
            );

            node.removeAttribute(
                "data-link"
            );

            node.removeAttribute(
                "data-link-target"
            );

            node.removeAttribute(
                "data-file-name"
            );

            node.removeAttribute(
                "data-file-type"
            );

            node.removeAttribute(
                "data-file-size"
            );

        });


    /* =====================================================
       EMAIL-SAFE BLOCK STRUCTURE
    ===================================================== */

    const blocks =
        Array.from(
            clone.children
        );


    let rows = "";


    blocks.forEach((block, index) => {

    const originalBlock =
        canvas.children[index];

    const computed =
        originalBlock
            ? window.getComputedStyle(
                originalBlock
              )
            : null;


    const blockHTML =
        block.innerHTML;


    if (!blockHTML.trim()) {
        return;
    }


    rows += `
<tr>
<td
    valign="top"
    style="
        padding:${computed?.padding || "0"};
        margin:0;
        vertical-align:${computed?.verticalAlign || "top"};
        text-align:${computed?.textAlign || "left"};
        font-family:${computed?.fontFamily || "Arial, sans-serif"};
    "
>
${blockHTML}
</td>
</tr>
`;

});


        const blockHTML =
            block.innerHTML;


        if (!blockHTML.trim()) {
            return;
        }


        rows += `
<tr>
<td
    valign="top"
    style="
        padding:${computed.padding || "0"};
        margin:0;
        vertical-align:${computed.verticalAlign || "top"};
        text-align:${computed.textAlign || "left"};
        font-family:${computed.fontFamily || "Arial, sans-serif"};
    "
>
${blockHTML}
</td>
</tr>
`;

    });


    /* =====================================================
       FINAL EMAIL TABLE
    ===================================================== */

    const html = `
<table
    cellpadding="0"
    cellspacing="0"
    border="0"
    role="presentation"
    width="100%"
    style="
        border-collapse:collapse;
        border-spacing:0;
        margin:0;
        padding:0;
    "
>
<tbody>
${rows}
</tbody>
</table>
`.trim();


    /* =====================================================
       PLAIN TEXT FALLBACK
    ===================================================== */

    const plainText =
        canvas.innerText
            .replace(
                /\n{3,}/g,
                "\n\n"
            )
            .trim();


    /* =====================================================
       MODERN CLIPBOARD
    ===================================================== */

    try {

        if (
            navigator.clipboard &&
            window.ClipboardItem
        ) {

            const item =
                new ClipboardItem({

                    "text/html":
                        new Blob(
                            [html],
                            {
                                type:
                                    "text/html"
                            }
                        ),

                    "text/plain":
                        new Blob(
                            [plainText],
                            {
                                type:
                                    "text/plain"
                            }
                        )

                });


            await navigator.clipboard.write([
                item
            ]);


            updateStatus(
                "Signature copied successfully"
            );


            return;

        }

    }
    catch (error) {

        console.warn(
            "Modern clipboard failed:",
            error
        );

    }


    /* =====================================================
       FALLBACK
    ===================================================== */

    copySignatureFallback(
        html,
        plainText
    );

}


/* =========================================================
   COPY FALLBACK
========================================================= */

function copySignatureFallback(
    html,
    plainText = ""
) {

    const container =
        document.createElement(
            "div"
        );


    container.innerHTML =
        html;


    container.contentEditable =
        "true";


    container.style.position =
        "fixed";

    container.style.left =
        "-100000px";

    container.style.top =
        "0";

    container.style.width =
        "1px";

    container.style.height =
        "1px";

    container.style.opacity =
        "0";

    container.style.pointerEvents =
        "none";


    document.body.appendChild(
        container
    );


    const range =
        document.createRange();


    range.selectNodeContents(
        container
    );


    const selection =
        window.getSelection();


    selection.removeAllRanges();

    selection.addRange(
        range
    );


    let success = false;


    try {

        success =
            document.execCommand(
                "copy"
            );

    }
    catch (error) {

        console.error(
            "Fallback copy failed:",
            error
        );

    }


    selection.removeAllRanges();

    container.remove();


    if (success) {

        updateStatus(
            "Signature copied successfully"
        );

    }
    else {

        updateStatus(
            "Copy failed — please allow clipboard access"
        );

    }

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
      
      function ensureHttps(url) {

    const value =
        String(url || "").trim();

    if (!value) {
        return "#";
    }

    if (
        /^(https?:|mailto:|tel:|sms:)/i.test(value)
    ) {
        return value;
    }

    if (/^www\./i.test(value)) {
        return "https://" + value;
    }

    return "https://" + value;
}

/* =========================================================
   PROFESSIONAL LINK + IMAGE ENGINE
   v2
========================================================= */

(function(){
function installProfessionalMediaLinkEngine(){

    App.pendingImageType = "image";

    function safe(value){
        return escapeHTML(value == null ? "" : value);
    }


    function makeId(prefix="element"){
        return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2,7);
    }

    function createBlock(type){
        const element = document.createElement("div");
        element.className = "signature-block";
        element.dataset.id = makeId(type);
        element.dataset.type = type;
        element.setAttribute("tabindex", "0");
        return element;
    }

    function styleBase(content){
        content.classList.add("element-content");
        content.style.boxSizing = "border-box";
    }

    function createLinkElement(type="link"){
        const element = createBlock(type);
        const link = document.createElement("a");
        styleBase(link);
        link.className = "element-content professional-link";
        link.textContent = type === "button" ? "Visit Website" : "Click Here";
        link.href = "https://example.com";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.dataset.url = link.href;
        link.dataset.target = "blank";

        if (type === "button") {
            Object.assign(link.style, {
                display:"inline-block",
                padding:"10px 18px",
                background:"#111827",
                color:"#ffffff",
                textDecoration:"none",
                borderRadius:"8px",
                fontWeight:"700",
                lineHeight:"1.2"
            });
        } else {
            Object.assign(link.style, {
                color:"#2563eb",
                textDecoration:"underline",
                fontWeight:"600"
            });
        }

        element.appendChild(link);
        return element;
    }

    function createImageElement(src="", type="image"){
        const element = createBlock(type);
        const image = document.createElement("img");
        image.className = "element-content professional-image";
        image.alt = type === "logo" ? "Logo" : type === "banner" ? "Banner" : "Image";
        image.src = src || "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="180" viewBox="0 0 520 180"><rect width="520" height="180" rx="18" fill="#f3f4f6"/><text x="260" y="92" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="22" fill="#6b7280">${type.toUpperCase()} • Upload Image</text></svg>`
        );
        image.style.display = "block";
        image.style.maxWidth = "100%";
        image.style.width = type === "banner" ? "520px" : type === "logo" ? "160px" : "260px";
        image.style.height = "auto";
        image.style.borderRadius = "8px";
        image.dataset.src = src || "";
        element.appendChild(image);
        return element;
    }

    function addProfessionalElement(type){
        const canvas = $("#signatureCanvas");
        let element;

        if (type === "link" || type === "button") {
            element = createLinkElement(type);
        } else if (type === "image" || type === "logo" || type === "banner") {
            App.pendingImageType = type;
            $("#imageInput").click();
            return;
        } else {
            return null;
        }

        canvas.appendChild(element);
        selectElement(element);
        saveHistory();
        return element;
    }

    // Replace the original element factory only for professional media/link types.
    const originalAddElement = window.addElement;
    window.addElement = function(type){
        if (["link","button","image","logo","banner"].includes(type)) {
            return addProfessionalElement(type);
        }
        return originalAddElement(type);
    };

    // Prevent accidental navigation while the editor canvas is active.
    const canvas = $("#signatureCanvas");
    if (canvas && !canvas.dataset.professionalLinkGuard) {
        canvas.dataset.professionalLinkGuard = "1";
        canvas.addEventListener("click", function(event){
            const anchor = event.target.closest("a");
            if (anchor && anchor.closest(".signature-block")) {
                event.preventDefault();
            }
        }, true);
    }

    window.handleImageUpload = function(event){
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        const type = App.pendingImageType || "image";
        const reader = new FileReader();
        reader.onload = function(e){
            const element = createImageElement(e.target.result, type);
            element.querySelector("img").dataset.fileName = file.name;
            element.querySelector("img").dataset.fileType = file.type;
            element.querySelector("img").dataset.fileSize = String(file.size);
            $("#signatureCanvas").appendChild(element);
            selectElement(element);
            saveHistory();
            updateStatus(`${type.toUpperCase()} added`);
            event.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    // Replace quick-action handler so uploaded images use the same engine.
    const imageInput = $("#imageInput");
    if (imageInput) {
        imageInput.removeEventListener("change", handleImageUpload);
        imageInput.addEventListener("change", window.handleImageUpload);
    }

    // Add a professional property renderer on top of the existing generic renderer.
    const originalRenderProperties = window.renderProperties;
    window.renderProperties = function(element){
        const type = element.dataset.type;
        if (["link","button","image","logo","banner"].includes(type)) {
            renderProfessionalProperties(element);
            return;
        }
        return originalRenderProperties(element);
    };

    function renderProfessionalProperties(element){

    const type = element.dataset.type;

    const isLink = type === "link" || type === "button";

    const isMediaPositioned =
        type === "logo" ||
        type === "banner";

    const image = element.querySelector("img");
        const anchor = element.querySelector("a");
        const targetBlank = anchor ? anchor.target === "_blank" : true;
        const content = anchor || image;
        if (!content) return;

        const computed = getComputedStyle(content);
        const text = anchor ? anchor.textContent : "";
        const url = anchor ? (anchor.getAttribute("href") || "") : (image.dataset.link || "");
        const alt = image ? (image.alt || "") : "";
        const width = image ? parseInt(image.getBoundingClientRect().width || image.width || 260,10) : 0;
        const height = image ? parseInt(image.getBoundingClientRect().height || image.height || 0,10) : 0;
        const radius = parseInt(computed.borderRadius,10) || 0;
        const textColor = rgbToHex(computed.color);
        const backgroundColor = rgbToHex(computed.backgroundColor);

        $("#propertiesPanel").innerHTML = `
            <div class="property-section professional-property-head">
                <div class="property-title">Element</div>
                <div class="property-type">${safe(type.toUpperCase())}</div>
            </div>

            ${isLink ? `
            <div class="property-section">
                <label>Link Text</label>
                <input id="proLinkText" type="text" value="${safe(text)}">
            </div>
            <div class="property-section">
                <label>Link URL</label>
                <input id="proLinkUrl" type="url" value="${safe(url)}" placeholder="https://example.com">
            </div>
            <div class="property-section">
                <label class="pro-switch-row">
                    <span>Open in new tab</span>
                    <input id="proLinkTarget" type="checkbox" ${targetBlank ? "checked" : ""}>
                </label>
            </div>
            ` : `
            <div class="property-section">
                <label>Image</label>
                <button type="button" class="property-action-btn" id="proReplaceImage">Replace Image</button>
            </div>
            <div class="property-section">
                <label>Image URL</label>
                <input id="proImageUrl" type="url" value="${safe(image.dataset.src || "")}" placeholder="https://.../image.png">
            </div>
            <div class="property-section">
                <label>Alt Text</label>
                <input id="proImageAlt" type="text" value="${safe(alt)}" placeholder="Describe this image">
            </div>
            <div class="property-section">
                <label>Dimensions</label>
                <div class="property-two-column">
                    <div><label>Width</label><input id="proImageWidth" type="number" min="20" max="1600" value="${width}"></div>
                    <div><label>Height</label><input id="proImageHeight" type="number" min="0" max="1600" value="${height || ""}"></div>
                </div>
            </div>
            <div class="property-section">
                <label>Clickable Image URL</label>
                <input id="proImageLink" type="url" value="${safe(image.dataset.link || "")}" placeholder="https://example.com">
            </div>
            <div class="property-section">
                <label class="pro-switch-row">
                    <span>Open image link in new tab</span>
                    <input id="proImageTarget" type="checkbox" ${image.dataset.linkTarget !== "same" ? "checked" : ""}>
                </label>
            </div>
            `}
            
${isMediaPositioned ? `

<div class="property-section">

    <label>Alignment</label>

    <div class="alignment-grid">

        <button
            type="button"
            class="align-btn"
            data-media-align="left"
        >
            ⬅
        </button>

        <button
            type="button"
            class="align-btn"
            data-media-align="center"
        >
            ↔
        </button>

        <button
            type="button"
            class="align-btn"
            data-media-align="right"
        >
            ➡
        </button>

    </div>

</div>


<div class="property-section">

    <label>Position</label>

    <div class="position-grid">

        <button
            type="button"
            class="position-btn"
            data-media-position="top"
        >
            ↑
        </button>

        <button
            type="button"
            class="position-btn"
            data-media-position="right"
        >
            →
        </button>

        <button
            type="button"
            class="position-btn"
            data-media-position="bottom"
        >
            ↓
        </button>

        <button
            type="button"
            class="position-btn"
            data-media-position="left"
        >
            ←
        </button>

    </div>

</div>

` : ""}

            <div class="property-section">
                <label>Text Color</label>
                <div class="color-control"><input id="proTextColor" type="color" value="${textColor}"><div class="color-value">${textColor.toUpperCase()}</div></div>
            </div>
            <div class="property-section">
                <label>Background</label>
                <div class="color-control"><input id="proBgColor" type="color" value="${backgroundColor}"><div class="color-value">${backgroundColor.toUpperCase()}</div></div>
            </div>
            <div class="property-section">
                <label>Border Radius</label>
                <div class="range-row"><input id="proRadius" type="range" min="0" max="100" value="${radius}"><span class="range-value" id="proRadiusValue">${radius}px</span></div>
            </div>
            <div class="property-section">
                <div class="property-actions">
                    <button type="button" class="property-action-btn" id="proReset">Reset Style</button>
                    <button type="button" class="property-action-btn danger" id="proDelete">Delete</button>
                </div>
            </div>
        `;

        const setAndSave = (fn) => {
            fn();
            saveHistory();
        };
        
        if (isMediaPositioned) {

    /* ==============================
       ALIGNMENT
    ============================== */

    $$("[data-media-align]").forEach(button => {

        button.addEventListener("click", () => {

            const alignment =
                button.dataset.mediaAlign;

            image.style.display = "block";

            if (alignment === "left") {

                image.style.marginLeft = "0";
                image.style.marginRight = "auto";

            }

            if (alignment === "center") {

                image.style.marginLeft = "auto";
                image.style.marginRight = "auto";

            }

            if (alignment === "right") {

                image.style.marginLeft = "auto";
                image.style.marginRight = "0";

            }

            $$("[data-media-align]").forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            saveHistory();

        });

    });


    /* ==============================
       POSITION
    ============================== */

    $$("[data-media-position]").forEach(button => {

        button.addEventListener("click", () => {

            const position =
                button.dataset.mediaPosition;

            const block =
                element;

            if (position === "top") {

                block.style.marginTop = "0";
                block.style.marginBottom = "auto";

            }

            if (position === "right") {

                block.style.marginLeft = "auto";
                block.style.marginRight = "0";

            }

            if (position === "bottom") {

                block.style.marginTop = "auto";
                block.style.marginBottom = "0";

            }

            if (position === "left") {

                block.style.marginLeft = "0";
                block.style.marginRight = "auto";

            }

            $$("[data-media-position]").forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            saveHistory();

        });

    });

}

        if (isLink) {
            $("#proLinkText").addEventListener("input", e => setAndSave(() => anchor.textContent = e.target.value));
            $("#proLinkUrl").addEventListener("input", e => setAndSave(() => { anchor.href = ensureHttps(e.target.value); anchor.dataset.url = e.target.value; }));
            $("#proLinkTarget").addEventListener("change", e => setAndSave(() => {
                anchor.target = e.target.checked ? "_blank" : "_self";
                anchor.rel = e.target.checked ? "noopener noreferrer" : "";
            }));
        } else {
            $("#proReplaceImage").addEventListener(
    "click",
    () => {

        App.pendingImageType = type;

        App.replaceImageTarget =
            element;

        const currentImageInput =
            $("#imageInput");

        if (currentImageInput) {

            currentImageInput.value =
                "";

            currentImageInput.click();

        }

    }
);
            $("#proImageUrl").addEventListener("change", e => setAndSave(() => {
                const value = e.target.value.trim();
                if (value) { image.src = value; image.dataset.src = value; }
            }));
            $("#proImageAlt").addEventListener("input", e => setAndSave(() => image.alt = e.target.value));
            $("#proImageWidth").addEventListener("input", e => setAndSave(() => image.style.width = Math.max(20, Number(e.target.value)||20) + "px"));
            $("#proImageHeight").addEventListener("input", e => setAndSave(() => image.style.height = Number(e.target.value) > 0 ? Number(e.target.value)+"px" : "auto"));
            $("#proImageLink").addEventListener(
    "input",
    e => {

        const url =
            e.target.value.trim();

        image.dataset.link =
            url;

        image.dataset.linkTarget =
            image.dataset.linkTarget || "blank";

        saveHistory();

    }
);
            $("#proImageTarget").addEventListener("change", e => setAndSave(() => image.dataset.linkTarget = e.target.checked ? "blank" : "same"));
        
        
        /* =====================================================
   CLICKABLE IMAGE
===================================================== */

if (
    !image.dataset.clickHandlerInstalled
) {

    image.addEventListener(
        "click",
        function(event) {

            const url =
                image.dataset.link;

            if (!url) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();


            const finalUrl =
                ensureHttps(url);


            if (
    image.dataset.linkTarget === "same"
) {

    window.location.href =
        finalUrl;

} else {

    const link =
        document.createElement("a");

    link.href =
        finalUrl;

    link.target =
        "_blank";

    link.rel =
        "noopener noreferrer";

    document.body.appendChild(link);

    link.click();

    link.remove();

}

        }
    );


    image.dataset.clickHandlerInstalled =
        "1";

}

}

        $("#proTextColor").addEventListener("input", e => setAndSave(() => content.style.color = e.target.value));
        $("#proBgColor").addEventListener("input", e => setAndSave(() => content.style.backgroundColor = e.target.value));
        $("#proRadius").addEventListener("input", e => {
            $("#proRadiusValue").textContent = e.target.value + "px";
            setAndSave(() => content.style.borderRadius = e.target.value + "px");
        });
        $("#proDelete").addEventListener("click", deleteSelected);
        $("#proReset").addEventListener("click", () => {
            if (isLink) {
                anchor.style.fontSize = "";
                anchor.style.fontWeight = type === "button" ? "700" : "600";
                anchor.style.fontStyle = "";
                anchor.style.letterSpacing = "";
                anchor.style.lineHeight = "1.2";
                anchor.style.borderRadius = type === "button" ? "8px" : "";
            } else {
                image.style.borderRadius = "8px";
                image.style.height = "auto";
            }
            saveHistory();
            renderProfessionalProperties(element);
        });
    }

    // Replace image while keeping the selected element and all metadata.
    const originalHandleImageUpload = window.handleImageUpload;
    window.handleImageUpload = function(event){
        const target = App.replaceImageTarget;
        if (!target) return originalHandleImageUpload(event);
        const file = event.target.files && event.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = function(e){
            const image = target.querySelector("img");
            if (image) {
                image.src = e.target.result;
                image.dataset.src = e.target.result;
                image.dataset.fileName = file.name;
                image.dataset.fileType = file.type;
                image.dataset.fileSize = String(file.size);
            }
            App.replaceImageTarget = null;
            event.target.value = "";
            selectElement(target);
            saveHistory();
            updateStatus("Image replaced");
        };
        reader.readAsDataURL(file);
    };

    // Rebuild the hidden input so old change handlers cannot fire twice.
    if (imageInput && imageInput.parentNode) {
        const freshInput = imageInput.cloneNode(true);
        imageInput.parentNode.replaceChild(freshInput, imageInput);
        freshInput.addEventListener("change", window.handleImageUpload);
    }

    // Add the professional media/link types without disturbing existing text elements.
    $$(".element-btn").forEach(button => {
        const type = button.dataset.element;
        if (!["link","button","image","logo","banner"].includes(type)) return;
        button.onclick = function(event){
            event.preventDefault();
            addProfessionalElement(type);
        };
    });

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installProfessionalMediaLinkEngine);
} else {
    installProfessionalMediaLinkEngine();
}
})();