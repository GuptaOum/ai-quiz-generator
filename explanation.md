# Explanation of the fix for preventing quiz reset on refresh

## The Problem

The quiz application was losing its state whenever the page was refreshed. If a user was in the middle of a quiz and accidentally refreshed the page, all their progress would be lost, and they would be taken back to the home page. This happened because the quiz state was only stored in the component's memory, which is cleared on a page reload.

## The Solution

To solve this problem, I used the browser's `localStorage`. `localStorage` is a web storage feature that allows web applications to store data persistently in a user's browser. This data remains available even after the browser window is closed and reopened.

By saving the quiz state to `localStorage`, we can restore it when the user reloads the page, allowing them to continue their quiz from where they left off.

## Implementation Details

I made the following changes to the `src/App.jsx` file:

1.  **Imported `useEffect`:** I imported the `useEffect` hook from React, which is used to perform side effects in function components. In this case, the side effects are reading from and writing to `localStorage`.

2.  **Loading State from `localStorage`:** I added a `useEffect` hook that runs once when the `App` component is first loaded. This hook checks if there is any saved quiz state in `localStorage`. If it finds any, it loads the state and updates the component's state variables.

    ```javascript
    useEffect(() => {
      const savedState = localStorage.getItem('quizState');
      if (savedState) {
        const { topic, currentQuiz, currentQuestionIndex, score, showResults } = JSON.parse(savedState);
        setTopic(topic);
        setCurrentQuiz(currentQuiz);
        setCurrentQuestionIndex(currentQuestionIndex);
        setScore(score);
        setShowResults(showResults);
      }
    }, []);
    ```

3.  **Saving State to `localStorage`:** I added another `useEffect` hook that runs whenever the quiz state changes. This hook saves the current state to `localStorage`. The state is stored as a JSON string. If the quiz is finished or restarted, the state is removed from `localStorage`.

    ```javascript
    useEffect(() => {
      if (currentQuiz) {
        const quizState = {
          topic,
          currentQuiz,
          currentQuestionIndex,
          score,
          showResults
        };
        localStorage.setItem('quizState', JSON.stringify(quizState));
      } else {
        localStorage.removeItem('quizState');
      }
    }, [topic, currentQuiz, currentQuestionIndex, score, showResults]);
    ```

The state variables that are being persisted are:
-   `topic`: The topic of the quiz.
-   `currentQuiz`: The quiz object containing the questions and answers.
-   `currentQuestionIndex`: The index of the current question.
-   `score`: The user's current score.
-   `showResults`: A boolean to indicate if the results page should be displayed.

With these changes, the quiz state is now preserved across page reloads, providing a much better user experience.

---

# Update: Delayed Feedback and Detailed Results

Further improvements have been made to the quiz flow based on user feedback.

## The Changes

1.  **No Immediate Feedback:** The application no longer reveals the correct answer immediately after a user makes a selection. This encourages users to answer based on their knowledge without instant validation.

2.  **Detailed End-of-Quiz Results:** Instead of just showing the final score, the results page now provides a comprehensive review of the quiz. For each question, it displays:
    *   The question itself.
    *   The user's submitted answer, clearly marked as correct or incorrect.
    *   The correct answer (if the user's answer was incorrect).

3.  **Storing User Answers:** A new state variable, `userAnswers`, was introduced to store the user's selection for each question. This array is essential for calculating the score and displaying the detailed results at the end.

## Implementation Details

1.  **New State for User Answers:**
    ```javascript
    const [userAnswers, setUserAnswers] = useState([]);
    ```

2.  **Modified Answer Handling:** The `handleAnswerClick` function was replaced with `handleAnswerSelect`. This new function simply records the user's answer in the `userAnswers` array without any immediate validation. The score is now calculated only when the user clicks "Show Results" on the final question.

3.  **Enhanced Results Display:** The `renderQuiz` function was updated to show the detailed results breakdown when `showResults` is `true`.

4.  **Persisting User Answers:** The `userAnswers` array has been added to the data saved in `localStorage`. This ensures that if a user refreshes the page mid-quiz, their already selected answers are remembered.

    **Loading from `localStorage`:**
    ```javascript
    useEffect(() => {
      const savedState = localStorage.getItem('quizState');
      if (savedState) {
        const { topic, currentQuiz, currentQuestionIndex, score, showResults, userAnswers } = JSON.parse(savedState);
        // ... (other state updates)
        setUserAnswers(userAnswers || []);
      }
    }, []);
    ```

    **Saving to `localStorage`:**
    ```javascript
    useEffect(() => {
      if (currentQuiz) {
        const quizState = {
          // ... (other state)
          userAnswers
        };
        localStorage.setItem('quizState', JSON.stringify(quizState));
      } else {
        localStorage.removeItem('quizState');
      }
    }, [topic, currentQuiz, currentQuestionIndex, score, showResults, userAnswers]);
    ```

These changes create a more realistic and engaging quiz experience, where users must complete the entire quiz before seeing their results.

---

# Update: Results Screen Enhancements and Skipping Questions

Further refinements have been made to the quiz application to improve user experience.

## The Changes

1.  **"Review Answers" Option:** On the results screen, the detailed answer review is now hidden by default. A new "Review Answers" button is provided, allowing users to explicitly choose when to view the detailed breakdown of questions, their answers, and the correct answers.

2.  **Visual Feedback on Selection:** When a user selects an option for a question, the chosen option visually changes (turns green) to confirm their selection.

3.  **Skip Question Functionality:** Users are no longer forced to select an answer for each question. The "Next Question" button is always enabled, allowing them to skip questions they don't know or prefer not to answer. Unanswered questions will be marked as "Not answered" in the final review.

## Implementation Details

1.  **New `showReview` State:** A new state variable, `showReview`, was added to control the visibility of the detailed answer review on the results page. This state is reset when a new quiz starts or the quiz is restarted.

2.  **Conditional Rendering on Results Screen:** The `renderQuiz` function was modified to conditionally display the `results-details` section based on the `showReview` state. A "Review Answers" button was added to toggle this state. The buttons on the results screen were also grouped in a `results-actions` div for better layout.

3.  **CSS for Selected Option:** A new CSS rule was added to `src/Quiz.css` for `.option-button.selected`. This rule applies a green background and white text to the selected option button, providing visual feedback.

4.  **Enabled "Next Question" Button:** The `disabled` attribute was removed from the "Next Question" button in `src/App.jsx`. This allows users to click "Next Question" even if they haven't selected an answer for the current question.

---

# Update: Previous Question Navigation and Styling

Additional features and styling refinements have been added to further improve the quiz experience.

## The Changes

1.  **Green Color for Selected Option:** The selected option is now explicitly styled with a green background (`#2ecc71`) and white text, providing clear and intuitive visual feedback for the user's choice.

2.  **Previous Question Navigation:** Users can now navigate back to previous questions using a "Previous" button. This allows them to review and change their answers before submitting the quiz. The "Previous" button is disabled on the first question.

## Implementation Details

1.  **`handlePreviousQuestion` Function:** A new function, `handlePreviousQuestion`, was added to `src/App.jsx`. This function decrements the `currentQuestionIndex`, allowing the user to go to the previous question.

2.  **Navigation Buttons:** The `renderQuiz` function was updated to include a "Previous" button alongside the "Next" button. Both buttons are grouped in a `.navigation-buttons` container for better layout and styling.

3.  **Updated CSS:**
    *   The styles for `.option-button.selected` in `src/Quiz.css` were updated to use `--correct-color` for the `background-color` and `border-color`.
    *   New styles were added for the `.navigation-buttons` container to ensure proper layout and styling of the "Previous" and "Next" buttons, including a disabled state for the "Previous" button.

---

# Update: Deselect Option

The quiz now allows users to deselect an option they have previously chosen for a question.

## The Changes

1.  **Toggle Selection:** Clicking an already selected option will now deselect it, turning the option back to its normal, unselected state.

## Implementation Details

1.  **Modified `handleAnswerSelect` Function:** The logic within `handleAnswerSelect` in `src/App.jsx` was updated. It now checks if the `option` that was clicked is the same as the currently selected answer for the `currentQuestionIndex`. If it is, the answer for that question is set to `undefined`, effectively deselecting it. If a different option is clicked, it becomes the new selected answer.
