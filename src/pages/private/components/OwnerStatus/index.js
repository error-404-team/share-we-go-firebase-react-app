import React, { useEffect, useState } from 'react';
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

import ChatSlide from './components/ChatSlide';
import MemberTypeIconStatus from '../MemberModalTypeIconStatus';
import CallTaxiModal from './components/CallTaxiModal';
import MenuIcon from '@material-ui/icons/Menu';

import MenuSlide from '../MenuSlide';

import Loading from '../../../loading';
// import { useShare, useProfile, useUsers } from '../../../../controllers';
// import { dateTime } from '../../../../model/dateTime';


const OwnerStatus = (props) => {
    const [isMap, setMap] = useState(null);
    const [openChatSlide, setOpenChatSlide] = useState(false);
    const [openCallTaxi, setOpenCallTaxi] = useState(false);
    const [openMenuSlide, setOpenMenuSlide] = useState(false);
    const [openModelExitShare, setOpenModelExitShare] = useState(false);
    const [isAlertStatus, setAlertStatus] = useState(null);
    const [isProfile, setProfile] = useState(null);
    const [isShare, setShare] = useState(null);
    // const { isShare } = useShare(props);
    // const { isProfile } = useProfile(props);
    // const { isUsers } = useUsers(props);

    useEffect(() => {
        if (props.isAuth !== null) {
console.log(props.isAuth);

            props.db.database().ref(`status/${props.isAuth.uid}/alert`).once("value").then(function (snapshot) {
                let data = (snapshot.val());
                let stringifyData = JSON.stringify(data);

                if (data !== null) {
                    setAlertStatus(stringifyData)
                } else {
                    let statusData = {
                        share_id: '',
                        uid: `${props.isAuth.uid}`,
                        value: false

                    }

                    props.db.database().ref(`status/${props.isAuth.uid}/alert`).update(statusData)

                    setAlertStatus(statusData)
                }
            });

            props.db.firestore().collection('users').doc(props.isAuth.uid+'/profile').get().then(function (doc) {

                if (!doc.exists) {
                    props.db.firestore().collection('users').doc(props.isAuth.uid+'/profile').set(props.isAuth.providerData[0])

                    setProfile(props.isAuth.providerData[0])
                } else {
                    setProfile(doc.data())

                }
            });

            props.db.firestore().collection(`share`).doc(props.isAuth.uid).get().then(function (doc) {

                if (!doc.exists) {
                    console.log('ไม่มีข้อมูล');

                } else {
                    setShare(doc.data())
                }
            });
        }
    });

    const onChatSlide = () => {

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
        props.history.push(`doc_taxi/${props.isAuth.uid}`)
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
            {isProfile && isShare && isAlertStatus !== null
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

                                function CustomMarker(latlng, map, args, img) {
                                    this.latlng = latlng;
                                    this.args = args;
                                    this.img = img;
                                    this.setMap(map);
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

                                var myLatlng = new google.maps.LatLng(props.isLocation.coords.latitude, props.isLocation.coords.longitude);
                                if (isProfile !== null) {
                                    var markerOwner = new CustomMarker(
                                        myLatlng,
                                        map,
                                        {},
                                        isProfile.photoURL
                                    );
                                } else {
                                    window.location.reload()
                                }

                                var ownerPosistion = {
                                    lat: props.isLocation.coords.latitude,
                                    lng: props.isLocation.coords.longitude
                                };

                                markerOwner.latlng = { lat: ownerPosistion.lat, lng: ownerPosistion.lng };
                                markerOwner.draw();

                                map.setCenter(ownerPosistion);

                                Object.keys(isShare.member).map((key) => {
                                    if (key !== props.isAuth.uid) {
                                        props.db.database().ref(`users/${key}/location`).once("value").then(function (snapshot) {
                                            let data = (snapshot.val());

                                            var memberLatlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
                                            if (isShare.member !== null) {
                                                var markerMember = new CustomMarker(
                                                    memberLatlng,
                                                    map,
                                                    {},
                                                    isShare.member[key].photoURL
                                                );
                                            } else {
                                                window.location.reload()
                                            }

                                            var memberPosition = {
                                                lat: data.coords.latitude,
                                                lng: data.coords.longitude
                                            };

                                            markerMember.latlng = { lat: memberPosition.lat, lng: memberPosition.lng };
                                            markerMember.draw();

                                            map.setCenter(memberPosition);
                                        });
                                    }
                                })

                                new AutocompleteDirectionsHandler(google, map, isShare.location);
                                // })
                                // })
                            }}
                        >
                            <Grid container style={{
                                width: 'min-content',
                                position: 'absolute',
                                top: '30px',
                                left: '5px'
                            }} >
                                <Fab size="medium" onClick={onMenuSlide} aria-label="menu" style={{
                                    backgroundColor: '#274D7D',
                                    color: 'white'
                                }} className={classes.buttonTaxiDoc}>
                                    <MenuIcon />
                                </Fab>
                            </Grid>

                            <MemberTypeIconStatus isShare={isShare} />

                            <Grid container style={{
                                width: 'min-content',
                                position: 'absolute',
                                right: '15px',
                                bottom: '80px',

                            }} >
                                <Fab size="medium" onClick={onCallTaxi} aria-label="add" className={classes.buttonTaxi}>
                                    <LocalTaxiIcon />
                                </Fab>
                                <Fab size="medium" onClick={onChatSlide} color="secondary" aria-label="chat" style={{
                                    backgroundColor: '#274D7D',
                                    color: 'white'
                                }} className={classes.buttonChat}>
                                    <QuestionAnswerIcon />
                                </Fab>
                                <CallTaxiModal
                                    open={openCallTaxi}
                                    onClose={offCallTaxi} />
                            </Grid>
                            {isAlertStatus.value !== true
                                ? (<React.Fragment>
                                    <Grid container style={{
                                        width: 'min-content',
                                        position: 'absolute',
                                        left: '15px',
                                        bottom: '80px',

                                    }} >
                                        <Fab size="medium" onClick={exitShareGroup} aria-label="exit-share"
                                            style={{
                                                backgroundColor: 'slategrey',
                                                color: 'white'

                                            }} className={classes.buttonExitShare}>
                                            <MeetingRoomIcon />
                                        </Fab>
                                    </Grid>
                                    <Button variant="contained" onClick={startShareGroup} style={{
                                        backgroundColor: '#274D7D',
                                        color: 'white'
                                    }} className={classes.fab}>
                                        เริ่มการเดินทาง
                        </Button>
                                </React.Fragment>)
                                : (<React.Fragment>
                                    <Button variant="contained" onClick={exitShareGroup} style={{
                                        backgroundColor: '#274D7D',
                                        color: 'white'
                                    }} className={classes.fab}>
                                        สิ้นสุดการเดินทาง
                        </Button>
                                </React.Fragment>)}
                            <ModelExitShare
                                uid={props.isAuth.uid}
                                isShare={isShare}
                                open={openModelExitShare}
                                onClose={offModelExitShare}
                                db={props.db} />
                        </Map>
                        <ChatSlide
                            open={openChatSlide}
                            onClose={offChatSlide}
                            uid={props.isAuth.uid}
                            db={props.db}
                            isProfile={isProfile}
                        />
                        <MenuSlide
                            open={openMenuSlide}
                            onClose={offMenuSlide}
                            uid={props.isAuth.uid}
                            isProfile={isProfile}
                            db={props.db}
                        />
                    </StyleBaseLine>
                </React.Fragment>
                )
                : (<React.Fragment><Loading /></React.Fragment>)
            }
        </React.Fragment >
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
    isAuth: PropTypes.object,
    db: PropTypes.object,
    isLocaation: PropTypes.object
}

export default ConnectApiMaps({
    apiKey: "AIzaSyBy2VY1e11qs-60Ul6aYT5klWYRI1K3RB0",
    libraries: ['places', 'geometry'],
})(withStyles(styles)(withRouter(OwnerStatus)))