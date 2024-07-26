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
    const [loading, setLoading] = useState(false);
    const [updatingLoading, setUpdatingLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [manager, setManager] = useState([]);
    const { state } = useContext(AppContext);

    const dataFetch = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/company/employee/working-hours/get/${id}`, {
                headers: {
                    'Authorization': `Bearer ${state.user.token}`,
                }
            });
            console.log('Fetched data:', response.data);
            setLoading(false);
            const managerData = response.data.data[0];
            formik.setFieldValue("type", managerData.type);
            formik.setFieldValue("startTime", managerData.startTime== null ? '' : managerData.startTime);
            formik.setFieldValue("endTime", managerData.endTime== null ? '' : managerData.endTime);
            formik.setFieldValue("startBreakTime", managerData.startBreakTime== null ? '' : managerData.startBreakTime);
            formik.setFieldValue("endBreakTime", managerData.endBreakTime== null ? '' : managerData.endBreakTime);
            formik.setFieldValue("partType", managerData.partType == null ? '' : managerData.partType);
            formik.setFieldValue("startpartTime", managerData.startpartTime== null ? '' : managerData.startpartTime);
            formik.setFieldValue("endpartTime", managerData.endpartTime== null ? '' : managerData.endpartTime);
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
        type: Yup.string().required("Type is required"),
        startTime: Yup.string().when('type', {
            is: (val) => val === 'full',
            then: () => Yup.string().required('Start Time is required for full type'),
        }),
        endTime: Yup.string().when('type', {
            is: (val) => val === 'full',
            then: () => Yup.string().required('End Time is required for full type'),
        }),
        startBreakTime: Yup.string().when('type', {
            is: (val) => val === 'full',
            then: () => Yup.string().required('Start Break Time is required for full type'),
        }),
        endBreakTime: Yup.string().when('type', {
            is: (val) => val === 'full',
            then: () => Yup.string().required('End Break Time is required for full type'),
        }),
        partType: Yup.string().when('type', {
            is: (val) => val === 'part',
            then: () => Yup.string().required('Part Type is required for part type'),
        }),
        startpartTime: Yup.string().when('type', {
            is: (val) => val === 'part',
            then: () => Yup.string().required('Start Part Time is required for part type'),
        }),
        endpartTime: Yup.string().when('type', {
            is: (val) => val === 'part',
            then: () => Yup.string().required('End Part Time is required for part type'),
        }),
    });


    const formik = useFormik({
        initialValues: {
            type: "",
            startTime: "",
            endTime: "",
            startBreakTime: "",
            endBreakTime: "",
            partType: "",
            startpartTime: "",
            endpartTime: "",

        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("Form data on submits22:", values);
            try {
                setUpdatingLoading(true);
                const data = new FormData();
                data.append('type', values.type);
                if (values.type=="full") {
                    data.append('startTime', values.startTime);
                    data.append('endTime', values.endTime);
                    data.append('startBreakTime', values.startBreakTime);
                    data.append('endBreakTime', values.endBreakTime);

                    data.append('partType', '');
                    data.append('startpartTime', '');
                    data.append('endpartTime', '');
                    
                }else{
                    data.append('startTime', values.startTime);
                    data.append('endTime', values.endTime);
                    data.append('startBreakTime', values.startBreakTime);
                    data.append('endBreakTime', values.endBreakTime);

                    data.append('partType', values.partType);
                    data.append('startpartTime', values.startpartTime);
                    data.append('endpartTime', values.endpartTime);
                }
               
                

                const response = await axios.post(`${API_URL}/company/employee/working-hours/update/${id}`, data, {
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
    return (
        <React.Fragment>
            <div style={{padding:'calc(0px + -8px) calc(24px * 0.75) 60px calc(24px * 0.75)'}} className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Update Working Routine" breadcrumbItem="Update Working Routine" />
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
                                            <CardTitle className="mb-4">Working Routine</CardTitle>
                                            <Row>
                                                <Col md={12}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status">Type</Label>
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
                                                {formik.values.type == "full" ?
                                                    <>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="status">Start Time</Label>
                                                                <Input
                                                                    type="time"
                                                                    name="startTime"
                                                                    value={formik.values.startTime}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    invalid={formik.touched.startTime && !!formik.errors.startTime}
                                                                >

                                                                </Input>
                                                                {formik.touched.startTime && formik.errors.startTime ? (
                                                                    <FormFeedback>{formik.errors.startTime}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="status">End Time</Label>
                                                                <Input
                                                                    type="time"
                                                                    name="endTime"
                                                                    value={formik.values.endTime}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    invalid={formik.touched.endTime && !!formik.errors.endTime}
                                                                >

                                                                </Input>
                                                                {formik.touched.endTime && formik.errors.endTime ? (
                                                                    <FormFeedback>{formik.errors.endTime}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="status">Start Break Time</Label>
                                                                <Input
                                                                    type="time"
                                                                    name="startBreakTime"
                                                                    value={formik.values.startBreakTime}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    invalid={formik.touched.startBreakTime && !!formik.errors.startBreakTime}
                                                                >

                                                                </Input>
                                                                {formik.touched.startBreakTime && formik.errors.startBreakTime ? (
                                                                    <FormFeedback>{formik.errors.startBreakTime}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="status">End Break Time</Label>
                                                                <Input
                                                                    type="time"
                                                                    name="endBreakTime"
                                                                    value={formik.values.endBreakTime}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    invalid={formik.touched.endBreakTime && !!formik.errors.endBreakTime}
                                                                >

                                                                </Input>
                                                                {formik.touched.endBreakTime && formik.errors.endBreakTime ? (
                                                                    <FormFeedback>{formik.errors.endBreakTime}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                    </>
                                                    :
                                                    <>
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
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="status">Start Part Time</Label>
                                                                <Input
                                                                    type="time"
                                                                    name="startpartTime"
                                                                    value={formik.values.startpartTime}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    invalid={formik.touched.startpartTime && !!formik.errors.startpartTime}
                                                                >

                                                                </Input>
                                                                {formik.touched.startpartTime && formik.errors.startpartTime ? (
                                                                    <FormFeedback>{formik.errors.startpartTime}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>

                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="status">Start Part Time</Label>
                                                                <Input
                                                                    type="time"
                                                                    name="endpartTime"
                                                                    value={formik.values.endpartTime}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    invalid={formik.touched.endpartTime && !!formik.errors.endpartTime}
                                                                >

                                                                </Input>
                                                                {formik.touched.endpartTime && formik.errors.endpartTime ? (
                                                                    <FormFeedback>{formik.errors.endpartTime}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>
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

export default WorkingHours;
