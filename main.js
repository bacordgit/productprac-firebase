// DOM Elements
const gachaResultsContainer = document.querySelector('.gacha-results');
const gachaBtn = document.querySelector('.gacha-btn');
const resetBtn = document.querySelector('.reset-btn');
const logList = document.querySelector('.log-list');
const totalPullsEl = document.getElementById('total-pulls');
const rCountEl = document.getElementById('r-count');
const srCountEl = document.getElementById('sr-count');
const ssrCountEl = document.getElementById('ssr-count');
const ssrRateEl = document.getElementById('ssr-rate');

// Gacha Probabilities
const GACHA_RATES = {
    SSR_PICKUP: 0.02, // 2%
    SSR: 0.02,        // 2%
    SR: 0.43,         // 43%
    R: 0.53           // 53%
};

// State
let state = {
    totalPulls: 0,
    rCount: 0,
    srCount: 0,
    ssrCount: 0,
};

// Function to draw a single item based on rates
const drawOne = () => {
    const rand = Math.random();
    let cumulativeProbability = 0;

    if (rand < (cumulativeProbability += GACHA_RATES.SSR_PICKUP)) {
        return { rarity: 'SSR-Pickup', class: 'ssr-pickup' };
    }
    if (rand < (cumulativeProbability += GACHA_RATES.SSR)) {
        return { rarity: 'SSR', class: 'ssr' };
    }
    if (rand < (cumulativeProbability += GACHA_RATES.SR)) {
        return { rarity: 'SR', class: 'sr' };
    }
    return { rarity: 'R', class: 'r' };
};

// Function to perform a 10-pull
const performTenPull = () => {
    gachaResultsContainer.innerHTML = '';
    const results = [];
    for (let i = 0; i < 10; i++) {
        results.push(drawOne());
    }

    updateState(results);
    displayResults(results);
    logResults(results);
    updateStatistics();
};

// Update the central state with the results of a pull
const updateState = (results) => {
    state.totalPulls += results.length;
    results.forEach(item => {
        if (item.rarity === 'R') {
            state.rCount++;
        } else if (item.rarity === 'SR') {
            state.srCount++;
        } else if (item.rarity.includes('SSR')) {
            state.ssrCount++;
        }
    });
};

// Update the statistics display
const updateStatistics = () => {
    totalPullsEl.textContent = state.totalPulls;
    rCountEl.textContent = state.rCount;
    srCountEl.textContent = state.srCount;
    ssrCountEl.textContent = state.ssrCount;

    const ssrRate = state.totalPulls > 0 ? (state.ssrCount / state.totalPulls) * 100 : 0;
    ssrRateEl.textContent = ssrRate.toFixed(2);
};

// Function to display results on the screen
const displayResults = (results) => {
    results.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('gacha-item', item.class);
        itemElement.textContent = item.rarity.replace('-Pickup', '-P'); // Shorten for display
        gachaResultsContainer.appendChild(itemElement);
    });
};

// Function to log the results to the history
const logResults = (results) => {
    const pullSummary = results.map(item => item.rarity).join(', ');
    const logEntry = document.createElement('li');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] 10-Pull: ${pullSummary}`;
    logList.prepend(logEntry);
};

// Function to reset the entire simulation
const resetSimulation = () => {
    state = {
        totalPulls: 0,
        rCount: 0,
        srCount: 0,
        ssrCount: 0,
    };
    gachaResultsContainer.innerHTML = '';
    logList.innerHTML = '';
    updateStatistics();
};

// Event Listeners
gachaBtn.addEventListener('click', performTenPull);
resetBtn.addEventListener('click', resetSimulation);

// Initial UI update
updateStatistics();
