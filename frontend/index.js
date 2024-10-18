import { backend } from 'declarations/backend';
import { Actor, HttpAgent } from '@dfinity/agent';

// Initialize the agent and actor
const agent = new HttpAgent();
const backendActor = Actor.createActor(backend.idlFactory, {
  agent,
  canisterId: process.env.BACKEND_CANISTER_ID,
});

document.getElementById('investment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const investmentAmount = parseFloat(document.getElementById('investment-amount').value);
    const resultsDiv = document.getElementById('allocation-results');
    
    if (investmentAmount > 0) {
        try {
            resultsDiv.innerHTML = '<p>Loading allocation data...</p>';
            showLoadingSpinner();

            // Add a timeout to the API call
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timed out')), 15000)
            );
            const resultPromise = backendActor.calculateAllocation(investmentAmount);
            const result = await Promise.race([resultPromise, timeoutPromise]);

            hideLoadingSpinner();

            if ('ok' in result) {
                displayAllocation(result.ok);
                createPieChart(result.ok);
            } else if ('err' in result) {
                throw new Error(result.err);
            } else {
                throw new Error('Unexpected response format');
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

function createPieChart(allocation) {
    const canvas = document.getElementById('allocation-chart');
    const ctx = canvas.getContext('2d');
    const total = allocation.reduce((sum, [_, amount]) => sum + amount, 0);
    let startAngle = 0;

    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
        '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB'
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    allocation.forEach(([crypto, amount], index) => {
        const sliceAngle = (amount / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.arc(200, 200, 180, startAngle, startAngle + sliceAngle);
        ctx.lineTo(200, 200);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        startAngle += sliceAngle;

        // Add labels
        const middleAngle = startAngle - sliceAngle / 2;
        const x = 200 + Math.cos(middleAngle) * 220;
        const y = 200 + Math.sin(middleAngle) * 220;
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(crypto, x, y);
    });
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
