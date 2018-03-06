FROM node
ADD ./VolumeProfileChart /code
WORKDIR /code
RUN yarn
CMD ["yarn", "start"]