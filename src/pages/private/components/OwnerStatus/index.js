import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import ConnectApiMaps, { Map } from 'maps-google-react';

import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import { withRouter } from 'react-router-dom'

import { StyleBaseLine } from '../StyleBaseLine';
import ModelExitShare from './components/ModelExitShare'

import ChatSlide from '../ChatSlide';
import MemberTypeIconStatus from '../MemberModalTypeIconStatus';
import CallTaxiModal from './components/CallTaxiModal';
import MenuIcon from '@material-ui/icons/Menu';

import MenuSlide from '../MenuSlide';
import { useShare, useProfile, useUsers } from '../../../../controllers';
import { dateTime } from '../../../../model/dateTime';


const OwnerStatus = (props) => {
    const [map, setMap] = useState(null);
    const [openChatSlide, setOpenChatSlide] = useState(false);
    const [openCallTaxi, setOpenCallTaxi] = useState(false)
    const [openMenuSlide, setOpenMenuSlide] = useState(false)
    const [openModelExitShare, setOpenModelExitShare] = useState(false)
    // const [locationShare, setLocationShare] = useState()
    const { isShare } = useShare(props);
    const { isProfile } = useProfile(props);
    const { isUsers } = useUsers(props);

    const onChatSlide = () => {

        let path_chat = `share/${props.isStatus.member.share_id}/chat`

        props.db.database().ref(`${path_chat}`).once("value").then(function (chat_value) {
            let chatData = (chat_value.val())
            if (chatData !== null) {
            } else {
                props.db.database().ref(`${path_chat}`).push({
                    uid: props.isStatus.share.uid,
                    share_id: props.isStatus.share.id,
                    profile: {
                        displayName: "Addmin",
                        photoURL: ''
                    },
                    msg: 'เริ่มการสนทนา',
                    date: dateTime
                })
            }

        })

        setOpenChatSlide(true)
    }

    const offChatSlide = () => {
        setOpenChatSlide(false)
    }

    const onCallTaxi = () => {
        setOpenCallTaxi(true)
    }

    const offCallTaxi = () => {
        setOpenCallTaxi(false)
    }

    const onMenuSlide = () => {
        setOpenMenuSlide(true)
    }

    const offMenuSlide = () => {
        setOpenMenuSlide(false)
    }

    const startShareGroup = () => {
        props.history.push(`doc_taxi/${props.isUsersPrivate.uid}`)
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
        <React.Fragment>
            {isUsers !== null
                ? (<React.Fragment>
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

                                // if (isShare !== null) {
                                //     setLocationShare(isShare)
                                // }
                                function CustomMarker(latlng, map, args, img) {
                                    this.latlng = latlng;
                                    this.args = args;
                                    this.img = img;
                                    this.maps = map
                                    setMap(map)
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

                                    if (data === true) {
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


                                // get.users.location(props.isStatus.owner.uid).then((location) => {
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

                                // })

                                // get.share.location(props.isStatus.owner.share_id).then(function (data) {
                                new AutocompleteDirectionsHandler(google, map, isShare.location);
                                // })
                                // })
                            }}
                        >
                            {/* <SearchBar >
                                <SearchMap
                                    onClick={onMenuSlide}
                                    map={map}
                                    {...props}

                                />
                            </SearchBar> */}

                            <Grid container style={{
                                width: 'min-content',
                                position: 'absolute',
                                top: '30px',
                                left: '5px'
                            }} >
                                <Fab size="medium" onClick={onMenuSlide} aria-label="doc-taxi" className={classes.buttonTaxiDoc}>
                                    <MenuIcon />
                                </Fab>
                            </Grid>

                            <MemberTypeIconStatus isShare={isShare} uid={props.isUsersPrivate.uid} />

                            <Grid container style={{
                                width: 'min-content',
                                position: 'absolute',
                                right: '15px',
                                bottom: '80px',

                            }} >
                                <Fab size="medium" onClick={onCallTaxi} aria-label="add" className={classes.buttonTaxi}>
                                    <LocalTaxiIcon />
                                </Fab>
                                <Fab size="medium" onClick={onChatSlide} color="secondary" aria-label="add" className={classes.buttonChat}>
                                    <QuestionAnswerIcon />
                                </Fab>
                                <CallTaxiModal
                                    uid={props.isStatus.uid}
                                    open={openCallTaxi}
                                    onClose={offCallTaxi} />
                            </Grid>
                            {props.isStatus.alert.value !== "true"
                                ? (<Fragment>
                                    <Grid container style={{
                                        width: 'min-content',
                                        position: 'absolute',
                                        left: '15px',
                                        bottom: '80px',

                                    }} >
                                        <Fab size="medium" onClick={exitShareGroup} aria-label="exit-share" className={classes.buttonExitShare}>
                                            <MeetingRoomIcon />
                                        </Fab>
                                    </Grid>
                                    <Button variant="contained" onClick={startShareGroup} style={{ backgroundColor: '#ffffff' }} className={classes.fab}>
                                        เริ่มการเดินทาง
                        </Button>
                                </Fragment>)
                                : (<Fragment>
                                    <Button variant="contained" onClick={exitShareGroup} style={{ backgroundColor: '#ffffff' }} className={classes.fab}>
                                        สิ้นสุดการเดินทาง
                        </Button>
                                </Fragment>)}
                            <ModelExitShare
                                uid={props.isUsersPrivate.uid}
                                share_id={props.isStatus.owner.uid}
                                isShare={isShare}
                                open={openModelExitShare}
                                onClose={offModelExitShare}
                                isUsersPrivate={props.isUsersPrivate}
                                db={props.db} />
                        </Map>
                        <ChatSlide
                            open={openChatSlide}
                            onClose={offChatSlide}
                            isShare={isShare}
                            isStatus={props.isStatus}
                            uid={props.isUsersPrivate.uid}
                            db={props.db}
                            isUsersPrivate={props.isUsersPrivate}
                        />
                        <MenuSlide
                            open={openMenuSlide}
                            onClose={offMenuSlide}
                            uid={props.isUsersPrivate.uid}
                            db={props.db}
                            isUsersPrivate={props.isUsersPrivate}
                        />
                    </StyleBaseLine>
                </React.Fragment>
                )
                : (<React.Fragment>Loading</React.Fragment>)
            }
        </React.Fragment>
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
    buttonTaxi: {
        margin: '5px',
        color: '#6d6d6d',
        backgroundColor: '#ffd91b',
    },
    buttonChat: {
        margin: '5px',
        color: '#6d6d6d',
        backgroundColor: '#ffffff',
    }
}

OwnerStatus.propTypes = {
    isStatus: PropTypes.object,
    isUsersPrivate: PropTypes.object,
    db: PropTypes.object
}

export default ConnectApiMaps({
    apiKey: "AIzaSyBy2VY1e11qs-60Ul6aYT5klWYRI1K3RB0",
    libraries: ['places', 'geometry'],
})(withStyles(styles)(withRouter(OwnerStatus)))