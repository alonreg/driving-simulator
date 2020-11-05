import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Consent.css";
import Button from "react-bootstrap/Button";
import * as strings from "./assets/InfoPageStrings.jsx";
import DrivingConsoleImage from "./assets/instructions/arrows.png";
import CalculatorImage from "./assets/instructions/calculator.png";
import ModeImage from "./assets/instructions/mode.png";
import RightImage from "./assets/instructions/right.png";
import ScoreboardImage from "./assets/instructions/scoreboard.png";
import StartImage from "./assets/instructions/start.png";

const InformationPage = () => {
  const [page, setPage] = useState(["consent"]);
  const [pageNumber, setPageNumber] = useState([1]);
  const [questionare, setQuestionare] = useState({
    question1: "",
    question1: "",
    question1: "",
  });

  const goToPreviousPage = () => {
    const newPageNumber = pageNumber.slice();
    newPageNumber.pop();
    const newPage = page.slice();
    newPage.pop();
    setPageNumber(newPageNumber);
    setPage(newPage);
  };

  const goToNextPage = () => {
    const currentPage = page[page.length - 1];
    console.log("in go to next in infopage - ");
    console.log(pageNumber);
    console.log(page);

    switch (currentPage) {
      case "consent":
        //if this is not the last page of consent
        if (
          typeof infoData.consent[pageNumber[pageNumber.length - 1] + 1] !==
          "undefined"
        ) {
          setPageNumber([...pageNumber, pageNumber[pageNumber.length - 1] + 1]);
          setPage([...page, "consent"]);
          console.log("111");
          break;
        } else {
          setPageNumber([...pageNumber, 1]);
          console.log("222");
          setPage([...page, "instructions"]);
          break;
        }
      case "instructions":
        if (
          typeof infoData.instructions[
            pageNumber[pageNumber.length - 1] + 1
          ] !== "undefined"
        ) {
          setPageNumber([...pageNumber, pageNumber[pageNumber.length - 1] + 1]);
          setPage([...page, "instructions"]);
          break;
        } else {
          setPageNumber([...pageNumber, 1]);
          setPage([...page, "questionare"]);
          break;
        }
      case "questionare":
        if (
          typeof infoData.questionare[pageNumber[pageNumber.length - 1] + 1] !==
          "undefined"
        ) {
          setPageNumber([...pageNumber, pageNumber[pageNumber.length - 1] + 1]);
          setPage([...page, "questionare"]);

          break;
        } else {
          history.push("/set-1");
          break;
        }
      default:
        break;
    }
  };

  let history = useHistory();

  const onClose = function () {
    window.open("about:blank", "_self");
    window.close();
  };

  const handleClick = (direction) => {
    console.log("in handle click in infopage - " + direction);
    direction == "quit"
      ? onClose()
      : direction == "back"
      ? goToPreviousPage()
      : goToNextPage();
  };

  const consentText = `The study should take about 20 minutes, but you are free to go through it at your own pace. Your participation in this research is voluntary.
  If you complete the study, you will receive payment for your participation. You have the right to withdraw at any point during the
  study, for any reason, and without any negative consequences for you. Your responses are completely anonymous, and we do not collect any
  individually identifiable information about you. Any information about responses published as a result of the study will be reported
  anonymously. Upon your request, the researchers are obliged to delete any information provided by you during the course of the study.
  
  Contact details: 
  Principle Investigator: Prof. Joachim Meyer, Email: jmeyer@tauex.tau.ac.il.
  
  By clicking the button below, you acknowledge that your participation in the study is voluntary, you are 18 years of age or older, and you are aware that you may choose to terminate your participation in the study at any time and for any reason.`;

  const infoData = {
    consent: {
      1: {
        title: "Before we start...",
        body: strings.consentBody,
        buttonText: "I agree",
        leftButton: "quit",
        image: null,
      },
    },
    instructions: {
      1: {
        title: strings.instructions_title_1,
        body: strings.instructions_body_1,
        buttonText: "next",
        leftButton: "back",
        image: null,
      },
      2: {
        title: strings.instructions_title_2,
        body: strings.instructions_body_2,
        buttonText: "next",
        leftButton: "back",
        image: DrivingConsoleImage,
      },
      3: {
        title: strings.instructions_title_3,
        body: strings.instructions_body_3,
        buttonText: "next",
        leftButton: "back",
        image: RightImage,
      },
      4: {
        title: strings.instructions_title_4,
        body: strings.instructions_body_4,
        buttonText: "next",
        leftButton: "back",
        image: ModeImage,
      },
      5: {
        title: strings.instructions_title_5,
        body: strings.instructions_body_5,
        buttonText: "next",
        leftButton: "back",
        image: ScoreboardImage,
      },
      6: {
        title: strings.instructions_title_6,
        body: strings.instructions_body_6,
        buttonText: "next",
        leftButton: "back",
        image: CalculatorImage,
      },
      7: {
        title: strings.instructions_title_7,
        body: strings.instructions_body_7,
        buttonText: "next",
        leftButton: "back",
        image: null,
      },
    },
    questionare: {
      1: {
        title: "Question 1",
        body: strings.questionare_body_1,
        buttonText: "next",
        leftButton: "back",
        image: null,
      },
      2: {
        title: "Question 2",
        body: strings.questionare_body_2,
        buttonText: "next",
        leftButton: "back",
        image: null,
      },
      3: {
        title: "Question 3",
        body: strings.questionare_body_3,
        buttonText: "begin experiment",
        leftButton: "back",
        image: null,
      },
    },
  };

  let currentPage =
    infoData[page[page.length - 1]][pageNumber[pageNumber.length - 1]];
  return (
    <>
      <div className="rectangle">
        <div className="consent-text">
          <h1>{currentPage.title}</h1>
        </div>
        <div className="consent-text">{currentPage.body}</div>
        <br></br>
        <br></br>
        {currentPage.image ? (
          <img
            src={currentPage.image}
            alt="image"
            className="instructions-image"
          ></img>
        ) : (
          <br></br>
        )}
        <div className="consent-button">
          <div className="agree-button">
            <Button
              type="button"
              variant="danger"
              onClick={() => handleClick(currentPage.leftButton)}
            >
              {currentPage.leftButton}
            </Button>

            <Button
              type="button"
              variant="success"
              onClick={() => handleClick(currentPage.buttonText)}
            >
              {currentPage.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InformationPage;
