import React, { useEffect, useMemo, useState, useContext } from "react";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import TableContainer from '../../components/Common/TableContainer';
import { Button, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
import { API_URL, IMG_URL } from "components/Constant";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useLocation } from 'react-router-dom';
import { AppContext } from "components/AppContext";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

function formatTime(time) {
    let [hours, minutes] = time.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

const Attendance = () => {
    const query = useQuery();
    const { id } = useParams();
    const [data, setData] = useState([])
    const [details, setdetails] = useState(null)
    const { state, setState } = useContext(AppContext);
    const [loading, setLoading] = useState(true)
    const [delloading, setDelLoading] = useState(false)
    console.log(state);

    const datafetch = async () => {
        const data = new FormData();
        data.append('employee_id', id);
        const response = await axios.post(`${API_URL}/company/employee/attendance` , data, {
            headers: {
              'Authorization': `Bearer ${state.user.token}`,
            }
          });
          console.log(response);
        setData(response.data.data)
        setDetails(response.data.data)
        setLoading(false)
    }

    useEffect(() => {
        if (state.user) {
            datafetch();
        }
    }, [state]);


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

            const response = await axios.post(`${API_URL}/delete-tips.php`, formData);
            return response.data;
        };

        toast.promise(
            deleteRequest(),
            {
                loading: 'Deleting...',
                success: 'Job deleted!',
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
                header: 'Date',
                accessorKey: 'date',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Day',
                accessorKey: 'day',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Default Checkin',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => {
                    if (row.original.check_in_time != null) {
                        return (
                            <> {formatTime(row.original.check_in_time)} </>
                        );
                    } else {
                        return (
                            <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
                                checkin Pending
                            </div>
                        );
                    }

                }
            },
            {
                header: 'Checking Time',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => {
                    if (row.original.checking_time != null) {
                        return (
                            <> {formatTime(row.original.checking_time)} </>
                        );
                    } else {
                        return (
                            <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
                                Checking Pending
                            </div>
                        );
                    }

                }
            },
            {
                header: 'Default checkout',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => {
                    if (row.original.check_out_time != null) {
                        return (
                            <>{formatTime(row.original.check_out_time)}</>
                        );
                    } else {
                        return (
                            <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
                                Checkout Pending
                            </div>
                        );
                    }

                }
            },
            {
                header: 'checkout',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => {
                    if (row.original.checkout_time != null) {
                        return (
                            <> {formatTime(row.original.checkout_time)} </>
                        );
                    } else {
                        return (
                            <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
                                Checkout Pending
                            </div>
                        );
                    }

                }
            },
            {
                header: 'Working Hours',
                enableColumnFilter: false,
                enableSorting: true,
                cell: ({ row }) => {
                    if (row.original.working_hours != null) {
                        return (
                            <>{row.original.working_hours}</>
                        );
                    } else {
                        return (
                            <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
                                Pending
                            </div>
                        );
                    }

                }
            },
            {
                header: 'status',
                accessorKey: 'status',
                enableColumnFilter: false,
                enableSorting: true,
            },
            // {
            //     header: 'Department Name',
            //     enableColumnFilter: false,
            //     enableSorting: true,
            //     cell: ({ row }) => {
            //         if (Number(row.original.department_id) == 0) {
            //             return (
            //                 <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
            //                    Not Assigned
            //                 </div>
            //             );
            //         } else {
            //             return (
            //                 <>
            //                   {row.original.department.name}
            //                 </>
            //             );
            //         }

            //     }
            // },
            // {
            //     header: 'Working Hours',
            //     enableColumnFilter: false,
            //     enableSorting: true,
            //     cell: ({ row }) => {
            //         if (row.original.working_hours == null) {
            //             return (
            //                 <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
            //                    Not Assigned
            //                 </div>
            //             );
            //         } else if(row.original.working_hours.type=="full") {
            //             return (
            //                 <>
            //                   {`Type: ${row.original.working_hours.type}, WorkngTime: ${row.original.working_hours.startTime}-${row.original.working_hours.endTime}, BreakTime: ${row.original.working_hours.startBreakTime}-${row.original.working_hours.endBreakTime}`}
            //                 </>
            //             );
            //         }else if(row.original.working_hours.type=="part") {
            //             return (
            //                 <>
            //                   {`Type: ${row.original.working_hours.type}, WorkngTime: ${row.original.working_hours.startpartTime}-${row.original.working_hours.endpartTime}, Shift: ${row.original.working_hours.partType}`}
            //                 </>
            //             );
            //         }

            //     }
            // },
            // {
            //     header: 'Manager Name',
            //     enableColumnFilter: false,
            //     enableSorting: true,
            //     cell: ({ row }) => {
            //         if (Number(row.original.manager_id) == 0) {
            //             return (
            //                 <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
            //                    Not Assigned
            //                 </div>
            //             );
            //         } else {
            //             return (
            //                 <>
            //                   {row.original.manager.name}
            //                 </>
            //             );
            //         }

            //     }
            // },
            // {
            //     header: 'Profile Image',
            //     enableColumnFilter: false,
            //     enableSorting: true,
            //     cell: ({ row }) => {
            //         if (!row.original.image) {
            //             return (
            //                 <img style={{ width: '50px' }} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" ></img>
            //             );
            //         } else {
            //             return (
            //                 <img style={{ width: '50px' }} src={`${IMG_URL}/storage/${row.original.image}`}></img>
            //             );
            //         }
            //     }
            // },
            // {
            //     header: 'status',
            //     enableColumnFilter: false,
            //     enableSorting: true,
            //     cell: ({ row }) => {
            //         if (Number(row.original.status) == 1) {
            //             return (
            //                 <div className={`badge rounded-pill badge-soft-success font-size-11`}>
            //                    Active
            //                 </div>
            //             );
            //         } else {
            //             return (
            //                 <div className={`badge rounded-pill badge-soft-danger font-size-11`}>
            //                   Disabled
            //                 </div>
            //             );
            //         }

            //     }
            // },
            // {
            //     header: 'Action',
            //     enableColumnFilter: false,
            //     enableSorting: true,
            //     cell: (cellProps) => {
            //         return (
            //             <ul className="list-unstyled hstack gap-1 mb-0">
            //                 <li>
            //                     <Link
            //                         to={`/employee/update/${cellProps.row.original.id}`}
            //                         className="btn btn-sm btn-soft-info"
            //                         id={`edittooltip-${cellProps.row.original.id}`}
            //                     >
            //                         <i style={{ fontSize: 'medium' }} className="bx bx-edit" />
            //                         <UncontrolledTooltip placement="top" target={`edittooltip-${cellProps.row.original.id}`} >
            //                             Edit
            //                         </UncontrolledTooltip>
            //                     </Link>
            //                 </li>
            //                 <li>
            //                     <Link
            //                         to={`/employee/attendance/${cellProps.row.original.id}`}
            //                         className="btn btn-sm btn-soft-info"
            //                         id={`attendancetooltip-${cellProps.row.original.id}`}
            //                     >
            //                         <i style={{ fontSize: 'medium' }} className="bx bx-repeat" />
            //                         <UncontrolledTooltip placement="top" target={`attendancetooltip-${cellProps.row.original.id}`} >
            //                             View Attendance
            //                         </UncontrolledTooltip>
            //                     </Link>
            //                 </li>
            //             </ul>
            //         );
            //     }
            // },
        ],
        []
    );

    // const data = [
    //     {
    //         name: "Anaya Restaurants",
    //         Businesstype: "Restaurang",
    //         Emailaddress: "Restaurants@gmail.com",
    //     },
    //     {
    //         name: "Fazal Haq dera",
    //         Businesstype: "Restaurang",
    //         Emailaddress: "dera@gmail.com",
    //     },
    // ];



    // Meta title

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Employee Attendance" breadcrumbItem="Employee Attendance" />
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
                                    msg="Are you sure you want to permanently remove the Departments!"
                                />
                            </>
                            :
                            <>
                                <center>
                                    <div style={{ marginTop: '10%' }} >
                                        <img src="/question-mark.png" style={{ width: '100px' }} ></img>
                                        No Employee exits in our records
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

export default Attendance;



