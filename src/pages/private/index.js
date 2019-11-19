import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UserStatus from './components/UserStatus';
import MemberStatus from './components/MemberStatus';
import OwnerStatus from './components/OwnerStatus';
import Loading from '../loading';
// import { useStatus } from '../../controllers';

const Private = (props) => {

    const [isOwnerStatus, setOwnerStatus] = useState(null)
    const [isMemberStatus, setMemberStatus] = useState(null)

    useEffect(() => {
        if (props.isAuth !== null) {

            props.db.database().ref(`status/${props.isAuth.uid}/owner`).once("value").then(function (snapshot) {
                let data = (snapshot.val());
                let stringifyData = JSON.stringify(data);

                if (data !== null) {
                    setOwnerStatus(stringifyData)
                } else {
                    let statusData = {
                        share_id: '',
                        uid: `${props.isAuth.uid}`,
                        value: false

                    }

                    props.db.database().ref(`status/${props.isAuth.uid}/owner`).update(statusData)

                    setOwnerStatus(statusData)
                }
            });

            props.db.database().ref(`status/${props.isAuth.uid}/member`).once("value").then(function (snapshot) {
                let data = (snapshot.val())

                if (data !== null) {
                    setMemberStatus(data)
                } else {
                    let statusData = {
                        share_id: '',
                        uid: `${props.isAuth.uid}`,
                        value: false

                    }

                    props.db.database().ref(`status/${props.isAuth.uid}/member`).update(statusData)

                    setMemberStatus(statusData)
                }
            });
        }
    });

    return (
        <React.Fragment>
            {isOwnerStatus && isMemberStatus !== null
                ? (<React.Fragment>
                    {isOwnerStatus.value !== false
                        ? (<React.Fragment>
                            <OwnerStatus
                                db={props.db}
                                isAuth={props.isAuth}
                                isLocation={props.isLocation}
                            />
                            {/* test */}
                        </React.Fragment>)
                        : (<React.Fragment>
                            {isMemberStatus.value !== false
                                ? (
                                    <React.Fragment>
                                        <MemberStatus
                                            db={props.db}
                                            isAuth={props.isAuth}
                                            isMemberStatus={isMemberStatus}
                                            isLocation={props.isLocation}
                                             />
                                    </React.Fragment>)
                                : (<React.Fragment>
                                    <UserStatus
                                        db={props.db}
                                        isAuth={props.isAuth}
                                        isLocation={props.isLocation}
                                    />
                                    {/* คาดว่าน่าจะ error ตรงนี้แหละ */}
                                </React.Fragment>)
                            }
                        </React.Fragment>)
                    }
                </React.Fragment>)
                : (<React.Fragment>
                    <Loading />
                </React.Fragment>)
            }
        </React.Fragment>
    )
}

Private.propType = {
    isAuth: PropTypes.object,
    db: PropTypes.object,
    isLocation: PropTypes.object
}

export default Private;