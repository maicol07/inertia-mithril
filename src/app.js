import {Inertia, createHeadManager} from '@inertiajs/inertia'
import m from 'mithril'

let page = {
    component: {
        view: () => m('div')
    },
    props: {},
    key: null,
}

const app = {
    name: 'Inertia',
    props: {
        initialPage: {
            type: Object,
            required: true,
        },
        initialComponent: {
            type: Object,
            required: false,
        },
        resolveComponent: {
            type: Function,
            required: true,
        },
        titleCallback: {
            type: Function,
            required: false,
            default: title => title,
        },
        onHeadUpdate: {
            type: Function,
            required: false,
            default: () => () => {
            },
        },
    },
    transformProps: props => props,
    oncreate: () => {
        const isServer = typeof window === 'undefined'
        let headManager = createHeadManager(isServer, titleCallback, onHeadUpdate)

        if (!isServer) {
            Inertia.init({
                initialPage: app.props.initialPage,
                resolveComponent: app.props.resolveComponent,
                swapComponent: async (args) => {
                    //page = args.page;
                    page.component = args.component;
                    page.key = args.preserveState ? page.key.value : Date.now()
                },
                updatePage: (component, props, {preserveState}) => {
                    page.component = component
                    page.props = app.transformProps(props)
                    page.key = preserveState ? page.key : Date.now()
                    m.redraw()
                }
            })
        }
    },
    view: () => m(page.component, page.props),
}
export default app;