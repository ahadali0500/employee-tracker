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
    const [data, setData] = useState([])
    console.log(data);
    const [loading, setLoading] = useState(true)
    const storedData = JSON.parse(localStorage.getItem('desiredexpenseappcompany'));
    const [delloading, setDelLoading] = useState(false)
    console.log(data);
    const datafetch = async () => {
        const data = new FormData();
        data.append('company_id', storedData.id);
        const response = await axios.post(`${API_URL}/fetch-user.php`, data);
        setData(response.data.data)
        setLoading(false)
    }

    useEffect(() => {
        datafetch();
    }, []);


    const [deleteModal, setDeleteModal] = useState(false);
    const [deletedata, setdeleteData] = useState(null);

    const onClickDelete = (job) => {
        setdeleteData(job);
        setDeleteModal(true);
    };

    const handleDeletejob = async () => {
        setDelLoading(true);
        setDeleteModal(false);

        const deleteRequest = async () => {
            const formData = new FormData();
            formData.append('id', deletedata.id);

            const response = await axios.post(`${API_URL}/delete-plan.php`, formData);
            return response.data;
        };

        toast.promise(
            deleteRequest(),
            {
                loading: 'Deleting...',
                success: 'Users deleted!',
                error: 'Could not delete',
            }
        ).then(() => {
            if (deletedata) {
                setData(data.filter(item => item.id !== deletedata.id));
            }
        }).catch((error) => {
            console.error("Error deleting job:", error);
        }).finally(() => {
            setDelLoading(false);
        });
    };

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'password',
                accessorKey: 'password',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Access',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => {
                    if (Number(row.original.access) == 0) {
                        return (
                            <div className={`badge rounded-pill badge-soft-info font-size-11`}>
                               Pending
                            </div>
                        );
                    } else if(Number(row.original.access) == 1) {
                        return (
                            <div className={`badge rounded-pill badge-soft-success font-size-11`}>
                              Full
                            </div>
                        );
                    } else if(Number(row.original.access) == 2) {
                        return (
                            <div className={`badge rounded-pill badge-soft-primary font-size-11`}>
                              Moderate
                            </div>
                        );
                    } else if(Number(row.original.access) == 3) {
                        return (
                            <div className={`badge rounded-pill badge-soft-secondary font-size-11`}>
                              Limited 
                            </div>
                        );
                    } else if(Number(row.original.access) == 4) {
                        return (
                            <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
                               Denied 
                            </div>
                        );
                    }
                }
            },
            {
                header: 'Action',
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cellProps) => {
                    return (
                        <ul className="list-unstyled hstack gap-1 mb-0">
                            <li>
                                <Link
                                    to={`/users/update/${cellProps.row.original.id}`}
                                    className="btn btn-sm btn-soft-info"
                                    id={`edittooltip-${cellProps.row.original.id}`}
                                >
                                    <i style={{ fontSize: 'medium' }} className="bx bx-edit" />
                                    <UncontrolledTooltip placement="top" target={`edittooltip-${cellProps.row.original.id}`} >
                                        Edit
                                    </UncontrolledTooltip>
                                </Link>
                            </li>
                        </ul>
                    );
                }
            },
        ],
        []
    );

    // const data = [
    //     {
    //         name: "Anaya Users",
    //         Businesstype: "Restaurang",
    //         Emailaddress: "Users@gmail.com",
    //     },
    //     {
    //         name: "Fazal Haq dera",
    //         Businesstype: "Restaurang",
    //         Emailaddress: "dera@gmail.com",
    //     },
    // ];

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Users" breadcrumbItem="Users" />
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
                                    msg="Are you sure you want to permanently remove the Users!"
                                />
                            </>
                            :
                            <>
                                <center>
                                    <div style={{ marginTop: '10%' }} >
                                        <img src="/question-mark.png" style={{ width: '100px' }} ></img>
                                        No Users exits in our records
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
