import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropsTypes from 'prop-types';
import { ThemeProvider,withStyles   } from '@material-ui/styles';




class DocTaxiBar extends React.Component {
    render() {
      
        const {classes} =this.props
        return (
            <div style={{
                flexGrow: 1,
                width: '-webkit-fill-available',
                flexDirection: 'column'
            }}>
               
                    <AppBar color="inherit" position="absolute"
                        elevation={1}
                    >
                        <Toolbar
                        >
                            {this.props.children}
                        </Toolbar>
                    </AppBar>
            </div>
        )
    }
}

DocTaxiBar.propsTypes = {
    google: PropsTypes.object,
    map: PropsTypes.object
}

// กำหนด style
const styles = {
    gutters:{
        paddingLeft:5,
        paddingRight:5
    }
}


export default withStyles(styles)(DocTaxiBar);