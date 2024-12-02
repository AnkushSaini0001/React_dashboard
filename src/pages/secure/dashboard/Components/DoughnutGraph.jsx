import ReactDOM from "react-dom";
import React, { useState } from "react";
import {
  Doughnut,
  Chart as DoughnutChart,
  getDatasetAtEvent,
  getElementAtEvent,
} from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import { useRef } from "react";
import { useEffect } from "react";
import { Backdrop, Button, Icon, Skeleton } from "@mui/material";

// import "chartjs-plugin-labels";
import { Chart } from "chart.js";
import Swal from "sweetalert2";

import CancelIcon from "@mui/icons-material/Cancel";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import moment from "moment";

Chart.register(ChartDataLabels);

export default function DoughnutGraph() {
  const chartRef = useRef(null);

  const [showGraph, setShowGraph] = useState(true);
  const [data, setData] = React.useState(null);
  const [open, setOpen] = useState(true);

  const getGraphData = async (e) => {
    try {
      setOpen(true);
      const res = await axios.post(
        `${process.env.REACT_APP_COMMON_API}/tkmdashboard/dashboard/view/v1/login-status`,
        {
          endDateTime: moment(new Date())?.format("YYYY-MM-DD"),

          // startDateTime: `${dateTime?.loginStatusStartDate}`,
          startDateTime: moment(new Date())?.format("YYYY-MM-DD"),
        }
      );

      if (res.data.statusDescription.statusCode == 200) {
        if (res.data?.cardStatus != undefined && res.data?.cardStatus != null) {
          setShowGraph(res.data?.cardStatus ? res.data?.cardStatus : false);
        }
        // if (res.data?.cardStatus != undefined && res.data?.cardStatus != null) {
        //   setShowCard(res.data?.cardStatus ? res.data?.cardStatus : false);
        // }

        let varrr = false;
        res.data["labelObject"] = [];
        for (
          let index = 0;
          index < res.data?.senderIdTemplatePieChart?.length;
          index++
        ) {
          let obj = {};
          obj.label = res.data?.senderIdTemplatePieChart?.[index]?.title;
          obj.clicked = false;
          obj.disable = true;

          obj.icon = res.data?.senderIdTemplatePieChart?.[index]?.icon;

          if (
            res.data?.senderIdTemplatePieChart?.[index]?.record_count != 0 &&
            res.data?.senderIdTemplatePieChart?.[index]?.record_count != null
          ) {
            varrr = true;
            obj.disable = false;
          }
          obj = { ...res?.data?.senderIdTemplatePieChart?.[index], ...obj };
          res.data["labelObject"].push(obj);
        }

        if (!varrr) {
          setData([]);
        } else {
          setData({
            labelObject: res?.data?.labelObject,
            labels: res?.data?.idDataResponse?.label,
            // label: "new",
            datasets: [
              {
                backgroundColor: res.data?.senderIdTemplatePieChart?.map(
                  (dataaa) => dataaa.colour
                ),

                borderColor: "white",
                // borderColor:,
                borderWidth: 1,

                data: res.data?.senderIdTemplatePieChart?.map(
                  (dataaa) => dataaa.record_count
                ),
                height: "221px",
                tension: 0.1,
                borderWidth: 5,
              },
            ],
          });
        }

        setOpen(false);
      } else {
        setData([]);
        setOpen(false);
      }
    } catch (error) {
      setData([]);
      setOpen(false);
      // console.log(error);
      // Swal.fire({
      //   icon: "error",
      //   title: t("Oops"),
      //   text: t("Something went wrong"),
      //   // footer: '<a href="">Why do I have this issue?</a>'
      // });
    }
  };

  useEffect(() => {
    getGraphData();
  }, []);

  const options = {
    responsive: true,
    // legend: {
    //   display: false,
    // },
    // maintainAspectRatio: false,
    scale: {
      pointLabels: {
        fontStyle: "bold",
        textAlign: "left",
        alignItems: "left",
      },
    },
    type: "Doughnut",
    plugins: {
      legend: {
        display: false,
      },

      datalabels: {
        display: true,
        color: "white",
        weight: "bolder",

        font: {
          size: "20px",
        },
        align: "center",
        height: "100%",

        formatter: function (value, name) {
          if (value != 0) return "\n" + value;
          else return "";
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
  };

  const printDatasetAtEvent = (dataset) => {
    if (!dataset.length) return;

    const datasetIndex = dataset[0].datasetIndex;

    // console.log(data.datasets[datasetIndex].status);

    return data.datasets[datasetIndex].status;
  };

  const printElementAtEvent = (element) => {
    if (!element.length) return;

    const { datasetIndex, index } = element?.[0];

    // console.log(data.labels[index], data.datasets[datasetIndex].data[index]);

    return data?.labelObject?.[index]?.label;
  };

  const printElementsAtEvent = (elements) => {
    if (!elements.length) return;

    // console.log(elements.length);
    return elements.length;
  };

  const handleClick = (event) => {
    if (
      data?.labelObject?.find(
        (val) =>
          val?.title ==
          printElementAtEvent(getElementAtEvent(chartRef.current, event))
      )?.action == 1
    ) {
      let stattus = data?.labelObject?.find((labelObjecttt) => {
        return (
          labelObjecttt?.label?.toLowerCase() ===
          printElementAtEvent(
            getElementAtEvent(chartRef.current, event)
          )?.toLowerCase()
        );
      })
        ? data?.labelObject?.find((labelObjecttt) => {
            return (
              labelObjecttt?.label?.toLowerCase() ===
              printElementAtEvent(
                getElementAtEvent(chartRef.current, event)
              )?.toLowerCase()
            );
          })?.status
        : "";

      const chart = chartRef.current;
      if (chart) {
        const elements = chart.getElementsAtEventForMode(
          event,
          "nearest",
          { intersect: true },
          true
        );

        if (elements.length > 0) {
          // alert("inside");
          const { datasetIndex } = elements[0];
          const datasetLabel = chart.data.datasets[datasetIndex].label;
          console.log("Dataset Label at Clicked Point:", datasetLabel);
          // localStorage.setItem("CampaignGraphType", datasetLabel);
          console.log(
            "904jnj",
            data?.labelObject?.find(
              (val) =>
                val?.title ==
                printElementAtEvent(getElementAtEvent(chartRef.current, event))
            )?.action,
            printElementAtEvent(getElementAtEvent(chartRef.current, event))
          );
          // setGraphLable(datasetLabel);
        }
      }

      // history?.push("/dashboard/Dashboardreports");
    }
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;
      const initialValue = 0;
      const sumWithInitial = data?.datasets?.[0]?.data?.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue
      );

      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bolder 20px Comic Sans MS";
      // ctx.fillStyle = "red";
      ctx.fillText(
        `Total :${sumWithInitial}`,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
      );
    },
  };
  const handleButtonClick = async (index) => {
    chartRef.current.legend.chart.toggleDataVisibility(index);
    // chartRef.current.legend.chart.toggleDataVisibility(
    //   chartRef.current.legend.legendItems[index].index
    // );
    // chartRef.current.update();

    const dataaa = { ...data };
    console.log("toyota--", dataaa);

    dataaa.labelObject[index].clicked = !dataaa.labelObject[index].clicked;

    setData(dataaa);
  };

  return (
    <>
      {showGraph ? (
        <>
          <div class="row mt-2 mb-2">
            <div class="col-md-12">
              <h5 class="super">Login Status</h5>
            </div>
          </div>

          <div class="border_btm"></div>
          {!open && data ? (
            <>
              {data.length == 0 ? (
                <div
                  className="d-flex h-100 p-3"
                  style={{ minHeight: "291px" }}
                >
                  <div className="m-auto text-center">
                    <h3>No Data</h3>
                    <br />
                    {/* <img
                    style={{ width: "68px", maxWidth: "100%" }}
                    src={CancelImg}
                    alt=""
                    srcset=""
                  /> */}
                  </div>
                </div>
              ) : (
                <>
                  <div className="d-flex flex-wrap justify-content-center my-2">
                    {data?.labelObject?.map((dataaa, index) => {
                      return (
                        <div>
                          <Button
                            className="m-1 me-"
                            size="small"
                            disabled={dataaa.disable}
                            sx={{
                              borderRadius: 2,
                              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                              backgroundColor: !dataaa?.clicked
                                ? data?.datasets?.[0]?.backgroundColor?.[index]
                                : "grey",
                              color: "white",
                              textDecorationColor: "black",
                              textDecoration: dataaa?.clicked
                                ? "line-through"
                                : "none",
                              color: "white",
                              ":hover": {
                                bgcolor: !dataaa?.clicked
                                  ? data?.datasets?.[0]?.backgroundColor?.[
                                      index
                                    ]
                                  : "grey", // theme.palette.primary.main
                                color: "white",
                                textDecoration: dataaa?.clicked
                                  ? "line-through"
                                  : "none",
                              },
                            }}
                            variant="contained"
                            startIcon={
                              dataaa.icon ? (
                                <Icon component="i">{dataaa.icon}</Icon>
                              ) : (
                                <CancelIcon />
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
                  <div className="chart_div">
                    <DoughnutChart
                      type="doughnut"
                      ref={chartRef}
                      data={data}
                      // height={null}
                      // width={null}
                      height={400} // Set the height in pixels
                      width={400}
                      options={options}
                      plugins={[textCenter]}
                      onClick={(e) => {
                        // if(dataaa?.action == 1){
                        handleClick(e);
                        // }
                      }}
                      style={{ width: "300px", height: "300px" }}
                    />
                  </div>
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
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </>
          )}
        </>
      ) : (
        <div className="d-flex h-100 p-3" style={{ minHeight: "291px" }}>
          <div className="m-auto text-center"></div>
        </div>
      )}
    </>
  );
}
