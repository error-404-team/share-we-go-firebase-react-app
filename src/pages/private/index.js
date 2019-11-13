import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import UserStatus from './components/UserStatus';
import MemberStatus from './components/MemberStatus';
import OwnerStatus from './components/OwnerStatus';
import { useStatus } from '../../controllers';
const Private = (props) => {
    // const [isState] = useState(props)
    // const a = JSON.stringify(props)
    // console.log(JSON.parse(a));


    const { isStatus } = useStatus(props)

    return (
        <Fragment>
            {isStatus !== null
                ? (<Fragment>
                    {isStatus.owner.value !== "false"
                        ? <OwnerStatus
                            db={props.db}
                            isUsersPrivate={props.isUsersPrivate}
                            isStatus={isStatus}
                        />
                        : (<Fragment>
                            {isStatus.member.value !== "false"
                                ? <MemberStatus
                                    db={props.db}
                                    isUsersPrivate={props.isUsersPrivate}
                                    isStatus={isStatus} />
                                : <UserStatus
                                    db={props.db}
                                    isUsersPrivate={props.isUsersPrivate}
                                    isStatus={isStatus} />
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