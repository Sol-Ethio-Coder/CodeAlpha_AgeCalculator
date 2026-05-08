// script.js
// DOM Elements
const dayInput = document.getElementById('dayInput');
const monthInput = document.getElementById('monthInput');
const yearInput = document.getElementById('yearInput');
const calculateBtn = document.getElementById('calculateBtn');
const yearsSpan = document.getElementById('yearsValue');
const monthsSpan = document.getElementById('monthsValue');
const daysSpan = document.getElementById('daysValue');
const extraMessageDiv = document.getElementById('extraMessage');
const errorMessageDiv = document.getElementById('errorMessage');

// Create floating particles for eye-catching effect
function createParticles() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 8 + 5 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        container.appendChild(particle);
    }
}

// Helper: Validate if date is real (considering leap years, month lengths)
function isValidDate(day, month, year) {
    if (year < 1900 || year > new Date().getFullYear() + 5) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const testDate = new Date(year, month - 1, day);
    if (testDate.getFullYear() !== year || testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
        return false;
    }
    return true;
}

// Core function: calculate exact age in years, months, days
function calculateExactAge(birthDate) {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let birthMidnight = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (birthMidnight > todayMidnight) {
        return { valid: false, reason: "future_birth" };
    }

    let years = todayMidnight.getFullYear() - birthMidnight.getFullYear();
    let months = todayMidnight.getMonth() - birthMidnight.getMonth();
    let days = todayMidnight.getDate() - birthMidnight.getDate();

    if (days < 0) {
        const previousMonthDate = new Date(todayMidnight.getFullYear(), todayMidnight.getMonth(), 0);
        const daysInPreviousMonth = previousMonthDate.getDate();
        days = daysInPreviousMonth + days;
        months--;
    }

    if (months < 0) {
        months += 12;
        years--;
    }

    if (years < 0) {
        return { valid: false, reason: "future_birth" };
    }

    return {
        valid: true,
        years: years,
        months: months,
        days: days
    };
}

// Update UI with fancy animations
function displayAgeResult(ageData, birthDateObj) {
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.innerHTML = '';
    
    if (!ageData.valid) {
        if (ageData.reason === "future_birth") {
            errorMessageDiv.innerHTML = "🌟 Birth date cannot be in the future. Please enter a date from the past! 🌟";
        } else {
            errorMessageDiv.innerHTML = "✨ Invalid date! Please check day, month, and year (real calendar date). ✨";
        }
        errorMessageDiv.style.display = 'block';
        
        yearsSpan.style.transform = 'scale(0.9)';
        monthsSpan.style.transform = 'scale(0.9)';
        daysSpan.style.transform = 'scale(0.9)';
        
        yearsSpan.innerText = '--';
        monthsSpan.innerText = '--';
        daysSpan.innerText = '--';
        extraMessageDiv.innerHTML = "💫 Please correct the birth date and try again 💫";
        
        setTimeout(() => {
            yearsSpan.style.transform = '';
            monthsSpan.style.transform = '';
            daysSpan.style.transform = '';
        }, 300);
        return;
    }

    function animateNumber(element, target) {
        if (element.innerText == target) return;
        element.style.transform = 'scale(1.1)';
        element.innerText = target;
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }
    
    animateNumber(yearsSpan, ageData.years);
    animateNumber(monthsSpan, ageData.months);
    animateNumber(daysSpan, ageData.days);
    
    const totalDaysOld = Math.floor((new Date() - birthDateObj) / (1000 * 60 * 60 * 24));
    const messages = [
        `🎂 You've lived ${totalDaysOld.toLocaleString()} beautiful days! 🎂`,
        `⭐ ${totalDaysOld.toLocaleString()} days of amazing journey! ⭐`,
        `✨ Approximately ${totalDaysOld.toLocaleString()} days around the sun! ✨`,
        `💫 ${totalDaysOld.toLocaleString()} days of memories made! 💫`,
        `🌟 ${totalDaysOld.toLocaleString()} days of life's beautiful story! 🌟`
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    extraMessageDiv.innerHTML = randomMsg;
}

// Main validation and calculation handler
function handleAgeCalculation() {
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.innerHTML = '';
    
    let day = parseInt(dayInput.value, 10);
    let month = parseInt(monthInput.value, 10);
    let year = parseInt(yearInput.value, 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        errorMessageDiv.innerHTML = "✨ Please enter numeric values for day, month, and year ✨";
        errorMessageDiv.style.display = 'block';
        yearsSpan.innerText = '--';
        monthsSpan.innerText = '--';
        daysSpan.innerText = '--';
        extraMessageDiv.innerHTML = "📅 Use numbers only for your birth date.";
        return;
    }
    
    if (year < 1900) {
        errorMessageDiv.innerHTML = "📜 Year must be 1900 or later. Please enter a valid year.";
        errorMessageDiv.style.display = 'block';
        yearsSpan.innerText = '--';
        monthsSpan.innerText = '--';
        daysSpan.innerText = '--';
        extraMessageDiv.innerHTML = "⏳ Birth year too far in the past? Please use year ≥ 1900.";
        return;
    }
    
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
        errorMessageDiv.innerHTML = `🚀 Year cannot be in the future (current year is ${currentYear}). 🚀`;
        errorMessageDiv.style.display = 'block';
        yearsSpan.innerText = '--';
        monthsSpan.innerText = '--';
        daysSpan.innerText = '--';
        extraMessageDiv.innerHTML = "🔮 Future birth date is not allowed.";
        return;
    }
    
    if (!isValidDate(day, month, year)) {
        errorMessageDiv.innerHTML = "❄️ Invalid date! This date doesn't exist on the calendar. Leap year & month length aware. ❄️";
        errorMessageDiv.style.display = 'block';
        yearsSpan.innerText = '--';
        monthsSpan.innerText = '--';
        daysSpan.innerText = '--';
        extraMessageDiv.innerHTML = "📆 Please enter a valid real date.";
        return;
    }
    
    const birthDateObj = new Date(year, month - 1, day);
    if (birthDateObj.getDate() !== day || birthDateObj.getMonth() !== month - 1 || birthDateObj.getFullYear() !== year) {
        errorMessageDiv.innerHTML = "⚠️ Date inconsistency detected. Please re-enter a valid date.";
        errorMessageDiv.style.display = 'block';
        yearsSpan.innerText = '--';
        monthsSpan.innerText = '--';
        daysSpan.innerText = '--';
        extraMessageDiv.innerHTML = "📆 Check day-month-year combination again.";
        return;
    }
    
    const todayStart = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    if (birthDateObj > todayStart) {
        errorMessageDiv.innerHTML = "⏰ Birth date cannot be after today's date. Please choose a date in the past.";
        errorMessageDiv.style.display = 'block';
        yearsSpan.innerText = '--';
        monthsSpan.innerText = '--';
        daysSpan.innerText = '--';
        extraMessageDiv.innerHTML = "💡 Age is only defined for past or today's birth.";
        return;
    }
    
    const ageResult = calculateExactAge(birthDateObj);
    displayAgeResult(ageResult, birthDateObj);
}

function setDefaultValues() {
    handleAgeCalculation();
}

calculateBtn.addEventListener('click', handleAgeCalculation);

const inputs = [dayInput, monthInput, yearInput];
inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAgeCalculation();
        }
    });
});

// Update portfolio and social links - Replace with your actual URLs
const portfolioLink = document.getElementById('portfolioLink');
if (portfolioLink) {
    portfolioLink.href = 'https://solomon-ashagre.netlify.app';
    portfolioLink.innerHTML = 'Sol Ethio Coder <i class="fas fa-external-link-alt"></i>';
}

const socialLinks = document.querySelectorAll('.social-link');
if (socialLinks.length >= 4) {
    socialLinks[0].href = 'https://github.com/Sol-Ethio-Coder';
    socialLinks[1].href = 'https://www.linkedin.com/in/Sol-Ethio-Coder';
    socialLinks[3].href = 'https://t.me/Sol_Ethio_Coder';
}

// Initialize particles on load
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setDefaultValues();
});