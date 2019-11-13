import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropsTypes from 'prop-types';
import { ThemeProvider,withStyles   } from '@material-ui/styles';
// import { createMuiTheme } from '@material-ui/core/styles';
// import '../css/share-location-bar.css';

// const share_location_bar_theme = createMuiTheme({
//     palette: {
//         primary: {
//             main: 'rgba(7, 81, 146, 0.87)',
//         }
//     },
// });




class HistoryBar extends React.Component {
    render() {
        // รับค่า ความยาวของขนาดจอ ไว้ในตัวแปล w 
        // var w = window.innerWidth
        // รับค่า ที่ถ่ายทอดมาจาก this.props.classes ให้อยู่ในตัวแปล classes
        const {classes} =this.props
        return (
            <div style={{
                flexGrow: 1,
                // position: 'absolute',
                width: '-webkit-fill-available',
                flexDirection: 'column'
            }}>
                {/* <ThemeProvider theme={share_location_bar_theme}> */}
                    <AppBar color="inherit" position="absolute"
                        elevation={1}
                    >
                        <Toolbar
                        >
                            {this.props.children}
                        </Toolbar>
                    </AppBar>
                {/* </ThemeProvider> */}
            </div>
        )
    }
}

HistoryBar.propsTypes = {
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


export default withStyles(styles)(HistoryBar);