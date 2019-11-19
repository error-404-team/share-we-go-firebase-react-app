import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import { dateTime } from '../../../../model/dateTime';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import lightBlue from "@material-ui/core/colors/lightBlue";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: lightBlue.A200,
      },
    },
    // MuiPickersCalendarHeader: {
    //   switchHeader: {
    //     backgroundColor: lightBlue.A200,
    //     color: "white",
    //   },
    // },
    MuiPickersDay: {
      day: {
        color: lightBlue.A700,
      },
      daySelected: {
        backgroundColor: lightBlue["400"],
      },
      dayDisabled: {
        color: lightBlue["100"],
      },
      current: {
        color: lightBlue["900"],
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: lightBlue["400"],
      },
    },
  },
  spacing: 2,
});

export default function CustomDateTimePicker(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(true)

  // const socket = io(`http://localhost:8080/`);

  function handleDateChange(date) {
    setSelectedDate(date);
    console.log(date);
    var d = new Date();

    const days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม ", "เมษายน", "พฤษภาคม ", "มิถุนายน ", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]

    // socket.emit('boarding_time', timer)
    // firebase.auth().onAuthStateChanged((user) => {
    //   post.share.date(user.uid, timer, dateTime)
    // })
    props.db.firestore().collection(`share`).doc(props.isAuth.uid).update({
      date: {
        start_time: {
          value: `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
        },
        end_time: {
          value: `${days[date.getDay()]} ${date.getDate()} ${months[d.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
        }
      }
    }).then(() => {
      console.log('อัพเดต เวลา แล้วนะ 🤗');

    })

    props.db.firestore().collection(`share`).doc(props.isAuth.uid).update({
      date: {
        start_time: {
          value: `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
        },
        end_time: {
          value: `${days[date.getDay()]} ${date.getDate()} ${months[d.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
        }
      }
    }).then(() => {
      console.log('อัพเดต เวลา แล้วนะ 🤗');

    })
  }

  function updateOpen() {
    setOpen(false)
  }

  var h_max = window.innerHeight
  var h = h_max / 2

  return (
    <div style={{ marginTop: h, backgroundColor: props.backgroundColor }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} >
        <Grid
          container justify="space-around">
          <ThemeProvider theme={materialTheme}>
            <KeyboardDateTimePicker
              open={open}
              onAccept={updateOpen}
              allowKeyboardControl={false}
              value={selectedDate}
              onChange={handleDateChange}
              // label="Keyboard with error handler"
              onError={console.log}
              minDate={new Date()}
              format="dd/MM/yyyy hh:mm a"
              ampm={false}

            />
          </ThemeProvider>
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
}

CustomDateTimePicker.propTypes = {
  db: PropTypes.object,
  isUsersPrivate: PropTypes.object,
  backgroundColor: PropTypes.string
}