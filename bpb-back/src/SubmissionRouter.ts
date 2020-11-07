import IRouter from './IRouter'
import AbstractRouter from './AbstractRouter'

class SubmissionRouter extends AbstractRouter implements IRouter {
  
  constructor(app : any,route : string) {
    super(app,route);
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get("helloworld",this.getHelloWorldFn);
  }
  
  getHelloWorldFn = async function(req : Express.Request,res : any){
    res.send({"data":"hello from the bpb-back submission router!!"});
  }
}

export default SubmissionRouter;