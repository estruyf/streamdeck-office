import { BtnEvent } from "../models/BtnEvent";
import { CONFIG } from "../main";

export const LIFX_TOGGLE = "com.estruyf.office.lifx.switch";

const STATES = {
  on: 0,
  off: 1
};

export class LifxBtn {
    
  public static pushToggle(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "willAppear") {
      this.getInitialState(ws, btnInfo);
    } else if (btnInfo.event === "keyDown") {
      // Start playing
      this.toggle(ws, btnInfo);
    }
  }

  private static async getInitialState(ws: WebSocket, btnInfo: BtnEvent) {
    try {
      let btnState = {
        event: "setState",
        context: btnInfo.context,
        payload: {
          state: STATES.on
        }
      };

      const data = await fetch(CONFIG.lifx.status);
      if (data && data.ok) {
        const lightState = await data.json();
        if (lightState && lightState.power) {
          btnState.payload.state = STATES.on
        }
      }

      if (ws) {
        ws.send(JSON.stringify(btnState));
      }
    } catch {

    }
  }

  private static async toggle(ws: WebSocket, btnInfo: BtnEvent) {
    const data = await fetch(CONFIG.lifx.toggle);
    
    if (data && data.ok) {
      const status = await data.text();
      let btnState = {
        event: "setState",
        context: btnInfo.context,
        payload: {
          state: status.toLowerCase() === "turned on" ? STATES.on : STATES.off
        }
      };
      if (ws) {
        ws.send(JSON.stringify(btnState));
      }
    }
  }
}