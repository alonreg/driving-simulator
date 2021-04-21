import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Loader from "react-loader-spinner";
import * as FirestoreService from "./firebase";
import "./components/informationPage.css";
import ProgressBar from "react-bootstrap/ProgressBar";

// a small function to create newline text out of "\\u encoding"
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

/** This page displays the pre-experiment information */
const InformationPage = () => {
  let { urlInfoDataId, questionDataId, id, urlPageNumber } = useParams();

  const [pageNumber, setPageNumber] = useState(urlPageNumber - 1); // current page number
  const [infoData, setInfoData] = useState(null); // the data to display
  const [totalPages, setTotalPages] = useState(0); // total number of pages

  // AID user managment for cloud research
  const [aid, setAid] = useState(""); // the aid of the user
  const location = useLocation(); // passing metadata from the pre-experiment part
  let history = useHistory();

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
    if (!infoData) {
      FirestoreService.getInfoDataById(urlInfoDataId).then((infoData) => {
        const data = infoData.data();
        setInfoData(data);
        setTotalPages(data.bodyList.length);
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
      // preload images
    }
  }, []);

  // Page managment ///
  useEffect(() => {
    setPageNumber(urlPageNumber - 1);
    if (!aid) {
      setAid(location.aid);
    }
  }, [urlPageNumber]);

  const goToPreviousPage = () => {
    setPageNumber(+pageNumber - 1);
    history.push(
      `/${id}/${urlInfoDataId}/${questionDataId}/1/page-${+pageNumber}`
    );
  };

  const goToNextPage = () => {
    if (+pageNumber >= totalPages - 1) {
      history.push({
        pathname: `/${id}/${urlInfoDataId}/${questionDataId}/2/page-1`, // the path to the driving simulator
        aid: aid,
      });
      return;
    }
    setPageNumber(+pageNumber + 1);
    history.push(
      `/${id}/${urlInfoDataId}/${questionDataId}/1/page-${+pageNumber + 2}`
    );
  };

  const onClose = function () {
    history.push("/set-1/0");
    //window.open("about:blank", "_self");
    // window.close();
    // Redirector to cloud research
  };

  const handleClick = (direction) => {
    if (direction == "quit") {
      onClose();
    } else if (direction == "back") {
      goToPreviousPage();
    } else {
      goToNextPage();
    }
  };

  // Loading screen
  if (!infoData) {
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
          {infoData.images[+pageNumber] ? (
            <>
              <img
                src={infoData.images[+pageNumber]}
                className="instructions-image"
              />
            </>
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
                onClick={() => handleClick("next")}
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
