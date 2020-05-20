

export class VolumeImages {

  public static get status() {
    return `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#CC3363;}
	.st1{opacity:0.6;fill:#FFFFFF;enable-background:new    ;}
	.st2{fill:#FFFFFF;}
	.st3{fill:#FFFFFF;fill-opacity:0.5;}
	.st4{fill:none;stroke:#FFFFFF;stroke-width:5;stroke-miterlimit:10;}
</style>
<path class="st0" d="M244,256H12c-6.6,0-12-5.4-12-12V12C0,5.4,5.4,0,12,0h232c6.6,0,12,5.4,12,12v232C256,250.6,250.6,256,244,256z
	"/>
<g>
	<path class="st1" d="M132.7,51.8v108.5c0,6.9-8.4,10.3-13.2,5.5l-28.7-28.7H57.8c-4.3,0-7.7-3.5-7.7-7.7c0,0,0,0,0,0V82.8
		c0-4.3,3.5-7.7,7.7-7.7h33l28.7-28.7C124.3,41.5,132.7,44.9,132.7,51.8z"/>
	<path class="st2" d="M159.2,81.3c-3.8-2.1-8.5-0.7-10.5,3.1c-2.1,3.8-0.7,8.5,3.1,10.5l0,0c6.2,3.3,8.6,11,5.3,17.2
		c-1.2,2.2-3,4.1-5.3,5.3c-3.8,2.1-5.1,6.8-3.1,10.5c2.1,3.8,6.8,5.1,10.5,3.1c13.7-7.4,18.8-24.6,11.4-38.3
		C168,87.8,164,83.9,159.2,81.3L159.2,81.3z M177.3,55.6c-3.6-2.3-8.4-1.2-10.7,2.4c0,0,0,0,0,0.1c-2.3,3.6-1.2,8.4,2.4,10.8
		c20.6,13.1,26.7,40.3,13.6,60.9c-3.5,5.5-8.1,10.2-13.6,13.6c-3.6,2.3-4.7,7.1-2.4,10.8c2.3,3.6,7,4.7,10.7,2.4c0,0,0,0,0,0
		c27.9-17.7,36.1-54.7,18.3-82.5C190.9,66.6,184.7,60.3,177.3,55.6L177.3,55.6z"/>
</g>
<g>
	<rect x="38" y="188" width="VOLUME_WIDTH" height="23" fill="white" fill-opacity="0.5" stroke-opacity="0.8" class="volume-line" rx="9"/>
	<path class="st4" d="M209.1,212H45.8c-5.7,0-10.3-4.6-10.3-10.3v-4.3c0-5.7,4.6-10.3,10.3-10.3h163.3c5.7,0,10.3,4.6,10.3,10.3v4.3
		C219.5,207.4,214.8,212,209.1,212z"/>
</g>
</svg>
    `;
  }

  public static get muted() {
    return `
	<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
		viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">
 <style type="text/css">
	 .st0{fill:#CC3363;}
	 .st1{opacity:0.6;fill:#FFFFFF;enable-background:new    ;}
	 .st2{fill:#FFFFFF;}
 </style>
 <path class="st0" d="M244,256H12c-6.6,0-12-5.4-12-12V12C0,5.4,5.4,0,12,0h232c6.6,0,12,5.4,12,12v232C256,250.6,250.6,256,244,256z
	 "/>
 <g>
	 <path class="st1" d="M46,151v-46.5c0-4.3,3.5-7.7,7.7-7.7h33L115.4,68c4.8-4.8,13.2-1.4,13.2,5.5V182c0,6.9-8.4,10.3-13.2,5.5
		 l-28.7-28.7h-33C49.5,158.8,46,155.3,46,151C46,151,46,151,46,151z"/>
	 <path class="st2" d="M150.8,113c-2-2-2-5.3,0-7.4l7.4-7.4c2-2,5.3-2,7.4,0l14.7,14.7l14.7-14.7c2-2,5.3-2,7.4,0l7.4,7.4
		 c2,2,2,5.3,0,7.4l-14.7,14.7l14.7,14.7c2,2,2,5.3,0,7.4l-7.4,7.4c-2,2-5.3,2-7.4,0l-14.7-14.7l-14.7,14.7c-2,2-5.3,2-7.4,0
		 l-7.4-7.4c-2-2-2-5.3,0-7.4l14.7-14.7L150.8,113z"/>
 </g>
 </svg>
    `;
  }
}