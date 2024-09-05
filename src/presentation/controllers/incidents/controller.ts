import { Request, Response } from "express";
import { IncidentModel } from "../../../data/models/incident.models";
import { EmailService } from "../../../../domain/services/email.service";
export class IncidentController{

  public getIncidents = async (req: Request, res: Response)=>{
    res.send("Obteniendo los datos");
    try{
      const incidents = await IncidentModel.find();
      return res.json(incidents);
    }catch(error){

    }
  }

  public createIncident = async (req: Request, res: Response)=>{
    try{
      const { title, description, lat, lng } = req.body;
      const newIncident = await IncidentModel.create({
        title,
        description,
        lat,
        lng,
      });
      const emailService = new EmailService();
      await emailService.sendEmail({to:'',subject:`Incidente: ${newIncident.title}`,htmlBody:`<h1>${newIncident.description}</h1>`});
      res.json(newIncident);
    }catch(error){
      res.json({Message: "Error creando registro"})
    }

  }

  public getIncidentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const incident = await IncidentModel.findById(id);
      return res.json(incident)
  }catch(error){
      return res.json({message: "Ocurrió un error al buscar por id"})
  }
}

  public updateIncident = async (req: Request, res: Response) => {
    try{
      const { id } = req.params;
      const { title, description, lat, lng } = req.body;
      const updatedIncident = await IncidentModel.findByIdAndUpdate(id, {title, description, lat, lng});
      return res.json(updatedIncident);
    }
    catch(error){
      return res.json({message: "Ocurrió un error al actualizar"});
    }
  }

  public deleteIncident = async (req: Request, res: Response) => {
    try{
      const { id } = req.params;
      await IncidentModel.findByIdAndDelete(id);
      return res.json({message: "Eliminado con éxito"});
    }
    catch(error){
      return res.json({message: "Error al eliminarg"})
    }
  }
}