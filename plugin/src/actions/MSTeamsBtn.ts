import { BtnEvent } from "../models/BtnEvent";
import { CONFIG } from "../main";

export const MSTEAMS_WEBCAM = "com.estruyf.office.msteams.webcam";
export const MSTEAMS_MICRO = "com.estruyf.office.msteams.micro";

export class MSTeamsBtn {

  /**
   * Webcam button
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushWebcam(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "keyDown") {
      fetch(`${CONFIG.api}${CONFIG.msteams.camera}`);
    }
  }

  /**
   * Micro button
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushMicro(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "keyDown") {
      fetch(`${CONFIG.api}${CONFIG.msteams.micro}`);
    }
  }
  
}