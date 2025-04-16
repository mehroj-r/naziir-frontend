import ReactAsyncSelect from "react-select/async";

const customStyles = ({ error, color, height, width, zIndex, maxHeight }) => {
  const isCompactHeight = height && parseInt(height) < 40;

  return {
    control: (base, { isDisabled }) => ({
      ...base,
      backgroundColor: isDisabled ? "#f2f2f2" : "transparent",
      minWidth: width || 176,
      width: width || "auto",
      borderRadius: 6,
      height: height || "auto",
      minHeight: height || 0,
      border: error ? "2px solid #F76659" : "1px solid rgb(229, 231, 235)",
      ":hover": {
        border: error ? "2px solid #f7675979" : "1px solid rgb(64, 148, 247)",
      },
      display: "flex",
      alignItems: "center",
    }),
    multiValue: (state, { data }) => ({
      ...state,
      border: "1px solid #D0D5DD",
      backgroundColor: "transparent",
      borderRadius: "4px",
      padding: `0px ${data?.isFixed ? "5px" : "0px"} 0px 0px`,
    }),
    multiValueLabel: (base) => ({
      ...base,
      lineHeight: "20px",
      fontSize: "14px",
      padding: "2px 0px",
      paddingLeft: "9px",
      color: "#303940",
    }),
    multiValueRemove: (base) => ({
      ...base,
      borderRadius: "4px",
      color: "#9AA6AC",
      fontSize: "16px",
      cursor: "pointer",
    }),
    input: (base) => ({
      ...base,
      color: color,
      margin: 0,
      padding: 0,
    }),
    singleValue: (base, { isDisabled }) => ({
      ...base,
      color: isDisabled ? "rgba(0, 0, 0, 0.38)" : color,
      margin: 0,
      display: "flex",
      alignItems: "center",
    }),
    placeholder: (base) => ({
      ...base,
      margin: 0,
      display: "flex",
      alignItems: "center",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: isCompactHeight ? "0 12px" : "8px 12px",
      fontSize: "14px",
      lineHeight: "140%",
      display: "flex",
      alignItems: "center",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: isCompactHeight ? "0 4px" : "6px 8px",
    }),
    menuPortal: (base) => ({ ...base, zIndex: zIndex || 1350 }),
    menu: (base) => ({
      ...base,
      zIndex: zIndex ? zIndex + 1 : 10,
      position: "absolute",
      maxHeight: "300px",
      overflowY: "auto",
    }),
    option: (base, { isDisabled, isSelected }) => ({
      ...base,
      fontWeight: 500,
      color: isDisabled ? "#3039408F" : isSelected ? "#fff" : "#303940",
      paddingLeft: isDisabled ? "6px" : "24px",
      borderBottom: "1px solid #E5E9EB",
      display: isDisabled ? "flex" : "block",
      alignItems: isDisabled ? "center" : undefined,
      gap: isDisabled ? "4px" : undefined,
      wordBreak: "break-all",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: isCompactHeight ? "0 4px" : "6px 8px",
      display: "none",
    }),
  };
};

export default function CAsyncSelect({
  height,
  width,
  color = "#000",
  error,
  placeholder = "Выберите опции",
  zIndex,
  maxHeight,
  ...props
}) {
  return (
    <ReactAsyncSelect
      placeholder={placeholder}
      styles={customStyles({
        color,
        error,
        height,
        width,
        zIndex,
        maxHeight,
      })}
      menuPortalTarget={document.body}
      {...props}
    />
  );
}
