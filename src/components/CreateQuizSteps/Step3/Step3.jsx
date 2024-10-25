import React from "react";
import { Box, Text, Button, Image } from "@chakra-ui/react";
import styles from "./Step3.module.scss";

const Step3 = ({ prevStep }) => {
  return (
    <Box className={styles.container}>
      <Text className={styles.congratulations}>Congratulations 🎉</Text>
      <Text className={styles.doneText}>
        You have completed the quiz setup!
      </Text>

      <Box className={styles.buttonContainer}>
        <Button onClick={prevStep} className={styles.previewButton}>
          Preview
        </Button>
        <Button className={styles.submitButton}>Submit</Button>
      </Box>
    </Box>
  );
};

export default Step3;
