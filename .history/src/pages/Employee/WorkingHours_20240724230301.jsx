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

const WorkingHours = () => {
    const query = useQuery();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [updatingLoading, setUpdatingLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [manager, setManager] = useState([]);
    const { state } = useContext(AppContext);

    const dataFetch = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/company/employee/get/${id}`, {
                headers: {
                    'Authorization': `Bearer ${state.user.token}`,
                }
            });
            console.log('Fetched data:', response.data);
            setDepartments(response.data.department);
            setManager(response.data.manager);
            const managerData = response.data.data[0];
            formik.setFieldValue("departments", managerData.department_id);
            formik.setFieldValue("manager", managerData.manager_id);
            formik.setFieldValue("status", managerData.status);
            formik.setFieldValue("id", managerData.id);
            setLoading(false);
        } catch (error) {
            console.error('Data fetch error:', error);
        }
    };

    useEffect(() => {
        if (state.user) {
            dataFetch();
        }
    }, [state, id]);

    const validationSchema = Yup.object().shape({
        status: Yup.string().required("Status is required"),
    });

    const formik = useFormik({
        initialValues: {
            type: "",
            morningTime: "",
            eveningTime: "",
            fullOverall: "",
            partType:"",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("Form data on submits22:", values);
            try {
                setUpdatingLoading(true);
                const data = new FormData();
                data.append('departments', values.departments);
                data.append('manager', values.manager);
                data.append('status', values.status);
                const response = await axios.post(`${API_URL}/company/employee/update/${values.id}`, data, {
                    headers: {
                        'Authorization': `Bearer ${state.user.token}`,
                    }
                });
                console.log('API response:', response);
                if (response.status == 200) {
                    toast.success("data updated successfully!");
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setUpdatingLoading(false);
            } catch (error) {
                console.error('Submit error:', error);
                toast.error("Oops! Try again later!");
                setUpdatingLoading(false);
            }
        },
    });
    console.log(formik.values.departments);
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Update Employee" breadcrumbItem="Update Employee" />
                    {loading ? (
                        <center>
                            <div className="spinner-border mt-6" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </center>
                    ) : (
                        <Form onSubmit={(e) => { 
                            e.preventDefault();
                            console.log("Form Submitted");
                            formik.handleSubmit(e);
                        }}>
                            <Row>
                                <Col xl={12}>
                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-4">Employee</CardTitle>
                                            <Row>
                                            <Col md={12}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status">type</Label>
                                                        <Input
                                                            type="select"
                                                            name="type"
                                                            value={formik.values.type}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.type && !!formik.errors.type}
                                                        >
                                                            <option value="" disabled>Choose...</option>
                                                            <option value="full">Full</option>
                                                            <option value="part">Part</option>
                                                        </Input>
                                                        {formik.touched.type && formik.errors.type ? (
                                                            <FormFeedback>{formik.errors.type}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status">Morning Time</Label>
                                                        <Input
                                                            type="time"
                                                            name="morningTime"
                                                            value={formik.values.morningTime}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.morningTime && !!formik.errors.morningTime}
                                                        >
                                                            
                                                        </Input>
                                                        {formik.touched.morningTime && formik.errors.morningTime ? (
                                                            <FormFeedback>{formik.errors.morningTime}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status">Evening Time</Label>
                                                        <Input
                                                            type="time"
                                                            name="eveningTime"
                                                            value={formik.values.eveningTime}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.eveningTime && !!formik.errors.eveningTime}
                                                        >
                                                            
                                                        </Input>
                                                        {formik.touched.eveningTime && formik.errors.eveningTime ? (
                                                            <FormFeedback>{formik.errors.eveningTime}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status">Break Time</Label>
                                                        <Input
                                                            type="time"
                                                            name="breakTime"
                                                            value={formik.values.breakTime}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.breakTime && !!formik.errors.breakTime}
                                                        >
                                                            
                                                        </Input>
                                                        {formik.touched.breakTime && formik.errors.breakTime ? (
                                                            <FormFeedback>{formik.errors.breakTime}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status">Full OverAll</Label>
                                                        <Input
                                                            type="time"
                                                            name="fullOverall"
                                                            value={formik.values.fullOverall}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.fullOverall && !!formik.errors.fullOverall}
                                                        >
                                                            
                                                        </Input>
                                                        {formik.touched.fullOverall && formik.errors.fullOverall ? (
                                                            <FormFeedback>{formik.errors.fullOverall}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col md={12}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status">Part Type</Label>
                                                        <Input
                                                            type="select"
                                                            name="partType"
                                                            value={formik.values.partType}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.partType && !!formik.errors.partType}
                                                        >
                                                            <option value="" disabled>Choose...</option>
                                                            <option value="morning">Morning</option>
                                                            <option value="evening">Evening</option>
                                                        </Input>
                                                        {formik.touched.partType && formik.errors.partType ? (
                                                            <FormFeedback>{formik.errors.partType}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status">Part Time</Label>
                                                        <Input
                                                            type="time"
                                                            name="partTime"
                                                            value={formik.values.partTime}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.partTime && !!formik.errors.partTime}
                                                        >
                                                            
                                                        </Input>
                                                        {formik.touched.partTime && formik.errors.partTime ? (
                                                            <FormFeedback>{formik.errors.partTime}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                
                                                

                                            </Row>
                                        </CardBody>
                                    </Card>
                                    <Button type="submit" disabled={updatingLoading} color="primary" outline>
                                        {updatingLoading ? 'Loading..' : 'Submit'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default WorkingHours;
