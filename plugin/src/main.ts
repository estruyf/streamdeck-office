// import spotify from 'spotify-node-applescript';
import { BtnEvent, MessageEvent } from "./models/BtnEvent";
import { SpotifyBtn, SPOTIFY_PLAY, SPOTIFY_NEXT } from "./actions/SpotifyBtn";
import { SOUND_VOLUME, SoundBtn, SOUND_MICRO, SOUND_VOLUME_UP, SOUND_VOLUME_DOWN } from "./actions/SoundBtn";
import { LIFX_TOGGLE, LifxBtn } from "./actions/LifxBtn";
import { KEYLIGHT_POWER, KeyLightsBtn, KEYLIGHT_TEMP_UP, KEYLIGHT_TEMP_DOWN, KEYLIGHT_BRIGHT_UP, KEYLIGHT_BRIGHT_DOWN, KEYLIGHT_STATUS } from "./actions/KeyLightsBtn";
import { MSTEAMS_WEBCAM, MSTeamsBtn, MSTEAMS_MICRO } from "./actions/MSTeamsBtn";

export const CONFIG = {
  api: `http://0.0.0.0:2668`,
  spotify: {
    status: `/api/spotify/status`,
    play: `/api/spotify/play`,
    pause: `/api/spotify/pause`,
    next: `/api/spotify/next`
  },
  sound: {
    microphone: {
      status: `/api/sound/micro/status`,
      toggle: `/api/sound/micro/toggle`
    },
    volume: {
      status: `/api/sound/volume/status`,
      toggle: `/api/sound/volume/toggle`,
      up: `/api/sound/volume/up`,
      down: `/api/sound/volume/down`
    }
  },
  lifx: {
    status: `http://192.168.1.98:1338/state`,
    toggle: `http://192.168.1.98:1338/toggle`
  },
  msteams: {
    camera: `/api/msteams/webcam/toggle`,
    micro: `/api/msteams/micro/toggle`
  }
};

// Global cache
let cache = {};
// Global settings
let globalSettings = {};

// Setup the websocket and handle communication
(global as any).connectElgatoStreamDeckSocket = (inPort, inPluginUUID, inRegisterEvent, inInfo) =>{
  // Parse parameter from string to object
  const info = JSON.parse(inInfo);
  // const spotify = new Spotify();

  // Open the web socket to Stream Deck
  let playWs = new WebSocket("ws://127.0.0.1:2669");
  let ws = new WebSocket("ws://127.0.0.1:" + inPort);

  function registerPlugin() {
    const json = {
      "event": inRegisterEvent,
      "uuid": inPluginUUID
    };

    ws.send(JSON.stringify(json));
  };

  ws.onopen = () => { 
    // WebSocket is connected, send message
    registerPlugin();
  };

  ws.onclose = () => { 
    // Websocket is closed
  };

  ws.onmessage = async (evt: MessageEvent) => {
    const btnInfo: BtnEvent = JSON.parse(evt.data);

    if (btnInfo.action === SPOTIFY_PLAY) {
      SpotifyBtn.pushPlay(ws, playWs, btnInfo, inPort);
    } else if (btnInfo.action === SPOTIFY_NEXT) {
      SpotifyBtn.pushNext(btnInfo);
    } else if (btnInfo.action === SOUND_VOLUME) {
      SoundBtn.pushVolume(ws, btnInfo);
    } else if (btnInfo.action === SOUND_VOLUME_UP) {
      SoundBtn.pushVolumeUp(ws, btnInfo);
    } else if (btnInfo.action === SOUND_VOLUME_DOWN) {
      SoundBtn.pushVolumeDown(ws, btnInfo);
    } else if (btnInfo.action === SOUND_MICRO) {
      SoundBtn.pushMicro(ws, btnInfo);
    } else if (btnInfo.action === LIFX_TOGGLE) {
      LifxBtn.pushToggle(ws, btnInfo);
    } else if (btnInfo.action === KEYLIGHT_POWER) {
      KeyLightsBtn.pushToggle(ws, btnInfo);
    } else if (btnInfo.action === KEYLIGHT_TEMP_UP) {
      KeyLightsBtn.pushTempUp(ws, btnInfo);
    } else if (btnInfo.action === KEYLIGHT_TEMP_DOWN) {
      KeyLightsBtn.pushTempDown(ws, btnInfo);
    } else if (btnInfo.action === KEYLIGHT_BRIGHT_UP) {
      KeyLightsBtn.pushBrightUp(ws, btnInfo);
    } else if (btnInfo.action === KEYLIGHT_BRIGHT_DOWN) {
      KeyLightsBtn.pushBrightDown(ws, btnInfo);
    } else if (btnInfo.action === KEYLIGHT_STATUS) {
      KeyLightsBtn.initStatus(ws, btnInfo);
    } else if (btnInfo.action === MSTEAMS_WEBCAM) {
      MSTeamsBtn.pushWebcam(ws, btnInfo);
    } else if (btnInfo.action === MSTEAMS_MICRO) {
      MSTeamsBtn.pushMicro(ws, btnInfo);
    }
    
  };
}