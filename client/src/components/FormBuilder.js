

import React, { useState } from "react";
import "../styles/FormBuilder.css";

function FormBuilder({ questions, setQuestions }) {
  const [editingIndex, setEditingIndex] = useState(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", type: "text", options: [], required: false },
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
    if ((type === "radio" || type === "checkbox") && !updatedQuestions[index].options) {
      updatedQuestions[index].options = [];
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
  };

  const toggleRequired = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].required = !updatedQuestions[index].required;
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
            <input
              type="text"
              name="text"
              placeholder="Enter question text"
              value={q.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
            />
            <select
              name="type"
              value={q.type}
              onChange={(e) => handleTypeChange(index, e.target.value)}
            >
              <option value="text">text</option>
              <option value="paragraph">paragraph</option>
              <option value="radio">radio</option>
              <option value="checkbox">checkbox</option>
              {/* <option value="file">File Upload</option> */}
            </select>
            {(q.type === "checkbox" || q.type === "radio") && (
              <div className="options">
                {q.options.map((option, oIndex) => (
                  <input
                    name="options"
                    key={oIndex}
                    type="text"
                    placeholder="Enter option text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, oIndex, e.target.value)
                    }
                  />
                ))}
                <button onClick={() => addOption(index)}>Add Option</button>
              </div>
            )}
            <div className="controls">
              <label>
                <input
                  name="required"
                  type="checkbox"
                  checked={q.required}
                  onChange={() => toggleRequired(index)}
                />
                Required
              </label>
              <button onClick={() => deleteQuestion(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormBuilder;
