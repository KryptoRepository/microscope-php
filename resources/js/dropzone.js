import Dropzone from "../../node_modules/dropzone";
import { getResource, postData, deleteData } from "./services";

export function initDropzone() {
    const photoField = document.querySelector("#photoDropzone"),
        galleryField = document.querySelector("#galleryDropzone"),
        microPplField = document.querySelector("#microPplDropzone"),
        microXplField = document.querySelector("#microXplDropzone"),
        csrfToken = document.head.querySelector('meta[name="csrf-token"]');

    if (photoField) {
        try {
            const photoDropzone = new Dropzone(photoField, {
                url: photoField.getAttribute("action"),
                uploadMultiple: false,
                maxFiles: 1,
                maxFilesize: 1, // Max filesize in MB
                acceptedFiles: "image/*",
                dictInvalidFileType: "Нельзя загрузить файлы этого типа",
                dictFileTooBig:
                    "Файл слишком большой ({{filesize}}MB). Максимальный размер: {{maxFilesize}}MB.",
                dictMaxFilesExceeded: "Вы не можете загрузить больше файлов",
                addRemoveLinks: true,
                headers: {
                    "X-CSRF-TOKEN": csrfToken.content,
                },
            });
            fillServerPhotos(
                photoDropzone,
                photoField.getAttribute("data-url")
            );

            photoDropzone.on("addedfile", (file) => {
                console.log(`File added: ${file.name}`);
            });

            photoDropzone.on("removedfile", function (file) {
                removeFile(photoField, file);
            });

            photoDropzone.on("error", (file, error) => {
                const elements = document.querySelectorAll(".dz-file-preview");

                for (const element of elements) {
                    const filename =
                        element.querySelectorAll(".dz-filename span")[0]
                            .textContent;
                    const errorMessage = element.querySelectorAll(
                        ".dz-error-message span"
                    )[0];
                }
            });
        } catch (error) {}
    }

    if (galleryField) {
        try {
            const galleryDropzone = new Dropzone(galleryField, {
                url: galleryField.getAttribute("action"),
                // laravel doesn't see file when use PUT
                // method: "put",
                uploadMultiple: false, //Следует ли отправлять несколько файлов в одном запросе
                parallelUploads: 2,
                maxFiles: 10,
                maxFilesize: 1, // Max filesize in MB
                acceptedFiles: "image/*",
                dictInvalidFileType: "Нельзя загрузить файлы этого типа",
                dictFileTooBig:
                    "Файл слишком большой ({{filesize}}MB). Максимальный размер: {{maxFilesize}}MB.",
                dictMaxFilesExceeded: "Вы не можете загрузить больше файлов",
                addRemoveLinks: true,
                headers: {
                    "X-CSRF-TOKEN": csrfToken.content,
                },
            });
            fillServerPhotos(
                galleryDropzone,
                galleryField.getAttribute("data-url")
            );

            galleryDropzone.on("removedfile", function (file) {
                removeFile(galleryField, file);
            });
        } catch (error) {
            console.log(error);
        }
    }

    if (microPplField && microXplField) {
        try {
            createMicroDropzone("#microPplDropzone");
            createMicroDropzone("#microXplDropzone");
        } catch (error) {}
    }

    function createMicroDropzone(id) {
        const dropzone = document.querySelector(id);

        // set the preview element template
        let previewNode = dropzone.querySelector(".dropzone-item");
        previewNode.id = "";
        let previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        const myDropzone = new Dropzone(id, {
            // Make the whole body a dropzone
            url: dropzone.getAttribute("action"), // Set the url for your upload script location
            parallelUploads: 20,
            previewTemplate: previewTemplate,
            maxFiles: 36,
            maxFilesize: 1, // Max filesize in MB
            acceptedFiles: "image/*",
            dictInvalidFileType: "Нельзя загрузить файлы этого типа",
            dictFileTooBig:
                "Файл слишком большой ({{filesize}}MB). Максимальный размер: {{maxFilesize}}MB.",
            dictMaxFilesExceeded: "Вы не можете загрузить больше файлов",
            autoQueue: false, // Make sure the files aren't queued until manually added
            previewsContainer: id + " .dropzone-items", // Define the container to display the previews
            clickable: id + " .dropzone-select", // Define the element that should be used as click trigger to select files.
            headers: {
                "X-CSRF-TOKEN": csrfToken.content,
            },
        });
        fillServerPhotos(myDropzone, dropzone.getAttribute("data-url"));

        myDropzone.on("addedfile", function (file) {
            const dropzoneItems = dropzone.querySelectorAll(".dropzone-item");
            dropzoneItems.forEach((dropzoneItem) => {
                dropzoneItem.style.display = "";
            });
            dropzone.querySelector(".dropzone-upload").style.display =
                "inline-block";
            dropzone.querySelector(".dropzone-remove-all").style.display =
                "inline-block";
        });

        // Update the total progress bar
        myDropzone.on("totaluploadprogress", function (progress) {
            const progressBars = dropzone.querySelectorAll(".progress-bar");
            progressBars.forEach((progressBar) => {
                progressBar.style.width = progress + "%";
            });
        });

        myDropzone.on("sending", function (file) {
            // Show the total progress bar when upload starts
            const progressBars = dropzone.querySelectorAll(".progress-bar");
            progressBars.forEach((progressBar) => {
                progressBar.style.opacity = "1";
            });
        });

        // Hide the total progress bar when nothing's uploading anymore
        myDropzone.on("complete", function (progress) {
            const progressBars = dropzone.querySelectorAll(".dz-complete");

            setTimeout(function () {
                progressBars.forEach((progressBar) => {
                    progressBar.querySelector(".progress-bar").style.opacity =
                        "0";
                    progressBar.querySelector(".progress").style.opacity = "0";
                });
            }, 300);
        });

        // Setup the buttons for all transfers
        dropzone
            .querySelector(".dropzone-upload")
            .addEventListener("click", function () {
                myDropzone.enqueueFiles(
                    myDropzone.getFilesWithStatus(Dropzone.ADDED)
                );
            });

        // Setup the button for remove all files
        dropzone
            .querySelector(".dropzone-remove-all")
            .addEventListener("click", function () {
                dropzone.querySelector(".dropzone-upload").style.display =
                    "none";
                dropzone.querySelector(".dropzone-remove-all").style.display =
                    "none";
                myDropzone.removeAllFiles(true);
            });

        // On all files completed upload
        myDropzone.on("queuecomplete", function (progress) {
            const uploadIcons = dropzone.querySelectorAll(".dropzone-upload");
            uploadIcons.forEach((uploadIcon) => {
                uploadIcon.style.display = "none";
            });
        });

        myDropzone.on("success", function (file) {
            file.uploaded = true;
        });

        // On all files removed
        myDropzone.on("removedfile", function (file) {
            if (file.uploaded) {
                removeFile(dropzone, file);
            }
            if (myDropzone.files.length < 1) {
                dropzone.querySelector(".dropzone-upload").style.display =
                    "none";
                dropzone.querySelector(".dropzone-remove-all").style.display =
                    "none";
            }
        });
    }

    function fillServerPhotos(dropzone, url) {
        getResource(url).then((photos) => {
            for (let i in photos) {
                let mockFile = {
                    name: photos[i].name,
                    size: photos[i].size,
                    uploaded: true,
                };
                dropzone.displayExistingFile(mockFile, photos[i].url);
            }
        });
    }

    function removeFile(dropzoneForm, file) {
        let formData = new FormData();
        formData.append("_method", "delete");
        deleteData(
            dropzoneForm.getAttribute("action") + "&filename=" + file.name,
            formData,
            { "X-CSRF-TOKEN": csrfToken.content }
        ).then((data) => {});
    }
}

export default initDropzone;
