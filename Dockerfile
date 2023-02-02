FROM --platform=$BUILDPLATFORM golang:1.20-alpine as build

ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk add --no-cache git

COPY ./ /go/src/github.com/thomasmorebe/discord-hub

WORKDIR /go/src/github.com/thomasmorebe/discord-hub

RUN export GOARM=6 && \
    export GOARCH=amd64 && \
    if [ "$TARGETPLATFORM" == "linux/arm64" ]; then export GOARCH=arm64; fi && \
    if [ "$TARGETPLATFORM" == "linux/arm" ]; then export GOARCH=arm; fi && \
    go build -ldflags "-X main.revision=$(git rev-parse --short HEAD)" ./cmd/discord-hub/

FROM --platform=$BUILDPLATFORM node:16 as frontend

COPY ./ /go/src/github.com/thomasmorebe/discord-hub

WORKDIR /go/src/github.com/thomasmorebe/discord-hub/hub

RUN npm install
RUN npm run build

FROM alpine:3.15.1

RUN apk add --no-cache ca-certificates

RUN mkdir -p /go/src/github.com/thomasmorebe/discord-hub/
WORKDIR /go/src/github.com/thomasmorebe/discord-hub/

COPY --from=frontend  /go/src/github.com/thomasmorebe/discord-hub/hub/build /go/src/github.com/thomasmorebe/discord-hub/www
COPY --from=build /go/src/github.com/thomasmorebe/discord-hub/discord-hub /usr/local/bin/

COPY data.json /go/src/github.com/thomasmorebe/discord-hub/

CMD [ "/usr/local/bin/discord-hub", "serve" ]
