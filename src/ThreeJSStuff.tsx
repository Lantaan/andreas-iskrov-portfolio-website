import { Vector2, Vector3, Clock } from 'three'
import { createRef, Component, RefObject, TouchEvent, WheelEvent, ReactNode, createElement } from "react";
import { Canvas } from "@react-three/fiber";

import { TextRingVarR } from './TextRings'
import SetCamera from './setCamera';

import ConnectedInputsAsSeperateComponents from './ConnectedInputs';
import Slider from './Slider';
import SendButton from './SendButton';
import { Blue, H, HoverUnderline, LinkInNewTab, SM, T } from './text-prebuild-components';


class ThreeJSStuff extends Component<any, any> {
  textRingsAmount: number = 2;
  slidersAmount: number = 100;
  connectedInputsAmount: number = 40;

  textRingRefs: RefObject<TextRingVarR>[] = Array.from(Array(this.textRingsAmount)).map(a => createRef());
  selectedRingRef: RefObject<TextRingVarR> = this.textRingRefs[0];

  //some custom components need refs, but get them on their own
  specialNeedsRefs: RefObject<Slider>[] = Array.from(Array(this.slidersAmount)).map(a => createRef());
  connectedInputsRef: RefObject<HTMLInputElement>[] = Array.from(Array(this.connectedInputsAmount)).map(a => createRef());
  //ref to the custom scroll bar
  ringScrollRef: RefObject<HTMLInputElement> = createRef();

  widthMeasuringDivRef: RefObject<HTMLDivElement> = createRef();
  //wether it is allowed to rotate camera around current ring
  rotating: boolean = true;

  state: Readonly<{
    cameraPos: Vector3,
  }>;

  //touch support
  touchPosPrevious: Vector2 | null = null;

  constructor(props: any) {
    super(props);

    this.state = {
      cameraPos: new Vector3()
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


          <TextRingVarR ref={this.textRingRefs[1]} ringOrigin={new Vector3(50, 0, 0)} opacityRefPoint={this.state.cameraPos}
            onSelect={() => this.onselectContactMeRing()/*I dont understand why in onselectContactMeRing "this" is defined*/}>
            {/*scroll down to find real beginning*/}
            {ConnectedInputsAsSeperateComponents(this.connectedInputsAmount, this.widthMeasuringDivRef, this.connectedInputsRef,
                "focus:bg-[#19b2e020] bg-transparent text-primary [opacity:inherit] outline-hidden" +
                "border-solid border-2 border-t-0 border-b-0 border-h2 caret-h1")}
            <br />

            <SendButton connectedInputsRefArgs={this.connectedInputsRef} />

            <br />
            <br />

            {/*the real beginning is here, because the first line in code will be perfectly centered, but thats not what I want*/}
            <button className='text-h2 border-2 border-h2 rounded-md hover:bg-h2 w-32 hover:text-black' onClick={() => this.changeToRing(0)}>zurück</button>
            <H>Nehmen Sie Kontakt auf</H>
          </TextRingVarR>


          <TextRingVarR ref={this.textRingRefs[0]} ringOrigin={new Vector3(0, 0, 0)} opacityRefPoint={this.state.cameraPos}>
            {/*scroll down to find real beginning*/}
            <T>
              Aktuell besuche ich die <Blue>Q11</Blue>
            </T>

            <T>
              des <Blue><HoverUnderline>
                <LinkInNewTab href='https://www.ovtg.de/index.php?id=2'>Otto-von-Taube-Gymnasium</LinkInNewTab>
              </HoverUnderline></Blue>
            </T>

            <br />

            <T>Aufgrund meiner Faszination für</T>
            <T><Blue>Physik</Blue> und <Blue>Informatik</Blue></T>
            <T>besuche ich das <Blue><HoverUnderline><LinkInNewTab href='http://tumkolleg.ovtg.de'>TUM-Kolleg</LinkInNewTab></HoverUnderline></Blue>,</T>
            <T>ein Förderprogramm der</T>
            <T>Technischen Universität München</T>
            <T>für <Blue>MINT-begabte</Blue> Schülerinnen und</T>
            <T>Schüler.</T>

            <br /> <br />

            <H>Kompetenzen</H>

            <T><Blue>JavaScript</Blue></T>
            <Slider ref={this.specialNeedsRefs[0]} fillTime={1000} height={30} maxValue={140}
              classNameContainer={"relative -left-24 top-2"}
              classNameFG={"bg-h2 [opacity:inherit] block rounded [top:-1px]"}
              classNameFGHover={"bg-transparent border-h2 border-r-2 [opacity:inherit] block rounded [top:-1px]"}
              classNameBG={"border-h2 border-2 w-40 h-8 rounded-md"} bgBorderWidth={2}>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>TypeScript</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>React</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Express</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Three.js</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Node.js</div>
            </Slider>

            <br />

            <T><Blue>CSS / HTML</Blue></T>
            <Slider ref={this.specialNeedsRefs[1]} fillTime={1000} height={22} maxValue={80}
              classNameContainer={"relative -left-24 top-2"}
              classNameFG={"bg-h2 [opacity:inherit] block rounded [top:-1px]"}
              classNameFGHover={"bg-transparent border-h2 border-r-2 [opacity:inherit] block rounded [top:-1px]"}
              classNameBG={"border-h2 border-2 w-40 h-6 rounded-md"} bgBorderWidth={2}>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Tailwind CSS</div>
            </Slider>

            <br />

            <T><Blue>Java</Blue></T>
            <Slider ref={this.specialNeedsRefs[2]} fillTime={1000} height={14} maxValue={110}
              classNameContainer={"relative -left-24 top-2"}
              classNameFG={"bg-h2 [opacity:inherit] block rounded [top:-1px]"}
              classNameFGHover={"bg-transparent border-h2 border-r-2 [opacity:inherit] block rounded [top:-1px]"}
              classNameBG={"border-h2 border-2 w-40 h-4 rounded-md"} bgBorderWidth={2}>
            </Slider>

            <br />

            <T><Blue>Weiteres</Blue></T>
            <Slider ref={this.specialNeedsRefs[3]} fillTime={1000} height={20} maxValue={80}
              classNameContainer={"relative -left-24 top-2"}
              classNameFG={"bg-h2 [opacity:inherit] block rounded [top:-1px]"}
              classNameFGHover={"bg-transparent border-h2 border-r-2 [opacity:inherit] block rounded [top:-1px]"}
              classNameBG={"border-h2 border-2 w-40 h-6 rounded-md"} bgBorderWidth={2}>
                <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>LaTeX</div>
                <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Blender</div>
            </Slider>

            <br />

            <T><Blue>Sprachen</Blue></T>
            <Slider ref={this.specialNeedsRefs[4]} fillTime={1000} height={30} maxValue={140}
              classNameContainer={"relative -left-24 top-2"}
              classNameFG={"bg-h2 [opacity:inherit] block rounded [top:-1px]"}
              classNameFGHover={"bg-transparent border-h2 border-r-2 [opacity:inherit] block rounded [top:-1px]"}
              classNameBG={"border-h2 border-2 w-40 h-8 rounded-md"} bgBorderWidth={2}>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Deutsch</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Englisch</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Russisch</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Ukrainisch</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Französisch</div>
              <div className='text-primary text-[8px] [opacity:inherit] transition duration-100 hover:scale-150 blackShadowOnhover'>Latein</div>
            </Slider>

            <br /> <br />

            <H>Über diese Webseite</H>
            <T>Falls Sie sich wundern, das ist keine</T>
            <T>CSS3d Transformation. Der gesamte</T>
            <T>Text wird in echtem 3d mit Hilfe von</T>
            <T>
              <Blue><HoverUnderline><LinkInNewTab href='https://threejs.org'>Three.js</LinkInNewTab></HoverUnderline></Blue>
              , um genauer zu sein
              <Blue> <HoverUnderline><LinkInNewTab href='https://github.com/pmndrs/drei#html'>drei</LinkInNewTab></HoverUnderline></Blue>
            </T>
            <T>einer Kombination aus <Blue><HoverUnderline><LinkInNewTab href='https://threejs.org'>Three.js</LinkInNewTab></HoverUnderline></Blue></T>
            <T>und <Blue>React</Blue>, gerendert.</T>

            <T>Den <Blue>Qeullcode</Blue> finden sie
              <Blue><HoverUnderline><LinkInNewTab href='https://github.com/Lantaan/andreas-iskrov-portfolio-website'>hier</LinkInNewTab></HoverUnderline></Blue></T>

            <br /> <br />

            <div className='text-h1 text-sm [opacity:inherit] w-48'>Ihnen gefällt was Sie sehen?</div>
            <button className='text-h2 text-base border-2 border-h2 rounded-md top-2 relative hover:bg-h2 w-48 hover:text-black' onClick={() => this.changeToRing(1)}>
              nehmen Sie Kontakt auf</button>

            <br /> <br />

            {/*the real beginning is here, because the first line in code will be perfectly centered, but thats not what I want*/}
            <SM>Ich bin</SM>

            <H>Andreas Iskrov</H>

          </TextRingVarR>

        </Canvas>
      </span >
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

  updateScrollWheel()/*sets the custom scroll wheel value to the camera degree value*/ {
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


  async changeToRing(index/*index of ring that should be changed to*/: number) {
    if (this.textRingRefs[index]) {
      //sets new main ring
      this.selectedRingRef = this.textRingRefs[index];

      //if the newly selected ring has a onSelect function, call it
      if (this.selectedRingRef.current?.props.onSelect) this.selectedRingRef.current?.props.onSelect();

      const originalCamraPos/*camera pos before movement*/ = this.state.cameraPos,
        newCameraPos/*camera pos after movement*/ = this.calculateCameraPosBasedOnDegree(0);

      if (newCameraPos/*typescript*/) {
        const time = 1/*in seconds*/;
        //three js Clock counts in seconds instead of millisecond for some reason
        const clock = new Clock();
        clock.start();

        //while the animation didn't outstay its welcome ...
        while (clock.getElapsedTime() < time) {
          //how much of the animation is allready completed
          //not really percentage but you get the idea
          const percentageOfWay = clock.elapsedTime / time;

          //lerp creates a sort of "intermediate" Vector that is partially originalCamraPos
          //and partially newCameraPos. The higher percentageOfWay the more the new Vector (cameraIntermediatePosition)
          //is newCameraPos
          const cameraIntermediatePosition = originalCamraPos.clone().lerp(newCameraPos, percentageOfWay);
          this.setState({ cameraPos: cameraIntermediatePosition })

          //wait 1ms
          await new Promise(res => setTimeout(res, 1))
        }

        //after the animation is complete the cameraPos is only like 99% of newCameraPos,
        //and it actually shows
        this.setState({ cameraPos: newCameraPos })
      }
    }
  }


  rotateCamera(degree: number, time: number) {
    this.setCameraDegree(Math.atan2(this.state.cameraPos.z, this.state.cameraPos.y) + degree * Math.PI / 180);
  }

  setCameraDegree(degree: number) {
    const cameraPos = this.calculateCameraPosBasedOnDegree(degree);
    this.setState({ cameraPos });
  }


  calculateCameraPosBasedOnDegree(degree: number): Vector3 | null {
    if (this.selectedRingRef.current) {
      const distCenter = this.selectedRingRef.current.state.radius + 5/*if there was no 5,
      the camera would be directly on the ring and it couldn't see the ring*/,
        ringOrigin = this.selectedRingRef.current.state.ringOrigin;

      //some trigonometry
      return new Vector3(
        ringOrigin.x,
        Math.cos(degree) * distCenter + ringOrigin.y,
        Math.sin(degree) * distCenter + ringOrigin.z
      )

    } else return null;
  }

  //this is a special function that is fired when the ring with the connected inputs is selected
  onselectContactMeRing() {
    if (this.connectedInputsRef[0].current) {
      this.connectedInputsRef[0].current.focus();
      //first time it adds a space for looks
      if (this.connectedInputsRef[0].current.value === "") this.connectedInputsRef[0].current.value = " ";
    }
  }
}


export default ThreeJSStuff;