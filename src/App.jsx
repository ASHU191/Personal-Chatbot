import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // To handle search visibility  

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;
    
    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending
    
    // Add user question to chat history
    setChatHistory(prev => [...prev, { type: 'question', content: currentQuestion }]);
    
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setChatHistory(prev => [...prev, { type: 'answer', content: aiResponse }]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col">
      <div className="max-w-4xl mx-auto flex flex-col p-6 flex-grow">
        {/* Fixed Header */}
        <header className="text-center py-4 mb-8">
          <a href="https://github.com/ASHU191" 
             target="_blank" 
             rel="noopener noreferrer"
             className="block">
            <h1 className="text-4xl font-bold text-blue-400 hover:text-blue-500 transition-colors">
              ASHU AI
            </h1>
          </a>
        </header>

        {/* Scrollable Chat Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 rounded-lg bg-gray-700 shadow-lg p-6 space-y-4 transform transition-all"
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-gray-800 rounded-xl p-8 max-w-2xl">
                <h2 className="text-2xl font-bold text-blue-500 mb-4">Welcome to ASHU AI! 👋</h2>
                <p className="text-gray-400 mb-4">
                  I'm here to help you with anything you'd like to know. You can ask me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-gray-600 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <span className="text-blue-400">💡</span> General knowledge
                  </div>
                  <div className="bg-gray-600 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <span className="text-blue-400">🔧</span> Technical questions
                  </div>
                  <div className="bg-gray-600 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <span className="text-blue-400">📝</span> Writing assistance
                  </div>
                  <div className="bg-gray-600 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <span className="text-blue-400">🤔</span> Problem solving
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-gray-500 text-sm">
                    Follow me on <a 
                      href="https://www.linkedin.com/in/arsalan-aftab-ashu191" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <i className="fab fa-linkedin"></i> LinkedIn
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} className={`mb-4 ${chat.type === 'question' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] p-4 rounded-lg overflow-auto transform transition-all duration-300 ${
                    chat.type === 'question' 
                      ? 'bg-blue-500 text-white rounded-br-none shadow-xl hover:scale-105'
                      : 'bg-gray-600 text-white rounded-bl-none shadow-xl hover:scale-105'
                  }`}>
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}

          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-gray-600 p-4 rounded-lg animate-pulse transform transition-all duration-300">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form onSubmit={generateAnswer} className="bg-gray-800 rounded-lg shadow-lg p-4 mt-4 transform transition-all duration-300">
          <div className="flex gap-2">
            <textarea
              required
              className="flex-1 border border-gray-600 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none bg-gray-700 text-white transform transition-all duration-300"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors transform hover:scale-105 ${
                generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-center text-sm text-gray-500 py-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Muhammad Arsalan Aftab. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
