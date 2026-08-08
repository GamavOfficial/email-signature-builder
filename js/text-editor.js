/* =========================================================
   SIGNATURE STUDIO
   PART 2-C
   ADVANCED TEXT EDITOR ENGINE
========================================================= */

(function () {

    "use strict";


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
            "Part 2-C Advanced Text Editor loaded"
        );

    }


    /* =====================================================
       SELECTED ELEMENT
    ===================================================== */

    function getSelectedElement() {

        if (
            typeof App !== "undefined" &&
            App.selectedElement
        ) {

            return App.selectedElement;

        }

        return document.querySelector(
            ".signature-block.selected"
        );

    }


    /* =====================================================
       CONTENT ELEMENT
    ===================================================== */

    function getContentElement(
        element
    ) {

        if (!element) {
            return null;
        }

        return element.querySelector(
            ".element-content"
        );

    }


    /* =====================================================
       CLICK HANDLER
    ===================================================== */

    function handleEditorClick(event) {

        const control =
            event.target.closest(
                "[data-text-action]"
            );

        if (!control) {
            return;
        }

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

        const action =
            control.dataset.textAction;


        switch (action) {

            case "bold":

                toggleBold(
                    content
                );

                break;


            case "italic":

                toggleItalic(
                    content
                );

                break;


            case "underline":

                toggleUnderline(
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


        refreshProperties(
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


        /* -----------------------------------------------
           CONTENT
        ------------------------------------------------ */

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

            if (!content) {
                return;
            }

            content.textContent =
                target.value;

            saveEditorHistory();

            return;

        }


        /* -----------------------------------------------
           FONT SIZE
        ------------------------------------------------ */

        if (
            target.id ===
            "fontSizeInput"
        ) {

            applyFontSize(
                target.value
            );

        }


        /* -----------------------------------------------
           LETTER SPACING
        ------------------------------------------------ */

        if (
            target.id ===
            "letterSpacingInput"
        ) {

            applyStyle(
                "letterSpacing",
                target.value + "px"
            );

            updateRangeValue(
                "letterSpacingValue",
                target.value + "px"
            );

        }


        /* -----------------------------------------------
           LINE HEIGHT
        ------------------------------------------------ */

        if (
            target.id ===
            "lineHeightInput"
        ) {

            applyStyle(
                "lineHeight",
                target.value
            );

            updateRangeValue(
                "lineHeightValue",
                target.value
            );

        }


        /* -----------------------------------------------
           PADDING
        ------------------------------------------------ */

        if (
            target.id ===
            "paddingInput"
        ) {

            applyStyle(
                "padding",
                target.value + "px"
            );

        }


        /* -----------------------------------------------
           MARGIN
        ------------------------------------------------ */

        if (
            target.id ===
            "marginInput"
        ) {

            applyStyle(
                "margin",
                target.value + "px"
            );

        }


        /* -----------------------------------------------
           BORDER RADIUS
        ------------------------------------------------ */

        if (
            target.id ===
            "radiusInput"
        ) {

            applyStyle(
                "borderRadius",
                target.value + "px"
            );

            updateRangeValue(
                "radiusValue",
                target.value + "px"
            );

        }

    }


    /* =====================================================
       CHANGE HANDLER
    ===================================================== */

    function handleEditorChange(event) {

        const target =
            event.target;


        /* -----------------------------------------------
           FONT FAMILY
        ------------------------------------------------ */

        if (
            target.id ===
            "fontFamilyInput"
        ) {

            applyStyle(
                "fontFamily",
                target.value
            );

        }


        /* -----------------------------------------------
           TEXT COLOR
        ------------------------------------------------ */

        if (
            target.id ===
            "textColorInput"
        ) {

            applyStyle(
                "color",
                target.value
            );

            updateColorValue(
                "textColorValue",
                target.value
            );

        }


        /* -----------------------------------------------
           BACKGROUND COLOR
        ------------------------------------------------ */

        if (
            target.id ===
            "backgroundColorInput"
        ) {

            applyStyle(
                "backgroundColor",
                target.value
            );

        }


        saveEditorHistory();

    }


    /* =====================================================
       FONT SIZE
    ===================================================== */

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

        let size =
            parseFloat(value);

        if (
            Number.isNaN(size)
        ) {

            return;

        }

        size =
            Math.max(
                6,
                Math.min(
                    120,
                    size
                )
            );

        applyStyle(
            "fontSize",
            size + "px"
        );

    }


    /* =====================================================
       BOLD
    ===================================================== */

    function toggleBold(
        element
    ) {

        const current =
            getComputedStyle(
                element
            ).fontWeight;

        if (
            parseInt(current) >= 600
        ) {

            element.style.fontWeight =
                "400";

        } else {

            element.style.fontWeight =
                "700";

        }

    }


    /* =====================================================
       ITALIC
    ===================================================== */

    function toggleItalic(
        element
    ) {

        const current =
            getComputedStyle(
                element
            ).fontStyle;

        if (
            current === "italic"
        ) {

            element.style.fontStyle =
                "normal";

        } else {

            element.style.fontStyle =
                "italic";

        }

    }


    /* =====================================================
       UNDERLINE
    ===================================================== */

    function toggleUnderline(
        element
    ) {

        const current =
            getComputedStyle(
                element
            ).textDecorationLine;

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


    /* =====================================================
       APPLY STYLE
    ===================================================== */

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
       RESET STYLE
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
       DOUBLE CLICK DIRECT EDIT
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

                content.dataset.editing =
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
                    content.dataset.editing ===
                    "true"
                ) {

                    content.contentEditable =
                        "false";

                    content.dataset.editing =
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
       REFRESH PROPERTIES
    ===================================================== */

    function refreshProperties(
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


    /* =====================================================
       RANGE VALUE
    ===================================================== */

    function updateRangeValue(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );

        if (element) {

            element.textContent =
                value;

        }

    }


    /* =====================================================
       COLOR VALUE
    ===================================================== */

    function updateColorValue(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );

        if (element) {

            element.textContent =
                value.toUpperCase();

        }

    }


    /* =====================================================
       HISTORY
    ===================================================== */

    function saveEditorHistory() {

        if (
            typeof saveHistory !==
            "function"
        ) {

            return;

        }

        clearTimeout(
            window.__signatureHistoryTimer
        );

        window.__signatureHistoryTimer =
            setTimeout(
                function () {

                    saveHistory();

                },
                200
            );

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.TextEditor = {

        changeFontSize,

        applyFontSize,

        applyStyle,

        toggleBold,

        toggleItalic,

        toggleUnderline,

        resetTextStyle

    };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeTextEditor
        );

    } else {

        initializeTextEditor();

    }

})();
