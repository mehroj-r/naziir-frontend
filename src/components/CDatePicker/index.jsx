import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";

export default function CDatePicker({ ...props }) {
  const [startDate, setStartDate] = useState(new Date());
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      bg="white"
      w="full"
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
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        customInput={<CustomInput />}
        showTimeInput
        {...props}
      />
    </div>
  );
}
