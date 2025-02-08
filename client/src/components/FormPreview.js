import React, { useState, useEffect } from "react";
import "../styles/FormPreview.css";

function FormPreview({ questions }) {
  const [formState, setFormState] = useState([]);

  // Initialize form state when questions change
  useEffect(() => {
    const initialState = questions.map(question => ({
      value: question.type === 'checkbox' ? [] : '',
      touched: false,
    }));
    setFormState(initialState);
  }, [questions]);

  const handleChange = (index, value) => {
    setFormState(prev => {
      const newState = [...prev];
      newState[index] = { ...newState[index], value, touched: true };
      return newState;
    });
  };

  const handleBlur = (index) => {
    setFormState(prev => {
      const newState = [...prev];
      newState[index] = { ...newState[index], touched: true };
      return newState;
    });
  };

  const getValidationError = (question, index) => {
    const state = formState[index];
    if (!question.required || !state?.touched) return null;
    
    const value = state.value;
    let isValid = true;

    switch (question.type) {
      case 'text':
      case 'paragraph':
        isValid = value.trim() !== '';
        break;
      case 'number':
        isValid = value !== '' && !isNaN(value);
        break;
      case 'radio':
        isValid = value !== '';
        break;
      case 'checkbox':
        isValid = value.length > 0;
        break;
      case 'file':
        isValid = value instanceof File;
        break;
    }

    return isValid ? null : <div className="error-message">This field is required</div>;
  };

  return (
    <div className="form-preview">
      <h2>Form Preview</h2>
      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={index} className="question">
            <div className="preview-header">
              <h3>
                {q.text}
                {q.required && <span className="required"> *</span>}
              </h3>
              {getValidationError(q, index)}
            </div>

            {q.type === "text" && (
              <input
                type="text"
                placeholder="Your answer"
                value={formState[index]?.value || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onBlur={() => handleBlur(index)}
              />
            )}

            {q.type === "paragraph" && (
              <textarea
                placeholder="Your answer"
                rows={4}
                value={formState[index]?.value || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onBlur={() => handleBlur(index)}
              ></textarea>
            )}

            {q.type === "radio" && (
              <div className="options-list">
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="option-item">
                    <input
                      type="radio"
                      id={`${index}-${oIndex}`}
                      name={`question-${index}`}
                      value={option}
                      checked={formState[index]?.value === option}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onBlur={() => handleBlur(index)}
                    />
                    <label htmlFor={`${index}-${oIndex}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}

            {q.type === "checkbox" && (
              <div className="options-list">
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="option-item">
                    <input
                      type="checkbox"
                      id={`${index}-${oIndex}`}
                      value={option}
                      checked={formState[index]?.value.includes(option)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...formState[index].value, option]
                          : formState[index].value.filter(v => v !== option);
                        handleChange(index, newValue);
                      }}
                      onBlur={() => handleBlur(index)}
                    />
                    <label htmlFor={`${index}-${oIndex}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}

            {q.type === "number" && (
              <input
                type="number"
                placeholder="Enter number"
                value={formState[index]?.value || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onBlur={() => handleBlur(index)}
              />
            )}

            {q.type === "file" && (
              <input
                type="file"
                onChange={(e) => handleChange(index, e.target.files[0])}
                onBlur={() => handleBlur(index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormPreview;