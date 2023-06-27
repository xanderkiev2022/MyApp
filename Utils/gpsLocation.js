import * as Location from 'expo-location';

export default async function gpsLocation() {
 try {
     const location = await Location.getCurrentPositionAsync({});
     const coords = {
       latitude: location.coords.latitude,
       longitude: location.coords.longitude,
     };
     const parsedLocation = await Location.reverseGeocodeAsync(coords);

     return {
       coords,
       parsedLocation,
     };
 } catch (error) {
    console.log('Error with getting location');
 }
}