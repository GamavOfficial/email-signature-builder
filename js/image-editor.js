/* =========================================================
   SIGNATURE STUDIO
   PART 3
   ADVANCED IMAGE EDITOR ENGINE
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       STATE
    ===================================================== */

    let currentImage = null;

    let imageHistory = [];

    let historyTimer = null;


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializeImageEditor() {

        document.addEventListener(
            "click",
            handleImageClick
        );

        document.addEventListener(
            "input",
            handleImageInput
        );

        document.addEventListener(
            "change",
            handleImageChange
        );

        enableImageSelection();

        console.log(
            "Part 3 Advanced Image Editor loaded"
        );

    }


    /* =====================================================
       GET SELECTED ELEMENT
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
       GET IMAGE ELEMENT
    ===================================================== */

    function getImageElement(
        element
    ) {

        if (!element) {
            return null;
        }

        return element.querySelector(
            "img"
        );

    }


    /* =====================================================
       IMAGE CLICK
    ===================================================== */

    function handleImageClick(
        event
    ) {

        const actionButton =
            event.target.closest(
                "[data-image-action]"
            );

        if (!actionButton) {
            return;
        }


        const element =
            getSelectedElement();

        if (!element) {
            return;
        }


        const image =
            getImageElement(
                element
            );

        if (!image) {
            return;
        }


        const action =
            actionButton.dataset.imageAction;


        switch (action) {

            case "image-left":

                setImageAlignment(
                    element,
                    "left"
                );

                break;


            case "image-center":

                setImageAlignment(
                    element,
                    "center"
                );

                break;


            case "image-right":

                setImageAlignment(
                    element,
                    "right"
                );

                break;


            case "image-reset":

                resetImage(
                    element,
                    image
                );

                break;


            case "image-duplicate":

                duplicateImage(
                    element
                );

                break;


            case "image-delete":

                deleteImage(
                    element
                );

                break;


            case "image-upload":

                openImagePicker();

                break;

        }


        refreshImageProperties();

        saveImageHistory();

    }


    /* =====================================================
       INPUT
    ===================================================== */

    function handleImageInput(
        event
    ) {

        const target =
            event.target;


        /* -----------------------------------------------
           WIDTH
        ------------------------------------------------ */

        if (
            target.id ===
            "imageWidthInput"
        ) {

            setImageSize(
                "width",
                target.value
            );

        }


        /* -----------------------------------------------
           HEIGHT
        ------------------------------------------------ */

        if (
            target.id ===
            "imageHeightInput"
        ) {

            setImageSize(
                "height",
                target.value
            );

        }


        /* -----------------------------------------------
           BORDER RADIUS
        ------------------------------------------------ */

        if (
            target.id ===
            "imageRadiusInput"
        ) {

            setImageStyle(
                "borderRadius",
                target.value + "px"
            );


            updateImageRangeValue(
                "imageRadiusValue",
                target.value + "px"
            );

        }


        /* -----------------------------------------------
           X POSITION
        ------------------------------------------------ */

        if (
            target.id ===
            "imageXInput"
        ) {

            setImagePosition(
                "left",
                target.value
            );

        }


        /* -----------------------------------------------
           Y POSITION
        ------------------------------------------------ */

        if (
            target.id ===
            "imageYInput"
        ) {

            setImagePosition(
                "top",
                target.value
            );

        }


        /* -----------------------------------------------
           LINK
        ------------------------------------------------ */

        if (
            target.id ===
            "imageLinkInput"
        ) {

            updateImageLink(
                target.value
            );

        }


        saveImageHistory();

    }


    /* =====================================================
       CHANGE
    ===================================================== */

    function handleImageChange(
        event
    ) {

        const target =
            event.target;


        /* -----------------------------------------------
           FILE
        ------------------------------------------------ */

        if (
            target.id ===
            "imageFileInput"
        ) {

            const file =
                target.files &&
                target.files[0];

            if (file) {

                loadImageFile(
                    file
                );

            }

        }


        /* -----------------------------------------------
           LINK
        ------------------------------------------------ */

        if (
            target.id ===
            "imageLinkInput"
        ) {

            updateImageLink(
                target.value
            );

        }

    }


    /* =====================================================
       FILE PICKER
    ===================================================== */

    function openImagePicker() {

        let input =
            document.getElementById(
                "imageFileInput"
            );


        if (!input) {

            input =
                document.createElement(
                    "input"
                );

            input.type =
                "file";

            input.id =
                "imageFileInput";

            input.accept =
                "image/png,image/jpeg,image/gif,image/webp";

            input.style.display =
                "none";


            document.body.appendChild(
                input
            );


            input.addEventListener(
                "change",
                function () {

                    const file =
                        this.files &&
                        this.files[0];

                    if (file) {

                        loadImageFile(
                            file
                        );

                    }

                }
            );

        }


        input.click();

    }


    /* =====================================================
       LOAD IMAGE FILE
    ===================================================== */

    function loadImageFile(
        file
    ) {

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Image file மட்டும் தேர்வு செய்யுங்கள்."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const source =
                    event.target.result;


                const selected =
                    getSelectedElement();


                if (
                    selected &&
                    selected.dataset.type ===
                    "image"
                ) {

                    const image =
                        getImageElement(
                            selected
                        );

                    if (image) {

                        image.src =
                            source;

                        image.dataset.fileName =
                            file.name;

                        image.dataset.fileType =
                            file.type;

                        image.dataset.fileSize =
                            file.size;

                        updateImageMetadata(
                            selected,
                            file
                        );

                        refreshImageProperties();

                        saveImageHistory();

                        return;

                    }

                }


                createImageElement(
                    source,
                    file
                );

            };


        reader.readAsDataURL(
            file
        );

    }


    /* =====================================================
       CREATE IMAGE ELEMENT
    ===================================================== */

    function createImageElement(
        source,
        file
    ) {

        const canvas =
            document.querySelector(
                "#signatureCanvas"
            );


        if (!canvas) {

            console.warn(
                "signatureCanvas not found"
            );

            return;

        }


        const block =
            document.createElement(
                "div"
            );


        block.className =
            "signature-block";


        block.dataset.type =
            "image";


        block.dataset.editable =
            "true";


        block.dataset.imageId =
            "image-" +
            Date.now();


        block.style.position =
            "relative";


        block.style.width =
            "100%";


        block.style.textAlign =
            "left";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            source;


        image.alt =
            file.name ||
            "Signature Image";


        image.dataset.fileName =
            file.name || "";


        image.dataset.fileType =
            file.type || "";


        image.dataset.fileSize =
            file.size || 0;


        image.style.display =
            "block";


        image.style.width =
            "auto";


        image.style.maxWidth =
            "100%";


        image.style.height =
            "auto";


        image.style.objectFit =
            "contain";


        block.appendChild(
            image
        );


        canvas.appendChild(
            block
        );


        selectImageElement(
            block
        );


        updateImageMetadata(
            block,
            file
        );


        saveImageHistory();

    }


    /* =====================================================
       SELECT IMAGE
    ===================================================== */

    function selectImageElement(
        element
    ) {

        document
            .querySelectorAll(
                ".signature-block.selected"
            )
            .forEach(
                function (item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


        element.classList.add(
            "selected"
        );


        currentImage =
            element;


        if (
            typeof App !== "undefined"
        ) {

            App.selectedElement =
                element;

        }


        refreshImageProperties();

    }


    /* =====================================================
       IMAGE SELECTION
    ===================================================== */

    function enableImageSelection() {

        const canvas =
            document.querySelector(
                "#signatureCanvas"
            );


        if (!canvas) {
            return;
        }


        canvas.addEventListener(
            "click",
            function (event) {

                const image =
                    event.target.closest(
                        ".signature-block[data-type='image']"
                    );


                if (!image) {
                    return;
                }


                selectImageElement(
                    image
                );

            }
        );

    }


    /* =====================================================
       SIZE
    ===================================================== */

    function setImageSize(
        property,
        value
    ) {

        const element =
            getSelectedElement();


        if (
            !element ||
            element.dataset.type !==
            "image"
        ) {

            return;

        }


        const image =
            getImageElement(
                element
            );


        if (!image) {
            return;
        }


        const number =
            parseFloat(
                value
            );


        if (
            Number.isNaN(number)
        ) {

            return;

        }


        if (
            property ===
            "width"
        ) {

            image.style.width =
                Math.max(
                    10,
                    number
                ) + "px";

        }


        if (
            property ===
            "height"
        ) {

            image.style.height =
                Math.max(
                    10,
                    number
                ) + "px";

        }


        saveImageHistory();

    }


    /* =====================================================
       IMAGE STYLE
    ===================================================== */

    function setImageStyle(
        property,
        value
    ) {

        const element =
            getSelectedElement();


        if (!element) {
            return;
        }


        const image =
            getImageElement(
                element
            );


        if (!image) {
            return;
        }


        image.style[property] =
            value;

    }


    /* =====================================================
       IMAGE ALIGNMENT
    ===================================================== */

    function setImageAlignment(
        element,
        alignment
    ) {

        if (!element) {
            return;
        }


        if (
            alignment ===
            "left"
        ) {

            element.style.textAlign =
                "left";

            element.style.display =
                "block";

        }


        if (
            alignment ===
            "center"
        ) {

            element.style.textAlign =
                "center";

            element.style.display =
                "block";

        }


        if (
            alignment ===
            "right"
        ) {

            element.style.textAlign =
                "right";

            element.style.display =
                "block";

        }


        element.dataset.imageAlignment =
            alignment;

    }


    /* =====================================================
       IMAGE POSITION
    ===================================================== */

    function setImagePosition(
        property,
        value
    ) {

        const element =
            getSelectedElement();


        if (!element) {
            return;
        }


        const image =
            getImageElement(
                element
            );


        if (!image) {
            return;
        }


        const number =
            parseFloat(
                value
            ) || 0;


        image.style.position =
            "relative";


        image.style[property] =
            number + "px";

    }


    /* =====================================================
       IMAGE LINK
    ===================================================== */

    function updateImageLink(
        url
    ) {

        const element =
            getSelectedElement();


        if (!element) {
            return;
        }


        const image =
            getImageElement(
                element
            );


        if (!image) {
            return;
        }


        if (
            !url.trim()
        ) {

            removeImageLink(
                element
            );

            return;

        }


        let anchor =
            element.querySelector(
                "a.image-link"
            );


        if (!anchor) {

            anchor =
                document.createElement(
                    "a"
                );

            anchor.className =
                "image-link";


            while (
                image.parentNode ===
                element
            ) {

                element.appendChild(
                    anchor
                );

                anchor.appendChild(
                    image
                );

                break;

            }

        }


        anchor.href =
            url.trim();


        anchor.target =
            "_blank";


        anchor.rel =
            "noopener noreferrer";

    }


    /* =====================================================
       REMOVE IMAGE LINK
    ===================================================== */

    function removeImageLink(
        element
    ) {

        const anchor =
            element.querySelector(
                "a.image-link"
            );


        if (!anchor) {
            return;
        }


        const image =
            anchor.querySelector(
                "img"
            );


        if (!image) {
            return;
        }


        element.appendChild(
            image
        );


        anchor.remove();

    }


    /* =====================================================
       DUPLICATE
    ===================================================== */

    function duplicateImage(
        element
    ) {

        if (!element) {
            return;
        }


        const clone =
            element.cloneNode(
                true
            );


        clone.dataset.imageId =
            "image-" +
            Date.now();


        clone.classList.remove(
            "selected"
        );


        element.parentNode.insertBefore(
            clone,
            element.nextSibling
        );


        selectImageElement(
            clone
        );


        saveImageHistory();

    }


    /* =====================================================
       DELETE
    ===================================================== */

    function deleteImage(
        element
    ) {

        if (!element) {
            return;
        }


        element.remove();


        currentImage =
            null;


        if (
            typeof App !== "undefined"
        ) {

            App.selectedElement =
                null;

        }


        if (
            typeof renderProperties ===
            "function"
        ) {

            const panel =
                document.querySelector(
                    "#propertiesPanel"
                );

            if (panel) {

                panel.innerHTML = `
                    <div class="empty-properties">
                        Select an element
                    </div>
                `;

            }

        }


        saveImageHistory();

    }


    /* =====================================================
       RESET IMAGE
    ===================================================== */

    function resetImage(
        element,
        image
    ) {

        if (
            !element ||
            !image
        ) {

            return;

        }


        image.style.width =
            "auto";


        image.style.height =
            "auto";


        image.style.borderRadius =
            "0";


        image.style.position =
            "";


        image.style.left =
            "";


        image.style.top =
            "";


        element.style.textAlign =
            "left";


        element.dataset.imageAlignment =
            "left";


        removeImageLink(
            element
        );


        saveImageHistory();

    }


    /* =====================================================
       METADATA
    ===================================================== */

    function updateImageMetadata(
        element,
        file
    ) {

        if (!element || !file) {
            return;
        }


        element.dataset.fileName =
            file.name;


        element.dataset.fileType =
            file.type;


        element.dataset.fileSize =
            file.size;


        element.dataset.imageFormat =
            getImageFormat(
                file
            );

    }


    function getImageFormat(
        file
    ) {

        if (
            !file ||
            !file.type
        ) {

            return "IMAGE";

        }


        if (
            file.type ===
            "image/jpeg"
        ) {

            return "JPG";

        }


        if (
            file.type ===
            "image/png"
        ) {

            return "PNG";

        }


        if (
            file.type ===
            "image/gif"
        ) {

            return "GIF";

        }


        if (
            file.type ===
            "image/webp"
        ) {

            return "WEBP";

        }


        return "IMAGE";

    }


    /* =====================================================
       RANGE VALUE
    ===================================================== */

    function updateImageRangeValue(
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
       REFRESH PROPERTIES
    ===================================================== */

    function refreshImageProperties() {

        const element =
            getSelectedElement();


        if (!element) {
            return;
        }


        if (
            element.dataset.type !==
            "image"
        ) {

            return;

        }


        if (
            typeof renderImageProperties ===
            "function"
        ) {

            renderImageProperties(
                element
            );

        }

    }


    /* =====================================================
       HISTORY
    ===================================================== */

    function saveImageHistory() {

        clearTimeout(
            historyTimer
        );


        historyTimer =
            setTimeout(
                function () {

                    if (
                        typeof saveHistory ===
                        "function"
                    ) {

                        saveHistory();

                    }

                },
                250
            );

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.ImageEditor = {

        openImagePicker,

        loadImageFile,

        createImageElement,

        selectImageElement,

        setImageSize,

        setImageAlignment,

        setImagePosition,

        updateImageLink,

        duplicateImage,

        deleteImage,

        resetImage

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
            initializeImageEditor
        );

    } else {

        initializeImageEditor();

    }

})();
