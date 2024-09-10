import express from 'express'
import 'dotenv/config'
import {envs} from './config/envs.plugin'
import { MongoDatabase  } from './data/init'
import { IncidentModel } from './data/models/incident.models';
import { AppRoutes } from './presentation/routes';
import { emailJob } from '../domain/jobs/email.job';

const app = express();

app.use(express.json());
app.use(AppRoutes.routes);

(async () =>
await MongoDatabase.connect({dbName:"IncidentApi",mongoUrl:envs.MONGO_URL ?? ""}))();

console.log(envs.PORT)

app.get("/",(req,res)=>{res.send("Hola mundo")})

app.listen(envs.PORT,()=>{
  console.log(`Servidor escuchando en el puerto ${envs.PORT}`)
  emailJob();
})

app.post("/",async(req,res)=>{
  const {title,description,lat,lng} = req.body
  const newIncident = await IncidentModel.create({title,description,lat,lng})
  res.send("Registro creado")
})