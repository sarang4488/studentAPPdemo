import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Redirect } from "react-router";
import validator from "validator";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      StudentID: "",
      Department: "",
      authFlag: false
    };
  }

  componentWillMount() {
    this.setState({
      authFlag: false
    });
  }

  nameHandler = e => {
    this.setState({
      Name: e.target.value
    });
  };

  idHandler = e => {
    this.setState({
      StudentID: e.target.value
    });
  };

  deptHandler = e => {
    this.setState({
      Department: e.target.value
    });
  };

  submit = e => {
    e.preventDefault();
    const studentData = {
      Name: this.state.Name,
      StudentID: this.state.StudentID,
      Department: this.state.Department
    };

    if (
      validator.isEmpty(studentData.Name) ||
      validator.isEmpty(studentData.StudentID) ||
      validator.isEmpty(studentData.Department)
    ) {
      window.alert("Please enter the required fields");
    } else {
      axios.defaults.withCredentials = true;
      axios.post("http://localhost:3001/create", studentData).then(response => {
        console.log("Process status", response.status);
        if (response.status === 200) {
          this.setState({
            authFlag: true
          });
        } else {
          this.setState({
            authFlag: false
          });
        }
      });
    }
  };

  render() {
    let redirect = null;
    if (!cookie.load("cookie")) {
      redirect = <Redirect to="/login" />;
    } else if (this.state.authFlag) {
      redirect = <Redirect to="/home" />;
    }
    return (
      <div style={{ backgroundColor: "#777777" }}>
        {redirect}
        <br />
        <form className="form">
          <div
            class="container"
            style={{ width: "50%", backgroundColor: "#777777" }}
          >
            <div style={{ width: "80%" }} class="form-group">
              <input
                onChange={this.nameHandler}
                type="text"
                class="form-control"
                name="Name"
                placeholder="Name"
              />
            </div>
            <br />

            <div style={{ width: "80%" }} class="form-group">
              <input
                onChange={this.idHandler}
                type="text"
                class="form-control"
                name="StudentID"
                placeholder="Student ID"
              />
            </div>
            <br />
            <div style={{ width: "80%" }} class="form-group">
              <input
                onChange={this.deptHandler}
                type="text"
                class="form-control"
                name="Department"
                placeholder="Department"
              />
            </div>
            <br />
            <div style={{ width: "80%", textAlign: "centre" }}>
              <button
                class="btn btn-warning btn-sm"
                type="reset"
                style={{ width: "50%" }}
              >
                Clear
              </button>
              <button
                onClick={this.submit}
                class="btn btn-success btn-sm"
                type="submit"
                style={{ width: "50%" }}
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Create;
