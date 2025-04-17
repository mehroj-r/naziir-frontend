import Card from "@/components/Card";
import CAsyncSelect from "@/components/CAsyncSelect";
import CDatePicker from "@/components/CDatePicker";
import CSelect from "@/components/CSelect";
import FormItem from "@/components/FormItem";
import { courseService } from "@/services/course.service";
import { groupsService } from "@/services/groups.service";
import { quizService } from "@/services/quizService";
import { QUIZ_TYPE_OPTIONS, REVEAL_MODE_OPTIONS } from "@/utils/const/quiz";
import { customToast } from "@/utils/toastify";
import { Box, Button, Flex, Heading, Input, SimpleGrid, Switch, Textarea, VStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCallback } from "react";

export default function CreateQuizPage() {
  
  const boddy = {
    "title": "General Knowledge Quiz",
    "courseId": "4e9f9a0d-1234-4d5b-8c77-abcdef012345", // "syllabusId": "5eaf9b0d-2345-5e6b-9d88-abcdef012345", // optional, but it is working
    "groupIds": [ // Groups that should take quiz only ids should be provided as a list
      "6fae9c0d-3456-6f7b-ad99-abcdef012345",
      "7gaf9d0d-4567-7g8b-beaa-abcdef012345"
    ],
    "startTime": "2025-04-15T06:00:00", // With exact time and seconds
    "endTime": "2025-04-15T06:30:00",
    "shuffle": true, // Options in MCQ will be shuffled
    "numberOfVersions": 3, //A, B, C
    "description": "This quiz covers general knowledge topics.",
    "quizType": "EXAM", // GENERAL_TRAINING, LAB, LECTURE, MIDTERM, FINAL, EXAM
    "revealAt": "2025-04-20T13:00:00", // When to reveal answer if revealMode is set to CUSTOM
    "revealMode": "GRADING_COMPLETE", // When to reveal if revealAt not provided: IMMEDIATE (as soon as student finishes the quiz), GRADING_COMPLETE (When professor finishes grading), CUSTOM (when revealAt set)
    "overallScore": "100.0" // no max and no min for it
  }

  const initialValues = {
    title: '',
    course: null,
    groups: null,
    startTime: null,
    endTime: null,
    shuffle: false,
    numberOfVersions: 1,
    description: '',
    quizType: null,
    revealAt: null,
    revealMode: null,
    overallScore: 0
  }

  const onSubmit = (values) => {
    console.log("values", values) // log
    function fmt(date) {
      if (!date) return null;
      const d = typeof date === "string" ? new Date(date) : date;
      const shifted = new Date(d.getTime() + 5 * 60 * 60 * 1000);
      return shifted.toISOString().slice(0, 19);  // e.g. "2025-03-31T19:23:00"
    }    

    const body = {
      title: values?.title,
      courseId: values?.course?.value,
      groupIds: values?.groups?.map(item => item?.value),
      startTime: fmt(values.startTime),
      endTime: fmt(values.endTime),
      shuffle: values?.shuffle,
      numberOfVersions: values?.numberOfVersions,
      description: values?.description,
      quizType: values?.quizType?.value,
      revealAt: fmt(values.revealAt),
      revealMode: values?.revealMode?.value,
      overallScore: String(values?.overallScore)
    }
    
    quizService.create(body).then((res) => {
      console.log("create quiz res:", res) // log
      customToast("success", "Quiz created successfully")
    }).catch(err => {
      console.log("create quiz err:", err) // log
    }).finally(() => {
      
    })
  }

  const formik = useFormik({
    onSubmit,
    initialValues,
    // validationSchema,
  });

  const { values, setFieldValue, setValues, handleChange, handleSubmit } = formik;
  console.log("onchange values:", values) // log

  const loadGroups = useCallback((input, cb) => {
    groupsService.getAll({ page: 1, limit: 20, name: input })
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
    courseService.getAll({ page: 1, limit: 20, name: input })
      .then((res) => {
        console.log("course res:", res) // log
        let options = res?.data?.data?.map((elm) => ({
          label: elm?.courseCode +" "+ elm?.courseName,
          value: elm?.id,
        }));
        cb(options);
      })
      .catch((error) => console.log(error));
  }, []);
  

  return(
    <Box p={4} mb={8}>
      <Heading mb={4}>
        Create Quiz
      </Heading>
      <SimpleGrid templateColumns='1fr 1fr' gap={4} mb={4}>
        <Card>
          <Flex direction='column' gap={4}>
            <FormItem label="Title" htmlFor='title'>
              <Input
                name="title"
                value={values.title}
                placeholder="Enter Title"
                onChange={handleChange}
              />
            </FormItem>
            <FormItem label='Description'>
              <Textarea
                name='description'
                placeholder="Enter description"
                value={values.description}
                onChange={handleChange}
              />
            </FormItem>
            <FormItem label='Groups'>
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
              />
            </FormItem>
            <FormItem label='Course'>
              <CAsyncSelect
                id="course"
                name="course"
                defaultOptions
                cacheOptions
                isSearchable
                isClearable
                value={values.course}
                loadOptions={loadCourse}
                placeholder="Select Course"
                onChange={(val) => setFieldValue("course", val)}
              />
            </FormItem>
          </Flex>
        </Card>
        <Card>
          <Flex direction='column' gap={4}>
            <Flex gap={4} justifyContent='space-between' >
              <FormItem label='Start Time'>
                <CDatePicker 
                  value={values?.startTime}
                  onChange={(val) => setFieldValue('startTime', val)}
                />
              </FormItem>
              <FormItem label='End Time'>
                <CDatePicker
                  value={values?.endTime}
                  onChange={(val) => setFieldValue('endTime', val)}
                />
              </FormItem>
            </Flex>
            <FormItem label="Number of versions">
              <Input 
                type="number" 
                placeholder="Number of versions" 
                name='numberOfVersions' 
                value={values.numberOfVersions} 
                onChange={handleChange}
              />
            </FormItem>
            <FormItem label="Quiz Type">
              <CSelect 
                options={QUIZ_TYPE_OPTIONS}
                value={values?.quizType}
                onChange={val => setFieldValue('quizType', val)}
              />
            </FormItem>
            <FormItem label="Shuffle">
              <Switch 
                value={values?.shuffle}
                name="shuffle"
                onChange={handleChange}
              />
            </FormItem>
            <FormItem label="Reveal Mode">
              <CSelect 
                options={REVEAL_MODE_OPTIONS} 
                value={values?.revealMode}
                onChange={val => setFieldValue('revealMode', val)}
              />
            </FormItem>
            <FormItem label="Reveal Time">
              <CDatePicker
                value={values?.revealTime}
                onChange={(val) => setFieldValue('revealTime', val)}
              />
            </FormItem>
            <FormItem>
              <Input 
                placeholder="Overall Score"
                type="number"
                name="overallScore"
                value={values.overallScore}
                onChange={handleChange}
              />
            </FormItem>
          </Flex>
        </Card>
      </SimpleGrid>
      <Flex justifyContent='end'>
        <Button onClick={handleSubmit}>
          Create
        </Button>
      </Flex>
    </Box>
  )
}