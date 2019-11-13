import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import { Link } from 'react-router-dom';

import ConnectApiMaps, { Map } from 'maps-google-react';
import $ from 'jquery';

import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';

import { StyleBaseLine } from '../../../../components/StyleBaseLine';

import { VisibilityButton } from '../../../../components/VisibilityButton';
import SearchBar from '../SearchBar';
import SearchMap from '../SearchMap';
import MenuSlide from '../MenuSlide';

import './styles/marker-custom.css';
import { useUserId, useShareAll, useShareId, useStatusAll } from '../../../../StoreData';


const UserStatus = (props) => {

    const [map, setMap] = useState(null)
    const [openVisibility, setOpenVisibility] = useState(false)
    const [openMenuSlide, setOpenMenuSlide] = useState(false)
    const [openModelJoinShare, setOpenModelJoinShare] = useState({
        key: '',
        bool: false
    })

    const { userId } = useUserId(props.db, props.auth)
    const { shareAll } = useShareAll(props.db);
    const {shareId} = useShareId(props.db,props.auth);
    const { statusAll } = useStatusAll(props.db);


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
        setOpenModelJoinShare({
            key: `${key}`,
            bool: true
        })
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

    // const MapSearch = MapSearch.bind(this)
    // const UserMarker = UserMarker.bind(this)
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
                            this.setMap(map);
                            this.maps = map
                            setMap(map)
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

                        

                            var myLatlng = new google.maps.LatLng(userId.location.coords.latitude, userId.location.coords.longitude);
                            if (userId.profile !== undefined) {
                                var marker1 = new CustomMarker(
                                    myLatlng,
                                    map,
                                    {},
                                    userId.profile.photoURL
                                );
                            } else {
                                window.location.reload()
                            }

                            var pos = {
                                lat: userId.location.coords.latitude,
                                lng: userId.location.coords.longitude
                            };

                            marker1.latlng = { lat: pos.lat, lng: pos.lng };
                            marker1.draw();

                            map.setCenter(pos);

                        // share
                       
                            Object.keys(shareAll).map((key) => {
                                // console.log(key); // all key
                                // get.status.share(key).then(function (status) {
                                    if (statusAll[key].share.value !== "false") {
                                        let myLatlng = new google.maps.LatLng(shareAll[key].location.routes[0].legs[0].start_location.lat, shareAll[key].location.routes[0].legs[0].start_location.lng);


                                        const marker = new CustomMarker(
                                            myLatlng,
                                            map,
                                            { marker_id: `${key}` },
                                            "https://img.icons8.com/ios-glyphs/30/000000/car-cleaning.png"
                                        )


                                        var pos = {
                                            lat: shareAll[key].location.routes[0].legs[0].start_location.lat,
                                            lng: shareAll[key].location.routes[0].legs[0].start_location.lng
                                        };

                                        marker.latlng = { lat: pos.lat, lng: pos.lng };

                                        marker.draw();


                                        map.setCenter(pos);

                                        const content = `
                                            <center>
                                            <h2>ข้อมูลการแชร์</h2>
                                            </center>
                                            <hr></hr>
                                            <u style="font-size: 15px">ต้นทาง: </u><u>${shareAll[key].location.routes[0].legs[0].start_address}</u><b></b>
                                            <br></br>
                                            <u style="font-size: 15px">ปลายทาง: </u><u>${shareAll[key].location.routes[0].legs[0].end_address}</u><b></b>
                                            <br></br>
                                            <u style="font-size: 15px">เริ่มแชร์เมื่อ: </u><u>${shareAll[key].date.start_time.value}</<u><b></b>
                                            <br></br>
                                            <u style="font-size: 15px">ปิดแชร์เวลา: </u><u>${shareAll[key].date.end_time.value}</<u><b></b>
                                            <br></br>
                                            <u style="font-size: 15px">ต้องการผู้เดินทางเพิ่ม: </u><u>${Object.keys(shareAll[key].member).length - 1} </<u><b>/ ${shareAll[key].max_number.value} คน </b>
                                            <br></br>
                                            <u style="font-size: 15px">เดินทางกับเพศ: </u><u>${shareAll[key].sex.value}</<u><b> </b>
                                            <hr></hr>
                                            <center><button style="background-color: #ffffff;
                                            font-size: 17px;
                                            width: -webkit-fill-available;
                                            border-radius: 12px;
                                            color: rgba(0, 0, 0, 0.87);
                                            box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);
                                            }" id="join-share-${key}" >เข้าร่วม</button></center>`

                                        const infowindow = new google.maps.InfoWindow({
                                            content: '',
                                            maxWidth: 500
                                        });

                                        console.log(shareAll[key]);

                                        const member_length = Object.keys(shareAll[key].member).length
                                        const max_number_value = shareAll[key].max_number.value

                                        marker.addListener('click', function (key) {

                                            infowindow.setContent(content)
                                            infowindow.open(map, marker);


                                            if (member_length > max_number_value) {
                                                $(`#join-share-${key}`).attr("disabled", true)
                                            }

                                        });

                                        $(document).on('click', `#join-share-${key}`, function () {
                                            onModelJoinShare(key)
                                           
                                        })

                                    }
                                })
                            // })
                    }}
                >
                    <SearchBar >
                        <SearchMap
                            onClick={onMenuSlide.bind(this)}
                            map={map}
                            {...props}

                        />
                    </SearchBar>
                    <VisibilityButton open={openVisibility} on={onVisibility.bind(this)} off={offVisibility.bind(this)} />
                    <Link to="/share_location">
                        <Button variant="contained" style={{ backgroundColor: '#ffffff' }} className={props.classes.fab}>
                            <AddIcon color="action" fontSize="large" />
                        </Button>
                    </Link>
                    {/* <ModelExitShare
                        uid={props.auth.uid}
                        share_id={openModelJoinShare.key}
                        share={shareId}
                        open={openModelJoinShare.bool}
                        onClose={offModelJoinShare}
                        {...props} /> */}
                </Map>
                <MenuSlide open={openMenuSlide} onClose={offMenuSlide.bind(this)} uid={props.auth.uid} />
            </StyleBaseLine>
        </Fragment>
    )

}

UserStatus.propTypes = {
    uid: PropTypes.string
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