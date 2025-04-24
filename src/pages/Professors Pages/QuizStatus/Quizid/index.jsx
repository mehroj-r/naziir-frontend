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
import CModal from "../../../../components/CModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    ...defaultQuestion,
  });

  const fetchQuiz = async () => {
    try {
      const res = await quizService.getById(quizId);
      setQuiz(res);
      const normalized = res.questions?.map(normalizeFetchedQuestion) || [];
      setExistingQuestions(normalized);
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

  const handleFieldChange = (field, value) => {
    setCurrentQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveQuestion = async () => {
    const q = currentQuestion;
    const base = {
      content: q.content,
      questionType: q.questionType,
      orderIndex: existingQuestions.length + 1,
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

    try {
      await quizService.addQuestions(quizId, [base]);
      toast({
        title: "Question added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsModalOpen(false);
      setCurrentQuestion({ ...defaultQuestion });
      fetchQuiz();
    } catch (err) {
      toast({
        title: "Failed to add question.",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderQuestionDetails = (q, idx) => (
    <Box key={idx} className={styles.questionCard}>
      <div className={styles.newModalBody}>
        <div className={styles.topBar}>
          <Select
            value={q.questionType}
            className={styles.dropdown}
            onChange={(e) =>
              handleFieldChange(idx, "questionType", e.target.value)
            }
          >
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          </Select>

          <label className={styles.uploadLabel}>
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const fakeMediaId = file.name + "_" + Date.now();
                  handleFieldChange(idx, "mediaIds", [fakeMediaId]);
                }
              }}
            />
            <span>📤 Upload media</span>
          </label>

          <Button
            colorScheme="red"
            variant="ghost"
            className={styles.deleteBtn}
          >
            Delete question
          </Button>
        </div>

        <div className={styles.fieldGroup}>
          <FormLabel>Question *</FormLabel>
          <Textarea
            value={q.content}
            onChange={(e) => handleFieldChange(idx, "content", e.target.value)}
            placeholder="What does the economy study?"
          />
        </div>

        <div className={styles.fieldGroup}>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={q.explanation}
            onChange={(e) =>
              handleFieldChange(idx, "explanation", e.target.value)
            }
            placeholder="Description"
          />
        </div>

        {q.questionType === "SHORT_ANSWER" && (
          <>
            <div className={styles.fieldGroup}>
              <FormLabel>Answer *</FormLabel>
              <Textarea
                value={q.expectedAnswer}
                onChange={(e) =>
                  handleFieldChange(idx, "expectedAnswer", e.target.value)
                }
                placeholder="Expected Answer"
              />
            </div>

            <div className={styles.fieldGroup}>
              <FormLabel>Hint</FormLabel>
              <Textarea
                value={q.hint}
                onChange={(e) => handleFieldChange(idx, "hint", e.target.value)}
                placeholder="Hint (optional)"
              />
            </div>
          </>
        )}

        {q.questionType === "TRUE_FALSE" && (
          <div className={styles.fieldGroup}>
            <FormLabel>Select Correct Answer</FormLabel>
            <Select
              value={q.correctAnswer}
              onChange={(e) =>
                handleFieldChange(idx, "correctAnswer", e.target.value)
              }
            >
              <option value="">Select answer</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </Select>
          </div>
        )}

        {q.questionType === "MULTIPLE_CHOICE" && (
          <div className={styles.fieldGroup}>
            <FormLabel>Options *</FormLabel>

            {(q.options || []).map((option, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
              >
                <Input
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  value={option.content}
                  onChange={(e) => {
                    const updated = [...q.options];
                    updated[i] = {
                      ...updated[i],
                      content: e.target.value,
                    };
                    handleFieldChange(idx, "options", updated);
                  }}
                />
                <Button
                  colorScheme="red"
                  onClick={() => {
                    const updated = q.options.filter((_, index) => index !== i);
                    handleFieldChange(idx, "options", updated);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              mt={2}
              size="sm"
              w="auto"
              colorScheme="blue"
              onClick={() => {
                const updated = [...(q.options || [])];
                updated.push({ content: "", isCorrect: false });
                handleFieldChange(idx, "options", updated);
              }}
            >
              Add Option
            </Button>

            <Select
              mt={4}
              placeholder="Select correct option"
              value={q.options?.findIndex((opt) => opt.isCorrect) ?? ""}
              onChange={(e) => {
                const correctIndex = parseInt(e.target.value);
                const updated = q.options.map((opt, i) => ({
                  ...opt,
                  isCorrect: i === correctIndex,
                }));
                handleFieldChange(idx, "options", updated);
              }}
            >
              {(q.options || []).map((_, i) => (
                <option key={i} value={i}>
                  Option {String.fromCharCode(65 + i)}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className={styles.fieldGroup}>
          <FormLabel>Point *</FormLabel>
          <Input
            type="number"
            value={q.points}
            onChange={(e) => handleFieldChange(idx, "points", e.target.value)}
            placeholder="Input Field"
          />
        </div>
      </div>
      <Divider mt={4} mb={2} />
    </Box>
  );

  const modalBody = (
    <div className={styles.newModalBody}>
      <div className={styles.topBar}>
        <Select
          value={currentQuestion.questionType}
          onChange={(e) => handleFieldChange("questionType", e.target.value)}
          className={styles.dropdown}
        >
          <option value="SHORT_ANSWER">Short Answer</option>
          <option value="TRUE_FALSE">True / False</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
        </Select>

        <label className={styles.uploadLabel}>
          <input
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const fakeMediaId = file.name + "_" + Date.now();
                handleFieldChange("mediaIds", [fakeMediaId]);
              }
            }}
          />
          <span>📤 Upload media</span>
        </label>

        <Button colorScheme="red" variant="ghost" className={styles.deleteBtn}>
          Delete question
        </Button>
      </div>

      <div className={styles.fieldGroup}>
        <FormLabel>Question *</FormLabel>
        <Textarea
          value={currentQuestion.content}
          onChange={(e) => handleFieldChange("content", e.target.value)}
          placeholder="What does the economy study?"
        />
      </div>

      <div className={styles.fieldGroup}>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={currentQuestion.explanation}
          onChange={(e) => handleFieldChange("explanation", e.target.value)}
          placeholder="Description"
        />
      </div>

      {currentQuestion.questionType === "SHORT_ANSWER" && (
        <>
          <div className={styles.fieldGroup}>
            <FormLabel>Answer *</FormLabel>
            <Textarea
              value={currentQuestion.expectedAnswer}
              onChange={(e) =>
                handleFieldChange("expectedAnswer", e.target.value)
              }
              placeholder="Expected Answer"
            />
          </div>

          <div className={styles.fieldGroup}>
            <FormLabel>Hint</FormLabel>
            <Textarea
              value={currentQuestion.hint}
              onChange={(e) => handleFieldChange("hint", e.target.value)}
              placeholder="Hint (optional)"
            />
          </div>
        </>
      )}

      {currentQuestion.questionType === "TRUE_FALSE" && (
        <div className={styles.fieldGroup}>
          <FormLabel>Select Correct Answer</FormLabel>
          <Select
            value={currentQuestion.correctAnswer}
            onChange={(e) => handleFieldChange("correctAnswer", e.target.value)}
          >
            <option value="">Select answer</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </div>
      )}

      {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
        <div className={styles.fieldGroup}>
          <FormLabel>Options *</FormLabel>

          {(currentQuestion.options || []).map((option, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
            >
              <Input
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={option.content}
                onChange={(e) => {
                  const updated = [...currentQuestion.options];
                  updated[i] = {
                    ...updated[i],
                    content: e.target.value,
                  };
                  handleFieldChange("options", updated);
                }}
              />
              <Button
                colorScheme="red"
                onClick={() => {
                  const updated = currentQuestion.options.filter(
                    (_, index) => index !== i
                  );
                  handleFieldChange("options", updated);
                }}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            mt={2}
            size="sm"
            w="auto"
            colorScheme="blue"
            onClick={() => {
              const updated = [...(currentQuestion.options || [])];
              updated.push({ content: "", isCorrect: false });
              handleFieldChange("options", updated);
            }}
          >
            Add Option
          </Button>

          <Select
            mt={4}
            placeholder="Select correct option"
            value={
              currentQuestion.options?.findIndex((opt) => opt.isCorrect) ?? ""
            }
            onChange={(e) => {
              const correctIndex = parseInt(e.target.value);
              const updated = currentQuestion.options.map((opt, i) => ({
                ...opt,
                isCorrect: i === correctIndex,
              }));
              handleFieldChange("options", updated);
            }}
          >
            {(currentQuestion.options || []).map((_, i) => (
              <option key={i} value={i}>
                Option {String.fromCharCode(65 + i)}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className={styles.fieldGroup}>
        <FormLabel>Point *</FormLabel>
        <Input
          type="number"
          value={currentQuestion.points}
          onChange={(e) => handleFieldChange("points", e.target.value)}
          placeholder="Input Field"
        />
      </div>
    </div>
  );

  return (
    <Box className={styles.quizIdPage}>
      <div className={styles.heading}>
        <Heading size="lg" mb={4}>
          Quiz: {quiz?.title}
        </Heading>
        <Button onClick={() => setIsModalOpen(true)} mt={4} colorScheme="blue">
          Add New Question
        </Button>
      </div>
      <div className={styles.questionList}>
        {existingQuestions.length > 0 && (
          <Box mb={6}>
            {existingQuestions.map((q, idx) => renderQuestionDetails(q, idx))}
          </Box>
        )}
      </div>

      <CModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentQuestion({ ...defaultQuestion });
        }}
        title="Add New Question"
        body={modalBody}
        footer={
          <Button colorScheme="green" onClick={handleSaveQuestion}>
            Save Question
          </Button>
        }
        size="3xl"
      />
    </Box>
  );
};

export default QuizId;
