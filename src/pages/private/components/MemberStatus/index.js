import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import ConnectApiMaps, { Map } from 'maps-google-react';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { StyleBaseLine } from '../StyleBaseLine';
import ChatSlide from './components/ChatSlide';
import MemberTypeIconStatus from '../MemberModalTypeIconStatus';
import KeyDataTaxiCar from './components/KeyDataTaxiCar';
// import SearchBar from '../SearchBar';
// import SearchMap from '../SearchMap';
import MenuIcon from '@material-ui/icons/Menu';
import MenuSlide from '../MenuSlide';
import ModelExitShare from './components/ModelExitShare';
import Loading from '../../../loading';
// import { useShare, useProfile, useUsers } from '../../../../controllers';


const MemberStatus = (props) => {

    const [openChatSlide, setOpenChatSlide] = useState(false);
    const [openKeyDataTaxiCar, setOpenKeyDataTaxiCar] = useState(false);
    const [openMenuSlide, setOpenMenuSlide] = useState(false)
    const [openModelExitShare, setOpenModelExitShare] = useState(false)
    const [alertShare, setAlertShare] = useState({})
    const [isMap, setMap] = useState(null);
    const [isAlertStatus, setAlertStatus] = useState(null);
    const [isProfile, setProfile] = useState(null);
    const [isShare, setShare] = useState(null);


    useEffect(() => {
        if (props.isAuth !== null) {

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

            props.db.firestore().collection(`share`).doc(props.isMemberStatus.share_id).get().then(function (doc) {

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

    const onKeyDataTaxiCar = () => {
        if (isAlertStatus.value !== 'false') {
            setAlertShare(isShare.alert)
        } else {
            setAlertShare({
                uid: `${isAlertStatus.uid}`,
                share_id: `${isAlertStatus.share_id}`,
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
        <React.Fragment>
            {isProfile && isShare !== null
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
                                    var markerUser = new CustomMarker(
                                        myLatlng,
                                        map,
                                        {},
                                        isProfile.photoURL
                                    );
                                } else {
                                    window.location.reload()
                                }

                                var userPosistion = {
                                    lat: props.isLocation.coords.latitude,
                                    lng: props.isLocation.coords.longitude
                                };

                                markerUser.latlng = { lat: userPosistion.lat, lng: userPosistion.lng };
                                markerUser.draw();

                                map.setCenter(userPosistion);

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
                                // get.share.location(props.isStatus.owner.share_id).then(function (data) {
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
                                <Fab size="medium" style={{ backgroundColor: '#274D7D', color: '#fff' }} onClick={onMenuSlide} aria-label="doc-taxi" className={classes.buttonTaxiDoc}>
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
                                <Fab size="medium" style={{ backgroundColor: '#274D7D', color: '#fff' }} onClick={onKeyDataTaxiCar} aria-label="doc-taxi" className={classes.buttonTaxiDoc}>
                                    <AssignmentIcon />
                                </Fab>
                                <Fab size="medium" style={{ backgroundColor: '#274D7D', color: '#fff' }} onClick={onChatSlide} color="secondary" aria-label="add" className={classes.buttonChat}>
                                    <QuestionAnswerIcon />
                                </Fab>
                                <KeyDataTaxiCar {...alertShare} open={openKeyDataTaxiCar} onClose={offKeyDataTaxiCar} />
                            </Grid>
                            <Button variant="contained" onClick={exitShareGroup} style={{
                                backgroundColor: 'slategrey',
                                color: 'white'
                            }} className={classes.fab}>
                                ออกจากกลุ่ม
                        </Button>
                            <ModelExitShare
                                db={props.db}
                                isShare={isShare}
                                isMemberStatus={props.isMemberStatus}
                                open={openModelExitShare}
                                onClose={offModelExitShare}
                            />

                        </Map>
                        <ChatSlide
                            open={openChatSlide}
                            onClose={offChatSlide}
                            isProfile={isProfile}
                            isMemberStatus={props.isMemberStatus}
                            db={props.db}
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
                : (<React.Fragment><Loading/></React.Fragment>)
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
    isAuth: PropTypes.object,
    isMemberStatus: PropTypes.object,
    db: PropTypes.object,
    isLocation: PropTypes.object,
}

export default ConnectApiMaps({
    apiKey: "AIzaSyBy2VY1e11qs-60Ul6aYT5klWYRI1K3RB0",
    libraries: ['places', 'geometry'],
})(withStyles(styles)(MemberStatus))