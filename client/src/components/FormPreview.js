import React from "react";
import "../styles/FormPreview.css";






function FormPreview({ questions }) {
  return (
    <div className="form-preview">
      <h2>Form Preview</h2>
      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={index} className="question">
            <p>
              {q.text} {q.required && <span className="required">*</span>}
            </p>
            {q.type === "text" && <input type="text" placeholder="Your answer" />}
            {q.type === "paragraph" && (
              <textarea placeholder="Your answer" rows={4}></textarea>
            )}
            {q.type === "radio" &&
              q.options.map((option, oIndex) => (
                <div key={oIndex}>
                  <input
                    type="radio"
                    id={`${index}-${oIndex}`}
                    name={`question-${index}`}
                  />
                  <label htmlFor={`${index}-${oIndex}`}>{option}</label>
                </div>
              ))}
            {q.type === "checkbox" &&
              q.options.map((option, oIndex) => (
                <div key={oIndex}>
                  <input
                    type="checkbox"
                    id={`${index}-${oIndex}`}
                    name={`question-${index}`}
                  />
                  <label htmlFor={`${index}-${oIndex}`}>{option}</label>
                </div>
              ))}
            {q.type === "file" && <input type="file" />}
          </div>
        ))}
      </div>
    </div>
  
    
  );
}

export default FormPreview;
