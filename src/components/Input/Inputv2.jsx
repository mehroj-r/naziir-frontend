import { OutlinedInput } from "@mui/material";

export default function InputV2({
  startAdornment,
  borderRadius = "0.375rem",
  paddingRight = "4px",
  error,
  height = "32px",
  ...props
}) {
  return (
    <OutlinedInput
      fullWidth
      error={error}
      startAdornment={startAdornment}
      sx={{
        input: {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          height: height,
        },
        fontSize: "14px",
        borderRadius: borderRadius,
        height: height,
        paddingLeft: startAdornment ? "6px" : "8px",
        paddingRight,
        backgroundColor: "background.default",
        "& fieldset": {
          borderColor: "rgb(229, 233, 235)",
        },
        "&:hover fieldset": {
          borderColor: "var(--primary-color) !important",
        },
      }}
      {...props}
    />
  );
}
