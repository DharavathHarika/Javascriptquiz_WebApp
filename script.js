var currentQuestionIndex = 0;
var score = 0;
var quizData; // Placeholder for the quiz data

// Fetch quiz data from the JSON file
function fetchQuizData() {
  return fetch('quiz.json')
    .then(response => response.json())
    .then(data => data.questions);
}

// Display the current question and options
function displayQuestion(question) {
  var questionElement = document.getElementById('question');
  var optionsElement = document.getElementById('options');
  var resultElement = document.getElementById('result');
  var verifyButton = document.getElementById('verify-button');
  var nextButton = document.getElementById('next-button');
  var questionLevelElement = document.getElementById('question-level');

  questionElement.textContent = 'Q' + (currentQuestionIndex + 1) + ': ' + question.question;
  questionLevelElement.textContent = 'Level: ' + question.rank.toUpperCase();

  optionsElement.innerHTML = '';
  question.options.forEach((option, index) => {
    var labelElement = document.createElement('label');
    var inputElement = document.createElement('input');
    var spanElement = document.createElement('span');

    inputElement.setAttribute('type', 'radio');
    inputElement.setAttribute('name', 'options');
    inputElement.setAttribute('value', index);
    inputElement.id = 'option' + index;

    labelElement.appendChild(inputElement);
    labelElement.appendChild(spanElement);
    spanElement.textContent = option;

    optionsElement.appendChild(labelElement);

  });

  if(currentQuestionIndex == 14)
    nextButton.textContent = 'Submit'
    
  resultElement.textContent = '';
  verifyButton.style.display = 'inline';
  nextButton.style.display = 'none';
}

// Check the selected answer and display the result
function checkAnswer() {
  var selectedAnswer = document.querySelector('input[name="options"]:checked');
  var resultElement = document.getElementById('result');
  var verifyButton = document.getElementById('verify-button');
  var nextButton = document.getElementById('next-button');

  if (selectedAnswer) {
    var selectedOptionIndex = parseInt(selectedAnswer.value);
    var currentQuestion = quizData[currentQuestionIndex];
    var correctAnswerIndex = currentQuestion.answer.charCodeAt(0) - 97;

    if (selectedOptionIndex === correctAnswerIndex) {
      resultElement.textContent = 'Correct!';
      resultElement.style.color = 'green';
      resultElement.style.fontWeight = 'bold';
      score += getQuestionScore(currentQuestionIndex);
    } else {
      resultElement.textContent = 'Incorrect! The correct answer is ' + currentQuestion.options[correctAnswerIndex];
      resultElement.style.color = 'red';
      resultElement.style.fontWeight = 'bold';
    }

    verifyButton.style.display = 'none';
    nextButton.style.display = 'inline';
  } else {
    alert('Please select the correct option.'); // Display an alert if no answer is selected
  }
}

// Get the score for the current question based on its difficulty rank
function getQuestionScore(questionIndex) {
  var question = quizData[questionIndex];
  switch (question.rank) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
      return 3;
    default:
      return 0;
  }
}

// Handle AI assistant functionality
function handleAIAssistant() {
  var userQuestion = prompt('Ask a question related to AJAX or JSON:');
  if (userQuestion) {
    userQuestion = userQuestion.toLowerCase().trim();
    findAnswer(userQuestion)
      .then(answer => {
        if (answer) {
          alert('AI Assistant: ' + answer);
        } else {
          alert('AI Assistant: Sorry, I could not find an answer to your question.');
        }
      })
      .catch(error => {
        console.error('Failed to find answer:', error);
        alert('AI Assistant: Sorry, an error occurred while finding the answer.');
      });
  }
}


// Find the answer to the user's question using AI techniques
function findAnswer(question) {
  // Load AI knowledge base from JSON file
  return fetch('aiKnowledgeBase.json')
    .then(response => response.json())
    .then(data => {
      var aiKnowledgeBase = data.aiKnowledgeBase;

      // Find the closest matching question in the knowledge base
      var matchingQuestion = Object.keys(aiKnowledgeBase).find(knowledgeQuestion =>
        question.includes(knowledgeQuestion)
      );

      if (matchingQuestion) {
        return aiKnowledgeBase[matchingQuestion];
      }

      return null;
    })
    .catch(error => {
      console.error('Failed to fetch AI knowledge base:', error);
      return null;
    });
}


function nextQuestion() {
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    displayQuestion(quizData[currentQuestionIndex]);
  } else {
    // Redirect to the score.html page with the score as a query parameter
    window.location.href = 'score.html?score=' + score;
  }
}

// Initialize the quiz
function initQuiz() {
  fetchQuizData()
    .then(data => {
      quizData = data;
      displayQuestion(quizData[currentQuestionIndex]);
    })
    .catch(error => {
      console.error('Failed to fetch quiz data:', error);
    });

  var verifyButton = document.getElementById('verify-button');
  var nextButton = document.getElementById('next-button');
  verifyButton.addEventListener('click', checkAnswer);
  nextButton.addEventListener('click', nextQuestion);

  // Get the AI Assistant button element
  var aiAssistantButton = document.getElementById('ai-assistant-button');
  // Add click event listener to the AI Assistant button
  aiAssistantButton.addEventListener('click', handleAIAssistant);
}

// Initialize the quiz when the page loads
window.addEventListener('DOMContentLoaded', initQuiz);
