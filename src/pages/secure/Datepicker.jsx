import * as React from "react";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { useState } from "react";

export default function Datepicker() {
  const [value, setValue] = React.useState(null);
  const [startDate, setStartDate] = useState("");

  React.useEffect(() => {
    if (value != null) {
      var date = value;

      parentCallback(date?.toISOString());
    }
  }, [value]);

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DesktopDatePicker
          disablePast
          label="Start Date"
          value={value}
          minDate={startDate}
          inputFormat="YYYY-MM-DD"
          //   minDate={substractYears(80)}
          //   maxDate={substractYears(21)}

          onChange={(newValue) => {
            setValue(newValue.$d);
          }}
          renderInput={(params) => (
            <TextField
              onKeyDown={onKeyDown}
              {...params}
              helperText="YYYY-mm-dd"
            />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
}
