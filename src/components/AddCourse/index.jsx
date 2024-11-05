import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Input,
  Select,
  Grid,
  GridItem,
  Button,
} from "@chakra-ui/react";
import styles from "./AddCourse.module.scss";

const AddCourse = () => {
  const navigate = useNavigate();

  const [courseDetails, setCourseDetails] = React.useState({
    courseName: "",
    semester: "",
    credits: "",
    weeksNumber: "",
    passingPoint: "",
    syllabus: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className={styles.step1}>
      <h1 className={styles.heading}>Entering Course Info:</h1>
      <Grid
        pt="27px"
        justifyItems="center"
        templateColumns="repeat(2, 1fr)"
        gap="16px"
        mb="36px"
      >
        <GridItem className={styles.gridItem}>
          <Text mb={2}>Course Name:</Text>
          <Input
            name="courseName"
            placeholder="Enter course name"
            value={courseDetails.courseName}
            onChange={handleChange}
            className={styles.input}
          />
        </GridItem>

        <GridItem className={styles.gridItem}>
          <Text mb={2}>Semester:</Text>
          <Select
            name="semester"
            placeholder="Select semester"
            value={courseDetails.semester}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="fall">Fall</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
          </Select>
        </GridItem>

        <GridItem className={styles.gridItem}>
          <Text mb={2}>Credits:</Text>
          <Input
            type="number"
            name="credits"
            placeholder="Enter credits"
            value={courseDetails.credits}
            onChange={handleChange}
            className={styles.input}
          />
        </GridItem>

        <GridItem className={styles.gridItem}>
          <Text mb={2}>Number of Weeks:</Text>
          <Input
            type="number"
            name="weeksNumber"
            placeholder="Enter number of weeks"
            value={courseDetails.weeksNumber}
            onChange={handleChange}
            className={styles.input}
          />
        </GridItem>

        <GridItem className={styles.gridItem}>
          <Text mb={2}>Passing Point:</Text>
          <Input
            type="number"
            name="passingPoint"
            placeholder="Enter passing point"
            value={courseDetails.passingPoint}
            onChange={handleChange}
            className={styles.input}
          />
        </GridItem>

        <GridItem className={styles.gridItem}>
          <Text mb={2}>Syllabus Link:</Text>
          <Input
            name="syllabus"
            placeholder="Link to syllabus"
            value={courseDetails.syllabus}
            onChange={handleChange}
            className={styles.input}
          />
        </GridItem>
      </Grid>

      <button
        className={styles.submitButton}
        onClick={() => navigate("/courses")}
      >
        Back
      </button>
    </div>
  );
};

export default AddCourse;
