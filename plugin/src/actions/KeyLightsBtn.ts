import { BtnEvent } from "../models/BtnEvent";
import { KeyLight, Light } from "../models/KeyLight";
import { KeyLightImages } from "../images/KeyLightImages";

export const KEYLIGHT_POWER = "com.estruyf.office.keylight.power";
export const KEYLIGHT_TEMP_UP = "com.estruyf.office.keylight.temperature.up";
export const KEYLIGHT_TEMP_DOWN = "com.estruyf.office.keylight.temperature.down";
export const KEYLIGHT_BRIGHT_UP = "com.estruyf.office.keylight.brightness.up";
export const KEYLIGHT_BRIGHT_DOWN = "com.estruyf.office.keylight.brightness.down";
export const KEYLIGHT_STATUS = "com.estruyf.office.keylight.status";

const KEYLIGHT_API = {
  lights: {
    left: `http://192.168.1.102:9123`,
    right: `http://192.168.1.103:9123`
  },
  endpoints: {
    lights: `elgato/lights`
  }
};

const STATES = {
  on: 0,
  off: 1
};

export class KeyLightsBtn {
  private static crntState: Light = null;
  private static ctxStatusIcon: string = null;

  private static ctxActionBtns = {
    toggle: null,
    tempDown: null,
    tempUp: null,
    brightnessDown: null,
    brightnessUp: null
  }
  
  /**
   * Toggle the lights
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushToggle(ws: WebSocket, btnInfo: BtnEvent) {
    this.ctxActionBtns.toggle = btnInfo.context;
    if (btnInfo.event === "willAppear") {
      this.getInitialState(ws, btnInfo);
    } else if (btnInfo.event === "keyDown") {
      this.toggle(ws, btnInfo);
    }
  }

  /**
   * Init status button
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static initStatus(ws: WebSocket, btnInfo: BtnEvent) {
    this.ctxStatusIcon = btnInfo.context;
    this.setStatusIcon(ws);
  }

  /**
   * Descrease light temprature - 143 min
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushTempDown(ws: WebSocket, btnInfo: BtnEvent) {
    this.ctxActionBtns.tempDown = btnInfo.context;
    if (btnInfo.event  === "keyDown") {
      this.crntState.temperature = this.crntState.temperature - 10
      this.crntState.temperature = this.crntState.temperature <= 143 ? 143 : this.crntState.temperature;
      this.putLights(ws, this.getLightWrapper(this.crntState));
    }
  }
  
  /**
   * Increase light temprature - 344 max
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushTempUp(ws: WebSocket, btnInfo: BtnEvent) {
    this.ctxActionBtns.tempUp = btnInfo.context;
    if (btnInfo.event  === "keyDown") {
      // Add temperature, and check if max value has been reached
      this.crntState.temperature = this.crntState.temperature + 10
      this.crntState.temperature = this.crntState.temperature >= 344 ? 344 : this.crntState.temperature;
      this.putLights(ws, this.getLightWrapper(this.crntState));
    }
  }

  /**
   * Brightness down - min 0
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushBrightDown(ws: WebSocket, btnInfo: BtnEvent) {
    this.ctxActionBtns.brightnessDown = btnInfo.context;
    if (btnInfo.event  === "keyDown") {
      this.crntState.brightness = this.crntState.brightness - 10
      this.crntState.brightness = this.crntState.brightness <= 3 ? 3 : this.crntState.brightness;
      this.putLights(ws, this.getLightWrapper(this.crntState));
    }
  }

  /**
   * Brightness up - max 100
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushBrightUp(ws: WebSocket, btnInfo: BtnEvent) {
    this.ctxActionBtns.brightnessUp = btnInfo.context;
    if (btnInfo.event  === "keyDown") {
      this.crntState.brightness = this.crntState.brightness + 10
      this.crntState.brightness = this.crntState.brightness >= 100 ? 100 : this.crntState.brightness;
      this.putLights(ws, this.getLightWrapper(this.crntState));
    }
  }


  /**
   * Retrieve the initial state of the Key Lights
   * 
   * @param ws 
   * @param btnInfo 
   */
  private static async getInitialState(ws: WebSocket, btnInfo: BtnEvent) {
    try {
      const dataLeft = await fetch(`${KEYLIGHT_API.lights.left}/${KEYLIGHT_API.endpoints.lights}`); 
      const dataRight = await fetch(`${KEYLIGHT_API.lights.right}/${KEYLIGHT_API.endpoints.lights}`);

      if (dataLeft && dataLeft.ok && dataRight && dataRight.ok) {
        const statusLeft: KeyLight = await dataLeft.json();
        const statusRight: KeyLight = await dataRight.json();

        if (statusLeft.lights.length > 0 && statusRight.lights.length > 0) {
          const leftLight = statusLeft.lights[0];
          const rightLight = statusRight.lights[0];

          this.crntState = leftLight;
          let btnState = {
            event: "setState",
            context: btnInfo.context,
            payload: {
              state: (leftLight.on && rightLight.on) ? STATES.on : STATES.off 
            }
          };

          if (ws) {
            ws.send(JSON.stringify(btnState));
            this.setStatusIcon(ws);
          }
        }
      }
    } catch {

    }
  }

  /**
   * Toggle the key lights on/off state
   * 
   * @param ws 
   * @param btnInfo 
   */
  private static async toggle(ws: WebSocket, btnInfo: BtnEvent) {
    this.crntState.on = this.crntState.on === 1 ? 0 : 1;
    this.putLights(ws, this.getLightWrapper(this.crntState));
  }

  /**
   * Send the PUT request to the lights
   * 
   * @param data 
   */
  private static async putLights(ws: WebSocket, data: KeyLight) {
    await fetch(`${KEYLIGHT_API.lights.left}/${KEYLIGHT_API.endpoints.lights}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
    await fetch(`${KEYLIGHT_API.lights.right}/${KEYLIGHT_API.endpoints.lights}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });

    this.setStatusIcon(ws);
  }

  /**
   * Returns the wrapper for the light
   * 
   * @param lightState 
   */
  private static getLightWrapper(lightState: Light): KeyLight {
    return {
      lights: [lightState],
      numberOfLights: 1
    };
  }

  /**
   * Update the status icon
   * 
   * @param ws 
   */
  private static setStatusIcon(ws: WebSocket) {
    if (this.ctxStatusIcon && this.crntState) {
      // Temperature
      const temperatureWidth = (1.79 * ((this.crntState.temperature - 143)/201)) * 100;

      // Brightness
      const brightnessWidth = 1.79 * this.crntState.brightness;

      // Light state
      const lightState = this.crntState.on ? "#0D7D7B" : "#494850";
    
      const json = {
        "event": "setImage",
        "context": this.ctxStatusIcon,
        "payload": {
          "image": `data:image/svg+xml;charset=utf8,${KeyLightImages.status.replace("TEMPERATURE_WIDTH", `${temperatureWidth}`).replace("BRIGHTNESS_WIDTH", `${brightnessWidth}`).replace("LIGHT_STATE", `${lightState}`)}`,
          "target": 1
        }
      };

      ws.send(JSON.stringify(json));
    }

    if (this.ctxActionBtns && this.crntState) {
      const lightState = this.crntState.on ? "#0D7D7B" : "#494850";
      this.setBackgroundColor(ws, KeyLightImages.tempDown.replace("BACKGROUND_COLOR", lightState), this.ctxActionBtns.tempDown);
      this.setBackgroundColor(ws, KeyLightImages.tempUp.replace("BACKGROUND_COLOR", lightState), this.ctxActionBtns.tempUp);
      this.setBackgroundColor(ws, KeyLightImages.brightnessDown.replace("BACKGROUND_COLOR", lightState), this.ctxActionBtns.brightnessDown);
      this.setBackgroundColor(ws, KeyLightImages.brightnessUp.replace("BACKGROUND_COLOR", lightState), this.ctxActionBtns.brightnessUp);
    }
  }

  /**
   * Set the background color of the action buttons
   * 
   * @param ws 
   * @param lightState 
   */
  static setBackgroundColor(ws: WebSocket, img: string, ctx: string) {
    const json = {
      "event": "setImage",
      "context": ctx,
      "payload": {
        "image": `data:image/svg+xml;charset=utf8,${img}`,
        "target": 1
      }
    };

    ws.send(JSON.stringify(json));
  }
}


