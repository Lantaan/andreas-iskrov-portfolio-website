import { lazy, Suspense } from "react";
import OscillatorSim from "./physics-const-F-sim";



function App() {
  //import not while website loads, but on runtime
  const ThreeJSStuff = lazy(() => import("./ThreeJSStuff"));

  //display loading sim while ThreeJSStuff is imported
  const loadingSim = <><div className='relative left-1/2 top-1/2'/*I FIGURED OUT HOW TO CENTER A DIV!!!*/>
    <OscillatorSim />
  </div>

    <div className='m-auto w-1/2 text-center text-primary text-5xl relative top-1/2'>Loading ...</div>
  </>


  return (
    <div className='h-screen w-screen bg-black overflow-hidden'>
      {<Suspense fallback={loadingSim}/*if ThreeJSStuff isn't loaded display loadingSims*/>
        <ThreeJSStuff />
      </Suspense>}
    </div>
  );
}


export default App;