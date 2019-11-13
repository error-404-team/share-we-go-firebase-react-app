import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';


const MemberTypeIconStatus = (props) => {



    return (
        <React.Fragment>
            <Grid container style={{
                width: 'min-content',
                position: 'absolute',
                top: '100px',

            }} >
                <Avatar
                    alt="Remy Sharp"
                    src={props.isShare !== null ? props.isShare.owner.profile.photoURL : null}
                    className={props.classes.mediumAvatar}
                    style={{
                        border: '4px solid #fff',
                        boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
                    }}
                />
                {props.isShare !== null
                    ? (<React.Fragment>
                        {props.isShare.member !== undefined
                            ? (<React.Fragment>
                                {Object.keys(props.isShare.member).map((key) => (
                                    <React.Fragment>
                                    {key !== props.isShare.owner.id 
                                    ?(<Avatar
                                        alt="Remy Sharp"
                                        src={props.isShare.member[key].profile.photoURL}
                                        className={props.classes.mediumAvatar}
                                        style={{
                                            border: '4px solid #fff',
                                            boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
                                        }}
                                    />)
                                    :(<React.Fragment></React.Fragment>)
                                    }
                                    </React.Fragment>
                                ))}

                            </React.Fragment>)
                            : (<React.Fragment></React.Fragment>)}
                    </React.Fragment>)
                    : (<React.Fragment></React.Fragment>)}
            </Grid>
        </React.Fragment>
    )
}


const styles = {
    mediumAvatar: {
        margin: '5px 10px',
        width: 45,
        height: 45,
    }
}

MemberTypeIconStatus.propTypes = {
    uid: PropTypes.string,
    isShare:PropTypes.object
}

export default withStyles(styles)(MemberTypeIconStatus)