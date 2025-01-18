document.querySelector('#customerDetails').addEventListener('submit', function(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get pickup information
    const fullName = document.querySelector('#fullName').value;
    const phoneNumber = document.querySelector('#phoneNumber').value;
    const pickupDate = document.querySelector('#pickupDate').value;
    const pickupTime = document.querySelector('#pickupTime').value;
    const specialInstructions = document.querySelector('#specialInstructions').value;
        

    // Validate phone number
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(phoneNumber)){
        alert('Invalid phone number');
        return;
    }
    

    // Calculate pickup preparation time (base + extra time if after 5pm)
    const baasePreparationTime = 7; // base time in minutes
    const eveningExtraTime = 10;    // additional time in minutes only after 5pm
    const [hours, minutes] = pickupTime.split(':').map(Number);
    let preparationTime = baasePreparationTime;
    if (hours >= 17) {
                preparationTime += eveningExtraTime;
    }
    
    // Create a new Date object with the selected pickup date and time
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);

    // Add preparationTime to the completionTime


    // Format completion time
    

    // Format phone number
    

    // Format and display order summary
    

    document.querySelector('#orderForm').innerHTML = orderSummary;
    

});