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
import fullscreenGif from "./assets/instructions/fullscreen-light.gif";
import rescueGif from "./assets/instructions/rescue.gif";
import modeSwitchGif from "./assets/instructions/switch-mode.gif";
import topConsoleGif from "./assets/instructions/top-console.gif";
import scoreImg from "./assets/instructions/score.png";
import howToChoose from "./assets/instructions/how-to-choose.png";
import { Prompt } from "react-router";

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

  const infoData = [
    {
      type: "consent",
      title: "Before we start...",
      body: strings.consentBody,
      buttonText: "I agree",
      leftButton: "quit",
      image:
        "https://firebasestorage.googleapis.com/v0/b/driving-simulator-tau-test.appspot.com/o/info-1%2Farrows-gif.gif?alt=media&token=2995f673-3447-40db-b96f-4222be14011b",
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

  let { id, urlPageNumber } = useParams();
  const experimentPath = id;
  const totalPages = 13; //splice later
  //data from firestore!!!////
  ////////////////////////////
  ////////////////////////////
  ////////////////////////////
  ////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [pageNumber, setPageNumber] = useState(urlPageNumber);
  const [pollState, setPollState] = useState(new Array(3).fill(0));
  const [image, setImage] = useState(true);

  // This function sets the css body class name
  useEffect(() => {
    document.body.className = "body-informationPage";
    let imageList = [];
    infoData.forEach(
      (element) => element.image && imageList.push(element.image)
    );
    imageList.forEach((image) => {
      new Image().src = image;
    });
    console.log(imageList);
    // preload images:
  }, []);

  useEffect(() => {
    setPageNumber(urlPageNumber);
  }, [urlPageNumber]);

  const goToPreviousPage = () => {
    setPageNumber(+pageNumber - 1);
    history.push(`/${id}/1/page-${+pageNumber - 1}`);
  };

  const goToNextPage = () => {
    console.log(pageNumber);

    if (+pageNumber > totalPages) {
      history.push({
        pathname: `/${id}/2`, // the path to the driving simulator
        pollData: pollState,
      });
      return;
    }
    setPageNumber(+pageNumber + 1);
    history.push(`/${id}/1/page-${+pageNumber + 1}`);
  };

  let history = useHistory();

  const onClose = function () {
    history.push("/set-1/0");
    //window.open("about:blank", "_self");
    // window.close();
  };

  const handleClick = (direction) => {
    console.log("in handle click in infopage - " + direction);
    if (direction == "quit") {
      onClose();
    } else if (direction == "back") {
      goToPreviousPage();
    } else {
      if (
        pollState[+pageNumber - totalPages + 1] == 0 &&
        infoData[+pageNumber - 1].type == "questionare"
      ) {
        alert("Please choose one of the options");
      } else {
        goToNextPage();
      }
    }
  };

  let currentPageData = infoData[+pageNumber - 1];

  console.log(+pageNumber - 1 + " this is the current page");
  return (
    <div className="info-box">
      {/**<Prompt
        when={pageNumber == [0]}
        message="Are you sure you want to leave?"
      />**/}
      <Alert variant="secondary ">
        <Alert.Heading>{currentPageData.title}</Alert.Heading>
        <hr />

        <NewlineText text={currentPageData.body} />
        <br></br>
        {infoData[+pageNumber - 1 + 1] &&
          infoData[+pageNumber - 1 + 1].image && (
            <img
              src={infoData[+pageNumber - 1 + 1].image}
              className="hide-image-for-preload"
            />
          )}
        {currentPageData.image ? (
          <>
            <img src={currentPageData.image} className="instructions-image" />
          </>
        ) : currentPageData.poll ? (
          <Poll
            currentChecked={pollState[+pageNumber - 12]}
            currentPageData={currentPageData}
            questions={currentPageData.poll}
            pollState={pollState}
            setCurrentAnswer={(value) => {
              const currentPollState = [...pollState];
              currentPollState[+pageNumber - 12] = value.target.value;
              setPollState(currentPollState);
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
