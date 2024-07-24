import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Button, Form, Input, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { useParams, useLocation } from 'react-router-dom';
import { API_URL } from "components/Constant";
import toast from 'react-hot-toast';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Add = () => {
    const query = useQuery();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [updatingLoading, setUpdatingLoading] = useState(false);

    const dataFetch = async () => {
        try {
            const response = await axios.get(`${API_URL}/company/manager/get/${id}`,); // Adjusted endpoint for fetching a single expense
            console.log(response.data);
            formik.setFieldValue("name", response.data.data.bank_name);
            formik.setFieldValue("status", response.data.data.status);
            formik.setFieldValue("pre_img", response.data.data.image);
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
            image: null,
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("Form data:", values);
            try {
                setLoading(true);
                const data = new FormData();
                data.append('bank_name', values.name);
                data.append('status', values.status);
                data.append('pre_img', values.pre_img);
                
                data.append('bank_id', id);

                
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
                                                <Label htmlFor="Name">Name</Label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    invalid={formik.touched.name && !!formik.errors.name}
                                                />
                                                {formik.touched.name && formik.errors.name ? (
                                                    <FormFeedback>{formik.errors.name}</FormFeedback>
                                                ) : null}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <Label htmlFor="image">Image</Label>
                                                <Input
                                                    type="file"
                                                    name="image"
                                                    onChange={handleImageChange}
                                                    onBlur={formik.handleBlur}
                                                    invalid={formik.touched.image && !!formik.errors.image}
                                                />
                                                {formik.touched.image && formik.errors.image ? (
                                                    <FormFeedback>{formik.errors.image}</FormFeedback>
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
                            <Button type="submit" disabled={loading} color="primary" outline>{loading ? 'Loading..' : 'Submit'}</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    </React.Fragment>
    );
};

export default Add;
