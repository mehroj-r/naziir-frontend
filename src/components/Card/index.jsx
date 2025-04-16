import { Box } from "@chakra-ui/react";

export default function Card({ children, ...props }) {
  return(
    <Box
      border='1px solid #00000033'
      p={4}
      rounded={8}
      {...props}
    > 
      {children}
    </Box>
  )
}