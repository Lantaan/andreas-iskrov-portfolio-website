import * as THREE from 'three'
import React, { Suspense, useRef } from "react";
import {
  Canvas,
  useLoader
} from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useGLTF } from '@react-three/drei'

import TextMesh from './TextObjects'
import { TextRingVarR } from './TextRings'
import SetCamera from './setCamera';
import ConnectedInputs from './ConnectedInputs';

import Monke from './Monke'
import MeshToVertexSpheres from './MeshToVertexSpheres';
import ConnectedInputsAsSeperateComponents from './ConnectedInputs';
import Star from './Star';
import StarSim from './StarSim';
import Slider from './Slider';


class ThreeJSStuff extends React.Component/*<any, any>*/ {
  textRingRefs/*: React.RefObject<TextRingVarR>[]*/ = Array.from(Array(2)).map(a => React.createRef());
  selectedRingRef/*: React.RefObject<TextRingVarR>*/ = this.textRingRefs[0];

  specialNeedsRefs = React.createRef();

  ringScrollRef/*: React.RefObject<HTMLInputElement>*/ = React.createRef();

  widthMeasuringDivRef/*: React.RefObject<HTMLDivElement>*/ = React.createRef();

  monkeRef/*: React.RefObject<any>*/ = React.createRef();

  rotating/*:boolean*/ = false;

  state/*: Readonly<{
    cameraPos: THREE.Vector3,
  }>*/;

  constructor(props/*: any*/) {
    super(props);

    this.state = {
      cameraPos: new THREE.Vector3()
    }
  }


  render()/*: React.ReactNode*/ {
    this.updateScrollWheel();

    return (
      <span onWheel={(e/*: React.WheelEvent*/) => this.wheelEvent(e)} className='absolute w-screen h-screen' >
        <span ref={this.widthMeasuringDivRef} className='hidden '></span>

        {/*https://stackoverflow.com/questions/15935837/how-to-display-a-range-input-slider-vertically*/}
        {/*https://stackoverflow.com/questions/40275891/how-to-reverse-the-direction-in-html5-range-input/40275954*/}
        <input type={"range"} ref={this.ringScrollRef} orient="vertical" onChange={(e/*: React.ChangeEvent<HTMLInputElement>*/) => {
          if (e.target.value === "0") e.target.value = (360 * 10).toString();
          this.setCameraDegree(-Number(e.target.value) * Math.PI * 2 / (10 * 360))
        }
        }
          min={0} max={360 * 10} defaultValue={360 * 10}
          className='z-50 scrollBar float-right' />


        <Canvas >
          {<color attach="background" args={["black"]} />}

          <SetCamera position={this.state.cameraPos} target={this.selectedRingRef.current?.state.ringOrigin} />

          {/*https://blog.logrocket.com/configure-3d-models-react-three-fiber/*/}
          {/*<Suspense fallback={null}>
            <Monke ref={this.monkeRef} />
            <MeshToVertexSpheres position={new THREE.Vector3(5, 0, 0)} mesh={this.monkeRef.current} />
      </Suspense>*/}
          {/*<StarSim starAmount={100}/>*/}





          <TextRingVarR ref={this.textRingRefs[0]} ringOrigin={new THREE.Vector3(50, 0, 0)} opacityRefPoint={this.state.cameraPos}>
            <span>contact me</span>
            {ConnectedInputsAsSeperateComponents(40, this.widthMeasuringDivRef,
              "bg-transparent text-sky-500 [opacity:inherit] outline-none " +
              "border-solid border-2 border-t-0 border-b-0 border-sky-500")}
          </TextRingVarR>

          {/*<TextRingVarR ref={this.textRingRefs[1]} ringOrigin={new THREE.Vector3(15, 0, 0)} opacityRefPoint={this.state.cameraPos}>{
            Array.from(Array(30)).map(a => <div className='bg-transparent text-white [opacity:inherit]' key={Math.random()}>{Math.random().toString()}</div>)
          }</TextRingVarR>*/}<TextRingVarR ref={this.textRingRefs[0]} ringOrigin={new THREE.Vector3(0, 0, 0)} opacityRefPoint={this.state.cameraPos}>
            <div className='text-fuchsia-600 [opacity:inherit] w-32'>About Me</div>

            <Slider ref={this.specialNeedsRefs} fillTime={1000} width={1000} height={30} maxValue={70}
              classNameContainer={"relative -left-14 top-1"}
              classNameFG={"bg-sky-600 [opacity:inherit] block"}
              classNameFGHover={"bg-transparent border-sky-600 border-r-2 [opacity:inherit] block"}
              classNameBG={"border-sky-600 border-2 w-32 h-8"} bgBorderWidth={2}>
              <div className='text-[8px] text-white transition duration-100 hover:scale-150 blackShadowOnhover'>aaaad</div>
              <div className='text-[8px] text-white transition duration-100 hover:scale-150 blackShadowOnhover'>b</div>
              <div className='text-[8px] text-white transition duration-100 hover:scale-150 blackShadowOnhover'>c</div>
            </Slider>

            <div className='text-sky-500 [opacity:inherit] w-32'>asdasdasdadsas</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>dfdgdfg</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>vsdvxyy</div>

            <div className='text-sky-500 [opacity:inherit] w-32'>kkkksdfsdfbv</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>aaaaaa</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>kjlxc xsbfdb</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>12332453546</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>püäpü+#dfg</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>,m.lk-klöoi</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>hu cxvbse </div>
            <div className='text-sky-500 [opacity:inherit] w-32'>90570ßßß</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>+ü##+poötzhcxd</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>dfghsert32</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>mn.,iolö</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>qqewscxopkähj</div>

            <div className='text-sky-500 [opacity:inherit] w-32'>adwtbxfddsg</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>uzkhncgaws</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>sdfpöovmxfbvd</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>esöpoi</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>nvbckjiuy78324</div>
            <div className='text-sky-500 [opacity:inherit] w-32'>342098#</div>

          </TextRingVarR>

        </Canvas>
      </span>
    )
  }


  wheelEvent(e/*: React.WheelEvent*/) {
    const delta = Math.sign(e.deltaY);
    if (!this.rotating) this.rotateCamera(delta * 15, 1);
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


  async changeToRing(index/*: number*/) {
    if (this.textRingRefs[index]) {
      this.selectedRingRef = this.textRingRefs[index];

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
      }
    }
  }


  /*async*/ rotateCamera(degree/*: number*/, time/*:number*/) {
    /*this.rotating = true;

    const tPerDegree = time / degree;
    let currentTime = Date.now();
    const targetTime = currentTime + time;
    const startDegree = Math.atan2(this.state.cameraPos.z, this.state.cameraPos.y)*180/Math.PI,
      targetDegree = startDegree + degree;

    for (let currentDegree = startDegree; currentDegree <= targetDegree; currentDegree++) {
      const loopStartTime = Date.now();

      this.setCameraDegree(currentDegree / 180 * Math.PI);
      this.updateScrollWheel();

      currentTime = Date.now()
      const timePassed = currentTime - loopStartTime;
      await new Promise(resolve => setTimeout(resolve, tPerDegree - timePassed));
    }

    this.rotating = false;*/
    this.setCameraDegree(Math.atan2(this.state.cameraPos.z, this.state.cameraPos.y) + degree * Math.PI / 180);
  }

  setCameraDegree(degree/*: number*/) {
    const cameraPos = this.calculateCameraPosBasedOnDegree(degree);
    this.setState({ cameraPos });
  }

  calculateCameraPosBasedOnDegree(degree/*: number*/)/*: THREE.Vector3 | null */ {
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
}


export default ThreeJSStuff;


useGLTF.preload('/monke.gltf')