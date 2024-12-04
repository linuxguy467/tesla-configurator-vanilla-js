const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox');
const accessoryCheckboxes = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

// totalPrice factory function
const createTotalPrice = (basePrice) => {
  return {
    basePrice,
    currentPrice: basePrice
  }
}

const totalPrice = createTotalPrice(52490);

let selectedColor = 'Stealth Grey';
const selectedOptions = {
  'Performance Wheels': false,
  'Performance Package': false,
  'Full Self-Driving': false
}

const pricing = {
  'Performance Wheels': 2500,
  'Performance Package': 5000,
  'Full Self-Driving': 8500,
  'Accessories': {
    'Center Console Trays': 35,
    'Sunshade': 105,
    'All-Weather Interior Liners': 225
  }
}


// Handle top bar on scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle('visible-bar', atTop);
  topBar.classList.toggle('hidden-bar', !atTop);
}

// Image Mapping
// const exteriorImages = {
//   'Stealth Grey': './images/model-y-stealth-grey.jpg',
//   'Pearl White': './images/model-y-pearl-white.jpg',
//   'Deep Blue': './images/model-y-deep-blue-metallic.jpg',
//   'Solid Black': './images/model-y-solid-black.jpg',
//   'Ultra Red': './images/model-y-ultra-red.jpg',
//   'Quicksilver': './images/model-y-quicksilver.jpg'
// };

// const interiorImages = {
//   Dark: './images/model-y-interior-dark.jpg',
//   Light: './images/model-y-interior-light.jpg'
// };
const modelYImages = {
  exterior: {
    'Stealth Grey': './images/model-y-stealth-grey.jpg',
    'Pearl White': './images/model-y-pearl-white.jpg',
    'Deep Blue': './images/model-y-deep-blue-metallic.jpg',
    'Solid Black': './images/model-y-solid-black.jpg',
    'Ultra Red': './images/model-y-ultra-red.jpg',
    Quicksilver: './images/model-y-quicksilver.jpg'
  },
  interior: {
    Dark: './images/model-y-interior-dark.jpg',
    Light: './images/model-y-interior-light.jpg'
  }
}

// Translate to Currency Format
const toCurrencyFormat = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Handle color selection
const handleColorButtonClick = (event) => {
  let button;

  if (event.target.tagName === "IMG") {
    button = event.target.closest('button');
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }

  if (button) {
    const buttons = event.currentTarget.querySelectorAll('button');
    buttons.forEach((btn) => btn.classList.remove('btn-selected'));
    button.classList.add('btn-selected');

    // Change exterior image
    if (event.currentTarget === exteriorColorSection) {
      selectedColor = button.querySelector('img').alt;
      updateExteriorImage();
    }

    // Change interior image
    if (event.currentTarget === interiorColorSection) {
      const color = button.querySelector('img').alt;
      interiorImage.src = modelYImages.interior[color];
    }
  }
}

// Update exterior image based on color and wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
  const colorKey = selectedColor in modelYImages.exterior ? selectedColor : 'Stealth Grey';
  exteriorImage.src = modelYImages.exterior[colorKey].replace('.jpg', `${performanceSuffix}.jpg`);
}

// Wheel Selection
const handleWheelButtonClick = (event) => {
  if (event.target.tagName === "BUTTON") {
    const buttons = document.querySelectorAll('#wheel-buttons button');
    buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));

    // Add selected styles to clicked button
    event.target.classList.add('bg-gray-700', 'text-white');

    selectedOptions['Performance Wheels'] = event.target.textContent.includes('Performance');

    updateExteriorImage();

    updateTotalPrice();
  }
}

// Performance Package Selection
const handlePerformanceButtonClick = () => {
  const isSelected = performanceBtn.classList.toggle('bg-gray-700');
  performanceBtn.classList.toggle('text-white');

  // Update selected options
  selectedOptions['Performance Package'] = isSelected;

  updateTotalPrice();
}

// Full Self-Driving Selection
const fullSelfDrivingChange = () => {
  selectedOptions['Full Self-Driving'] = fullSelfDrivingCheckbox.checked;

  updateTotalPrice();
}

// Update total price in the UI
const updateTotalPrice = () => {
  // Reset the current price to base price
  totalPrice.currentPrice = totalPrice.basePrice;

  // Performance Wheels
  if (selectedOptions['Performance Wheels']) {
    totalPrice.currentPrice += pricing['Performance Wheels'];
  }

  // Performance Package
  if (selectedOptions['Performance Package']) {
    totalPrice.currentPrice += pricing['Performance Package'];
  }

  // Full Self-Driving
  if (selectedOptions['Full Self-Driving']) {
    totalPrice.currentPrice += pricing['Full Self-Driving'];
  }

  // Accessories
  accessoryCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const accessoryName = checkbox.closest('label').querySelector('span').textContent.trim();
      totalPrice.currentPrice += pricing['Accessories'][accessoryName];
    }
  })

  // Update the total price in the UI
  totalPriceElement.textContent = `${toCurrencyFormat(totalPrice.currentPrice)}`;

  updatePaymentBreakdown();
}

// Update Payment breakdown based on total price
const updatePaymentBreakdown = () => {
  // Calculate down payment
  const downPayment = totalPrice.currentPrice * 0.1;
  downPaymentElement.textContent = `${toCurrencyFormat(downPayment)}`;

  // Calculate loan details (assuming 60 month loan and 3% APR interest rate)
  const loanTerm = 60;
  const interestRate = 0.03;

  const loanAmount = totalPrice.currentPrice - downPayment;

  // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
  const monthlyInterestRate = interestRate / 12;

  const monthlyPayment = (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)))
    / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

  monthlyPaymentElement.textContent = `${toCurrencyFormat(monthlyPayment)}`;
}

// Handle Accessory Checkbox Listeners
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => updateTotalPrice());
})

// initial update price
updateTotalPrice();

// Event listeners
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener('change', fullSelfDrivingChange);
