# Use the official Node.js 18 image as the base image
FROM node:18-alpine

RUN apk add --no-cache libc6-compat

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

#RUN addgroup --system --gid 1001 nodejs
#RUN adduser --system --uid 1001 nextjs

#RUN mkdir .next
#RUN chown nextjs:nodejs .next

#USER nextjs

ENV NODE_ENV production

# Start the Next.js application
# CMD ["npm", "start"]
ENTRYPOINT [ "/bin/sh" ]
CMD ["build.sh"]