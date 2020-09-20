import React from "react";
import { db } from "../firebase";

class DrivingConsole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        name: "",
        score: "",
      },
      formErrors: {
        name: "",
        score: "",
      },
      formValidity: {
        name: false,
        score: false,
      },
      isSubmitting: false,
    };
  }

  addUser = () => {
    const data = {
      ...this.state.formValues,
      uid: new Date().getTime(),
    };
    db.collection("users")
      .doc(data.uid.toString())
      .set(data)
      .then(() => {
        window.location = "/";
      })
      .catch((error) => {
        this.setState({ isSubmitting: false });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    const { formValues, formValidity } = this.state;
    if (Object.values(formValidity).every(Boolean)) {
      this.addUser();
    } else {
      for (let key in formValues) {
        let target = {
          name: key,
          value: formValues[key],
        };
        this.handleValidation(target);
      }

      this.setState({ isSubmitting: false });
    }
  };

  handleChange = ({ target }) => {
    const { formValues } = this.state;
    formValues[target.name] = target.value;
    this.setState({ formValues });
    this.handleValidation(target);
  };

  handleValidation = (target) => {
    const { name, value } = target;
    const fieldValidationErrors = this.state.formErrors;
    const validity = this.state.formValidity;
    const isImage = name === "image";

    if (!isImage) {
      validity[name] = value.length > 0;
      fieldValidationErrors[name] = validity[name]
        ? ""
        : `${name} is required and cannot be empty`;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      formValidity: validity,
    });
  };

  render() {
    const { formValues, formErrors, isSubmitting } = this.state;
    return (
      <>
        <div className="row mb-5"></div>
        <div className="row">
          <div className="col-lg-12">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${
                    formErrors.name ? "is-invalid" : ""
                  }`}
                  placeholder="Enter name"
                  onChange={this.handleChange}
                  value={formValues.name}
                />
                <div className="invalid-feedback">{formErrors.name}</div>
              </div>
              <div className="form-group">
                <label>score</label>
                <input
                  type="text"
                  name="score"
                  className={`form-control ${
                    formErrors.score ? "is-invalid" : ""
                  }`}
                  placeholder="Enter score"
                  onChange={this.handleChange}
                  value={formValues.score}
                />
                <div className="invalid-feedback">{formErrors.score}</div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default DrivingConsole;
