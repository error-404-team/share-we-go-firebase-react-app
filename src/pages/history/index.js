import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import HistoryBar from './components/HistoryBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CommuteIcon from '@material-ui/icons/Commute';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import WcIcon from '@material-ui/icons/Wc';
import { useHistory } from '../../controllers';



function History(props) {

    // const [history, setHistory] = useState(null)
    const [expanded, setExpanded] = useState(true)

    const { isHistory } = useHistory(props)


    // const updateHistory = data => {
    //     setHistory(data)
    // }

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    // useEffect(() => {
    //     setHistory(isHistory)
    // })



    const goBack = () => {
        props.history.push('/')
        window.location.reload()
    }

    return (
        <React.Fragment>
            <CssBaseline />

            <HistoryBar>
                <IconButton onClick={goBack} style={{ position: "absolute", left: 0 }} >
                    <ChevronLeftIcon fontSize="large" />
                </IconButton>
                <div
                    style={{
                        position: 'absolute',
                        left: (window.innerWidth / 2.5),
                    }}
                >
                    <h2>ประวัติ</h2>
                </div>
            </HistoryBar>

            <div style={{ width: '-webkit-fill-available', height: '-webkit-fill-available' }}>
                <div style={{padding: 30}}></div>
                {isHistory !== null
                    ? (<React.Fragment>
                        {Object.keys(isHistory).map((key) => (
                            <ExpansionPanel expanded={expanded === `${key}`} onChange={handleChange(`${key}`)}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography style={{
                                        flexBasis: '33.33%',
                                        flexShrink: 0,
                                    }}>เวลา: </Typography>
                                    <Typography >{isHistory[key].date.start_time.value}</Typography>
                                </ExpansionPanelSummary>
                                <div>
                                    <center style={{ backgroundColor: 'darkgray' }}>
                                        <h4 style={{ padding: '10px' }}><CommuteIcon></CommuteIcon>ต้นทาง - ปลายทาง</h4>
                                    </center>
                                    <center>
                                        <b><u>ต้นทาง:</u></b> {isHistory[key].location.routes[0].legs[0].start_address}
                                        <br></br>
                                        <b><u>ปลายทาง:</u></b> {isHistory[key].location.routes[0].legs[0].end_address}
                                    </center>
                                    <center style={{ backgroundColor: 'darkgray' }}>
                                        <h4 style={{ padding: '10px' }}>  <AccessTimeIcon></AccessTimeIcon>  เริ่มการแชร์ - ปิดการแชร์</h4>
                                    </center>
                                    <center>
                                        <b><u>เริ่มการแชร์:</u></b> {isHistory[key].date.start_time.value}
                                        <br></br>
                                        <b><u>ปิดการแชร์:</u></b> {isHistory[key].date.end_time.value}
                                        <br></br>
                                    </center>
                                    <center style={{ backgroundColor: 'darkgray' }}>
                                        <h4 style={{ padding: '10px' }}><WcIcon></WcIcon>ผู้ร่วมเดินทาง - เพศผู้ร่วมเดินทาง</h4>
                                    </center>
                                    <center>
                                        <b><u>ต้องการผู้ร่วมเดินทางเพิ่ม:</u> </b>{Object.keys(isHistory[key].member).length}/{isHistory[key].max_number.value} คน<br />
                                        <b><u>ต้องการร่วมเดินทางกับเพศ:</u> </b> {isHistory[key].sex.value}
                                    </center>
                                    <br />
                                </div>
                            </ExpansionPanel>
                        ))}

                    </React.Fragment>)
                    : (<React.Fragment>Loading</React.Fragment>)
                }

            </div>
        </React.Fragment>
    );
}

History.propTypes = {
    db: PropTypes.object,
    isUsersPrivate: PropTypes.object,
    isLocation: PropTypes.object,
}

export default withRouter(History)