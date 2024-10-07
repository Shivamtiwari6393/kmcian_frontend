/* eslint-disable react/prop-types */
import { useState } from "react";

const CustomSelect = ({ options, onChange, placeholder, isOpen, onClick }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    onClick()
  };

  return (
    <div className="select-container">
      <div className="select" onClick={onClick}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <>
          <div className="select-options">
            {options.map((option) => (
              <div
                key={option.value}
                className="option"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelect;
