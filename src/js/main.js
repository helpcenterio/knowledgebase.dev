// Import styles so Vite can process them
import '../scss/main.scss';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

// FAQ toggle: vanilla JS (replaces jQuery usage)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-item > a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const faqItem = anchor.closest('.faq-item');
            if (faqItem) faqItem.classList.toggle('is-open');
        });
    });
});