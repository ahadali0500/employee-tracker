import React, { useEffect, useState } from "react";
import {
    Card, Col, Container, Row, CardBody, CardTitle, Label,
    Button, Form, Input, FormFeedback, Table
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useParams, useLocation } from 'react-router-dom';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { API_URL } from "components/Constant";
import toast from "react-hot-toast";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Update = () => {
    const storedData = JSON.parse(localStorage.getItem('desiredexpenseappcompany'));
    const query = useQuery();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [updatingLoading, setUpdatingLoading] = useState(false);

    const dataFetch = async () => {
        try {
            const data = new FormData();
            data.append('id', id);
            const response = await axios.post(`${API_URL}/fetch-single-general-expense.php`, data); // Adjusted endpoint for fetching a single expense
            console.log(response.data);
            formik.setFieldValue("name", response.data.data.name);
            formik.setFieldValue("status", response.data.data.status);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        dataFetch();
    }, [id]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        status: Yup.string().required("Status is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            status: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log("Form data:", values);
            try {
                setUpdatingLoading(true);
                const data = new FormData();
                data.append('name', values.name);
                data.append('status', values.status);
                data.append('id', id);
                const response = await axios.post(`${API_URL}/update-general-expense.php`, data); // Adjusted endpoint for updating the expense
                if (response.data.code === 200) {
                    toast.success(response.data.message);
                } else if (response.data.code === 201) {
                    toast.error(response.data.message);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setUpdatingLoading(false);
            } catch (error) {
                console.log(error);
                toast.error("Oops! Try again later!");
                setUpdatingLoading(false);
            }
        },
    });
    const datas = JSON.parse(localStorage.getItem('expenseCate'));
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                <Breadcrumbs title={`Update ${datas[0].expense_name}`} breadcrumbItem={`Update ${datas[0].expense_name}`} />
                {loading ? (
                        <center>
                            <div className="spinner-border mt-6" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </center>
                    ) : (
                        <Form onSubmit={formik.handleSubmit}>
                            <Row>
                                <Col xl={12}>
                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-4">General Information</CardTitle>
                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="name">Name</Label>
                                                        <Input
                                                            type="text"
                                                            name="name"
                                                            value={formik.values.name}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.name && formik.errors.name}
                                                        />
                                                        {formik.touched.name && formik.errors.name ? (
                                                            <FormFeedback>{formik.errors.name}</FormFeedback>
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
                                                            invalid={formik.touched.status && formik.errors.status}
                                                        >
                                                            <option value="" disabled>Choose...</option>
                                                            <option value="0">Active</option>
                                                            <option value="1">Disabled</option>
                                                        </Input>
                                                        {formik.touched.status && formik.errors.status ? (
                                                            <FormFeedback>{formik.errors.status}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                    <Button type="submit" disabled={updatingLoading} color="primary" outline>
                                        {updatingLoading ? 'Loading...' : 'Submit'}
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

export default Update;
