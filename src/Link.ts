import {
  GlobalEventCallback, Inertia, mergeDataIntoQueryString, Method, shouldIntercept
} from '@inertiajs/inertia';
import {FormDataConvertible} from '@inertiajs/inertia/types/types';
import m, {ClassComponent, Vnode} from 'mithril';

export interface LinkAttributes {
  href: string,
  as?: string,
  method?: string,
  data?: Record<string, FormDataConvertible>,
  class?: string,
  replace?: boolean,
  preserveScroll?: boolean,
  preserveState?: boolean,
  only?: string[],
  headers?: Record<string, string>,
  onCancelToken?: GlobalEventCallback<'cancel'>,
  onBefore?: GlobalEventCallback<'before'>,
  onStart?: GlobalEventCallback<'start'>,
  onProgress?: GlobalEventCallback<'progress'>,
  onFinish?: GlobalEventCallback<'finish'>,
  onCancel?: GlobalEventCallback<'cancel'>,
  onSuccess?: GlobalEventCallback<'success'>,
  onError?: GlobalEventCallback<'error'>,
}

export default class InertiaLink implements ClassComponent<LinkAttributes> {
  view(vnode: Vnode<LinkAttributes>) {
    const method: Method = vnode.attrs.method?.toLowerCase() as Method || Method.GET;
    const as = vnode.attrs.as || 'a';
    const [href, data] = mergeDataIntoQueryString(method, vnode.attrs.href, vnode.attrs.data ?? {});

    if (as === 'a' && method !== 'get') {
      // eslint-disable-next-line no-console
      console.warn(`Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<InertiaLink href="${href}" method="${method}" as="button">...</InertiaLink>`);
    }

    return m(as, {
      class: vnode.attrs.class || '',
      href,
      onclick: (event: KeyboardEvent) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          Inertia.visit(href, {
            data,
            method,
            replace: vnode.attrs.replace || false,
            preserveScroll: vnode.attrs.preserveScroll || false,
            preserveState: vnode.attrs.preserveState || false,
            only: vnode.attrs.only || [],
            headers: vnode.attrs.headers,
            onCancelToken: vnode.attrs.onCancelToken,
            onBefore: vnode.attrs.onBefore,
            onStart: vnode.attrs.onStart,
            onProgress: vnode.attrs.onProgress,
            onFinish: vnode.attrs.onFinish,
            onCancel: vnode.attrs.onCancel,
            onSuccess: vnode.attrs.onSuccess,
            onError: vnode.attrs.onError
          });
        }
      }
    }, vnode.children);
  }
}
