#step1: setting the base image 

FROM node:22-alpine 

#step-2 : Is working directory inside the container 
WORKDIR /app

#step-3 : then we have to copy the package files first 

COPY package*.json ./

# step-4 : Install the dependencies 
RUN npm ci

# step-5 : Copy application source code 
COPY . .

#step-6 : compile Typescript 
RUN npm run build 

# step-7 : Document the port the app use 
EXPOSE 3001 

# step-8 : start the applicaton 
CMD [ "npm","start" ]