FROM node:alpine
ADD ./VolumeProfileChart /code
WORKDIR /code
RUN yarn
EXPOSE 3000
ENV NODE_ENV production
CMD ["yarn", "start"]