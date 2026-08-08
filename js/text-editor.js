/* =========================================================
   PART 2
   ADVANCED TEXT EDITOR
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       WAIT FOR APP
    ===================================================== */

    function ready() {

        if (
            typeof App === "undefined"
        ) {

            setTimeout(
                ready,
                100
            );

            return;

        }


        initializeTextEditor();

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializeTextEditor() {

        document.addEventListener(
            "click",
            handleEditorClick
        );


        document.addEventListener(
            "input",
            handleEditorInput
        );


        document.addEventListener(
            "change",
            handleEditorChange
        );


        enableCanvasEditing();


        console.log(
            "Part 2 Text Editor loaded"
        );

    }


    /* =====================================================
       CLICK HANDLER
    ===================================================== */

    function handleEditorClick(event) {

        const button =
            event.target.closest(
                "[data-text-action]"
            );


        if (!button) {

            return;

        }


        const action =
            button.dataset.textAction;


        const element =
            getSelectedElement();


        if (!element) {

            return;

        }


        const content =
            getContentElement(
                element
            );


        if (!content) {

            return;

        }


        switch (action) {

            case "bold":

                toggleStyle(
                    content,
                    "fontWeight",
                    "700",
                    "400"
                );

                break;


            case "italic":

                toggleStyle(
                    content,
                    "fontStyle",
                    "italic",
                    "normal"
                );

                break;


            case "underline":

                toggleDecoration(
                    content
                );

                break;


            case "increase":

                changeFontSize(
                    content,
                    1
                );

                break;


            case "decrease":

                changeFontSize(
                    content,
                    -1
                );

                break;


            case "align-left":

                content.style.textAlign =
                    "left";

                break;


            case "align-center":

                content.style.textAlign =
                    "center";

                break;


            case "align-right":

                content.style.textAlign =
                    "right";

                break;


            case "reset":

                resetTextStyle(
                    content
                );

                break;

        }


        updatePropertyUI(
            element
        );


        saveEditorHistory();

    }


    /* =====================================================
       INPUT HANDLER
    ===================================================== */

    function handleEditorInput(event) {

        const target =
            event.target;


        if (
            target.id ===
            "propertyContent"
        ) {

            const element =
                getSelectedElement();


            if (!element) {

                return;

            }


            const content =
                getContentElement(
                    element
                );


            content.textContent =
                target.value;


            saveEditorHistory();

        }


        if (
            target.id ===
            "fontSizeInput"
        ) {

            applyFontSize(
                target.value
            );

        }


        if (
            target.id ===
            "letterSpacingInput"
        ) {

            applyStyle(
                "letterSpacing",
                target.value + "px"
            );

        }


        if (
            target.id ===
            "lineHeightInput"
        ) {

            applyStyle(
                "lineHeight",
                target.value
            );

        }


        if (
            target.id ===
            "paddingInput"
        ) {

            applyStyle(
                "padding",
                target.value + "px"
            );

        }


        if (
            target.id ===
            "marginInput"
        ) {

            applyStyle(
                "margin",
                target.value + "px"
            );

        }


        if (
            target.id ===
            "radiusInput"
        ) {

            applyStyle(
                "borderRadius",
                target.value + "px"
            );

        }


        updateSelectedProperties();

    }


    /* =====================================================
       CHANGE HANDLER
    ===================================================== */

    function handleEditorChange(event) {

        const target =
            event.target;


        if (
            target.id ===
            "fontFamilyInput"
        ) {

            applyStyle(
                "fontFamily",
                target.value
            );

        }


        if (
            target.id ===
            "textColorInput"
        ) {

            applyStyle(
                "color",
                target.value
            );

            updateColorValue(
                target.value
            );

        }


        if (
            target.id ===
            "backgroundColorInput"
        ) {

            applyStyle(
                "backgroundColor",
                target.value
            );

        }


        if (
            target.id ===
            "textAlignInput"
        ) {

            applyStyle(
                "textAlign",
                target.value
            );

        }


        updateSelectedProperties();

        saveEditorHistory();

    }


    /* =====================================================
       GET SELECTED ELEMENT
    ===================================================== */

    function getSelectedElement() {

        if (
            typeof App !==
            "undefined" &&
            App.selectedElement
        ) {

            return App.selectedElement;

        }


        return document.querySelector(
            ".signature-block.selected"
        );

    }


    /* =====================================================
       GET CONTENT
    ===================================================== */

    function getContentElement(
        element
    ) {

        return element.querySelector(
            ".element-content"
        );

    }


    /* =====================================================
       STYLE HELPERS
    ===================================================== */

    function toggleStyle(
        element,
        property,
        activeValue,
        normalValue
    ) {

        if (
            element.style[property] ===
            activeValue
        ) {

            element.style[property] =
                normalValue;

        } else {

            element.style[property] =
                activeValue;

        }

    }


    function toggleDecoration(
        element
    ) {

        const current =
            element.style.textDecoration;


        if (
            current.includes(
                "underline"
            )
        ) {

            element.style.textDecoration =
                "none";

        } else {

            element.style.textDecoration =
                "underline";

        }

    }


    function changeFontSize(
        element,
        amount
    ) {

        const current =
            parseFloat(
                getComputedStyle(
                    element
                ).fontSize
            ) || 14;


        const next =
            Math.max(
                6,
                Math.min(
                    120,
                    current + amount
                )
            );


        element.style.fontSize =
            next + "px";

    }


    function applyFontSize(
        value
    ) {

        const number =
            parseFloat(value);


        if (
            Number.isNaN(number)
        ) {

            return;

        }


        applyStyle(
            "fontSize",
            Math.max(
                6,
                Math.min(
                    120,
                    number
                )
            ) + "px"
        );

    }


    function applyStyle(
        property,
        value
    ) {

        const element =
            getSelectedElement();


        if (!element) {

            return;

        }


        const content =
            getContentElement(
                element
            );


        if (!content) {

            return;

        }


        content.style[property] =
            value;

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetTextStyle(
        content
    ) {

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

    }


    /* =====================================================
       CANVAS EDITING
    ===================================================== */

    function enableCanvasEditing() {

        const canvas =
            document.querySelector(
                "#signatureCanvas"
            );


        if (!canvas) {

            return;

        }


        canvas.addEventListener(
            "dblclick",
            function (event) {

                const block =
                    event.target.closest(
                        ".signature-block"
                    );


                if (!block) {

                    return;

                }


                const content =
                    block.querySelector(
                        ".element-content"
                    );


                if (!content) {

                    return;

                }


                content.contentEditable =
                    "true";


                content.focus();


                placeCursorAtEnd(
                    content
                );

            }
        );


        canvas.addEventListener(
            "blur",
            function (event) {

                const content =
                    event.target.closest(
                        ".element-content"
                    );


                if (!content) {

                    return;

                }


                if (
                    content.contentEditable ===
                    "true"
                ) {

                    content.contentEditable =
                        "false";

                    saveEditorHistory();

                }

            },
            true
        );

    }


    /* =====================================================
       CURSOR
    ===================================================== */

    function placeCursorAtEnd(
        element
    ) {

        const range =
            document.createRange();


        const selection =
            window.getSelection();


        range.selectNodeContents(
            element
        );


        range.collapse(
            false
        );


        selection.removeAllRanges();

        selection.addRange(
            range
        );

    }


    /* =====================================================
       UPDATE UI
    ===================================================== */

    function updateSelectedProperties() {

        const element =
            getSelectedElement();


        if (!element) {

            return;

        }


        if (
            typeof renderProperties ===
            "function"
        ) {

            renderProperties(
                element
            );

        }

    }


    function updatePropertyUI(
        element
    ) {

        if (
            typeof renderProperties ===
            "function"
        ) {

            renderProperties(
                element
            );

        }

    }


    function updateColorValue(
        color
    ) {

        const display =
            document.querySelector(
                "#textColorValue"
            );


        if (display) {

            display.textContent =
                color.toUpperCase();

        }

    }


    /* =====================================================
       HISTORY
    ===================================================== */

    function saveEditorHistory() {

        if (
            typeof saveHistory ===
            "function"
        ) {

            clearTimeout(
                window.__editorHistoryTimer
            );


            window.__editorHistoryTimer =
                setTimeout(
                    () => {

                        saveHistory();

                    },
                    250
                );

        }

    }


    /* =====================================================
       EXPOSE
    ===================================================== */

    window.TextEditor = {

        changeFontSize,

        applyStyle,

        resetTextStyle,

        updateSelectedProperties

    };


    ready();

})();
