import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import UserStatus from './components/UserStatus';
import MemberStatus from './components/MemberStatus';
import OwnerStatus from './components/OwnerStatus';
import { useStatus } from '../../controllers';
const Private = (props) => {

    const { isStatus } = useStatus(props)

    return (
        <Fragment>
            {isStatus !== null
                ? (<Fragment>
                    {isStatus.owner.value !== "false"
                        ? (<React.Fragment>
                            <OwnerStatus
                            db={props.db}
                            isUsersPrivate={props.isUsersPrivate}
                            isStatus={isStatus}
                        />
                        {/* test */}
                        </React.Fragment>)
                        : (<Fragment>
                            {isStatus.member.value !== "false"
                                ? (
                                    <React.Fragment>
                                        <MemberStatus
                                            db={props.db}
                                            isUsersPrivate={props.isUsersPrivate}
                                            isStatus={isStatus} />
                                    </React.Fragment>)
                                : (<React.Fragment>
                                    <UserStatus
                                        db={props.db}
                                        isUsersPrivate={props.isUsersPrivate}
                                        isStatus={isStatus} />
                                    {/* คาดว่าน่าจะ error ตรงนี้แหละ */}
                                </React.Fragment>)
                            }
                        </Fragment>)
                    }
                </Fragment>)
                : (<Fragment></Fragment>)
            }
        </Fragment>
    )
}

Private.propType = {
    isUsersPrivate: PropTypes.object,
    db: PropTypes.object,
    isLocation: PropTypes.object
}

export default Private;