// Initialize friends counter
let friendCount = 0;

// Add a new friend row
function addFriend() {
    friendCount++;
    const friendsContainer = document.getElementById('friendsContainer');
    
    const friendRow = document.createElement('div');
    friendRow.className = 'friend-row';
    friendRow.id = `friend-${friendCount}`;
    
    friendRow.innerHTML = `
        <div class="spotlight"></div>
        <div class="friend-field">
            <div class="friend-name">
                <span class="name-label">NAME</span>
                <span id="displayName-${friendCount}">Friend ${friendCount}</span>
                <button onclick="editName(${friendCount})" class="edit-btn">Edit</button>
            </div>
            <input type="text" id="name-${friendCount}" placeholder="Friend's name" value="Friend ${friendCount}" style="display: none;">
        </div>
        <div class="friend-field">
            <label>Amount Paid:</label>
            <input type="number" id="paid-${friendCount}" min="0" step="0.01" placeholder="Amount paid" value="0">
        </div>
        <button onclick="removeFriend(${friendCount})" class="action-btn delete-btn">Remove</button>
    `;
    
    friendsContainer.appendChild(friendRow);
}

// Edit friend name
function editName(id) {
    const displayName = document.getElementById(`displayName-${id}`);
    const nameInput = document.getElementById(`name-${id}`);
    
    if (nameInput.style.display === 'none') {
        // Switch to edit mode
        displayName.style.display = 'none';
        nameInput.style.display = 'block';
        nameInput.focus();
        
        // Change button text
        event.target.innerText = 'Save';
    } else {
        // Switch to display mode
        displayName.innerText = nameInput.value || `Friend ${id}`;
        displayName.style.display = 'inline';
        nameInput.style.display = 'none';
        
        // Change button text
        event.target.innerText = 'Edit';
    }
}

// Remove a friend row
function removeFriend(id) {
    const friendRow = document.getElementById(`friend-${id}`);
    friendRow.remove();
}

// Get appropriate emoji based on payment percentage
function getPaymentEmoji(percentage) {
    if (percentage < 70) {
        return '😠'; // Angry - paid way less
    } else if (percentage < 85) {
        return '😒'; // Unimpressed - paid less
    } else if (percentage >= 95 && percentage <= 105) {
        return '😊'; // Happy - paid almost exact amount
    } else if (percentage > 120) {
        return '🎉'; // Party - paid much more
    } else if (percentage > 105) {
        return '👍'; // Thumbs up - paid a bit more
    } else {
        return '😐'; // Neutral - paid somewhat less
    }
}

// Calculate the bill split
function calculateSplit() {
    const totalBill = parseFloat(document.getElementById('totalBill').value);
    const resultDiv = document.getElementById('billResult');
    resultDiv.innerHTML = '';
    
    if (isNaN(totalBill) || totalBill <= 0) {
        resultDiv.innerHTML = "<p style='color: red;'>Please enter a valid bill amount!</p>";
        return;
    }
    
    const friendRows = document.querySelectorAll('.friend-row');
    
    if (friendRows.length === 0) {
        resultDiv.innerHTML = "<p style='color: red;'>Please add at least one friend!</p>";
        return;
    }
    
    const friends = [];
    let totalPaid = 0;
    
    // Collect friend data
    friendRows.forEach(row => {
        const id = row.id.split('-')[1];
        const nameDisplay = document.getElementById(`displayName-${id}`);
        const name = nameDisplay.innerText;
        const paid = parseFloat(document.getElementById(`paid-${id}`).value) || 0;
        
        friends.push({ id, name, paid });
        totalPaid += paid;
    });
    
    // Calculate even split
    const evenSplit = totalBill / friends.length;
    
    // Generate results
    let resultHTML = `<h2>Bill Split Results</h2>`;
    
    if (Math.abs(totalPaid - totalBill) > 0.01) {
        resultHTML += `
            <div class="result-card">
                <p><strong>Warning:</strong> Total paid (₹${totalPaid.toFixed(2)}) doesn't match the bill amount (₹${totalBill.toFixed(2)})</p>
                <p>Difference: ₹${(totalBill - totalPaid).toFixed(2)}</p>
            </div>
        `;
    }
    
    friends.forEach(friend => {
        const remaining = evenSplit - friend.paid;
        const paymentPercentage = (friend.paid / evenSplit) * 100;
        const emoji = getPaymentEmoji(paymentPercentage);
        
        let paymentStatus = '';
        if (remaining > 0) {
            paymentStatus = `Needs to pay: <span class="amount remaining">₹${remaining.toFixed(2)}</span>`;
        } else if (remaining < 0) {
            paymentStatus = `Gets back: <span class="amount paid">₹${Math.abs(remaining).toFixed(2)}</span>`;
        } else {
            paymentStatus = `<span class="amount paid">All settled!</span>`;
        }
        
        let commentText = '';
        if (paymentPercentage < 70) {
            commentText = "Pay up! You're way behind.";
        } else if (paymentPercentage < 85) {
            commentText = "You could contribute a bit more.";
        } else if (paymentPercentage >= 95 && paymentPercentage <= 105) {
            commentText = "Perfect split! Thanks for being fair.";
        } else if (paymentPercentage > 120) {
            commentText = "Wow! Thanks for being so generous!";
        } else if (paymentPercentage > 105) {
            commentText = "Thanks for chipping in extra!";
        } else {
            commentText = "Almost there, just a bit more.";
        }
        
        resultHTML += `
            <div class="result-card">
                <div class="emoji">${emoji}</div>
                <h3>${friend.name}</h3>
                <p>Even split: <span class="amount even-split">₹${evenSplit.toFixed(2)}</span></p>
                <p>Paid: <span class="amount paid">₹${friend.paid.toFixed(2)}</span></p>
                <p>${paymentStatus}</p>
                <p><i>${commentText}</i></p>
            </div>
        `;
    });
    
    resultDiv.innerHTML = resultHTML;
}

// Initialize with one friend
document.addEventListener('DOMContentLoaded', function() {
    addFriend();
});