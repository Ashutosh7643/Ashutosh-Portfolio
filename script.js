document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. PAGE LOADER INITIALIZATION
  // ==========================================================================
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.visibility = 'hidden';
      }, 500);
    }
  });
  
  // Fallback in case load event takes too long (timeout after 2.5 seconds)
  setTimeout(() => {
    if (loader && loader.style.opacity !== '0') {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.visibility = 'hidden';
      }, 500);
    }
  }, 2500);

  // ==========================================================================
  // 2. SCROLL & STICKY NAVIGATION HEADER
  // ==========================================================================
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // 3. RESPONSIVE MOBILE NAVIGATION MENU
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('nav-links-list');
  const navItems = document.querySelectorAll('.nav-item a');

  if (mobileMenuBtn && navLinks) {
    const toggleMenu = () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          toggleMenu();
        }
      });
    });

    // Close menu when clicking outside of the navbar
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target) && navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  }

  // ==========================================================================
  // 4. TYPEWRITER / HEADLINE ANIMATION
  // ==========================================================================
  const typingElement = document.getElementById('typing-element');
  const roles = [
    "Computer Science Undergraduate",
    "Java Developer",
    "DSA Enthusiast",
    "Aspiring Software Engineer"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40; // Deletion speed
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80; // Standard typing speed
    }

    // Checking boundaries
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at the end of typing
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Brief pause before starting next role
    }

    setTimeout(typeRole, typingSpeed);
  }

  if (typingElement) {
    setTimeout(typeRole, 1000);
  }

  // ==========================================================================
  // 5. INTERACTIVE HERO CANVAS PARTICLES SYSTEM
  // ==========================================================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let numberOfParticles = 70;
    const connectionDistance = 120;
    
    const mouse = {
      x: null,
      y: null,
      radius: 150
    };

    window.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize handler
    function resizeCanvas() {
      const heroSection = document.getElementById('hero');
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
      
      // Adjust density based on width
      if (canvas.width < 768) {
        numberOfParticles = 30;
      } else {
        numberOfParticles = 70;
      }
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.color = 'rgba(88, 166, 255, 0.4)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wall collisions
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Interaction with mouse pointer
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);
          
          if (distance < mouse.radius) {
            // Apply a minor gravity pull towards mouse
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 0.8;
            this.y += (dy / distance) * force * 0.8;
          }
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < connectionDistance) {
            // Line opacity based on proximity
            const opacity = (1 - (distance / connectionDistance)) * 0.15;
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
        
        // Connect to mouse pointer
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particlesArray[a].x - mouse.x;
          const dy = particlesArray[a].y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            const opacity = (1 - (distance / mouse.radius)) * 0.25;
            ctx.strokeStyle = `rgba(88, 166, 255, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    // Event listener and startup
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
  }

  // ==========================================================================
  // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to keep element visual state stable after loading
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // 7. SKILL BAR fill ANIMATION (ON INTERSECT)
  // ==========================================================================
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillsSection = document.getElementById('skills');

  if (skillBars.length > 0 && skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
          });
          skillsObserver.unobserve(skillsSection);
        }
      });
    }, {
      threshold: 0.2
    });

    skillsObserver.observe(skillsSection);
  }

  // ==========================================================================
  // 8. PROJECTS INTERACTIVE CAROUSEL
  // ==========================================================================
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('dots-container');
  
  if (carousel && prevBtn && nextBtn) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Create indicator dots dynamically if needed, or link to static ones
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update dot active styling
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Interactive dot navigation
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        currentIndex = parseInt(e.target.getAttribute('data-index'));
        updateCarousel();
      });
    });

    // Touch support for mobile swipe
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const swipeDistance = startX - endX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          showNext();
        } else {
          showPrev();
        }
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 9. CONTACT FORM VALIDATION & INTERACTIVE STATE
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Select fields
      const nameField = document.getElementById('form-name');
      const emailField = document.getElementById('form-email');
      const subjectField = document.getElementById('form-subject');
      const messageField = document.getElementById('form-message');
      
      // Reset statuses
      formFeedback.className = 'form-status';
      formFeedback.textContent = '';
      
      // Simple validation rules
      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const subject = subjectField.value.trim();
      const message = messageField.value.trim();
      
      let hasError = false;
      let errorMsg = '';

      if (!name || !email || !subject || !message) {
        hasError = true;
        errorMsg = 'Please fill out all the fields in the contact form.';
      } else if (!validateEmail(email)) {
        hasError = true;
        errorMsg = 'Please enter a valid email address.';
      }

      if (hasError) {
        formFeedback.classList.add('error');
        formFeedback.textContent = errorMsg;
        return;
      }

      // Set loading state on submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending message...';

      // Send the email via EmailJS
      const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        reply_to: email
      };

      emailjs.send("service_3tv982m", "template_hol4qjt", templateParams)
        .then(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          
          // Show success feedback
          formFeedback.classList.add('success');
          formFeedback.textContent = `Thank you, ${name}! Your message has been successfully sent. I will get back to you shortly.`;
          
          // Reset inputs
          contactForm.reset();
          
          // Remove success display after 7 seconds
          setTimeout(() => {
            if (formFeedback.classList.contains('success')) {
              formFeedback.style.display = 'none';
              // Reset block display after hiding
              setTimeout(() => {
                formFeedback.className = 'form-status';
                formFeedback.style.display = '';
              }, 500);
            }
          }, 7000);
        })
        .catch((error) => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          
          // Show error feedback
          formFeedback.classList.add('error');
          const errorDetails = error ? (error.text || error.message || JSON.stringify(error)) : "Unknown Error";
          formFeedback.textContent = `Oops! EmailJS Error: ${errorDetails}`;
          console.error("EmailJS Error:", error);
        });
    });

    // Helper email pattern check
    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    }
  }

  // ==========================================================================
  // 10. MOCK RESUME DOWNLOAD CALLBACK
  // ==========================================================================
  const resumeBtn = document.getElementById('resume-download-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Simulating Resume Download: A resume PDF would download here. Please use the contact details below to request a detailed copy!');
    });
  }
});
