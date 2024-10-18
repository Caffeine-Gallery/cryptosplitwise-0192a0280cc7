import { backend } from 'declarations/backend';

document.getElementById('investment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const investmentAmount = parseFloat(document.getElementById('investment-amount').value);
    
    if (investmentAmount > 0) {
        try {
            const allocation = await backend.calculateAllocation(investmentAmount);
            displayAllocation(allocation);
        } catch (error) {
            console.error('Error calculating allocation:', error);
            alert('An error occurred while calculating the allocation. Please try again.');
        }
    } else {
        alert('Please enter a valid investment amount.');
    }
});

function displayAllocation(allocation) {
    const resultsDiv = document.getElementById('allocation-results');
    resultsDiv.innerHTML = '<h2>Allocation Results</h2>';
    
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Cryptocurrency</th>
            <th>Allocation (FIAT)</th>
        </tr>
    `;
    
    allocation.forEach(([crypto, amount]) => {
        const row = table.insertRow();
        row.insertCell(0).textContent = crypto;
        row.insertCell(1).textContent = amount.toFixed(2);
    });
    
    resultsDiv.appendChild(table);
}
