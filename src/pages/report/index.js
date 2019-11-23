import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CommuteIcon from '@material-ui/icons/Commute';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import AlertCheck from './components/AlertCheck';
// import { useProfile } from '../../controllers';
import { dateTime } from '../../model/dateTime';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from 'react-router-dom';

function useProfile(props) {

    // console.time('ฉันคาดว่า 🤔 function useProfile ใช้เวลาในการทำงานไป');

    const [updateProfile, setState] = useState({
        isProfile: null
    })

    useEffect(() => {

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile ใช้เวลาในการทำงานไป');

        async function update() {

            // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile => function update ใช้เวลาในการทำงานไป');

            if (props.isAuth !== null) {

                const unsubscribe = await props.db.firestore().collection('users').doc(props.isAuth.uid).get().then(function (doc) {

                    if (doc.exists) {

                        // console.log("Document data:", doc.data());

                        setState({ isProfile: doc.data().profile })

                    } else {
                        // doc.data() will be undefined in this case
                        // console.log("No such document!");

                    }

                }).catch(function (error) {

                    // console.log("Error getting document:", error);

                });

                return unsubscribe;
            }

            // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile => function update ใช้เวลาในการทำงานไป');

        };

        update();

        // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile ใช้เวลาในการทำงานไป');

    }, [props]);

    // console.timeEnd('ฉันคาดว่า 🤔 function useProfile ใช้เวลาในการทำงานไป');

    return updateProfile;
};

function useShare(props) {

    // console.time('ฉันคาดว่า 🤔 function useShare ใช้เวลาในการทำงานไป');

    const [updateShare, setState] = useState({
        isShare: null
    })

    useEffect(() => {

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useShare ใช้เวลาในการทำงานไป');

        async function update() {

            if (props.isAuth !== null) {
                const unsubscribe = await props.db.firestore().collection(`share`).doc(props.isAuth.uid).get().then(function (doc) {

                    if (!doc.exists) {

                        // console.log('ไม่มีข้อมูลการแชร์เส้นทางเลย 😢');

                        setState({ isShare: null });

                    } else {

                        // console.log('ฉันเจอคนที่แชร์เส้นทางแล้ว 👏');
                        // console.log('share: ', doc.data());

                        setState({ isShare: doc.data() });

                    };

                });

                return unsubscribe;
            };

        };

        update();

        // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useShare ใช้เวลาในการทำงานไป');

    }, [props]);

    // console.timeEnd('ฉันคาดว่า 🤔 function useShare ใช้เวลาในการทำงานไป');

    return updateShare;

};

function Report(props) {

    const [open, setOpen] = useState(false);
    // const [isShare, setReport] = useState(null);
    // const [isProfile, setProfile] = useState(null);
    const { isProfile } = useProfile(props);
    const { isShare } = useShare(props);



    const handleClose = () => {
        setOpen(false);
    };

    function handleReset() {

        // console.time('ฉันคาดว่า 🤔 status => uid => owner ใช้เวลาในการ อัพเดต ไป');

        props.db.database().ref(`status/${props.match.params.id}/owner`).update({
            value: true,
            uid: props.isAuth.uid,
            id: props.isAuth.uid
        }).then(() => {

            // console.log('อัพเดต สถานะ owner แล้ว เคป๊ะ 😛');

        });

        // console.timeEnd('ฉันคาดว่า 🤔 status => uid => owner ใช้เวลาในการ อัพเดต ไป');
        // console.time('ฉันคาดว่า 🤔 share => uid => status ใช้เวลาในการ อัพเดต ไป');

        props.db.firestore().collection(`share`).doc(props.match.params.id).update({
            status: {
                value: true,
                uid: props.isAuth.uid,
                id: props.match.params.id
            }
        }).then(() => {

            // console.log('อัพเดต สถานะ share แล้ว เคป๊ะ 😛');

        });

        // console.timeEnd('ฉันคาดว่า 🤔 share => uid => status ใช้เวลาในการ อัพเดต ไป');
        // console.time('ฉันคาดว่า 🤔 share => uid => owner ใช้เวลาในการ อัพเดต ไป');

        props.db.firestore().collection(`share`).doc(props.match.params.id).update({
            owner: {
                id: props.isAuth.uid,
                photoURL: isProfile.photoURL,
                displayName: isProfile.displayName
            }
        }).then(() => {

            // console.log('อัพเดต ข้อมูล owner ของ share แล้ว เคนะ 😛');

        });

        // console.timeEnd('ฉันคาดว่า 🤔 share => uid => owner ใช้เวลาในการ อัพเดต ไป');
        // console.time('ฉันคาดว่า 🤔 share => uid => member ใช้เวลาในการ อัพเดต ไป');

        props.db.firestore().collection(`share`).doc(props.match.params.id).update({
            member: {
                [props.isAuth.uid]: {
                    share_id: props.match.params.id,
                    uid: props.isAuth.uid,
                    photoURL: isProfile.photoURL,
                    displayName: isProfile.displayName
                }
            }
        }).then(() => {

            // console.log('อัพเดต ข้อมูล member ของ share แล้ว เคนะ 😛');

        });

        // console.timeEnd('ฉันคาดว่า 🤔 share => uid => member ใช้เวลาในการ อัพเดต ไป');

        setOpen(true)
        //    props.history.goBack()
    };

    return (
        <React.Fragment>
            {isShare !== null
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
                                    <b>ต้นทาง:</b> {isShare.location.start_address}
                                    <br />
                                    <b>ปลายทาง:</b> {isShare.location.end_address}
                                    <br />
                                    <h2><RecentActorsIcon></RecentActorsIcon> ข้อมูลการแชร์</h2>
                                    <b>เริ่มการแชร์:</b> {isShare.date.end_time.value}
                                    <br />
                                    <b>ปิดการแชร์:</b> {isShare.date.start_time.value}
                                    <br />
                                    <b>ต้องการผู้ร่วมเดินทางเพิ่ม:</b> {isShare.max_number.value} คน
                                    <br />
                                    <b>ต้องการร่วมเดินทางกับเพศ: {isShare.sex.value}</b>
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
                            <Button
                                variant="contained"
                                onClick={handleReset}
                                style={{
                                    backgroundColor: '#274D7D',
                                    color: "aliceblue"
                                }}
                            >เปิดแชร์</Button>
                        </center>
                    </div>
                    <AlertCheck open={open} onClose={handleClose} db={props.db} isAuth={props.isAuth} />
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