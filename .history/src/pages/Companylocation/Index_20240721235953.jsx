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
                <Breadcrumbs title={`${datas[0].expense_name}`} breadcrumbItem={`${datas[0].expense_name} `} />
                <Link to="/general-expense/add"><Button style={{ float: 'right' }} color="primary" outline>Add {datas[0].expense_name}</Button></Link>
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
                        {data.length > 0 ?
                            <>
                                <TableContainer
                                    columns={columns}
                                    data={data || []}
                                    isGlobalFilter={true}
                                    isPagination={true}
                                    SearchPlaceholder="search records..."
                                    pagination="pagination"
                                    paginationWrapper='dataTables_paginate paging_simple_numbers'
                                    tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                                />
                                <DeleteModal
                                    show={deleteModal}
                                    onDeleteClick={handleDeletejob}
                                    onCloseClick={() => setDeleteModal(false)}
                                    msg={`Are you sure you want to permanently remove the ${datas[0].expense_name} `}
                                />
                            </>
                            :
                            <>
                                <center>
                                    <div style={{ marginTop: '10%' }} >
                                        <img src="/question-mark.png" style={{ width: '100px' }} ></img>
                                        No {datas[0].expense_name} exits in our records
                                    </div>
                                </center>
                            </>
                        }

                    </>
                }
            </div>
        </div>
    );
}

export default Index;
