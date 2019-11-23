import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropsTypes from 'prop-types';
import { withStyles   } from '@material-ui/styles';

class HistoryBar extends React.Component {
    render() {
    
        // const {classes} =this.props
        return (
            <div style={{
                flexGrow: 1,
                width: '-webkit-fill-available',
                flexDirection: 'column'
            }}>

                    <AppBar color="inherit" position="fixed"
                        elevation={1}
                    >
                        <Toolbar
                        >
                            {this.props.children}
                        </Toolbar>
                    </AppBar>
            </div>
        );

    };

};

HistoryBar.propsTypes = {
    google: PropsTypes.object,
    map: PropsTypes.object
};

const styles = {
    gutters:{
        paddingLeft:5,
        paddingRight:5
    }
};

export default withStyles(styles)(HistoryBar);