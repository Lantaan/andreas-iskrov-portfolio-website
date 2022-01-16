import React, { Suspense } from 'react';
import OscillatorSim from "./2dNoCollisionSim";



class App extends React.Component {
  loadingSimRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      loadingFinished: false
    };


    this.setLoadingFinishedToTrueWhenSimHasFinished();
  }


  render() {
    const ThreeJSStuff = React.lazy(() => import("./ThreeJSStuff"));
    const loadingSim = <><div className='relative left-1/2 top-1/2'>
      <OscillatorSim ref={this.loadingSimRef} />
    </div>
    <div className='m-auto w-1/2 text-center text-primary text-5xl relative top-1/2'>Loading ...</div>
    </>

    return (
      <div className='h-screen w-screen bg-black overflow-hidden'>
        {<Suspense fallback={loadingSim}>
          {/*this.state.loadingFinished ? <ThreeJSStuff /> : loadingSim*/<ThreeJSStuff />}
        </Suspense>}
      </div>
    );
  }



  async setLoadingFinishedToTrueWhenSimHasFinished() {
    while (!this.loadingSimRef.current) await new Promise(resolve => setTimeout(resolve, 1));
    while (!this.loadingSimRef.current.finishedAdding) await new Promise(resolve => setTimeout(resolve, 1));
    this.setState({ loadingFinished: true });
  }
}


export default App;