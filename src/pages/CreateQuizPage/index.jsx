import Card from "@/components/Card";
import styles from "./CreateQuizPage.module.scss";
import CAsyncSelect from "@/components/CAsyncSelect";
import CDatePicker from "@/components/CDatePicker";
import CSelect from "@/components/CSelect";
import FormItem from "@/components/FormItem";
import { courseService } from "@/services/course.service";
import { groupsService } from "@/services/groups.service";
import { quizService } from "@/services/quizService";
import { QUIZ_TYPE_OPTIONS, REVEAL_MODE_OPTIONS } from "@/utils/const/quiz";
import { customToast } from "@/utils/toastify";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Switch,
  Textarea,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCallback } from "react";

const BORDER_COLOR = "#081545";

const INITIAL_VALUES = {
  title: "",
  course: null,
  groups: null,
  startTime: null,
  endTime: null,
  shuffle: false,
  numberOfVersions: 1,
  description: "",
  quizType: null,
  revealAt: null,
  revealMode: null,
  overallScore: 0,
};

export default function CreateQuizPage() {

  const onSubmit = (values) => {
    function fmt(date) {
      if (!date) return null;
      const d = typeof date === "string" ? new Date(date) : date;
      const shifted = new Date(d.getTime() + 5 * 60 * 60 * 1000);
      return shifted.toISOString().slice(0, 19);
    }

    const body = {
      title: values?.title,
      courseId: values?.course?.value,
      groupIds: values?.groups?.map((item) => item?.value),
      startTime: fmt(values.startTime),
      endTime: fmt(values.endTime),
      shuffle: values?.shuffle,
      numberOfVersions: values?.numberOfVersions,
      description: values?.description,
      quizType: values?.quizType?.value,
      revealAt: fmt(values.revealAt),
      revealMode: values?.revealMode?.value,
      overallScore: String(values?.overallScore),
    };

    quizService
      .create(body)
      .then(() => customToast("success", "Quiz created successfully"))
      .catch((err) => console.log("create quiz err:", err));
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit,
  });

  const { values, setFieldValue, handleChange, handleSubmit } = formik;

  const loadGroups = useCallback((input, cb) => {
    groupsService
      .getAll({ page: 1, limit: 20, name: input })
      .then((res) => {
        let options = res?.data?.data?.map((elm) => ({
          label: elm?.name,
          value: elm?.id,
        }));
        cb(options);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadCourse = useCallback((input, cb) => {
    courseService
      .getAll({ page: 1, limit: 20, name: input })
      .then((res) => {
        let options = res?.data?.data?.map((elm) => ({
          label: elm?.courseCode + " " + elm?.courseName,
          value: elm?.id,
        }));
        cb(options);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box className={styles.createQuizPage} px={4} py={6} maxW="3xl" mx="auto">
      <Heading fontSize="2xl" mb={6} color="blue.900">
        Create Quiz
      </Heading>

      <Card
        border={`1px solid ${BORDER_COLOR}`}
        p={6}
        borderRadius="2xl"
        boxShadow="sm"
      >
        <VStack spacing={5} align="stretch">
          <FormItem label="Title">
            <Input
              name="title"
              value={values.title}
              placeholder="Enter title"
              onChange={handleChange}
              borderColor={BORDER_COLOR}
            />
          </FormItem>

          <FormItem label="Description">
            <Textarea
              name="description"
              placeholder="Enter description"
              value={values.description}
              onChange={handleChange}
              borderColor={BORDER_COLOR}
            />
          </FormItem>

          <FormItem label="Groups">
            <CAsyncSelect
              id="groups"
              name="groups"
              defaultOptions
              cacheOptions
              isMulti
              isSearchable
              isClearable
              value={values.groups}
              loadOptions={loadGroups}
              placeholder="Select group(s)"
              onChange={(val) => setFieldValue("groups", val)}
              styles={{ control: (base) => ({ ...base, BORDER_COLOR }) }}
            />
          </FormItem>

          <FormItem label="Course">
            <CAsyncSelect
              id="course"
              name="course"
              defaultOptions
              cacheOptions
              isSearchable
              isClearable
              value={values.course}
              loadOptions={loadCourse}
              placeholder="Select course"
              onChange={(val) => setFieldValue("course", val)}
              styles={{ control: (base) => ({ ...base, BORDER_COLOR }) }}
            />
          </FormItem>

          <Divider borderColor={BORDER_COLOR} />

          <FormItem label="Start Time">
            <CDatePicker
              value={values?.startTime}
              onChange={(val) => setFieldValue("startTime", val)}
              borderColor={BORDER_COLOR}
            />
          </FormItem>

          <FormItem label="End Time">
            <CDatePicker
              value={values?.endTime}
              onChange={(val) => setFieldValue("endTime", val)}
              borderColor={BORDER_COLOR}
            />
          </FormItem>

          <FormItem label="Number of Versions">
            <Input
              type="number"
              name="numberOfVersions"
              placeholder="Enter number of versions"
              value={values.numberOfVersions}
              onChange={handleChange}
              borderColor={BORDER_COLOR}
            />
          </FormItem>

          <FormItem label="Quiz Type">
            <CSelect
              options={QUIZ_TYPE_OPTIONS}
              value={values.quizType}
              onChange={(val) => setFieldValue("quizType", val)}
              styles={{ control: (base) => ({ ...base, BORDER_COLOR }) }}
            />
          </FormItem>

          <FormItem label="Shuffle Questions">
            <Switch
              isChecked={values.shuffle}
              name="shuffle"
              onChange={() => setFieldValue("shuffle", !values.shuffle)}
              borderColor={BORDER_COLOR}
            />
          </FormItem>

          <FormItem label="Reveal Mode">
            <CSelect
              options={REVEAL_MODE_OPTIONS}
              value={values.revealMode}
              onChange={(val) => setFieldValue("revealMode", val)}
              styles={{ control: (base) => ({ ...base, BORDER_COLOR }) }}
            />
          </FormItem>

          <FormItem label="Reveal Time (if reveal mode is 'custom')">
            <CDatePicker
              value={values?.revealAt}
              disabled={values.revealMode?.value !== "CUSTOM"}
              onChange={(val) => setFieldValue("revealAt", val)}
              borderColor={BORDER_COLOR}
            />
          </FormItem>

          <FormItem label="Overall Score">
            <Input
              type="number"
              name="overallScore"
              placeholder="Enter total score"
              value={values.overallScore}
              onChange={handleChange}
              borderColor={BORDER_COLOR}
            />
          </FormItem>
        </VStack>
      </Card>

      <Flex justify="flex-end" mt={6}>
        <Button
          colorScheme="blue"
          px={6}
          onClick={handleSubmit}
          borderRadius="xl"
        >
          Create Quiz
        </Button>
      </Flex>
    </Box>
  );
}
