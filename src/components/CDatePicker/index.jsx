import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@chakra-ui/react";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { CalendarIcon } from "@/assets/icons/commonIcons";

export default function CDatePicker({ value, onChange, disabled=false, ...props }) {
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      bg="white"
      w="full"
      minW='120px'
      border="1px solid #00000033"
      onClick={onClick}
      ref={ref}
    >
      {value ? value : <CalendarIcon />}
    </Button>
  ));

  return (
    <div>
      <DatePicker
        selected={value}
        disabled={disabled}
        onChange={(date) => onChange(date)}
        customInput={<CustomInput />}
        showTimeInput
        {...props}
      />
    </div>
  );
}
