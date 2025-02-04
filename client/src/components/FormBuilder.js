

// import React, { useState } from "react";
// import "../styles/FormBuilder.css";

// function FormBuilder({ questions, setQuestions }) {
//   const [editingIndex, setEditingIndex] = useState(null);

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       { text: "", type: "text", options: [], required: false },
//     ]);
//   };

//   const handleQuestionChange = (index, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].text = value;
//     setQuestions(updatedQuestions);
//   };

//   const handleTypeChange = (index, type) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].type = type;
//     if ((type === "radio" || type === "checkbox") && !updatedQuestions[index].options) {
//       updatedQuestions[index].options = [];
//     }
//     setQuestions(updatedQuestions);
//   };

//   const handleOptionChange = (qIndex, oIndex, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[qIndex].options[oIndex] = value;
//     setQuestions(updatedQuestions);
//   };

//   const addOption = (index) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].options.push("");
//     setQuestions(updatedQuestions);
//   };

//   const toggleRequired = (index) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].required = !updatedQuestions[index].required;
//     setQuestions(updatedQuestions);
//   };

//   const deleteQuestion = (index) => {
//     const updatedQuestions = questions.filter((_, i) => i !== index);
//     setQuestions(updatedQuestions);
//   };
 
//   return (
//     <div className="form-builder">
//       <h2>Build Your Form</h2>
//       <button onClick={addQuestion}>Add Question</button>
//       <div className="questions-list">
//         {questions.map((q, index) => (
//           <div key={index} className="question">
//             <input
//               type="text"
//               name="text"
//               placeholder="Enter question text"
//               value={q.text}
//               onChange={(e) => handleQuestionChange(index, e.target.value)}
//             />
//             <select
//               name="type"
//               value={q.type}
//               onChange={(e) => handleTypeChange(index, e.target.value)}
//             >
//               <option value="text">text</option>
//               <option value="paragraph">paragraph</option>
//               <option value="radio">radio</option>
//               <option value="checkbox">checkbox</option>
              
//               {/* <option value="file">File Upload</option> */}
//             </select>
//             {(q.type === "checkbox" || q.type === "radio") && (
//               <div className="options">
//                 {q.options.map((option, oIndex) => (
//                   <input
//                     name="options"
//                     key={oIndex}
//                     type="text"
//                     placeholder="Enter option text"
//                     value={option}
//                     onChange={(e) =>
//                       handleOptionChange(index, oIndex, e.target.value)
//                     }
//                   />
//                 ))}
//                 <button onClick={() => addOption(index)}>Add Option</button>
//               </div>
//             )}
//             <div className="controls">
//               <label>
//                 <input
//                   name="required"
//                   type="checkbox"
//                   checked={q.required}
//                   onChange={() => toggleRequired(index)}
//                 />
//                 Required
//               </label>
//               <button onClick={() => deleteQuestion(index)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FormBuilder;
// import React, { useState } from "react";
// import "../styles/FormBuilder.css";

// function FormBuilder({ questions, setQuestions }) {
//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       { text: "", type: "text", options: [], required: false, validation: "" },
//     ]);
//   };

//   document.addEventListener("DOMContentLoaded", function () {
//     document.querySelectorAll(".validation-dropdown select").forEach(select => {
//         select.addEventListener("change", function () {
//             let inputField = this.closest(".question").querySelector("input[type='text']");
//             let errorSpan = this.closest(".question").querySelector(".error-message");

//             if (!errorSpan) {
//                 errorSpan = document.createElement("span");
//                 errorSpan.classList.add("error-message");
//                 errorSpan.style.color = "red";
//                 errorSpan.style.fontSize = "12px";
//                 this.closest(".question").appendChild(errorSpan);
//             }

//             if (this.value === "email") {
//                 inputField.setAttribute("pattern", "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
//                 inputField.setAttribute("placeholder", "Enter a valid email address");

//                 inputField.addEventListener("input", function () {
//                     if (!inputField.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
//                         errorSpan.textContent = "Please enter a valid email address";
//                     } else {
//                         errorSpan.textContent = "";
//                     }
//                 });
//             } else {
//                 inputField.removeAttribute("pattern");
//                 inputField.removeAttribute("placeholder");
//                 errorSpan.textContent = "";
//             }
//         });
//     });
// });

//   const handleQuestionChange = (index, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].text = value;
//     setQuestions(updatedQuestions);
//   };

//   const handleTypeChange = (index, type) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].type = type;
//     if ((type === "radio" || type === "checkbox") && !updatedQuestions[index].options) {
//       updatedQuestions[index].options = [];
//     }
//     if (type !== "text") {
//       updatedQuestions[index].validation = "";
//     }
//     setQuestions(updatedQuestions);
//   };

//   const handleValidationChange = (index, validation) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].validation = validation;
//     setQuestions(updatedQuestions);
//   };

//   const handleOptionChange = (qIndex, oIndex, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[qIndex].options[oIndex] = value;
//     setQuestions(updatedQuestions);
//   };

//   const addOption = (index) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].options.push("");
//     setQuestions(updatedQuestions);
//   };

//   const toggleRequired = (index) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].required = !updatedQuestions[index].required;
//     setQuestions(updatedQuestions);
//   };

//   const deleteQuestion = (index) => {
//     const updatedQuestions = questions.filter((_, i) => i !== index);
//     setQuestions(updatedQuestions);
//   };

//   return (
//     <div className="form-builder">
//       <h2>Build Your Form</h2>
//       <button onClick={addQuestion}>Add Question</button>
//       <div className="questions-list">
//         {questions.map((q, index) => (
//           <div key={index} className="question">
//             <input
//               type="text"
//               placeholder="Enter question text"
//               value={q.text}
//               onChange={(e) => handleQuestionChange(index, e.target.value)}
//             />
//             <select
//               value={q.type}
//               onChange={(e) => handleTypeChange(index, e.target.value)}
//             >
//               <option value="text">Text</option>
//               <option value="paragraph">Paragraph</option>
//               <option value="radio">Radio</option>
//               <option value="checkbox">Checkbox</option>
//             </select>
//             {q.type === "text" && (
//               <div>
//                 <label>Validation:</label>
//                 <select
//                   value={q.validation}
//                   onChange={(e) => handleValidationChange(index, e.target.value)}
//                 >
//                   <option value="">None</option>
//                   <option value="email">Email</option>
//                 </select>
//               </div>
//             )}
//             {(q.type === "checkbox" || q.type === "radio") && (
//               <div className="options">
//                 {q.options.map((option, oIndex) => (
//                   <input
//                     key={oIndex}
//                     type="text"
//                     placeholder="Enter option text"
//                     value={option}
//                     onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
//                   />
//                 ))}
//                 <button onClick={() => addOption(index)}>Add Option</button>
//               </div>
//             )}
//             <div className="controls">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={q.required}
//                   onChange={() => toggleRequired(index)}
//                 />
//                 Required
//               </label>
//               <button onClick={() => deleteQuestion(index)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FormBuilder;
// import React, { useState } from "react";
// import "../styles/FormBuilder.css";

// function FormBuilder({ questions, setQuestions }) {
//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         text: "",
//         type: "text",
//         options: [],
//         required: false,
//         validation: "",
//         fixedDigits: null, // For fixed number of digits
//         minRange: null, // For range validation
//         maxRange: null, // For range validation
//       },
//     ]);
//   };

//   const handleQuestionChange = (index, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].text = value;
//     setQuestions(updatedQuestions);
//   };

//   const handleTypeChange = (index, type) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].type = type;
//     if ((type === "radio" || type === "checkbox") && !updatedQuestions[index].options) {
//       updatedQuestions[index].options = [];
//     }
//     if (type !== "number") {
//       updatedQuestions[index].validation = "";
//       updatedQuestions[index].fixedDigits = null;
//       updatedQuestions[index].minRange = null;
//       updatedQuestions[index].maxRange = null;
//     }
//     setQuestions(updatedQuestions);
//   };

//   const handleValidationChange = (index, validation) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].validation = validation;
//     setQuestions(updatedQuestions);
//   };

//   const handleFixedDigitsChange = (index, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].fixedDigits = value ? parseInt(value, 10) : null;
//     setQuestions(updatedQuestions);
//   };

//   const handleRangeChange = (index, field, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index][field] = value ? parseInt(value, 10) : null;
//     setQuestions(updatedQuestions);
//   };

//   const handleOptionChange = (qIndex, oIndex, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[qIndex].options[oIndex] = value;
//     setQuestions(updatedQuestions);
//   };

//   const addOption = (index) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].options.push("");
//     setQuestions(updatedQuestions);
//   };

//   const toggleRequired = (index) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index].required = !updatedQuestions[index].required;
//     setQuestions(updatedQuestions);
//   };

//   const deleteQuestion = (index) => {
//     const updatedQuestions = questions.filter((_, i) => i !== index);
//     setQuestions(updatedQuestions);
//   };

//   const validateNumberInput = (value, fixedDigits, minRange, maxRange) => {
//     const numericRegex = /^\d+$/;
//     if (!numericRegex.test(value)) {
//       return "Input must be a number.";
//     }
//     if (fixedDigits !== null && value.length !== fixedDigits) {
//       return `Input must be exactly ${fixedDigits} digits.`;
//     }
//     if (minRange !== null && maxRange !== null && (value < minRange || value > maxRange)) {
//       return `Input must be between ${minRange} and ${maxRange}.`;
//     }
//     return "";
//   };

//   return (
//     <div className="form-builder">
//       <h2>Build Your Form</h2>
//       <button onClick={addQuestion}>Add Question</button>
//       <div className="questions-list">
//         {questions.map((q, index) => (
//           <div key={index} className="question">
//             <input
//               type="text"
//               placeholder="Enter question text"
//               value={q.text}
//               onChange={(e) => handleQuestionChange(index, e.target.value)}
//             />
//             <select
//               value={q.type}
//               onChange={(e) => handleTypeChange(index, e.target.value)}
//             >
//               <option value="text">Text</option>
//               <option value="paragraph">Paragraph</option>
//               <option value="radio">Radio</option>
//               <option value="checkbox">Checkbox</option>
//               <option value="number">Number</option>
//             </select>
//             {q.type === "number" && (
//               <div>
//                 <label>Validation:</label>
//                 <select
//                   value={q.validation}
//                   onChange={(e) => handleValidationChange(index, e.target.value)}
//                 >
//                   <option value="">None</option>
//                   <option value="fixedDigits">Fixed Number of Digits</option>
//                   <option value="range">Range</option>
//                 </select>
//                 {q.validation === "fixedDigits" && (
//                   <div>
//                     <label>Fixed Digits:</label>
//                     <input
//                       type="number"
//                       placeholder="Enter fixed digits"
//                       value={q.fixedDigits || ""}
//                       onChange={(e) => handleFixedDigitsChange(index, e.target.value)}
//                     />
//                   </div>
//                 )}
//                 {q.validation === "range" && (
//                   <div>
//                     <label>Min Range:</label>
//                     <input
//                       type="number"
//                       placeholder="Enter min range"
//                       value={q.minRange || ""}
//                       onChange={(e) => handleRangeChange(index, "minRange", e.target.value)}
//                     />
//                     <label>Max Range:</label>
//                     <input
//                       type="number"
//                       placeholder="Enter max range"
//                       value={q.maxRange || ""}
//                       onChange={(e) => handleRangeChange(index, "maxRange", e.target.value)}
//                     />
//                   </div>
//                 )}
                
//               </div>
//             )}
//             {(q.type === "checkbox" || q.type === "radio") && (
//               <div className="options">
//                 {q.options.map((option, oIndex) => (
//                   <input
//                     key={oIndex}
//                     type="text"
//                     placeholder="Enter option text"
//                     value={option}
//                     onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
//                   />
//                 ))}
//                 <button onClick={() => addOption(index)}>Add Option</button>
//               </div>
//             )}
//             <div className="controls">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={q.required}
//                   onChange={() => toggleRequired(index)}
//                 />
//                 Required
//               </label>
//               <button onClick={() => deleteQuestion(index)}>Delete</button>
//             </div>
//             {q.type === "number" && (
//               <span className="error-message">
//                 {validateNumberInput(q.text, q.fixedDigits, q.minRange, q.maxRange)}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FormBuilder;

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
        emailValidation: false, // New email validation field
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
    setQuestions(updatedQuestions);
  };

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
            <input
              type="text"
              placeholder="Enter question text"
              value={q.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
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
            {q.type === "text" && (
              <button onClick={() => toggleEmailValidation(index)}>
                {q.emailValidation ? "Remove Email Validation" : "Add Email Validation"}
              </button>
            )}
            {q.emailValidation && <span className="validation-message">Email format required</span>}
            {q.type === "number" && (
              <div>
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
                  <div>
                    <label>Fixed Digits:</label>
                    <input
                      type="number"
                      placeholder="Enter fixed digits"
                      value={q.fixedDigits || ""}
                      onChange={(e) => handleFixedDigitsChange(index, e.target.value)}
                    />
                  </div>
                )}
                {q.validation === "range" && (
                  <div>
                    <label>Min Range:</label>
                    <input
                      type="number"
                      placeholder="Enter min range"
                      value={q.minRange || ""}
                      onChange={(e) => handleRangeChange(index, "minRange", e.target.value)}
                    />
                    <label>Max Range:</label>
                    <input
                      type="number"
                      placeholder="Enter max range"
                      value={q.maxRange || ""}
                      onChange={(e) => handleRangeChange(index, "maxRange", e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="controls">
              <label>
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
              <button onClick={() => deleteQuestion(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormBuilder;
