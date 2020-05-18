import { BtnEvent } from "../models/BtnEvent";
import { CONFIG } from "../main";

export const SOUND_VOLUME = "com.estruyf.office.sound";
export const SOUND_MICRO = "com.estruyf.office.micro";

const STATES = {
  on: 0,
  off: 1
};

export class SoundBtn {
  
  public static pushVolume(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "willAppear") {
      this.initVolume(ws, btnInfo);
    } else if (btnInfo.event === "keyDown") {
      // Start playing
      this.toggleVolume(ws, btnInfo);
    }
  }

  public static pushMicro(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "willAppear") {
      this.initMicro(ws, btnInfo);
    } else if (btnInfo.event === "keyDown") {
      // Start playing
      this.toggleMicro(ws, btnInfo);
    }
  }

  private static async initVolume(ws: WebSocket, btnInfo: BtnEvent) {
    try {
      let btnState = {
        event: "setState",
        context: btnInfo.context,
        payload: {
          state: STATES.on
        }
      };

      const data = await fetch(`${CONFIG.api}${CONFIG.sound.volume.status}`);
      if (data && data.ok) {
        const status = await data.json();
        if (status) {
          btnState.payload.state = STATES.off
        }
      }

      if (ws) {
        ws.send(JSON.stringify(btnState));
      }
    } catch {

    }
  }

  private static async toggleVolume(ws: WebSocket, btnInfo: BtnEvent) {
    await fetch(`${CONFIG.api}${CONFIG.sound.volume.toggle}`);
    setTimeout(() => {
      this.initVolume(ws, btnInfo);
    }, 200);
  }

  private static async initMicro(ws: WebSocket, btnInfo: BtnEvent) {
    try {
      let btnState = {
        event: "setState",
        context: btnInfo.context,
        payload: {
          state: STATES.off
        }
      };

      const data = await fetch(`${CONFIG.api}${CONFIG.sound.microphone.status}`);
      if (data && data.ok) {
        const status = await data.json();
        if (status) {
          btnState.payload.state = STATES.on
        }
      }

      if (ws) {
        ws.send(JSON.stringify(btnState));
      }
    } catch {

    }
  }

  private static async toggleMicro(ws: WebSocket, btnInfo: BtnEvent) {
    await fetch(`${CONFIG.api}${CONFIG.sound.microphone.toggle}`);
    this.initMicro(ws, btnInfo);
  }
}