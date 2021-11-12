import BackgroundGeolocation from "react-native-background-geolocation";

import { AppStore } from "~/Store";
import { AppPermissionSelectors } from "~/Store/Selectors";

import Permission from "./Permission";

export const getCurrentPosition = async (option = {}) => {
  const state = AppStore.getState();
  const hasHightGeolocationPermission =
    AppPermissionSelectors.hasThisPermission(Permission.GEOLOCATION_HIGH)(
      state
    );
  const hasLowGeolocationPermission = AppPermissionSelectors.hasThisPermission(
    Permission.GEOLOCATION_LOW
  )(state);
  const hasGeolocationPermission =
    hasHightGeolocationPermission || hasLowGeolocationPermission;

  if (hasGeolocationPermission) {
    const { coords } = await BackgroundGeolocation.getCurrentPosition({
      timeout: 10, // 3 second timeout to fetch location
      maximumAge: 180 * 1000, // Accept the last-known-location if not older than 30000 ms.
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_LOW, // Try to fetch a location with an accuracy of `100` meters.
      stationaryRadius: 100,
      samples: 1, // How many location samples to attempt.
      persist: true,
      ...option,
    });
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      speed: coords.speed,
      heading: coords.heading,
      altitude: coords.altitude,
    };
  } else {
    console.warn("missing permission!");
  }
  return {
    latitude: null,
    longitude: null,
    accuracy: null,
    speed: null,
    heading: null,
    altitude: null,
  };
};

export const getGeofences = async (option = {}) => {
  const existGeofences = await BackgroundGeolocation.getGeofences();

  return existGeofences;
};

export const addGeofences = async (newFences, successCb, failCb) => {
  const existGeofences = await BackgroundGeolocation.addGeofences(
    newFences,
    successCb,
    failCb
  );
  return existGeofences;
};

export default {
  getCurrentPosition,
  getGeofences,
  addGeofences,
};
