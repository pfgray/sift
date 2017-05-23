const batch = (f, maxWait) => {
  let args = [];
  let firstCalled = null;
  let futureCallRef = null;

  return (arg) => {
    if(!firstCalled) {
      firstCalled = new Date();
    }
    args = args.concat([arg]);
    const now = new Date();

    const t = maxWait - (now - firstCalled);

    function invokeF(){
      futureCallRef = null;
      firstCalled = null;
      f(args);
      args = [];
    }

    // clearTimeout
    function setupTimeout() {
      return setTimeout(invokeF, t);
    }

    if(futureCallRef === null) {
      //set it up!
      futureCallRef = setupTimeout();
    } else if(t <= 0){
      //maxWait - (now - firstCalled);
      clearTimeout(futureCallRef);
      invokeF();
    } else {
      // set it up, replacing futureCallRef?
      clearTimeout(futureCallRef);
      futureCallRef = setupTimeout();
    }
  }
}

window.batchIt = batch;

export default batch;
