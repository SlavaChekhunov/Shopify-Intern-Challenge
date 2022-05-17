//modules
import {  useState, useEffect } from "react";
import firebase from "./firebase";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";
//styles
import './App.css';


//Pseudocode:
//Create a form for text prompts and attach an event listener to it.
//Submitting the form will send the prompt to the OpenAi API.
//Results will be displayed in a list, sorted from the newest to the latest.
//Each result should include the original prompt and a response from the API.
// API-KEY: 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

const App = () => {
  //responses is the state that displays the response from the API call.
 const [responses, setResponses] = useState('');
 //prompt is the state that displays the prompt the user typed onto the page.
  const [prompt, setPrompt] = useState('');
  //the message is for error handling, that displays an error if there is no response from the API.
  const [message, setMessage] = useState('');
  //container is what is being pushed into the firebase.
  const [container, setContainer] = useState([]);
  
  
  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_OPENAI_SECRET
    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BASE_URL}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }),
    })
      .then((response) => response.json())
      .then((jsonResult) => {
        setResponses(jsonResult.choices[0].text);
      })
      .catch((error) => {
        setMessage(error);
      });
  }, [responses]);

const handleSubmit = (event) => {
  event.preventDefault();
  const database = getDatabase(firebase);
  const dbRef = ref(database);
  push(dbRef, { dataFromAPI: responses, userPrompt: prompt });
  setPrompt("");
};;

useEffect(() => {
  const database = getDatabase(firebase);
  const dbRef = ref(database);
  onValue(dbRef, (response) => {
    // here we're creating a variable to store the new state we want to introduce to our app
    const newState = [];
    // here we store the response from our query to Firebase inside of a variable called data.
    const data = response.val();
    for (let key in data) {
      newState.push({
        key: key,
        response: data[key].dataFromAPI,
        prompt: data[key].userPrompt,
      });
    }
    setContainer(newState.reverse());
  });
}, []);

 const handleRemoveContainer = (containerId) => {
   // here we create a reference to the database
   const database = getDatabase(firebase);
   const dbRef = ref(database, `/${containerId}`);
   remove(dbRef);
 };

    return (
      <div className="App">
        <h1>Fun with AI</h1>
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
        <div className="container">
          {container.map((container) => {
            return (
              <div key={container.key}>
                <p>Prompt: {container.prompt}</p>
                <p>Response: {container.response}</p>
                <button onClick={() => handleRemoveContainer(container.key)}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
      
  export default App;
