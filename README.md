# portfolio

A simple personal webpage for showing off

## Usage

Source files are located in `./src` folder. Running `yarn run build` will compile them for production and store them in the `./dist` folder.

### Local development

For a simple development server with live reloading run `yarn start`. Webpack will serve your bundled files at `localhost:8080` and open a browser window. Whenever a file changes, webpack recompiles and reloads the browser window.

### Content editing

Content is stored in the `./content` folder. For each `.njk` template in the `./src` folder, there exists a `.json` file with the same name in this folder. These files hold the data that is directly passed on to the templates during build.

For content changes to apply, restart your dev server or re-build manually.

### Release

Files in `./dist` folder are meant to be served statically with an http server. For the current installation, the process can be automated by running

```
$ yarn run deploy
```

Note that you need to set the following environment variables for the script to work:

* `ARGONN_SSH_USER`
* `ARGONN_SSH_PASSWORD`
* `ARGONN_HTTP_USER`
* `ARGONN_HTTP_PASSWORD`
