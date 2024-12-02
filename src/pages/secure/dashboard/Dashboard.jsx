import { Box, Button, Skeleton, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";
// import TopCards from "./Components/TopCards";
import moment from "moment";

import { addDays, startOfMonth, addMonths } from "date-fns";
import ForwardIcon from "@mui/icons-material/Forward";
import "./dashboard.css";
import axios from "axios";
import DoughnutGraph from "./Components/DoughnutGraph";
import { BarGraph } from "./Components/BarGraph";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Dashboard = () => {
  const [state, setState] = useState({
    categoryWiseList: [],
    totalChat: "",
    totalChatLoading: true,
    tableLoading: true,
    categoryStartDate: new Date(),
    categoryEndDate: new Date(),
    agentStartDate: new Date(),
    agentEndDate: new Date(),
  });
  // const [dateTime, setDateTime] = useState({
  //   // dateTabs0: {
  //   //   name: "1M",
  //   //   enddateValue: moment().format("YYYY-MM-DD"),
  //   //   startdateValue: moment(addDays(new Date(), -29)).format("YYYY-MM-DD"),
  //   //   chatCountStartDate: moment(addDays(new Date(), -29)).format("YYYY-MM-DD"),
  //   //   agentPerformanceStartDate: moment(addDays(new Date(), -29)).format(
  //   //     "YYYY-MM-DD"
  //   //   ),
  //   //   loginStatusStartDate: moment(addDays(new Date(), -29)).format(
  //   //     "YYYY-MM-DD"
  //   //   ),
  //   //   dateTypee: "Month",
  //   //   startDateMonth: moment(startOfMonth(addMonths(new Date(), -1))).format(
  //   //     "YYYYMM"
  //   //   ),
  //   //   endDateMonth: moment().format("YYYYMM"),
  //   //   tooltipText: "Month",
  //   // },
  //   startdateValue: moment(addDays(new Date(), -29)).format("YYYY-MM-DD"),
  //   chatCountStartDate: moment(addDays(new Date(), -29)).format("YYYY-MM-DD"),
  //   agentPerformanceStartDate: moment(addDays(new Date(), -29)).format(
  //     "YYYY-MM-DD"
  //   ),
  //   loginStatusStartDate: moment(addDays(new Date(), -29)).format("YYYY-MM-DD"),
  //   enddateValue: moment().format("YYYY-MM-DD"),

  //   dateTabs1: {
  //     name: "1M",
  //     enddateValue: moment().format("YYYY-MM-DD"),
  //     startdateValue: moment(addDays(new Date(), -29)).format("YYYY-MM-DD"),
  //     dateTypee: "Month",
  //     startDateMonth: moment(startOfMonth(addMonths(new Date(), -1))).format(
  //       "YYYYMM"
  //     ),
  //     endDateMonth: moment().format("YYYYMM"),
  //     tooltipText: "Month",
  //   },
  //   calenderTab: "1M",
  //   chatTab: "1M",
  //   agentPerformTab: "1M",
  //   loginStatusTab: "1M",
  // });

  const getCategoryWiseData = async () => {
    setState((prev) => {
      return {
        ...prev,
        tableLoading: true,
      };
    });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_COMMON_API}/tkmdashboard/dashboard/view/v1/category-wise-closed-chats`,
        {
          // startDate: dateTime?.startdateValue,
          // endDate: dateTime?.enddateValue,
          startDate: moment(state?.categoryStartDate)?.format("YYYY-MM-DD"),
          endDate: moment(state?.categoryEndDate)?.format("YYYY-MM-DD"),
        }
      );
      if (res?.data?.statusDescription?.statusCode == 200) {
        setState((prev) => {
          return {
            ...prev,
            categoryWiseList: res?.data?.closedChatResponse,
          };
        });
      } else {
        setState((prev) => {
          return {
            ...prev,
            categoryWiseList: [],
          };
        });
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: res?.data?.statusDescription?.statusMessage,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Something went wrong",
      });
    } finally {
      setState((prev) => {
        return {
          ...prev,
          tableLoading: false,
        };
      });
    }
  };
  const getTotalChats = async () => {
    setState((prev) => {
      return {
        ...prev,
        totalChatLoading: true,
      };
    });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_COMMON_API}/tkmdashboard/dashboard/view/v1/totalchats`,
        {
          // startDate: dateTime?.startdateValue,
          // endDate: dateTime?.enddateValue,
          startDate: moment(state?.categoryStartDate)?.format("YYYY-MM-DD"),
          endDate: moment(state?.categoryEndDate)?.format("YYYY-MM-DD"),
        }
      );
      if (res?.data?.statusDescription?.statusCode == 200) {
        setState((prev) => {
          return {
            ...prev,
            totalChat: res?.data?.response,
          };
        });
      } else {
        setState((prev) => {
          return {
            ...prev,
            totalChat: 0,
          };
        });
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: res?.data?.statusDescription?.statusMessage,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Something went wrong",
      });
    } finally {
      setState((prev) => {
        return {
          ...prev,
          totalChatLoading: false,
        };
      });
    }
  };

  useEffect(() => {
    if (state?.categoryStartDate && state?.categoryEndDate) {
      getCategoryWiseData();
      getTotalChats();
    }
  }, [state?.categoryStartDate, state?.categoryEndDate]);

  // useEffect(() => {
  //   getTotalChats();
  // }, [dateTime?.chatCountStartDate]);

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        <div className="home-section home_section p-4 dashboard_wrapper">
          {/* {state?.tabLoading == true ? (
            <>
              <div className="">
                <Box className="d-flex justify-content-center">
                  <Skeleton
                    className="ml-2"
                    variant="rectangular"
                    width={"25%"}
                    height={45}
                  />
                  <Skeleton
                    className="ml-2"
                    variant="rectangular"
                    width={"25%"}
                    height={45}
                  />
                </Box>
              </div>
            </>
          ) : (
            <>
              <div
                className="d-flex justify-content-center mb-3 sticky_sec_cat"
                style={{ position: "sticky", top: "99.97px", zIndex: "9" }}
              >
                <ul
                  class="nav nav-pills dashboard_top_tabs"
                  id="pills-tab"
                  role="tablist"
                >
                  {state?.tabArr?.map((dataa, index) => {
                    return (
                      <li
                        class="nav-item"
                        key={`topChannelLi${dataa?.channel}`}
                        role="presentation"
                      >
                        <Button
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={dataa?.tabName}
                         
                          class={(function () {
                            if (dataa?.tabName == state?.tabState?.tabName) {
                              return `nav-link active`;
                            } else {
                              return `nav-link`;
                            }
                          })()}
                          onClick={() => {
                            setState((prev) => {
                              return {
                                ...prev,
                                tabState: dataa,
                              };
                            });
                          }}
                          // className="nav-link active"
                          id={`pills-home-tab-${index}`}
                          data-bs-target="#pills-home"
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                       
                        >
                          {dataa?.tabName}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )} */}
          {/* <div className="mt-3">
            <TopCards state={state} setState={setState} />
          </div> */}
          <div className="card mb-3">
            <div className="card-header pb-0 p-3 pt-2">
              <div className="row mt-5">
                <div className="col-md-6 my-2">
                  <div className=" bar_card h-100">
                    {/* <div className="row mb-2">
                      <div className="my-aut col-md-6 text-start">
                        <span
                          style={{ backgroundColor: "#007ed8", color: "white" }}
                          className="d-sm-inline ms_2 start_date_time_css"
                        >
                          
                          {dateTime?.startdateValue}
                        </span>
                        <ForwardIcon />
                        <span
                          style={{ backgroundColor: "#007ed8", color: "white" }}
                          className="d-sm-inline mx_2 start_date_time_css"
                        >
                          {dateTime?.enddateValue}
                        </span>
                      </div>

                      <div className="my-aut col-md-6 text-end">
                        <div
                          class="datePickerButtonsDashboard"
                          style={{ cursor: "pointer" }}
                        >
                          {[
                            {
                              name: "1D",
                              startdateValue: moment().format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Daily",
                              tooltipText: "Day",
                            },

                            {
                              name: "1W",
                              startdateValue: moment(
                                addDays(new Date(), -7)
                              ).format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Daily",
                              tooltipText: "Week",
                            },
                            {
                              name: "1M",
                              enddateValue: moment().format("YYYY-MM-DD"),
                              startdateValue: moment(
                                addDays(new Date(), -29)
                              ).format("YYYY-MM-DD"),
                              dateTypee: "Month",
                              startDateMonth: moment(
                                startOfMonth(addMonths(new Date(), -1))
                              ).format("YYYYMM"),
                              endDateMonth: moment().format("YYYYMM"),
                              tooltipText: "Month",
                            },
                            {
                              name: "3M",
                              startdateValue: moment(new Date())
                                .subtract(2, "months")
                                .subtract(29, "days")
                                .format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Monthly",
                              tooltipText: "Months",
                            },
                            {
                              name: "6M",
                              startdateValue: moment(new Date())
                                .subtract(5, "months")
                                .subtract(30, "days")
                                .format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Monthly",
                              tooltipText: "Months",
                            },
                          ].map((data, index) => {
                            return (
                              <a
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={data.tooltipText}
                                onClick={() => {
                                  // setDateTime({
                                  //   ...dateTime,
                                  //   startdateValue: data?.startdateValue,
                                  //   calenderTab: data.name,
                                  // });
                                  setDateTime((prev) => {
                                    return {
                                      ...prev,
                                      startdateValue: data?.startdateValue,
                                      calenderTab: data.name,
                                    };
                                  });
                                }}
                                className={
                                  dateTime?.calenderTab == data.name
                                    ? "active"
                                    : ""
                                }
                              >
                                {" "}
                                {data.name}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div> */}
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              disableFuture
                              label="Start Date"
                              // value={value}
                              value={dayjs(state?.categoryStartDate)}
                              // minDate={startDate}
                              inputFormat="YYYY-MM-DD"
                              //   minDate={substractYears(80)}
                              // maxDate={moment(new Date())}
                              onChange={(newValue) => {
                                console.log(
                                  "date--",
                                  newValue?.$d,
                                  new Date(),
                                  moment(new Date())
                                );
                                setState((prev) => {
                                  return {
                                    ...prev,
                                    categoryStartDate: newValue?.$d,
                                    categoryEndDate: newValue?.$d,
                                  };
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  onKeyDown={onKeyDown}
                                  {...params}
                                  helperText="Date Format(YYYY-MM-DD)"
                                />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>
                      <div className="col-md-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              disableFuture
                              label="End Date"
                              value={dayjs(state?.categoryEndDate)}
                              minDate={dayjs(state?.categoryStartDate)}
                              inputFormat="YYYY-MM-DD"
                              //   minDate={substractYears(80)}
                              // maxDate={moment(new Date())}
                              onChange={(newValue) => {
                                setState((prev) => {
                                  return {
                                    ...prev,
                                    categoryEndDate: newValue?.$d,
                                  };
                                });
                              }}
                              onError={false}
                              renderInput={(params) => (
                                <TextField
                                  onKeyDown={onKeyDown}
                                  error={false}
                                  onError={false}
                                  {...params}
                                  helperText="Date Format(YYYY-MM-DD)"
                                />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>
                    </div>
                    <h5
                      className={
                        state?.totalChatLoading == true
                          ? "d-flex align-items-center text-start"
                          : "text-start"
                      }
                    >
                      Total Chats Count :{" "}
                      {state?.totalChatLoading == true ? (
                        <>
                          {/* <div className="d-flex justify-content-center mt-3"> */}
                          <Skeleton
                            className="ms-2"
                            style={{ display: "inline-block" }}
                            variant="rectangular"
                            width={137}
                            height={30}
                          />
                          {/* </div> */}
                        </>
                      ) : (
                        <>
                          {/* <div className="mt-3"> */}
                          <span>{state?.totalChat ? state?.totalChat : 0}</span>
                          {/* </div> */}
                          {/* <div className="d-flex rounded-pill mx-auto" style={{width:"56px", height:'56px', border:'1px solid #007ed8', padding:"2px"}}><h6 className="m-auto">{state?.totalChat ? state?.totalChat : 0}</h6></div> */}
                        </>
                      )}
                    </h5>

                    {/* {state?.totalChatLoading == true ? (
                      <>
                        <div className="d-flex justify-content-center mt-3">
                          <Skeleton
                            variant="rectangular"
                            width={137}
                            height={30}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-3">
                          <h6>{state?.totalChat ? state?.totalChat : 0}</h6>
                        </div>
                       
                      </>
                    )} */}
                    <h5 className="my-2 mt-3">Category Wise Data</h5>
                    {state?.tableLoading == true ? (
                      <>
                        <Box sx={{ width: "100%" }}>
                          <Skeleton />
                          <Skeleton animation="wave" />
                          <Skeleton animation={false} />
                          <Skeleton />
                          <Skeleton animation="wave" />
                          <Skeleton animation={false} />
                          <Skeleton />
                          <Skeleton animation="wave" />
                        </Box>
                      </>
                    ) : (
                      <>
                        <div
                          className="table-responsive category_table"
                          // style={{ maxHeight: "100px" }}
                        >
                          <table className="table table_width table_btn table-striped table-bordered dataTable table-sm mt- m-0">
                            <thead>
                              <tr>
                                <th className="text-center width_2 update_th_sp">
                                  Category
                                </th>
                                <th className="text-center width_2 update_th_sp">
                                  Actioned
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {state?.categoryWiseList.map((data) => {
                                return (
                                  <>
                                    <tr>
                                      <td>
                                        <div>{data.category}</div>
                                      </td>
                                      <td>
                                        <div>{data.actioned}</div>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                              {/* <tr>
                    <td>
                      <div>Enquiry</div>
                    </td>
                    <td>
                      <div>46</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Vehicle</div>
                    </td>
                    <td>
                      <div>46</div>
                    </td>
                  </tr> */}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className=" bar_card h-100" style={{ height: "182px" }}>
                    <div className="row mb-2">
                      <div className="my-aut col-md-6 text-start">
                        <span
                          style={{ backgroundColor: "#007ed8", color: "white" }}
                          className="d-sm-inline ms_2 start_date_time_css"
                        >
                          {dateTime?.chatCountStartDate}
                        </span>
                        <ForwardIcon />
                        <span
                          style={{ backgroundColor: "#007ed8", color: "white" }}
                          className="d-sm-inline mx_2 start_date_time_css"
                        >
                          {dateTime?.enddateValue}
                        </span>
                      </div>

                      <div className="my-aut col-md-6 text-end">
                        <div
                          class="datePickerButtonsDashboard"
                          style={{ cursor: "pointer" }}
                        >
                          {[
                            {
                              name: "1D",

                              chatCountStartDate: moment().format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Daily",
                              tooltipText: "Day",
                            },

                            {
                              name: "1W",
                              chatCountStartDate: moment(
                                addDays(new Date(), -7)
                              ).format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Daily",
                              tooltipText: "Week",
                            },
                            {
                              name: "1M",
                              enddateValue: moment().format("YYYY-MM-DD"),
                              chatCountStartDate: moment(
                                addDays(new Date(), -29)
                              ).format("YYYY-MM-DD"),
                              dateTypee: "Month",
                              startDateMonth: moment(
                                startOfMonth(addMonths(new Date(), -1))
                              ).format("YYYYMM"),
                              endDateMonth: moment().format("YYYYMM"),
                              tooltipText: "Month",
                            },
                            {
                              name: "3M",
                              chatCountStartDate: moment(new Date())
                                .subtract(2, "months")
                                .subtract(29, "days")
                                .format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Monthly",
                              tooltipText: "Months",
                            },
                            {
                              name: "6M",
                              chatCountStartDate: moment(new Date())
                                .subtract(5, "months")
                                .subtract(30, "days")
                                .format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Monthly",
                              tooltipText: "Months",
                            },
                          ].map((data, index) => {
                            return (
                              <a
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={data.tooltipText}
                                onClick={() => {
                                  // setDateTime({
                                  //   ...dateTime,
                                  //   chatCountStartDate:
                                  //     data?.chatCountStartDate,
                                  //   chatTab: data.name,
                                  // });

                                  setDateTime((prev) => {
                                    return {
                                      ...prev,
                                      chatCountStartDate:
                                        data?.chatCountStartDate,
                                      chatTab: data.name,
                                    };
                                  });
                                }}
                                className={
                                  dateTime?.chatTab == data.name ? "active" : ""
                                }
                              >
                                {" "}
                                {data.name}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div class="col-md-6 my-2">
                  <div class="card  pt-3 min_height bar_card h-100">
                    <div className="row mb-2">
                      <div className="my-aut col-md-6 text-start">
                        <span
                          style={{ backgroundColor: "#007ed8", color: "white" }}
                          className="d-sm-inline ms_2 start_date_time_css"
                        >
                          {moment(new Date())?.format("YYYY-MM-DD")}
                        </span>
                        <ForwardIcon />
                        <span
                          style={{ backgroundColor: "#007ed8", color: "white" }}
                          className="d-sm-inline mx_2 start_date_time_css"
                        >
                          {moment(new Date())?.format("YYYY-MM-DD")}
                        </span>
                      </div>

                      {/* <div className="my-aut col-md-6 text-end">
                        <div
                          class="datePickerButtonsDashboard"
                          style={{ cursor: "pointer" }}
                        >
                          {[
                            {
                              name: "1D",
                              loginStatusStartDate:
                                moment().format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Daily",
                              tooltipText: "Day",
                            },

                            {
                              name: "1W",
                              loginStatusStartDate: moment(
                                addDays(new Date(), -7)
                              ).format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Daily",
                              tooltipText: "Week",
                            },
                            {
                              name: "1M",
                              enddateValue: moment().format("YYYY-MM-DD"),
                              loginStatusStartDate: moment(
                                addDays(new Date(), -29)
                              ).format("YYYY-MM-DD"),
                              dateTypee: "Month",
                              startDateMonth: moment(
                                startOfMonth(addMonths(new Date(), -1))
                              ).format("YYYYMM"),
                              endDateMonth: moment().format("YYYYMM"),
                              tooltipText: "Month",
                            },
                            {
                              name: "3M",
                              loginStatusStartDate: moment(new Date())
                                .subtract(2, "months")
                                .subtract(29, "days")
                                .format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Monthly",
                              tooltipText: "Months",
                            },
                            {
                              name: "6M",
                              loginStatusStartDate: moment(new Date())
                                .subtract(5, "months")
                                .subtract(30, "days")
                                .format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Monthly",
                              tooltipText: "Months",
                            },
                          ].map((data, index) => {
                            return (
                              <a
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={data.tooltipText}
                                onClick={() => {
                                  // setDateTime({
                                  //   ...dateTime,
                                  //   loginStatusStartDate:
                                  //     data?.loginStatusStartDate,
                                  //   loginStatusTab: data.name,
                                  // });
                                  setDateTime((prev) => {
                                    return {
                                      ...prev,
                                      loginStatusStartDate:
                                        data?.loginStatusStartDate,
                                      loginStatusTab: data.name,
                                    };
                                  });
                                }}
                                className={
                                  dateTime?.loginStatusTab == data.name
                                    ? "active"
                                    : ""
                                }
                              >
                                {" "}
                                {data.name}
                              </a>
                            );
                          })}
                        </div>
                      </div> */}
                    </div>

                    <DoughnutGraph state={state} />
                  </div>
                </div>
              </div>

              <div class="row mt-4">
                <div class="col-md-6 my-2">
                  <div class="card bar_card h-100 pt-3">
                    {/* <div className="row mb-2">
                      <div className="my-aut col-md-6 text-start">
                        <span
                          style={{ backgroundColor: "#007ed8", color: "white" }}
                          className="d-sm-inline ms_2 start_date_time_css"
                        >
                          {dateTime?.agentPerformanceStartDate}
                        </span>
                        <ForwardIcon />
                        <span
                          style={{ backgroundColor: "#007ed8", color: "white" }}
                          className="d-sm-inline mx_2 start_date_time_css"
                        >
                          {dateTime?.enddateValue}
                        </span>
                      </div>

                      <div className="my-aut col-md-6 text-end">
                        <div
                          class="datePickerButtonsDashboard"
                          style={{ cursor: "pointer" }}
                        >
                          {[
                            {
                              name: "1D",
                              agentPerformanceStartDate:
                                moment().format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Daily",
                              tooltipText: "Day",
                            },

                            {
                              name: "1W",
                              agentPerformanceStartDate: moment(
                                addDays(new Date(), -7)
                              ).format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Daily",
                              tooltipText: "Week",
                            },
                            {
                              name: "1M",
                              enddateValue: moment().format("YYYY-MM-DD"),
                              agentPerformanceStartDate: moment(
                                addDays(new Date(), -29)
                              ).format("YYYY-MM-DD"),
                              dateTypee: "Month",
                              startDateMonth: moment(
                                startOfMonth(addMonths(new Date(), -1))
                              ).format("YYYYMM"),
                              endDateMonth: moment().format("YYYYMM"),
                              tooltipText: "Month",
                            },
                            {
                              name: "3M",
                              agentPerformanceStartDate: moment(new Date())
                                .subtract(2, "months")
                                .subtract(29, "days")
                                .format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Monthly",
                              tooltipText: "Months",
                            },
                            {
                              name: "6M",
                              agentPerformanceStartDate: moment(new Date())
                                .subtract(5, "months")
                                .subtract(30, "days")
                                .format("YYYY-MM-DD"),
                              enddateValue: moment().format("YYYY-MM-DD"),
                              dateTypee: "Monthly",
                              tooltipText: "Months",
                            },
                          ].map((data, index) => {
                            return (
                              <a
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={data.tooltipText}
                                onClick={() => {
                                  // setDateTime({
                                  //   ...dateTime,
                                  //   agentPerformanceStartDate:
                                  //     data?.agentPerformanceStartDate,
                                  //   agentPerformTab: data.name,
                                  // });
                                  setDateTime((prev) => {
                                    return {
                                      ...prev,
                                      agentPerformanceStartDate:
                                        data?.agentPerformanceStartDate,
                                      agentPerformTab: data.name,
                                    };
                                  });
                                }}
                                className={
                                  dateTime?.agentPerformTab == data.name
                                    ? "active"
                                    : ""
                                }
                              >
                                {" "}
                                {data.name}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div> */}
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              disableFuture
                              label="Start Date"
                              // value={value}
                              value={dayjs(state?.agentStartDate)}
                              // minDate={startDate}
                              inputFormat="YYYY-MM-DD"
                              //   minDate={substractYears(80)}
                              // maxDate={moment(new Date())}
                              onChange={(newValue) => {
                                setState((prev) => {
                                  return {
                                    ...prev,
                                    agentStartDate: newValue?.$d,
                                    agentEndDate: newValue?.$d,
                                  };
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  onKeyDown={onKeyDown}
                                  {...params}
                                  helperText="Date Format(YYYY-MM-DD)"
                                />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>
                      <div className="col-md-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              disableFuture
                              label="End Date"
                              value={dayjs(state?.agentEndDate)}
                              minDate={dayjs(state?.agentStartDate)}
                              inputFormat="YYYY-MM-DD"
                              //   minDate={substractYears(80)}
                              // maxDate={moment(new Date())}
                              onChange={(newValue) => {
                                setState((prev) => {
                                  return {
                                    ...prev,
                                    agentEndDate: newValue?.$d,
                                  };
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  onKeyDown={(e) => e.preventDefault()} // Prevent manual input via keyboard
                                  {...params}
                                  onChange={() => {}} // Prevent manual changes
                                  onInput={(e) => e.preventDefault()} // Block any input events
                                  helperText="Date Format(YYYY-MM-DD)"
                                />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>
                    </div>
                    <BarGraph state={state} />
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
        {/* ---------------------------------------------------------- */}
      </main>
    </div>
  );
};

export default Dashboard;
