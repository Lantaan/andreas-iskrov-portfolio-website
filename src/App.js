import React, { Suspense } from 'react';
import OscillatorSim from "./2dNoCollisionSim";


const ThreeJSStuff = React.lazy(() => import("./ThreeJSStuff"));


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
    const loadingSim = <div className='relative left-1/2 top-1/2'>
      <OscillatorSim ref={this.loadingSimRef} />
    </div>

    return (
      <div className='h-screen w-screen bg-black overflow-hidden'>
        {<Suspense fallback={loadingSim}>
          {this.state.loadingFinished ? <ThreeJSStuff /> : loadingSim}
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