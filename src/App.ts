import {
  createHeadManager,
  Page,
  PageProps,
  PageResolver,
  router
} from '@inertiajs/core';
import m, {
  ChildArray,
  ClassComponent,
  Component,
  ComponentTypes,
  Vnode,
  VnodeDOM
} from 'mithril';

export interface AppAttributes {
  initialPage: Page,
  initialComponent: ClassComponent,
  resolveComponent: PageResolver,
  titleCallback: (title: string) => string,
  onHeadUpdate: ((elements: ChildArray) => void) | undefined,
  // [FOR 0.12] visitOptions: Record<string, any> | undefined
}

export interface ComponentAttributes<SharedProperties = PageProps> {
  page?: Page<SharedProperties>;
}

export default class App<SharedProperties = PageProps> implements ClassComponent<AppAttributes> {
  component: ComponentTypes<ComponentAttributes<SharedProperties>> | undefined;

  page: Page | undefined;
  key: number | undefined;
  headManager: ReturnType<typeof createHeadManager> | undefined;

  oninit(vnode: Vnode<AppAttributes, this>): any {
    this.component = vnode.attrs.initialComponent;
    this.page = vnode.attrs.initialPage;
    this.headManager = createHeadManager(
      typeof window === 'undefined',
      vnode.attrs.titleCallback || ((title) => title),
      vnode.attrs.onHeadUpdate || (() => {})
    );
  }

  oncreate(vnode: VnodeDOM<AppAttributes>): any {
    router.init({
      initialPage: vnode.attrs.initialPage,
      resolveComponent: vnode.attrs.resolveComponent,
      swapComponent: async ({component, page, preserveState}) => {
        this.component = component as Component;
        this.page = page;
        this.key = preserveState ? this.key : Date.now();

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await m.redraw();
      }
    });

    router.on('navigate', () => this.headManager?.forceUpdate());
  }

  view(vnode: Vnode<AppAttributes>) {
    if (this.page && this.component) {
      // @ts-ignore - FALSE POSITIVE (component is a component and not a string)
      return m(this.component, {page: this.page});
    }

    return m('app');
  }
}
