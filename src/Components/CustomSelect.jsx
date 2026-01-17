/* eslint-disable react/prop-types */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import "../Styles/CustomSelect.css";
const CustomSelect = ({
  options,
  onChange,
  placeholder,
  isOpen,
  onClick,
  inculudeAll = false,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

 const handleSelect = (option, e) => {
  e.stopPropagation();
  setSelectedOption(option);
  onChange(option.value);
  onClick(e);
};
  return (
    <div className="select-container">
      <div className="select" onClick={(e) => onClick(e)}>
        <div className="placeholder">
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <div
          className={
            isOpen
              ? "drop-down-icon-container-rotate"
              : "drop-down-icon-container"
          }
        >
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
                onClick={(e) => handleSelect(option, e)}
                hidden={option.value == "All" && inculudeAll}
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
