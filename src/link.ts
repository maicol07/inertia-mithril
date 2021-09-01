import m from 'mithril';
import { Inertia, mergeDataIntoQueryString, shouldIntercept } from '@inertiajs/inertia';

export default {
  view: (v) => {
    const method = v.attrs.method.toLowerCase() || 'get';
    const as = v.attrs.as || 'a';
    const [href, data] = mergeDataIntoQueryString(method, v.attrs.href, v.attrs.data)

    if (as === 'a' && method !== 'get') {
      // eslint-disable-next-line no-console
      console.warn(`Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<inertia-link href="${href}" method="${method}" as="button">...</inertia-link>`)
    }

    return m(as, {
      class: v.attrs.class || '',
      href,
      onclick: (event) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          Inertia.visit(href, {
            data,
            method,
            replace: v.attrs.replace || false,
            preserveScroll: v.attrs.preserveScroll || false,
            preserveState: v.attrs.preserveState || false,
            only: v.attrs.only || [],
            headers: v.attrs.headers,
            onCancelToken: v.attrs.cancelToken,
            onBefore: v.attrs.before,
            onStart: v.attrs.start,
            onProgress: v.attrs.progress,
            onFinish: v.attrs.finish,
            onCancel: v.attrs.cancel,
            onSuccess: v.attrs.success,
            onError: v.attrs.error,
          });
        }
      },
    }, v.children);
  },
};
