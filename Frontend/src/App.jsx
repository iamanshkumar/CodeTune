import { useState , useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import './App.css'
import axios from "axios"
import Markdown from "react-markdown"

function App() {
  const [count, setCount] = useState(0)
  const [code, setcode] = useState(`// Welcome to CodeTune. A platform which reviews your code.
// Enter your code below.
    `)
  
  const [review, setreview] = useState(`Your code will be reviewed here`)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    prism.highlightAll()
  })

  async function reviewCode(){
    try {
      setLoading(true)
      const response = await axios.post("http://localhost:3000/ai/get-review", {code})
      setreview(response.data) 
    } catch (error) {
      console.error("Error reviewing code:", error)
      setreview("Error: Could not get code review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main>
        <div className="top">
          <h1>CodeTune</h1>
        </div>
        <div className="hero">
          <div className="left">
            <div className="code">
            <Editor
              value={code}
              onValueChange={code => setcode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
              <div 
                onClick={reviewCode} 
                className="review"
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
  )
}

export default App