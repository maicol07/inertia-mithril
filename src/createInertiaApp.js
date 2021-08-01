import m from 'mithril';
import app from './app';

// eslint-disable-next-line consistent-return
export default async function createInertiaApp({
  id = 'app', resolve, setup, title, page,
}) {
  const isServer = typeof window === 'undefined';
  const el = isServer ? null : document.getElementById(id);
  const initialPage = page || JSON.parse(el.dataset.page);
  const resolveComponent = (name) => Promise.resolve(resolve(name))
    .then((module) => module.default || module);

  let head = [];

  await resolveComponent(initialPage.component).then((initialComponent) => {
    app.initialPage = initialPage;
    app.page.component = initialComponent;
    app.resolveComponent = resolveComponent;
    app.isServer = isServer;
    app.titleCallback = title;
    // eslint-disable-next-line no-return-assign
    app.onHeadUpdate = isServer ? (elements) => (head = elements) : null;

    return setup({
      el,
      app,
    });
  });

  if (isServer) {
    const body = await m('div', {
      id,
      'data-page': JSON.stringify(initialPage),
    });

    return { head, body };
  }
}
