import { Server } from 'azle';
import express from "express";

export default Server(()=>{
const app = express();
return app.listen();
})


