//Pseudocode:
//Create a form for text prompts and attach an event listener to the submit button
//Submitting the form will send the prompt to the OpenAi API.
//Results will be displayed in a list, sorted from the newest to the latest.
//Each result should include the original prompt and a response from the API.
// API-KEY: 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

import './App.css';
import CreatePost from './components/CreatePost';
import { useEffect, useState } from "react";

const App = () => {
  const OPENAI_SECRET =  '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';
 const [posts, setPosts] = useState([]);
 
 
 const data = {
   prompt: "Write a poem about a dog wearing skis",
   temperature: 0.5,
   max_tokens: 64,
   top_p: 1.0,
   frequency_penalty: 0.0,
   presence_penalty: 0.0,
  };
  
  
  useEffect(() => {
    const getApiData = async () => {
      const response = await fetch(
        "https://api.openai.com/v1/engines/text-curie-001/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_SECRET}`,
          },
          body: JSON.stringify(data),
        }
        );
        const responseJson = await response.json();
        console.log("json", responseJson);
        setPosts(responseJson.choices[0].text);
      };
      getApiData();
    }, []);
    
    return (
      <div className="App">
            {posts}
          </div>
        )
        
      }
      
      export default App;
      
      
  