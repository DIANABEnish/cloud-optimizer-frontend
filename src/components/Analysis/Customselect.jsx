import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './CustomSelect.scss';

const CustomSelect = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-wrapper" ref={dropdownRef}>
      {label && <label className="custom-select-label">{label}</label>}
      
      <div 
        className={`custom-select ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="custom-select-trigger">
          <span className="custom-select-value">{selectedOption?.label}</span>
          <ChevronDown 
            className={`custom-select-icon ${isOpen ? 'rotated' : ''}`} 
            size={16} 
          />
        </div>

        {isOpen && (
          <div className="custom-select-dropdown">
            {options.map((option) => (
              <div
                key={option.value}
                className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <span className="option-label">{option.label}</span>
                {value === option.value && (
                  <Check className="option-check" size={16} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;