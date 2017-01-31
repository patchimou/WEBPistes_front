import {SocketIoService} from "../sign-up/socket-io.service";
import {Subscription} from "rxjs/Subscription";
import {LocationTrackerService} from "./locationTracker.service";
import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapsLatLng,
    CameraPosition,
    GoogleMapsMarkerOptions,
    Geolocation,
    Camera,
    Geofence
} from "ionic-native";

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})
export class HomePage {

    private subscriptionPosition: Subscription;
    private lat: number;
    private lng: number;
    private map: GoogleMap;

    constructor(private locationService: LocationTrackerService,
                private platform: Platform,
                private socketIoService: SocketIoService) {
        this.platform.ready().then(() => {
            Geofence.initialize().then(
                () => {
                    for (let fence of this.locationService.fencesArray)
                        (Geofence.addOrUpdate(fence) as any).subscribe(
                            zone => this.onGeofenceZoneEntered(zone));
                },
                (err) => console.log(err)
            );
            this.locationService.startTracking();
        });
    }


    //============================================================================
    // life-cycle
    //============================================================================

    ngAfterViewInit() {
        this.socketIoService.setTeamColorTheme();
        this.loadMap();
        this.subscriptionPosition = this.locationService.positionUpdate.subscribe(position => {
            this.lat = position.lat;
            this.lng = position.lng;
            this.updateMap();
        });
    }

    //============================================================================
    // Utils
    //============================================================================

    stopTracking(): void {
        this.locationService.stopTracking();
    }

    loadMap(): void {
        // create a new map by passing HTMLElement
        let element: HTMLElement = document.getElementById('map');
        this.map = new GoogleMap(element);

        // listen to MAP_READY event
        this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

            Geolocation.getCurrentPosition().then((resp) => {
                let currentPosition = new GoogleMapsLatLng(resp.coords.latitude, resp.coords.longitude);

                let pos = {lat: resp.coords.latitude, lng: resp.coords.longitude};
                this.socketIoService.socket.emit("coords", pos);

                // create CameraPosition
                let position: CameraPosition = {
                    target: currentPosition,
                    zoom: 18,
                    tilt: 30
                };

                // move the map's camera to position
                this.map.moveCamera(position);

                // create new marker
                let markerOptions: GoogleMapsMarkerOptions = {
                    position: currentPosition,
                };

                this.map.addMarker(markerOptions);
            });

        });
    }

    updateMap(): void {
        this.map.clear();
        let currentPosition = new GoogleMapsLatLng(this.lat, this.lng);

        let position: CameraPosition = {
            target: currentPosition,
            zoom: 18,
            tilt: 30
        };

        this.map.moveCamera(position);

        let markerOptions: GoogleMapsMarkerOptions = {
            position: currentPosition,
        };
        this.map.addMarker(markerOptions);
    }

    fakeToGarbejaire() {
        let position = {lat: 43.622323, lng: 7.047055};
        this.socketIoService.socket.emit("coords", position);
    }

    takePicture() {

        let options = {
            destinationType: 0,
            correctOrientation: true,
            targetWidth: 1280,
            targetHeight: 720
        };

        Camera.getPicture(options).then(
            (imageData) => {
                let base64Image = 'data:image/jpeg;base64,' + imageData;
                let imageToSend = {file: base64Image};
                this.socketIoService.socket.emit("image", imageToSend);
            },
            (err) => {
                console.log("error taking picture",err);
            });
    }

    onGeofenceZoneEntered(zone: any) {
        console.log(zone);
    }
}
