import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import "./SearchableMultiSelect.css";

export default function SearchableMultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef(null);
  const controlRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        !e.target.closest(".multiselect-dropdown-portal")
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = () => {
    if (controlRef.current) {
      const rect = controlRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen((prev) => !prev);
  };

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== option));
  };

  return (
    <div className="multiselect-wrapper" ref={wrapperRef}>
      {!isOpen && (
        <div
          className="multiselect-control"
          onClick={openDropdown}
          ref={controlRef}
        >
          <div className="multiselect-tags">
            {selected.length === 0 && (
              <span className="multiselect-placeholder">{placeholder}</span>
            )}
            {selected.map((item) => (
              <span key={item} className="multiselect-tag">
                {item}
                <FaTimes
                  className="tag-remove"
                  onClick={(e) => removeOption(item, e)}
                />
              </span>
            ))}
          </div>
          <FaChevronDown className="multiselect-arrow" />
        </div>
      )}

      {isOpen &&
        createPortal(
          <div
            className="multiselect-dropdown multiselect-dropdown-portal"
            style={{
              position: "absolute",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
            }}
          >
            <input
              type="text"
              className="multiselect-search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />

            <div className="multiselect-options">
              {filteredOptions.length === 0 ? (
                <div className="multiselect-empty">No results found</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    className={`multiselect-option ${
                      selected.includes(option) ? "selected" : ""
                    }`}
                    onClick={() => toggleOption(option)}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      readOnly
                    />
                    <span>{option}</span>
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}