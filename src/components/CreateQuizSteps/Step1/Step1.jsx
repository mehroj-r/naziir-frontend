import {
  Text,
  Input,
  Select,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import styles from "./Step1.module.scss";

const Step1 = ({ nextStep, register }) => {

  return (
    <div className={styles.step1}>
      <h1 className={styles.heading}>Entering Quiz Info:</h1>
      <Grid pt='27px' justifyItems='center' templateColumns="repeat(2, 1fr)" gap='16px' mb="36px">
        
        {/* Quiz Name */}
        <GridItem>
          <label htmlFor="quizName">Write your quiz name:</label>
          <Input
            id="quizName"
            name="quizName"
            placeholder="Best methods"
            p='8px'
            borderColor='#00e0cb'
            {...register("quizName")}
          />
        </GridItem>

        {/* Start Date */}
        <GridItem className={styles.gridItem}>
          <label htmlFor="startDate">Starting date:</label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            className={styles.input}
            {...register("startDate")}
          />
        </GridItem>

        {/* Select Subject */}
        <GridItem className={styles.gridItem}>
          <label htmlFor="subject">Select subject:</label>
          <Select
            id="subject"
            name="subject"
            placeholder="Select subject"
            className={styles.input}
            {...register("subject")}
          >
            <option value="AI">Artificial Intelligence</option>
            <option value="GameDev">Game Development</option>
            <option value="Management">Management</option>
          </Select>
        </GridItem>

        {/* End Date */}
        <GridItem className={styles.gridItem}>
          <label htmlFor="endDate">Finishing date:</label>
          <Input
            id="endDate"
            type="date"
            name="endDate"
            className={styles.input}
            {...register("endDate")}
          />
        </GridItem>

        {/* Group */}
        <GridItem className={styles.gridItem}>
          <label htmlFor="group">Assign groups:</label>
          <Select
            name="group"
            id="group"
            placeholder="Select group"
            className={styles.input}
            {...register("group")}
          >
            <option value="groupA">Group A</option>
            <option value="groupB">Group B</option>
          </Select>
        </GridItem>

        {/* Number of Questions */}
        <GridItem className={styles.gridItem}>
          <label htmlFor="numQuestions">Number of questions:</label>
          <Input
            type="number"
            name="numQuestions"
            id="numQuestions"
            placeholder="30"
            className={styles.input}
            {...register("numQuestions")}
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
