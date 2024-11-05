import React from "react";
import {
  Box,
  Text,
  Input,
  Select,
  Grid,
  GridItem,
  Button,
} from "@chakra-ui/react";
import styles from "./Step1.module.scss";

const Step1 = ({ nextStep }) => {
  const [quizDetails, setQuizDetails] = React.useState({
    quizName: "",
    subject: "",
    startDate: "",
    endDate: "",
    group: "",
    numQuestions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className={styles.step1}>
      <h1 className={styles.heading}>Entering Quiz Info:</h1>
      <Grid pt='27px' justifyItems='center' templateColumns="repeat(2, 1fr)" gap='16px' mb="36px">
        {/* Quiz Name */}
        <GridItem>
          <label>Write your quiz name:</label>
          <Input
            name="quizName"
            placeholder="Best methods"
            value={quizDetails.quizName}
            onChange={handleChange}
            border='1px solid #02d5f2'
            p='8px'
          />
        </GridItem>

        {/* Start Date */}
        <GridItem className={styles.gridItem}>
          <Text mb={2}>Starting date:</Text>
          <Input
            type="date"
            name="startDate"
            value={quizDetails.startDate}
            onChange={handleChange}
            className={styles.input}
          />
        </GridItem>

        {/* Select Subject */}
        <GridItem className={styles.gridItem}>
          <Text mb={2}>Select subject:</Text>
          <Select
            name="subject"
            placeholder="Select subject"
            value={quizDetails.subject}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="math">Artificial Intelligence</option>
            <option value="science">Game Development</option>
            <option value="history">Management</option>
          </Select>
        </GridItem>

        {/* End Date */}
        <GridItem className={styles.gridItem}>
          <Text mb={2}>Finishing date:</Text>
          <Input
            type="date"
            name="endDate"
            value={quizDetails.endDate}
            onChange={handleChange}
            className={styles.input}
          />
        </GridItem>

        {/* Group */}
        <GridItem className={styles.gridItem}>
          <Text mb={2}>Assign groups:</Text>
          <Select
            name="group"
            placeholder="Select group"
            value={quizDetails.group}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="groupA">Group A</option>
            <option value="groupB">Group B</option>
          </Select>
        </GridItem>

        {/* Number of Questions */}
        <GridItem className={styles.gridItem}>
          <Text mb={2}>Number of questions:</Text>
          <Input
            type="number"
            name="numQuestions"
            placeholder="30"
            value={quizDetails.numQuestions}
            onChange={handleChange}
            className={styles.input}
          />
        </GridItem>
      </Grid>

      <button
        className={styles.submitButton}
        onClick={() => nextStep()}
      >
        Next
      </button>
    </div>
  );
};

export default Step1;
