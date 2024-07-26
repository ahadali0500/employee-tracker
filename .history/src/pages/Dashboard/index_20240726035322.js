import React, { useEffect, useState, useContext } from "react";
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
    const response = await axios.get(`${API_URL}/company/dashboard`, { headers: {
      'Authorization': `Bearer ${state.user.token}`,
    }});
    setData(response.data)
    setLoading(false)
  }

  useEffect(() => {
    if (state.user) {
      datafetch();
    }
  }, [state])


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
                <Col md="4" >
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">
                            employee
                          </p>
                          <h4 className="mb-0">{data.employee}</h4>
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
