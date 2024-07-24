import React, { useEffect, useMemo, useState } from "react";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import TableContainer from '../../components/Common/TableContainer';
import { Button, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
import { API_URL } from "components/Constant";
import axios from "axios";
import toast from "react-hot-toast";

const Index = () => {
    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Company Location" breadcrumbItem={`${datas[0].expense_name} `} />
                <Link to="/general-expense/add"><Button style={{ float: 'right' }} color="primary" outline>Add {datas[0].expense_name}</Button></Link>
               
            </div>
        </div>
    );
}

export default Index;
