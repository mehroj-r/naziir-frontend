import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Select,
  Textarea,
  FormLabel,
  Stack,
  Heading,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { quizService } from "../../../../services/quizService";
import styles from "./Quizid.module.scss";

const defaultQuestion = {
  content: "",
  explanation: "",
  points: "",
  questionType: "SHORT_ANSWER",
  options: [],
  expectedAnswer: "",
  correctAnswer: "",
  hint: "",
  mediaIds: [],
};

const normalizeFetchedQuestion = (q) => ({
  content: q.content || "",
  explanation: q.explanation || "",
  points: q.points || "",
  questionType: q.questionType || "SHORT_ANSWER",
  options: q.options || [],
  expectedAnswer: q.expectedAnswer || "",
  correctAnswer:
    typeof q.correctAnswer === "boolean" ? q.correctAnswer.toString() : "",
  hint: q.hint || "",
  mediaIds: q.mediaUrls || [],
});

const QuizId = () => {
  const { quizId } = useParams();
  const toast = useToast();
  const [quiz, setQuiz] = useState(null);
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);

  const fetchQuiz = async () => {
    try {
      const res = await quizService.getById(quizId);
      setQuiz(res);

      const normalized = res.questions?.map(normalizeFetchedQuestion) || [];
      setExistingQuestions(normalized);
      setNewQuestions([]);
    } catch (err) {
      toast({
        title: "Failed to load quiz.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...newQuestions];
    updated[index][field] = value;
    setNewQuestions(updated);
  };

  const addNewQuestion = () => {
    setNewQuestions([...newQuestions, { ...defaultQuestion }]);
  };

  const postQuestions = async () => {
    if (newQuestions.length === 0) {
      toast({
        title: "No new questions to submit.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const payload = newQuestions.map((q, i) => {
        const base = {
          content: q.content,
          questionType: q.questionType,
          orderIndex: existingQuestions.length + i + 1,
          mediaIds: q.mediaIds,
          explanation: q.explanation,
          points: q.points,
        };

        if (q.questionType === "MULTIPLE_CHOICE") {
          base.options = q.options;
        } else if (q.questionType === "TRUE_FALSE") {
          base.correctAnswer = q.correctAnswer === "true";
        } else {
          base.expectedAnswer = q.expectedAnswer;
          if (q.hint) base.hint = q.hint;
        }

        return base;
      });

      await quizService.addQuestions(quizId, payload);

      toast({
        title: "New questions added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchQuiz();
    } catch (err) {
      toast({
        title: "Error adding questions.",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className={styles.quizIdPage}>
      <Heading size="lg" mb={4}>
        Quiz: {quiz?.title}
      </Heading>

      {/*Existing questions*/}
      {existingQuestions.length > 0 && (
        <Box mb={6}>
          <Heading size="md" mb={3}>
            Existing Questions
          </Heading>
          {existingQuestions.map((q, idx) => (
            <Box key={idx} className={styles.questionCard}>
              <Stack spacing={2}>
                <strong>
                  Q{idx + 1}: {q.content}
                </strong>
                <div>Type: {q.questionType}</div>
                <div>Points: {q.points}</div>
                {q.questionType === "TRUE_FALSE" && (
                  <div>Correct Answer: {q.correctAnswer}</div>
                )}
                {q.questionType === "SHORT_ANSWER" && (
                  <div>Expected Answer: {q.expectedAnswer}</div>
                )}
                {q.questionType === "MULTIPLE_CHOICE" && (
                  <ul>
                    {q.options?.map((opt, i) => (
                      <li key={i}>
                        {opt.content} {opt.isCorrect ? "(✔)" : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </Stack>
              <Divider mt={3} />
            </Box>
          ))}
        </Box>
      )}

      {/*New questions*/}
      <Heading size="md" mb={2}>
        New Questions
      </Heading>

      {newQuestions.map((q, idx) => (
        <Box key={idx} className={styles.questionCard}>
          <Stack spacing={3}>
            <Select
              value={q.questionType}
              onChange={(e) =>
                handleQuestionChange(idx, "questionType", e.target.value)
              }
            >
              <option value="SHORT_ANSWER">Short Answer</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            </Select>

            <FormLabel>Question *</FormLabel>
            <Input
              value={q.content}
              onChange={(e) =>
                handleQuestionChange(idx, "content", e.target.value)
              }
              placeholder="Enter your question"
            />

            <Textarea
              value={q.explanation}
              onChange={(e) =>
                handleQuestionChange(idx, "explanation", e.target.value)
              }
              placeholder="Explanation (optional)"
            />

            <Input
              value={q.points}
              onChange={(e) =>
                handleQuestionChange(idx, "points", e.target.value)
              }
              placeholder="Points"
              type="number"
            />

            <Input
              value={q.mediaIds?.[0] || ""}
              onChange={(e) =>
                handleQuestionChange(idx, "mediaIds", [e.target.value])
              }
              placeholder="Media ID (optional)"
            />

            {q.questionType === "MULTIPLE_CHOICE" && (
              <Box>
                <FormLabel>Options *</FormLabel>
                {["A", "B", "C", "D"].map((label, i) => (
                  <Input
                    key={i}
                    placeholder={`Option ${label}`}
                    value={q.options?.[i]?.content || ""}
                    onChange={(e) => {
                      const updated = [...(q.options || [])];
                      updated[i] = {
                        content: e.target.value,
                        isCorrect: updated[i]?.isCorrect || false,
                      };
                      handleQuestionChange(idx, "options", updated);
                    }}
                    mt={1}
                  />
                ))}
                <Select
                  mt={2}
                  placeholder="Select correct option"
                  onChange={(e) => {
                    const correctIndex = parseInt(e.target.value);
                    const updatedOptions = (q.options || []).map((opt, i) => ({
                      ...opt,
                      isCorrect: i === correctIndex,
                    }));
                    handleQuestionChange(idx, "options", updatedOptions);
                  }}
                >
                  {["A", "B", "C", "D"].map((label, i) => (
                    <option key={i} value={i}>
                      Option {label}
                    </option>
                  ))}
                </Select>
              </Box>
            )}

            {q.questionType === "TRUE_FALSE" && (
              <Select
                placeholder="Select answer"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(idx, "correctAnswer", e.target.value)
                }
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </Select>
            )}

            {q.questionType === "SHORT_ANSWER" && (
              <>
                <Input
                  placeholder="Expected Answer"
                  value={q.expectedAnswer}
                  onChange={(e) =>
                    handleQuestionChange(idx, "expectedAnswer", e.target.value)
                  }
                />
                <Input
                  placeholder="Hint (optional)"
                  value={q.hint}
                  onChange={(e) =>
                    handleQuestionChange(idx, "hint", e.target.value)
                  }
                />
              </>
            )}
          </Stack>
          <Divider mt={4} mb={4} />
        </Box>
      ))}

      <Button onClick={addNewQuestion} mt={4} colorScheme="blue">
        Add New Question
      </Button>

      <Button onClick={postQuestions} mt={4} ml={4} colorScheme="green">
        Submit New Questions
      </Button>
    </Box>
  );
};

export default QuizId;
