import { Injectable } from '@angular/core';
import { GoogleMaps,
         GoogleMap,
         GoogleMapsEvent,
         GoogleMapOptions
        } from '@ionic-native/google-maps';

 @Injectable()

export class GoogleMapHelper {
  map: GoogleMap;
  constructor() { }


  loadMap(options, canvas_id = 'map_canvas') {

    let mapOptions: GoogleMapOptions = options;

    this.map = GoogleMaps.create(canvas_id, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: 43.0741904,
              lng: -89.3809802
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
  }
}