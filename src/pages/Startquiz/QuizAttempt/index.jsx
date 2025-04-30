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
import { useDispatch } from "react-redux";
import { settingsActions } from "@/store/slices/settingsSlice";

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
  const [countdown, setCountdown] = useState(13);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showViolationAlert, setShowViolationAlert] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const timerRef = useRef(null);
  const dispatch = useDispatch();

  const enterFullscreen = () => {
    dispatch(
      settingsActions.setSidebarShown({
        isSidebarShown: false,
      })
    );
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

  const exitFullscreen = () => {
    dispatch(
      settingsActions.setSidebarShown({
        isSidebarShown: true,
      })
    );
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
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
    if (!started) return;

    const keyHandler = (e) => {
      const k = e.key.toUpperCase();
      const isMeta = e.metaKey;
      const isCtrl = e.ctrlKey;
      const isAlt = e.altKey;
      const isShift = e.shiftKey;

      if (
        k === "F12" ||
        (isCtrl && isShift && ["I", "J", "U"].includes(k)) ||
        (isMeta && isAlt && ["I", "J", "C"].includes(k))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      if ((isCtrl || isMeta) && ["C", "V", "X", "A"].includes(k)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const block = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setViolationMessage("Quiz paused: switching tabs is not allowed.");
        handleViolation();
      }
    };

    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenLost(true);
        setViolationMessage("Please remain in fullscreen during the quiz.");
        handleViolation();
        enterFullscreen();
      }
    };

    document.addEventListener("keydown", keyHandler, true);
    document.addEventListener("contextmenu", block, true);
    document.addEventListener("copy", block, true);
    document.addEventListener("paste", block, true);
    document.addEventListener("cut", block, true);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", onFullScreenChange);

    return () => {
      document.removeEventListener("keydown", keyHandler, true);
      document.removeEventListener("contextmenu", block, true);
      document.removeEventListener("copy", block, true);
      document.removeEventListener("paste", block, true);
      document.removeEventListener("cut", block, true);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, [started]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "U"].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    let devtoolsOpen = false;
    const threshold = 160;
    const detectDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const isOpen = widthDiff > threshold || heightDiff > threshold;

      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;

        setShowViolationAlert(true);
        toast({
          title: "Developer Tools detected!",
          status: "warning",
          isClosable: true,
          duration: 5000,
        });

        handleViolation();
      }

      devtoolsOpen = isOpen;
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    const intervalId = setInterval(detectDevTools, 1000);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      clearInterval(intervalId);
    };
  }, [toast]);

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

        setShowRulesModal(true);
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

  const handleStartClick = () => {
    setShowRulesModal(true);
  };

  const confirmStartQuiz = async () => {
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
        navigate(`/quizzes?status=OPEN`);
        exitFullscreen();
        const resultData = await quizService.getResult(quizId);
        setResult(resultData);
        setResultError(null);
        toast({
          title: "Quiz submitted successfully!",
          status: "success",
          isClosable: true,
        });
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
    dispatch(
      settingsActions.setSidebarShown({
        isSidebarShown: true,
      })
    );

    if (fullscreenTimer.current) {
      clearTimeout(fullscreenTimer.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
      await quizService.finishAttempt(quizId);
      exitFullscreen();
      navigate(`/quizzes?status=OPEN`);
      const resultData = await quizService.getResult(quizId);
      setResult(resultData);
      setResultError(null);

      toast({
        title: "Quiz auto-submitted due to time or violations.",
        status: "warning",
        isClosable: true,
      });
    } catch (error) {}
  };

  const handleViolation = () => {
    if (violationTimer.current) {
      clearTimeout(violationTimer.current);
    }

    setShowViolationAlert(true);
    setTimeout(() => setShowViolationAlert(false), 3000);

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
        dispatch(
          settingsActions.setSidebarShown({
            isSidebarShown: true,
          })
        );
        setFullscreenLost(true);
        setCountdown(13);

        if (fullscreenTimer.current) {
          clearTimeout(fullscreenTimer.current);
        }
      } else {
        dispatch(
          settingsActions.setSidebarShown({
            isSidebarShown: false,
          })
        );
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
      {showViolationAlert && (
        <Box className={styles.fullscreenAlert}>
          <Text className={styles.alertText}>Violation Detected!</Text>
        </Box>
      )}

      <CModal
        isOpen={showRulesModal}
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        title="Do you agree with our rules?"
        size="xl"
        body={
          <Box px={4} py={2}>
            <Text fontSize="lg" mb={4} fontWeight="semibold">
              Please review the rules carefully before proceeding:
            </Text>
            <Box as="ol" pl={5} spacing={2}>
              <Text as="li" mb={2}>
                <strong>Rule 1:</strong> You can take the quiz only once.
                Leaving or closing the browser ends your attempt.
              </Text>
              <Text as="li" mb={2}>
                <strong>Rule 2:</strong> Do not switch tabs or windows.
                (Violation #1)
              </Text>
              <Text as="li" mb={2}>
                <strong>Rule 3:</strong> Stay in fullscreen mode.
              </Text>
              <Text as="li" mb={2}>
                <strong>Rule 4:</strong> Do not press the "Esc" key or attempt
                to minimize the window. (Violation #3)
              </Text>
              <Text as="li" mb={2}>
                <strong>Rule 5:</strong> Do not open developer tools or inspect
                the page. (Violation #4)
              </Text>
              <Text as="li" mb={2}>
                <strong>Rule 6:</strong> If you accumulate 3 violations, the
                quiz will be failed. (Final Violation)
              </Text>
            </Box>
          </Box>
        }
        footer={
          <Stack direction="row" justify="flex-end" px={4} py={3}>
            <Button
              variant="ghost"
              onClick={() => {
                setShowRulesModal(false);
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                setShowRulesModal(false);
                confirmStartQuiz();
              }}
            >
              Accept Rules & Start
            </Button>
          </Stack>
        }
      />
      {started && (
        <>
          <div className={styles.timerdiv}>
            <Box className={styles.violationCounter}>
              Violations: {violationCount}
            </Box>
            <Box className={styles.timerBox}>
              <Text
                fontSize="3xl"
                color={remainingTime <= 300 ? "red.500" : "green.500"}
                fontWeight="bold"
              >
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
          <Box className={styles.startSection}></Box>
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
