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
      name: '',
      email: '',
      password: '',
      logo: null,
      description: '',
    },
    validationSchema: Yup.object({
        name: Yup.string().required("Please Enter Your Name"),
        email: Yup.string().required("Please Enter Your Email"),
        password: Yup.string().required("Please Enter Your Password"),
    }),

    onSubmit: async (values, { resetForm, setFieldError}) => {
      try {
        setLoading(true)
        const data = new FormData();
        data.append('email', values.email);
        data.append('password', values.password);
        data.append('name', values.name);
        if (values.logo!=null) {
          data.append('image', values.logo);
        }
        data.append('description', values.description);
        const response = await axios.post(`${API_URL}/company/register`, data);
        console.log(response);
        if (response.status==201) {
          resetForm();
          toast.success('Your Company created successfully!')
        }
      } catch (error) {
        console.log(error);
        if (error.response.status==422) {
          setFieldError('email', error.response.data.errors.email[0]);
        }else{
          toast.error('oops try again later!')
        }
      }finally{
        setLoading(false)
      }

    }
  });

  const handleImageChange = (event) => {
    validation.setFieldValue('logo', event.currentTarget.files[0]);
};

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
                         <h4 className="text-dark">Registeration Form </h4>
                        <h6 className="text-dark">Employee Tracker Company Portal</h6>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src="/logo.png" alt="" style={{width:'100px', marginBottom:'25px'}}  />
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
                        <Label className="form-label">Name</Label>
                        <Input
                          name="name"
                          className="form-control"
                          placeholder="Enter Name"
                          type="name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.name || ""}
                          invalid={
                            validation.touched.name && validation.errors.name ? true : false
                          }
                        />
                        {validation.touched.name && validation.errors.name ? (
                          <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                        ) : null}
                      </div>

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

                      <div className="mb-3">
                        <Label className="form-label">logo</Label>
                        <Input
                          name="logo"
                          className="form-control"
                          placeholder="Enter logo"
                          type="file"
                          onChange={handleImageChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.logo && validation.errors.logo ? true : false
                          }
                        />
                        {validation.touched.logo && validation.errors.logo ? (
                          <FormFeedback type="invalid">{validation.errors.logo}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">description</Label>
                        <Input
                          name="description"
                          className="form-control"
                          placeholder="Enter description"
                          type="textarea"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.description || ""}
                          invalid={
                            validation.touched.description && validation.errors.description ? true : false
                          }
                        />
                        {validation.touched.description && validation.errors.description ? (
                          <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
                        ) : null}
                      </div>

                      

                      <div className="mt-3 d-grid">
                        <button disabled={loading} className="btn btn-primary btn-block" type="submit">
                          {loading ? 'Loading...' : 'Register'}
                        </button>
                      </div>
                    </Form>
                    <br></br>
                    <p>Already have an account <Link to="/login" >Click Here</Link></p>
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
