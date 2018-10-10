import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      students: [],
      authFlag: false
    };
  }
  deleteStudent = e => {
    e.preventDefault();
    const data = {
      StudentID: e.target.value
    };

    axios.defaults.withCredentials = true;

    axios
      .delete(`http://localhost:3001/delete/${data.StudentID}`)
      .then(response => {
        console.log("Process status", response.status);
        if (response.status === 200) {
          this.setState({
            authFlag: true
          });
          window.location.reload(1);
        } else {
          this.setState({
            authFlag: false
          });
        }
      });
  };
  //get the books data from backend
  componentDidMount() {
    axios.get("http://localhost:3001/home").then(response => {
      //update the state with the response data

      this.setState({
        students: this.state.students.concat(response.data)
      });
    });
  }

  render() {
    //iterate over books to create a table row
    let details = this.state.students.map(student => {
      return (
        <tr>
          <td>{student.name}</td>
          <td>{student.studentid}</td>
          <td>{student.department}</td>
          <td>
            <button
              onClick={this.deleteStudent}
              value={student.studentid}
              type="submit"
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
    //if not logged in go to login page
    let redirectVar = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    if (cookie.load("cookie")) {
      redirectVar = <Redirect to="/home" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container" style={{ backgroundColor: "silver" }}>
          <h2>List of All Students</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>StudentID</th>
                <th>Department</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {/*Display the Tbale row based on data recieved*/}
              {details}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
//export Home Component
export default Home;
