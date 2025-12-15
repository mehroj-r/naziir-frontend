import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Select,
  Textarea,
  FormLabel,
  Heading,
  Divider,
  useToast,
  HStack,
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
  id: q.id,
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
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    ...defaultQuestion,
  });
  const [isPublishing, setIsPublishing] = useState(false)

  const navigate = useNavigate()

  const fetchQuiz = async () => {
    try {
      const res = await quizService.getById(quizId);
      setQuiz(res);
      const normalized = res.questions?.map(normalizeFetchedQuestion) || [];
      setExistingQuestions(normalized);
      setOriginalQuestions(normalized);
    } catch (err) {
      toast({
        title: "Failed to load quiz.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const hasQuestionChanged = (original, updated) => {
    return JSON.stringify(original) !== JSON.stringify(updated);
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const handleOpenModal = (field, value) => {
    setIsModalOpen(true);
    setCurrentQuestion({ ...defaultQuestion });
    console.log("setIsModalOpen(true) is working");
  };

  const handleFieldChange = (field, value) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleFieldChange2 = (index, field, value) => {
    setExistingQuestions((prevQuestions) => {
      const updated = [...prevQuestions];
      updated[index] = {
        ...updated[index],
        [field]: value,
        isEditing: true,
      };
      return updated;
    });
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

  const handleDeleteQuestion = async (questionId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirm) return;
    try {
      await quizService.deleteQuestion(questionId);
      toast({
        title: "Question deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchQuiz();
    } catch (error) {
      toast({
        title: "Failed to delete question.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateQuestion = async (question) => {
    const original = originalQuestions.find((q) => q.id === question.id);
    const payload = {
      content: question.content,
      questionType: question.questionType,
      mediaIds: question.mediaIds,
      explanation: question.explanation,
      points: question.points,
    };

    if (!hasQuestionChanged(original, question)) {
      toast({
        title: "No changes detected.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (question.questionType === "MULTIPLE_CHOICE") {
      payload.options = question.options;
    } else if (question.questionType === "TRUE_FALSE") {
      payload.correctAnswer = question.correctAnswer === "true";
    } else {
      payload.expectedAnswer = question.expectedAnswer;
      if (question.hint) payload.hint = question.hint;
    }

    try {
      await quizService.updateQuestion(question.id, payload);
      toast({
        title: "Question updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchQuiz();
    } catch (error) {
      toast({
        title: "Failed to update question.",
        description: error.message,
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
            disabled={quiz?.status !== 'DRAFT'}
            onChange={(e) =>
              handleFieldChange2(idx, "questionType", e.target.value)
            }
          >
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="LONG_ANSWER">Long Answer</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="CODING">Coding</option>
          </Select>

          <label className={styles.uploadLabel}>
            <input
              type="file"
              hidden
              disabled={quiz?.status !== 'DRAFT'}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const fakeMediaId = file.name + "_" + Date.now();
                  handleFieldChange2(idx, "mediaIds", [fakeMediaId]);
                }
              }}
            />
            <span>📤 Upload media</span>
          </label>

          <Button
            colorScheme="red"
            variant="ghost"
            className={styles.deleteBtn}
            onClick={() => handleDeleteQuestion(q.id)}
            disabled={quiz?.status !== 'DRAFT'}
          >
            Delete question
          </Button>
        </div>

        <div className={styles.fieldGroup}>
          <FormLabel>Question *</FormLabel>
          <Textarea
            disabled={quiz?.status !== 'DRAFT'}
            value={q.content}
            onChange={(e) => handleFieldChange2(idx, "content", e.target.value)}
            placeholder="What does the economy study?"
          />
        </div>

        <div className={styles.fieldGroup}>
          <FormLabel>Description</FormLabel>
          <Textarea
            disabled={quiz?.status !== 'DRAFT'}
            value={q.explanation}
            onChange={(e) =>
              handleFieldChange2(idx, "explanation", e.target.value)
            }
            placeholder="Description"
          />
        </div>

        {q.questionType === "SHORT_ANSWER" && (
          <>
            <div className={styles.fieldGroup}>
              <FormLabel>Answer *</FormLabel>
              <Textarea
                disabled={quiz?.status !== 'DRAFT'}
                value={q.expectedAnswer}
                onChange={(e) =>
                  handleFieldChange2(idx, "expectedAnswer", e.target.value)
                }
                placeholder="Expected Answer"
              />
            </div>

            <div className={styles.fieldGroup}>
              <FormLabel>Hint</FormLabel>
              <Textarea
                disabled={quiz?.status !== 'DRAFT'}
                value={q.hint}
                onChange={(e) =>
                  handleFieldChange2(idx, "hint", e.target.value)
                }
                placeholder="Hint (optional)"
              />
            </div>
          </>
        )}

        {q.questionType === "LONG_ANSWER" && (
          <>
            <div className={styles.fieldGroup}>
              <FormLabel>Expected Answer *</FormLabel>
              <Textarea
                disabled={quiz?.status !== 'DRAFT'}
                value={q.expectedAnswer}
                onChange={(e) =>
                  handleFieldChange2(idx, "expectedAnswer", e.target.value)
                }
                placeholder="Expected Answer"
                rows={6}
              />
            </div>

            <div className={styles.fieldGroup}>
              <FormLabel>Hint</FormLabel>
              <Textarea
                disabled={quiz?.status !== 'DRAFT'}
                value={q.hint}
                onChange={(e) =>
                  handleFieldChange2(idx, "hint", e.target.value)
                }
                placeholder="Hint (optional)"
              />
            </div>
          </>
        )}

        {q.questionType === "CODING" && (
          <>
            <div className={styles.fieldGroup}>
              <FormLabel>Expected Answer *</FormLabel>
              <Textarea
                disabled={quiz?.status !== 'DRAFT'}
                value={q.expectedAnswer}
                onChange={(e) =>
                  handleFieldChange2(idx, "expectedAnswer", e.target.value)
                }
                placeholder="Expected Code Solution"
                rows={8}
                fontFamily="monospace"
              />
            </div>

            <div className={styles.fieldGroup}>
              <FormLabel>Hint</FormLabel>
              <Textarea
                disabled={quiz?.status !== 'DRAFT'}
                value={q.hint}
                onChange={(e) =>
                  handleFieldChange2(idx, "hint", e.target.value)
                }
                placeholder="Hint (optional)"
              />
            </div>
          </>
        )}

        {q.questionType === "TRUE_FALSE" && (
          <div className={styles.fieldGroup}>
            <FormLabel>Select Correct Answer</FormLabel>
            <Select
              disabled={quiz?.status !== 'DRAFT'}
              value={q.correctAnswer}
              onChange={(e) =>
                handleFieldChange2(idx, "correctAnswer", e.target.value)
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
                  disabled={quiz?.status !== 'DRAFT'}
                  onChange={(e) => {
                    const updated = [...q.options];
                    updated[i] = {
                      ...updated[i],
                      content: e.target.value,
                    };
                    handleFieldChange2(idx, "options", updated);
                  }}
                />
                <Button
                  colorScheme="red"
                  onClick={() => {
                    const updated = q.options.filter((_, index) => index !== i);
                    handleFieldChange2(idx, "options", updated);
                  }}
                  disabled={quiz?.status !== 'DRAFT'}
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
                handleFieldChange2(idx, "options", updated);
              }}
              disabled={quiz?.status !== 'DRAFT'}
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
                handleFieldChange2(idx, "options", updated);
              }}
              disabled={quiz?.status !== 'DRAFT'}
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
            disabled={quiz?.status !== 'DRAFT'}
            type="number"
            value={q.points}
            onChange={(e) => handleFieldChange2(idx, "points", e.target.value)}
            placeholder="Input Field"
          />
        </div>
        {hasQuestionChanged(originalQuestions[idx], q) && (
          <Button disabled={quiz?.status !== 'DRAFT'} colorScheme="green" onClick={() => handleUpdateQuestion(q)}>
            Update
          </Button>
        )}
      </div>
      <Box display="flex" justifyContent="flex-end" gap="12px" mt={2}></Box>
      <Divider mt={4} mb={2} />
    </Box>
  );

  const publishQuiz = () => {
    setIsPublishing(true)
    quizService.generateVersions(quizId)
      .then(res => {
        quizService.distributeVersions(quizId)
          .then(res => {
            quizService.updateQuizStatus(quizId, "SCHEDULED")
              .then(res => {
                toast({
                  title: "The quiz has been published",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                })
                navigate('/quizzes')
              })
              .finally(() => {
                setIsPublishing(false)
              })
          })
          .catch(err => {
            setIsPublishing(false)
          })
        })
      .catch(err => {
        setIsPublishing(false)
      })
  }

  const modalBody = (
    <div className={styles.newModalBody}>
      <div className={styles.topBar}>
        <Select
          value={currentQuestion.questionType}
          onChange={(e) => handleFieldChange("questionType", e.target.value)}
          className={styles.dropdown}
        >
          <option value="SHORT_ANSWER">Short Answer</option>
          <option value="LONG_ANSWER">Long Answer</option>
          <option value="TRUE_FALSE">True / False</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="CODING">Coding</option>
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

        <Button disabled={quiz?.status !== 'DRAFT'} colorScheme="red" variant="ghost" className={styles.deleteBtn}>
          Delete question
        </Button>
      </div>

      <div className={styles.fieldGroup}>
        <FormLabel>Question *</FormLabel>
        <Textarea
          value={currentQuestion.content}
          onChange={(e) => handleFieldChange("content", e.target.value)}
          placeholder="Question"
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

      {currentQuestion.questionType === "LONG_ANSWER" && (
        <>
          <div className={styles.fieldGroup}>
            <FormLabel>Expected Answer *</FormLabel>
            <Textarea
              value={currentQuestion.expectedAnswer}
              onChange={(e) =>
                handleFieldChange("expectedAnswer", e.target.value)
              }
              placeholder="Expected Answer"
              rows={6}
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

      {currentQuestion.questionType === "CODING" && (
        <>
          <div className={styles.fieldGroup}>
            <FormLabel>Expected Answer *</FormLabel>
            <Textarea
              value={currentQuestion.expectedAnswer}
              onChange={(e) =>
                handleFieldChange("expectedAnswer", e.target.value)
              }
              placeholder="Expected Code Solution"
              rows={8}
              fontFamily="monospace"
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
        <HStack>
          {quiz?.status === 'DRAFT' && (
            <>
              <Button onClick={handleOpenModal} mt={4} colorScheme="blue">
                Add New Question
              </Button>
              <Button onClick={publishQuiz} mt={4} isLoading={isPublishing} colorScheme="blue">
                Publish
              </Button>
            </>
          )}
          {quiz?.status === 'CLOSED' && (
            <Button onClick={() => navigate(`/professor/grading/quiz/${quizId}`)}>
              Grade quiz
            </Button>
          )}
        </HStack>
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
