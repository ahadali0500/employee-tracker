import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Container, Form, Input, FormFeedback, Label } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import profile from "assets/images/profile-img.png";
import logo from "assets/images/logo.svg";
import { API_URL } from "components/Constant";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from 'react-router-dom';

const Login = props => {
    const navigate = useNavigate();
    const { code } = useParams();

    const [data, setData] = useState()
    console.log(data);
    const [loadingver, setLoadingver] = useState(true)
    console.log(data);
    const datafetch = async () => {
        const data = new FormData();
        data.append('code', code);
        const response = await axios.post(`${API_URL}/recoverpasswordverify.php`, data);
        if (response.data.code == 200) {
            setData(0)
        } else {
            setData(1)
        }
        setLoadingver(false)
    }

    useEffect(() => {
        datafetch();
    }, []);

    const [loading, setLoading] = useState(false)

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            confirmpassword: '',
            password: '',
        },
         validationSchema : Yup.object({
            password: Yup.string()
                .required("Please Enter Your Password"),
            confirmpassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required("Please Enter Your confirm password")
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                setLoading(true)
                const data = new FormData();
                data.append('code', code);
                data.append('password', values.password);
                const response = await axios.post(`${API_URL}/recoverpassword.php`, data);
                if (response.data.code == 200) {
                    resetForm();
                    toast.success("Password updated successfully");
                } else {
                    toast.error('Invalid Credentias!')
                }
                setLoading(false)
            } catch (error) {
                console.log(error);
                setLoading(false)
                toast.error('Invalid Credentias!')
            }

        }
    });

    return (
        <React.Fragment>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    {loadingver ?
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="overflow-hidden">
                                    <CardBody className="pt-0">
                                        <br></br>
                                        <br></br><br></br><br></br>
                                        <h3>Verifying your code....</h3>
                                        <p>Kindly Wait for response!</p>
                                        <br></br><br></br><br></br><br></br>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        :
                        data == 0 ?
                            <Row className="justify-content-center">
                                <Col md={8} lg={6} xl={5}>
                                    <Card className="overflow-hidden">
                                        <div className="">
                                            <Row>
                                                <Col className="col-7">
                                                    <div className="text-primary p-4">
                                                        <h5 className="text-primary">Recover Password Expense App</h5>
                                                    </div>
                                                </Col>
                                                <Col className="col-5 align-self-end">
                                                    <img src="/logo.png" alt="" style={{width:'100px', marginBottom:'25px'}} />
                                                </Col>
                                            </Row>
                                        </div>
                                        <CardBody className="pt-0">
                                            <div>
                                                <Link to="/" className="logo-light-element">
                                                    <div className="avatar-md profile-user-wid mb-4">
                                                        <span className="avatar-title rounded-circle bg-light">
                                                            <img src={logo} alt="" className="rounded-circle" height="34" />
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="p-2">
                                                <Form
                                                    className="form-horizontal"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        validation.handleSubmit();
                                                        return false;
                                                    }}
                                                >


                                                    <div className="mb-3">
                                                        <Label className="form-label">Password</Label>
                                                        <Input
                                                            name="password"
                                                            value={validation.values.password || ""}
                                                            type="password"
                                                            placeholder="Enter Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                validation.touched.password && validation.errors.password ? true : false
                                                            }
                                                        />
                                                        {validation.touched.password && validation.errors.password ? (
                                                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                        ) : null}
                                                    </div>

                                                    <div className="mb-3">
                                                        <Label className="form-label">Confirm password</Label>
                                                        <Input
                                                            name="confirmpassword"
                                                            value={validation.values.confirmpassword || ""}
                                                            type="password"
                                                            placeholder="Enter confirmpassword"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                validation.touched.confirmpassword && validation.errors.confirmpassword ? true : false
                                                            }
                                                        />
                                                        {validation.touched.confirmpassword && validation.errors.confirmpassword ? (
                                                            <FormFeedback type="invalid">{validation.errors.confirmpassword}</FormFeedback>
                                                        ) : null}
                                                    </div>

                                                    <div className="mt-3 d-grid">
                                                        <button disabled={loading} className="btn btn-primary btn-block" type="submit">
                                                            {loading ? 'Loading...' : 'Log In'}
                                                        </button>
                                                    </div>
                                                </Form>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            :
                            <>
                                <Row className="justify-content-center">
                                    <Col md={8} lg={6} xl={5}>
                                        <Card className="overflow-hidden">
                                            <CardBody className="pt-0">
                                                <br></br>
                                                <br></br><br></br><br></br>
                                                <h3>Invalid Code is provided!</h3>
                                                <p>Kindly regenrate a new link!</p>
                                                <br></br><br></br><br></br><br></br>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </>


                    }

                </Container>
            </div>
        </React.Fragment>
    );
};

export default Login;
