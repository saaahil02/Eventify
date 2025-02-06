import React, { useState } from "react";
import "../styles/FormBuilder.css";

function FormBuilder({ questions, setQuestions }) {
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "text",
        options: [],
        required: false,
        validation: "",
        fixedDigits: null,
        minRange: null,
        maxRange: null,
        emailValidation: false,
      },
    ]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  const handleTypeChange = (index, type) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = type;
    if (type !== "number") {
      updatedQuestions[index].validation = "";
      updatedQuestions[index].fixedDigits = null;
      updatedQuestions[index].minRange = null;
      updatedQuestions[index].maxRange = null;
    }
    if (type !== "text") {
      updatedQuestions[index].emailValidation = false;
    }
    if (type === "radio" || type === "checkbox") {
      updatedQuestions[index].options = [""];
    } else {
      updatedQuestions[index].options = [];
    }
    setQuestions(updatedQuestions);
  };

  // Options management for radio/checkbox
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.splice(optIndex, 1);
    setQuestions(updatedQuestions);
  };

  // Question reordering
  const moveQuestion = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= questions.length) return;
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
  };

  // Other existing handlers...
  const handleValidationChange = (index, validation) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].validation = validation;
    setQuestions(updatedQuestions);
  };

  const handleFixedDigitsChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].fixedDigits = value ? parseInt(value, 10) : null;
    setQuestions(updatedQuestions);
  };

  const handleRangeChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value ? parseInt(value, 10) : null;
    setQuestions(updatedQuestions);
  };

  const toggleEmailValidation = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].emailValidation = !updatedQuestions[index].emailValidation;
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="form-builder">
      <h2>Build Your Form</h2>
      <button onClick={addQuestion}>Add Question</button>
      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={index} className="question">
            <div className="question-header">
              <input
                type="text"
                placeholder="Enter question text"
                value={q.text}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                required
              />
              <select
                value={q.type}
                onChange={(e) => handleTypeChange(index, e.target.value)}
              >
                <option value="text">Text</option>
                <option value="paragraph">Paragraph</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="number">Number</option>
              </select>
            </div>

            {q.type === "text" && (
              <label className="email-validation">
                <input
                  type="checkbox"
                  checked={q.emailValidation}
                  onChange={() => toggleEmailValidation(index)}
                />
                Require email format
              </label>
            )}

            {(q.type === "radio" || q.type === "checkbox") && (
              <div className="options-section">
                <label>Options:</label>
                {q.options.map((option, optIndex) => (
                  <div key={optIndex} className="option">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                      placeholder="Option text"
                    />
                    <button
                      className="remove-option"
                      onClick={() => removeOption(index, optIndex)}
                      disabled={q.options.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {q.options.length < 5 && (
                  <button className="add-option" onClick={() => addOption(index)}>
                    Add Option
                  </button>
                )}
                {q.options.length < 1 && (
                  <span className="error">At least one option required</span>
                )}
              </div>
            )}

            {q.type === "number" && (
              <div className="number-validation">
                <label>Validation:</label>
                <select
                  value={q.validation}
                  onChange={(e) => handleValidationChange(index, e.target.value)}
                >
                  <option value="">None</option>
                  <option value="fixedDigits">Fixed Number of Digits</option>
                  <option value="range">Range</option>
                </select>

                {q.validation === "fixedDigits" && (
                  <div className="fixed-digits">
                    <label>Number of Digits:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={q.fixedDigits || ""}
                      onChange={(e) => handleFixedDigitsChange(index, e.target.value)}
                    />
                  </div>
                )}

                {q.validation === "range" && (
                  <div className="range-validation">
                    <div>
                      <label>Minimum:</label>
                      <input
                        type="number"
                        value={q.minRange || ""}
                        onChange={(e) => handleRangeChange(index, "minRange", e.target.value)}
                        max={q.maxRange ?? undefined}
                      />
                    </div>
                    <div>
                      <label>Maximum:</label>
                      <input
                        type="number"
                        value={q.maxRange || ""}
                        onChange={(e) => handleRangeChange(index, "maxRange", e.target.value)}
                        min={q.minRange ?? undefined}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="question-controls">
              <label className="required-toggle">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].required = !updatedQuestions[index].required;
                    setQuestions(updatedQuestions);
                  }}
                />
                Required
              </label>

              <div className="reorder-buttons">
                <button
                  onClick={() => moveQuestion(index, index - 1)}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveQuestion(index, index + 1)}
                  disabled={index === questions.length - 1}
                >
                  ↓
                </button>
              </div>

              <button
                className="delete-question"
                onClick={() => deleteQuestion(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormBuilder;