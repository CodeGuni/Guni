// 3. Added page load event listener  4.// moved all the existing code inside the event listener
document.addEventListener("DOMContentLoaded", function () {
  // 5. Capture all form inputs using querySelectorAll
  const formInputs = document.querySelectorAll(
    "#customerDetails input, #customerDetails select, #customerDetails textarea"
  );

  // 7. Add change event listeners for local and session storage
  formInputs.forEach((input) => {
    input.addEventListener("change", function () {
      localStorage.setItem(input.id, input.value);
      sessionStorage.setItem(input.id, input.value);
    });

    // 6. Load stored values if they exist
    const storedValue = localStorage.getItem(input.id);
    if (storedValue) {
      input.value = storedValue;
    }
  });

  // 9. Check for welcome back message  only display when it exists
  const welcomeMsg = document.getElementById("welcomeMsg");
  if (welcomeMsg) {
    if (sessionStorage.getItem("fullName") && sessionStorage.getItem("fullName").trim() !== "") {
      welcomeMsg.textContent = `Welcome back, ${sessionStorage.getItem("fullName")} !`;
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

      let name = document.querySelector("#fullName").value;
      let phone = document.querySelector("#phoneNumber").value;
      let date = document.querySelector("#pickupDate").value;
      let time = document.querySelector("#pickupTime").value;
      let instructions = document.querySelector("#specialInstructions").value;
      let sideDish = document.querySelector("#sideDish").value;
      let drinks = document.querySelector("#Drinks").value;

      if (sideDish) {
        switch (sideDish) {
          case "Rice":
            alert("Great choice!");
            break;
          case "Naan":
            alert("Excellent!");
            break;
          case "Fries":
            alert("Nice pick!");
            break;
        }
      }
      if (drinks) {
        switch (drinks) {
          case "Coke":
            alert("Ice-cold Cola!");
            break;
          case "Ginger":
            alert("Ginger-Ale is perfect for digestion.");
            break;
          case "Energy":
            alert("We got you covered!");
            break;
        }
      }

      let isBadwords = false;
      try {
        if (instructions.toLowerCase().includes("badword")) {
          isBadwords = true;
          throw new Error("Please avoid using inappropriate language.");
        }
      } catch (error) {
        alert(error.message);
        return;
      }

      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(phone)) {
        alert("Phone number is not valid! Please use format: (123) 456-7890");
        return;
      }

      let nicePhone = phone.replace(phoneRegex, "($1) $2-$3");

      let prepTime = 30; // base time is 30 minutes
      let hour = parseInt(time.split(":")[0]);

      prepTime = hour >= 17 ? prepTime + 15 : prepTime;

      // Create date object for pickup time
      let pickupTime = new Date(date + " " + time);

      // Validate pickup time
      let now = new Date();
      now.setSeconds(0, 0);
      pickupTime.setSeconds(0, 0);

      if (pickupTime < now) {
        alert(
          "Cannot select a past date and time. Please select current or future time."
        );
        return;
      }

      let readyTime = new Date(pickupTime.getTime() + prepTime * 60 * 1000);

      let niceTime = readyTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const welcomeMsg = document.getElementById("welcomeMsg");
      if (welcomeMsg && name.trim() !== "") {
        welcomeMsg.textContent = `Hold your hunger, ${name}! Your order is cooking... literally. 🍳`;
        welcomeMsg.style.display = "inline-block";
        
        // Update session storage with the new name
        sessionStorage.setItem("fullName", name);
      } else if (welcomeMsg) {
        welcomeMsg.style.display = "none";
      }

      // display order summary if no bad words were detected
      if (!isBadwords) {
        // Store all input values in Local Storage
        formInputs.forEach((input) => {
          localStorage.setItem(input.id, input.value);
        });

        let summary = `
                  <div class="order-summary">
                      <h2>Order Summary</h2>
                      <p>Name: ${name}</p>
                      <p>Phone: ${nicePhone}</p>
                      <p>Pickup Date: ${date}</p>
                      <p>Ready By: ${niceTime}</p>
              `;

        // Only add side dish to summary if one was selected
        if (sideDish) {
          summary += `<p>Side Dish: ${sideDish}</p>`;
        }

        // Only add drink to summary if one was selected
        if (drinks) {
          summary += `<p>Drink Selection: ${drinks}</p>`;
        }

        if (instructions !== "") {
          summary += `<p><strong>Special Instructions:</strong> ${instructions}</p>`;
        }

        summary += `</div>
                  <div id="timer" class="timer active">
                      Time until ready: Calculating...
                  </div>`;

        document.querySelector("#orderForm").innerHTML = summary;

        // Start the countdown
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
