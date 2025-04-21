import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { quizService } from "@/services/quizService";
import styles from "./Startquiz.module.scss";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Heading,
  Spinner,
  useToast,
  Textarea,
  Image,
  Select,
} from "@chakra-ui/react";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getById(quizId);
        setQuiz(data);
        setLoading(false);
      } catch {
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
      await quizService.startAttempt(quizId);
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
    quizService.submitAnswer(quizId, questionId, answer);
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
    } catch {
      toast({
        title: "Failed to submit quiz.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const questions =
    quiz?.questions || quiz?.quizVersions?.[0]?.questionVersions || [];
  const currentQuestion = questions[currentIndex];

  if (loading || !quiz) {
    return (
      <Box className={styles.loading}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box className={styles.wrapper}>
      {!started ? (
        <Box className={styles.startScreen}>
          <Heading size="lg" mb={4}>
            Ready to Begin?
          </Heading>
          <Text fontSize="md" color="gray.600">
            Click the button below to start your quiz.
          </Text>
          <Button colorScheme="teal" size="lg" mt={6} onClick={startQuiz}>
            Start Quiz
          </Button>
        </Box>
      ) : (
        <Box className={styles.container}>
          <Box className={styles.sidebar}>
            {questions.map((q, i) => (
              <Button
                key={q.id}
                variant={i === currentIndex ? "solid" : "ghost"}
                colorScheme="teal"
                size="sm"
                onClick={() => setCurrentIndex(i)}
                className={styles.navButton}
              >
                Question {i + 1}
              </Button>
            ))}
          </Box>

          <Box className={styles.quizPanel}>
            <Heading size="md" mb={4}>
              Question {currentIndex + 1}
            </Heading>

            {currentQuestion.image && (
              <Image
                src={currentQuestion.image}
                alt="Question Visual"
                className={styles.image}
              />
            )}

            <Text fontSize="lg" mb={4}>
              {currentQuestion.content || currentQuestion.questionText}
            </Text>

            {currentQuestion.questionType === "SHORT_ANSWER" && (
              <Box className={styles.shortAnswer}>
                <Select placeholder="Choose Language" mb={2}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </Select>
                <Textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                  placeholder="Type your code or short answer..."
                />
              </Box>
            )}

            {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
              <Box className={styles.multipleChoice}>
                <RadioGroup
                  onChange={(val) =>
                    handleAnswerChange(currentQuestion.id, val)
                  }
                  value={answers[currentQuestion.id] || ""}
                >
                  <Stack direction="column">
                    {(currentQuestion.options || []).map((opt) => (
                      <Radio key={opt.id} value={opt.text || opt.id}>
                        {opt.content || opt.text}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>
            )}

            {currentQuestion.questionType === "TRUE_FALSE" && (
              <Box className={styles.trueFalse}>
                <RadioGroup
                  onChange={(val) =>
                    handleAnswerChange(currentQuestion.id, val)
                  }
                  value={answers[currentQuestion.id] || ""}
                >
                  <Stack direction="row">
                    <Radio value="true">True</Radio>
                    <Radio value="false">False</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            )}

            <Box className={styles.actions}>
              <Button
                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                isDisabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
                }
                isDisabled={currentIndex === questions.length - 1}
              >
                Next
              </Button>
            </Box>

            <Button
              colorScheme="green"
              mt={6}
              onClick={handleSubmit}
              isDisabled={Object.keys(answers).length !== questions.length}
            >
              Submit Quiz
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default QuizAttempt;
