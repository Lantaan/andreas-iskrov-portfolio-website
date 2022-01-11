import React, { Suspense } from 'react';


function App(){
  const ThreeJSStuff = React.lazy(()=>import("./ThreeJSStuff"))

  return (<>
    <Suspense fallback={<div>Loading...</div>}>
      {<ThreeJSStuff />}
    </Suspense>
  </>);
}


export default App;