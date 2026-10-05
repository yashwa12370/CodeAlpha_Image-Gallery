// ==================================================
// GET HTML ELEMENTS
// ==================================================

const gallery = document.getElementById("gallery");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const searchInput =
    document.getElementById("searchInput");
const imageCount = 
    document.getElementById("imageCount");


// Upload elements

const uploadModal =
    document.getElementById("uploadModal");

const openUpload =
    document.getElementById("openUpload");

const closeUpload =
    document.getElementById("closeUpload");

const imageInput =
    document.getElementById("imageInput");

const fileName =
    document.getElementById("fileName");

const titleInput =
    document.getElementById("titleInput");

const categoryInput =
    document.getElementById("categoryInput");

const addImageBtn =
    document.getElementById("addImageBtn");


// Lightbox elements

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const closeBtn =
    document.getElementById("closeBtn");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");


// ==================================================
// VARIABLES
// ==================================================

let currentCategory = "all";

let currentIndex = 0;

let selectedImage = null;


// ==================================================
// LOCAL STORAGE
// ==================================================

let savedImages =
    JSON.parse(
        localStorage.getItem("myGalleryImages")
    ) || [];


// ==================================================
// CATEGORY NAMES
// ==================================================

function getCategoryName(category) {

    const categories = {

        nature: "🌿 Nature",

        flowers: "🌸 Flowers",

        animals: "🐾 Animals",

        city: "🏙️ City",

        travel: "✈️ Travel",

        food: "🍰 Food"

    };

    return categories[category] || "Image";
}


// ==================================================
// CREATE USER IMAGE CARD
// ==================================================

function createImageCard(imageData) {

    const item =
        document.createElement("article");

    item.className =
        "gallery-item";


    item.dataset.category =
        imageData.category;


    item.dataset.title =
        imageData.title;


    // User uploaded image
    item.dataset.uploaded =
        "true";


    item.dataset.id =
        imageData.id;


    // Image
    const image =
        document.createElement("img");

    image.src =
        imageData.image;

    image.alt =
        imageData.title;


    // Overlay
    const overlay =
        document.createElement("div");

    overlay.className =
        "overlay";


    const heading =
        document.createElement("h3");

    heading.textContent =
        imageData.title;


    const category =
        document.createElement("span");

    category.textContent =
        getCategoryName(
            imageData.category
        );


    overlay.appendChild(heading);

    overlay.appendChild(category);


    // Delete button
    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "delete-image";

    deleteButton.textContent =
        "🗑️";

    deleteButton.title =
        "Delete image";


    deleteButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            deleteUploadedImage(
                imageData.id
            );

        }
    );


    item.appendChild(image);

    item.appendChild(overlay);

    item.appendChild(deleteButton);

    gallery.appendChild(item);
}


// ==================================================
// LOAD SAVED IMAGES
// ==================================================

function loadSavedImages() {

    savedImages.forEach(function(image) {

        createImageCard(image);

    });
}


// ==================================================
// GET ALL GALLERY ITEMS
// ==================================================

function getGalleryItems() {

    return Array.from(
        document.querySelectorAll(
            ".gallery-item"
        )
    );
}


// ==================================================
// FILTER IMAGES
// ==================================================

function filterImages() {

    const items =
        getGalleryItems();


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    let visibleCount = 0;


    items.forEach(function(item) {

        const category =
            item.dataset.category;


        const title =
            item.dataset.title
                .toLowerCase();


        const categoryMatch =
            currentCategory === "all" ||
            category === currentCategory;


        const searchMatch =
            title.includes(searchText);


        if (
            categoryMatch &&
            searchMatch
        ) {

            item.style.display =
                "block";

            visibleCount++;

        } else {

            item.style.display =
                "none";

        }

    });


    imageCount.textContent =
        visibleCount;
}


// ==================================================
// FILTER BUTTONS
// ==================================================

filterButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            filterButtons.forEach(
                function(btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            currentCategory =
                button.dataset.filter;


            filterImages();

        }
    );

});


// ==================================================
// SEARCH
// ==================================================

searchInput.addEventListener(
    "input",
    filterImages
);


// ==================================================
// OPEN UPLOAD MODAL
// ==================================================

openUpload.addEventListener(
    "click",
    function() {

        uploadModal.classList.add(
            "show"
        );

    }
);


// ==================================================
// CLOSE UPLOAD MODAL
// ==================================================

closeUpload.addEventListener(
    "click",
    function() {

        uploadModal.classList.remove(
            "show"
        );

    }
);


// ==================================================
// SELECT IMAGE
// ==================================================

imageInput.addEventListener(
    "change",
    function() {

        if (imageInput.files.length > 0) {

            selectedImage =
                imageInput.files[0];


            fileName.textContent =
                selectedImage.name;

        }

    }
);


// ==================================================
// ADD IMAGE
// ==================================================

addImageBtn.addEventListener(
    "click",
    function() {

        if (!selectedImage) {

            alert(
                "Please choose an image first."
            );

            return;

        }


        let title =
            titleInput.value.trim();


        if (title === "") {

            title =
                "My Beautiful Image";

        }


        const category =
            categoryInput.value;


        // Maximum 2 MB
        if (
            selectedImage.size >
            2 * 1024 * 1024
        ) {

            alert(
                "Please choose an image smaller than 2MB."
            );

            return;

        }


        // Convert image into Base64
        const reader =
            new FileReader();


        reader.onload =
            function() {

                const imageData = {

                    id: Date.now(),

                    image:
                        reader.result,

                    title:
                        title,

                    category:
                        category

                };


                // Add to array
                savedImages.push(
                    imageData
                );


                // Save permanently
                localStorage.setItem(
                    "myGalleryImages",
                    JSON.stringify(
                        savedImages
                    )
                );


                // Add card to gallery
                createImageCard(
                    imageData
                );


                // Reset form
                selectedImage = null;

                imageInput.value = "";

                titleInput.value = "";

                fileName.textContent =
                    "No image selected";


                // Close modal
                uploadModal.classList.remove(
                    "show"
                );


                // Show All category
                currentCategory =
                    "all";


                filterButtons.forEach(
                    function(button) {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                document
                    .querySelector(
                        '[data-filter="all"]'
                    )
                    .classList.add("active");


                searchInput.value = "";


                filterImages();

            };


        reader.readAsDataURL(
            selectedImage
        );

    }
);


// ==================================================
// DELETE UPLOADED IMAGE
// ==================================================

function deleteUploadedImage(id) {

    const confirmDelete =
        confirm(
            "Do you want to delete this image?"
        );


    if (!confirmDelete) {

        return;

    }


    // Remove from array
    savedImages =
        savedImages.filter(
            function(image) {

                return image.id !== id;

            }
        );


    // Update localStorage
    localStorage.setItem(
        "myGalleryImages",
        JSON.stringify(
            savedImages
        )
    );


    // Remove from page
    const item =
        document.querySelector(
            `.gallery-item[data-id="${id}"]`
        );


    if (item) {

        item.remove();

    }


    filterImages();
}


// ==================================================
// GET VISIBLE IMAGES
// ==================================================

function getVisibleItems() {

    return getGalleryItems().filter(
        function(item) {

            return item.style.display !== "none";

        }
    );
}


// ==================================================
// GALLERY CLICK
// ==================================================

gallery.addEventListener(
    "click",
    function(event) {

        const item =
            event.target.closest(
                ".gallery-item"
            );


        if (!item) {

            return;

        }


        openLightbox(item);

    }
);


// ==================================================
// OPEN LIGHTBOX
// ==================================================

function openLightbox(item) {

    const visibleItems =
        getVisibleItems();


    currentIndex =
        visibleItems.indexOf(item);


    if (currentIndex === -1) {

        return;

    }


    showLightboxImage();


    lightbox.classList.add(
        "show"
    );
}


// ==================================================
// SHOW LIGHTBOX IMAGE
// ==================================================

function showLightboxImage() {

    const visibleItems =
        getVisibleItems();


    if (visibleItems.length === 0) {

        return;

    }


    const item =
        visibleItems[currentIndex];


    const image =
        item.querySelector("img");


    lightboxImage.src =
        image.src;


    lightboxImage.alt =
        image.alt;


    lightboxTitle.textContent =
        item.dataset.title;
}


// ==================================================
// NEXT BUTTON
// ==================================================

nextBtn.addEventListener(
    "click",
    function() {

        const visibleItems =
            getVisibleItems();


        if (visibleItems.length === 0) {

            return;

        }


        currentIndex++;


        if (
            currentIndex >=
            visibleItems.length
        ) {

            currentIndex = 0;

        }


        showLightboxImage();

    }
);


// ==================================================
// PREVIOUS BUTTON
// ==================================================

prevBtn.addEventListener(
    "click",
    function() {

        const visibleItems =
            getVisibleItems();


        if (visibleItems.length === 0) {

            return;

        }


        currentIndex--;


        if (currentIndex < 0) {

            currentIndex =
                visibleItems.length - 1;

        }


        showLightboxImage();

    }
);


// ==================================================
// CLOSE LIGHTBOX
// ==================================================

closeBtn.addEventListener(
    "click",
    function() {

        lightbox.classList.remove(
            "show"
        );

    }
);


// ==================================================
// CLICK OUTSIDE LIGHTBOX
// ==================================================

lightbox.addEventListener(
    "click",
    function(event) {

        if (
            event.target === lightbox
        ) {

            lightbox.classList.remove(
                "show"
            );

        }

    }
);


// ==================================================
// KEYBOARD CONTROLS
// ==================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !lightbox.classList.contains(
                "show"
            )
        ) {

            return;

        }


        // Escape
        if (
            event.key === "Escape"
        ) {

            lightbox.classList.remove(
                "show"
            );

        }


        // Right arrow
        if (
            event.key === "ArrowRight"
        ) {

            nextBtn.click();

        }


        // Left arrow
        if (
            event.key === "ArrowLeft"
        ) {

            prevBtn.click();

        }

    }
);


// ==================================================
// START PROJECT
// ==================================================

loadSavedImages();

filterImages();