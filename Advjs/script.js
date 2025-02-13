document.addEventListener("DOMContentLoaded", function () {
  const formInputs = document.querySelectorAll(
    "#customerDetails input, #customerDetails select, #customerDetails textarea"
  );

  formInputs.forEach((input) => {
    input.addEventListener("change", function () {
      localStorage.setItem(input.id, input.value);
      sessionStorage.setItem(input.id, input.value);
    });

    const storedValue = localStorage.getItem(input.id);
    if (storedValue) {
      input.value = storedValue;
    }
  });

  const welcomeMsg = document.getElementById("welcomeMsg");
  if (welcomeMsg) {
    if (
      sessionStorage.getItem("fullName") &&
      sessionStorage.getItem("fullName").trim() !== ""
    ) {
      welcomeMsg.textContent = `Welcome back, ${sessionStorage.getItem(
        "fullName"
      )}!`;
      welcomeMsg.style.display = "inline-block";
    } else {
      welcomeMsg.style.display = "none";
    }
  }

  let timer;

  document
    .querySelector("#customerDetails")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      // 3) Using .push() to store the form input values into the orderDetails array
      const orderDetails = [];
      orderDetails.push(
        document.querySelector("#fullName").value,
        document.querySelector("#phoneNumber").value,
        document.querySelector("#pickupDate").value,
        document.querySelector("#pickupTime").value,
        document.querySelector("#sideDish").value,
        document.querySelector("#Drinks").value,
        document.querySelector("#specialInstructions").value
      );

      // 4b) Special instructions try/catch to check for inappropriate language in orderDetails[6]

      let isBadwords = false;
      try {
        if (orderDetails[6].toLowerCase().includes("badword")) {
          isBadwords = true;
          throw new Error("Please avoid using inappropriate language.");
        }
      } catch (error) {
        alert(error.message);
        return;
      }
      // 4a) Side dish switch statement using array value at index 4 (Side Dish)
      if (orderDetails[4]) {
        switch (orderDetails[4]) {
          case "Rice":
            alert(`${orderDetails[4]} is a staple.`);
            break;
          case "Naan":
            alert(`${orderDetails[4]} is a popular choice.`);
            break;
          case "Fries":
            alert(`${orderDetails[4]} are a classic.`);
            break;
        }
      }
      // 4a) Drink section switch statement using array value at index 5 (Drink Selectoin)
      if (orderDetails[5]) {
        switch (orderDetails[5]) {
          case "Coke":
            alert(`${orderDetails[5]} is a classic.`);
            break;
          case "Ginger-Ale":
            alert(`${orderDetails[5]} is a great choice.`);
            break;
          case "Energy-Drink":
            alert(`${orderDetails[5]} is a popular choice.`);
            break;
        }
      }
      // 4c) Phone validation using the value at index 1 (Phone Number)

      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(orderDetails[1])) {
        alert("Phone number is not valid! Please use format: (123) 456-7890");
        return;
      }
      // 4f) Formatting phone number using regex replacement (index 1: Phone Number)

      let nicePhone = orderDetails[1].replace(phoneRegex, "($1) $2-$3");

      let prepTime = 1;

      // 4d) Capturing the hours and minutes for the pickup time (index 3) and using .map() for conversion
      const [hour, minute] = orderDetails[3]
        .split(":")
        .map((num) => parseInt(num));
      prepTime = hour >= 23 ? prepTime + 0 : prepTime;

      // 4e) Create a Date object for pickup time using pickup date (index 2) and pickup time (index 3)
      let pickupTime = new Date(
        orderDetails[2] + "T" + orderDetails[3] + ":00"
      );

      let now = new Date();
      let currentTime = now.getHours() * 60 + now.getMinutes();
      let selectedTime = hour * 60 + minute;

      const [year, month, day] = orderDetails[2].split("-").map(Number);
      let selectedDate = new Date(year, month - 1, day);

      let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (selectedDate < currentDate) {
        alert("Cannot select a past date.");
        return;
      } else if (
        selectedDate.getTime() === currentDate.getTime() &&
        selectedTime < currentTime
      ) {
        alert("Please select current time or a future time.");
        return;
      }

      let readyTime = new Date(pickupTime.getTime() + prepTime * 60 * 1000);
      // Format the ready time into a locale time string (5:45 PM)

      let niceTime = readyTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // 5) Copy of the orderDetails array to use 
      const orderDetailsCopy = [...orderDetails];

      // 6) Using .splice() to replace multiple values in one statement:
      let formattedDate = readyTime.toLocaleDateString("en-CA");
      orderDetailsCopy.splice(1, 3, nicePhone, formattedDate, niceTime);

      // Update the welcome message with the customer's name and store it in sessionStorage

      const welcomeMsg = document.getElementById("welcomeMsg");
      if (welcomeMsg && orderDetails[0].trim() !== "") {
        welcomeMsg.textContent = `Hold your hunger, ${orderDetails[0]}! Your order is cooking... literally. 🍳`;
        welcomeMsg.style.display = "inline-block";
        sessionStorage.setItem("fullName", orderDetails[0]);
      } else if (welcomeMsg) {
        welcomeMsg.style.display = "none";
      }
      // Persist the current values in localStorage again

      if (!isBadwords) {
        formInputs.forEach((input) => {
          localStorage.setItem(input.id, input.value);
        });
        // 7) Use a .forEach() loop over the copied array to output the order summary in a table format

        let summary = '<div class="order-summary"><h2>Order Summary</h2>';
        summary += "<table><tr><th>Field</th><th>Value</th></tr>";

        const labels = [
          "Name",
          "Phone",
          "Pickup Date",
          "Ready By",
          "Side Dish",
          "Drink Selection",
          "Special Instructions",
        ];

        orderDetailsCopy.forEach((detail, index) => {
          if (detail !== "") {
            if (labels[index] === "Special Instructions") {
              summary += `<tr><td>${labels[index]} :</td><td><strong>${detail}</strong></td></tr>`;
            } else {
              summary += `<tr><td>${labels[index]} :</td><td>${detail}</td></tr>`;
            }
          }
        });

        summary += `</table></div>
              <div id="timer" class="timer active">
                  Time until ready: Calculating...
              </div>`;

        document.querySelector("#orderForm").innerHTML = summary;
        startCountdown(readyTime);
      }
    });
});

function startCountdown(endTime) {
  if (timer) {
    clearInterval(timer);
  }

  function updateTimer() {
    let now = new Date();
    let diff = endTime - now;
    let timerDiv = document.querySelector("#timer");

    if (diff <= 0) {
      timerDiv.textContent = "Order is Ready!";
      timerDiv.classList.remove("active");
      timerDiv.classList.add("expired");
      clearInterval(timer);
      // Play a sound when the order is ready
      let sound = new Audio("/Advjs/ding-sound-effect_2.mp3");
      sound
        .play()
        .catch((error) => console.error("Error playing sound:", error));
      return;
    }

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    let timerText =
      days > 0
        ? `Time Left: ${days} day${
            days > 1 ? "s" : ""
          } ${hours}:${minutes}:${seconds}`
        : `Time Left: ${hours}:${minutes}:${seconds}`;

    timerDiv.textContent = timerText;
  }

  updateTimer();
  timer = setInterval(updateTimer, 1000);
}
