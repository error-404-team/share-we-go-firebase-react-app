import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CommuteIcon from '@material-ui/icons/Commute';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import AlertCheck from './components/AlertCheck';
import { useProfile } from '../../controllers';
import { dateTime } from '../../model/dateTime';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from 'react-router-dom';

function Report(props) {

    const [open, setOpen] = useState(false);
    const [isReport, setReport] = useState(null);
    const { isProfile } = useProfile(props);
    // const { isShare } = useShare(props);

    useEffect(() => {
        async function fetchData() {
            if (props.isUsersPrivate !== null) {
                let path = `share/${props.match.params.id}`;

                const unsubscribe = await props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
                    let data = (snapshot.val())

                    setReport(data)



                })
                return unsubscribe;
            }
        }
        fetchData();
    });



    const handleClose = () => {
        setOpen(false);
    };

    function handleReset() {
        let path_status_share = `status/${props.match.params.id}/share`
        let path_status_share_log = `status/${props.match.params.id}/share/_log`
        let path_status_owner = `status/${props.match.params.id}/owner`
        let path_status_owner_log = `status/${props.match.params.id}/owner/_log`
        let path_share_owner = `share/${props.match.params.id}/owner`
        let path_share_owner_log = `share/${props.match.params.id}/owner/_log`
        let path_share_member = `share/${props.match.params.id}/member`
        let path_share_member_log = `share/${props.match.params.id}/member/${props.isUsersPrivate.uid}/_log`

        let data_status_share = { value: "true", uid: props.isUsersPrivate.uid, id: props.isUsersPrivate.uid }
        let data_status_owner = { value: "true", uid: props.isUsersPrivate.uid, id: props.isUsersPrivate.uid }
        let data_share_owner = { id: props.isUsersPrivate.uid, profile: isProfile }
        let data_share_member = { [props.isUsersPrivate.uid]: { share_id: props.isUsersPrivate.uid, uid: props.isUsersPrivate.uid, profile: isProfile } }

        props.db.database().ref(`${path_status_share}`).update(data_status_share)
        props.db.database().ref(`${path_status_share_log}`).push({ share: data_status_share, date: dateTime })

        props.db.database().ref(`${path_status_owner}`).update(data_status_owner)
        props.db.database().ref(`${path_status_owner_log}`).push({ owner: data_status_owner, date: dateTime })

        props.db.database().ref(`${path_share_owner}`).update(data_share_owner)
        props.db.database().ref(`${path_share_owner_log}`).push({ owner: data_share_owner, date: dateTime })

        props.db.database().ref(`${path_share_member}`).update(data_share_member)
        props.db.database().ref(`${path_share_member_log}`).push({ member: data_share_member, date: dateTime })


        setOpen(true)
        //    props.history.goBack()
    }

    return (
        <React.Fragment>
            {isReport !== null
                ? (<React.Fragment>
                    <div style={{
                        position: 'absolute',
                        top: ((window.innerHeight - 400) / 2.5),
                        left: ((window.innerWidth - 370) / 2),
                        width: 370,
                        heeight: 400,
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'

                    }}>
                        <center>
                            <div bgcolor="99FF99" shadow="5">
                                <h2>สร้างการแชร์เส้นทางเสร็จสิ้น <CheckCircleIcon></CheckCircleIcon></h2>
                                <div style={{
                                    height: '1px',
                                    width: '-webkit-fill-available',
                                    backgroundColor: 'whitesmoke'
                                }} />
                            </div>
                        </center>
                        <br />
                        <div bgcolor="#DCDCDC">
                            <center>
                                {/* <hr border="5" shadow="5" /> */}

                                <div style={{ marginBottom: 20 }}>
                                    <div>
                                        <h2><CommuteIcon align></CommuteIcon> ต้นทาง - ปลายทาง</h2>
                                    </div>
                                    <b>ต้นทาง:</b> {isReport.location.routes[0].legs[0].start_address}
                                    <br />
                                    <b>ปลายทาง:</b> {isReport.location.routes[0].legs[0].end_address}
                                    <br />
                                    <h2><RecentActorsIcon></RecentActorsIcon> ข้อมูลการแชร์</h2>
                                    <b>เริ่มการแชร์:</b> {isReport.date.end_time.value}
                                    <br />
                                    <b>ปิดการแชร์:</b> {isReport.date.start_time.value}
                                    <br />
                                    <b>ต้องการผู้ร่วมเดินทางเพิ่ม:</b> {isReport.max_number.value} คน
                                    <br />
                                    <b>ต้องการร่วมเดินทางกับเพศ: {isReport.sex.value}</b>
                                    {/* <hr border="5" shadow="5" /> */}
                                </div>
                            </center>
                        </div>

                    </div>
                    <div style={{
                        position: "fixed",
                        bottom: '25px',
                        width: '-webkit-fill-available'
                    }}>
                        <center >
                            <Button variant="contained" onClick={handleReset} style={{ backgroundColor: '#274D7D', color: "aliceblue" }} >เปิดแชร์</Button>
                        </center>
                    </div>
                    <AlertCheck open={open} onClose={handleClose} />
                </React.Fragment>)
                : (<React.Fragment>Loading</React.Fragment>)
            }
        </React.Fragment>
    )
}

Report.propTypes = {
    db: PropTypes.object,
    isUsersPrivate: PropTypes.object,
    isLocation: PropTypes.object
}

export default withRouter(Report);