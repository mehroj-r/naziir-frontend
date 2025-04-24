
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
      </Select>

      <label className={styles.uploadLabel}>
        <input
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              // Simulate file upload
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
      <Input
        value={currentQuestion.content}
        onChange={(e) => handleFieldChange("content", e.target.value)}
        placeholder="What does the economy study?"
      />
    </div>

    <div className={styles.fieldGroup}>
      <FormLabel>Description</FormLabel>
      <Input
        value={currentQuestion.explanation}
        onChange={(e) => handleFieldChange("explanation", e.target.value)}
        placeholder="Description"
      />
    </div>

    <div className={styles.fieldGroup}>
      <FormLabel>Answers *</FormLabel>
      <Input
        value={currentQuestion.expectedAnswer}
        onChange={(e) => handleFieldChange("expectedAnswer", e.target.value)}
        placeholder="Input Answer"
      />
    </div>

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
