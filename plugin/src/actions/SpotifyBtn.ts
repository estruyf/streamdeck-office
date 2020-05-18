import { BtnEvent } from "../models/BtnEvent";
import { CONFIG } from "../main";

export const SPOTIFY_PLAY = "com.estruyf.office.spotify.play";
export const SPOTIFY_NEXT = "com.estruyf.office.spotify.next";

const STATES = {
  playing: 0,
  paused: 1
};

export class SpotifyBtn {
    
  public static pushPlay(ws: WebSocket, btnInfo: BtnEvent, port: string) {
    if (btnInfo.event === "willAppear") {
      this.getInitialState(ws, btnInfo, port);
    } else if (btnInfo.event === "keyDown" && btnInfo.payload.state === STATES.paused) {
      // Start playing
      this.play();
    } else if (btnInfo.event  === "keyDown" && btnInfo.payload.state === STATES.playing) {
      // Stop playing
      this.pause();
    } else if (btnInfo.event  === "keyDown" && btnInfo.payload.state === STATES.playing) {
      // Stop playing
      this.pause();
    }
  }

  public static pushNext(btnInfo: BtnEvent) {
    if (btnInfo.event === "keyDown") {
      // Start playing
      this.next();
    }
  }

  private static async getInitialState(ws: WebSocket, btnInfo: BtnEvent, port: string) {
    try {
      let btnState = {
        event: "setState",
        context: btnInfo.context,
        payload: {
          state: STATES.paused
        }
      };

      const data = await fetch(`${CONFIG.api}${CONFIG.spotify.status}`);
      if (data && data.ok) {
        const status = await data.json();
        if (status && status.state && status.state === "playing") {
          btnState.payload.state = STATES.playing
        }
      }

      if (ws) {
        ws.send(JSON.stringify(btnState));
      }
    } catch {

    }
  }

  private static play() {
    fetch(`${CONFIG.api}${CONFIG.spotify.play}`);
  }

  private static pause() {
    fetch(`${CONFIG.api}${CONFIG.spotify.pause}`);
  }

  private static next() {
    fetch(`${CONFIG.api}${CONFIG.spotify.next}`);
  }
}