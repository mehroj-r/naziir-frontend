import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";

export default function CDatePicker({ value, onChange, ...props }) {
  const [startDate, setStartDate] = useState(new Date());
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      bg="white"
      w="full"
      minW='80px'
      border="1px solid #00000033"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </Button>
  ));

  return (
    <div>
      <DatePicker
        selected={value}
        onChange={(date) => onChange(date)}
        customInput={<CustomInput />}
        showTimeInput
        {...props}
      />
    </div>
  );
}
