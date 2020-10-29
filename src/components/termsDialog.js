import React from "react";
import "../App.css";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const TermsDialog = ({ open, onAgree, onDecline }) => {
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
      <div>
        <Dialog
          open={open}
          onClose={() => {}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Terms and Conditions"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              className="terms-dialog-text"
              id="alert-dialog-description"
            >
              {consentMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions className="terms-dialog-button">
            <Button
              className="terms-dialog-button"
              onClick={onDecline}
              color="secondary"
            >
              Quit
            </Button>
            <Button
              className="terms-dialog-button"
              onClick={onAgree}
              color="primary"
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default TermsDialog;
