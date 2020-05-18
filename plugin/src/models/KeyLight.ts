export interface KeyLight {
  lights: Light[];
  numberOfLights: number;
}

export interface Light {
  brightness: number;
  temperature: number;
  on: number;
}