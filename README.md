# Inertia.js Mithril Adapter

This is the [Mithril.js](https://mithril.js.org) client-side adapter for [Inertia](https://inertiajs.com).
Inertia.js lets you quickly build modern single-page apps using classic server-side routing and controllers, without building an API.To use Inertia.js you need both a server-side adapter as well as a client-side adapter.

## Server-side setup

Be sure to follow the installation instructions for the [server-side framework](https://inertiajs.com/server-side-setup) you use.

## Client-side setup

### Install dependencies

Install the Mithril adapter using your preferred package manager (NPM is provided below for reference).

~~~shell
npm install @maicol07/inertia-mithril
~~~

### Initialize app

Next, update your main JavaScript file to boot your Inertia app. To accomplish this, we'll initialize Mithril with the base Inertia component.

~~~js
import m from 'mithril'
import { createInertiaApp } from '@maicol07/inertia-mithril'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    if (!el) {
      throw new Error("No mounting HTMLElement found");
    }

    m.mount(el, {
        view: () => m(App, props) // or with JSX: m.mount(el, <App {...props}/>)
    });
  },
})
~~~

The `setup` callback receives everything necessary to initialize Mithril, including the root Inertia App component.

The `resolve` callback tells Inertia how to load a page component. It receives a page name (string), and returns a page component module. How you implement this callback depends on which bundler (Vite or Webpack) you're using.

Visit the Inertia [Client-side setup](https://inertiajs.com/client-side-setup) page to learn more.

## Shared data

To share data between server and Mithril, it's pretty simple:

1. Follow the [Shared data](https://inertiajs.com/shared-data) instructions for the server
2. You can access data via the `vnode.attrs.page.props` in your page component.

## Title & meta

_To be developed_

## Links

To create links to other pages within an Inertia app, you will typically use the Inertia `<Link>` component. This component is a light wrapper around a standard anchor `<a>` link that intercepts click events and prevents full page reloads from occurring. This is [how Inertia provides a single-page app experience](https://inertiajs.com/how-it-works) once your application has been loaded.

### Creating links

To create an Inertia link, use the Inertia `Link` component.
Note, any attributes you provide will be proxied to the underlying HTML tag.

~~~js
import {Link} from '@maicol07/inertia-mithril'

m(Link, {href: '/'}, 'Home')
// or use JSX:
// <Link href="/"></Link>
~~~

Almost all the other features are explained in [Inertia docs](https://inertiajs.com/links) (the React adapter syntax is very similar to Mithril one).

## Demo (outdated)

Here is a working demo using this adapter.

[https://pingcrm-mithril.tebe.ch](https://pingcrm-mithril.tebe.ch)

## More about Inertia

Visit [inertiajs.com](https://inertiajs.com/) to learn more.
