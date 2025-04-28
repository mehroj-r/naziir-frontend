import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "@/services/quizService";
import styles from "./QuizAttempt.module.scss";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/react";
import CModal from "@/components/CModal";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [resultError, setResultError] = useState(null);
  const [violationCount, setViolationCount] = useState(0);
  const [submittedDueToViolation, setSubmittedDueToViolation] = useState(false);
  const violationTimer = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [violationMessage, setViolationMessage] = useState("");
  const [fullscreenLost, setFullscreenLost] = useState(false);
  const fullscreenTimer = useRef(null);
  const [countdown, setCountdown] = useState(10);

  const [remainingTime, setRemainingTime] = useState(0);
  const timerRef = useRef(null);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getById(quizId);
        setQuiz(data);
        setLoading(false);
        if (data?.timeLimit) {
          const timeLimitInSeconds = data.timeLimit * 60;
          setRemainingTime(timeLimitInSeconds);
        }
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
      const attempt = await quizService.startAttempt(quizId);
      if (attempt?.status !== "SUBMITTED") {
        setQuiz(attempt);
        setStarted(true);
        enterFullscreen();
      } else {
        toast({
          title: "You've already submitted the quiz",
          status: "error",
          isClosable: true,
        });
      }
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

  const handleNext = async () => {
    const currentAnswer = {
      questionVersionId: currentQuestion.id,
      answerContent: answers[currentQuestion.id] || "",
    };

    try {
      await quizService.submitResponses(quizId, currentAnswer);

      if (currentIndex === questions.length - 1) {
        await quizService.finishAttempt(quizId);
        const resultData = await quizService.getResult(quizId);
        setResult(resultData);
        setResultError(null);
        toast({
          title: "Quiz submitted successfully!",
          status: "success",
          isClosable: true,
        });
        navigate(`/quizzes?status=OPEN`);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.message === "Results have not been revealed yet."
      ) {
        setResultError(
          "The results have not been revealed yet. Please check back later."
        );
      } else {
        console.error(error);
        toast({
          title: "Failed to submit answer.",
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const autoSubmitQuiz = async () => {
    if (submittedDueToViolation) return;
    setSubmittedDueToViolation(true);

    if (fullscreenTimer.current) {
      clearTimeout(fullscreenTimer.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
      await quizService.finishAttempt(quizId);
      const resultData = await quizService.getResult(quizId);
      setResult(resultData);
      setResultError(null);

      toast({
        title: "Quiz auto-submitted due to time or violations.",
        status: "warning",
        isClosable: true,
      });

      navigate(`/student/quizzes/attempts/${quizId}/result`);
    } catch (error) {}
  };

  const handleViolation = () => {
    if (violationTimer.current) {
      clearTimeout(violationTimer.current);
    }

    violationTimer.current = setTimeout(() => {
      setViolationCount((prev) => prev + 1);
    }, 3000);
  };

  useEffect(() => {
    if (started && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            autoSubmitQuiz();
            navigate(`/quizzes?status=OPEN`);
            return 0;
          }

          if (prev === 5 * 60) {
            toast({
              title: "Only 5 minutes left!",
              status: "warning",
              isClosable: true,
              duration: 5000,
            });
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, remainingTime]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    const handleBlur = () => {
      handleViolation();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenLost(true);
        setCountdown(10);

        if (fullscreenTimer.current) {
          clearTimeout(fullscreenTimer.current);
        }
      } else {
        setFullscreenLost(false);
        if (fullscreenTimer.current) {
          clearTimeout(fullscreenTimer.current);
        }
      }
    };

    if (started) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleBlur);
      document.addEventListener("fullscreenchange", handleFullscreenChange);

      enterFullscreen();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [started]);

  useEffect(() => {
    if (violationCount >= 3) {
      autoSubmitQuiz();
      navigate(`/quizzes?status=OPEN`);
    }
  }, [violationCount, started, submittedDueToViolation]);

  useEffect(() => {
    if (fullscreenLost) {
      handleViolation();
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev < 1) {
            clearInterval(interval);
            autoSubmitQuiz();
            navigate(`/quizzes?status=OPEN`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [fullscreenLost]);

  if (loading || !quiz) {
    return (
      <Box className={styles.loading}>
        <Spinner size="xl" />
      </Box>
    );
  }

  const questions =
    quiz?.questions ||
    quiz?.quizVersion?.questionVersions ||
    quiz?.quizVersions?.[0]?.questionVersions ||
    [];

  const currentQuestion = questions[currentIndex];

  return (
    <Box className={styles.quizAttempt}>
      {started && (
        <>
          <div className={styles.timerdiv}>
            <Box className={styles.violationCounter}>
              Violations: {violationCount}
            </Box>
            <Box className={styles.timerBox}>
              <Text fontSize="xl" color="red" fontWeight="bold">
                Time Left: {formatTime(remainingTime)}
              </Text>
            </Box>
          </div>
          {violationMessage && (
            <Text className={styles.violationMessage} style={{ color: "red" }}>
              {violationMessage}
            </Text>
          )}

          <CModal
            isOpen={fullscreenLost}
            onClose={() => {}}
            title="Fullscreen Lost!"
            body={
              <Text fontSize="lg" textAlign="center">
                Please re-enter fullscreen mode within {countdown} seconds or
                the quiz will be auto-submitted!
              </Text>
            }
            footer={
              <Button colorScheme="red" onClick={enterFullscreen}>
                Re-enter Fullscreen
              </Button>
            }
            size="md"
          />
        </>
      )}

      <Box className={styles.content}>
        {!started ? (
          <Box className={styles.startSection}>
            <Button colorScheme="teal" onClick={startQuiz} mr="4">
              Start Quiz
            </Button>
            <Button
              colorScheme="blue"
              onClick={() =>
                navigate(`/student/quizzes/attempts/${quizId}/result`)
              }
            >
              Show Results
            </Button>
          </Box>
        ) : (
          <>
            <Box className={styles.mainCard}>
              <Text className={styles.questionTitle}>
                Question {currentIndex + 1}
              </Text>
              <Box className={styles.questionText}>
                {currentQuestion?.content || currentQuestion?.questionText}
              </Box>

              <Box className={styles.typeLabel}>
                {currentQuestion?.questionType?.replace("_", " ")}
              </Box>

              <Box className={styles.answerBlock}>
                {currentQuestion?.questionType === "SHORT_ANSWER" && (
                  <Textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion.id, e.target.value)
                    }
                    placeholder="Type your answer..."
                  />
                )}

                {currentQuestion?.questionType === "MULTIPLE_CHOICE" && (
                  <RadioGroup
                    onChange={(val) =>
                      handleAnswerChange(currentQuestion.id, val)
                    }
                    value={answers[currentQuestion.id] || ""}
                  >
                    <Stack direction="column">
                      {(currentQuestion.options || []).map((opt) => (
                        <Radio
                          key={opt.id}
                          value={opt.text || opt.id}
                          className={styles.radio}
                        >
                          {opt.content || opt.text}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                )}

                {currentQuestion?.questionType === "TRUE_FALSE" && (
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
                )}
              </Box>

              <Box className={styles.pointsSection}>
                <Text>Point</Text>
                <input type="text" value="1" readOnly />
              </Box>

              <Box className={styles.navButtons}>
                <Button
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  isDisabled={currentIndex === 0}
                >
                  Previous
                </Button>

                {currentIndex === questions.length - 1 ? (
                  <Button
                    colorScheme="blue"
                    isDisabled={
                      Object.keys(answers).length !== questions.length
                    }
                    onClick={handleNext}
                  >
                    Finish
                  </Button>
                ) : (
                  <Button colorScheme="blue" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </Box>

            <Box className={styles.questionList}>
              {questions.map((q, i) => (
                <Box
                  key={q.id}
                  className={`${styles.questionItem} ${
                    i === currentIndex ? styles.active : ""
                  } ${answers[q.id] ? styles.answered : ""}`}
                  onClick={() => setCurrentIndex(i)}
                >
                  <Text>Question {i + 1}</Text>
                  <Text className={styles.truncate}>
                    {(q.content || q.questionText).slice(0, 30)}...
                  </Text>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default QuizAttempt;
