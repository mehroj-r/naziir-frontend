import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { quizService } from "@/services/quizService";
import styles from "./QuizAttempt.module.scss";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Input,
  Text,
  Heading,
  Spinner,
  useToast,
  Textarea,
} from "@chakra-ui/react";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getById(quizId);
        setQuiz(data);
        setLoading(false);
      } catch (err) {
        toast({
          title: "Failed to load quiz.",
          status: "error",
          isClosable: true,
        });
      }
    };
    fetchQuiz();
  }, [quizId, toast]);

  const startQuiz = async () => {
    try {
      const attempt = await quizService.startAttempt(quizId); // ✅ get the attempt response
      setQuiz(attempt);
      setStarted(true);
    } catch {
      toast({
        title: "Failed to start quiz.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const formatted = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      await quizService.submitResponses(quizId, formatted);
      await quizService.finishAttempt(quizId);
      toast({
        title: "Quiz submitted successfully!",
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to submit quiz.",
        status: "error",
        isClosable: true,
      });
    }
  };

  if (loading || !quiz) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  const questions =
    quiz?.questions ||
    quiz?.quizVersion?.questionVersions ||
    quiz?.quizVersions?.[0]?.questionVersions ||
    [];

  return (
    <Box className={styles.quizAttempt}>
      <Heading mb={6}>{quiz.title || quiz.name}</Heading>

      {!started ? (
        <Button colorScheme="teal" onClick={startQuiz}>
          Start Quiz
        </Button>
      ) : (
        <>
          {questions
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((q, index) => (
              <Box key={q.id} className={styles.questionBox} mb={6}>
                <Text fontWeight="bold" mb={2}>
                  {index + 1}. {q.content || q.questionText}
                </Text>

                {q.questionType === "SHORT_ANSWER" && (
                  <Textarea
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Type your answer..."
                  />
                )}

                {q.questionType === "MULTIPLE_CHOICE" && (
                  <RadioGroup
                    onChange={(val) => handleAnswerChange(q.id, val)}
                    value={answers[q.id] || ""}
                  >
                    <Stack direction="column">
                      {(q.options || []).map((opt) => (
                        <Radio key={opt.id} value={opt.text || opt.id}>
                          {opt.content || opt.text}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                )}

                {q.questionType === "TRUE_FALSE" && (
                  <RadioGroup
                    onChange={(val) => handleAnswerChange(q.id, val)}
                    value={answers[q.id] || ""}
                  >
                    <Stack direction="row">
                      <Radio value="true">True</Radio>
                      <Radio value="false">False</Radio>
                    </Stack>
                  </RadioGroup>
                )}
              </Box>
            ))}

          <Button
            colorScheme="green"
            mt={6}
            onClick={handleSubmit}
            isDisabled={Object.keys(answers).length !== questions.length}
          >
            Submit Quiz
          </Button>
        </>
      )}
    </Box>
  );
};

export default QuizAttempt;
