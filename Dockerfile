FROM node:14.4.0

WORKDIR /usr/src/fun-with-images-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]
