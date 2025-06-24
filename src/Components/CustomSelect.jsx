/* eslint-disable react/prop-types */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const CustomSelect = ({ options, onChange, placeholder, isOpen, onClick }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    onClick();
  };

  return (
    <div className="select-container">
      <div className="select" onClick={onClick}>
        <div className="placeholder">
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <div className={isOpen? "drop-down-icon-container-rotate": "drop-down-icon-container"}>
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
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
