import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Button, Form, Input, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { useParams, useLocation } from 'react-router-dom';
import { API_URL } from "components/Constant";
import toast from 'react-hot-toast';
import { AppContext } from "components/AppContext";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Add = () => {
    const query = useQuery();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [updatingLoading, setUpdatingLoading] = useState(false);
    const [departments, setdepartments] = useState([]);
    const { state, setState } = useContext(AppContext);
    console.log(departments);
    const dataFetch = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/company/manager/get/${id}`, {
                headers: {
                  'Authorization': `Bearer ${state.user.token}`,
                }} );
            console.log(response.data);
            setdepartments(response.data.department)
            formik.setFieldValue("departments", response.data.data[0].departments);
            formik.setFieldValue("status", response.data.data[0].status);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (state.user) {
            dataFetch();
        }
    }, [state,id]);
    

    const validationSchema = Yup.object().shape({
        departments: Yup.string().required("departments is required"),
        status: Yup.string().required("Status is required"),
    });

    const formik = useFormik({
        initialValues: {
            departments: "",
            status: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("Form data:", values);
            try {
                setLoading(true);
                const data = new FormData();
                data.append('departments', values.name);
                data.append('status', values.status);
                
                // data.append('bank_id', id);

                
                if (values.image) {
                    data.append('image', values.image);
                }
                const response = await axios.post(`${API_URL}/update-bank.php`, data);
                if (response.data.code === 200) {
                    toast.success(response.data.message);
                } else if (response.data.code === 201) {
                    toast.error(response.data.message);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setLoading(false);
            } catch (error) {
                console.log(error);
                toast.error("Oops! Try again later!");
                setLoading(false);
            }
        },
    });

    const handleImageChange = (event) => {
        formik.setFieldValue('image', event.currentTarget.files[0]);
    };

    return (
        <React.Fragment>
        <div className="page-content">
            <Container fluid={true}>
                <Breadcrumbs title="Update Bank" breadcrumbItem="Update Bank" />
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Bank</CardTitle>
                                    <Row>
                                    <Col md={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="departments">departments</Label>
                                                <Input
                                                    type="select"
                                                    name="departments"
                                                    value={formik.values.departments}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    invalid={formik.touched.departments && !!formik.errors.departments}
                                                >
                                                    <option value="" disabled>Choose...</option>
                                                    {departments.map((item, index) => (
                                                        <option key={index} value={item.name}>{item.name}</option>
                                                    ))}
                                                </Input>
                                                {formik.touched.departments && formik.errors.departments ? (
                                                    <FormFeedback>{formik.errors.departments}</FormFeedback>
                                                ) : null}
                                            </div>
                                        </Col> 
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="status">Status</Label>
                                                <Input
                                                    type="select"
                                                    name="status"
                                                    value={formik.values.status}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    invalid={formik.touched.status && !!formik.errors.status}
                                                >
                                                    <option value="" disabled>Choose...</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">Disabled</option>
                                                </Input>
                                                {formik.touched.status && formik.errors.status ? (
                                                    <FormFeedback>{formik.errors.status}</FormFeedback>
                                                ) : null}
                                            </div>
                                        </Col>                                      
                                    </Row>
                                </CardBody>
                            </Card>
                            <Button type="submit" disabled={updatingLoading} color="primary" outline>{updatingLoading ? 'Loading..' : 'Submit'}</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    </React.Fragment>
    );
};

export default Add;
