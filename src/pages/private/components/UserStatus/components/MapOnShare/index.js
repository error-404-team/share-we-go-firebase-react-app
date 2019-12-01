import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConnectApiMaps, { Map } from 'maps-google-react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import $ from 'jquery';
import { withStyles } from '@material-ui/styles';
import SearchBar from '../../../SearchBar';
import SearchMap from '../../../SearchMap';


const MapOnShare = (props) => {

  const [map, setMap] = useState(null);
  const [google, setGoogle] = useState(null);

  const latlng = {
    lat: 14.012107100000001,
    lng: 100.7210703
  };

  return (
    <React.Fragment>
      {props.isProfile && props.isShare !== null
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

              setMap(map);
              setGoogle(google);

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

                };

                google.maps.event.addDomListener(div, "click", function (event) {

                  google.maps.event.trigger(self, "click");

                });

                var panes = this.getPanes();

                panes.overlayImage.appendChild(div);
              };

            };

            CustomMarker.prototype.draw = function () {
              // มี bug icon ไม่เกาะ map
              if (this.div) {
                // กำหนด ตำแหน่ง ของhtml ที่สร้างไว้
                let positionA = new google.maps.LatLng(this.latlng.lat, this.latlng.lng);

                this.pos = this.getProjection().fromLatLngToDivPixel(positionA);
                // // console.log(this.pos);
                this.div.style.left = this.pos.x + 'px';
                this.div.style.top = this.pos.y + 'px';
              };

            };

            CustomMarker.prototype.getPosition = function () {

              return this.latlng;

            };



            var myLatlng = new google.maps.LatLng(props.isLocation.coords.latitude, props.isLocation.coords.longitude);

            if (props.isProfile !== undefined) {

              var marker1 = new CustomMarker(
                myLatlng,
                map,
                {},
                props.isProfile.photoURL
              );

            } else {

              window.location.reload();

            };

            var pos = {
              lat: props.isLocation.coords.latitude,
              lng: props.isLocation.coords.longitude
            };

            marker1.latlng = { lat: pos.lat, lng: pos.lng };
            marker1.draw();
            map.setCenter(pos);

            // share
            if (props.isShare !== null) {
              Object.keys(props.isShare).map((key) => {
                // console.log(key); // all key
                // get.status.share(key).then(function (status) {
                if (props.isShare[key].status.value !== false) {
                  let latlng = new google.maps.LatLng(props.isShare[key].location.start_location.lat, props.isShare[key].location.start_location.lng);

                  const marker = new CustomMarker(
                    latlng,
                    map,
                    { marker_id: `${key}` },
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAACRklEQVRIie2Vu2tUQRSHz7iPgDEvA6K9teAfkMZCBYOFja/CJgQEDUEkoJWF4FqIraS1FauQRtQNpnBbFS18NLqKj9UYsi5G5bO455rDZO51btYQAv7gcmfPnDnfnNlz5opsBgFV4AzwEGgDS8AccARw6wUtAQ2y1QEWdCMnC21EM7oKvAWaQA2o6lyP2l4Cx4Ed+pxQm68ZYGssuBYIUPM2Vg6sKwO9wIAe+3Nd+xloAfeAQ3ngZgDcjD6ylTjDwKNArMvrCtZYFWAI2AVMAT803urMM476is4dCMz5WgaeAKfxikvhAHdD4KrCm5jiAhxwJwJsdc2LvVPtX4scWxnojfDrAcaAX/rsMXNDCu4AW6LhRQTcUsgNb1Ov1D5mnW0PQ9IKt4FTwLDxO6z/4/0c8KjGWAS2Gft+tT+zzqHCSvUTqJPcSqnmcsAV4IOfHUmvA3Ssc6iVUn0344/AWaCi684D74GnwAPgJkkF19W/YRgjoYzz1A8cBc4Bg+pfAiZZ6c887dM1x/T3VBQ4cJQHgccRwFQdYK+u3Y3t8RgwcAmYLwC0ms0qiBhwrC6QFNJFY1u0PGeDBnckIs459zcfT33OuSWgT0T+ANM4IiL2BpmPDBqjCZL+nchy8C/yNKPrOjcpsqaMwzCT8aqPuuqFv6l/rSzwp40CtzLsX/TdLyIlHbdFZFnHCyKCvtsiMlIUHMzYObc9K1BIeTWR9V1sKbxbvTHj13bCz7guyTG+k+TIGiLyrQvwuIhMa6zxLuL819r1G2V6qhlNJzPyAAAAAElFTkSuQmCC"
                  )

                  var pos = {
                    lat: props.isShare[key].location.start_location.lat,
                    lng: props.isShare[key].location.start_location.lng
                  };

                  marker.latlng = { lat: pos.lat, lng: pos.lng };

                  marker.draw();


                  map.setCenter(pos);


                  const content = `
                                          <center>
                                          <h2>ข้อมูลการแชร์</h2>
                                          </center>
                                          <hr></hr>
                                          <u style="font-size: 15px">ต้นทาง: </u><u>${props.isShare[key].location.start_address}</u><b></b>
                                          <br></br>
                                          <u style="font-size: 15px">ปลายทาง: </u><u>${props.isShare[key].location.end_address}</u><b></b>
                                          <br></br>
                                          <u style="font-size: 15px">เริ่มแชร์เมื่อ: </u><u>${props.isShare[key].date.start_time.value}</<u><b></b>
                                          <br></br>
                                          <u style="font-size: 15px">ปิดแชร์เวลา: </u><u>${props.isShare[key].date.end_time.value}</<u><b></b>
                                          <br></br>
                                          <u style="font-size: 15px">ต้องการผู้เดินทางเพิ่ม: </u><u>${Object.keys(props.isShare[key].member).length - 1} </<u><b>/ ${props.isShare[key].max_number.value} คน </b>
                                          <br></br>
                                          <u style="font-size: 15px">เดินทางกับเพศ: </u><u>${props.isShare[key].sex.value}</<u><b> </b>
                                          <hr></hr>
                                          <center><button style="background-color: #ffffff;
                                          font-size: 17px;
                                          width: -webkit-fill-available;
                                          border-radius: 12px;
                                          color:  #ffffff;
                                          box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);
                                          background-color: rgb(39, 77, 125);
                                          " id="join-share-${key}" ${`${Object.keys(props.isShare[key].member).length - 1}` === props.isShare[key].max_number.value ? "disabled='disabled'" : null} >เข้าร่วม</button></center>`

                  const infowindow = new google.maps.InfoWindow({
                    content: '',
                    maxWidth: 500
                  });

                  marker.addListener('click', function (key) {

                    infowindow.setContent(content);
                    infowindow.open(map, marker);

                  });

                  $(document).on('click', `#join-share-${key}`, function () {

                    // console.time('ฉันคาดว่า 🤔 status => uid => member ใช้เวลาในการ อัพเดต ไป');

                    props.db.database().ref(`status/${props.isAuth.uid}/member`).update({
                      share_id: key,
                      uid: props.isAuth.uid,
                      value: true
                    }).then(() => {

                      // console.log('อัพเดต status => key => member => uid เสร็จสิ้น ✔');

                    });

                    // console.timeEnd('ฉันคาดว่า 🤔 status => uid => member ใช้เวลาในการ อัพเดต ไป');
                    // console.time('ฉันคาดว่า 🤔 share => key => member => uid ใช้เวลาในการ อัพเดต ไป');

                    props.db.firestore().collection(`share`).doc(key).update({
                      member: {
                        ...props.isShare[key].member,
                        [props.isAuth.uid]: {
                          share_id: key,
                          uid: props.isAuth.uid,
                          photoURL: props.isProfile.photoURL,
                          displayName: props.isProfile.displayName
                        }
                      }
                    }).then(() => {

                      // console.log('อัพเดต share => key => member => uid เสร็จสิ้น ✔');

                      window.location.reload();

                    });

                    // console.timeEnd('ฉันคาดว่า 🤔 share => key => member => uid ใช้เวลาในการ อัพเดต ไป');

                  })

                }
              })
            }
            // })
          }}
        >
          <SearchBar >
            <SearchMap
              onClick={props.openMenuSlide}
              map={map}
              google={google}
              {...props}

            />
          </SearchBar>
          {/* <VisibilityButton open={openVisibility} on={onVisibility} off={offVisibility} /> */}
          {props.visibility}
          <Link to="/share_location">
            <Button variant="contained" style={{ backgroundColor: '#274D7D' }} className={props.classes.fab}>
              <snap style={{ color: 'white' }}>สร้างการแชร์เส้นทาง</snap>
            </Button>
          </Link>
        </Map>)
        : (<React.Fragment>ไม่มีข้อมูลการเเชร์</React.Fragment>)
      }
    </React.Fragment>
  )
};

MapOnShare.propTypes = {
  isProfile: PropTypes.object,
  visibility: PropTypes.element,
  isShare: PropTypes.object,
  isAuth: PropTypes.object,
  openMenuSlide: PropTypes.func,
  isLocation: PropTypes.object,
  db: PropTypes.object
};

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
})(withStyles(styles)(MapOnShare))