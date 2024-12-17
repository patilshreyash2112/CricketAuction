import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const ToastNotification = (message) => {
  Toastify({
    text: message,
    duration: 3000, // Duration in milliseconds
    gravity: "top", // Position: top or bottom
    position: "right", // Position: left, center, or right
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Custom background color
    className: "info", // Optional custom class
    stopOnFocus: true, // Prevents dismissing on hover
  }).showToast();
};

export default ToastNotification;
