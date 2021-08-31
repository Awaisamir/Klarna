# WebComponentKlarna

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
You have to reinstate the AppComponent iin app.module.ts in order to be able to run.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Create Web Component

`npm run build:component` builds the component in the output folder. The component is called 'klarna-web-component.js'. The index.html file in the output folder uses the component in a simple index.html file.

## Shadow DOM
encapsulation: ViewEncapsulation.ShadowDom, causes errors with ng serve, but works with the exported component
Reinstating the AppComponent iin app.module.ts will resolve the errors and allow the app to be run with ng server
