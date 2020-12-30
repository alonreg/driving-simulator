import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./Consent.css";
import Button from "react-bootstrap/Button";
import * as strings from "./assets/InfoPageStrings.jsx";
import Loader from "react-loader-spinner";
import * as FirestoreService from "./firebase";

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
    //.replaceAll("\\u", "&bull;")
    .split("\\n")
    .map((str) => {
      return str.includes("&bull;") ? (
        <>
          <p className="new-line-text">
            <li>{str.replace("&bull;", "")}</li>
          </p>
        </>
      ) : (
        <p className="new-line-text">{str}</p>
      );
    });

  return newText;
}

const InformationPage = () => {
  const infoData2 = [
    {
      title: "Before we start...",
      body: strings.consentBody,
      image: null,
      //"https://firebasestorage.googleapis.com/v0/b/driving-simulator-tau-test.appspot.com/o/info-1%2Farrows-gif.gif?alt=media&token=2995f673-3447-40db-b96f-4222be14011b",
    },
    {
      title: strings.instructions_title_1,
      body: strings.instructions_body_1,
      image: fullscreenGif,
    },
    {
      title: strings.instructions_title_2,
      body: strings.instructions_body_2,
      image: manModeGif,
    },
    {
      title: strings.instructions_title_3,
      body: strings.instructions_body_3,
      image: howToChoose,
    },
    {
      title: strings.instructions_title_4,
      body: strings.instructions_body_4,
      image: rescueGif,
    },
    {
      title: strings.instructions_title_5,
      body: strings.instructions_body_5,
      image: autoModeGif,
    },
    {
      title: strings.instructions_title_6,
      body: strings.instructions_body_6,
      image: modeSwitchGif,
    },
    {
      title: strings.instructions_title_7,
      body: strings.instructions_body_7,
      image: scoreImg,
    },
    {
      title: strings.instructions_title_8,
      body: strings.instructions_body_8,
      image: calcGif,
    },
    {
      title: strings.instructions_title_9,
      body: strings.instructions_body_9,
      image: topConsoleGif,
    },
    {
      title: strings.instructions_title_10,
      body: strings.instructions_body_10,
      image: null,
    },
    {
      title: "Please answer the following question:",
      body: strings.questionare_body_1,
      image: "18-27, 28-36, 37-50, 51+",
    },
    {
      title: "Please answer the following question:",
      body: strings.questionare_body_2,
      image:
        "Some high school education,Full High School eduction,College degree, 2nd college degree",
    },
    {
      title: "Please answer the following question:",
      body: strings.questionare_body_3,
      image: "Male, Female, Other, Prefer not to say",
    },
  ];

  let { urlInfoDataId, id, urlPageNumber } = useParams();

  const [pageNumber, setPageNumber] = useState(urlPageNumber);
  const [infoData, setInfoData] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pollState, setPollState] = useState([]);

  useEffect(() => {
    if (!infoData) {
      FirestoreService.getInfoDataById(urlInfoDataId).then((infoData) => {
        const data = infoData.data();
        setInfoData(data);
        setTotalPages(data.bodyList.length);
        let newPollState = [];
        data.images.forEach((image) => {
          if (image.includes(",") && !image.includes("png")) {
            console.log("in pollstate 1");
            newPollState.push(0);
          }
        });
        setPollState(newPollState);
        console.log("in pollstate 0 " + pollState.length);
      });
    }
  }, []);

  // This function sets the css body class name and preloads images
  useEffect(() => {
    document.body.className = "body-informationPage";
    let imageList = [];
    if (infoData) {
      infoData.images.forEach(
        (element) => element.image && imageList.push(element.image)
      );
      imageList.forEach((image) => {
        new Image().src = image;
      });
      console.log(imageList);
      // preload images
    }
  }, []);

  useEffect(() => {
    setPageNumber(urlPageNumber);
  }, [urlPageNumber]);

  const goToPreviousPage = () => {
    setPageNumber(+pageNumber - 1);
    history.push(`/${id}/${urlInfoDataId}/1/page-${+pageNumber - 1}`);
  };

  const goToNextPage = () => {
    if (+pageNumber >= totalPages) {
      history.push({
        pathname: `/${id}/${urlInfoDataId}/2`, // the path to the driving simulator
        pollData: pollState,
      });
      return;
    }
    setPageNumber(+pageNumber + 1);
    history.push(`/${id}/${urlInfoDataId}/1/page-${+pageNumber + 1}`);
  };

  let history = useHistory();

  const onClose = function () {
    history.push("/set-1/0");
    //window.open("about:blank", "_self");
    // window.close();
  };

  const handleClick = (direction) => {
    if (direction == "quit") {
      onClose();
    } else if (direction == "back") {
      goToPreviousPage();
    } else {
      if (
        pollState[+pageNumber - totalPages + 1] == 0 &&
        infoData.images[+pageNumber - 1] &&
        infoData.images[+pageNumber - 1].includes(",")
      ) {
        alert("Please choose one of the options");
      } else {
        goToNextPage();
      }
    }
  };

  console.log(+pageNumber - 1 + " this is the current page");

  if (!infoData) {
    console.log("in spingger");
    return (
      <>
        <div className="center-spinner">
          <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
        </div>
      </>
    );
  }

  console.log("out spingger");
  return (
    <div className="info-box">
      <Alert variant="secondary ">
        <Alert.Heading>{infoData.titles[+pageNumber - 1]}</Alert.Heading>
        <hr />
        <NewlineText text={infoData.bodyList[+pageNumber - 1]} />
        <br></br>
        {infoData.images[+pageNumber - 1 + 1] && (
          <img
            src={infoData.images[+pageNumber - 1 + 1]}
            className="hide-image-for-preload"
          />
        )}
        {infoData.images[+pageNumber - 1] &&
        (infoData.images[+pageNumber - 1].includes("data:image") ||
          infoData.images[+pageNumber - 1].includes("gif")) ? (
          <>
            <img
              src={infoData.images[+pageNumber - 1]}
              className="instructions-image"
            />
          </>
        ) : infoData &&
          infoData.images[+pageNumber - 1] &&
          infoData.images[+pageNumber - 1].includes(",") ? (
          <Poll
            currentChecked={pollState[+pageNumber - pollState.length + 1]}
            currentPageData={{
              title: infoData.titles[+pageNumber - 1],
              body: infoData.bodyList[+pageNumber - 1],
              image: infoData.images[+pageNumber - 1],
            }}
            questions={infoData.images[+pageNumber - 1].split(",")}
            pollState={pollState}
            setCurrentAnswer={(value) => {
              const currentPollState = [...pollState];
              currentPollState[+pageNumber - pollState.length + 1] =
                value.target.value;
              setPollState(currentPollState);
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
              onClick={() => handleClick(+pageNumber == 1 ? "quit" : "back")}
            >
              {+pageNumber == 1 ? "quit" : "back"}
            </Button>

            <Button
              type="button"
              variant="success"
              onClick={() =>
                handleClick(
                  +pageNumber >= totalPages ? "begin experiment" : "next"
                )
              }
            >
              {+pageNumber >= totalPages
                ? "begin experiment"
                : +pageNumber == 1
                ? "I agree"
                : "next"}
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default InformationPage;
