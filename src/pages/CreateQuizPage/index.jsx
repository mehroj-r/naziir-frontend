import Card from "@/components/Card";
import CAsyncSelect from "@/components/CAsyncSelect";
import CDatePicker from "@/components/CDatePicker";
import Form from '@/components/Form';
import { courseService } from "@/services/course.service";
import { groupsService } from "@/services/groups.service";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCallback } from "react";

export default function CreateQuizPage() {
  
  const initialValues = {
    startTime: null,
    endTime: null,
    groups: null,
    
  }

  const onSubmit = () => {
    
  }

  const formik = useFormik({
    onSubmit,
    initialValues,
    // validationSchema,
  });

  const { values, setFieldValue, setValues, handleChange } = formik;

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
    <Box p={4}>
      <Card >
        <Flex gap={4} justifyContent='space-between' >
          <Form.Item formik={formik} name='startTime' label='Start Time'>
            <CDatePicker />
          </Form.Item>
          <Form.Item formik={formik} name='startTime' label='End Time'>
            <CDatePicker />
          </Form.Item>
          <Form.Item formik={formik} name='groups' label='Groups'>
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
          </Form.Item>
          <Form.Item formik={formik} name='course' label='Course'>
            <CAsyncSelect
              id="course"
              name="course"
              defaultOptions
              cacheOptions
              isMulti
              isSearchable
              isClearable
              value={values.course}
              loadOptions={loadCourse}
              placeholder="Select group(s)"
              onChange={(val) => setFieldValue("course", val)}
            />
          </Form.Item>
        </Flex>
      </Card>
    </Box>
  )
}