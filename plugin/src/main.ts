// import spotify from 'spotify-node-applescript';
import { BtnEvent, MessageEvent } from "./models/BtnEvent";

// Test: http://localhost:23654/

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

    if (btnInfo.action === "com.estruyf.office.spotify.play") {
      if (btnInfo.event === "keyDown" && btnInfo.payload.state === 0) {
        // Start playing
        console.log(inPort, inPluginUUID, inRegisterEvent, inInfo)
        // spotify.play();
      } else {
        // Stop playing
      }
    }
    
  };
}