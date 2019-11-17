import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import { Link } from 'react-router-dom';

import ConnectApiMaps, { Map } from 'maps-google-react';
import $ from 'jquery';

import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';

import { StyleBaseLine } from '../StyleBaseLine';

import { VisibilityButton } from '../VisibilityButton';
import SearchBar from '../SearchBar';
import SearchMap from '../SearchMap';
import MenuSlide from '../MenuSlide';

import './styles/marker-custom.css';
import { useUsers, useShareAll, useShare, useStatusAll } from '../../../../controllers';
import { dateTime } from '../../../../model/dateTime';

const UserStatus = (props) => {

    const [map, setMap] = useState(null)
    const [google, setGoogle] = useState(null)
    const [openVisibility, setOpenVisibility] = useState(false)
    const [openMenuSlide, setOpenMenuSlide] = useState(false)
    const [openModelJoinShare, setOpenModelJoinShare] = useState({
        key: '',
        bool: false
    })

    const { isUsers } = useUsers(props)
    const { isShareAll } = useShareAll(props);
    // const {isShare} = useShare(props);
    const { isStatusAll } = useStatusAll(props);


    const onVisibility = () => {
        setOpenVisibility(true)
    }

    const offVisibility = () => {
        setOpenVisibility(false)
    }

    const onMenuSlide = () => {
        setOpenMenuSlide(true)
    }

    const offMenuSlide = () => {
        setOpenMenuSlide(false)
    }
    const onModelJoinShare = (key) => {

        props.db.database().ref(`status/${props.isUsersPrivate.uid}/member`).update({
            share_id: key,
            uid: props.isUsersPrivate.uid,
            value: "true"
        })

        props.db.database().ref(`share/${key}/member/${props.isUsersPrivate.uid}`).update({
            share_id: key,
            uid: props.isUsersPrivate.uid,
            profile: isUsers.profile
        })

        props.db.database().ref(`share/${key}/member/${props.isUsersPrivate.uid}/_log`).push({
            member: {
                share_id: key,
                uid: props.isUsersPrivate.uid,
                profile: isUsers.profile
            },
            date: dateTime
        })

        setOpenModelJoinShare({
            key: `${key}`,
            bool: true
        })

        window.location.reload()
    }

    const offModelJoinShare = () => {
        setOpenModelJoinShare({
            key: '',
            bool: false
        })
    }


    const latlng = {
        lat: 14.012107100000001,
        lng: 100.7210703
    }

    // console.log(isUsers);

    // const MapSearch = MapSearch
    // const UserMarker = UserMarker
    return (
        <Fragment>
            <StyleBaseLine>
                {isUsers !== null
                    ? (
                        <React.Fragment>
                            {isStatusAll !== null
                                ? (
                                    <React.Fragment>
                                        {isShareAll !== null
                                            ? (<Map
                                                google={props.google}
                                                mapOptions={
                                                    {
                                                        zoom: 15,
                                                        center: { lat: latlng.lat, lng: latlng.lat },
                                                        disableDefaultUI: true,
                                                        styles: [{
                                                            featureType: 'poi.business',
                                                            stylers: [{ visibility: 'on' }]
                                                        },
                                                        {
                                                            featureType: 'transit',
                                                            elementType: 'labels.icon',
                                                            stylers: [{ visibility: 'off' }]
                                                        }]
                                                    }}
                                                opts={(google, map) => {

                                                    function CustomMarker(latlng, map, args, img) {
                                                        this.latlng = latlng;
                                                        this.args = args;
                                                        this.img = img;
                                                        this.setMap(map);
                                                        this.maps = map
                                                        setMap(map)
                                                        setGoogle(google)
                                                    }

                                                    CustomMarker.prototype = new google.maps.OverlayView();

                                                    CustomMarker.prototype.onAdd = function () {
                                                        var self = this;
                                                        var div = this.div;
                                                        if (!div) {
                                                            // Generate marker html
                                                            div = this.div = document.createElement('div');
                                                            div.className = 'custom-marker';
                                                            div.style.position = 'absolute';
                                                            var innerDiv = document.createElement('div');
                                                            innerDiv.className = 'custom-marker-inner';
                                                            innerDiv.innerHTML = `<img  src="${this.img}" style="border-radius: inherit;width: 20px;height: 20px;margin: 2px;"/>`
                                                            div.appendChild(innerDiv);

                                                            if (typeof (self.args.marker_id) !== 'undefined') {
                                                                div.dataset.marker_id = self.args.marker_id;
                                                            }

                                                            google.maps.event.addDomListener(div, "click", function (event) {
                                                                google.maps.event.trigger(self, "click");
                                                            });

                                                            var panes = this.getPanes();
                                                            panes.overlayImage.appendChild(div);
                                                        }
                                                    };

                                                    CustomMarker.prototype.draw = function () {
                                                        // มี bug icon ไม่เกาะ map
                                                        if (this.div) {
                                                            // กำหนด ตำแหน่ง ของhtml ที่สร้างไว้
                                                            let positionA = new google.maps.LatLng(this.latlng.lat, this.latlng.lng);

                                                            this.pos = this.getProjection().fromLatLngToDivPixel(positionA);
                                                            // console.log(this.pos);
                                                            this.div.style.left = this.pos.x + 'px';
                                                            this.div.style.top = this.pos.y + 'px';
                                                        }
                                                    };

                                                    CustomMarker.prototype.getPosition = function () {
                                                        return this.latlng;
                                                    };

                                                    var myLatlng = new google.maps.LatLng(isUsers.location.coords.latitude, isUsers.location.coords.longitude);
                                                    if (isUsers.profile !== undefined) {
                                                        var marker1 = new CustomMarker(
                                                            myLatlng,
                                                            map,
                                                            {},
                                                            isUsers.profile.photoURL
                                                        );
                                                    } else {
                                                        window.location.reload()
                                                    }

                                                    var pos = {
                                                        lat: isUsers.location.coords.latitude,
                                                        lng: isUsers.location.coords.longitude
                                                    };

                                                    marker1.latlng = { lat: pos.lat, lng: pos.lng };
                                                    marker1.draw();

                                                    map.setCenter(pos);

                                                    console.log(isShareAll);
                                                    // share
                                                    if (isShareAll !== null) {
                                                        Object.keys(isShareAll).map((key) => {
                                                            console.log(key); // all key
                                                            // get.status.share(key).then(function (status) {
                                                            if (isStatusAll[key].share.value !== "false") {
                                                                let latlng = new google.maps.LatLng(isShareAll[key].location.routes[0].legs[0].start_location.lat, isShareAll[key].location.routes[0].legs[0].start_location.lng);


                                                                const marker = new CustomMarker(
                                                                    latlng,
                                                                    map,
                                                                    { marker_id: `${key}` },
                                                                    "https://img.icons8.com/ios-glyphs/30/000000/car-cleaning.png"
                                                                )


                                                                var pos = {
                                                                    lat: isShareAll[key].location.routes[0].legs[0].start_location.lat,
                                                                    lng: isShareAll[key].location.routes[0].legs[0].start_location.lng
                                                                };

                                                                marker.latlng = { lat: pos.lat, lng: pos.lng };

                                                                marker.draw();


                                                                map.setCenter(pos);

                                                                const content = `
                                            <center>
                                            <h2>ข้อมูลการแชร์</h2>
                                            </center>
                                            <hr></hr>
                                            <u style="font-size: 15px">ต้นทาง: </u><u>${isShareAll[key].location.routes[0].legs[0].start_address}</u><b></b>
                                            <br></br>
                                            <u style="font-size: 15px">ปลายทาง: </u><u>${isShareAll[key].location.routes[0].legs[0].end_address}</u><b></b>
                                            <br></br>
                                            <u style="font-size: 15px">เริ่มแชร์เมื่อ: </u><u>${isShareAll[key].date.start_time.value}</<u><b></b>
                                            <br></br>
                                            <u style="font-size: 15px">ปิดแชร์เวลา: </u><u>${isShareAll[key].date.end_time.value}</<u><b></b>
                                            <br></br>
                                            <u style="font-size: 15px">ต้องการผู้เดินทางเพิ่ม: </u><u>${Object.keys(isShareAll[key].member).length - 1} </<u><b>/ ${isShareAll[key].max_number.value} คน </b>
                                            <br></br>
                                            <u style="font-size: 15px">เดินทางกับเพศ: </u><u>${isShareAll[key].sex.value}</<u><b> </b>
                                            <hr></hr>
                                            <center><button style="background-color: #ffffff;
                                            font-size: 17px;
                                            width: -webkit-fill-available;
                                            border-radius: 12px;
                                            color: rgba(0, 0, 0, 0.87);
                                            box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);
                                            }" id="join-share-${key}" ${`${Object.keys(isShareAll[key].member).length - 1}` === isShareAll[key].max_number.value ? "disabled='disabled'" : null} >เข้าร่วม</button></center>`

                                                                const infowindow = new google.maps.InfoWindow({
                                                                    content: '',
                                                                    maxWidth: 500
                                                                });

                                                                marker.addListener('click', function (key) {

                                                                    infowindow.setContent(content)
                                                                    infowindow.open(map, marker);

                                                                });

                                                                $(document).on('click', `#join-share-${key}`, function () {
                                                                    onModelJoinShare(key)

                                                                })

                                                            }
                                                        })
                                                    }
                                                    // })
                                                }}
                                            >
                                                <SearchBar >
                                                    <SearchMap
                                                        onClick={onMenuSlide}
                                                        map={map}
                                                        google={google}
                                                        {...props}

                                                    />
                                                </SearchBar>
                                                <VisibilityButton open={openVisibility} on={onVisibility} off={offVisibility} />
                                                <Link to="/share_location">
                                                    <Button variant="contained" style={{ backgroundColor: '#ffffff' }} className={props.classes.fab}>
                                                        <AddIcon color="action" fontSize="large" />
                                                    </Button>
                                                </Link>
                                            </Map>)
                                            : (<Map
                                                google={props.google}
                                                mapOptions={
                                                    {
                                                        zoom: 15,
                                                        center: { lat: latlng.lat, lng: latlng.lat },
                                                        disableDefaultUI: true,
                                                        styles: [{
                                                            featureType: 'poi.business',
                                                            stylers: [{ visibility: 'on' }]
                                                        },
                                                        {
                                                            featureType: 'transit',
                                                            elementType: 'labels.icon',
                                                            stylers: [{ visibility: 'off' }]
                                                        }]
                                                    }}
                                                opts={(google, map) => {

                                                    function CustomMarker(latlng, map, args, img) {
                                                        this.latlng = latlng;
                                                        this.args = args;
                                                        this.img = img;
                                                        this.setMap(map);
                                                        this.maps = map
                                                        setMap(map)
                                                        setGoogle(google)
                                                    }

                                                    CustomMarker.prototype = new google.maps.OverlayView();

                                                    CustomMarker.prototype.onAdd = function () {
                                                        var self = this;
                                                        var div = this.div;
                                                        if (!div) {
                                                            // Generate marker html
                                                            div = this.div = document.createElement('div');
                                                            div.className = 'custom-marker';
                                                            div.style.position = 'absolute';
                                                            var innerDiv = document.createElement('div');
                                                            innerDiv.className = 'custom-marker-inner';
                                                            innerDiv.innerHTML = `<img  src="${this.img}" style="border-radius: inherit;width: 20px;height: 20px;margin: 2px;"/>`
                                                            div.appendChild(innerDiv);

                                                            if (typeof (self.args.marker_id) !== 'undefined') {
                                                                div.dataset.marker_id = self.args.marker_id;
                                                            }

                                                            google.maps.event.addDomListener(div, "click", function (event) {
                                                                google.maps.event.trigger(self, "click");
                                                            });

                                                            var panes = this.getPanes();
                                                            panes.overlayImage.appendChild(div);
                                                        }
                                                    };

                                                    CustomMarker.prototype.draw = function () {
                                                        // มี bug icon ไม่เกาะ map
                                                        if (this.div) {
                                                            // กำหนด ตำแหน่ง ของhtml ที่สร้างไว้
                                                            let positionA = new google.maps.LatLng(this.latlng.lat, this.latlng.lng);

                                                            this.pos = this.getProjection().fromLatLngToDivPixel(positionA);
                                                            // console.log(this.pos);
                                                            this.div.style.left = this.pos.x + 'px';
                                                            this.div.style.top = this.pos.y + 'px';
                                                        }
                                                    };

                                                    CustomMarker.prototype.getPosition = function () {
                                                        return this.latlng;
                                                    };

                                                    var myLatlng = new google.maps.LatLng(isUsers.location.coords.latitude, isUsers.location.coords.longitude);
                                                    if (isUsers.profile !== undefined) {
                                                        var marker1 = new CustomMarker(
                                                            myLatlng,
                                                            map,
                                                            {},
                                                            isUsers.profile.photoURL
                                                        );
                                                    } else {
                                                        window.location.reload()
                                                    }

                                                    var pos = {
                                                        lat: isUsers.location.coords.latitude,
                                                        lng: isUsers.location.coords.longitude
                                                    };

                                                    marker1.latlng = { lat: pos.lat, lng: pos.lng };
                                                    marker1.draw();

                                                    map.setCenter(pos);

                                                }}
                                            >
                                                <SearchBar >
                                                    <SearchMap
                                                        onClick={onMenuSlide}
                                                        map={map}
                                                        google={google}
                                                        {...props}

                                                    />
                                                </SearchBar>
                                                <VisibilityButton open={openVisibility} on={onVisibility} off={offVisibility} />
                                                <Link to="/share_location">
                                                    <Button variant="contained" style={{ backgroundColor: '#ffffff' }} className={props.classes.fab}>
                                                        <AddIcon color="action" fontSize="large" />
                                                    </Button>
                                                </Link>
                                            </Map>)
                                        }
                                    </React.Fragment>
                                )
                                : (<React.Fragment>Loading</React.Fragment>)
                            }
                        </React.Fragment>)
                    : (<React.Fragment>Loading</React.Fragment>)}<MenuSlide db={props.db} open={openMenuSlide} onClose={offMenuSlide} isUsersPrivate={props.isUsersPrivate} />
            </StyleBaseLine>
        </Fragment>
    )

}

UserStatus.propTypes = {
    uid: PropTypes.string,
    isUsersPrivate: PropTypes.object,
    isStatus: PropTypes.object,
    db: PropTypes.object
}

const styles = {
    fab: {
        height: '45px',
        bottom: '16px',
        width: '-webkit-fill-available',
        position: 'absolute',
        marginLeft: '22px',
        marginRight: '22px',
        borderRadius: 12
    }
}

export default ConnectApiMaps({
    apiKey: "AIzaSyBy2VY1e11qs-60Ul6aYT5klWYRI1K3RB0",
    libraries: ['places', 'geometry'],
})(withStyles(styles)(UserStatus))