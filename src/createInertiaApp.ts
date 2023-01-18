import {
  Page,
  PageProps,
  PageResolver,
  setupProgress
} from '@inertiajs/core';
import m, {
  Component,
  Vnode
} from 'mithril';

import App, {AppAttributes} from './App';

// TODO: When shipped, replace with: Inertia.HeadManagerOnUpdate
type HeadManagerOnUpdate = (elements: string[]) => void;
// TODO: When shipped, replace with: Inertia.HeadManagerTitleCallback
type HeadManagerTitleCallback = (title: string) => string;

type AppType<SharedProperties = PageProps> = Component<
/* {
  children?: (properties: {Component: ComponentType; key: Key; props: Page<SharedProperties>['props']}) => ReactNode
} & */ SetupOptions<unknown, SharedProperties>['props']
>;

export type SetupOptions<ElementType, SharedProperties> = {
  el: ElementType
  App: AppType
  props: {
    initialPage: Page<SharedProperties>
    initialComponent: Component
    resolveComponent: PageResolver
    titleCallback?: HeadManagerTitleCallback
    onHeadUpdate?: HeadManagerOnUpdate
  }
};

type BaseInertiaAppOptions = {
  title?: HeadManagerTitleCallback
  resolve: PageResolver
};

type CreateInertiaAppSetupReturnType = Vnode<AppAttributes> | void;
type InertiaAppOptionsForCSR<SharedProperties> = BaseInertiaAppOptions & {
  id?: string
  page?: Page | string
  render?: undefined
  progress?:
  | false
  | {
    delay?: number
    color?: string
    includeCSS?: boolean
    showSpinner?: boolean
  }
  setup: (options: SetupOptions<HTMLElement, SharedProperties>) => CreateInertiaAppSetupReturnType
};

type CreateInertiaAppSSRContent = {head: string[]; body: string};
type InertiaAppOptionsForSSR<SharedProperties> = BaseInertiaAppOptions & {
  id: undefined
  page: Page | string
  render?: (vnode: Vnode<{
    id: string,
    'data-page': string
  }>) => Promise<string>
  progress: undefined
  setup: (options: SetupOptions<null, SharedProperties>) => Vnode<AppAttributes>
};

// eslint-disable-next-line consistent-return
export default async function createInertiaApp<SharedProperties = PageProps>(
  options: InertiaAppOptionsForCSR<SharedProperties>,
): Promise<CreateInertiaAppSetupReturnType>;
export default async function createInertiaApp<SharedProperties = PageProps>(
  options: InertiaAppOptionsForSSR<SharedProperties>,
): Promise<CreateInertiaAppSSRContent>;
// eslint-disable-next-line consistent-return
export default async function createInertiaApp<SharedProperties = PageProps>({
  id = 'app',
  resolve,
  setup,
  title,
  progress = {},
  page,
  render
}: InertiaAppOptionsForCSR<SharedProperties> | InertiaAppOptionsForSSR<SharedProperties>):
  Promise<CreateInertiaAppSetupReturnType | CreateInertiaAppSSRContent> {
  const isServer = typeof window === 'undefined';
  const element: undefined | HTMLElement | null = isServer ? undefined : document.querySelector<HTMLElement>(`#${id}`);
  const initialPage: Page | string = page || JSON.parse(element?.dataset.page ?? '') as Page;
  let head: string[] = [];

  const resolveComponent = async (name: string) => {
    const module = await resolve(name) as Component | {default: Component};
    return ('default' in module) ? module.default : module;
  };

  const initialComponent = await resolveComponent(typeof initialPage === 'string' ? initialPage : initialPage.component);
  const mithrilApp = setup({
    // @ts-expect-error
    el: element,
    // @ts-expect-error
    App,
    // @ts-expect-error
    props: {
      initialPage,
      initialComponent,
      resolveComponent,
      titleCallback: title,
      // eslint-disable-next-line no-return-assign
      onHeadUpdate: isServer ? (elements: string[]) => (head = elements) : undefined
    }
  });

  if (!isServer && progress) {
    setupProgress(progress);
  }

  if (isServer && render && mithrilApp) {
    const body = await render(m(
      'div',
      {
        id,
        'data-page': JSON.stringify(initialPage)
      },
      mithrilApp
    ) as Vnode<{id: string, 'data-page': string}>);

    return {head, body};
  }
}
