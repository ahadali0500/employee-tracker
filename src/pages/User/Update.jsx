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
    const query = useQuery();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [updatingLoading, setUpdatingLoading] = useState(false);

    const dataFetch = async () => {
        try {
            const data = new FormData();
            data.append('id', id);
            const response = await axios.post(`${API_URL}/fetch-single-users.php`, data); // Adjusted endpoint for fetching a single expense
            console.log(response.data);
            formik.setFieldValue("name", response.data.data.name);
            formik.setFieldValue("access", response.data.data.access);
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
        access: Yup.string().required("access is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            access: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log("Form data:", values);
            try {
                setUpdatingLoading(true);
                const data = new FormData();
                data.append('access', values.access);
                data.append('id', id);
                const response = await axios.post(`${API_URL}/update-users.php`, data); // Adjusted endpoint for updating the expense
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

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Update Users" breadcrumbItem="Update Users" />
                    {loading ? (
                        <center>
                            <div className="spinner-border mt-6" role="access">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </center>
                    ) : (
                        <Form onSubmit={formik.handleSubmit}>
                            <Row>
                                <Col xl={12}>
                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-4">Update Users</CardTitle>
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
                                                    <Label htmlFor="access">access</Label>
                                                    <Input
                                                        type="select"
                                                        name="access"
                                                        value={formik.values.access}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        invalid={formik.touched.access && !!formik.errors.access}
                                                    >
                                                        <option value="" disabled>Choose...</option>
                                                        <option value="0">Denied</option>
                                                        <option value="1">Full</option>
                                                        <option value="2">Moderate </option>
                                                        <option value="3">Limited  </option>
                                                    </Input>
                                                    {formik.touched.access && formik.errors.access ? (
                                                        <FormFeedback>{formik.errors.access}</FormFeedback>
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
