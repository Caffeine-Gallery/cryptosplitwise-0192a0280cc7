import { backend } from 'declarations/backend';
import { Actor, HttpAgent } from '@dfinity/agent';

// Initialize the agent and actor
const agent = new HttpAgent();
const backendActor = Actor.createActor(backend.idlFactory, {
  agent,
  canisterId: process.env.CANISTER_ID_BACKEND,
});

document.getElementById('investment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const investmentAmount = parseFloat(document.getElementById('investment-amount').value);
    const resultsDiv = document.getElementById('allocation-results');
    
    if (investmentAmount > 0) {
        try {
            resultsDiv.innerHTML = '<p>Loading allocation data...</p>';
            showLoadingSpinner();

            console.log('Calling backend with investment amount:', investmentAmount);
            const result = await backendActor.calculateAllocation(investmentAmount);
            console.log('Backend response:', result);

            hideLoadingSpinner();

            if (result && Array.isArray(result) && result.length > 0) {
                console.log('Displaying allocation');
                displayAllocation(result);
            } else {
                console.error('Invalid or empty allocation data');
                resultsDiv.innerHTML = '<p>Unable to calculate allocation. Please try again.</p>';
            }
        } catch (error) {
            console.error('Error calculating allocation:', error);
            hideLoadingSpinner();
            resultsDiv.innerHTML = `<p>An error occurred while calculating the allocation: ${error.message}</p>`;
        }
    } else {
        alert('Please enter a valid investment amount.');
    }
});

function displayAllocation(allocation) {
    console.log('Displaying allocation:', allocation);
    const tableDiv = document.getElementById('allocation-table');
    tableDiv.innerHTML = '<h2>Allocation Results</h2>';
    
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Cryptocurrency</th>
            <th>Allocation (USD $)</th>
        </tr>
    `;
    
    allocation.forEach(([crypto, amount]) => {
        const row = table.insertRow();
        row.insertCell(0).textContent = crypto;
        row.insertCell(1).textContent = `$${amount.toFixed(2)}`;
    });
    
    tableDiv.appendChild(table);
}

function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.id = 'loading-spinner';
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Add this line at the end of the file to check if the actor is correctly created
console.log('Backend actor:', backendActor);
