import React, { useEffect, useState,useContext } from "react";
import { Card, Col, Container, Row, CardBody, CardTitle, Label, Button, Form, Input, FormFeedback } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { API_URL } from "components/Constant";
import axios from "axios";
import * as Yup from 'yup';
import { useFormik } from "formik";
import Setting from "components/Setting";
import { AppContext } from "components/AppContext";



const Dashboard = props => {
  const datas = JSON.parse(localStorage.getItem('expenseCate'));
  const storedData = JSON.parse(localStorage.getItem('desiredexpenseappcompany'));
  const { state } = useContext(AppContext);
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  console.log(data);
  const datafetch = async () => {
    const data = new FormData();
    data.append('company_id', storedData.id);
    const response = await axios.post(`${API_URL}/company/dashboard`, data , headers: {
      'Authorization': `Bearer ${state.user.token}`,
  });
    setData(response.data)
    setLoading(false)
  }

  useEffect(() => {
    datafetch();
  }, [])


  //meta title

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title="Dashboards"
            breadcrumbItem="Dashboard"
          />
          {loading ?
            <>
              <center>
                <div className="spinner-border mt-6" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </center>
            </>
            :
            <>
              <Row>
                {datas[0].status == 0 &&
                  <>
                    <Col md="4" >
                      <Card className="mini-stats-wid">
                        <CardBody>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <p className="text-muted fw-medium">
                                General Expenses List
                              </p>
                              <h4 className="mb-0">{data.general_expenses_list}</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-money" style={{ fontSize: '25px' }} ></i>
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </>
                }
                {datas[1].status == 0 &&
                  <>
                    <Col md="4" >
                      <Card className="mini-stats-wid">
                        <CardBody>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <p className="text-muted fw-medium">
                                Business Expense List
                              </p>
                              <h4 className="mb-0">{data.business_expense_list}</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-money" style={{ fontSize: '25px' }} ></i>
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </>
                }
                {datas[1].department == 0 &&
                  <>
                    <Col md="4" >
                      <Card className="mini-stats-wid">
                        <CardBody>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <p className="text-muted fw-medium">
                                Departments
                              </p>
                              <h4 className="mb-0">{data.departments}</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-buildings" style={{ fontSize: '25px' }} ></i>
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="4" >
                      <Card className="mini-stats-wid">
                        <CardBody>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <p className="text-muted fw-medium">
                                Department Purchasing list
                              </p>
                              <h4 className="mb-0">{data.department_purchasing_list}</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-customize" style={{ fontSize: '25px' }} ></i>
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="4" >
                      <Card className="mini-stats-wid">
                        <CardBody>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <p className="text-muted fw-medium">
                                Employees List
                              </p>
                              <h4 className="mb-0">{data.employees_list}</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-user-voice" style={{ fontSize: '25px' }} ></i>
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </>
                }
                <Col md="4" >
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">
                            Banks
                          </p>
                          <h4 className="mb-0">{data.banks}</h4>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                          <span className="avatar-title rounded-circle bg-primary">
                            <i className="bx bxs-bank" style={{ fontSize: '25px' }} ></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                {datas[1].everyday == 0 &&
                  <>
                    <Col md="4" >
                      <Card className="mini-stats-wid">
                        <CardBody>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <p className="text-muted fw-medium">
                                Everday Expenses List
                              </p>
                              <h4 className="mb-0">{data.everday_expenses_list}</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-money" style={{ fontSize: '25px' }} ></i>
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </>
                }
                <Col md="4" >
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">
                            Users
                          </p>
                          <h4 className="mb-0">{data.users}</h4>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                          <span className="avatar-title rounded-circle bg-primary">
                            <i className="bx bx-user-pin" style={{ fontSize: '25px' }} ></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          }

        </Container>
      </div>
      {loading ?
        <>
          {/* <center>
            <div className="spinner-border mt-6" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </center> */}
        </>
        :
        <>
          <Setting data={data.data} ></Setting>
        </>
      }
    </React.Fragment>
  );
};


export default Dashboard;
