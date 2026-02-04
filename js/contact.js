// Contact Form Module
document.addEventListener('DOMContentLoaded', () => {
    const api = new MusicAPI();
    const contactBtn = document.getElementById('contact-nav-btn');
    const contactModal = document.getElementById('contact-modal');
    const contactClose = document.querySelector('.contact-close');
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');
    
    // Open modal
    contactBtn.addEventListener('click', () => {
        contactModal.style.display = 'flex';
    });
    
    // Close modal
    contactClose.addEventListener('click', () => {
        contactModal.style.display = 'none';
        contactForm.reset();
        contactStatus.style.display = 'none';
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
            contactForm.reset();
            contactStatus.style.display = 'none';
        }
    });
    
    // Submit contact form
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        
        try {
            await api.submitContact(name, email, message);
            showStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            setTimeout(() => {
                contactModal.style.display = 'none';
                contactStatus.style.display = 'none';
            }, 3000);
        } catch (error) {
            showStatus(error.message || 'Failed to send message. Please try again.', 'error');
        }
    });
    
    function showStatus(message, type) {
        contactStatus.textContent = message;
        contactStatus.className = `status-message ${type}`;
        contactStatus.style.display = 'block';
    }
});
