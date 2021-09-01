# Inertia.js Mithril Adapter

This is the [Mithril.js](https://mithril.js.org) client-side adapter for [Inertia](https://inertiajs.com).

Inertia.js lets you quickly build modern single-page apps using classic server-side routing and controllers, without building an API.

To use Inertia.js you need both a server-side adapter as well as a client-side adapter.

## Server-side setup

Be sure to follow the installation instructions for the [server-side framework](https://inertiajs.com/server-side-setup) you use.

## Client-side setup

### Install dependencies

Install the Inertia client-side adapters using NPM or Yarn.

~~~shell script
npm install @inertiajs/inertia @maicol07/inertia-mithril
// or
yarn add @inertiajs/inertia @maicol07/inertia-mithril
~~~

### Initialize app

Next, update your main JavaScript file to boot your Inertia app. 
All we're doing here is initializing the client-side framework with the base Inertia page component.

~~~js    
import m from 'mithril'
import { createInertiaApp } from '@maicol07/inertia-mithril'

createInertiaApp({
  resolve: async (name) => import(`./Pages/${name}`),
  setup({ el, app }) {
    m.mount(el, app)
  },
})
~~~ 

The resolveComponent is a callback that tells Inertia how to load a page component. 
It receives a page name (string), and must return a component instance.

Visit [Client-side setup](https://inertiajs.com/client-side-setup) to learn more.

## Title & meta
Since JavaScript apps are rendered within the document `<body>`, they are unable to render markup to the document `<head>`,
as it's outside of their scope. To help with this, the Mithril plugin sets the page `<title>` and `<head>` elements (like <meta> tags)
if they are passed to the page props from the backend. See [Shared Data](https://inertiajs.com/shared-data) for help about sharing data from the backend.

## Links

To create links within an Inertia app you'll need to use the InertiaLink component. 
This is a light wrapper around a standard anchor link that intercepts click events and prevents full page reloads from occurring. 
This is how Inertia provides a single-page app experience.

### Creating links

To create an Inertia link, use the InertiaLink component. 
Note, any attributes you provide will be proxied to the underlying `<a>` tag.

~~~js    
import {InertiaLink} from '@tebe/inertia-mithril'

m(InertiaLink, {href: '/'}, 'Home')
// or use JSX:
// <InertiaLink href="/"></InertiaLink>
~~~ 
    
### Method

You can specify the method for an Inertia link request. 
The default is `GET`, but you can also use `POST`, `PUT`, `PATCH`, and `DELETE`.

~~~js    
m(InertiaLink, {href: '/logout', method:'post'}, 'Logout')
~~~

### Data

You can add data using the `data` attribute. 
This can be an `object`, or a `FormData` instance.

~~~js    
m(InertiaLink, {href: '/logout', method:'post', data: { foo: bar }}, 'Save')
~~~

### Replace

You can specify the browser history behaviour. 
By default page visits push (new) state (`window.history.pushState`) into the history, however it's also possible to replace state (`window.history.replaceState`) by setting the replace attribute to true. 
This will cause the visit to `replace` the current history state, instead of adding a new history state to the stack.

~~~js    
m(InertiaLink, {href: '/logout', replace:true}, 'Logout')
~~~

### Preserve state

You can preserve a page component's local state using the `preserve-state` attribute. 
This will prevent a page component from fully re-rendering. 
This is especially helpful with forms, since you can avoid manually repopulating input fields, and can also maintain a focused input.

~~~js    
let query = {foo: bar}
m(InertiaLink, {href: '/search', method:'post', data: query, preserveState: true}, 'Search')
~~~

### Preserve scroll

By default page visits will automatically reset the scroll position back to the top of the page (and any [scroll regions](https://inertiajs.com/pages#scroll-regions) you've defined). 
You can use the `preserve-scroll` attribute to disable this behaviour.

~~~js
m(InertiaLink, {href: '/', preserveScroll: true}, 'Home')
~~~

### Partial reloads

The `only` option allows you to request a subset of the props (data) from the server on subsequent visits to the same page. 
This feature is called partial reloads, and can be a helpful performance optimization if it's acceptable that some page data becomes stale. 
For partial reloads to be effective, be sure to use [lazy evaluation](https://inertiajs.com/responses#lazy-evaluation) server-side.

~~~js
m(InertiaLink, {href: '/', only: ['someProps']}, 'Home')
~~~

## Demo

Here is a working demo using this adapter.

<https://pingcrm-mithril.tebe.ch>
    
## More about Inertia

Visit [inertiajs.com](https://inertiajs.com/) to learn more.
