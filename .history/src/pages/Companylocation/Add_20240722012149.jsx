import React, { useState } from "react";
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Button, Form, Input, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { API_URL } from "components/Constant";
import toast from 'react-hot-toast';

const Add = () => {
    const storedData = JSON.parse(localStorage.getItem('desiredexpenseappcompany'));
    const [loading, setLoading] = useState(false);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        status: Yup.string().required("Status is required"),
    });
    const datas = JSON.parse(localStorage.getItem('expenseCate'));
    const formik = useFormik({
        initialValues: {
            name: "",
            status: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("Form data:", values);
            try {
                setLoading(true);
                const data = new FormData();
                data.append('name', values.name);
                data.append('status', values.status);
                data.append('company_id', storedData.id);
                const response = await axios.post(`${API_URL}/add-general-expense.php`, data);
                if (response.data.code === 200) {
                    resetForm();
                    toast.success(`${datas[0].expense_name } created successfully` );
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

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title={`Add ${datas[0].expense_name}`} breadcrumbItem={`Add ${datas[0].expense_name}`} />
                    <Form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col xl={12}>
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">General Information</CardTitle>
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
