import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Bar,
  Chart,
  getElementsAtEvent,
  getDatasetAtEvent,
  getElementAtEvent,
} from "react-chartjs-2";

import Swal from "sweetalert2";

import {
  Button,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import { common_axios } from "../../../../App";
import moment from "moment";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import axios from "axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
  // zoomPlugin
);

export function BarGraph({ state }) {
  const chartRef = useRef();

  const [data, setData] = useState(null);
  const [open, setOpen] = useState(true);
  const [showGraph, setShowGraph] = useState(true);
  console.log("da--", data);

  const getBarData = async () => {
    const payload = {
      // startDate: `${dateTime?.agentPerformanceStartDate}`,
      // endDate: `${dateTime?.enddateValue}`,
      startDate: moment(state?.agentStartDate)?.format("YYYY-MM-DD"),
      endDate: moment(state?.agentEndDate)?.format("YYYY-MM-DD"),
    };
    setData([]);
    setOpen(true);
    setShowGraph(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_COMMON_API}/tkmdashboard/dashboard/view/v1/active-closed-chats`,
        payload
      );
      if (res.data.status.statusCode == 200) {
        if (res.data?.cardStatus != undefined && res.data?.cardStatus != null) {
          setShowGraph(res.data?.cardStatus ? res.data?.cardStatus : false);
        }

        if (res.data?.chatRecords?.length == 0 || !res.data?.chatRecords) {
          setData([]);
        } else {
          let arrr = [];

          for (let index = 0; index < res.data?.chatRecords?.length; index++) {
            let element = res.data?.chatRecords?.[index];

            res.data.chatRecords[index]["backgroundColor"] =
              res.data.chatRecords[index]?.color;
            res.data.chatRecords[index]["borderColor"] =
              res.data.chatRecords[index]?.color;
            res.data.chatRecords[index]["icon"] = res.data.chatRecords[index]
              ?.icon
              ? res.data.chatRecords[index]?.icon
              : "thumb_up_icon";

            for (let i = 0; i < element?.data?.length; i++) {
              let element1 = element?.data?.[i];
              element["stack"] = `Stack ${index}`;
              if (element1 != null && element1 != 0) {
                arrr.push(element);
                break;
              }
            }
          }

          if (arrr?.length > 0) {
            setData({
              // labels: res?.data?.xaxisLabelDate,
              labels: res?.data?.agents,
              labelsName: res?.data?.agents,
              // labelsName: res?.data?.xaxisLabelDate,
              labelsNumber: res?.data?.xaxisLabels,
              datasets: arrr,
            });
          } else {
            setData([]);
          }
        }
      } else {
        // Swal.fire({
        //   title: "Error!",
        //   text: res?.data?.statusDescription?.statusMessage,
        //   icon: "error",
        //   confirmButtonText: "OK",
        // });
      }
    } catch (error) {
      setOpen(false);
    } finally {
      setOpen(false);
    }
  };

  const options = {
    //   width: 839,
    // plugins: {
    //   title: {
    //     display: true,
    //     text: "User Management",
    //     legend: {
    //       position: "none",
    //       display: false,
    //     },
    //   },

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (xDatapoint) => {
            if (isNaN(xDatapoint?.[0].label)) {
              return xDatapoint?.[0].label;
            } else {
              // console.log({ xDatapoint });
              // var dateObj = new Date();
              // var month1 = dateObj.getUTCMonth() + 1; //months from 1-12
              // var year = dateObj.getUTCFullYear();

              // const newdate = xDatapoint?.[0].label + "/" + month1 + "/" + year;

              // return newdate;

              return data?.labelsName?.[xDatapoint?.[0]?.dataIndex];
            }
          },
          // label: (yDatapoint) => {
          //   console.log({ yDatapoint }); // All list shown in color
          //   return "22";
          // },
        },
      },
      datalabels: {
        display: true,
        color: "transparent",
        align: "center",
        padding: {
          right: 2,
        },
        labels: {
          padding: { top: 10 },
          title: {
            font: {
              weight: "bold",
            },
          },
          value: {
            color: "transparent",
          },
        },
        formatter: function (value) {
          return "\n" + value;
        },
      },
    },

    onHover: (event, activeElements) => {
      // console.log({ activeElements });
      if (activeElements?.length > 0) {
        event.native.target.style.cursor = "pointer";
      } else {
        event.native.target.style.cursor = "auto";
      }
    },

    hover: {
      onHover: function (event, chartElement) {
        event.native.target.style.cursor = chartElement[0]
          ? "pointer"
          : "default";
        event.target.style.cursor = chartElement[0] ? "pointer" : "default";
      },
    },

    legend: {
      display: false,
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
        maxTicksLimit: 11,
        title: {
          display: true,
          text: `<---- Agents---->`,
          font: {
            family: "Poppins, sans-serif",
            size: 20,
            weight: "bolder",
            lineHeight: 1.2,
          },
        },
      },
      // y: {
      //   stacked: true,
      // },
      y: {
        ticks: {
          min: 0,
          max: 1,
          stepSize: 1,
          fontSize: 20,
        },
        title: {
          display: true,
          text: `<----Count---->`,
          // color: "#911",
          font: {
            family: "Poppins, sans-serif",
            size: 20,
            weight: "bolder",
            lineHeight: 1.2,
          },
        },
      },
    },
  };

  useEffect(() => {
    getBarData();
  }, [state?.agentEndDate, state?.agentStartDate]);

  const printDatasetAtEvent = (dataset) => {
    if (!dataset.length) return;

    const datasetIndex = dataset[0].datasetIndex;

    // console.log(data.datasets[datasetIndex].label);

    return data.datasets[datasetIndex].label;
  };

  const printElementAtEvent = (element) => {
    if (!element.length) return;

    const { datasetIndex, index } = element[0];

    // console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
    return data.labels[index];
  };

  const printElementIndexAtEvent = (element) => {
    if (!element.length) return;

    const { datasetIndex, index } = element[0];

    return [index];
  };

  const printElementsAtEvent = (elements) => {
    if (!elements.length) return;

    // console.log(elements.length);
    return elements.length;
  };

  const printIdentity = (dataset) => {
    if (!dataset.length) return;

    const datasetIndex = dataset?.[0]?.datasetIndex;

    // console.log(data.datasets[datasetIndex].status);

    return data?.datasets?.[datasetIndex]?.identity;
  };

  const handleClick = (event) => {
    var dateObj = new Date();
    var month1 = dateObj.getUTCMonth() + 1; //months from 1-12
    var year = dateObj.getUTCFullYear();
    const newdate =
      year +
      "-" +
      month1 +
      "-" +
      printElementAtEvent(getElementAtEvent(chartRef.current, event));

    const chart = chartRef.current;
    if (chart) {
      const elements = chart.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        true
      );
    }

    // if (printElementAtEvent(getElementAtEvent(chartRef.current, event))) {
    //   if (value === "Daily") {
    //     // alert("hishsiqppihnkl");
    //     localStorage?.setItem(
    //       "dstQueCode1",
    //       `${printElementAtEvent(
    //         getElementAtEvent(chartRef.current, event)
    //       )},${printDatasetAtEvent(
    //         getDatasetAtEvent(chartRef.current, event)
    //       )},${value},${printElementAtEvent(
    //         getElementAtEvent(chartRef.current, event)
    //       )},${printIdentity(getDatasetAtEvent(chartRef.current, event))},Bar`
    //     );
    //     dispatch(
    //       setTimeSeries1({
    //         end: printElementAtEvent(
    //           getElementAtEvent(chartRef.current, event)
    //         ),
    //         start: printElementAtEvent(
    //           getElementAtEvent(chartRef.current, event)
    //         ),
    //         dateType: value,
    //         approveType:
    //           printDatasetAtEvent(getDatasetAtEvent(chartRef.current, event)) ==
    //           5
    //             ? "Stopped"
    //             : "Completed",
    //       })
    //     );
    //   } else {
    //     const endDate = moment(
    //       moment().month(
    //         printElementAtEvent(getElementAtEvent(chartRef.current, event))
    //       )
    //     )
    //       .endOf("month")
    //       .format("YYYY-MM-DD");

    //     const startDate = moment(
    //       moment().month(
    //         printElementAtEvent(getElementAtEvent(chartRef.current, event))
    //       )
    //     )
    //       .startOf("month")
    //       .format("YYYY-MM-DD");

    //     localStorage?.setItem(
    //       "dstQueCode1",
    //       `${startDate},${printDatasetAtEvent(
    //         getDatasetAtEvent(chartRef.current, event)
    //       )},${value},${endDate},${printIdentity(
    //         getDatasetAtEvent(chartRef.current, event)
    //       )},Bar`
    //     );

    //     dispatch(
    //       setTimeSeries1({
    //         end: `${endDate}`,
    //         start: `${startDate}`,
    //         dateType: "Daily",
    //         approveType:
    //           printDatasetAtEvent(getDatasetAtEvent(chartRef.current, event)) ==
    //           5
    //             ? "Stopped"
    //             : "Completed",
    //       })
    //     );
    //   }

    // }
  };

  // <div className="table-responsive">

  const handleButtonClick = (index) => {
    // console.log(chartRef.current.data.dataset);
    let dataaa = [...data?.datasets];
    console.log("dataa--", dataaa);
    dataaa[index].clicked = !dataaa[index].clicked;
    dataaa[index].hidden = !dataaa[index].hidden;

    setData({
      ...data,
      datasets: dataaa,
    });
    chartRef.current.data.datasets[index].hidden =
      !chartRef.current.data.datasets[index].hidden;
    chartRef.current.update();
  };
  return (
    <>
      {showGraph ? (
        <>
          <div class="row mb-3">
            <div class="col-12">
              {/* <h6 class="user">User account vs spam manager</h6> */}
              <h5 class="user text-center" style={{ color: "grey" }}>
                Agent Performance
              </h5>
            </div>
          </div>
          <div class="border_btm"></div>
          {!open && data ? (
            <>
              {data.length == 0 ? (
                <div
                  className="d-flex h-100 p-3"
                  style={{ minHeight: "375px" }}
                >
                  <div className="m-auto text-center">
                    <h3>No Data</h3>
                    <br />
                  </div>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-center my-2">
                    {data?.datasets?.map((dataaa, index) => {
                      return (
                        <div className="mr-3">
                          <Button
                            className="me- ms-3"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                              backgroundColor: chartRef?.current?.data
                                ?.datasets?.[index]?.hidden
                                ? "grey"
                                : dataaa.backgroundColor,
                              // backgroundColor: "red",
                              color: "white",
                              textDecorationColor: "black",
                              textDecoration: chartRef?.current?.data
                                ?.datasets?.[index]?.hidden
                                ? "line-through"
                                : "none",
                              color: "white",
                              ":hover": {
                                bgcolor: chartRef?.current?.data?.datasets?.[
                                  index
                                ]?.hidden
                                  ? "grey"
                                  : dataaa.backgroundColor, // theme.palette.primary.main
                                color: "white",
                                textDecoration: chartRef?.current?.data
                                  ?.datasets?.[index]?.hidden
                                  ? "line-through"
                                  : "none",
                              },
                            }}
                            variant="contained"
                            startIcon={
                              dataaa.icon ? (
                                <Icon component="i">{dataaa.icon}</Icon>
                              ) : (
                                <ThumbUpIcon />
                              )
                            }
                            onClick={() => {
                              handleButtonClick(index);
                            }}
                          >
                            {dataaa?.label}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <Chart
                    type="bar"
                    ref={chartRef}
                    options={options}
                    data={data}
                    onClick={handleClick}
                    onHover={(event, chartElement) => {
                      event.target.style.cursor = chartElement[0]
                        ? "pointer"
                        : "default";
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Skeleton animation="wave" className="mt-3" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </>
          )}
        </>
      ) : (
        <div className="d-flex h-100 p-3" style={{ minHeight: "375px" }}>
          <div className="m-auto text-center"></div>
        </div>
      )}
    </>
  );
  // </div>
}
