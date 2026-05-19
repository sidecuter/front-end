FROM node:10-alpine
ENV NODE_ENV "production"
ENV PORT 8079
EXPOSE 8079
RUN addgroup mygroup && adduser -D -G mygroup myuser && mkdir -p /usr/src/app && chown -R myuser /usr/src/app

USER root
RUN apk add --no-cache \
    tcpdump \
    tshark \
    netcat-openbsd \
    nmap \
    curl \
    wget \
    strace \
    ltrace \
    procps \
    openssl \
    jq \
    grep \
    sed \
    iputils \
    bind-tools \
    && \
    rm -rf /var/cache/apk/*

# Prepare app directory
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN chown myuser /usr/src/app/yarn.lock

USER myuser
RUN yarn install

COPY . /usr/src/app

# Start the app
CMD ["/usr/local/bin/npm", "start"]
