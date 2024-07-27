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
            formik.setFieldValue("startTime", managerData.startTime == null ? '' : managerData.startTime);
            formik.setFieldValue("endTime", managerData.endTime == null ? '' : managerData.endTime);
            formik.setFieldValue("startBreakTime", managerData.startBreakTime == null ? '' : managerData.startBreakTime);
            formik.setFieldValue("endBreakTime", managerData.endBreakTime == null ? '' : managerData.endBreakTime);
            formik.setFieldValue("partType", managerData.partType == null ? '' : managerData.partType);
            formik.setFieldValue("startpartTime", managerData.startpartTime == null ? '' : managerData.startpartTime);
            formik.setFieldValue("endpartTime", managerData.endpartTime == null ? '' : managerData.endpartTime);
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
            is: 'full',
            then: ()=> Yup.string().required('Start Time is required for full type'),
        }),
        endTime: Yup.string().when('type', {
            is: 'full',
            then: ()=> Yup.string()
                .required('End Time is required for full type')
                .test('is-greater', 'End Time must be later than Start Time', function (value) {
                    const { startTime } = this.parent;
                    return startTime && value ? startTime < value : true;
                }),
        }),
        startBreakTime: Yup.string().when('type', {
            is: 'full',
            then: ()=> Yup.string()
                .required('Start Break Time is required for full type')
                .test('is-between', 'Start Break Time must be between Start Time and End Time', function (value) {
                    const { startTime, endTime } = this.parent;
                    return startTime && endTime && value ? startTime < value && value < endTime : true;
                }),
        }),
        endBreakTime: Yup.string().when('type', {
            is: 'full',
            then: ()=> Yup.string()
                .required('End Break Time is required for full type')
                .test('is-greater', 'End Break Time must be later than Start Break Time', function (value) {
                    const { startBreakTime } = this.parent;
                    return startBreakTime && value ? startBreakTime < value : true;
                })
                .test('is-between', 'End Break Time must be between Start Time and End Time', function (value) {
                    const { startTime, endTime } = this.parent;
                    return startTime && endTime && value ? startTime < value && value < endTime : true;
                }),
        }),
        partType: Yup.string().when('type', {
            is: 'part',
            then: ()=> Yup.string().required('Part Type is required for part type'),
        }),
        startpartTime: Yup.string().when('type', {
            is: 'part',
            then: ()=> Yup.string().required('Start Part Time is required for part type'),
        }),
        endpartTime: Yup.string().when('type', {
            is: 'part',
            then: ()=> Yup.string()
                .required('End Part Time is required for part type')
                .test('is-greater', 'End Part Time must be later than Start Part Time', function (value) {
                    const { startpartTime } = this.parent;
                    return startpartTime && value ? startpartTime < value : true;
                }),
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
                if (values.type == "full") {
                    data.append('startTime', values.startTime);
                    data.append('endTime', values.endTime);
                    data.append('startBreakTime', values.startBreakTime);
                    data.append('endBreakTime', values.endBreakTime);
                    data.append('partType', '');
                    data.append('startpartTime', '');
                    data.append('endpartTime', '');
                } else {
                    data.append('startTime', '');
                    data.append('endTime', '');
                    data.append('startBreakTime', '');
                    data.append('endBreakTime', '');
                    data.append('partType', values.partType);
                    data.append('startpartTime', values.startpartTime);
                    data.append('endpartTime', values.endpartTime);
                }
                const response = await axios.post(`${API_URL}/company/employee/working-hours/update/${id}`, data, {
                    headers: {
                        'Authorization': `Bearer ${state.user.token}`,
                    }
                });
                console.log("Response:", response.data);
                toast.success("Working hours updated successfully");
                setUpdatingLoading(false);
                resetForm();
            } catch (error) {
                console.error('Submission error:', error);
                toast.error("An error occurred while updating working hours");
                setUpdatingLoading(false);
            }
        },
    });

    return (
        <Container fluid>
            <Breadcrumbs title="Dashboard" breadcrumbItem="Working Hours" />
            <Row>
                <Col xl="12">
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">Edit Working Hours</CardTitle>
                            <Form onSubmit={formik.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Label htmlFor="type">Type</Label>
                                        <Input
                                            id="type"
                                            name="type"
                                            type="select"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.type}
                                            invalid={formik.touched.type && !!formik.errors.type}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="full">Full Time</option>
                                            <option value="part">Part Time</option>
                                        </Input>
                                        <FormFeedback>{formik.errors.type}</FormFeedback>
                                    </Col>
                                </Row>
                                {formik.values.type === 'full' && (
                                    <>
                                        <Row>
                                            <Col md="6">
                                                <Label htmlFor="startTime">Start Time</Label>
                                                <Input
                                                    id="startTime"
                                                    name="startTime"
                                                    type="time"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.startTime}
                                                    invalid={formik.touched.startTime && !!formik.errors.startTime}
                                                />
                                                <FormFeedback>{formik.errors.startTime}</FormFeedback>
                                            </Col>
                                            <Col md="6">
                                                <Label htmlFor="endTime">End Time</Label>
                                                <Input
                                                    id="endTime"
                                                    name="endTime"
                                                    type="time"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.endTime}
                                                    invalid={formik.touched.endTime && !!formik.errors.endTime}
                                                />
                                                <FormFeedback>{formik.errors.endTime}</FormFeedback>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Label htmlFor="startBreakTime">Start Break Time</Label>
                                                <Input
                                                    id="startBreakTime"
                                                    name="startBreakTime"
                                                    type="time"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.startBreakTime}
                                                    invalid={formik.touched.startBreakTime && !!formik.errors.startBreakTime}
                                                />
                                                <FormFeedback>{formik.errors.startBreakTime}</FormFeedback>
                                            </Col>
                                            <Col md="6">
                                                <Label htmlFor="endBreakTime">End Break Time</Label>
                                                <Input
                                                    id="endBreakTime"
                                                    name="endBreakTime"
                                                    type="time"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.endBreakTime}
                                                    invalid={formik.touched.endBreakTime && !!formik.errors.endBreakTime}
                                                />
                                                <FormFeedback>{formik.errors.endBreakTime}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                                {formik.values.type === 'part' && (
                                    <>
                                        <Row>
                                            <Col md="6">
                                                <Label htmlFor="partType">Part Type</Label>
                                                <Input
                                                    id="partType"
                                                    name="partType"
                                                    type="text"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.partType}
                                                    invalid={formik.touched.partType && !!formik.errors.partType}
                                                />
                                                <FormFeedback>{formik.errors.partType}</FormFeedback>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Label htmlFor="startpartTime">Start Part Time</Label>
                                                <Input
                                                    id="startpartTime"
                                                    name="startpartTime"
                                                    type="time"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.startpartTime}
                                                    invalid={formik.touched.startpartTime && !!formik.errors.startpartTime}
                                                />
                                                <FormFeedback>{formik.errors.startpartTime}</FormFeedback>
                                            </Col>
                                            <Col md="6">
                                                <Label htmlFor="endpartTime">End Part Time</Label>
                                                <Input
                                                    id="endpartTime"
                                                    name="endpartTime"
                                                    type="time"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.endpartTime}
                                                    invalid={formik.touched.endpartTime && !!formik.errors.endpartTime}
                                                />
                                                <FormFeedback>{formik.errors.endpartTime}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                                <Button color="primary" type="submit" disabled={updatingLoading}>
                                    {updatingLoading ? 'Updating...' : 'Update'}
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WorkingHours;
