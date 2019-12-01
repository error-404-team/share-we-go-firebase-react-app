import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConnectApiMaps, { Map } from 'maps-google-react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import SearchBar from '../../../SearchBar';
import SearchMap from '../../../SearchMap';

const MapOffShare = (props) => {

  const [map, setMap] = useState(null);
  const [google, setGoogle] = useState(null);

  const latlng = {
    lat: 14.012107100000001,
    lng: 100.7210703
  };

  // const { classes } = props

  return (
    <React.Fragment>
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
      </Map>
    </React.Fragment>
  )
};

MapOffShare.propTypes = {
  isProfile: PropTypes.object,
  visibility: PropTypes.element,
  openMenuSlide: PropTypes.func,
  isLocation: PropTypes.object
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
})(withStyles(styles)(MapOffShare))