import cron from 'node-cron'
import { IncidentModel } from '../../src/data/models/incident.models';
import { EmailService } from '../services/email.service';
import { title } from 'process';
import { generateIncidentEmailTemplate } from '../templates/email.template';
export const emailJob = () => {
  const emailService = new EmailService();

  cron.schedule("*/10 * * * * *", async ()=>{
    try{
      const incidents = await IncidentModel.find({isEmailSent:false});
      if(!incidents.length){
        console.log('No hay incidentes por enviar');
        return
      }
      await Promise.all(
        incidents.map(async (incident)=>{
            console.log(incident);
            try{
              const htmlBody= generateIncidentEmailTemplate(incident.title,incident.description,incident.lat,incident.lng);

                await emailService.sendEmail({
                    to:"incidentsapi@tutamail.com",
                    subject:`Incidente: ${incident.title}`,
                    htmlBody:htmlBody
                });
                console.log(`Email enviado para el incidente con Id: ${incident._id}`);
                let updateIncident = {
                    title: incident.title,
                    description: incident.description,
                    lat: incident.lat,
                    lng: incident.lng,
                    isEmailSent: true
                };
                await IncidentModel.findByIdAndUpdate(incident._id,updateIncident);
                console.log(`Incidente actualizado para el Id: ${incident._id}`);
            }
            catch(error){
                console.error("Error al procesar el incidente");
            }
        })
    );}
    catch(error){
      console.error("Error al enviar el email");
    }
  });
}
