import {Page} from '@inertiajs/inertia';
import {ChildArray, ClassComponent, Vnode} from 'mithril';

import InertiaApp, {AppAttributes} from './App';

export type Setup = ({el, App, props}: {
  el?: HTMLElement | null,
  App: typeof InertiaApp,
  props: AppAttributes
}) => void | Vnode<AppAttributes>;

// eslint-disable-next-line consistent-return
export default async function createInertiaApp({
  id = 'app', resolve, setup, title, /* visitOptions, */ page, render
}: {
  id?: string,
  resolve: (name: string) => Promise<ClassComponent | {default: ClassComponent}>,
  setup: Setup,
  title: (title: string) => string,
  page?: Page,
  // [FOR 0.12] visitOptions?: Record<string, any>,
  render?: (vnode: Vnode<AppAttributes>) => Promise<string>
}) {
  const isServer = typeof window === 'undefined';
  const element: undefined | HTMLElement | null = isServer ? undefined : document.querySelector<HTMLElement>(`#${id}`);

  let initialPage = page;
  if (element && element.dataset.page) {
    initialPage = JSON.parse(element.dataset.page) as Page;
  }
  initialPage = initialPage as Page;

  const resolveComponent = async (name: string) => {
    const module = await Promise.resolve(resolve(name));
    return ('default' in module) ? module.default : module;
  };

  let head: ChildArray = [];

  const initialComponent = await resolveComponent(initialPage.component);

  const mithrilApp = setup({
    el: element,
    App: InertiaApp,
    props: {
      initialPage,
      initialComponent,
      resolveComponent,
      titleCallback: title,
      onHeadUpdate: isServer
        ? (elements: ChildArray) => {
          head = elements;
        }
        : undefined
      // [FOR 0.12] visitOptions
    }
  });

  if (isServer && render) {
    const body = await render(
      // @ts-ignore
      m('div', {
        id,
        'data-page': JSON.stringify(initialPage)
      }, mithrilApp)
    );

    return {head, body};
  }
}
