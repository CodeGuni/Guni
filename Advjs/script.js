/*
    Author: Gunpreet Singh
    Student Number: 9022194
    Course: PROG8681 – Advanced JavaScript Programming    Assignment 1

    Additional Features Implemented:
    1. Countdown Timer: Dynamic timer showing remaining time until order completion.
    2.Validation Enhancements: Preventing past date/time selections with clear alerts.
    3.Favicon Integration: Added a favicon for branding.
    4.Polished Order Summary: Clean and styled summary with conditional special instructions.
    
    
    5. Published on my website for testing and demonstration:    https://guni.ca/Advjs/index.html

*/


let timer;

document.querySelector('#customerDetails').addEventListener('submit', function(event) {
    // 3. Prevent form from submitting
    event.preventDefault();

    // 4. Get all the form values in their own variables
    let name = document.querySelector('#fullName').value;
    let phone = document.querySelector('#phoneNumber').value;
    let date = document.querySelector('#pickupDate').value;
    let time = document.querySelector('#pickupTime').value;
    let instructions = document.querySelector('#specialInstructions').value;

    // 5. Validate phone number using the regex and fire alert box if it's not valid
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(!phoneRegex.test(phone)) {
        alert('Phone number is not valid! Please use format: (123) 456-7890');
        return;
    }

    // Make phone number look nice and standardized
    let nicePhone = phone.replace(phoneRegex, "($1) $2-$3");

    // Calculate preparation time
    let prepTime = 30; // base time is 30 minutes
    
    // Get hour from pickup time
    let hour = parseInt(time.split(':')[0]);
    
    // 6. a) Add 15 minutes if it's after 5PM (hour >= 17)
    if(hour >= 17) {
        prepTime = prepTime + 15;
    }

    // Create date object for pickup time
    let pickupTime = new Date(date + ' ' + time);
    
    // Check if date is in the past (allowing current time)
    let now = new Date();
    // Set seconds and milliseconds to 0 for both times to allow current minute
    now.setSeconds(0, 0);
    pickupTime.setSeconds(0, 0);
    
    if(pickupTime < now) {
        alert('Cannot select a past date and time. Please select current or future time.');
        return;
    }

    // 7. Add preparation minutes to get completion time with date object
    let readyTime = new Date(pickupTime.getTime() + (prepTime * 60 * 1000));

    // Make the completion time look nice
    let niceTime = readyTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // 8. Create the order summary
    let summary = `
        <div class="order-summary">
            <h2>Order Summary</h2>
            <p>Name: ${name}</p>
            <p>Phone: ${nicePhone}</p>
            <p>Pickup Date: ${date}</p>
            <p>Ready By: ${niceTime}</p>
    `;

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
});

function startCountdown(endTime) {
   
    if(timer) {
        clearInterval(timer);
    }

    function updateTimer() {
        let now = new Date();
        let diff = endTime - now;
        let timerDiv = document.querySelector('#timer');


        // Check if time is up and clear timer
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

        // Create timer text based on whether days exist
        let timerText = days > 0 
            ? `Time Left: ${days} day${days > 1 ? 's' : ''} ${hours}:${minutes}:${seconds}`
            : `Time Left: ${hours}:${minutes}:${seconds}`;

        timerDiv.textContent = timerText;
    }
  
    updateTimer();
    
    timer = setInterval(updateTimer, 1000);
}