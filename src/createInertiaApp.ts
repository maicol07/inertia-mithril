import m from 'mithril';
import App from './App';

// eslint-disable-next-line consistent-return
export default async function createInertiaApp({
  id = 'app', resolve, setup, title, page,
}) {
  const isServer = typeof window === 'undefined';
  const el = isServer ? null : document.getElementById(id);
  const initialPage = page || JSON.parse(el.dataset.page);
  const resolveComponent = (name) => resolve(name).then((module) => module.default || module);

  let head = [];

  await resolveComponent(initialPage.component).then((initialComponent) => setup({
    el,
    App,
    props: {
      initialPage,
      initialComponent,
      resolveComponent,
      titleCallback: title,
      // eslint-disable-next-line no-return-assign
      onHeadUpdate: isServer ? (elements) => (head = elements) : null,
    },
  }));

  if (isServer) {
    const body = await m('div', {
      id,
      'data-page': JSON.stringify(initialPage),
    });

    return { head, body };
  }
}
