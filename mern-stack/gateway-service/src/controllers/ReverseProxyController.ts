import { Request, Response, Router } from "express";
import fetch from "node-fetch";
import { Logger } from "tslog";
import config from "../config";


class ReverseProxyController {
    router: Router;
  
    constructor() {
      this.router = Router();
  
      this.router.post('/', this.forwardRequest);
    }

    



// function to forward http request using reverse proxy middleware
  forwardRequest = async (req: Request, res: Response): Promise<void> => {
      console.log("I have reached the forwardRequest function");
  try{
    let remoteApiResponse = await fetch('https://swapi.dev/api/people') ;
    let status = remoteApiResponse.status();
    let body = remoteApiResponse.json();

    res.json(body);
    res.status(status);

    console.log("remote response body: ", JSON.stringify(body));
    

}catch(error){
    console.log(error);
}
  }
}

export default ReverseProxyController;
