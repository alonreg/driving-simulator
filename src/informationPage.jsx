import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./Consent.css";
import Button from "react-bootstrap/Button";
import * as strings from "./assets/InfoPageStrings.jsx";

import Poll from "./components/poll.jsx";
import Alert from "react-bootstrap/Alert";
import infoBg from "./assets/particle-bg.jpg";
import autoModeGif from "./assets/instructions/arrows-auto.gif";
import manModeGif from "./assets/instructions/arrows-man.gif";
import calcGif from "./assets/instructions/calc.gif";
import fullscreenGif from "./assets/instructions/fullscreen.gif";
import rescueGif from "./assets/instructions/rescue.gif";
import modeSwitchGif from "./assets/instructions/switch-mode.gif";
import topConsoleGif from "./assets/instructions/top-console.gif";
import scoreImg from "./assets/instructions/score.png";
import howToChoose from "./assets/instructions/how-to-choose.png";

function NewlineText(props) {
  const text = props.text;
  const newText = text
    .split("\n")
    .map((str) => <p className="new-line-text">{str}</p>);

  return newText;
}

const InformationPage = () => {
  //data from firestore!!!/////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  const consentText = `The study should take about 20 minutes, but you are free to go through it at your own pace. Your participation in this research is voluntary.
  If you complete the study, you will receive payment for your participation. You have the right to withdraw at any point during the
  study, for any reason, and without any negative consequences for you. Your responses are completely anonymous, and we do not collect any
  individually identifiable information about you. Any information about responses published as a result of the study will be reported
  anonymously. Upon your request, the researchers are obliged to delete any information provided by you during the course of the study.
  
  Contact details: 
  Principle Investigator: Prof. Joachim Meyer, Email: jmeyer@tauex.tau.ac.il.
  
  By clicking the button below, you acknowledge that your participation in the study is voluntary, you are 18 years of age or older, and you are aware that you may choose to terminate your participation in the study at any time and for any reason.`;
  const infoData = [
    {
      type: "consent",
      title: "Before we start...",
      body: strings.consentBody,
      buttonText: "I agree",
      leftButton: "quit",
      image: null,
    },
    {
      type: "instructions",
      title: strings.instructions_title_1,
      body: strings.instructions_body_1,
      buttonText: "next",
      leftButton: "back",
      image: fullscreenGif,
    },
    {
      type: "instructions",
      title: strings.instructions_title_2,
      body: strings.instructions_body_2,
      buttonText: "next",
      leftButton: "back",
      image: manModeGif,
    },
    {
      type: "instructions",
      title: strings.instructions_title_3,
      body: strings.instructions_body_3,
      buttonText: "next",
      leftButton: "back",
      image: howToChoose,
    },
    {
      type: "instructions",
      title: strings.instructions_title_4,
      body: strings.instructions_body_4,
      buttonText: "next",
      leftButton: "back",
      image: rescueGif,
    },
    {
      type: "instructions",
      title: strings.instructions_title_5,
      body: strings.instructions_body_5,
      buttonText: "next",
      leftButton: "back",
      image: autoModeGif,
    },
    {
      type: "instructions",
      title: strings.instructions_title_6,
      body: strings.instructions_body_6,
      buttonText: "next",
      leftButton: "back",
      image: modeSwitchGif,
    },
    {
      type: "instructions",
      title: strings.instructions_title_7,
      body: strings.instructions_body_7,
      buttonText: "next",
      leftButton: "back",
      image: scoreImg,
    },
    {
      type: "instructions",
      title: strings.instructions_title_8,
      body: strings.instructions_body_8,
      buttonText: "next",
      leftButton: "back",
      image: calcGif,
    },
    {
      type: "instructions",
      title: strings.instructions_title_9,
      body: strings.instructions_body_9,
      buttonText: "next",
      leftButton: "back",
      image: topConsoleGif,
    },
    {
      type: "instructions",
      title: strings.instructions_title_10,
      body: strings.instructions_body_10,
      buttonText: "next",
      leftButton: "back",
      image: null,
    },
    {
      type: "questionare",
      title: "Please answer the following question:",
      body: strings.questionare_body_1,
      buttonText: "next",
      leftButton: "back",
      poll: ["18-27", "28-36", "37-50", "51+"],
    },
    {
      type: "questionare",
      title: "Please answer the following question:",
      body: strings.questionare_body_2,
      buttonText: "next",
      leftButton: "back",
      poll: [
        "Some high school education",
        "Full High School eduction",
        "College degree",
        "2nd college degree",
      ],
    },
    {
      type: "questionare",
      title: "Please answer the following question:",
      body: strings.questionare_body_3,
      buttonText: "begin experiment",
      leftButton: "back",
      poll: ["Male", "Female", "Other", "Prefer not to say"],
    },
  ];

  let { id } = useParams();
  const experimentPath = id;
  const totalPages = 13; //splice later
  //data from firestore!!!////
  ////////////////////////////
  ////////////////////////////
  ////////////////////////////
  ////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [page, setPage] = useState(["questionare"]);
  const [pageNumber, setPageNumber] = useState([0]);
  const [pollState, setPollState] = useState(new Array(3).fill(0));
  const [currentChecked, setCurrentChecked] = useState("");

  // This function sets the css body class name
  useEffect(() => {
    document.body.className = "body-informationPage";
  }, []);

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
    console.log(pageNumber);
    console.log(page);

    if (pageNumber[pageNumber.length - 1] + 1 > totalPages) {
      history.push({
        pathname: "2",
        pollData: pollState,
      });
      return;
    }

    setPageNumber([...pageNumber, pageNumber[pageNumber.length - 1] + 1]);

    /**
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
     */
  };

  let history = useHistory();

  const onClose = function () {
    window.open("about:blank", "_self");
    window.close();
  };

  const handleClick = (direction) => {
    console.log("in handle click in infopage - " + direction);
    if (direction == "quit") {
      onClose();
    } else if (direction == "back") {
      goToPreviousPage();
    } else {
      if (
        currentChecked == "" &&
        infoData[pageNumber[pageNumber.length - 1]].type == "questionare"
      ) {
        alert("Please choose one of the options");
      } else {
        setCurrentChecked("");
        goToNextPage();
      }
    }
  };

  let currentPageData = infoData[pageNumber[pageNumber.length - 1]];
  console.log(pageNumber[pageNumber.length - 1] + " this is the current page");
  return (
    <div className="info-box">
      <Alert variant="secondary ">
        <Alert.Heading>{currentPageData.title}</Alert.Heading>
        <hr />

        <NewlineText text={currentPageData.body} />
        <br></br>
        {currentPageData.image ? (
          <img
            src={currentPageData.image}
            alt="image"
            className="instructions-image"
          ></img>
        ) : currentPageData.poll ? (
          <Poll
            currentChecked={currentChecked}
            currentPageData={currentPageData}
            questions={currentPageData.poll}
            pollState={pollState}
            setCurrentAnswer={(value) => {
              const currentPollState = [...pollState];
              currentPollState[pageNumber[pageNumber.length - 1] - 8] =
                value.target.value;
              setPollState(currentPollState);
              setCurrentChecked(value.target.value);
              console.log("current poll state:" + currentPollState);
              console.log("poll num: " + pageNumber[pageNumber.length - 8]);
            }}
          />
        ) : (
          <p1></p1>
        )}
        <br></br>
        <div className="consent-button">
          <div className="agree-button">
            <Button
              type="button"
              variant="danger"
              onClick={() => handleClick(currentPageData.leftButton)}
            >
              {currentPageData.leftButton}
            </Button>

            <Button
              type="button"
              variant="success"
              onClick={() => handleClick(currentPageData.buttonText)}
            >
              {currentPageData.buttonText}
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default InformationPage;
