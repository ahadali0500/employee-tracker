import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from './Constant';
import { values } from 'lodash';

export default function Setting(data) {
    console.log(data);
    const datas = JSON.parse(localStorage.getItem('expenseCate'));

    const initialValues = {
        generalExpense: data.data[0].status == "0",
        businessExpense: data.data[1].status == "0",
        everyday: data.data[1].everyday == "0" && data.data[1].status == "0",
        department: data.data[1].department == "0" && data.data[1].status == "0",
        Compensations: data.data[1].Compensations == "0" && data.data[1].department == "0" && data.data[1].status,
        PurchasingTools: data.data[1].PurchasingTools == "0" && data.data[1].department == "0" && data.data[1].status,
        Employees: data.data[1].Employees == "0" && data.data[1].Compensations == "0" && data.data[1].department == "0" && data.data[1].status,
        Partnership: data.data[1].Partnership == "0"  && data.data[1].Compensations == "0" && data.data[1].department == "0" && data.data[1].status,
        Contractor: data.data[1].Contractor == "0"  && data.data[1].Compensations == "0" && data.data[1].department == "0" && data.data[1].status,        
        name1: datas[0].expense_name,
        name2: datas[1].expense_name
    };

    const handleSubmit = async (values, actions) => {
        actions.setSubmitting(true);
        const storedData = JSON.parse(localStorage.getItem('desiredexpenseappcompany'));
        try {
            const formData = new FormData();
            formData.append('businessExpense', values.name2);
            formData.append('generalExpense', values.name1);
            formData.append('businessstatus', values.businessExpense);
            formData.append('generalstatus', values.generalExpense);
            formData.append('company_id', storedData.id);
            formData.append('department', values.department);
            formData.append('everyday', values.everyday);
            formData.append('Compensations', values.Compensations);
            formData.append('PurchasingTools', values.PurchasingTools);
            formData.append('Employees', values.Employees);
            formData.append('Partnership', values.Partnership);
            formData.append('Contractor', values.Contractor);

            const response = await axios.post(`${API_URL}/update-expense-type.php`, formData);
            if (response.data.code == 200) {
                localStorage.setItem('expenseCate', JSON.stringify(response.data.expenseCate));
                toast.success('Settings updated successfully!');
            } else {
                toast.error('Try again!');
            }
        } catch (error) {
            console.error('There was an error submitting the form!', error);
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '-131px' }} className="page-content">
            <Container fluid>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ isSubmitting, values }) => (
                        <Form>
                            <Row>
                                <Col xl={12}>
                                    <Card>
                                        <CardBody>
                                            <CardTitle>Basic Configurations</CardTitle>
                                            <Row>
                                                <Col md={6} sm={6}>
                                                    <div className="mt-2">
                                                        <h6>For General Expense Management</h6>
                                                        <div className="mb-4" style={{ display: 'flex' }} >
                                                            <Field
                                                                className="form-check-input" style={{ padding: '16px' }}
                                                                type="checkbox"
                                                                name="generalExpense"
                                                                id="generalExpense"
                                                            />
                                                            <Field
                                                                className="form-control" style={{ marginLeft: '10px' }}
                                                                type="text"
                                                                name="name1"
                                                                id="name1"
                                                                placeholder="General Expense"
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md={6} sm={6}>
                                                    <div className="mt-2">
                                                        <h6>For Buisness Expense Management</h6>

                                                        <div className="mb-4" style={{ display: 'flex' }} >
                                                            <Field
                                                                className="form-check-input" style={{ padding: '16px' }}
                                                                type="checkbox"
                                                                name="businessExpense"
                                                                id="businessExpense"
                                                            />
                                                            <Field
                                                                className="form-control" style={{ marginLeft: '10px' }}
                                                                type="text"
                                                                name="name2"
                                                                id="name2"
                                                                placeholder="Business Expense"
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                {values.businessExpense ?
                                                    <>
                                                        <Col md={10} sm={10}>
                                                            <div className="mt-2">
                                                                <h6>Additional Features for Buisness Management</h6>
                                                                <div className="mb-2" style={{ display: 'flex' }} >
                                                                    <Field
                                                                        className="form-check-input" style={{ padding: '10px' }}
                                                                        type="checkbox"
                                                                        name="department"
                                                                        id="department"
                                                                    />
                                                                    <label style={{ marginLeft: '10px' }} className='mt-1' >Department</label>
                                                                </div>
                                                                {values.department ?
                                                                    <>
                                                                        <Col md={6} sm={6}>
                                                                            <div style={{ marginLeft: '25px' }} className="mt-2">
                                                                                <h6>Department Expense Type</h6>
                                                                                <div className="mb-2" style={{ display: 'flex' }} >
                                                                                    <Field
                                                                                        className="form-check-input" style={{ padding: '10px' }}
                                                                                        type="checkbox"
                                                                                        name="Compensations"
                                                                                        id="Compensations"
                                                                                    />
                                                                                    <label style={{ marginLeft: '10px' }} className='mt-1' >Compensations</label>
                                                                                </div>
                                                                                {values.Compensations ?
                                                                                    <>
                                                                                        <Col md={6} sm={6}>
                                                                                            <div style={{ marginLeft: '30px' }} className="mt-2">
                                                                                                <h6>Compensations Type</h6>
                                                                                                <div className="mb-2" style={{ display: 'flex' }} >
                                                                                                    <Field
                                                                                                        className="form-check-input" style={{ padding: '10px' }}
                                                                                                        type="checkbox"
                                                                                                        name="Employees"
                                                                                                        id="Employees"
                                                                                                    />
                                                                                                    <label style={{ marginLeft: '10px' }} className='mt-1' >Employees</label>
                                                                                                </div>
                                                                                                <div className="mb-2" style={{ display: 'flex' }} >
                                                                                                    <Field
                                                                                                        className="form-check-input" style={{ padding: '10px' }}
                                                                                                        type="checkbox"
                                                                                                        name="Partnership"
                                                                                                        id="Partnership"
                                                                                                    />
                                                                                                    <label style={{ marginLeft: '10px' }} className='mt-1' >Invsertor/Partnership</label>
                                                                                                </div>
                                                                                                <div className="mb-4" style={{ display: 'flex' }} >
                                                                                                    <Field
                                                                                                        className="form-check-input" style={{ padding: '10px' }}
                                                                                                        type="checkbox"
                                                                                                        name="Contractor"
                                                                                                        id="Contractor"
                                                                                                    />
                                                                                                    <label style={{ marginLeft: '10px' }} className='mt-1' >Contractor</label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                    </>

                                                                                }
                                                                                <div className="mb-4" style={{ display: 'flex' }} >
                                                                                    <Field
                                                                                        className="form-check-input" style={{ padding: '10px' }}
                                                                                        type="checkbox"
                                                                                        name="PurchasingTools"
                                                                                        id="PurchasingTools"
                                                                                    />
                                                                                    <label style={{ marginLeft: '10px' }} className='mt-1' >Purchasing Tools</label>
                                                                                </div>
                                                                            </div>
                                                                        </Col>

                                                                    </>
                                                                    :
                                                                    <>
                                                                    </>

                                                                }
                                                                <div className="mb-4" style={{ display: 'flex' }} >
                                                                    <Field
                                                                        className="form-check-input" style={{ padding: '10px' }}
                                                                        type="checkbox"
                                                                        name="everyday"
                                                                        id="everyday"
                                                                    />
                                                                    <label style={{ marginLeft: '10px' }} className='mt-1' >Everyday</label>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </>
                                                    :
                                                    <>
                                                    </>

                                                }

                                            </Row>
                                            <br />
                                            <Button type="submit" disabled={isSubmitting} color="primary" outline>
                                                {isSubmitting ? 'Loading..' : 'Update'}
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Container>
        </div>
    );
}
