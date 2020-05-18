import { BtnEvent } from "../models/BtnEvent";
import { KeyLight, Light } from "../models/KeyLight";

export const KEYLIGHT_POWER = "com.estruyf.office.keylight.power";
export const KEYLIGHT_TEMP_UP = "com.estruyf.office.keylight.temperature.up";
export const KEYLIGHT_TEMP_DOWN = "com.estruyf.office.keylight.temperature.down";
export const KEYLIGHT_BRIGHT_UP = "com.estruyf.office.keylight.brightness.up";
export const KEYLIGHT_BRIGHT_DOWN = "com.estruyf.office.keylight.brightness.down";

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
  
  /**
   * Toggle the lights
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushToggle(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event === "willAppear") {
      this.getInitialState(ws, btnInfo);
    } else if (btnInfo.event === "keyDown") {
      this.toggle(ws, btnInfo);
    }
  }

  /**
   * Descrease light temprature - 143 min
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushTempDown(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event  === "keyDown") {
      this.crntState.temperature = this.crntState.temperature - 10
      this.crntState.temperature = this.crntState.temperature <= 143 ? 143 : this.crntState.temperature;
      this.putLights(this.getLightWrapper(this.crntState));
    }
  }
  
  /**
   * Increase light temprature - 344 max
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushTempUp(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event  === "keyDown") {
      // Add temperature, and check if max value has been reached
      this.crntState.temperature = this.crntState.temperature + 10
      this.crntState.temperature = this.crntState.temperature >= 344 ? 344 : this.crntState.temperature;
      this.putLights(this.getLightWrapper(this.crntState));
    }
  }

  /**
   * Brightness down - min 0
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushBrightDown(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event  === "keyDown") {
      this.crntState.brightness = this.crntState.brightness - 10
      this.crntState.brightness = this.crntState.brightness <= 3 ? 3 : this.crntState.brightness;
      this.putLights(this.getLightWrapper(this.crntState));
    }
  }

  /**
   * Brightness up - max 100
   * 
   * @param ws 
   * @param btnInfo 
   */
  public static pushBrightUp(ws: WebSocket, btnInfo: BtnEvent) {
    if (btnInfo.event  === "keyDown") {
      this.crntState.brightness = this.crntState.brightness + 10
      this.crntState.brightness = this.crntState.brightness >= 100 ? 100 : this.crntState.brightness;
      this.putLights(this.getLightWrapper(this.crntState));
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
    this.putLights(this.getLightWrapper(this.crntState));
  }

  /**
   * Send the PUT request to the lights
   * 
   * @param data 
   */
  private static async putLights(data: KeyLight) {
    await fetch(`${KEYLIGHT_API.lights.left}/${KEYLIGHT_API.endpoints.lights}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
    return await fetch(`${KEYLIGHT_API.lights.right}/${KEYLIGHT_API.endpoints.lights}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
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
}
