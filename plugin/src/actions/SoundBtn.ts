import { BtnEvent } from "../models/BtnEvent";
import { CONFIG } from "../main";
import { VolumeStatus } from "../models/VolumeStatus";
import { VolumeImages } from "../images/VolumeImages";

export const SOUND_VOLUME = "com.estruyf.office.sound";
export const SOUND_VOLUME_UP = "com.estruyf.office.sound.up";
export const SOUND_VOLUME_DOWN = "com.estruyf.office.sound.down";
export const SOUND_MICRO = "com.estruyf.office.micro";

const STATES = {
  on: 0,
  off: 1
};

export class SoundBtn {
  private static ctxStatusBtn: string = null;
  private static crntMuteStatus: string = null;
  
  /**
   * Push the volume/mute button
   * @param ws 
   * @param btnInfo 
   */
  public static pushVolume(ws: WebSocket, btnInfo: BtnEvent) {
    this.ctxStatusBtn = btnInfo.context;
    if (btnInfo.event === "willAppear") {
      this.initVolume(ws);
    } else if (btnInfo.event === "keyDown") {
      // Start playing
      this.toggleVolume(ws, btnInfo);
    }
  }

  /**
   * Push the microphone button
   * @param ws 
   * @param btnInfo 
   */
  public static pushMicro(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "willAppear") {
      this.initMicro(ws, btnInfo);
    } else if (btnInfo.event === "keyDown") {
      // Start playing
      this.toggleMicro(ws, btnInfo);
    }
  }

  /**
   * Push the volume down button
   * @param ws 
   * @param btnInfo 
   */
  public static async pushVolumeDown(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "keyDown") {
      const result = await fetch(`${CONFIG.api}${CONFIG.sound.volume.down}`);
      if (result && result.ok) {
        this.initVolume(ws, await result.json());
      }
    }
  }

  /**
   * Push the volume up button
   * @param ws 
   * @param btnInfo 
   */
  public static async pushVolumeUp(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "keyDown") {
      const result = await fetch(`${CONFIG.api}${CONFIG.sound.volume.up}`);
      if (result && result.ok) {
        this.initVolume(ws, await result.json());
      }
    }
  }

  private static async initVolume(ws: WebSocket, volume: VolumeStatus = null) {
    try {
      if (volume) {
        this.setStatusIcon(ws, volume);
      } else {
        const data = await fetch(`${CONFIG.api}${CONFIG.sound.volume.status}`);
        if (data && data.ok) {
          const status: VolumeStatus = await data.json();
          this.crntMuteStatus = status.muted;
          if (ws) {
            this.setStatusIcon(ws, status);
          }
        }
      }
    } catch {
      console.log('Something failed')
    }
  }

  private static async toggleVolume(ws: WebSocket, btnInfo: BtnEvent) {
    await fetch(`${CONFIG.api}${CONFIG.sound.volume.toggle}`);
    this.initVolume(ws);
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
  
  /**
   * Update the status icon
   * 
   * @param ws 
   */
  private static setStatusIcon(ws: WebSocket, status: VolumeStatus) {
    if (this.ctxStatusBtn) {
      // Volume width
      const volumeWidth = 1.8 * status.volume;
    
      let json = {
        "event": "setImage",
        "context": this.ctxStatusBtn,
        "payload": {
          "image": null,
          "target": 1
        }
      };

      if (this.crntMuteStatus && this.crntMuteStatus === "true") {
        json.payload.image = `data:image/svg+xml;charset=utf8,${VolumeImages.muted}`;
      } else {
        json.payload.image = `data:image/svg+xml;charset=utf8,${VolumeImages.status.replace("VOLUME_WIDTH", `${volumeWidth}`)}`;
      }

      ws.send(JSON.stringify(json));
    }
  }
}