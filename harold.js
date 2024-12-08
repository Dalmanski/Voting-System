document.addEventListener('DOMContentLoaded', () => {
    // Toggle sidebar
    const toggleButton = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');

    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }

    // Load elections and populate cards
    const storedData = JSON.parse(localStorage.getItem('Election')) || {};
    const today = new Date().toISOString().split('T')[0];

    for (const electionName in storedData) {
        const election = storedData[electionName];
        const electionStartDate = election.startDate || "Unknown Start Date";
        const electionEndDate = election.endDate || "Unknown End Date";
        const electionLogoUrl = election.logo || '';

        const sectionId = electionStartDate <= today ? 'active-elections' : 'upcoming-elections';
        addElectionCard(electionName, electionStartDate, electionEndDate, electionLogoUrl, sectionId);
    }
});

// Make showSection globally available
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    } else {
        console.error(`Section with ID '${sectionId}' not found.`);
    }
}

// Function to dynamically add election cards
function addElectionCard(electionName, electionStartDate, electionEndDate, electionLogoUrl, sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) {
        console.error(`Section with ID '${sectionId}' not found.`);
        return;
    }

    const electionCardHTML = `
        <div class="election-card">
            <div class="election-header">
                <img src="${electionLogoUrl}" alt="Election Logo" class="election-logo">
                <div class="header-content">
                    <div class="election-info">
                        <h3>${electionName}</h3>
                        <p>Starts on: ${electionStartDate}</p>
                        <p>Ends on: ${electionEndDate}</p>
                    </div>
                    <div class="card-buttons">
                        <button onclick="window.location.href='harold-vote-details.html'">View Details</button>
                        <button onclick="showSection('vote-elections'); showElectionsVote('${electionName}')">Cast Vote</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    section.insertAdjacentHTML('beforeend', electionCardHTML);
}

// Function to display candidates in the vote section
function showElectionsVote(electionKey) {
    const storedData = JSON.parse(localStorage.getItem('Election')) || {};
    const election = storedData[electionKey];

    if (!election || !election.candidates) {
        alert('No election data found!');
        return;
    }

    const candidateList = document.getElementById('candidate-list');
    if (!candidateList) {
        console.error("Candidate list container not found.");
        return;
    }

    const positionMap = {};

    election.candidates
        .filter(candidate => candidate !== null) // Filter out null candidates
        .forEach(candidate => {
            if (!positionMap[candidate.position]) {
                positionMap[candidate.position] = [];
            }
            positionMap[candidate.position].push(candidate);
        });

    let content = '';

    for (const position in positionMap) {
        content += `<h3>${position}</h3><div class="radio-group">`;

        positionMap[position].forEach(candidate => {
            content += `
                <div class="candidate">
                    <input type="radio" name="${position}" value="${candidate.name}">
                    <label style="margin-left: 10px;">${candidate.name} - Party: ${candidate.partylist}</label>
                </div>`;
        });

        content += `</div>`;
    }

    candidateList.innerHTML = content;
}
