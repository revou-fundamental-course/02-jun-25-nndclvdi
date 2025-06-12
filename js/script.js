document.addEventListener('DOMContentLoaded', function() {
    function updateWelcomeMessage() {
        try {
            const userName = prompt("Selamat datang! Siapa nama Anda?");
            if (userName && userName.trim() !== "" && userName.trim() !== "null") {
                const welcomeElement = document.getElementById('welcome-message');
                if (welcomeElement) {
                    welcomeElement.textContent = `Hi ${userName.trim()}, Welcome to SEFC`;
                }
            }
        } catch (error) {
            console.error('Welcome message error:', error);
        }
    }
    
    setTimeout(updateWelcomeMessage, 1000);
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    navLinks.forEach(nl => nl.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    

    const form = document.getElementById('messageForm');
    
    if (!form) {
        console.warn('Form with ID "messageForm" not found');
        return;
    }
    
    function validateName(name) {
        if (!name || name.length < 2) {
            return "Name must be at least 2 characters long";
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return "Name can only contain letters and spaces";
        }
        return "";
    }
    
    function validateEmail(email) {
        if (!email) {
            return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }
        return "";
    }
    
    function validatePhone(phone) {
        if (!phone) {
            return "Phone number is required";
        }
        const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(phone) || cleanPhone.length < 10) {
            return "Please enter a valid phone number (minimum 10 digits)";
        }
        return "";
    }
    
    function validateMessage(message) {
        if (!message || message.length < 10) {
            return "Message must be at least 10 characters long";
        }
        return "";
    }
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    

    const missingElements = [];
    if (!nameInput) missingElements.push('name');
    if (!emailInput) missingElements.push('email');
    if (!phoneInput) missingElements.push('phone');
    if (!messageInput) missingElements.push('message');
    
    if (missingElements.length > 0) {
        console.error('Missing form elements with IDs:', missingElements.join(', '));
        return;
    }
    

    function addValidationListener(input, validator, errorId) {
        if (input) {
            input.addEventListener('blur', function() {
                try {
                    const error = validator(this.value.trim());
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.textContent = error;
                    }
                } catch (err) {
                    console.error(`Validation error for ${errorId}:`, err);
                }
            });
        }
    }
    
    addValidationListener(nameInput, validateName, 'nameError');
    addValidationListener(emailInput, validateEmail, 'emailError');
    addValidationListener(phoneInput, validatePhone, 'phoneError');
    addValidationListener(messageInput, validateMessage, 'messageError');
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim()
            };
            
            const errors = {
                name: validateName(formData.name),
                email: validateEmail(formData.email),
                phone: validatePhone(formData.phone),
                message: validateMessage(formData.message)
            };
            
            function showError(errorId, errorMessage) {
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                }
            }
            
            showError('nameError', errors.name);
            showError('emailError', errors.email);
            showError('phoneError', errors.phone);
            showError('messageError', errors.message);
            
            const hasErrors = Object.values(errors).some(error => error !== "");
            
            if (!hasErrors) {
                displaySubmittedData(formData);
                
                form.reset();
                
                const errorElements = document.querySelectorAll('.error-message');
                errorElements.forEach(error => {
                    error.textContent = '';
                });
                
                alert('Form submitted successfully!');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('An error occurred while submitting the form. Please try again.');
        }
    });
    
    function displaySubmittedData(data) {
        try {
            const displayDiv = document.getElementById('displayData');
            const submittedDiv = document.getElementById('submittedData');
            
            if (displayDiv && submittedDiv) {
                function escapeHtml(text) {
                    const div = document.createElement('div');
                    div.textContent = text;
                    return div.innerHTML;
                }
                
                displayDiv.innerHTML = `
                    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
                    <p><strong>Message:</strong> ${escapeHtml(data.message)}</p>
                    <p><strong>Submitted at:</strong> ${new Date().toLocaleString('id-ID')}</p>
                `;
                
                submittedDiv.style.display = 'block';
                
                // Scroll to the submitted data
                setTimeout(() => {
                    submittedDiv.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            } else {
                console.warn('Display elements not found: displayData or submittedData');
            }
        } catch (error) {
            console.error('Display data error:', error);
        }
    }
    
    let ticking = false;
    
    function updateActiveNav() {
        try {
            const sections = document.querySelectorAll('.section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            if (sections.length === 0 || navLinks.length === 0) {
                return;
            }
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (current && link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        } catch (error) {
            console.error('Update active nav error:', error);
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNav);
            ticking = true;
        }
    });
});

function scrollToSection(sectionId) {
    try {
        if (!sectionId) {
            console.warn('No section ID provided');
            return;
        }
        
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.warn(`Section with ID "${sectionId}" not found`);
        }
    } catch (error) {
        console.error('Scroll error:', error);
    }
}