import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Loader from "react-loader-spinner";
import * as FirestoreService from "./firebase";
import Options from "./components/options.jsx";
import ProgressBar from "react-bootstrap/ProgressBar";

/** This page displays the pre-experiment information */
const Questions = () => {
  let { urlInfoDataId, questionDataId, id, urlPageNumber } = useParams();
  const queryString = require("query-string");
  const parsed = queryString.parse(window.location.search); // read aid from url

  const [pageNumber, setPageNumber] = useState(urlPageNumber - 1); // current page number
  const [questionsData, setQuestionsData] = useState(null); // the data to display
  const [totalPages, setTotalPages] = useState(0); // total number of pages
  const [questionsState, setQuestionsState] = useState([]); // the current state of the answers

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
          localStorage.getItem("questionsState")
            ? setQuestionsState(
                JSON.parse(localStorage.getItem("questionsState"))
              )
            : setQuestionsState(Array(totPages).fill(null));
        }
      );
      // Create an array of null answers or pull from local storage
      //let localAnswers =

      //if(localAnswers){

      //} else {
      //let newPollState = Array(totPages).fill(null);
      //}
    }
  }, []);

  useEffect(() => {
    setPageNumber(urlPageNumber - 1);
    if (!aid) {
      setAid(location.aid ? location.aid : parsed.aid);
    }
  }, [urlPageNumber]);

  const goToPreviousPage = () => {
    const currPageNum = +pageNumber;
    setPageNumber(currPageNum - 1);
    history.push({
      pathname: `/${id}/${urlInfoDataId}/${questionDataId}/2/page-${currPageNum}`,
      search: "?aid=" + aid,
    });
  };

  // A function that tests if an asnwer passes the filter.
  const handleFilter = () => {
    const currPageNum = +pageNumber;
    const currFilter = questionsData.filters[currPageNum];

    if (currFilter && currFilter.split("#")[1]) {
      if (currFilter && currFilter.charAt(0) == "M") {
        // it's a mathematical filter
        // will look like: #>#20#attention
        // or: #<=3
        try {
          if (mathFilter(currFilter, questionsState[currPageNum])) {
            goBackToCloudResearch(currFilter.slice(-1));
            return true;
          }
        } catch (err) {
          console.log("error in filtering - NaN");
        }
      } else if (currFilter.charAt(0) == "I") {
        // it's an Include filter
        const filterArray = currFilter.slice(2, -2).split(","); // the current filter array
        if (!filterArray.includes(questionsState[currPageNum].toString())) {
          goBackToCloudResearch(currFilter.slice(-1));
          return true;
        }
      } else {
        // it's not a valid filter as of now
        return false;
      }
    }

    return false;
  };

  const goToNextPage = () => {
    const filterResult = handleFilter();
    if (filterResult) {
      // if filter suggests this user should be terminated.
      return;
    }

    const currPageNum = +pageNumber;

    if (+pageNumber >= totalPages - 1) {
      localStorage.setItem("questions", JSON.stringify(questionsData.titles));
      history.push({
        pathname: `/${id}/${urlInfoDataId}/${questionDataId}/3`, // the path to the driving simulator
        search: "?aid=" + aid,
        questions: questionsData.titles,
        answers: questionsState,
        aid: aid,
      });
      return;
    }
    setPageNumber(currPageNum + 1);
    history.push({
      pathname: `/${id}/${urlInfoDataId}/${questionDataId}/2/page-${
        currPageNum + 2
      }`,
      search: "?aid=" + aid,
    });
  };

  // tests the dynamic filter and checks if the user is qualified
  const mathFilter = (filterStatement, answer) => {
    var comparisonOperatorsHash = {
      "<": function (a, b) {
        return a < b;
      },
      ">": function (a, b) {
        return a > b;
      },
      ">=": function (a, b) {
        return a >= b;
      },
      "<=": function (a, b) {
        return a <= b;
      },
      "==": function (a, b) {
        return a == b;
      },
    };

    const filterArray = filterStatement.split("#");
    const operatorAndNumArray = getOperatorAndNumArray(filterArray[1]);

    const operatorString = operatorAndNumArray[0];
    const num = operatorAndNumArray[1];
    const operator = comparisonOperatorsHash[operatorString];

    if (operator === undefined) {
      console.log("the filter is not an operator");
    }

    return operator(answer, num);
  };

  const getOperatorAndNumArray = (str) =>
    isNaN(str.charAt(1))
      ? [str.slice(0, 2), str.slice(2)]
      : [str.slice(0, 1), str.slice(1)];

  const goBackToCloudResearch = (reason) => {
    // reasons can be: attention, quota, unqualified
    if (reason == "A") {
      // user pays too little attention at survey
      window.location.href = `https://app.cloudresearch.com/Router/ThankYouTerm?aid=${aid}`;
    } else if (reason == "Q") {
      // too many users, quota is overfull
      window.location.href = `https://app.cloudresearch.com/Router/QuotaFull?aid=${aid}`;
    } else {
      // reason == "U", user is not qualified for this survey - "U"
      window.location.href = `https://app.cloudresearch.com/Router/ThankYouNotQualified?aid=${aid}`;
    }
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
          <h1>Please answer the following question:</h1>
          <hr />
        </div>
        <div className="div2-infopage">
          <p>{questionsData.titles[+pageNumber]}</p>
          <br></br>
        </div>
        <div className="div3-infopage">
          <Options
            currentPage={+pageNumber}
            questionsData={questionsData}
            questionsState={questionsState}
            setAnswer={(newState) => {
              setQuestionsState(newState);
              localStorage.setItem("questionsState", JSON.stringify(newState));
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
              <ProgressBar
                now={parseInt(((+pageNumber + 1) * 100) / +totalPages)}
                label={`${parseInt(((+pageNumber + 1) * 100) / totalPages)}%`}
                variant="info"
              />
            </div>
            <div className="div3-buttonRow">
              <Button
                size="lg"
                type="button"
                variant="success"
                disabled={!questionsState[pageNumber]}
                onClick={() =>
                  handleClick(
                    +pageNumber >= totalPages - 1 ? "next stage" : "next"
                  )
                }
              >
                {+pageNumber >= totalPages - 1 ? "next stage" : "next"}
              </Button>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default Questions;
