import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css"; 
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import './App.css';
import axios from "axios";
import Markdown from "react-markdown";

function App() {
  const [code, setCode] = useState(`// Welcome to CodeTune. A platform which reviews your code.
// Enter your code below.
    `);
  
  const [review, setReview] = useState(`Your code will be reviewed here`);
  const [loading, setLoading] = useState(false);

  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme); 
    localStorage.setItem('theme', theme); 
  }, [theme]);


  useEffect(() => {
    prism.highlightAll();
  }, [code]); 

  async function reviewCode() {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data); 
    } catch (error) {
      console.error("Error reviewing code:", error);
      setReview("Error: Could not get code review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <main>
        <div className="top">
          <h1>CodeTune</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
        <div className="hero">
          <div className="left">
            <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                
                height: "100%",
                width: "100%"
              }}
            />
              <div 
                onClick={reviewCode} 
                className={`review ${loading ? 'loading' : ''}`} 
                style={{ 
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Reviewing...' : 'Review'}
              </div>
            </div>
          </div>
          <div className="right">
            <Markdown>{review}</Markdown>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
