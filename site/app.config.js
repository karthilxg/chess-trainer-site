import dotenv from 'dotenv'
import path from "path"
dotenv.config({ path: path.resolve(__dirname, '../.env') })
console.log("DJSU: ", process.env.DOJO_SERVER_URL)


export default {
  "name": "chess-dojo",
  "slug": "chess-dojo",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "updates": {
    "fallbackToCacheTimeout": 0
  },
  "assetBundlePatterns": ["**/*"],
  "ios": {
    "supportsTablet": true
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#FFFFFF"
    }
  },
  "web": {
    "favicon": "./assets/favicon.png",
    "build": {
      "babel": {
        "include": ["@ui-kitten/components"]
      }
    }
  },
  extra: {
    serverUrl: process.env.DOJO_SERVER_URL,
  },
};