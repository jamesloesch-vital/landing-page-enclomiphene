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
});
