# Memory Mapper: A Toolkit for Mapping Cultural Heritage

Memory Mapper is a web application for creating interactive maps for heritage, history, tourism, or any other circumstance in which you want to attach audio, images, text or video to an interactive web map.

It is built and maintained by Duncan Hay at the Bartlett Centre for Advanced Spatial Analysis and the School of Architecture, University College London.

## Features
- Rich, interactive map interface featuring filtering, tagging and full-text search build with Next.js
- Fully-featured content management system built using Django
- Advanced web mapping with MapboxGL
- Customisable map styles
- Support for multiple basemaps, including Mapbox, Maptiler Cloud, and self-hosted raster and vector tiles
- Responsive design for mobile, tablet, and desktop use

---

## Installation
The easiest way to get up and running with Memory Mapper is with [Docker](https://www.docker.com/).

Before you start, you will need:

- A server running Docker. We recommend [Portainer](https://www.portainer.io/) in combination with [Nginx Proxy Manager](https://nginxproxymanager.com/) for ease of use.
- An API key from [Maptiler](https://www.maptiler.com/)
- A 'secret key' generated at [https://djecrety.ir/](https://djecrety.ir/)
- A domain name to which you have access to the DNS settings


### Using Docker
Copy the `.env.template` file in the root directory of the repository to `.env`, then populate the empty fields with the relevant values. 

The `NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT` and `NEXT_PUBLIC_MEDIA_ROOT` should be set to `https://your-domain.com/api/` and `https://your-domin.com/` (assuming you are using SSL, which you should). `DJANGO_ALLOWED_HOSTS` should be set to `memorymaptoolkit\:8000:your-domain.com:your-server-ip\:1337`.

We recommend chosing something secure for the `DJANGO_DB_*` and `DJANGO_SUPERUSER*` settings.

Once you've populated the .env file, run `docker compose up -d`. This will build and start four containers:

- memorymapperfrontend
-- The Memory Mapper Next.js front end
- db
-- A PostGIS database
- memorymaptoolkit
-- The Memory Mapper Django app
- nginx
-- Nginx, configured as a reverse proxy to the front end, and serving media content and Django-related static files.

If you visit `http://your-server-ip:1337/`, the web app will appear.

### Using Portainer
First, set up Nginx Proxy Manager. This will allow you to easily add a reverse proxy to the Memory Mapper services without modifying the settings for the nginx container in this repository, and (most importantly) manage SSL certificates with minimal fuss.

Assuming Portainer is running and you've logged in to the admin interface, select the 'Stacks' option from the panel on the left hand side, then select 'new stack'. Call it `nginx-proxy-manager`.

Copy and paste the `docker-compose.yml` code from [https://nginxproxymanager.com/guide/#quick-setup](https://nginxproxymanager.com/guide/#quick-setup). Click start, and once the service is running, navigate to `http://your-server-ip:81/` to complete the setup.

Next, create a second stack, this time called 'memorymapper'. Choose the 'From repository' option and copy and paste the URL of this repository into the field.

To add the relevant environment variables, download the '.env.template' file from this repository, then in Portainer choose the 'load environment variables from file' option and select it.

Populate the fields with your values, as above.

Click the 'start stack' option and the services will build and start.

Once they've built, click on the 'nginx' container and note down the IP. Then, navigate to the nginx-proxy-manager container, scroll down to 'networks' and remove the container from the 'nginx-proxy-manager' network and add it to the 'memorymapper' network. This will enable Nginx Proxy Manager to communicate with Memory Mapper.

Next, navigate back to Nginx Proxy Manager (http://your-server-ip:81/), log in, and select the 'Proxy Hosts' from the 'Hosts' menu. Click the 'Add Proxy Host' button. In the 'domain name' field, add your domain name, then in the 'Forward Hostname / IP', put in the IP address you noted earlier. In the 'Forward Port' field put 80.

Under the SSL tab, select the 'Request a new SSL certificate option'.

Visit `https://your-domain.com/` and the web app will appear.

## Next Steps
Go to `https://your-domain.com/admin` and log in to the Django admin. From here you can:

- Configure the map
- Add contextual pages
- Start building your map