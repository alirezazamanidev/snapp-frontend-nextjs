import { LatLng } from "leaflet"

export interface Ride {
 id:string
 destinationLocation:LatLng
 pickupLocation:LatLng
 price:number
status:string
}