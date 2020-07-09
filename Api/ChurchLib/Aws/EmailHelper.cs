using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace ChurchLib.Aws
{
    public class EmailHelper
    {
        public static void SendEmail(string from, string to, string subject, string body)
        {
            MailMessage msg = new MailMessage() { From = new MailAddress(from), Subject = subject, Body = body, IsBodyHtml = true };
            msg.To.Add(new MailAddress(to));
            SendAmazonEmail(msg);
        }
        
        public static void SendAmazonEmail(MailMessage msg)
        {
            Amazon.SimpleEmail.Model.Content subject = new Amazon.SimpleEmail.Model.Content(msg.Subject);
            Amazon.SimpleEmail.Model.Body body = new Amazon.SimpleEmail.Model.Body() { Html = new Amazon.SimpleEmail.Model.Content(msg.Body) };
            Amazon.SimpleEmail.AmazonSimpleEmailServiceClient client = new Amazon.SimpleEmail.AmazonSimpleEmailServiceClient(AppSettings.Current.AwsKey, AppSettings.Current.AwsSecret, Amazon.RegionEndpoint.USEast1);
            List<string> toAddresses = new List<string>();
            foreach (System.Net.Mail.MailAddress oneToAddr in msg.To) toAddresses.Add(oneToAddr.Address);
            Amazon.SimpleEmail.Model.SendEmailRequest req = new Amazon.SimpleEmail.Model.SendEmailRequest();
            req.Destination = new Amazon.SimpleEmail.Model.Destination() { ToAddresses = toAddresses };
            req.Source = msg.From.DisplayName + " <" + msg.From.Address + ">";
            req.ReturnPath = msg.From.DisplayName + " <" + msg.From.Address + ">";
            req.Message = new Amazon.SimpleEmail.Model.Message(subject, body);
            client.SendEmail(req);
        }
        
    }
}
