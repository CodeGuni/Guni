# Assignment 4 - Enhancing the Order Form with JavaScript Arrays

## Student Information:
**Name:** Gunpreet Singh  
**Student Number:** 9022194  

## Extra Features and Enhancements:
Beyond the assignment requirements, I implemented several additional features to improve usability, security, and visual appeal. Below are the key enhancements I made:

### 1. **Local Storage and Session Storage Integration**
- Implemented **localStorage** and **sessionStorage** to persist user input across page reloads.
- When the user returns, previously entered values are auto-filled in the form fields.
- A **welcome message** appears if a name is stored in sessionStorage.
- The **customer's name is displayed on the summary page** after order submission.

### 2. **Improved Order Submission Handling**
- Used `push()` to store form values in an array as per the assignment.
- Included a **try/catch block** to detect and prevent inappropriate language in the special instructions field.
- Implemented **switch statements** for both side dish and drink selections with user-friendly alerts.
- **Special instructions are bolded in the order summary** for better visibility.

### 3. **Enhanced Form Validation**
- **Phone Number Validation**: Implemented regex to ensure users enter a valid phone number format `(123) 456-7890`.
- **Date and Time Validation**: Prevents users from selecting past dates or times.
- **Pickup Time Adjustment**: Automatically adjusts preparation time if the order is placed after 7 PM.
- **Timezone Offset Handling**: Adjusted the pickup time based on local timezone differences.

### 4. **Formatted Output and Order Summary Table**
- Used `splice()` to modify the orderDetails array to format phone numbers and timestamps correctly.
- Used `.forEach()` to generate an **order summary table** dynamically after submission.
- Applied **conditional formatting** for special instructions in the order summary.
- Displayed **formatted pickup date and time** on the summary page.
- **Added extra styling for better readability of order details.**
- **Displayed the user's name prominently on the order summary page.**

### 5. **Real-Time Order Countdown Timer**
- Added a **countdown timer** that updates every second to show the remaining time until the order is ready.
- If the timer reaches zero, it displays **"Order is Ready!"**.
- Included a **sound effect (ding)** when the order is ready.
- **Made the timer dynamically update based on timezone offsets.**

## Conclusion:
This project goes beyond the assignment requirements by adding **storage persistence, enhanced validation, real-time updates, improved UI, better accessibility, timezone handling, and a fun user experience**. These extra features significantly improve the usability and engagement of the order form, making it more interactive and professional.
