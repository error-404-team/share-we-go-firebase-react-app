import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import ConnectApiMaps, { Map } from 'maps-google-react';

import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AssignmentIcon from '@material-ui/icons/Assignment';

import { StyleBaseLine } from '../StyleBaseLine';
import ChatSlide from '../ChatSlide';
import MemberTypeIconStatus from '../MemberModalTypeIconStatus';
import KeyDataTaxiCar from './components/KeyDataTaxiCar';
import SearchBar from '../SearchBar';
import SearchMap from '../SearchMap';
import MenuSlide from '../MenuSlide';
import ModelExitShare from './components/ModelExitShare';
import { useShare, useProfile, useUsers } from '../../../../controllers';


const MemberStatus = (props) => {

    // const [share, setShare] = useState(null);
    const [openChatSlide, setOpenChatSlide] = useState(false);
    const [openKeyDataTaxiCar, setOpenKeyDataTaxiCar] = useState(false);
    const [openMenuSlide, setOpenMenuSlide] = useState(false)
    const [openModelExitShare, setOpenModelExitShare] = useState(false)
    const [alertShare, setAlertShare] = useState({})
    const [map, setMap] = useState(null);
    const { isShare } = useShare(props)
    const { isProfile } = useProfile(props);
    const { isUsers } = useUsers(props);

    const onChatSlide = () => {
        setOpenChatSlide(true)
    }

    const offChatSlide = () => {
        setOpenChatSlide(false)
    }

    const onKeyDataTaxiCar = () => {
        if (props.isStatus.alert.value !== 'false') {
            setAlertShare(isShare.alert)
        } else {
            setAlertShare({
                uid: `${props.isStatus.alert.uid}`,
                share_id: `${props.isStatus.alert.share_id}`,
                select: 'กำลังรอข้อมูล',
                license_plate: 'กำลังรอข้อมูล'

            })
        }
        // })
        setOpenKeyDataTaxiCar(true)
    }

    const offKeyDataTaxiCar = () => {
        setOpenKeyDataTaxiCar(false)
    }

    const onMenuSlide = () => {
        setOpenMenuSlide(true)
    }

    const offMenuSlide = () => {
        setOpenMenuSlide(false)
    }

    const exitShareGroup = () => {
        setOpenModelExitShare(true)
    }

    const offModelExitShare = () => {
        setOpenModelExitShare(false)

    }


    const latlng = {
        lat: 14.012107100000001,
        lng: 100.7210703
    }

    const { classes } = props;

    return (
        <Fragment>
            <StyleBaseLine>
                <Map
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
                            this.maps = map
                            setMap(map)
                            // this.google = google
                            // setGoogle(google)
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
                                let positionA = new this.google.maps.LatLng(this.latlng.lat, this.latlng.lng);

                                this.pos = this.getProjection().fromLatLngToDivPixel(positionA);
                                // console.log(this.pos);
                                this.div.style.left = this.pos.x + 'px';
                                this.div.style.top = this.pos.y + 'px';
                            }
                        };

                        CustomMarker.prototype.getPosition = function () {
                            return this.latlng;
                        };

                        function AutocompleteDirectionsHandler(google, map, data) {
                            this.map = map;
                            this.originPlaceId = null;
                            this.destinationPlaceId = null;
                            this.travelMode = 'WALKING';
                            this.directionsService = new google.maps.DirectionsService;
                            this.directionsRenderer = new google.maps.DirectionsRenderer;
                            this.directionsRenderer.setMap(this.map);

                            var me = this

                            if (data.share === true) {
                                me.setupPlaceChangedListener(data.geocoded_waypoints[0].place_id, 'ORIG');
                                me.setupPlaceChangedListener(data.geocoded_waypoints[1].place_id, 'DEST');
                                me.setupClickListener(data.request.travelMode);

                            } else {
                                me.setupPlaceChangedListener(data.geocoded_waypoints[0].place_id, 'ORIG');
                                me.setupPlaceChangedListener(data.geocoded_waypoints[1].place_id, 'DEST');
                                me.setupClickListener(data.request.travelMode);
                            }
                        }

                        // Sets a listener on a radio button to change the filter type on Places
                        // Autocomplete.
                        AutocompleteDirectionsHandler.prototype.setupClickListener = function (mode) {
                            var me = this;

                            me.travelMode = mode;
                            me.route();
                        };

                        AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (
                            place, mode) {
                            var me = this;

                            console.log(place);

                            if (!place) {
                                alert('Please select an option from the dropdown list.');
                                return;
                            }
                            if (mode === 'ORIG') {
                                me.originPlaceId = place;
                            } else {
                                me.destinationPlaceId = place;
                            }
                            me.route();
                        };

                        AutocompleteDirectionsHandler.prototype.route = function () {
                            if (!this.originPlaceId || !this.destinationPlaceId) {
                                return;
                            }
                            var me = this;

                            this.directionsService.route(
                                {
                                    origin: { 'placeId': this.originPlaceId },
                                    destination: { 'placeId': this.destinationPlaceId },
                                    travelMode: this.travelMode
                                },
                                function (response, status) {
                                    if (status === 'OK') {
                                        me.directionsRenderer.setDirections(response);
                                        // console.log(response);

                                    } else {
                                        alert('Directions request failed due to ' + status);
                                        // console.log(response, status);

                                    }
                                });
                        };

                        let myLatlng = new google.maps.LatLng(isUsers.location.coords.latitude, isUsers.location.coords.longitude);

                        let marker1 = new CustomMarker(
                            myLatlng,
                            map,
                            {},
                            isProfile.photoURL
                        );

                        let pos = {
                            lat: isUsers.location.coords.latitude,
                            lng: isUsers.location.coords.longitude
                        };

                        marker1.latlng = { lat: pos.lat, lng: pos.lng };
                        marker1.draw();

                        map.setCenter(pos);

                        new AutocompleteDirectionsHandler(google, map, isShare.location);

                    }}
                >
                    <SearchBar >
                        <SearchMap
                            onClick={onMenuSlide}
                            map={map}
                            {...props}

                        />
                    </SearchBar>
                    <MemberTypeIconStatus isShare={isShare} uid={props.isUsersPrivate.uid} />

                    <Grid container style={{
                        width: 'min-content',
                        position: 'absolute',
                        right: '15px',
                        bottom: '80px',

                    }} >
                        <Fab size="medium" onClick={onKeyDataTaxiCar} aria-label="doc-taxi" className={classes.buttonTaxiDoc}>
                            <AssignmentIcon />
                        </Fab>
                        <Fab size="medium" onClick={onChatSlide} color="secondary" aria-label="add" className={classes.buttonChat}>
                            <QuestionAnswerIcon />
                        </Fab>
                        <KeyDataTaxiCar {...alertShare} open={openKeyDataTaxiCar} onClose={offKeyDataTaxiCar} />
                    </Grid>
                    <Button variant="contained" onClick={exitShareGroup} style={{ backgroundColor: '#ffffff' }} className={classes.fab}>
                        ออกจากกลุ่ม
                        </Button>
                    <ModelExitShare
                        uid={props.isUsersPrivate.uid}
                        share_id={props.isStatus.member.share_id}
                        isShare={isShare}
                        open={openModelExitShare}
                        onClose={offModelExitShare} />

                </Map>
                <ChatSlide
                    open={openChatSlide}
                    onClose={offChatSlide}
                    isShare={isShare}
                    isStatus={props.isStatus}
                    uid={props.isUsersPrivate.uid}
                    db={props.db}
                />
                <MenuSlide
                    open={openMenuSlide}
                    onClose={offMenuSlide}
                    uid={props.isUsersPrivate.uid}
                    db={props.db}
                />
            </StyleBaseLine>
        </Fragment>
    )
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
    },
    buttonTaxiDoc: {
        margin: '5px',
        color: '#6d6d6d',
        backgroundColor: '#ffffff',
    },
    buttonChat: {
        margin: '5px',
        color: '#6d6d6d',
        backgroundColor: '#ffffff',
    }
}

MemberStatus.propTypes = {
    isUsersPrivate: PropTypes.object,
    isStatus: PropTypes.object,
    db: PropTypes.object
}

export default ConnectApiMaps({
    apiKey: "AIzaSyBy2VY1e11qs-60Ul6aYT5klWYRI1K3RB0",
    libraries: ['places', 'geometry'],
})(withStyles(styles)(MemberStatus))