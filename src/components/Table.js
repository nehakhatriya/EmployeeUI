import React, { Component } from 'react';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import axios from 'axios';
import {Link} from 'react-router-dom'
import ReactS3 from 'react-s3'
import awsconfig from '../../config.json'

const config = {
    bucketName: 'employee-information',
    dirName: 'photos', /* optional */
    region: 'ap-south-1',
    accessKeyId: awsconfig.accessKey ,
    secretAccessKey: awsconfig.secretAccessKey
}

class Table extends Component {

    state = {
        employees: [],
        show: false,
        employee: {},
        edit: false,
        details:false
    }

    getdata = () => {
        axios.get("http://localhost:8010//employees/")
            .then(res => {
                this.setState({ employees: res.data })
            })
            .catch(err => console.log(err));
    }
    componentDidMount = () => {
        this.getdata();
    }

    deleteEmployee = (props) => {
        axios.delete("http://localhost:8010//employees/" + props.original.empid)
            .then(res => this.getdata())
            .catch(err => console.log(err));
        ReactS3.deleteFile(props.original.empid+"profile",config)
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
        ReactS3.deleteFile(props.original.empid+"resume",config)
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
    }
    show = () => {
        this.setState(prev => {
            return { show: !prev.show }
        })
    }
    render() {
        const data = this.state.employees;
        console.log(this.state.employees)
        const columns = [
            {
                Header: "Id",
                accessor: "empid",
                filterable: true
            },
            {
                Header: "Name",
                accessor: "empname",
                filterable: true,
                
            },
            {
                Header: "Salary",
                accessor: "salary",
            },
            {
                Header: "Date",
                accessor: "dateofjoining",
            },
            {
                Header: "Designation",
                accessor: "designation",
                filterable: true
            },
            {
                Header: "Delete",
                Cell: props => {
                    return (
                        <button onClick={() => this.deleteEmployee(props)}>Delete</button>
                    )
                },
                sortable: false
            },
            {
                Header: "Edit",
                Cell: props => {
                    return (
                        <Link to={"/form/"+props.original.empid}><button>Edit</button></Link>
                    )
                },
                sortable: false
            },
            {
                Header: "View",
                Cell: props => {
                    return (
                        <Link to={"/view/"+props.original.empid}><button>View</button></Link>
                    )
                },
                sortable: false
            }
        ]
        var show=(<div><Link to={"/form/new"}><button>Add Employee</button></Link><br />
        <br />
        <ReactTable data={data} columns={columns} defaultPageSize={10}/>
        </div>)
        return show;
    }

}
export default Table;