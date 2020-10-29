import React from "react";
import { useHistory } from "react-router-dom";
import "./Consent.css";
import Button from "react-bootstrap/Button";

const Consent = () => {
  let history = useHistory();

  const onClose = function () {
    window.open("about:blank", "_self");
    window.close();
  };

  const handleClick = () => history.push("/instructions");

  const consentMessage = `The study should take about 20 minutes, but you are free to go through it at your own pace. Your participation in this research is voluntary.
  If you complete the study, you will receive payment for your participation. You have the right to withdraw at any point during the
  study, for any reason, and without any negative consequences for you. Your responses are completely anonymous, and we do not collect any
  individually identifiable information about you. Any information about responses published as a result of the study will be reported
  anonymously. Upon your request, the researchers are obliged to delete any information provided by you during the course of the study.
  
  Contact details: 
  Principle Investigator: Prof. Joachim Meyer, Email: jmeyer@tauex.tau.ac.il.
  
  By clicking the button below, you acknowledge that your participation in the study is voluntary, you are 18 years of age or older, and you are aware that you may choose to terminate your participation in the study at any time and for any reason.`;

  return (
    <>
      <div className="rectangle">
        <div className="consent-text">
          <h1>Terms & Conditions</h1>
        </div>
        <div className="consent-text">{consentMessage}</div>
        <br></br>
        <br></br>
        <div className="consent-button">
          <div className="agree-button">
            <Button type="button" variant="danger" onClick={onClose}>
              Quit
            </Button>
            <Button type="button" variant="success" onClick={handleClick}>
              I agree to the terms
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Consent;
