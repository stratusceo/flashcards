'use client';

import React, { useState, useEffect } from 'react';

import data from "../data.json";

const Flashcard = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Function to select a random element from an array
  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Function to generate a set of unique indices
  const generateUniqueIndices = (excludeIndex) => {
    let indices = new Set();
    while (indices.size < 2) {
      let randomIndex = Math.floor(Math.random() * data.length);
      if (randomIndex !== excludeIndex) {
        indices.add(randomIndex);
      }
    }
    return [...indices];
  };

  // Function to select a word and generate options
  const generateFlashcardData = () => {
    // Select a random word
    const randomIndex = Math.floor(Math.random() * data.length);
    const wordPair = data[randomIndex];

    // Decide whether to show German or French word
    const showGerman = Math.random() < 0.5;
    const questionWord = showGerman ? wordPair.de : wordPair.fr;
    const correctAnswer = showGerman ? wordPair.fr : wordPair.de;

    // Generate incorrect options
    const incorrectIndices = generateUniqueIndices(randomIndex);
    const incorrectOptions = incorrectIndices.map(index => showGerman ? data[index].fr : data[index].de);

    // Combine correct and incorrect options and shuffle
    const options = [correctAnswer, ...incorrectOptions].sort(() => Math.random() - 0.5);

    // Update state
    setCurrentWord(questionWord);
    setOptions(options);
    setCorrectAnswer(correctAnswer);
  };

  useEffect(() => {
    generateFlashcardData();
  }, [data]);


  const checkAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === correctAnswer;
    setIsAnswerCorrect(isCorrect);
    setShowPopup(true);

    // Optionally, hide the popup after a few seconds
    setTimeout(() => {
      setShowPopup(false);
      generateFlashcardData(); // For the next question
    }, 3000); // 3 seconds
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-xl font-bold mb-4">Flashcard</h1>
        <p className="text-lg font-semibold mb-6">{currentWord}</p>
        <div className="grid grid-cols-1 gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => checkAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 border rounded shadow-lg ${isAnswerCorrect ? 'bg-green-200 border-green-400' : 'bg-red-200 border-red-400'}`}>
          {isAnswerCorrect ? 'Correct answer!' : 'Incorrect answer. Try again!'}
        </div>
      )}
    </div>
  );
};

export default Flashcard;
