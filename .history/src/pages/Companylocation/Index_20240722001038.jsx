import React, { useEffect, useMemo, useState } from "react";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import TableContainer from '../../components/Common/TableContainer';
import { Button, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
import { API_URL } from "components/Constant";
import axios from "axios";
import toast from "react-hot-toast";
import Map from "./Map";

const Index = () => {
    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Company Location" breadcrumbItem="Company Location" />
                   <Map></Map>    
            </div>
        </div>
    );
}

export default Index;
