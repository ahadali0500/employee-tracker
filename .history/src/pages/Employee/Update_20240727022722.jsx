import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Button, Form, Input, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { useParams, useLocation, Link } from 'react-router-dom';
import { API_URL } from "components/Constant";
import toast from 'react-hot-toast';
import { AppContext } from "components/AppContext";
import WorkingHours from "./WorkingHours";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const Add = () => {
    const query = useQuery();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [updatingLoading, setUpdatingLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [manager, setManager] = useState([]);
    const [data, setdata] = useState([]);
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
            setdata(response.data.data[0])
            const managerData = response.data.data[0];
            formik.setFieldValue("departments", managerData.department_id == 0 ? '' : managerData.department_id);
            formik.setFieldValue("departments", managerData.manager_id == 0 ? '' : managerData.manager_id);
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
            departments: "",
            manager: "",
            status: "",
            id: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("Form data on submit:", values);
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
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="departments">Departments</Label>
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
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                            ))}
                                                        </Input>
                                                        {formik.touched.departments && formik.errors.departments ? (
                                                            <FormFeedback>{formik.errors.departments}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="manager">Manager</Label>
                                                        <Input
                                                            type="select"
                                                            name="manager"
                                                            value={formik.values.manager}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            invalid={formik.touched.manager && !!formik.errors.manager}
                                                        >
                                                            <option value="" disabled>Choose...</option>
                                                            {manager.map((item, index) => (
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                            ))}
                                                        </Input>
                                                        {formik.touched.manager && formik.errors.manager ? (
                                                            <FormFeedback>{formik.errors.manager}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                {data.working_hours != null ?
                                                    <>
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
                                                    </>
                                                    :
                                                    <>
                                                    <b>when working hour is assigned then account activation option will be shown! <Link to={`/employee/working-hours${id}`} >Assign Working Hours</Link></b>  
                                                    </>
                                                }

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

export default Add;
