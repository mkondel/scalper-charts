FROM node
ADD ./VolumeProfileChart /code
WORKDIR /code
RUN yarn
EXPOSE 3000
CMD ["yarn", "start"]