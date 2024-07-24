import React, { useState } from "react";
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

const Login = props => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const data = new FormData();
        data.append('email', values.email);
        data.append('password', values.password);
        const response = await axios.post(`${API_URL}/login.php`, data);
        if (response.data.code==200) {
          localStorage.setItem('desiredexpenseapp', 'desiredexpenseapp');
          localStorage.setItem('desiredexpenseappcompany', JSON.stringify(response.data.data));
          localStorage.setItem('expenseCate', JSON.stringify(response.data.expenseCate));
          
          navigate("/dashboard");
        }else{
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
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="">
                  <Row>
                    <Col className="col-7">
                      <div className="text-dark p-4">
                        <h4 className="text-dark">Welcome Back !</h4>
                        <h6>Login to continue to Exhpense Portal.</h6>
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
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>

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

                      <div className="mt-3 d-grid">
                        <button disabled={loading} className="btn btn-primary btn-block" type="submit">
                          {loading ? 'Loading...' : 'Log In'}
                        </button>
                      </div>
                    </Form>
                    <br></br>
                    <p>Donot have an account <Link to="/register" >Click Here</Link></p>
                    <Link to="/forgot-password" ><p>Forgot password </p></Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Login;
