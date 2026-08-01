/* ==========================================================================
   FITNESS 19 HIGH-OCTANE BRUTALIST SCRIPT (2026)
   ========================================================================== */

// CLASS DATABASE
const CLASS_DATABASE = [
    { id: "c1", name: "BEAST MODE CROSSFIT", day: "MON", time: "08:00 AM", coach: "Marcus", intensity: "Beast", spotsTotal: 15, spotsLeft: 3, booked: false },
    { id: "c2", name: "VOLT CYCLING HYPER", day: "MON", time: "06:00 PM", coach: "Zara", intensity: "Medium", spotsTotal: 25, spotsLeft: 12, booked: false },
    { id: "c3", name: "SHREDDING METCON", day: "TUE", time: "09:00 AM", coach: "Sarah", intensity: "Medium", spotsTotal: 20, spotsLeft: 7, booked: false },
    { id: "c4", name: "RAW BOXING STRIKING", day: "TUE", time: "06:30 PM", coach: "Jax", intensity: "Beast", spotsTotal: 12, spotsLeft: 1, booked: false },
    { id: "c5", name: "ACCELERATED HYBRID HIIT", day: "WED", time: "07:00 AM", coach: "Sarah", intensity: "Beast", spotsTotal: 18, spotsLeft: 9, booked: false },
    { id: "c6", name: "ANVIL DEADLIFTS", day: "WED", time: "05:00 PM", coach: "Marcus", intensity: "Beast", spotsTotal: 8, spotsLeft: 2, booked: false },
    { id: "c7", name: "MOBILITY FLOW & CORE", day: "THU", time: "10:00 AM", coach: "Zara", intensity: "Low", spotsTotal: 15, spotsLeft: 14, booked: false },
    { id: "c8", name: "COMBAT CONDITIONING", day: "THU", time: "06:00 PM", coach: "Jax", intensity: "Beast", spotsTotal: 16, spotsLeft: 5, booked: false },
    { id: "c9", name: "METCON ACCELERATION", day: "FRI", time: "08:00 AM", coach: "Sarah", intensity: "Medium", spotsTotal: 22, spotsLeft: 11, booked: false },
    { id: "c10", name: "RAW BENCH PRESS POWER", day: "FRI", time: "04:30 PM", coach: "Marcus", intensity: "Medium", spotsTotal: 10, spotsLeft: 4, booked: false },
    { id: "c11", name: "SPIN ENGINE ROTATION", day: "SAT", time: "09:00 AM", coach: "Zara", intensity: "Medium", spotsTotal: 25, spotsLeft: 18, booked: false },
    { id: "c12", name: "BEAST BOXING SPARRING", day: "SAT", time: "11:00 AM", coach: "Jax", intensity: "Beast", spotsTotal: 12, spotsLeft: 2, booked: false },
    { id: "c13", name: "SUNDAY REHAB FLOW", day: "SUN", time: "10:00 AM", coach: "Zara", intensity: "Low", spotsTotal: 30, spotsLeft: 28, booked: false },
    { id: "c14", name: "PUMP & SHRED MASS", day: "SUN", time: "01:00 PM", coach: "Marcus", intensity: "Beast", spotsTotal: 15, spotsLeft: 6, booked: false }
];

// APP STATE
let activeFilters = {
    day: "ALL",
    coach: "ALL",
    intensity: "ALL"
};

// INITIALIZE APPLICATION
document.addEventListener("DOMContentLoaded", () => {
    // Load booked classes from localStorage
    loadBookedState();

    // Initial render of timeline
    renderSchedule();

    // Event listeners
    setupFilters();
    setupScrollMonitoring();
    setupCardFormInputs();

    // ANIMATION ENHANCEMENTS INITIALIZATIONS
    initSplitTextReveal();
    initMagneticButtons();
    initScrollShapeRotator();
    initStatsCounter();
    
    // Set up mascot scroll listener
    initMascotScroll();

    // Initialize AI Coach Chatbot
    initChatbot();
});

// LOAD & SAVE BOOKING STATE
function loadBookedState() {
    const bookedIds = JSON.parse(localStorage.getItem("f19_booked_classes")) || [];
    CLASS_DATABASE.forEach(cls => {
        if (bookedIds.includes(cls.id)) {
            cls.booked = true;
            cls.spotsLeft = Math.max(0, cls.spotsLeft - 1);
        }
    });
}

function saveBookedState() {
    const bookedIds = CLASS_DATABASE.filter(cls => cls.booked).map(cls => cls.id);
    localStorage.setItem("f19_booked_classes", JSON.stringify(bookedIds));
}

// SCROLL & STICKY DOCK
function setupScrollMonitoring() {
    const nav = document.getElementById("floating-nav");
    
    window.addEventListener("scroll", () => {
        // Nav becomes visible after scrolling past half of hero height
        if (window.scrollY > window.innerHeight * 0.5) {
            nav.classList.add("visible");
        } else {
            nav.classList.remove("visible");
        }
    });
}

function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    
    const offset = 90; // account for floating nav height
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

// FILTERS EVENT BINDINGS
function setupFilters() {
    // Day filter buttons
    const dayButtons = document.querySelectorAll("#day-filters .filter-btn");
    dayButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            dayButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeFilters.day = btn.getAttribute("data-day");
            renderSchedule();
        });
    });

    // Coach Dropdown filter
    const coachSelect = document.getElementById("coach-filter");
    coachSelect.addEventListener("change", (e) => {
        activeFilters.coach = e.target.value;
        renderSchedule();
    });

    // Intensity Dropdown filter
    const intensitySelect = document.getElementById("intensity-filter");
    intensitySelect.addEventListener("change", (e) => {
        activeFilters.intensity = e.target.value;
        renderSchedule();
    });
}

// RENDER CLASS TIMELINE
function renderSchedule() {
    const grid = document.getElementById("schedule-grid");
    grid.innerHTML = ""; // Clear current

    // Filter database
    const filtered = CLASS_DATABASE.filter(cls => {
        const matchesDay = activeFilters.day === "ALL" || cls.day === activeFilters.day;
        const matchesCoach = activeFilters.coach === "ALL" || cls.coach === activeFilters.coach;
        const matchesIntensity = activeFilters.intensity === "ALL" || cls.intensity === activeFilters.intensity;
        return matchesDay && matchesCoach && matchesIntensity;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="brutalist-border" style="grid-column: 1 / -1; padding: 40px; text-align: center; background-color: var(--bg-card);">
                <h3 class="display-font" style="font-size: 2rem; color: var(--neon-pink); margin-bottom: 10px;">NO SQUAD DEPLOYED</h3>
                <p>No classes found matching the selected parameters. Dial down your options or choose another instructor.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(cls => {
        const card = document.createElement("div");
        card.className = `class-card brutalist-border tilt-card-3d ${cls.intensity.toLowerCase()}-mode hover-target-lift`;
        
        // Intensity label badge
        let intensityBadgeClass = "intensity-low";
        let intensityText = "LOW EFFORT";
        if (cls.intensity === "Medium") {
            intensityBadgeClass = "intensity-medium";
            intensityText = "HIGH-OCTANE";
        } else if (cls.intensity === "Beast") {
            intensityBadgeClass = "intensity-beast";
            intensityText = "BEAST MODE";
        }

        // Button state
        const buttonText = cls.booked ? "SPOT SECURED!" : "BOOK SPOT";
        const buttonClass = cls.booked ? "card-book-btn brutalist-btn booked" : "card-book-btn brutalist-btn btn-neon-volt hover-target-join";
        const disabledAttr = cls.booked ? "disabled" : "";

        card.innerHTML = `
            <div class="card-intensity-badge ${intensityBadgeClass}">${intensityText}</div>
            <h3 class="class-title">${cls.name}</h3>
            <div class="class-meta">
                <div><span>TIME:</span> ${cls.time}</div>
                <div><span>DAY:</span> ${cls.day}</div>
                <div><span>COACH:</span> COACH ${cls.coach.toUpperCase()}</div>
                <div><span>AVAILABLE:</span> <span class="spots-count">${cls.spotsLeft}</span> / ${cls.spotsTotal} SPOTS</div>
            </div>
            <button class="${buttonClass}" ${disabledAttr} onclick="bookClass('${cls.id}', this)">${buttonText}</button>
        `;
        grid.appendChild(card);
    });
}

// BOOK CLASS ACTION
function bookClass(classId, buttonEl) {
    const cls = CLASS_DATABASE.find(c => c.id === classId);
    if (!cls || cls.booked) return;

    // Trigger visual booking micro-interaction
    buttonEl.classList.remove("btn-neon-volt", "hover-target-join");
    buttonEl.classList.add("booked");
    buttonEl.innerText = "SECURING SPOT...";
    buttonEl.disabled = true;

    // Reset cursor status
    const cursor = document.getElementById("custom-cursor");
    if (cursor) cursor.className = "custom-cursor";

    // Animate spots number decrease
    const cardEl = buttonEl.closest(".class-card");
    const spotsCountEl = cardEl.querySelector(".spots-count");

    setTimeout(() => {
        cls.booked = true;
        cls.spotsLeft = Math.max(0, cls.spotsLeft - 1);
        spotsCountEl.innerText = cls.spotsLeft;
        buttonEl.innerText = "SPOT SECURED!";
        
        // Flash color border or play micro-vibration
        cardEl.style.borderColor = "var(--neon-volt)";
        setTimeout(() => {
            cardEl.style.borderColor = "var(--border-color)";
        }, 300);

        saveBookedState();
    }, 800);
}

// CHECKOUT DRAWER STATE MANAGEMENT
function openCheckout(tierName) {
    const drawer = document.getElementById("checkout-drawer");
    const tierNameEl = document.getElementById("checkout-tier-name");
    const recurringRateEl = document.getElementById("checkout-recurring-rate");
    const priceEl = document.getElementById("checkout-price");

    // Dynamic invoice pricing updates
    let rate = "$39.00/MO";
    if (tierName === "Basic Shred") {
        rate = "$19.00/MO";
    } else if (tierName === "Beast Platinum") {
        rate = "$59.00/MO";
    }

    tierNameEl.innerText = tierName.toUpperCase();
    recurringRateEl.innerText = rate;
    priceEl.innerText = "$0.00"; // 7-day trial is free today

    // Clear old forms/errors
    document.getElementById("checkout-form").reset();
    document.getElementById("success-screen").classList.remove("active");
    
    // Slide-out animations
    drawer.classList.add("open");
}

function closeCheckout() {
    const drawer = document.getElementById("checkout-drawer");
    drawer.classList.remove("open");
}

// CHECKOUT FORM VALS & HELPERS
function setupCardFormInputs() {
    const cardInput = document.getElementById("checkout-card");
    const expiryInput = document.getElementById("checkout-expiry");
    const cardBrandIndicator = document.getElementById("card-brand");

    // Auto-spacing card numbers
    cardInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        let matches = value.match(/\d{4,16}/g);
        let match = (matches && matches[0]) || "";
        let parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length > 0) {
            e.target.value = parts.join(" ");
        } else {
            e.target.value = value;
        }

        // Card brand indicator
        if (value.startsWith("4")) {
            cardBrandIndicator.innerText = "VISA";
            cardBrandIndicator.style.color = "var(--neon-volt)";
        } else if (value.startsWith("5")) {
            cardBrandIndicator.innerText = "MC";
            cardBrandIndicator.style.color = "var(--neon-pink)";
        } else if (value.startsWith("3")) {
            cardBrandIndicator.innerText = "AMEX";
            cardBrandIndicator.style.color = "var(--neon-yellow)";
        } else {
            cardBrandIndicator.innerText = "CARD";
            cardBrandIndicator.style.color = "var(--text-secondary)";
        }
    });

    // Auto slash MM/YY
    expiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + "/" + value.substring(2, 4);
        } else {
            e.target.value = value;
        }
    });
}

// SUBMIT CHECKOUT FORM
function handleCheckoutSubmit(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector(".checkout-submit-btn");
    const originalText = submitBtn.innerText;
    
    // Start cyberpunk transaction simulation
    submitBtn.disabled = true;
    submitBtn.innerText = "RESOLVING SHIELD DECRYPTOR...";
    submitBtn.style.backgroundColor = "var(--neon-pink)";
    submitBtn.style.color = "#ffffff";

    setTimeout(() => {
        submitBtn.innerText = "SECURING MERCHANDISE TOKEN...";
        submitBtn.style.backgroundColor = "var(--neon-yellow)";
        submitBtn.style.color = "#000000";

        setTimeout(() => {
            // Finalize checkout details
            const nameInput = document.getElementById("checkout-name").value;
            const tierName = document.getElementById("checkout-tier-name").innerText;
            
            document.getElementById("ticket-member-name").innerText = nameInput.toUpperCase();
            document.getElementById("ticket-tier-name").innerText = tierName;
            
            // Random secure identification tag
            const randomId = "F19-" + Math.floor(1000 + Math.random() * 9000) + "-" + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
            document.getElementById("ticket-member-id").innerText = "#" + randomId;

            // Trigger success screen overlay in drawer
            document.getElementById("success-screen").classList.add("active");
            
            // Reset button styles
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
            submitBtn.style.backgroundColor = "var(--neon-volt)";
            submitBtn.style.color = "#000000";
        }, 1000);

    }, 800);
}


/* ==========================================================================
   ANIMATIONS & DYNAMIC PHYSICS ENGINE
   ========================================================================== */

// 1. MASCOT SCROLL & NAVIGATION LOGIC
let mascotScrollTimeout;
let mascotMoving = false;
let currentPos = {x: 85, y: 85}; // Matches CSS default (bottom right)

function setMascotState(state) {
    const mascot = document.getElementById("mascot");
    if (!mascot) return;
    
    const allStates = ['dumbbells', 'run', 'pushups', 'boxing', 'jumprope'];
    allStates.forEach(s => {
        const el = mascot.querySelector(`.mascot-${s}`);
        if (el) el.style.display = (s === state) ? 'block' : 'none';
    });
}

function moveMascotToNewSpace() {
    const mascot = document.getElementById("mascot");
    if (!mascot) return;
    
    // Define "empty" zones (screen margins avoiding the center content)
    const zones = [
        {x: 10, y: 85}, // Bottom Left
        {x: 85, y: 85}, // Bottom Right
        {x: 8,  y: 50}, // Mid Left
        {x: 92, y: 50}, // Mid Right
        {x: 12, y: 25}, // Top Left
        {x: 88, y: 25}, // Top Right
    ];
    
    // Pick random zone different from current
    let newZone = zones[Math.floor(Math.random() * zones.length)];
    while(newZone.x === currentPos.x && newZone.y === currentPos.y) {
        newZone = zones[Math.floor(Math.random() * zones.length)];
    }
    
    // Flip if running left
    if (newZone.x < currentPos.x) {
        mascot.classList.add("flip");
    } else {
        mascot.classList.remove("flip");
    }
    
    currentPos = newZone;
    mascot.style.left = `${newZone.x}vw`;
    mascot.style.top = `${newZone.y}vh`;
}

function initMascotScroll() {
    const mascot = document.getElementById("mascot");
    if (!mascot) return;
    
    // Initial state
    setMascotState('dumbbells');
    
    window.addEventListener("scroll", () => {
        if (!mascotMoving) {
            mascotMoving = true;
            setMascotState('run');
            // Mascot stays in place, just runs in place to show movement
        }
        
        clearTimeout(mascotScrollTimeout);
        
        // When stopped scrolling, wait for transition to finish then workout
        mascotScrollTimeout = setTimeout(() => {
            mascotMoving = false;
            
            // Pick a random gym activity
            const activities = ['dumbbells', 'pushups', 'boxing', 'jumprope'];
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            setMascotState(randomActivity);
            
            // Face a random direction while working out
            if (Math.random() > 0.5) mascot.classList.toggle("flip");
            
        }, 800); // 800ms matches CSS transition duration
    });
}

// 2. SCROLL-DRIVEN INDUSTRIAL SHAPE ROTATOR
function initScrollShapeRotator() {
    const gear = document.getElementById("bg-gear");
    const cross = document.getElementById("bg-cross");
    const star = document.getElementById("bg-star");

    window.addEventListener("scroll", () => {
        const offset = window.scrollY;
        
        // Dynamic gears shift (subtle crawl)
        if (gear) gear.style.transform = `rotate(${offset * 0.02}deg)`;
        if (cross) cross.style.transform = `rotate(${-offset * 0.015}deg)`;
        if (star) star.style.transform = `rotate(${offset * 0.03}deg)`;
    });
}

// 3. SPLIT TEXT HEADLINE REVEAL ON SCROLL
function initSplitTextReveal() {
    // Reveal text in hero on entrance immediately
    const immediateReveals = document.querySelectorAll(".reveal-text, .reveal-text-delay");
    immediateReveals.forEach(el => {
        splitTextAndAnimate(el, true);
    });

    // Scroll reveal observers
    const scrollHeaders = document.querySelectorAll(".reveal-scroll");
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    splitTextAndAnimate(entry.target, false);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        scrollHeaders.forEach(header => observer.observe(header));
    } else {
        // Fallback for older browsers
        scrollHeaders.forEach(header => {
            splitTextAndAnimate(header, false);
        });
    }
}

function splitTextAndAnimate(el, immediate) {
    const text = el.innerText;
    el.innerHTML = ""; // Clear original

    const words = text.split(" ");
    words.forEach((word, idx) => {
        const spanOuter = document.createElement("span");
        spanOuter.className = "reveal-wrapper";
        
        const spanInner = document.createElement("span");
        spanInner.className = "reveal-word";
        spanInner.innerText = word + (idx < words.length - 1 ? "\u00A0" : ""); // preserve space
        
        spanOuter.appendChild(spanInner);
        el.appendChild(spanOuter);

        // Staggered reveal trigger
        if (immediate) {
            setTimeout(() => {
                spanInner.classList.add("active");
            }, idx * 100 + (el.classList.contains("reveal-text-delay") ? 600 : 100));
        } else {
            setTimeout(() => {
                spanInner.classList.add("active");
            }, idx * 90);
        }
    });
}



// 5. MAGNETIC BUTTON PROXIMITY PUSH
function initMagneticButtons() {
    const magnetics = document.querySelectorAll(".magnetic-button");
    
    document.addEventListener("mousemove", (e) => {
        magnetics.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;

            // Proximity check distance
            const distance = Math.hypot(e.clientX - btnX, e.clientY - btnY);
            
            if (distance < 80) {
                const pullX = (e.clientX - btnX) * 0.15;
                const pullY = (e.clientY - btnY) * 0.15;
                
                btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
            } else {
                btn.style.transform = "translate(0px, 0px)";
            }
        });
    });
}

// 6. ANIMATED STATS COUNTER (scroll-triggered)
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;

        statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startTime = performance.now();

            function easeOutQuart(t) {
                return 1 - Math.pow(1 - t, 4);
            }

            function updateCounter(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutQuart(progress);
                const current = Math.floor(eased * target);

                // Format large numbers with commas
                el.textContent = current.toLocaleString() + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target.toLocaleString() + suffix;
                }
            }

            requestAnimationFrame(updateCounter);
        });

        hasAnimated = true;
    }

    // Use IntersectionObserver to trigger when stats section is visible
    const statsSection = document.getElementById('stats-section');
    if (statsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    } else {
        // Fallback
        animateCounters();
    }
}


// 8. AI COACH CHATBOT LOGIC
function initChatbot() {
    const fab = document.getElementById("chatbot-fab");
    const windowEl = document.getElementById("chatbot-window");
    const closeBtn = document.getElementById("chatbot-close");
    const sendBtn = document.getElementById("chatbot-send");
    const inputField = document.getElementById("chatbot-input");
    const messagesContainer = document.getElementById("chatbot-messages");

    if (!fab || !windowEl) return;

    // Toggle Chat Window
    fab.addEventListener("click", () => {
        windowEl.classList.toggle("open");
        if (windowEl.classList.contains("open")) {
            inputField.focus();
        }
    });

    closeBtn.addEventListener("click", () => {
        windowEl.classList.remove("open");
    });

    // Chat History State
    let conversationHistory = [
        {
            role: "system",
            content: "You are the F19 AI Coach. You are a tough, no-nonsense, brutalist gym coach. You speak in short, punchy sentences. You motivate people aggressively but safely. You focus on gains, form, and nutrition. You know the gym details: Memberships are CORE ($49/mo) and UNLIMITED PRO ($89/mo). The coaches are Marcus (Strength), Zara (CrossFit), Sarah (Mobility), and Jax (HIIT). You tell users to check the schedule above for class times. You keep responses under 3 sentences. Answer any fitness questions."
        }
    ];

    // Handle Sending Messages
    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        // Add user message
        appendMessage("USER", text, "user-msg");
        inputField.value = "";
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Update history
        conversationHistory.push({ role: "user", content: text });

        // Show typing indicator
        const typingId = "typing-" + Date.now();
        appendMessage("COACH", "...", "bot-msg", typingId);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetchAIResponse(conversationHistory);
            
            // Remove typing indicator
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();

            // Append response
            appendMessage("COACH", response, "bot-msg");
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Update history
            conversationHistory.push({ role: "assistant", content: response });
        } catch (error) {
            console.error("OpenAI Error:", error);
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();
            
            appendMessage("COACH", `SYSTEM ERROR. API connection failed. ${error.message}`, "bot-msg");
        }
    };

    sendBtn.addEventListener("click", handleSend);
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });

    function appendMessage(sender, text, className, id = null) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat-msg ${className}`;
        if (id) msgDiv.id = id;
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        messagesContainer.appendChild(msgDiv);
    }

    // Call OpenRouter API
    async function fetchAIResponse(history) {
        // If config is missing or key is missing
        if (typeof CONFIG === 'undefined' || !CONFIG.OPENROUTER_API_KEY || CONFIG.OPENROUTER_API_KEY === "YOUR_OPENROUTER_API_KEY_HERE") {
            return "ERROR: OpenRouter API Key is missing. Please add it to config.js to enable the interactive AI Coach.";
        }

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "F19 Gym Coach"
            },
            body: JSON.stringify({
                model: "openrouter/free", // Automatically routes to the best available free model
                messages: history,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!res.ok) {
            let errorText = `Status ${res.status}`;
            try {
                const errData = await res.json();
                if (errData.error && errData.error.message) {
                    errorText = errData.error.message;
                }
            } catch (e) {
                // Ignore parsing error
            }
            throw new Error(errorText);
        }

        const data = await res.json();
        const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        
        if (content) {
            return content.trim();
        } else {
            console.error("Empty content in response:", data);
            return "Sorry, my brain just glitched. What was that?";
        }
    }
}
