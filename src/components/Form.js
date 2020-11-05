import axios from 'axios';
import React, { Component, Fragment } from 'react';
import {Redirect} from 'react-router-dom'
import ReactS3 from 'react-s3'
import awsconfig from '../../config.json'

const config = {
    bucketName: 'employee-information',
    dirName: 'photos', /* optional */
    region: 'ap-south-1',
    accessKeyId: awsconfig.accessKey ,
    secretAccessKey: awsconfig.secretAccessKey ,
}

class Form extends Component {

    state = {
        employee: { },
        submitted: false,
        disable: false,
        edit:false
    }
    componentDidMount = () => {
        if (this.props.match.params.id!=="new") {
            axios.get("http://localhost:8010//employees/"+this.props.match.params.id)
            .then(res =>{
                this.setState(prev => { return { employee:res.data,edit:!prev.edit,disable:!prev.disable } })
            })
        }
    }

    changeid = (event) => {
        var emp = { ...this.state.employee }
        emp.empid = event.target.value
        this.setState({ employee: emp })
    }

    changeName = (event) => {
        var emp = { ...this.state.employee }
        emp.empname = event.target.value
        this.setState({ employee: emp })
    }
    changeSalary = (event) => {
        var emp = { ...this.state.employee }
        emp.salary = event.target.value
        this.setState({ employee: emp })
    }
    changeDesig = (event) => {
        var emp = { ...this.state.employee }
        emp.designation = event.target.value
        this.setState({ employee: emp })
    }
    changePer = (event) => {
        var emp = { ...this.state.employee }
        emp.permanent = event.target.value
        this.setState({ employee: emp })
    }
    changeDate = (event) => {
        var emp = { ...this.state.employee }
        emp.dateofjoining = event.target.value
        this.setState({ employee: emp })
    }

    addEmployee = () => {
        axios.post("http://localhost:8010//employees/",this.state.employee)
        .then(res=>{
            this.setState(prev => { return {submitted:!prev.submitted,edit:!prev.edit,disable:!prev.disable } })
        })
        .catch(err => console.log(err));
    }

    updateEmployee = () => {
        this.setState(prev => { return { disable: !prev.disable } })
        axios.put("http://localhost:8010//employees/"+this.state.employee.empid,this.state.employee)
        .then(res=>{
            this.setState(prev => { return {submitted:!prev.submitted,edit:!prev.edit,disable: !prev.disable } })
        })
        .catch(err => console.log(err));
    }

    UploadProfile = (event) => {
        console.log(event.target.files[0])
        var blob = event.target.files[0].slice(0,event.target.files[0].size, 'image/png'); 
        var newFile = new File([blob], this.state.employee.empid+"profile", {type: 'image/png'});
        ReactS3.uploadFile(newFile, config)
            .then(res => {
                return res.result.url + res.key
            }).then(result => {
                console.log(result)
                var emp = { ...this.state.employee }
                emp.profile = result
                this.setState({ employee: emp })
            })
            .catch(err => console.log(err))
    }

    UploadResume = (event) => {
        console.log(event.target.files[0])
        var blob = event.target.files[0].slice(0,event.target.files[0].size, 'application/pdf'); 
        var file = new File([blob], this.state.employee.empid+"resume", {type: 'application/pdf'});
        ReactS3.uploadFile(file, config)
            .then(res => {
                return res.result.url + res.key
            }).then(result => {
                console.log(result)
                var emp = { ...this.state.employee }
                emp.resume = result
                this.setState(prev => { return { employee: emp,disable:!prev.disable} })
            })
            .catch(err => console.log(err))
    }
    render() {
        var redirect=null;
        if(this.state.submitted)
        redirect=<Redirect to="/"/>
        return (
            <Fragment>
            {redirect}
                <div class="container py-5">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-md-6 mx-auto">
                                    <div class="card border-secondary">
                                        <div class="card-header">
                                            {this.state.edit ? <h3 class="mb-0 my-2">Edit Employee</h3> : <h3 class="mb-0 my-2">Add Employee</h3>}
                                        </div>
                                        <div class="card-body">
                                            <form class="form">
                                                <div class="form-group">
                                                    <label for="empid">Employee ID:</label>
                                                    <input type="text" class="form-control" id="empid" disabled={this.state.disable} onChange={this.changeid} value={this.state.employee.empid} placeholder="ID" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="name">Employee Name</label>
                                                    <input type="text" class="form-control" id="name" onChange={this.changeName} value={this.state.employee.empname} placeholder="full name" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="salary">Salary</label>
                                                    <input type="text" class="form-control" id="salary" onChange={this.changeSalary} value={this.state.employee.salary} placeholder="salary" required="" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="doj">Date of Joining</label>
                                                    <input type="date" class="form-control" id="doj" onChange={this.changeDate} value={this.state.employee.dateofjoining} placeholder="2020/04/20" required="" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="desig">Designation</label>
                                                    <input type="text" class="form-control" id="desig" onChange={this.changeDesig} value={this.state.employee.designation} placeholder="designation" required="" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="perm">is Permanent</label>
                                                    <select value={this.state.employee.permanent} id="perm" class="form-control" onChange={this.changePer}>
                                                        <option value="Max">Yes</option>
                                                        <option value="Manu">No</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="profile">Profile Pic</label>
                                                    <input type="file" class="form-control" id="profile" onChange={this.UploadProfile} required="" />
                                                </div>
                                                <div class="form-group">
                                                    <label for="resume">Resume</label>
                                                    <input type="file" class="form-control" id="resume" onChange={this.UploadResume} required="" />
                                                </div>
                                                <div class="form-group">
                                                    {this.state.edit ? <input type="button" class="btn btn-success btn-lg float-right" value="SAVE" onClick={this.updateEmployee} /> : <input type="button" disabled={!this.state.disable} class="btn btn-success btn-lg float-right" value="ADD" onClick={this.addEmployee} />}

                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>)
    }
}
export default Form;