import React, { useState, useEffect } from 'react';
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions when the component mounts
    fetch('http://localhost:4000/questions')
      .then(response => response.json())
      .then(data => setQuestions(prevQuestions => [...prevQuestions, ...data]))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);


  const handleFormSubmit = (formData) => {
    // Format the formData according to the required format
    const formattedData = {
      prompt: formData.prompt,
      answers: [formData.answer1, formData.answer2, formData.answer3, formData.answer4],
      correctIndex: parseInt(formData.correctIndex, 10) // Ensure correctIndex is converted to an integer
    };
  
    // Send form data to API
    fetch('http://localhost:4000/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add question');
      }
      return response.json();
    })
    .then(data => {
      // Update the state of questions with the new question
      setQuestions(prevQuestions => [...prevQuestions, data]);
      console.log('Form data submitted successfully:', formattedData);

    })
    .catch(error => {
      console.error('Error submitting form data:', error);
    });
  };
  

  const handleDeleteQuestion = (id) => {
    // Send DELETE request to delete the question with the given id
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
      // Update state to remove the deleted question
      setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id));
    })
    .catch(error => {
      console.error('Error deleting question:', error);
    });
  };

  const handleUpdateCorrectIndex = (id, correctIndex) => {
    // Send PATCH request to update the correct answer index for the question
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correctIndex })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update question');
      }
      // Update state to reflect the change
      setQuestions(prevQuestions => {
        return prevQuestions.map(question => {
          if (question.id === id) {
            return { ...question, correctIndex };
          }
          return question;
        });
      });
    })
    .catch(error => {
      console.error('Error updating question:', error);
    });
  };
  

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? <QuestionForm onSubmit={handleFormSubmit}/> : <QuestionList questions={questions} onDelete={handleDeleteQuestion} onUpdate={handleUpdateCorrectIndex}/>}
    </main>
  );
}

export default App;
