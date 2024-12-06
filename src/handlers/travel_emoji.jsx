import React from "react";

// Function to get icon based on the option
const getIconForOption = (option) => {
  switch (option.toLowerCase().trim()) {
    case "car":
      return "🚗"; // Car emoji
    case "metro":
      return "🚇"; // Metro emoji
    case "bus":
      return "🚌"; // Bus emoji
    case "ipt":
      return "🛺"; // Auto-rickshaw emoji
    case "two_wheeler":
      return "🚴"; // Two-wheeler emoji
    default:
      return "🚴"; // Default icon for unknown options
  }
};

const ChoiceInput = ({ emoji_required_for }) => {
  const option = emoji_required_for; // Assign the travel option to a variable

  return (
    <>
      <span className="text-2xl">{getIconForOption(option)}</span>
      {/* Option Text */}
      <span>{option}</span>

      {/* Icon for Option */}
    </>
  );
};

export default ChoiceInput;
