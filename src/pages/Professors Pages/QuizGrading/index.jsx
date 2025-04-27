import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  Spinner,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { quizService } from "../../../services/quizService";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const GradeQuiz = () => {
  const { id } = useParams();
  const toast = useToast();
  const [gradingData, setGradingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [points, setPoints] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [gradedQuestions, setGradedQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await quizService.getQuizGradingReport(id);
        const formatted = res?.questionReports || [];

        const initialPoints = {};
        const initialAnswers = {};
        const initialFeedbacks = {};

        formatted.forEach((q) => {
          initialPoints[q.questionVersionId] = q.groups[0]?.actualPoints || 0;

          const selected = q.groups.find(
            (g) => g.teacherGradeOverride !== null
          );
          if (selected) {
            initialAnswers[q.questionVersionId] = String(selected.answer);
            initialFeedbacks[q.questionVersionId] =
              selected.teacherFeedback || "";
          } else {
            initialFeedbacks[q.questionVersionId] = "";
          }
        });

        setGradingData(formatted);
        setPoints(initialPoints);
        setSelectedAnswers(initialAnswers);
        setFeedbacks(initialFeedbacks);
      } catch (err) {
        toast({
          title: "Failed to load grading data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, toast]);

  const handleSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handlePointChange = (questionId, value) => {
    setPoints((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleFeedbackChange = (questionId, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (question) => {
    const selectedGroupId = selectedAnswers[question.questionVersionId];
    const point = parseFloat(points[question.questionVersionId]);
    const feedback = feedbacks[question.questionVersionId] || "";

    if (!selectedGroupId) {
      toast({
        title: "No answer selected",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const selectedGroup = question.groups.find(
      (g) => String(g.answer) === selectedGroupId
    );

    const payload = {
      questionVersionId: question.questionVersionId,
      answerGroup: selectedGroup.answer,
      overrideGrade: point,
      feedback,
      ...(question.questionType === "MULTIPLE_CHOICE" && {
        answerOptionId: selectedGroup.answerOptionId,
      }),
    };

    try {
      await quizService.gradeQuestion(payload);

      setGradedQuestions((prev) => [
        ...new Set([...prev, question.questionVersionId]),
      ]);

      toast({
        title: "Graded successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Grading failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFinishGrading = async () => {
    try {
      await quizService.changeQuizStatus(id, "GRADED");
      toast({
        title: "Quiz marked as GRADED!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to finish grading",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading)
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <Box p={6} maxW="600px" mx="auto">
      {gradingData.map((q, index) => (
        <Box
          key={q.questionVersionId}
          border="1px solid #e2e8f0"
          borderRadius="lg"
          boxShadow="md"
          p={4}
          mb={6}
          bg="white"
        >
          <Text fontSize="sm" color="gray.600" mb={1}>
            {q.questionType === "MULTIPLE_CHOICE" && "Multiple choice"}
            {q.questionType === "SHORT_ANSWER" && "Short answer"}
            {q.questionType === "TRUE_FALSE" && "True/False"}
          </Text>

          <Text fontWeight="semibold" mb={3}>
            Question {index + 1}
          </Text>

          <Text
            bg="#f5f5f5"
            borderRadius="md"
            p={2}
            mb={4}
            fontSize="sm"
            fontWeight="medium"
          >
            {q.questionContent}
          </Text>

          <RadioGroup
            onChange={(val) => handleSelect(q.questionVersionId, val)}
            value={selectedAnswers[q.questionVersionId] || ""}
          >
            <Stack spacing={3}>
              {q.groups.map((group, idx) => (
                <Flex
                  key={idx}
                  align="center"
                  p={3}
                  border="1px solid #e2e8f0"
                  borderRadius="md"
                  _hover={{ bg: "#f9f9f9" }}
                >
                  <Box
                    flexShrink={0}
                    minW="100px"
                    fontSize="sm"
                    color="gray.500"
                  >
                    {group.count} answers
                  </Box>
                  <Radio
                    value={String(group.answer)}
                    colorScheme="teal"
                    mr={3}
                  />
                  <Input
                    value={group.answer}
                    size="sm"
                    variant="unstyled"
                    readOnly
                    borderBottom="1px solid #ccc"
                  />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>

          {q.questionType === "SHORT_ANSWER" && (
            <Box mt={4}>
              <Text fontSize="sm" mb={1} color="gray.600">
                Feedback (optional)
              </Text>
              <Textarea
                size="sm"
                placeholder="Provide feedback here"
                value={feedbacks[q.questionVersionId] || ""}
                onChange={(e) =>
                  handleFeedbackChange(q.questionVersionId, e.target.value)
                }
              />
            </Box>
          )}

          <Box mt={4}>
            <Text fontSize="sm" mb={1} color="red.500">
              Point *
            </Text>
            <Input
              type="number"
              size="sm"
              width="100px"
              value={points[q.questionVersionId] || ""}
              onChange={(e) =>
                handlePointChange(q.questionVersionId, e.target.value)
              }
            />
          </Box>

          <Flex justify="flex-end" gap={2} mt={4}>
            <Button
              colorScheme="green"
              size="sm"
              leftIcon={<CheckIcon />}
              onClick={() => handleSubmit(q)}
            >
              Submit
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              leftIcon={<CloseIcon />}
              onClick={() => {
                handlePointChange(q.questionVersionId, "");
                handleSelect(q.questionVersionId, "");
                handleFeedbackChange(q.questionVersionId, "");
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Box>
      ))}
      {gradedQuestions.length === gradingData.length && (
        <Flex justify="center" mt={6}>
          <Button colorScheme="blue" onClick={handleFinishGrading}>
            Finish Grading
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default GradeQuiz;
