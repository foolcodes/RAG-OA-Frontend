import React, { useState } from "react";

// Main App component for the Document Q&A application
function App() {
  // State variables for managing file input, question input, answer display, and messages
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Function to display a temporary message to the user
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, duration);
  };

  // Handler for file input change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handler for question input change
  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  // Function to handle document upload
  const uploadDocument = async () => {
    if (!selectedFile) {
      showMessage("Please select a file first.");
      return;
    }

    setIsLoading(true); // Set loading state
    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      const response = await fetch(
        "https://rag-oa.onrender.com/upload-document",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload result:", result);
      showMessage("Document uploaded successfully.");
    } catch (error) {
      console.error("Upload failed:", error);
      showMessage("Document upload failed.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to handle asking a question
  const askQuestion = async () => {
    if (!question.trim()) {
      showMessage("Please enter a question.");
      return;
    }

    setIsLoading(true); // Set loading state
    try {
      const response = await fetch("https://rag-oa.onrender.com/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnswer(result.answer || "No answer found.");
    } catch (error) {
      console.error("Failed to get answer:", error);
      setAnswer("Error getting answer.");
      showMessage("Error getting answer.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* Message display area */}
        {message && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300">
            {message}
          </div>
        )}

        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Document Q&A
        </h1>

        {/* Upload Document Section */}
        <div className="mb-8 p-4 border border-gray-200 rounded-md">
          <h2 className="text-xl font-medium mb-4 text-gray-700">
            Upload Document
          </h2>
          <input
            type="file"
            id="documentUpload"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <button
            onClick={uploadDocument}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Ask Question Section */}
        <div className="p-4 border border-gray-200 rounded-md">
          <h2 className="text-xl font-medium mb-4 text-gray-700">
            Ask Question
          </h2>
          <input
            type="text"
            id="questionInput"
            placeholder="Ask about your document"
            value={question}
            onChange={handleQuestionChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            onClick={askQuestion}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Getting Answer..." : "Ask"}
          </button>
        </div>

        {/* Answer Display */}
        <div
          id="answer"
          className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-lg font-semibold text-blue-800 break-words"
        >
          {answer || "Your answer will appear here."}
        </div>
      </div>
    </div>
  );
}

export default App;
