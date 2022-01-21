import * as THREE from 'three'
import { createRef, Component, RefObject, TouchEvent, WheelEvent, ReactNode } from "react";
import {Canvas} from "@react-three/fiber";

import { TextRingVarR } from './TextRings'
import SetCamera from './setCamera';

import ConnectedInputsAsSeperateComponents from './ConnectedInputs';
import Slider from './Slider';
import { Vector2, Vector3 } from 'three';
import SendButton from './SendButton';


class ThreeJSStuff extends Component<any, any> {
  textRingsAmount: number = 2;
  connectedInputsAmount: number = 40;

  textRingRefs: RefObject<TextRingVarR>[] = Array.from(Array(this.textRingsAmount)).map(a => createRef());
  selectedRingRef: RefObject<TextRingVarR> = this.textRingRefs[0];

  //some custom components need refs, but get them on their own
  specialNeedsRefs: RefObject<Slider> = createRef();
  connectedInputsRef: RefObject<HTMLInputElement>[] = Array.from(Array(this.connectedInputsAmount)).map(a => createRef());
  //ref to the custom scroll bar
  ringScrollRef: RefObject<HTMLInputElement> = createRef();

  widthMeasuringDivRef: RefObject<HTMLDivElement> = createRef();
  //wether it is allowed to rotate camera around current ring
  rotating: boolean = true;

  state: Readonly<{
    cameraPos: THREE.Vector3,
  }>;

  //touch support
  touchPosPrevious: Vector2 | null = null;

  constructor(props: any) {
    super(props);

    this.state = {
      cameraPos: new THREE.Vector3()
    }
  }


  render(): ReactNode {
    this.updateScrollWheel();

    return (
      <span onWheel={(e: WheelEvent) => this.wheelEvent(e)} className='absolute w-screen h-screen touch-none'
        onTouchStart={(e: TouchEvent) => this.touchStart(e)} onTouchMove={(e: TouchEvent) => this.touchMove(e)}>
        <span ref={this.widthMeasuringDivRef} className='hidden '></span>

        {/*https://stackoverflow.com/questions/15935837/how-to-display-a-range-input-slider-vertically*/}
        <input type={"range"} ref={this.ringScrollRef} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.value === "0") e.target.value = (360 * 10).toString();
          this.setCameraDegree(-Number(e.target.value) * Math.PI * 2 / (10 * 360))
        }
        }
          min={0} max={360 * 10} defaultValue={360 * 10}
          className='z-50 scrollBar float-right' />


        <Canvas >
          {<color attach="background" args={["#000010"]} />}
          <ambientLight />

          <SetCamera position={this.state.cameraPos} target={this.selectedRingRef.current?.state.ringOrigin} />


          <TextRingVarR ref={this.textRingRefs[1]} ringOrigin={new THREE.Vector3(50, 0, 0)} opacityRefPoint={this.state.cameraPos}
          onSelect={()=>this.onselectContactMeRing()/*I dont understand why in onselectContactMeRing "this" is defined*/}>
            <button className='text-h2 border-2 border-h2 rounded-md hover:bg-h2 w-32 hover:text-black' onClick={() => this.changeToRing(0)}>previous</button>
            <span className='text-h1 text-2xl [opacity:inherit] w-32'>Contact Me</span>
            {
            ConnectedInputsAsSeperateComponents(this.connectedInputsAmount, this.widthMeasuringDivRef, this.connectedInputsRef,
              "focus:bg-[#19b2e020] bg-transparent text-primary [opacity:inherit] outline-hidden" +
              "border-solid border-2 border-t-0 border-b-0 border-h2 caret-h1")
              }
            <br />
            <SendButton connectedInputsRefArgs={this.connectedInputsRef}/>
            <br />
            <br />
          </TextRingVarR>


          <TextRingVarR ref={this.textRingRefs[0]} ringOrigin={new THREE.Vector3(0, 0, 0)} opacityRefPoint={this.state.cameraPos}>
            <button className='text-h2 border-2 border-h2 rounded-md hover:bg-h2 w-32 hover:text-black' onClick={() => this.changeToRing(1)}>next</button>

            <div className='text-h1 [opacity:inherit] w-32'>Herr Stöckle falls</div>
            <div className='text-h1 [opacity:inherit] w-32'>sie das sind, </div>
            <div className='text-h1 [opacity:inherit] w-32'>ja das ist nur</div>
            <div className='text-h1 [opacity:inherit] w-32'>Platzhaltertext,</div>
            <div className='text-h1 [opacity:inherit] w-32'>ja das wird sich</div>
            <div className='text-h1 [opacity:inherit] w-32'>bis Montag</div>
            <div className='text-h1 [opacity:inherit] w-32'> ändern</div>
            <div className='text-h1 [opacity:inherit] w-32'>und ja ich werde</div>
            <div className='text-h1 [opacity:inherit] w-32'> auf jeden Fall</div>
            <div className='text-h1 [opacity:inherit] w-32'> mich hinsetzen</div>
            <div className='text-h1 [opacity:inherit] w-32'> und Kommentare</div>
            <div className='text-h1 [opacity:inherit] w-32'> schreiben.</div>

            <br/>

            <div className='text-h2 text-xl [opacity:inherit] w-32'>The quick brown fox jumps over</div>
            <Slider ref={this.specialNeedsRefs} fillTime={1000} width={1000} height={30} maxValue={70}
              classNameContainer={"relative -left-14 top-1"}
              classNameFG={"bg-h2 [opacity:inherit] block rounded [top:-1px]"}
              classNameFGHover={"bg-transparent border-h2 border-r-2 [opacity:inherit] block rounded [top:-1px]"}
              classNameBG={"border-h2 border-2 w-32 h-8 rounded-md"} bgBorderWidth={2}>
              <div className='text-[8px] text-white transition duration-100 hover:scale-150 blackShadowOnhover'>a</div>
              <div className='text-[8px] text-white transition duration-100 hover:scale-150 blackShadowOnhover'>lazy</div>
              <div className='text-[8px] text-white transition duration-100 hover:scale-150 blackShadowOnhover'>dog</div>
            </Slider>

            <div className='text-primary [opacity:inherit] w-32'>asdasdasdadsas</div>
            <div className='text-primary [opacity:inherit] w-32'>dfdgdfg</div>
            <div className='text-primary [opacity:inherit] w-32'>vsdvxyy</div>

            <div className='text-primary [opacity:inherit] w-32'>kkkksdfsdfbv</div>
            <div className='text-primary [opacity:inherit] w-32'>aaaaaa</div>
            <div className='text-primary [opacity:inherit] w-32'>kjlxc xsbfdb</div>
            <div className='text-primary [opacity:inherit] w-32'>12332453546</div>
            <div className='text-primary [opacity:inherit] w-32'>püäpü+#dfg</div>
            <div className='text-primary [opacity:inherit] w-32'>,m.lk-klöoi</div>
            <div className='text-primary [opacity:inherit] w-32'>hu cxvbse </div>
            <div className='text-primary [opacity:inherit] w-32'>90570ßßß</div>
            <div className='text-primary [opacity:inherit] w-32'>+ü##+poötzhcxd</div>
            <div className='text-primary [opacity:inherit] w-32'>dfghsert32</div>
            <div className='text-primary [opacity:inherit] w-32'>mn.,iolö</div>
            <div className='text-primary [opacity:inherit] w-32'>qqewscxopkähj</div>

            <div className='text-primary [opacity:inherit] w-32'>kkkksdfsdfbv</div>
            <div className='text-primary [opacity:inherit] w-32'>aaaaaa</div>
            <div className='text-primary [opacity:inherit] w-32'>kjlxc xsbfdb</div>
            <div className='text-primary [opacity:inherit] w-32'>12332453546</div>
            <div className='text-primary [opacity:inherit] w-32'>püäpü+#dfg</div>
            <div className='text-primary [opacity:inherit] w-32'>,m.lk-klöoi</div>
            <div className='text-primary [opacity:inherit] w-32'>hu cxvbse </div>
            <div className='text-primary [opacity:inherit] w-32'>90570ßßß</div>
            <div className='text-primary [opacity:inherit] w-32'>+ü##+poötzhcxd</div>
            <div className='text-primary [opacity:inherit] w-32'>dfghsert32</div>
            <div className='text-primary [opacity:inherit] w-32'>mn.,iolö</div>
            <div className='text-primary [opacity:inherit] w-32'>qqewscxopkähj</div>

            <div className='text-primary [opacity:inherit] w-32'>adwtbxfddsg</div>
            <div className='text-primary [opacity:inherit] w-32'>uzkhncgaws</div>
            <div className='text-primary [opacity:inherit] w-32'>sdfpöovmxfbvd</div>
            <div className='text-primary [opacity:inherit] w-32'>esöpoi</div>
            <div className='text-primary [opacity:inherit] w-32'>nvbckjiuy78324</div>
            <div className='text-primary [opacity:inherit] w-32'>342098#</div>

          </TextRingVarR>

        </Canvas>
      </span>
    )
  }

  touchStart(e: TouchEvent) {
    this.touchPosPrevious = new Vector2(
      e.touches[0].pageX,//https://stackoverflow.com/questions/41993176/determine-touch-position-on-tablets-with-javascript,
      e.touches[0].pageY
    );
  }
  touchMove(e: TouchEvent) {
    if (this.touchPosPrevious) {
      const deltyY = Math.sign(e.changedTouches[0].pageY - this.touchPosPrevious.y);
      if (this.rotating) this.rotateCamera(-deltyY * 5, 1);

      this.touchPosPrevious = new Vector2(
        e.touches[0].pageX,//https://stackoverflow.com/questions/41993176/determine-touch-position-on-tablets-with-javascript,
        e.touches[0].pageY
      );
    }
  }

  wheelEvent(e: WheelEvent) {
    const delta = Math.sign(e.deltaY);
    if (this.rotating) this.rotateCamera(delta * 15, 1);
  }

  updateScrollWheel() {
    const currentDegree = ((Math.atan2(this.state.cameraPos.z, this.state.cameraPos.y)) / Math.PI) * 180;
    const posDegree = 360 - (currentDegree < 0 ? 360 + currentDegree : currentDegree);
    if (this.ringScrollRef.current) this.ringScrollRef.current.value = (posDegree * 10).toString();
  }


  async componentDidMount() {
    //for some reason the TextRings aren't rendered yet so the function "sleeps" until they are
    //also the radius is not calculated until the second render so the programm waits until the radius is calculated instead of 
    //waiting until the TextRings are rendered
    while (!this.textRingRefs[0].current?.state.radius) await new Promise(resolve => setTimeout(resolve, 1));

    this.setCameraDegree(0);

    await new Promise(resolve => setTimeout(resolve, 1000))
    //this.changeToRing(1)
  }


  async changeToRing(index: number) {
    if (this.textRingRefs[index]) {
      this.selectedRingRef = this.textRingRefs[index];

      if(this.selectedRingRef.current?.props.onSelect) this.selectedRingRef.current?.props.onSelect();

      const originalCamraPos = this.state.cameraPos,
        newCameraPos = this.calculateCameraPosBasedOnDegree(0);

      if (newCameraPos) {
        const time = 1;
        const clock = new THREE.Clock();
        clock.start();

        while (clock.getElapsedTime() < time) {
          const percentageOfWay = clock.elapsedTime / time;

          const cameraIntermediatePosition = originalCamraPos.clone().lerp(newCameraPos, percentageOfWay);
          this.setState({ cameraPos: cameraIntermediatePosition })

          await new Promise(res => setTimeout(res, 1))
        }

        this.setState({ cameraPos: newCameraPos })
      }
    }
  }


  rotateCamera(degree: number, time:number) {
    this.setCameraDegree(Math.atan2(this.state.cameraPos.z, this.state.cameraPos.y) + degree * Math.PI / 180);
  }

  setCameraDegree(degree: number) {
    const cameraPos = this.calculateCameraPosBasedOnDegree(degree);
    this.setState({ cameraPos });
  }

  calculateCameraPosBasedOnDegree(degree: number): Vector3 | null  {
    if (this.selectedRingRef.current) {
      const distCenter = this.selectedRingRef.current.state.radius + 5,
        ringOrigin = this.selectedRingRef.current.state.ringOrigin;

      return new THREE.Vector3(
        ringOrigin.x,
        Math.cos(degree) * distCenter + ringOrigin.y,
        Math.sin(degree) * distCenter + ringOrigin.z
      )

    } else return null;
  }

  onselectContactMeRing(){
    if(this.connectedInputsRef[0].current){
      this.connectedInputsRef[0].current.focus();
      //first time it adds a space for looks
      if(this.connectedInputsRef[0].current.value === "") this.connectedInputsRef[0].current.value = " ";
    }
  }
}


export default ThreeJSStuff;