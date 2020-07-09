using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ChumsApiCore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.AddControllers().AddJsonOptions(options => {
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                options.JsonSerializerOptions.IgnoreNullValues = true;
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .SetPreflightMaxAge(new TimeSpan(0,10,0)); //Reduce OPTIONS requests for CORS verification.
            }));

            //I'm fairly certain this is the wrong way to do this
            MasterLib.AppSettings.Current.MasterConnectionString = Configuration["AppSettings:MasterConnectionString"];
            MasterLib.AppSettings.Current.PasswordSalt = Configuration["AppSettings:PasswordSalt"];

            ChurchLib.AppSettings.Current.ChurchConnectionString = Configuration["AppSettings:ChurchConnectionString"];
            ChurchLib.AppSettings.Current.AwsKey = Configuration["AppSettings:AwsKey"];
            ChurchLib.AppSettings.Current.AwsSecret = Configuration["AppSettings:AwsSecret"];
            ChurchLib.AppSettings.Current.S3ContentBucket = Configuration["AppSettings:S3ContentBucket"];
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthorization();
            app.UseCors("CorsPolicy");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


        }
    }
}
