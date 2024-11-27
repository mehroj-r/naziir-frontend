import React, { useState } from "react";
import { Xdelete } from "../../../assets/icons/loginRegisterIcons";
import styles from "./Step2.module.scss";

const Step2 = ({ nextStep, prevStep }) => {
  const initialQuestion = {
    questionText: "",
    questionType: "Multiple Choice",
    points: 5,
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    fontStyle: {
      bold: false,
      italic: false,
      underline: false,
    },
    image: null,
    video: null,
  };

  const [questions, setQuestions] = useState([initialQuestion]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleNext = () => {
    setQuestions([...questions, initialQuestion]);
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, i) => i !== oIndex
    );
    setQuestions(updatedQuestions);
  };

  const handleFontChange = (qIndex, styleType) => {
    const updatedQuestions = [...questions];
    const fontStyle = updatedQuestions[qIndex].fontStyle;

    fontStyle[styleType] = !fontStyle[styleType];
    updatedQuestions[qIndex].fontStyle = { ...fontStyle };
    setQuestions(updatedQuestions);
  };

  const handleFileChange = (qIndex, fileType, file) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex][fileType] = file;
    setQuestions(updatedQuestions);
  };

  const handlePublish = () => {
    console.log("Submitting quiz data:", questions);
    nextStep();
  };

  const getTextStyle = (fontStyle) => {
    const style = {};
    if (fontStyle.bold) style.fontWeight = "bold";
    if (fontStyle.italic) style.fontStyle = "italic";
    if (fontStyle.underline) style.textDecoration = "underline";
    return style;
  };

  const changeOrder = (qIndex, newPosition) => {
    if (newPosition < 1 || newPosition > questions.length) return;

    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(qIndex, 1);
    updatedQuestions.splice(newPosition - 1, 0, movedQuestion);

    setQuestions(updatedQuestions);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Creating Questions:</h2>

      {questions.map((question, qIndex) => (
        <div
          key={question.questionText + qIndex}
          className={styles.questionCard}
        >
          <div className={styles.questionSection}>
            <input
              type="text"
              placeholder="Type your question here"
              value={question.questionText}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionText", e.target.value)
              }
              style={getTextStyle(question.fontStyle)}
              className={styles.questionInput}
            />

            <div className={styles.textOptions}>
              <button
                onClick={() => handleFontChange(qIndex, "bold")}
                className={styles.boldButton}
              >
                B
              </button>
              <button
                onClick={() => handleFontChange(qIndex, "italic")}
                className={styles.italicButton}
              >
                I
              </button>
              <button
                onClick={() => handleFontChange(qIndex, "underline")}
                className={styles.underlineButton}
              >
                U
              </button>
            </div>

            <div className={styles.questionTypeSection}>
              <select
                value={question.questionType}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "questionType", e.target.value)
                }
                className={styles.questionType}
              >
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="Written response">Written response</option>
                <option value="Matching">Matching</option>
              </select>

              <input
                type="number"
                placeholder="Points: 5"
                value={question.points}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "points", e.target.value)
                }
                className={styles.pointsInput}
              />
            </div>

            {(question.questionType === "Multiple Choice" ||
              question.questionType === "Matching") && (
              <div className={styles.optionList}>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className={styles.option}>
                    <input
                      type="text"
                      placeholder="Option"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          "text",
                          e.target.value
                        )
                      }
                      className={styles.optionInput}
                    />
                    {question.questionType === "Matching" && (
                      <input
                        type="text"
                        placeholder="Match"
                        className={styles.matchInput}
                      />
                    )}
                    <label className={styles.correctAns}>
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) =>
                          handleOptionChange(
                            qIndex,
                            oIndex,
                            "isCorrect",
                            e.target.checked
                          )
                        }
                        className={styles.checkbox}
                      />
                      Correct
                    </label>
                    <button
                      onClick={() => removeOption(qIndex, oIndex)}
                      className={styles.deleteButton}
                    >
                      <Xdelete />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(qIndex)}
                  className={styles.addOptionButton}
                >
                  Add Option
                </button>
              </div>
            )}

            {question.questionType === "Written response" && (
              <textarea
                placeholder="Type your answer here..."
                className={styles.writtenResponse}
              />
            )}
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.upload}>
              <label>Upload:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(qIndex, "image", e.target.files[0])
                }
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  handleFileChange(qIndex, "video", e.target.files[0])
                }
              />
            </div>

            <div className={styles.orderChange}>
              <label>Change Order to:</label>
              <input
                type="number"
                placeholder="New Order"
                onBlur={(e) => {
                  const newPosition = Number(e.target.value);
                  changeOrder(qIndex, newPosition);
                }}
                className={styles.orderInput}
              />
            </div>
          </div>
        </div>
      ))}

      <div className={styles.buttonContainer}>
        <button onClick={prevStep} className={styles.prevButton}>
          Previous
        </button>
        <button
          onClick={handleNext}
          className={styles.nextButton}
          disabled={questions.length >= 1 ? false : true}
        >
          Next
        </button>
        {questions.length >= 2 && (
          <button onClick={handlePublish} className={styles.publishButton}>
            Publish
          </button>
        )}
      </div>
    </div>
  );
};

export default Step2;
