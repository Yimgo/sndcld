# sndcld

sndcld is a stupid yet smooth UI for SoundCloud.

## Run

### Dependencies

```bash
npm install
bower install
```

### SSL

```bash
./bin/create_self_signed_certificate './ssl'
```

### Register the app

1. Register the app at https://soundcloud.com/you/apps
2. Rename `credentials.example` to `credentials`
3. Modify `SNDCLD_CLIENT_ID`, `SNDCLD_CLIENT_SECRET` and `SNDCLD_CALLBACK_URL` to fit your settings.

### Run

```bash
source credentials
node app/app.js
```
