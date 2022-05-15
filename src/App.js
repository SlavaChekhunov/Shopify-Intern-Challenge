//Pseudocode:
//Create a form for text prompts and attach an event listener to the submit button
//Submitting the form will send the prompt to the OpenAi API.
//Results will be displayed in a list, sorted from the newest to the latest.
//Each result should include the original prompt and a response from the API.
// API-KEY: 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



import './App.css';
import CreatePost from './components/CreatePost';
import {  useState } from "react";


const App = () => {
  const OPENAI_SECRET = "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";
 const [posts, setPosts] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');


 const handleSubmit = async (event) => {
  event.preventDefault();
  
  const response = await fetch(
    "https://api.openai.com/v1/engines/text-curie-001/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_SECRET}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }),
    }
  );
  const responseJson = await response.json();
  if (response.status === 200) {
    setPrompt('')
    setPosts(responseJson.choices[0].text);
    setMessage("Data received successfully");
  } else {
    setMessage("Some error occurred");
  }
  console.log("json", responseJson);
 };
    
    return (
      <div className="App">
        <form onSubmit={handleSubmit}>
          <label htmlFor="newPost">Enter your Prompt</label>
          <textarea
            id="newPost"
            name="Post"
            rows="20"
            cols="20"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          ></textarea>
          <button>Submit</button>
        </form>
        <div className="message">{message ? <p>{message}</p> : null}</div>
        <div className="text">{posts}</div>
        <div className="text">{prompt}</div>
      </div>
    );
        
}
      
    export default App;