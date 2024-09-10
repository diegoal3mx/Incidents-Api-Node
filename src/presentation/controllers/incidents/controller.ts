import { Request, Response } from "express";
import { IncidentModel } from "../../../data/models/incident.models";

export class IncidentController {
  public getIncidents = async (req: Request, res: Response) => {
    try {
      const incidents = await IncidentModel.find();
      return res.json(incidents);
    } catch (error) {
      return res.json([]);
    }
  };

  public createIncident = async (req: Request, res: Response) => {
    try {
      const { title, description, lat, lng } = req.body;
      const newIncident = await IncidentModel.create({
        title,
        description,
        lat,
        lng,
      });
      res.json(newIncident);
    } catch (error) {
      res.json({ message: "Error creando registro" });
    }
  };

  public getIncidentById = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const incident = await IncidentModel.findById(id)

      if(!incident){
        return res.json({message: `No se encontó un incidente con el id ${id}`})
      }
      return res.json(incident)
    } catch (error) {
      return res.json({message: "Ocurrió un error al traer el incidente", error: error})
    }
  }

  public updateIncident = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const incident = await IncidentModel.findById(id)

      if(!incident){
        return res.json({message: `No se encontó un incidente con el id ${id}`})
      }

      const { title, description, lat, lng } = req.body;

      await IncidentModel.findByIdAndUpdate(id, {
        title:title,
        lat:lat,
        description: description,
        lng: lng
      })

      const updatedIncident = await IncidentModel.findById(id);
      return res.json(updatedIncident);

    } catch (error) {
      return res.json({message: "Ocurrió un error al actualizar el incidente", error: error})
    }
  }

  public deleteIncident = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const incident = await IncidentModel.findById(id)

      if(!incident){
        return res.json({message: `No se encontró un incidente con el id ${id}`})
      }

      await IncidentModel.findByIdAndDelete(id);
      return res.json({message:`Incidente con el id ${id} eliminado`})
    } catch (error) {
      return res.json({message: "Ocurrió un error al eliminar el incidente", error})
    }
  }
}
