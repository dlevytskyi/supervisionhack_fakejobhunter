FROM node:18 As build
WORKDIR /app/
COPY package.json package-lock.json /app/
RUN npm ic
COPY ./ /app/
RUN npm run build
RUN npm cache clean --force
EXPOSE 3000

FROM node:18 As final
WORKDIR /app/
RUN chown -R node:node /app/
COPY --chown=node:node package.json package-lock.json /app/
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist
USER node
CMD npm run typeorm migration:run && npm run start:ci
