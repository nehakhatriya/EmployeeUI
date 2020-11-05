import React, { Component } from 'react';
import axios from 'axios'

class Details extends Component {

  state={
    employee:{}
  }
  componentDidMount=()=>{
      axios.get("http://localhost:8010//employees/"+this.props.match.params.id)
      .then(res => {
        console.log(res)
        this.setState({employee:res.data})
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div class="card" style={{ width: "18rem" }}>
        <img src={this.state.employee.profile} alt="" className="img-thumbnail" />
        <div class="card-body">
          <h5 class="card-title">Employee Details</h5>
        </div>
        <ul class="list-group list-group-flush">

          <li class="list-group-item">ID: {this.state.employee.empid}</li>
          <li class="list-group-item">NAME: {this.state.employee.empname}</li>
          <li class="list-group-item">SALARY: {this.state.employee.salary}</li>
          <li class="list-group-item">DATE-OF-JOINING: {this.state.employee.dateofjoining}</li>
          <li class="list-group-item">DESIGNATION: {this.state.employee.designation}</li>
          <li class="list-group-item"><a href={this.state.employee.resume}  target="blank"> RESUME</a></li>
        </ul>
      </div>
    )
  }
}

export default Details;