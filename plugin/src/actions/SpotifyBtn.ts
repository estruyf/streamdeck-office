import { BtnEvent } from "../models/BtnEvent";
import { CONFIG } from "../main";

export const SPOTIFY_PLAY = "com.estruyf.office.spotify.play";
export const SPOTIFY_NEXT = "com.estruyf.office.spotify.next";

const STATES = {
  on: 0,
  off: 1
};

export class SpotifyBtn {
    
  public static pushPlay(ws: WebSocket, playWs: WebSocket, btnInfo: BtnEvent, port: string) {
    if (btnInfo.event === "willAppear") {
      this.getInitialState(ws, playWs, btnInfo, port);
    } else if (btnInfo.event === "keyDown" && btnInfo.payload.state === STATES.off) {
      // Start playing
      this.play();
    } else if (btnInfo.event  === "keyDown" && btnInfo.payload.state === STATES.on) {
      // Stop playing
      this.pause();
    } else if (btnInfo.event  === "keyDown" && btnInfo.payload.state === STATES.off) {
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

  private static async getInitialState(ws: WebSocket, playWs: WebSocket, btnInfo: BtnEvent, port: string) {
    try {
      let btnState = {
        event: "setState",
        context: btnInfo.context,
        payload: {
          state: STATES.off
        }
      };

      const data = await fetch(`${CONFIG.api}${CONFIG.spotify.status}`);

      if (data && data.ok) {
        const status = await data.json();
        if (status && status.state && status.state === "playing") {
          btnState.payload.state = STATES.on
        }
      }

      if (ws) {
        ws.send(JSON.stringify(btnState));
      }

      if (playWs) {
        playWs.addEventListener('message', (event) => {
          if (event && event.data) {
            const stateInfo = JSON.parse(event.data);
            btnState.payload.state = stateInfo.state;
            ws.send(JSON.stringify(btnState));
          }
        });
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