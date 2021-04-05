import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Loader from "react-loader-spinner";
import * as FirestoreService from "./firebase";
import Poll from "./components/poll.jsx";

/** This page displays the pre-experiment information */
const Questions = () => {
  let { urlInfoDataId, questionDataId, id, urlPageNumber } = useParams();

  const [pageNumber, setPageNumber] = useState(urlPageNumber - 1); // current page number
  const [questionsData, setQuestionsData] = useState(null); // the data to display
  const [totalPages, setTotalPages] = useState(0); // total number of pages
  const [questionsState, setQuestionsState] = useState([]); // the current state of the poll (questions at the end)

  // AID managment for cloud research
  const [aid, setAid] = useState(""); // the aid of the user
  const location = useLocation(); // passing metadata from the pre-experiment part
  let history = useHistory();

  // initialize questions state, and questions data, and total page number
  useEffect(() => {
    if (!questionsData) {
      document.body.className = "body-informationPage";
      FirestoreService.getQuestionsDataById(questionDataId).then(
        (questData) => {
          const data = questData.data();
          setQuestionsData(data);
          const totPages = data.titles.length;
          setTotalPages(totPages);
          // Create an array of null answers
          let newPollState = Array(totPages).fill(null);
          setQuestionsState(newPollState);
        }
      );
    }
  }, []);

  useEffect(() => {
    setPageNumber(urlPageNumber - 1);
    if (!aid) {
      setAid(location.aid);
    }
  }, [urlPageNumber]);

  const goToPreviousPage = () => {
    setPageNumber(+pageNumber - 1);
    history.push(
      `/${id}/${urlInfoDataId}/${questionDataId}/2/page-${+pageNumber}`
    );
  };

  const goToNextPage = () => {
    if (+pageNumber >= totalPages - 1) {
      history.push({
        pathname: `/${id}/${urlInfoDataId}/${questionDataId}/3`, // the path to the driving simulator
        pollData: questionsState,
        aid: aid,
      });
      return;
    }
    setPageNumber(+pageNumber + 1);
    history.push(
      `/${id}/${urlInfoDataId}/${questionDataId}/2/page-${+pageNumber + 2}`
    );
  };

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
      if (questionsState[+pageNumber] == null) {
        alert("Please choose one of the options");
      } else {
        goToNextPage();
      }
    }
  };

  if (!questionsData) {
    return (
      <>
        <div className="center-spinner">
          <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
        </div>
      </>
    );
  }

  return (
    <div className="bg-infopage">
      <div className="parent-infopage">
        <div className="div1-infopage">
          <h1>Please answer the following questions:</h1>
          <hr />
        </div>
        <div className="div2-infopage">
          <h2>{questionsData.titles[+pageNumber]}</h2>
          <br></br>
        </div>
        <div className="div3-infopage">
          <Poll
            currentPage={+pageNumber}
            questionsData={questionsData}
            questionsState={questionsState}
            setAnswer={(newState) => {
              setQuestionsState(newState);
            }}
          />
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
                onClick={() =>
                  handleClick(
                    +pageNumber == 0 ? "back to instructions" : "back"
                  )
                }
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
                {+pageNumber >= totalPages - 1 ? "begin experiment" : "next"}
              </Button>
              <h3>page out of... 2/3 or loading thing</h3>
            </div>
          </div>
        </div>
      </div>{" "}
      {/** setAnswer={(value) => {
              const currentQuestionsState = [...questionsState];
              currentQuestionsState[pageNumber - firstPollPosition] =
                value.target.value;
              setQuestionsState(currentPollState);
            }}
          */}
    </div>
  );
};

export default Questions;
