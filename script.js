
const cancelAddBook = document.querySelector(".form-buttons #cancel-btn"); 
const addBookBtn = document.getElementById("add-book-btn");
const submitBookBtn = document.getElementById("submit-book-btn");
const formOverlay = document.querySelector(".form-overlay");
const addBookForm = document.querySelector(".add-book");
const library = {};
const STORAGE_KEY = "currentsession";
const bookCover = document.querySelector(".added-book-cover");
const bookCardTemplate = document.querySelector(".added-card");
const libraryContainer = document.querySelector(".hor-cards-cont");

function setupHeartToggle() {
    libraryContainer.addEventListener("click", (event) => {
        const clickedHeart = event.target.closest(".heart-like, .heart-unlike");
        if (!clickedHeart) return;

        const iconGroup = clickedHeart.closest(".card-icons-cont");
        if (!iconGroup) return;

        const heartLike = iconGroup.querySelector(".heart-like");
        const heartUnlike = iconGroup.querySelector(".heart-unlike");

        if (!heartLike || !heartUnlike) return;

        if (clickedHeart.classList.contains("heart-like")) {
            heartLike.classList.add("hidden");
            heartUnlike.classList.remove("hidden");
        } else {
            heartUnlike.classList.add("hidden");
            heartLike.classList.remove("hidden");
        }
    });
}
setupHeartToggle();

/*function BookConstructor () {
        function Book(title, author, isRead) {
        this.title = title;
        this.author = author;
        this.isRead = isRead;
    }

    Book.prototype.info = function() {
        if (this.isRead === "yes") {
            console.log(`${this.title}: already read`);
        } else if (this.isRead === "reading") {
            console.log(`${this.title}: currently reading`);
        } else 
            console.log(`${this.title}: not yet read`);
        ;
    }
    return Book;
}*/

class Book {
    constructor(title, author, isRead, pages = null) {
        this.title = title;
        this.author = author;
        this.isRead = isRead;
        this.pages = pages || null;
    }
    info() {
        if (this.isRead === "yes") {
            alert(`${this.title} has already been read`);
        } else if (this.isRead === 'reading') {
            alert(`${this.title}: currently reading`);
        }   else alert(`${this.title} has not been read`);
    }
}

function hideAddBookForm() {
    addBookForm.classList.add("hidden");
    formOverlay.classList.add("hidden");
}

function cancelForm() {
    cancelAddBook.addEventListener("click", () => {

    hideAddBookForm();
    })  
} 
cancelForm();

formOverlay.addEventListener("click", () => {
    hideAddBookForm();
});


function openAddBookForm() {
    addBookBtn.addEventListener("click", () => {
    clearFormInputs();
    addBookForm.classList.toggle("hidden");
    formOverlay.classList.toggle("hidden");
    });
}
openAddBookForm();


function generateRandomNo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createBook(title, author, isRead, pages) {
    const uniqueBookIdentifier = generateRandomNo();

    library[uniqueBookIdentifier] = new Book(title, author, isRead, pages);
    saveLibrary();
    return uniqueBookIdentifier;
}

function captureBookInput() {
    submitBookBtn.addEventListener("click", (event) => {
        event.preventDefault();

        const title = document.getElementById("title-input").value.trim();
        const author = document.getElementById("author-input").value.trim();
        const isRead = document.getElementById("status-input").value.trim();
        const pages = document.getElementById("pages-input").value.trim();

        const id = createBook(title, author, isRead, pages || null);

        addCardToDom(title, author, id);
        hideAddBookForm();
    })
}
captureBookInput();

function addCardToDom(title, author, id) {
    const newCard = bookCardTemplate.cloneNode(true);
    newCard.classList.remove("hidden");
    newCard.querySelector(".added-book-title").textContent = title;
    newCard.querySelector(".added-book-author").textContent = author;
    newCard.setAttribute("data-book-id", id);
    libraryContainer.prepend(newCard);

    console.log("Book created with ID:", id);
    console.log("Book object:", library[id]);
}

function removeBook(bookId) {
    if (!bookId) return;

    if (library[bookId]) {
        delete library[bookId];
        console.log("Book removed from library:", bookId);
        saveLibrary();
    }

    const card = libraryContainer.querySelector(`[data-book-id="${bookId}"]`);
    if (card) {
        card.remove();
    }
}

const deleteConfirmOverlay = document.getElementById("delete-confirm-overlay");
const deleteConfirmModal = document.getElementById("delete-confirm-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
let pendingDeleteBookId = null;

function hideDeleteConfirmation() {
    deleteConfirmModal.classList.add("hidden");
    deleteConfirmOverlay.classList.add("hidden");
    pendingDeleteBookId = null;
}

function openDeleteConfirmation(bookId) {
    pendingDeleteBookId = bookId;
    deleteConfirmModal.classList.remove("hidden");
    deleteConfirmOverlay.classList.remove("hidden");
}

function setupRemoveBook() {
    libraryContainer.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".del-svg");
        if (!deleteButton) return;

        const card = deleteButton.closest(".added-card");
        if (!card) return;

        const bookId = card.dataset.bookId;
        openDeleteConfirmation(bookId);
    });
}

confirmDeleteBtn.addEventListener("click", () => {
    if (pendingDeleteBookId) {
        removeBook(pendingDeleteBookId);
    }
    hideDeleteConfirmation();
});

cancelDeleteBtn.addEventListener("click", () => {
    hideDeleteConfirmation();
});

deleteConfirmOverlay.addEventListener("click", () => {
    hideDeleteConfirmation();
});

setupRemoveBook();

function clearFormInputs() {
    const titleInput = document.getElementById("title-input");
    const authorInput = document.getElementById("author-input");
    const statusInput = document.getElementById("status-input");

    titleInput.value = "";
    authorInput.value = "";
    statusInput.value = "";
    if (pagesInput) pagesInput.value = "";
}

const infoOverlay = document.getElementById("info-overlay");
const bookInfoModal = document.getElementById("book-info-modal");
const infoModalTitle = document.getElementById("info-modal-title");
const infoModalAuthor = document.getElementById("info-modal-author");
const infoModalStatus = document.getElementById("info-modal-status");
const infoModalPages = document.getElementById("info-modal-pages");

function formatStatus(status) {
    const normalized = (status || "").toString().trim().toLowerCase();

    if (normalized === "yes") return "Read";
    if (normalized === "no") return "Not yet read";
    if (normalized === "reading") return "Currently reading";

    return status || "Not indicated";
}

function hideBookInfoModal() {
    bookInfoModal.classList.add("hidden");
    infoOverlay.classList.add("hidden");
}

function openBookInfoModal(title, author, isRead, pages) {
    infoModalTitle.textContent = title;
    infoModalAuthor.textContent = author;
    infoModalStatus.textContent = formatStatus(isRead);
    infoModalPages.textContent = pages || "Not indicated";

    bookInfoModal.classList.remove("hidden");
    infoOverlay.classList.remove("hidden");
}

function setupBookInfo() {
    libraryContainer.addEventListener("click", (event) => {
        const infoButton = event.target.closest(".info-svg, .info-btn");
        if (!infoButton) return;

        const card = infoButton.closest(".added-card");
        if (!card) return;

        const bookId = card.dataset.bookId;
        const book = bookId ? library[bookId] : null;
        const title = card.querySelector(".added-book-title")?.textContent || "Unknown";
        const author = card.querySelector(".added-book-author")?.textContent || "Unknown";
        const status = book?.isRead || "not indicated";
        const pages = book?.pages || "not indicated";

        openBookInfoModal(title, author, status, pages);
    });
}

infoOverlay.addEventListener("click", () => {
    hideBookInfoModal();
});

setupBookInfo();

function saveLibrary() {
    try {
        // store plain objects (no methods)
        const plain = {};
        Object.keys(library).forEach(id => {
            const b = library[id];
            plain[id] = { title: b.title, author: b.author, isRead: b.isRead, pages: b.pages };
        });
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
    } catch (err) {
        console.error('Failed to save library to storage', err);
    }
}

function loadLibrary() {
    try {
        const data = sessionStorage.getItem(STORAGE_KEY);
        if (!data) return;
        const parsed = JSON.parse(data);
        Object.keys(parsed).forEach(id => {
            const item = parsed[id];
            // recreate Book instances
            library[id] = new Book(item.title, item.author, item.isRead, item.pages || null);
            addCardToDom(item.title, item.author, id);
        });
    } catch (err) {
        console.error('Failed to load library from storage', err);
    }
}

// load persisted books on startup
loadLibrary();

// Edit form functionality
const editForm = document.getElementById("edit-book-form");
const editOverlay = document.getElementById("edit-overlay");
const editCancelBtn = document.getElementById("edit-cancel-btn");
const saveBookBtn = document.getElementById("save-book-btn");
const editTitleInput = document.getElementById("edit-title-input");
const editAuthorInput = document.getElementById("edit-author-input");
const editStatusInput = document.getElementById("edit-status-input");
const pagesInput = document.getElementById("pages-input");
const editPagesInput = document.getElementById("edit-pages-input");

let currentEditingBookId = null;

function hideEditForm() {
    editForm.classList.add("hidden");
    editOverlay.classList.add("hidden");
}

function openEditForm(bookId, title, author, isRead, pages) {
    currentEditingBookId = bookId;
    editTitleInput.value = title;
    editAuthorInput.value = author;
    editStatusInput.value = isRead;
    editPagesInput.value = pages || "";
    editForm.classList.remove("hidden");
    editOverlay.classList.remove("hidden");
}

function setupEditBook() {
    libraryContainer.addEventListener("click", (event) => {
        const editButton = event.target.closest(".edit-btn");
        if (!editButton) return;

        const card = editButton.closest(".added-card");
        if (!card) return;

        const bookId = card.dataset.bookId;
        const title = card.querySelector(".added-book-title").textContent;
        const author = card.querySelector(".added-book-author").textContent;
        const book = library[bookId];
        
        openEditForm(bookId, title, author, book.isRead, book.pages);
    });
}

function saveEditBook() {
    saveBookBtn.addEventListener("click", (event) => {
        event.preventDefault();

        if (!currentEditingBookId) return;

        const newTitle = editTitleInput.value.trim();
        const newAuthor = editAuthorInput.value.trim();
        const newIsRead = editStatusInput.value.trim();
        const newPages = editPagesInput.value.trim();

        // Update library
        library[currentEditingBookId].title = newTitle;
        library[currentEditingBookId].author = newAuthor;
        library[currentEditingBookId].isRead = newIsRead;
        library[currentEditingBookId].pages = newPages || null;
        saveLibrary();

        // Update card
        const card = libraryContainer.querySelector(`[data-book-id="${currentEditingBookId}"]`);
        if (card) {
            card.querySelector(".added-book-title").textContent = newTitle;
            card.querySelector(".added-book-author").textContent = newAuthor;
        }

        hideEditForm();
    });
}

function cancelEditForm() {
    editCancelBtn.addEventListener("click", () => {
        hideEditForm();
    });
}

editOverlay.addEventListener("click", () => {
    hideEditForm();
});

setupEditBook();
saveEditBook();
cancelEditForm();

