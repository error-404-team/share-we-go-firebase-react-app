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
    const [isProfile, setProfile] = useState(null);

    // const { isShare } = useShare(props);

    useEffect(() => {
        if (props.isAuth !== null) {

            props.db.firestore().collection(`share`).doc(props.match.params.id).get().then(function (doc) {
                // let data = (doc.data())
                setReport(doc.data())
            })

            props.db.firestore().collection('users').doc(props.isAuth.uid + '/profile').get().then(function (doc) {

                if (!doc.exists) {
                    props.db.firestore().collection('users').doc(props.isAuth.uid + '/profile').set(props.isAuth.providerData[0])

                    setProfile(props.isAuth.providerData[0])
                } else {
                    setProfile(doc.data())

                }
            });
        }
    });



    const handleClose = () => {
        setOpen(false);
    };

    function handleReset() {


        props.db.database().ref(`status/${props.match.params.id}/owner`).update({
            value: true,
            uid: props.isAuth.uid,
            id: props.isAuth.uid
        })

        props.db.firestore().collection(`share`).doc(props.match.params.id + '/statu').update({
            value: true,
            uid: props.isAuth.uid,
            id: props.match.params.id
        })

        props.db.firestore().collection(`share`).doc(props.match.params.id + '/owner').update({
            id: props.isAuth.uid,
            photoURL: isProfile.photoURL,
            diaplayName: isProfile.diaplayName
        });

        props.db.firestore().collection(`share`).doc(props.match.params.id + '/membe/' + props.isAuth.uid).update({
            share_id: props.match.params.id,
            uid: props.isAuth.uid,
            photoURL: isProfile.photoURL,
            diaplayName: isProfile.diaplayName
        })


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
                    <AlertCheck open={open} onClose={handleClose} db={props.db} isUsersPrivate={props.isUsersPrivate} />
                </React.Fragment>)
                : (<React.Fragment>Loading</React.Fragment>)
            }
        </React.Fragment>
    )
}

Report.propTypes = {
    db: PropTypes.object,
    isAuth: PropTypes.object,
    isLocation: PropTypes.object
}

export default withRouter(Report);