import { BtnEvent } from "../models/BtnEvent";
import { KeyLight, Light } from "../models/KeyLight";

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
      console.log(temperatureWidth)

      // Brightness
      const brightnessWidth = 1.79 * this.crntState.brightness;

      // Light state
      const lightState = this.crntState.on ? "#0D7D7B" : "#5D707F";
    
      const json = {
        "event": "setImage",
        "context": this.ctxStatusIcon,
        "payload": {
          "image": `data:image/svg+xml;charset=utf8,${statusSvg.replace("TEMPERATURE_WIDTH", `${temperatureWidth}`).replace("BRIGHTNESS_WIDTH", `${brightnessWidth}`).replace("LIGHT_STATE", `${lightState}`)}`,
          "target": 1
        }
      };

      ws.send(JSON.stringify(json));
    }
  }
}


const statusSvg = `
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
<path fill="LIGHT_STATE" d="M244,256H12c-6.6,0-12-5.4-12-12V12C0,5.4,5.4,0,12,0h232c6.6,0,12,5.4,12,12v232
	C256,250.6,250.6,256,244,256z"/>
<g>
	<rect x="38" y="87" width="TEMPERATURE_WIDTH" height="22" fill="white" fill-opacity="0.5" stroke-opacity="0.8" class="temperature-line" rx="9"/>
	<path fill="none" stroke="#FFFFFF" stroke-width="5" stroke-miterlimit="10" d="M209.2,110.2H45.8c-5.7,0-10.3-4.6-10.3-10.3v-4.3
		c0-5.7,4.6-10.3,10.3-10.3h163.3c5.7,0,10.3,4.7,10.3,10.3v4.3C219.5,105.5,214.9,110.2,209.2,110.2z"/>
</g>
<g>
	<rect x="38" y="147" width="BRIGHTNESS_WIDTH" height="23" fill="white" fill-opacity="0.5" stroke-opacity="0.8" class="brightness-line" rx="9"/>
	<path fill="none" stroke="#FFFFFF" stroke-width="5" stroke-miterlimit="10" d="M209.4,171H46.1c-5.7,0-10.3-4.6-10.3-10.3v-4.3
		c0-5.7,4.6-10.3,10.3-10.3h163.3c5.7,0,10.3,4.6,10.3,10.3v4.3C219.8,166.4,215.1,171,209.4,171z"/>
</g>
<g>
	<path opacity="0.6" fill="#FFFFFF" enable-background="new    " d="M152.2,212.5l-9.2-4.7l3.3-9.8c0.4-1.3-0.9-2.6-2.1-2.1
		l-9.8,3.3l-4.7-9.2c-0.4-0.9-1.4-1.1-2.3-0.7c-0.3,0.1-0.6,0.4-0.7,0.7l-4.7,9.2l-9.8-3.3c-1.3-0.4-2.6,0.9-2.1,2.1l3.3,9.8
		l-9.2,4.7c-0.9,0.4-1.1,1.4-0.7,2.3c0.1,0.3,0.4,0.6,0.7,0.7l9.2,4.7L110,230c-0.4,1.3,0.9,2.6,2.1,2.1l9.8-3.3l4.7,9.2
		c0.4,0.9,1.4,1.1,2.3,0.7c0.3-0.1,0.6-0.4,0.7-0.7l4.7-9.2l9.8,3.3c1.3,0.4,2.6-0.9,2.1-2.1l-3.3-9.8l9.2-4.7
		c0.9-0.4,1.1-1.4,0.9-2.3C152.8,213,152.5,212.7,152.2,212.5L152.2,212.5z M136.8,222.9c-4.8,4.8-12.9,4.8-17.8,0
		c-4.8-5-4.8-12.8,0-17.8c4.8-4.8,12.9-4.8,17.8,0C141.8,210.1,141.8,218.1,136.8,222.9z"/>
	<path fill="#FFFFFF" d="M137.4,214.1c0,5.3-4.3,9.4-9.4,9.4s-9.4-4.3-9.4-9.4c0-5.3,4.3-9.4,9.4-9.4S137.4,208.9,137.4,214.1z"/>
</g>
<g>
	<path opacity="0.6" fill="#FFFFFF" enable-background="new    " d="M139,45.1V28.6c0-6.1-4.9-11.2-11-11.2c-6.1,0-11,4.9-11,11.2
		v16.6c-1.9,2.5-3.2,5.5-3.2,8.9c0,7.8,6.4,14.2,14.2,14.2c7.8,0,14.2-6.4,14.2-14.2C142.2,50.7,140.9,47.5,139,45.1z M128,62
		c-4.4,0-7.8-3.5-7.8-8c0-2.5,1.2-4.8,3.2-6.4v-19c0-2.6,2.2-4.8,4.8-4.8c2.6,0,4.8,2.2,4.8,4.8v19c3.5,2.6,4.2,7.6,1.6,11
		C132.8,60.7,130.5,62,128,62z"/>
	<path fill="#FFFFFF" d="M129.5,49.5V28.6c0-0.9-0.7-1.6-1.6-1.6c-0.9,0-1.6,0.7-1.6,1.6v20.9c-2.5,0.9-3.8,3.6-2.9,6.1
		c0.9,2.5,3.6,3.8,6.1,2.9c2.5-0.9,3.8-3.6,2.9-6.1C131.9,51.1,130.9,49.9,129.5,49.5z"/>
</g>
</svg>
`;