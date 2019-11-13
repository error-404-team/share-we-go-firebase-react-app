import React from 'react';
import PropsTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider, withStyles } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import { Autocomplete } from 'maps-google-react';
import './styles/search-map.css'

// const router = useRouter();


class SearchMap extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ...props,
            mapApiLoaded: false,
            places: [],
            select: "00"
        };
    }

    componentDidMount() {
        //  set mapApiLoaded in object state ให้ค่า = true
        this.setState({
            mapApiLoaded: true,
        });
    };

    setPlace = ({ place } = this.props) => {
        // รับค่า ที่ถ่ายทอดมาจาก this.props.place ให้อยู่ในตัวแปล place
        // ทำการ กำหนด places ใน state ให้ = ค่าที่อยู่ใน place
        this.setState({ places: [place] });
    };

    handleChange = (e) => {
        this.setState({ select: e.target.value })
    }

    render() {
        // รับค่า ที่ถ่ายทอดมาจาก this.state.google ให้อยู่ในตัวแปล google
        const { google, map } = this.state;
        // รับค่า ที่ถ่ายทอดมาจาก this.props.classes ให้อยู่ในตัวแปล classes
        const { classes } = this.props

        // console.log(this.props.map);


        return (
            <Paper className={classes.root} elevation={2} >
                <IconButton onClick={this.props.onClick} className={classes.iconButton} aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <Divider className={classes.divider} />
                <Autocomplete
                    map={this.props.map}
                    google={google}
                    setPlace={this.setPlace}
                    style={{
                        color: 'inherit',
                        padding: '0px 0px',
                        width: '-webkit-fill-available',
                    }}
                />
                <Divider className={classes.divider} />
                <FormControl className={classes.formControl}>
                    <Select
                        value={this.state.select}
                        onChange={this.handleChange.bind(this)}
                        className={classes.selectEmpty}
                        input={<InputBase
                            id="age-customized-native-simple"
                            name="age"
                        />}
                    >
                        <MenuItem value="00">
                            <em>สถานที่</em>
                        </MenuItem>
                        <MenuItem value={10}>ต้นทาง</MenuItem>
                        <MenuItem value={20}>ปลายทาง</MenuItem>
                    </Select>
                </FormControl>
            </Paper>
        )
    }
}

// กำหนด style
const styles = {
    root: {
        width: '-webkit-fill-available',
        borderRadius: 8,
        backgroundColor: 'rgb(255, 255, 255)',
        '&:hover': {
            backgroundColor: 'rgb(255, 255, 255)',
        },
        marginRight: 15,
        marginLeft: 15,
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
    formControl: {

        marginRight: 5,
        minWidth: 90,
    },
    selectEmpty: {
        marginTop: 0,
    },
    input: {
        marginLeft: 0,
        flex: 1,
    },
    option: {
        width: 90
    }
}

SearchMap.propsTypes = {
    google: PropsTypes.object,
    map: PropsTypes.object,
    onClick: PropsTypes.func
}


export default withStyles(styles)(SearchMap);