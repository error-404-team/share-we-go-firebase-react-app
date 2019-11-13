import React from 'react';
import { withRouter } from 'react-router-dom';
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



class History extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            keys: [{ test: 'test' }, { test: 'test' }],
            history: null,
            expanded: true
        }


    }



    updateHistory(data) {
        this.setState({ history: data })
    }

    handleChange = panel => (event, isExpanded) => {
        this.setState({ expanded: isExpanded ? panel : false });
    };

    goBack() {
    
    }

    componentDidMount() {              
        const { isHistory } = useHistory(this.props)
        this.setState({ history: isHistory })

    }

    render() {
        const { history } = this.state;

        if (history !== null) {

            console.log(history);
        }

        return (
            <React.Fragment>
                <CssBaseline />

                <HistoryBar>
                    <IconButton onClick={this.props.history.goBack} style={{ position: "absolute", left: 0 }} >
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
    
                <div style={{ width: '100%', marginTop: '60px' }}>
                    {this.state.history !== null
                        ? (<React.Fragment>
                            {Object.keys(this.state.history).map((key) => (
                                <ExpansionPanel expanded={this.state.expanded} onChange={this.handleChange(`${key}`)}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <Typography style={{
                                            flexBasis: '33.33%',
                                            flexShrink: 0,
                                        }}>เวลา: </Typography>
                                        <Typography >{this.state.history[key].date.start_time.value}</Typography>
                                    </ExpansionPanelSummary>
                                    <div>
                                        <center style={{ backgroundColor: 'darkgray' }}>
                                            <h4 style={{ padding: '10px' }}><CommuteIcon></CommuteIcon>ต้นทาง - ปลายทาง</h4>
                                        </center>
                                        <center>
                                            <b><u>ต้นทาง:</u></b> {this.state.history[key].location.routes[0].legs[0].start_address}
                                            <br></br>
                                            <b><u>ปลายทาง:</u></b> {this.state.history[key].location.routes[0].legs[0].end_address}
                                        </center>
                                        <center style={{ backgroundColor: 'darkgray' }}>
                                            <h4 style={{ padding: '10px' }}>  <AccessTimeIcon></AccessTimeIcon>  เริ่มการแชร์ - ปิดการแชร์</h4>
                                        </center>
                                        <center>
                                            <b><u>เริ่มการแชร์:</u></b> {this.state.history[key].date.start_time.value}
                                            <br></br>
                                            <b><u>ปิดการแชร์:</u></b> {this.state.history[key].date.end_time.value}
                                            <br></br>
                                        </center>
                                        <center style={{ backgroundColor: 'darkgray' }}>
                                            <h4 style={{ padding: '10px' }}><WcIcon></WcIcon>ผู้ร่วมเดินทาง - เพศผู้ร่วมเดินทาง</h4>
                                        </center>
                                        <center>
                                            <b><u>ต้องการผู้ร่วมเดินทางเพิ่ม:</u> </b>{Object.keys(this.state.history[key].member).length}/{this.state.history[key].max_number.value} คน<br />
                                            <b><u>ต้องการร่วมเดินทางกับเพศ:</u> </b> {this.state.history[key].sex.value}
                                        </center>
                                        <br />
                                    </div>
                                </ExpansionPanel>
                            ))}

                        </React.Fragment>)
                        : (<React.Fragment></React.Fragment>)
                    }

                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(History)