import Constants from "expo-constants";
import Frisbee from "frisbee"

console.log("CONSTANT", Constants.manifest.extra.serverUrl)
export const api = new Frisbee({
  baseURI: Constants.manifest.extra.serverUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
