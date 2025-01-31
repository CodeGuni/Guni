/*
    Author: Gunpreet Singh
    Student Number: 9022194
    Course: PROG8681 – Advanced JavaScript Programming
    Assignment 2

    Additional Features Implemented:
    1. Drinks Selection with Custom Messages
       
    2. Enhanced Order Summary:
       - Included side dish and drink selections in the order summary only if they were selected.
       - Conditionally displayed special instructions in the summary only if provided by the user.
       
    3. Published on my website for testing and demonstration:    https://guni.ca/Advjs/index.html
*/

let timer;

document.querySelector('#customerDetails').addEventListener('submit', function(event) {
    event.preventDefault();

    // 3. Get all form values (Side Dish and Drinks)
    let name = document.querySelector('#fullName').value;
    let phone = document.querySelector('#phoneNumber').value;
    let date = document.querySelector('#pickupDate').value;
    let time = document.querySelector('#pickupTime').value;
    let instructions = document.querySelector('#specialInstructions').value;
    let sideDish = document.querySelector('#sideDish').value;
    let drinks = document.querySelector('#Drinks').value;

    // 4. Show side dish alert only if one is selected
    if (sideDish) {
        switch(sideDish) {
            case 'Rice':
                alert('Great choice!');
                break;
            case 'Naan':
                alert('Excellent!');
                break;
            case 'Fries':
                alert('Nice pick!');
                break;
        }
    }

    // Show drinks alert only if one is selected
    if (drinks) {
        switch(drinks) {
            case 'Coke':
                alert('Ice-cold Cola!');
                break;
            case 'Ginger':
                alert('Ginger-Ale is perfect for digestion.');
                break;
            case 'Energy':
                alert('We got you covered!');
                break;
        }
    }

    // 5. Special Instructions validation
    let isBadwords = false;
    try {
        if(instructions.toLowerCase().includes('badword')) {
            isBadwords = true;
            throw new Error('Please avoid using inappropriate language.');
        }
    } catch(error) {
        alert(error.message);
        return;
    }

    // Validate phone number
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(!phoneRegex.test(phone)) {
        alert('Phone number is not valid! Please use format: (123) 456-7890');
        return;
    }

    let nicePhone = phone.replace(phoneRegex, "($1) $2-$3");

    // Calculate preparation time
    let prepTime = 30; // base time is 30 minutes
    let hour = parseInt(time.split(':')[0]);
    
    //6.  Preparation time calculation using conditional operator
    prepTime = hour >= 17 ? prepTime + 15 : prepTime;

    // Create date object for pickup time
    let pickupTime = new Date(date + ' ' + time);
    
    // Validate pickup time
    let now = new Date();
    now.setSeconds(0, 0);
    pickupTime.setSeconds(0, 0);
    
    if(pickupTime < now) {
        alert('Cannot select a past date and time. Please select current or future time.');
        return;
    }

    let readyTime = new Date(pickupTime.getTime() + (prepTime * 60 * 1000));

    let niceTime = readyTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // 7. display order summary if no bad words were detected
    if (!isBadwords) {
        let summary = `
            <div class="order-summary">
                <h2>Order Summary</h2>
                <p>Name: ${name}</p>
                <p>Phone: ${nicePhone}</p>
                <p>Pickup Date: ${date}</p>
                <p>Ready By: ${niceTime}</p>
        `;

        // Only add side dish to summary if one was selected
        if(sideDish) {
            summary += `<p>Side Dish: ${sideDish}</p>`;
        }

        // Only add drink to summary if one was selected
        if(drinks) {
            summary += `<p>Drink Selection: ${drinks}</p>`;
        }

        if(instructions !== '') {
            summary += `<p><strong>Special Instructions:</strong> ${instructions}</p>`;
        }

        summary += `</div>
            <div id="timer" class="timer active">
                Time until ready: Calculating...
            </div>`;
     
        document.querySelector('#orderForm').innerHTML = summary;

        // Start the countdown
        startCountdown(readyTime);
    }
});

function startCountdown(endTime) {
    if(timer) {
        clearInterval(timer);
    }

    function updateTimer() {
        let now = new Date();
        let diff = endTime - now;
        let timerDiv = document.querySelector('#timer');

        if(diff <= 0) {
            timerDiv.textContent = "Order is Ready!";
            timerDiv.classList.remove('active');
            timerDiv.classList.add('expired');
            clearInterval(timer);
            return;
        }

        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if(hours < 10) hours = "0" + hours;
        if(minutes < 10) minutes = "0" + minutes;
        if(seconds < 10) seconds = "0" + seconds;

        let timerText = days > 0 
            ? `Time Left: ${days} day${days > 1 ? 's' : ''} ${hours}:${minutes}:${seconds}`
            : `Time Left: ${hours}:${minutes}:${seconds}`;

        timerDiv.textContent = timerText;
    }
  
    updateTimer();
    timer = setInterval(updateTimer, 1000);
}