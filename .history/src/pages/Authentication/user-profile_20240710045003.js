import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { IMG_URL, API_URL } from "components/Constant";
import axios from "axios";
import toast from 'react-hot-toast';

const UserProfile = () => {
  const storedData = JSON.parse(localStorage.getItem('desiredexpenseappcompany'));
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: storedData.name || '',
      password: storedData.password || '',
      logo: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Name"),
      password: Yup.string().required("Please Enter Your password"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const data = new FormData();
        data.append('name', values.name);
        data.append('password', values.password);
        if (values.logo!=null) {
          data.append('image', values.logo);
        }
         data.append('pre_img', storedData.logo);
        
        data.append('id', storedData.id);
        
        const response = await axios.post(`${API_URL}/update-company-profile.php`, data);
        if (response.data.code === 200) {
          localStorage.setItem('desiredexpenseappcompany', JSON.stringify(response.data.data));
          toast.success('Your data updated successfully!');
        } else if (response.data.code === 400) {
          toast.error(response.data.message);
        } else {
          toast.error('Invalid Credentials!');
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error('An error occurred. Please try again later.');
      }
    }
  });

  const handleFileChange = (event) => {
    validation.setFieldValue('logo', event.currentTarget.files[0]);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Skote" breadcrumbItem="Profile" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={`${IMG_URL}/company/${storedData.logo}`}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{storedData.name}</h5>
                        <p className="mb-1">{storedData.email}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <h4 className="card-title mb-4">Change Company Data</h4>
          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={validation.handleSubmit}
              >
                <div className="form-group">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="name"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name}
                    invalid={
                      validation.touched.name && validation.errors.name
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group mt-2">
                  <Label className="form-label">Email</Label>
                  <Input
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                    type="password"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.password}
                    invalid={
                      validation.touched.password && validation.errors.password
                    }
                  />
                  {validation.touched.password && validation.errors.password ? (
                    <FormFeedback type="invalid">
                      {validation.errors.password}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group mt-2">
                  <Label className="form-label">Logo</Label>
                  <Input
                    name="logo"
                    className="form-control"
                    placeholder="Upload Logo"
                    type="file"
                    onChange={handleFileChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.logo && validation.errors.logo
                    }
                  />
                  {validation.touched.logo && validation.errors.logo ? (
                    <FormFeedback type="invalid">
                      {validation.errors.logo}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
