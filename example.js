import "./DashBoard.css";
import React, { useEffect, useState } from 'react';
import { Table, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import axios from 'axios';
import Search from '../../assets/Search';
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


function DashBoard() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(true)
    const [edit, setEdit] = useState('')

    async function addUser(e) {
        e.preventDefault();
        try {
            console.log("function called")
            console.log(username);
            const registerData = {
                username,
                password,
                email,
                phone
            };
            await axios.post("http://localhost:3005/admin/form", registerData).then((res) => {

                if (res.status === 200) {
                    setRefresh(!refresh)
                }

            })
                .catch((err) => {

                    console.log(err);
                })

        } catch (error) {
            console.log("error")
        }

    }



    async function deleteuser(id) {
        await axios.get("http://localhost:3005/admin/deleteuser/" + id).then((res) => {

            if (res.status === 200) {
                setRefresh(!refresh)
                MySwal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }




    async function edituser(id) {
        console.log("function called")
        let edit = await data.filter((result) => {
            return result._id === id
        })
        console.log("detials of user");
        console.log(edit);
        setEdit(edit)

    }



    useEffect(() => {

        axios.get("http://localhost:3005/admin/getusers")
            .then((res) => {

                setData(res.data)
            })
            .catch(e => console.log(e))
    }, [refresh])



    return (
        <div>

            <div className="container mt-5 p-3">
                <div className="card-body p-5 text-center">
                    <h2 className="fw-bold mb-2 text-uppercase">USERs LIST</h2>
                    <p className="text-white-50 mb-5">Logined Users</p>
                </div>


                <Table striped bordered hover size="sm" id="app-table">
                    <thead>
                        <tr>

                            <th className="text-white-50 mb-5">User Name</th>
                            <th className="text-white-50 mb-5">email</th>
                            <th className="text-white-50 mb-5">phonenumber</th>
                            <th className="text-white-50 mb-5">Action</th>

                        </tr>
                    </thead>
                    <tbody>

                        {data.map((data) => {
                            return (
                                <tr>

                                    <td>{data.name}</td>
                                    <td>{data.email}</td>
                                    <td>{data.phone}</td>
                                    <td>
                                        <Button variant="outline-warning" onClick={() => edituser(data._id)} >
                                            edit
                                        </Button>
                                        <Button
                                            variant="outline-danger" onClick={() => deleteuser(data._id)}  >
                                            delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </Table>
            </div>







            <div className="container py-5 h-100 ">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="" >
                            <div className="card-body p-5 text-center">

                                <form onSubmit={addUser}>

                                    <div className="mb-md-5 mt-md-4 pb-5">

                                        <h2 className="fw-bold mb-2 text-uppercase">ADD USER</h2>
                                        <p className="text-white-50 mb-5">Please enter The Details</p>


                                        <div className="form-outline form-white mb-4">
                                            <label className="form-label" >UserName</label>
                                            <input value={username} onChange={(e) => setUsername(e.target.value)} name="name" type="text" id="typeText" className="form-control form-control-lg" />

                                        </div>
                                        <div className="form-outline form-white mb-4">
                                            <label className="form-label">Email</label>
                                            <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" id="typeEmailX" className="form-control form-control-lg" />

                                        </div>


                                        <div className="form-outline form-white mb-4">
                                            <label className="form-label" >Phone</label>
                                            <input value={phone} onChange={(e) => setPhone(e.target.value)} name="phone" type="number " id="typePhone" className="form-control form-control-lg" />

                                        </div>


                                        <div className="form-outline form-white mb-4">
                                            <label className="form-label" >Password</label>
                                            <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" id="typePasswordX" className="form-control form-control-lg" />

                                        </div>
                                        <button value="Submit" className="btn btn-outline-light btn-lg px-5" type="submit">Submit</button>
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>




        </div>
    )
}

export default DashBoard;



<td>{data.userName}</td>
                        <td>{data.email}</td>
                        
                        <td>
                            <Button variant="warning" size="sm"  className="ms-1" >
                                edit
                            </Button>
                            <Button
                                variant="danger" size="sm" className="ms-3"  >
                                delete
                            </Button>
                        </td>