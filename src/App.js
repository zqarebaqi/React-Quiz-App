import { useEffect, useReducer } from "react";
import Header from "./components/Header.js";
import Main from "./components/Main.js";
import Loader from "./components/Loader.js";
import Error from "./components/Error.js";
import StartScreen from "./components/StartScreen.js";
import Question from "./components/Question.js";
import Progress from "./components/Progress.js";
import FinishScreen from "./components/FinishScreen.js";
import NextButton from "./components/NextButton.js";
import Footer from "./components/Footer.js";
import Timer from "./components/Timer.js";

const SECS_PER_QUESTIONS = 30;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secoundRemaining:null,
};


function reducer(state, action) {
  switch (action.type) {
    case "dataRecived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active",secoundRemaining:state.questions.length*SECS_PER_QUESTIONS };
    case "newAnswer":
      const currentQuestion=state.questions.at(state.index)
      return {
        ...state, answer: action.payload,
        points: action.payload === currentQuestion.correctOption
          ? state.points + currentQuestion.points
          : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null }
    case "finish":
      return { ...state, status: "finished", highscore: state.points > state.highscore ? state.points : state.highscore }
    case "restart":
      return {...initialState,questions:state.questions,status:"ready" }

        // ...state,
        // points: 0, highscore: 0, index: 0, answer: null, status: "ready"
     
    case 'tick':
      return {
        ...state, secoundRemaining: state.secoundRemaining - 1,
       status: state.secoundRemaining===0 ?"finished":state.status
       }
    default:
      throw new Error("action unknown");
  }
}



function App() {
  const [{ questions, status, index, answer,points,highscore,secoundRemaining }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;
const maxPossiblePoints=questions.reduce((prev,cur)=>prev+cur.points,0)
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress numQuestions={numQuestions} index={index} maxPossiblePoints={ maxPossiblePoints} points={points} answer={answer} />
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secoundRemaining={secoundRemaining} />
              <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen
         points={ points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} />}
      </Main>
    </div>
  );
}

export default App;
