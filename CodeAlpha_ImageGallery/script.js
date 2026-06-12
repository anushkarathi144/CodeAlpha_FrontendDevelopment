const searchInput = document.querySelector('.search-box input');
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = Array.from(document.querySelectorAll('.card'));
const noResultsMessage = document.querySelector('.no-results');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const closeButton = lightbox.querySelector('.lightbox-close');
const prevButton = lightbox.querySelector('.lightbox-nav.prev');
const nextButton = lightbox.querySelector('.lightbox-nav.next');
let currentIndex = 0;

const getVisibleCards = () => cards.filter(card => !card.classList.contains('hidden'));

const getActiveCategory = () => document.querySelector('.filter-btn.active').dataset.category;

const updateNoResults = () => {
    const query = searchInput.value.trim().toLowerCase();
    const category = getActiveCategory();
    const visible = getVisibleCards();
    const shouldShow = visible.length === 0 && (query !== '' || category !== 'all');
    noResultsMessage.classList.toggle('hidden', !shouldShow);
};

const setLightbox = (card) => {
    const title = card.dataset.title || card.querySelector('img').alt;
    const author = card.dataset.author || 'Unknown author';
    lightboxImage.src = card.querySelector('img').src;
    lightboxImage.alt = title;
    lightboxCaption.textContent = `${title} — ${author}`;
};

const openLightbox = (card) => {
    const visibleCards = getVisibleCards();
    currentIndex = visibleCards.indexOf(card);
    if (currentIndex === -1) return;
    setLightbox(card);
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden', 'false');
};

const closeLightbox = () => {
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
};

const changeLightbox = (step) => {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;
    currentIndex = (currentIndex + step + visibleCards.length) % visibleCards.length;
    setLightbox(visibleCards[currentIndex]);
};

const searchGallery = () => {
    const query = searchInput.value.trim().toLowerCase();
    cards.forEach((card) => {
        const title = (card.dataset.title || '').toLowerCase();
        const author = (card.dataset.author || '').toLowerCase();
        const category = card.dataset.category.toLowerCase();
        const categoryActive = document.querySelector('.filter-btn.active').dataset.category;
        const matchesCategory = categoryActive === 'all' || category === categoryActive;
        const matchesText = query === '' || title.includes(query) || author.includes(query);
        card.classList.toggle('hidden', !(matchesCategory && matchesText));
    });
    updateNoResults();
};

const filterGallery = (category) => {
    filterButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.category === category);
    });
    const query = searchInput.value.trim().toLowerCase();
    cards.forEach((card) => {
        const title = (card.dataset.title || '').toLowerCase();
        const author = (card.dataset.author || '').toLowerCase();
        const matchesCategory = category === 'all' || card.dataset.category === category;
        const matchesText = query === '' || title.includes(query) || author.includes(query);
        card.classList.toggle('hidden', !(matchesCategory && matchesText));
    });
    updateNoResults();
};

cards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
    const downloadButton = card.querySelector('.download-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const image = card.querySelector('img');
            const link = document.createElement('a');
            link.href = image.src;
            link.download = `${(card.dataset.title || 'image').replace(/\s+/g, '-').toLowerCase()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterGallery(button.dataset.category);
    });
});

searchInput.addEventListener('input', searchGallery);
closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', (event) => {
    event.stopPropagation();
    changeLightbox(-1);
});
nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    changeLightbox(1);
});

lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('visible')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') changeLightbox(-1);
    if (event.key === 'ArrowRight') changeLightbox(1);
});

// Initialize default filter state
filterGallery('all');