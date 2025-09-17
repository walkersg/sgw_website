// Custom JavaScript for Seth Walker's Personal Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initializePage();
    
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
    
    // Add scroll animations
    addScrollAnimations();
    
    // Add navbar scroll effect
    addNavbarScrollEffect();
    
    // Load research statistics
    loadResearchStatistics();
    
    // Initialize citation popup (only on research page)
    if (document.querySelector('.cite-btn')) {
        initializeCitationPopup();
    }
});

function initializePage() {
    // Add loaded class to body for page transitions
    document.body.classList.add('loaded');
    
    // Initialize tooltips if Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

function addSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function addScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Add fade-in class to sections (except hero section and page-header)
    document.querySelectorAll('section').forEach(section => {
        if (!section.classList.contains('hero-section') && !section.classList.contains('page-header')) {
            section.classList.add('fade-in');
        }
    });
    
}

function addNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility function to format dates
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Add loading states for buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    
    return function removeLoadingState() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Contact form handling (if you add a contact form later)
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const removeLoading = addLoadingState(submitButton, 'Sending...');
    
    // Simulate form submission
    setTimeout(() => {
        removeLoading();
        alert('Thank you for your message! I\'ll get back to you soon.');
        form.reset();
    }, 2000);
}

// Add click tracking for analytics (placeholder)
function trackClick(element, action) {
    console.log(`Tracked: ${action} on ${element}`);
    // Add your analytics tracking code here
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
});

// Add print styles
function addPrintStyles() {
    const printStyles = `
        @media print {
            .navbar, .hero-buttons, .contact-links, footer {
                display: none !important;
            }
            
            body {
                font-size: 12pt;
                line-height: 1.4;
            }
            
            .container {
                max-width: none !important;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
}

// Initialize print styles
addPrintStyles();

// Add error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Add performance monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// Load research statistics from JSON file
function loadResearchStatistics() {
    fetch('assets/researchdata.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate the statistics
            document.getElementById('articles-count').textContent = data.researchArticles;
            document.getElementById('chapters-count').textContent = data.researchChapters;
            document.getElementById('citations-count').textContent = data.citations;
            document.getElementById('h-index').textContent = data['h-index'];
            
            // Add animation to the numbers
            animateNumbers();
        })
        .catch(error => {
            console.error('Error loading research statistics:', error);
            // Fallback values if JSON fails to load
            document.getElementById('articles-count').textContent = '10';
            document.getElementById('chapters-count').textContent = '2';
            document.getElementById('citations-count').textContent = '98';
            document.getElementById('h-index').textContent = '5';
        });
}

// Animate the numbers when they load
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 50; // 50 steps for smooth animation
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentValue);
            }
        }, 30); // 30ms intervals
    });
}

// Citation popup functionality
function initializeCitationPopup() {
    // Add event listeners to all cite buttons
    document.querySelectorAll('.cite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openCitationModal(this);
        });
    });
    
    // Add event listener to format radio buttons
    document.querySelectorAll('input[name="citationFormat"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateCitationText();
        });
    });
    
    // Add event listener to copy button
    const copyBtn = document.getElementById('copyCitationBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCitationToClipboard);
    }
}

function openCitationModal(button) {
    // Get publication data from button attributes
    const title = button.getAttribute('data-title');
    const authors = button.getAttribute('data-authors');
    const journal = button.getAttribute('data-journal');
    const year = button.getAttribute('data-year');
    const doi = button.getAttribute('data-doi');
    
    // Store data globally for use in other functions
    window.currentCitation = {
        title: title,
        authors: authors,
        journal: journal,
        year: year,
        doi: doi
    };
    
    // Update citation text with default format (APA)
    updateCitationText();
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('citationModal'));
    modal.show();
}

function updateCitationText() {
    if (!window.currentCitation) return;
    
    const format = document.querySelector('input[name="citationFormat"]:checked').value;
    const citationText = generateCitation(window.currentCitation, format);
    
    document.getElementById('citationText').value = citationText;
}

function generateCitation(data, format) {
    const { title, authors, journal, year, doi } = data;
    
    switch (format) {
        case 'apa':
            return `${authors} (${year}). ${title}. ${journal}. https://doi.org/${doi}`;
        
        case 'mla':
            return `${authors}. "${title}." ${journal}, ${year}, https://doi.org/${doi}.`;
        
        case 'chicago':
            return `${authors}. "${title}." ${journal} (${year}). https://doi.org/${doi}.`;
        
        default:
            return `${authors} (${year}). ${title}. ${journal}. https://doi.org/${doi}`;
    }
}

function copyCitationToClipboard() {
    const citationText = document.getElementById('citationText');
    const copySuccess = document.getElementById('copySuccess');
    
    // Select and copy the text
    citationText.select();
    citationText.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        
        // Show success message
        copySuccess.style.display = 'inline';
        setTimeout(() => {
            copySuccess.style.display = 'none';
        }, 2000);
        
        // Change button text temporarily
        const copyBtn = document.getElementById('copyCitationBtn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check me-1"></i>Copied!';
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-success');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('btn-success');
            copyBtn.classList.add('btn-primary');
        }, 1500);
        
    } catch (err) {
        console.error('Failed to copy citation: ', err);
        alert('Failed to copy citation. Please select and copy manually.');
    }
}

// Export functions for use in other scripts
window.SGWWebsite = {
    formatDate,
    truncateText,
    addLoadingState,
    trackClick,
    loadResearchStatistics,
    initializeCitationPopup
};
