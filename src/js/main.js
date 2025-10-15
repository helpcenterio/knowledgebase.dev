// Bootstrap 5 uses ES modules and doesn't require jQuery. Import JS if you need dropdowns/collapse etc.
import 'bootstrap/dist/js/bootstrap.bundle.js';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-item > a').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = el.closest('.faq-item');
            if (parent) parent.classList.toggle('is-open');
        });
    });
});