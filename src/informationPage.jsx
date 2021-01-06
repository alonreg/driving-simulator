import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import * as strings from "./assets/InfoPageStrings.jsx";
import Loader from "react-loader-spinner";
import * as FirestoreService from "./firebase";

import Poll from "./components/poll.jsx";
import Alert from "react-bootstrap/Alert";

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
  let { urlInfoDataId, id, urlPageNumber } = useParams();

  const [pageNumber, setPageNumber] = useState(urlPageNumber - 1);
  const [infoData, setInfoData] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pollState, setPollState] = useState([]);
  const [firstPollPosition, setFirstPollPosition] = useState(-1);

  useEffect(() => {
    if (!infoData) {
      FirestoreService.getInfoDataById(urlInfoDataId).then((infoData) => {
        const data = infoData.data();
        setInfoData(data);
        setTotalPages(data.bodyList.length);
        let newPollState = [];
        let firstQuestion = true;
        data.images.forEach((image, i) => {
          if (image.includes(",") && !image.includes("png")) {
            if (firstQuestion) {
              firstQuestion = false;
              setFirstPollPosition(i);
            }
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
    setPageNumber(urlPageNumber - 1);
  }, [urlPageNumber]);

  const goToPreviousPage = () => {
    setPageNumber(+pageNumber - 1);
    history.push(`/${id}/${urlInfoDataId}/1/page-${+pageNumber}`);
  };

  const goToNextPage = () => {
    if (+pageNumber >= totalPages - 1) {
      history.push({
        pathname: `/${id}/${urlInfoDataId}/2`, // the path to the driving simulator
        pollData: pollState,
      });
      return;
    }
    setPageNumber(+pageNumber + 1);
    history.push(`/${id}/${urlInfoDataId}/1/page-${+pageNumber + 2}`);
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
        pollState[pageNumber - firstPollPosition] == 0 &&
        infoData.images[+pageNumber] &&
        infoData.images[+pageNumber].includes(",")
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
    <div className="bg-infopage">
      <div className="parent-infopage">
        <div className="div1-infopage">
          <h1>{infoData.titles[+pageNumber]}</h1>
          <hr />
        </div>
        <div className="div2-infopage">
          <NewlineText text={infoData.bodyList[+pageNumber]} />
          <br></br>
        </div>
        <div className="div3-infopage">
          {infoData.images[+pageNumber + 1] && (
            <img
              src={infoData.images[+pageNumber + 1]}
              className="hide-image-for-preload"
            />
          )}
          {infoData.images[+pageNumber] &&
          (infoData.images[+pageNumber].includes("data:image") ||
            infoData.images[+pageNumber].includes("gif")) ? (
            <>
              <img
                src={infoData.images[+pageNumber - 1]}
                className="instructions-image"
              />
            </>
          ) : infoData &&
            infoData.images[+pageNumber] &&
            infoData.images[+pageNumber].includes(",") ? (
            <Poll
              currentChecked={pollState[pageNumber - firstPollPosition]}
              currentPageData={{
                title: infoData.titles[+pageNumber],
                body: infoData.bodyList[+pageNumber],
                image: infoData.images[+pageNumber],
              }}
              questions={infoData.images[+pageNumber].split(",")}
              pollState={pollState}
              setCurrentAnswer={(value) => {
                const currentPollState = [...pollState];
                currentPollState[pageNumber - firstPollPosition] =
                  value.target.value;
                setPollState(currentPollState);
              }}
            />
          ) : (
            <p1></p1>
          )}
          <br></br>
        </div>
        <div className="div4-infopage"></div>
        <div className="div5-infopage"></div>
        <div className="floating-row">
          <div className="parent-buttonRow">
            <div className="div1-buttonRow">
              <Button
                size="lg"
                type="button"
                variant="danger"
                onClick={() => handleClick(+pageNumber == 0 ? "quit" : "back")}
              >
                {+pageNumber == 0 ? "quit" : "back"}
              </Button>
            </div>
            <div className="div2-buttonRow">
              <Button
                size="lg"
                type="button"
                variant="success"
                onClick={() =>
                  handleClick(
                    +pageNumber >= totalPages - 1 ? "begin experiment" : "next"
                  )
                }
              >
                {+pageNumber >= totalPages - 1
                  ? "begin experiment"
                  : +pageNumber == 0
                  ? "I agree"
                  : "next"}
              </Button>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default InformationPage;
