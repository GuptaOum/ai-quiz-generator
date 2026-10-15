import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
//use state the key to store quiz data
// previous button is disabled on first question
// previous button stores the answer selected and allows changing it and stores it again

function App() {
  const [topic, setTopic] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
//unpacking
  useEffect(() => {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      const { topic, currentQuiz, currentQuestionIndex, score, showResults, userAnswers } = JSON.parse(savedState);
      setTopic(topic);
      setCurrentQuiz(currentQuiz);
      setCurrentQuestionIndex(currentQuestionIndex);
      setScore(score);
      setShowResults(showResults);
      setUserAnswers(userAnswers || []);
    }
  }, []);
//packing
  useEffect(() => {
    if (currentQuiz) {
      const quizState = { // shorthand property names object syntax
        topic,
        currentQuiz,
        currentQuestionIndex,
        score,
        showResults,
        userAnswers
      };
      localStorage.setItem('quizState', JSON.stringify(quizState));
    } else {
      localStorage.removeItem('quizState');
    }
  }, [topic, currentQuiz, currentQuestionIndex, score, showResults, userAnswers]);

  const handleTopicSubmit = async () => {
    if (!topic) return;

    setLoading(true);
    setError('');
    setCurrentQuiz(null);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `
        Create a 5-question multiple-choice quiz on the topic of "${topic}".
        Return the quiz as a valid JSON object with the following structure:
        {
          "topic": "Your Topic",
          "questions": [
            {
              "question": "Your question here",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
              "correctAnswer": "The correct option"
            }
          ]
        }
        Do not include any text outside of the JSON object.'
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response to get only the JSON part
      const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      
      const parsedQuiz = JSON.parse(jsonString);
      
      if (parsedQuiz && parsedQuiz.questions && parsedQuiz.questions.length > 0) {
        setCurrentQuiz(parsedQuiz);
        setCurrentQuestionIndex(0);
        setScore(0);
        setUserAnswers([]);
        setShowResults(false);
        setShowReview(false);
      } else {
        throw new Error("Invalid quiz format received.");
      }
    } catch (e) {
      console.error("Error generating or parsing quiz:", e);
      setError("Failed to generate or parse the quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option) => {
    const newUserAnswers = [...userAnswers];
    if (newUserAnswers[currentQuestionIndex] === option) {// '====' is strict equality check and it shows the answer is 
      // already selected
      // If the same option is clicked again, deselect it
      newUserAnswers[currentQuestionIndex] = undefined;
    } else {
      // Otherwise, select the new option
      newUserAnswers[currentQuestionIndex] = option;
    }
    setUserAnswers(newUserAnswers);
  };
//next question or show results
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score and show results
      let finalScore = 0;
      userAnswers.forEach((answer, index) => {
        if (answer === currentQuiz.questions[index].correctAnswer) {
          finalScore++;
        }
      });
      setScore(finalScore);
      setShowResults(true);
    }
  };
// previous question button
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartQuiz = () => {
    setTopic('');
    setCurrentQuiz(null);
    setShowResults(false);
    setShowReview(false);
    setError('');
  }

  const renderQuiz = () => {
    if (loading) {
      return <div className="loading-screen"><h2>Generating your quiz...</h2></div>;
    }

    if (error) {
        return (
            <div className="error-screen">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={restartQuiz}>Try Again</button>
            </div>
        );
    }

    if (showResults) {
      return (
        <div className="results-screen">
          <h2>Quiz Results</h2>
          <p>You scored {score} out of {currentQuiz.questions.length}</p>
          
          <div className="results-actions">
            {!showReview && (
                <button onClick={() => setShowReview(true)}>Review Answers</button>
            )}
            <button onClick={restartQuiz}>Try Another Topic</button>
          </div>

          {showReview && (
            <div className="results-details">
              {currentQuiz.questions.map((question, index) => (
                <div key={index} className="result-question">
                  <p><strong>Question {index + 1}:</strong> {question.question}</p>
                  <p className={userAnswers[index] === question.correctAnswer ? 'correct-answer' : 'incorrect-answer'}>
                    Your answer: {userAnswers[index] || "Not answered"}
                  </p>
                  {userAnswers[index] !== question.correctAnswer && (
                    <p className="correct-answer">Correct answer: {question.correctAnswer}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (!currentQuiz) {
      return (
        <div className="topic-selection">
          <h1>MCQ Quiz Generator</h1>
          <p>Enter any topic to generate a Quiz.</p>
          <div className="topic-input-area">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTopicSubmit()}
              placeholder="Enter a topic (e.g., 'React Hooks')"
            />
            <button onClick={handleTopicSubmit}>Start Quiz</button>
          </div>
        </div>
      );
    }

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    return (
      <div className="quiz-container">
        <h2>{currentQuiz.topic} Quiz</h2>
        <div className="question-container">
          <h3>Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}</h3>
          <p>{currentQuestion.question}</p>
        </div>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => {
            const isSelected = userAnswers[currentQuestionIndex] === option;
            let buttonClass = 'option-button';
            if (isSelected) {
              buttonClass += ' selected';
            }
            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button onClick={handleNextQuestion}>
            {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next' : 'Show Results'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {renderQuiz()}
    </div>
  );
}

export default App;
