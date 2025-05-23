// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Pricing plan dropdown functionality
    const pricingDropdown = document.querySelector('.pricing-plan-dropdown');
    const pricingDisplay = document.querySelector('.checkout-pricing');
    
    if (pricingDropdown && pricingDisplay) {
        const prices = {
            'monthly': {
                amount: 199,
                period: 'month',
                compareWith: null
            },
            'quarterly': {
                amount: 170,
                period: 'month',
                compareWith: {
                    amount: 199,
                    period: 'month'
                }
            },
            'annual': {
                amount: 160,
                period: 'month',
                compareWith: {
                    amount: 170,
                    period: 'month'
                }
            }
        };
        
        // Helper function to update price display with or without strikethrough
        function updatePriceDisplay(price) {
            let html = `$${price.amount}<span>/${price.period}</span>`;
            
            if (price.compareWith) {
                html += `<span class="strikethrough-price">$${price.compareWith.amount}/${price.compareWith.period}</span>`;
            }
            
            pricingDisplay.innerHTML = html;
        }
        
        // Set initial price display to match default selected option (quarterly)
        updatePriceDisplay(prices.quarterly);
        
        pricingDropdown.addEventListener('change', function() {
            const selectedPlan = this.value;
            const priceData = prices[selectedPlan];
            
            if (priceData) {
                updatePriceDisplay(priceData);
            }
        });
    }

    // Marketing Popup Functionality
    const marketingPopup = document.getElementById('marketing-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const emailForm = document.getElementById('email-form');
    let hasScrolled = false;
    let popupShown = false;

    // Function to check if popup has been closed in this session
    function isPopupClosed() {
        return sessionStorage.getItem('popupClosed') === 'true';
    }

    // Function to show popup
    function showPopup() {
        if (!popupShown && !isPopupClosed()) {
            marketingPopup.classList.add('show');
            popupShown = true;
        }
    }

    // Show popup when user scrolls down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200 && !hasScrolled) {
            hasScrolled = true;
            // Slight delay before showing popup
            setTimeout(showPopup, 1000);
        }
    });

    // Close popup when clicking the close button
    closePopupBtn.addEventListener('click', function() {
        marketingPopup.classList.remove('show');
        sessionStorage.setItem('popupClosed', 'true');
    });

    // Handle form submission
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('popup-email').value;
        
        // Send data to CustomerIO - identify the user
        if (typeof _cio !== 'undefined') {
            // Create a unique timestamp for created_at
            const timestamp = Math.floor(Date.now() / 1000);
            
            // Identify the user in CustomerIO
            _cio.identify({
                id: email,
                email: email,
                created_at: timestamp,
                source: 'popup_discount',
                discount_offered: '10%'
            });
            
            // Track the subscription event
            _cio.track('popup_subscribed', {
                discount: '10%',
                page_url: window.location.href,
                page_title: document.title
            });
        }
        
        // Show thank you message
        emailForm.innerHTML = '<p style="font-size: 18px; color: #9A805B;">Thank you! Your discount code has been sent to your email.</p>';
        
        // Close popup after delay
        setTimeout(function() {
            marketingPopup.classList.remove('show');
            sessionStorage.setItem('popupClosed', 'true');
        }, 3000);
    });

    // Benefits Carousel Functionality
    const benefitsData = [
        {
            title: "Build muscle mass",
            description: "Testosterone is crucial for building muscle mass. It helps increase protein synthesis, which promotes muscle growth, and stimulates the release of growth hormone, which stimulates muscle cell proliferation."
        },
        {
            title: "Enhance your love life",
            description: "Your libido is directly linked to your testosterone levels. When testosterone levels are low, you may experience a decrease in sexual desire and performance."
        },
        {
            title: "Improve your energy",
            description: "Higher testosterone levels can lead to increased energy levels, improved mood, and better overall health."
        },
        {
            title: "Boost your focus",
            description: "Your ability to concentrate and stay focused is directly linked to your testosterone levels. When testosterone levels are low, you may experience a decrease in focus and concentration."
        }
    ];

    const benefitTitle = document.querySelector('.benefit-title');
    const benefitDescription = document.querySelector('.benefit-description');
    const benefitSlides = document.querySelectorAll('.benefit-slide');
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    
    let currentSlide = 0;
    let carouselInterval;

    function updateCarousel(slideIndex) {
        // Update active slide
        benefitSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });

        // Update active dot
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });

        // Update text content
        if (benefitTitle && benefitDescription) {
            benefitTitle.textContent = benefitsData[slideIndex].title;
            benefitDescription.textContent = benefitsData[slideIndex].description;
        }

        currentSlide = slideIndex;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % benefitsData.length;
        updateCarousel(nextIndex);
    }

    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    // Initialize carousel if elements exist
    if (benefitSlides.length > 0 && carouselDots.length > 0) {
        updateCarousel(0);
        startCarousel();

        // Add click handlers for dots
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopCarousel();
                updateCarousel(index);
                startCarousel();
            });
        });
    }

    // Testimonials Carousel Functionality
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonials .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentTestimonialSlide = 0;
    let testimonialInterval;

    function updateTestimonialsCarousel(slideIndex) {
        // Calculate transform position
        const translateX = -slideIndex * 25; // 25% per slide since each card is 25% width
        testimonialsTrack.style.transform = `translateX(${translateX}%)`;

        // Update active card
        testimonialCards.forEach((card, index) => {
            card.classList.toggle('active', index === slideIndex);
        });

        // Update active dot
        testimonialDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });

        currentTestimonialSlide = slideIndex;
    }

    function nextTestimonialSlide() {
        const nextIndex = (currentTestimonialSlide + 1) % testimonialCards.length;
        updateTestimonialsCarousel(nextIndex);
    }

    function prevTestimonialSlide() {
        const prevIndex = (currentTestimonialSlide - 1 + testimonialCards.length) % testimonialCards.length;
        updateTestimonialsCarousel(prevIndex);
    }

    function startTestimonialCarousel() {
        testimonialInterval = setInterval(nextTestimonialSlide, 5000); // Auto-advance every 5 seconds
    }

    function stopTestimonialCarousel() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
            testimonialInterval = null;
        }
    }

    // Initialize testimonials carousel if elements exist
    if (testimonialsTrack && testimonialCards.length > 0) {
        updateTestimonialsCarousel(0);
        startTestimonialCarousel();

        // Add click handlers for navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopTestimonialCarousel();
                nextTestimonialSlide();
                startTestimonialCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopTestimonialCarousel();
                prevTestimonialSlide();
                startTestimonialCarousel();
            });
        }

        // Add click handlers for dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopTestimonialCarousel();
                updateTestimonialsCarousel(index);
                startTestimonialCarousel();
            });
        });

        // Pause carousel on hover
        const testimonialsCarousel = document.querySelector('.testimonials-carousel');
        if (testimonialsCarousel) {
            testimonialsCarousel.addEventListener('mouseenter', stopTestimonialCarousel);
            testimonialsCarousel.addEventListener('mouseleave', startTestimonialCarousel);
        }
    }
});
