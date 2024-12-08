// Initialize votes object or get it from localStorage
let votes = JSON.parse(localStorage.getItem('votes')) || {
    'Candidate A': 0,
    'Candidate B': 0,
    'Candidate C': 0
};

// On page load, display the charts with current votes
document.addEventListener('DOMContentLoaded', () => {
    updateCharts(); // Display the charts with current votes on page load
    setupNavbar(); // Set up the navigation bar
});

document.getElementById('voteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const selectedCandidate = document.querySelector('input[name="candidate"]:checked').value;
    votes[selectedCandidate] += 1;

    // Save updated votes to localStorage
    localStorage.setItem('votes', JSON.stringify(votes));

    updateCharts(); // Update the charts after voting
});

// Listen for storage events to sync between tabs
window.addEventListener('storage', function (event) {
    if (event.key === 'votes') {
        votes = JSON.parse(event.newValue);
        updateCharts();
    }
});

function updateCharts() {
    const voteCounts = Object.values(votes);
    const voteLabels = Object.keys(votes);
    const totalVotes = voteCounts.reduce((acc, curr) => acc + curr, 0); // Calculate total votes

    // Remove existing charts if already created
    const existingBarChart = Chart.getChart("barChart");
    const existingPieChart = Chart.getChart("pieChart");
    if (existingBarChart) existingBarChart.destroy();
    if (existingPieChart) existingPieChart.destroy();

    document.getElementById('totalVotes').textContent = `Total Votes: ${totalVotes}`;

    // Bar chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: voteLabels,
            datasets: [{
                label: 'Votes',
                data: voteCounts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                borderWidth: 1,
                borderColor: 'white', // Optional: Set a border color for the bars
            }]
        },
        options: {
            animation: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white', // Set Y-axis tick color to white
                    },
                    grid: {
                        color: 'white', // Set Y-axis grid line color to white
                    },
                    title: {
                        display: true,
                        text: 'Votes',
                        color: 'white', // Set Y-axis title color to white
                    }
                },
                x: {
                    ticks: {
                        color: 'white', // Set X-axis tick color to white
                    },
                    grid: {
                        color: 'white', // Set X-axis grid line color to white
                    },
                    title: {
                        display: true,
                        text: 'Candidates',
                        color: 'white', // Set X-axis title color to white
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Set legend text color to white
                    }
                },
            },
        }
    });

    // Pie chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: voteLabels,
            datasets: [{
                data: voteCounts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            }]
        },
        options: {
            animation: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Set legend text color to white for pie chart
                    }
                }
            }
        }
    });

    // Determine the top 2 candidates
    const sortedCandidates = Object.entries(votes).sort((a, b) => b[1] - a[1]);

    // Update top 2 candidates display
    const firstPlace = sortedCandidates[0] ? `${sortedCandidates[0][0]} with ${sortedCandidates[0][1]} votes` : 'No votes yet';
    const secondPlace = sortedCandidates[1] ? `${sortedCandidates[1][0]} with ${sortedCandidates[1][1]} votes` : 'No votes yet';

    document.getElementById('firstPlace').textContent = `First Place: ${firstPlace}`;
    document.getElementById('secondPlace').textContent = `Second Place: ${secondPlace}`;
}

// Navbar functionality
function setupNavbar() {
    const navItems = document.querySelectorAll('.nav-item');
    const resultsContainer = document.getElementById('resultsContainer');
    const votingFormContainer = document.getElementById('votingFormContainer');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Show results only if "Overview" is clicked
            if (item.id === 'overview') {
                resultsContainer.style.display = 'block'; // Show results
                votingFormContainer.style.display = 'none'; // Hide voting form
            } else if (item.id === 'votes') {
                votingFormContainer.style.display = 'block'; // Show voting form
                resultsContainer.style.display = 'none'; // Hide results
            } else {
                votingFormContainer.style.display = 'none'; // Hide voting form
                resultsContainer.style.display = 'none'; // Hide results
            }
        });
    });

    // Default to showing results on load
    document.getElementById('overview').click();
}
