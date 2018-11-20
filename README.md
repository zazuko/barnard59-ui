# barnard59-server

## Usage

### Build

Before you can run the application, the UI needs to be built.
This can be done with an npm script:

```
npm run build
```

There is also a `dev` script which runs webpack in dev and watch mode.

### Server

Server can be started in the npm way with:

```
npm start
```

## Examples

As there is no create new pipeline feature in the UI yet, you have to upload it.
The script in the examples folder can do this for you:

```
node examples/create-pipeline-and-job.js
```
