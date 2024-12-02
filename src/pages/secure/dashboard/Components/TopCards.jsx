import { Box, Icon, IconButton, Skeleton } from "@mui/material";
import moment from "moment";

import React, { useState } from "react";

export default function TopCards({ state, setState }) {
  const tabList = [
    {
      name: "Today",
      startDate: moment(new Date())?.format("YYYY-MM-DD"),
      endDate: moment(new Date())?.format("YYYY-MM-DD"),
    },
    {
      name: "Yesterday",
      startDate: moment(new Date())?.subtract(1, "day").format("YYYY-MM-DD"),
      endDate: moment(new Date())?.subtract(1, "day").format("YYYY-MM-DD"),
    },
    {
      name: "Current Month",
      startDate: moment()?.startOf("month")?.format("YYYY-MM-DD"),
      endDate: moment(new Date())?.format("YYYY-MM-DD"),
    },
    {
      name: "Previous Month",
      startDate: moment()
        .subtract(1, "months")
        .startOf("month")
        ?.format("YYYY-MM-DD"),
      endDate: moment()
        .subtract(1, "months")
        .endOf("month")
        ?.format("YYYY-MM-DD"),
    },
  ];
  return (
    <>
      <ul className="nav nav-tabs mt-3 mb-0" id="myTab" role="tablist">
        {tabList?.map((val) => {
          return (
            <>
              <li className="nav-item" role="presentation">
                <button
                  className={
                    state?.tabStatus?.name == val?.name
                      ? `nav-link ms-4 text-capitalize position-relative active`
                      : `nav-link ms-4 text-capitalize position-relative `
                  }
                  // className="nav-link ms-4 text-capitalize position-relative active"
                  id={`${val.name}-tab`}
                  data-bs-toggle="tab"
                  data-bs-target={`#${val.name}`}
                  type="button"
                  role="tab"
                  aria-controls={`${val.name}`}
                  aria-selected="false"
                  onClick={() => {
                    setState((prev) => {
                      return {
                        ...prev,
                        tabStatus: val,
                      };
                    });
                  }}
                >
                  {val.name}
                </button>
              </li>
            </>
          );
        })}
        {/* <li className="nav-item" role="presentation">
          <button
            className={
              state?.tabStatus == 'Today'
                ? `nav-link ms-4 text-capitalize position-relative active`
                : `nav-link ms-4 text-capitalize position-relative `
            }
            // className="nav-link ms-4 text-capitalize position-relative active"
            id="SenderMasking-tab"
            data-bs-toggle="tab"
            data-bs-target="#SenderMasking"
            type="button"
            role="tab"
            aria-controls="SenderMasking"
            aria-selected="false"
          >
            today
          </button>
        </li>

        <li className="nav-item" role="presentation">
          <button
            // className={
            //   dataTime.tabs == 4
            //     ? `nav-link ms-4 text-capitalize position-relative active`
            //     : `nav-link ms-4 text-capitalize position-relative `
            // }
            className="nav-link ms-4 text-capitalize position-relative"
            id="SenderMasking-tab"
            data-bs-toggle="tab"
            data-bs-target="#SenderMasking"
            type="button"
            role="tab"
            aria-controls="SenderMasking"
            aria-selected="false"
          >
            Yesterday
          </button>
        </li>

        <li className="nav-item" role="presentation">
          <button
            // className={
            //   dataTime.tabs == 1
            //     ? `nav-link ms-4 text-capitalize position-relative active`
            //     : `nav-link ms-4 text-capitalize position-relative `
            // }
            className="nav-link ms-4 text-capitalize position-relative"
            id="SenderMasking-tab"
            data-bs-toggle="tab"
            data-bs-target="#SenderMasking"
            type="button"
            role="tab"
            aria-controls="SenderMasking"
            aria-selected="false"
          >
            Current Month
          </button>
        </li>

        <li className="nav-item" role="presentation">
          <button
            // className={
            //   dataTime.tabs == 0
            //     ? `nav-link ms-4 text-capitalize position-relative active`
            //     : `nav-link ms-4 text-capitalize position-relative `
            // }
            className="nav-link ms-4 text-capitalize position-relative"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#AccountDetails"
            type="button"
            role="tab"
            aria-controls="AccountDetails"
            aria-selected="true"
          >
            Previous Month
          </button>
        </li> */}
      </ul>

      <div className="row dashboard_cards_row text-center my-3" id="card_8">
        {state?.cardSkelton ? (
          <>
            {Array(7)
              .fill(1)
              ?.map(() => {
                return (
                  <>
                    <div className="col-lg-2 col-sm-3 col-4 ro my- mx-0 skeleton_wrapper">
                      <div className="cardParent">
                        <Box>
                          <Skeleton
                            variant="rectangular"
                            width={"100%"}
                            height={135}
                          />
                        </Box>
                      </div>
                    </div>
                  </>
                );
              })}
          </>
        ) : (
          <>
            {state?.cardList?.length === 0 ? (
              <>
                {Array(7)
                  .fill(1)
                  ?.map(() => {
                    return (
                      <div class="col-lg-2 col-sm-3 col-4 cardParent my-3">
                        <div class="card d-flex justify-content-center align-items-center">
                          <div class="d-flex justify-content-center align-items-center">
                            <h4>No Data</h4>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </>
            ) : (
              <>
                {state?.cardList?.map((val) => {
                  if (val?.status) {
                    return (
                      <>
                        <div class="col-lg-2 col-sm-3 col-4 cardParent my-3">
                          <div class={`card card_1`}>
                            <div class="d-flex justify-content-between align-items-start">
                              <div
                                class="div_i8"
                                style={{ backgroundColor: "#b68a35" }}
                              >
                                <Icon component="i">{val.icon} </Icon>
                              </div>
                              <div title={val?.title}>
                                <h3>
                                  {" "}
                                  {val?.record_count ? val?.record_count : 0}
                                </h3>
                                <span>{val?.title}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  }
                })}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
