
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Tailwindcss.svelte generated by Svelte v3.29.0 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tailwindcss", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\Habit.svelte generated by Svelte v3.29.0 */

    const { console: console_1 } = globals;
    const file = "src\\Habit.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let progress_1;
    	let progress_1_class_value;
    	let t2;
    	let div0;
    	let button0;
    	let t3_value = (/*intervalActive*/ ctx[2] == false ? "Start" : "Pause") + "";
    	let t3;
    	let button0_onkeypress_value;
    	let t4;
    	let button1;
    	let t6;
    	let button2;
    	let div1_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			progress_1 = element("progress");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t3 = text(t3_value);
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Reset";
    			t6 = space();
    			button2 = element("button");
    			button2.textContent = "Delete";
    			attr_dev(input0, "class", "center neumorphInputField svelte-9ohqd1");
    			attr_dev(input0, "placeholder", "Habit Name");
    			add_location(input0, file, 247, 2, 6324);
    			attr_dev(input1, "class", "center neumorphInputField svelte-9ohqd1");
    			attr_dev(input1, "size", "2");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "900 (s)");
    			attr_dev(input1, "min", "1");
    			attr_dev(input1, "max", "86400");
    			attr_dev(input1, "pattern", "[0-9]*");
    			attr_dev(input1, "title", "Please use a number between 1 and 86,400");
    			add_location(input1, file, 252, 2, 6484);
    			attr_dev(progress_1, "class", progress_1_class_value = "" + (null_to_empty(/*progress_color*/ ctx[3]) + " svelte-9ohqd1"));
    			progress_1.value = /*$progress*/ ctx[4];
    			add_location(progress_1, file, 262, 2, 6733);
    			attr_dev(button0, "class", "neumorphButton svelte-9ohqd1");
    			attr_dev(button0, "onkeypress", button0_onkeypress_value = /*func*/ ctx[11]);
    			add_location(button0, file, 265, 4, 6887);
    			attr_dev(button1, "class", "neumorphButton svelte-9ohqd1");
    			add_location(button1, file, 274, 4, 7124);
    			attr_dev(button2, "class", "neumorphButton svelte-9ohqd1");
    			add_location(button2, file, 275, 4, 7197);
    			attr_dev(div0, "class", "flex");
    			add_location(div0, file, 264, 2, 6863);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*habitStateCss*/ ctx[6].get(/*habit*/ ctx[0].habitState)) + " svelte-9ohqd1"));
    			add_location(div1, file, 245, 0, 6229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input0);
    			set_input_value(input0, /*habit*/ ctx[0].name);
    			append_dev(div1, t0);
    			append_dev(div1, input1);
    			set_input_value(input1, /*habit*/ ctx[0].duration);
    			append_dev(div1, t1);
    			append_dev(div1, progress_1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(div0, t6);
    			append_dev(div0, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(button0, "click", /*startPauseHabit*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*resetHabit*/ ctx[8], false, false, false),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*handleDelete*/ ctx[1](/*habit*/ ctx[0].id))) /*handleDelete*/ ctx[1](/*habit*/ ctx[0].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*habit*/ 1 && input0.value !== /*habit*/ ctx[0].name) {
    				set_input_value(input0, /*habit*/ ctx[0].name);
    			}

    			if (dirty & /*habit*/ 1 && input1.value !== /*habit*/ ctx[0].duration) {
    				set_input_value(input1, /*habit*/ ctx[0].duration);
    			}

    			if (dirty & /*progress_color*/ 8 && progress_1_class_value !== (progress_1_class_value = "" + (null_to_empty(/*progress_color*/ ctx[3]) + " svelte-9ohqd1"))) {
    				attr_dev(progress_1, "class", progress_1_class_value);
    			}

    			if (dirty & /*$progress*/ 16) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[4]);
    			}

    			if (dirty & /*intervalActive*/ 4 && t3_value !== (t3_value = (/*intervalActive*/ ctx[2] == false ? "Start" : "Pause") + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*habit*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*habitStateCss*/ ctx[6].get(/*habit*/ ctx[0].habitState)) + " svelte-9ohqd1"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Habit", slots, []);
    	let curr_interval;
    	let intervalActive = false;

    	// TODO: when two tasks are made, and editting the first one, pressing enter starts the second one
    	document.onkeydown = function (event) {
    		console.log(event);

    		if (event.key == "Enter") {
    			startPauseHabit();
    		}
    	}; // else if (event.key == "Backspace") {
    	//   handleDelete(habit.id);
    	// }

    	let { habit } = $$props;
    	let { handleDelete } = $$props;
    	const progress = tweened(0, { duration: 1000, easing: identity });
    	validate_store(progress, "progress");
    	component_subscribe($$self, progress, value => $$invalidate(4, $progress = value));
    	var progress_val = 0;
    	var progress_color;

    	let incompleteStyle = // "flex justify-center flex-wrap m-0 bg-green-200 rounded relative border";
    	"neumorph flex flex-wrap justify-around";

    	let almostCompleteStyle = // "flex justify-center flex-wrap m-2 bg-yellow-200 rounded relative border";
    	"neumorph flex flex-wrap justify-around";

    	let completeStyle = // "flex justify-center flex-wrap m-2 bg-red-100 border border-red-400 text-red-700 px-2 rounded relative";
    	"neumorph flex flex-wrap justify-around";

    	const habitState = {
    		COMPLETE: "complete",
    		ALMOSTCOMPLETE: "almostComplete",
    		INCOMPLETE: "incomplete"
    	};

    	let habitStateCss = new Map();
    	habitStateCss.set(habitState.COMPLETE, completeStyle);
    	habitStateCss.set(habitState.INCOMPLETE, incompleteStyle);
    	habitStateCss.set(habitState.ALMOSTCOMPLETE, almostCompleteStyle);

    	function triggerNotification() {
    		let permission;

    		if (!("Notification" in window)) {
    			alert("This browser does not support desktop notification");
    		} else // Otherwise, we need to ask the user for permission
    		if (Notification.permission !== "denied") {
    			permission = Notification.requestPermission();
    		}

    		console.log(Notification.permission);
    		console.log(permission);

    		if (permission === "granted" || Notification.permission === "granted") {
    			var notification = new Notification(`${habit.name} timer is up!`);
    		}
    	}

    	function handleClick() {
    		console.log("handleClick");
    		$$invalidate(0, habit.duration -= 1, habit);

    		// progress.set(habit.duration);
    		// progress_val += 1;
    		// await progress.update(progress_val);
    		// console.log(progress_val);
    		// progress_val += 1;
    		progress_val += 1;

    		console.log(progress_val / habit.duration);
    		progress.set(progress_val / habit.prevDuration);

    		if (habit.duration <= 0) {
    			clearInterval(curr_interval);
    			$$invalidate(0, habit.habitState = habitState.COMPLETE, habit);
    			$$invalidate(3, progress_color = "progressComplete");
    			triggerNotification();
    		} else if (habit.duration <= habit.prevDuration / 3 && habit.duration > 0) {
    			$$invalidate(0, habit.habitState = habitState.ALMOSTCOMPLETE, habit);
    			$$invalidate(3, progress_color = "progressAlmost");
    		} else {
    			$$invalidate(0, habit.habitState = habitState.INCOMPLETE, habit);
    			$$invalidate(3, progress_color = "progressIncomplete");
    		}
    	}

    	function startPauseHabit() {
    		console.log("startPauseHabit");

    		if (intervalActive == true) {
    			// pausing
    			clearInterval(curr_interval);

    			$$invalidate(2, intervalActive = false);
    		} else {
    			//starting
    			$$invalidate(0, habit.prevDuration = habit.duration, habit);

    			curr_interval = setInterval(handleClick, 1000);
    			$$invalidate(2, intervalActive = true);
    		}
    	}

    	function resetHabit() {
    		console.log("resetHabit function");
    		clearInterval(curr_interval);
    		$$invalidate(2, intervalActive = false);
    		$$invalidate(0, habit.duration = habit.prevDuration, habit);
    		$$invalidate(0, habit.habitState = habitState.INCOMPLETE, habit);
    		$$invalidate(3, progress_color = "progressIncomplete");
    		progress_val = 0;
    		progress.set(progress_val);
    	}

    	let buttonCss = "bg-transparent hover:bg-yellow-100 text-grey font-semibold py-2 px-3 border-grey rounded m-2";
    	const writable_props = ["habit", "handleDelete"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Habit> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		habit.name = this.value;
    		$$invalidate(0, habit);
    	}

    	function input1_input_handler() {
    		habit.duration = this.value;
    		$$invalidate(0, habit);
    	}

    	const func = x => {
    		console.log(x);
    		startPauseHabit();
    	};

    	$$self.$$set = $$props => {
    		if ("habit" in $$props) $$invalidate(0, habit = $$props.habit);
    		if ("handleDelete" in $$props) $$invalidate(1, handleDelete = $$props.handleDelete);
    	};

    	$$self.$capture_state = () => ({
    		curr_interval,
    		intervalActive,
    		tweened,
    		cubicOut,
    		linear: identity,
    		writable,
    		habit,
    		handleDelete,
    		progress,
    		progress_val,
    		progress_color,
    		incompleteStyle,
    		almostCompleteStyle,
    		completeStyle,
    		habitState,
    		habitStateCss,
    		triggerNotification,
    		handleClick,
    		startPauseHabit,
    		resetHabit,
    		buttonCss,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ("curr_interval" in $$props) curr_interval = $$props.curr_interval;
    		if ("intervalActive" in $$props) $$invalidate(2, intervalActive = $$props.intervalActive);
    		if ("habit" in $$props) $$invalidate(0, habit = $$props.habit);
    		if ("handleDelete" in $$props) $$invalidate(1, handleDelete = $$props.handleDelete);
    		if ("progress_val" in $$props) progress_val = $$props.progress_val;
    		if ("progress_color" in $$props) $$invalidate(3, progress_color = $$props.progress_color);
    		if ("incompleteStyle" in $$props) incompleteStyle = $$props.incompleteStyle;
    		if ("almostCompleteStyle" in $$props) almostCompleteStyle = $$props.almostCompleteStyle;
    		if ("completeStyle" in $$props) completeStyle = $$props.completeStyle;
    		if ("habitStateCss" in $$props) $$invalidate(6, habitStateCss = $$props.habitStateCss);
    		if ("buttonCss" in $$props) buttonCss = $$props.buttonCss;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		habit,
    		handleDelete,
    		intervalActive,
    		progress_color,
    		$progress,
    		progress,
    		habitStateCss,
    		startPauseHabit,
    		resetHabit,
    		input0_input_handler,
    		input1_input_handler,
    		func
    	];
    }

    class Habit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { habit: 0, handleDelete: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Habit",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*habit*/ ctx[0] === undefined && !("habit" in props)) {
    			console_1.warn("<Habit> was created without expected prop 'habit'");
    		}

    		if (/*handleDelete*/ ctx[1] === undefined && !("handleDelete" in props)) {
    			console_1.warn("<Habit> was created without expected prop 'handleDelete'");
    		}
    	}

    	get habit() {
    		throw new Error("<Habit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set habit(value) {
    		throw new Error("<Habit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleDelete() {
    		throw new Error("<Habit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleDelete(value) {
    		throw new Error("<Habit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    		path: basedir,
    		exports: {},
    		require: function (path, base) {
    			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    		}
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var localforage = createCommonjsModule(function (module, exports) {
    /*!
        localForage -- Offline Storage, Improved
        Version 1.9.0
        https://localforage.github.io/localForage
        (c) 2013-2017 Mozilla, Apache License 2.0
    */
    (function(f){{module.exports=f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
    (function (global){
    var Mutation = global.MutationObserver || global.WebKitMutationObserver;

    var scheduleDrain;

    {
      if (Mutation) {
        var called = 0;
        var observer = new Mutation(nextTick);
        var element = global.document.createTextNode('');
        observer.observe(element, {
          characterData: true
        });
        scheduleDrain = function () {
          element.data = (called = ++called % 2);
        };
      } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
        var channel = new global.MessageChannel();
        channel.port1.onmessage = nextTick;
        scheduleDrain = function () {
          channel.port2.postMessage(0);
        };
      } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
        scheduleDrain = function () {

          // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
          // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
          var scriptEl = global.document.createElement('script');
          scriptEl.onreadystatechange = function () {
            nextTick();

            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
          };
          global.document.documentElement.appendChild(scriptEl);
        };
      } else {
        scheduleDrain = function () {
          setTimeout(nextTick, 0);
        };
      }
    }

    var draining;
    var queue = [];
    //named nextTick for less confusing stack traces
    function nextTick() {
      draining = true;
      var i, oldQueue;
      var len = queue.length;
      while (len) {
        oldQueue = queue;
        queue = [];
        i = -1;
        while (++i < len) {
          oldQueue[i]();
        }
        len = queue.length;
      }
      draining = false;
    }

    module.exports = immediate;
    function immediate(task) {
      if (queue.push(task) === 1 && !draining) {
        scheduleDrain();
      }
    }

    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    },{}],2:[function(_dereq_,module,exports){
    var immediate = _dereq_(1);

    /* istanbul ignore next */
    function INTERNAL() {}

    var handlers = {};

    var REJECTED = ['REJECTED'];
    var FULFILLED = ['FULFILLED'];
    var PENDING = ['PENDING'];

    module.exports = Promise;

    function Promise(resolver) {
      if (typeof resolver !== 'function') {
        throw new TypeError('resolver must be a function');
      }
      this.state = PENDING;
      this.queue = [];
      this.outcome = void 0;
      if (resolver !== INTERNAL) {
        safelyResolveThenable(this, resolver);
      }
    }

    Promise.prototype["catch"] = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
        typeof onRejected !== 'function' && this.state === REJECTED) {
        return this;
      }
      var promise = new this.constructor(INTERNAL);
      if (this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
      } else {
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
      }

      return promise;
    };
    function QueueItem(promise, onFulfilled, onRejected) {
      this.promise = promise;
      if (typeof onFulfilled === 'function') {
        this.onFulfilled = onFulfilled;
        this.callFulfilled = this.otherCallFulfilled;
      }
      if (typeof onRejected === 'function') {
        this.onRejected = onRejected;
        this.callRejected = this.otherCallRejected;
      }
    }
    QueueItem.prototype.callFulfilled = function (value) {
      handlers.resolve(this.promise, value);
    };
    QueueItem.prototype.otherCallFulfilled = function (value) {
      unwrap(this.promise, this.onFulfilled, value);
    };
    QueueItem.prototype.callRejected = function (value) {
      handlers.reject(this.promise, value);
    };
    QueueItem.prototype.otherCallRejected = function (value) {
      unwrap(this.promise, this.onRejected, value);
    };

    function unwrap(promise, func, value) {
      immediate(function () {
        var returnValue;
        try {
          returnValue = func(value);
        } catch (e) {
          return handlers.reject(promise, e);
        }
        if (returnValue === promise) {
          handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
        } else {
          handlers.resolve(promise, returnValue);
        }
      });
    }

    handlers.resolve = function (self, value) {
      var result = tryCatch(getThen, value);
      if (result.status === 'error') {
        return handlers.reject(self, result.value);
      }
      var thenable = result.value;

      if (thenable) {
        safelyResolveThenable(self, thenable);
      } else {
        self.state = FULFILLED;
        self.outcome = value;
        var i = -1;
        var len = self.queue.length;
        while (++i < len) {
          self.queue[i].callFulfilled(value);
        }
      }
      return self;
    };
    handlers.reject = function (self, error) {
      self.state = REJECTED;
      self.outcome = error;
      var i = -1;
      var len = self.queue.length;
      while (++i < len) {
        self.queue[i].callRejected(error);
      }
      return self;
    };

    function getThen(obj) {
      // Make sure we only access the accessor once as required by the spec
      var then = obj && obj.then;
      if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
        return function appyThen() {
          then.apply(obj, arguments);
        };
      }
    }

    function safelyResolveThenable(self, thenable) {
      // Either fulfill, reject or reject with error
      var called = false;
      function onError(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.reject(self, value);
      }

      function onSuccess(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.resolve(self, value);
      }

      function tryToUnwrap() {
        thenable(onSuccess, onError);
      }

      var result = tryCatch(tryToUnwrap);
      if (result.status === 'error') {
        onError(result.value);
      }
    }

    function tryCatch(func, value) {
      var out = {};
      try {
        out.value = func(value);
        out.status = 'success';
      } catch (e) {
        out.status = 'error';
        out.value = e;
      }
      return out;
    }

    Promise.resolve = resolve;
    function resolve(value) {
      if (value instanceof this) {
        return value;
      }
      return handlers.resolve(new this(INTERNAL), value);
    }

    Promise.reject = reject;
    function reject(reason) {
      var promise = new this(INTERNAL);
      return handlers.reject(promise, reason);
    }

    Promise.all = all;
    function all(iterable) {
      var self = this;
      if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
      }

      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }

      var values = new Array(len);
      var resolved = 0;
      var i = -1;
      var promise = new this(INTERNAL);

      while (++i < len) {
        allResolver(iterable[i], i);
      }
      return promise;
      function allResolver(value, i) {
        self.resolve(value).then(resolveFromAll, function (error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
        function resolveFromAll(outValue) {
          values[i] = outValue;
          if (++resolved === len && !called) {
            called = true;
            handlers.resolve(promise, values);
          }
        }
      }
    }

    Promise.race = race;
    function race(iterable) {
      var self = this;
      if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
      }

      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }

      var i = -1;
      var promise = new this(INTERNAL);

      while (++i < len) {
        resolver(iterable[i]);
      }
      return promise;
      function resolver(value) {
        self.resolve(value).then(function (response) {
          if (!called) {
            called = true;
            handlers.resolve(promise, response);
          }
        }, function (error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
      }
    }

    },{"1":1}],3:[function(_dereq_,module,exports){
    (function (global){
    if (typeof global.Promise !== 'function') {
      global.Promise = _dereq_(2);
    }

    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    },{"2":2}],4:[function(_dereq_,module,exports){

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function getIDB() {
        /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
        try {
            if (typeof indexedDB !== 'undefined') {
                return indexedDB;
            }
            if (typeof webkitIndexedDB !== 'undefined') {
                return webkitIndexedDB;
            }
            if (typeof mozIndexedDB !== 'undefined') {
                return mozIndexedDB;
            }
            if (typeof OIndexedDB !== 'undefined') {
                return OIndexedDB;
            }
            if (typeof msIndexedDB !== 'undefined') {
                return msIndexedDB;
            }
        } catch (e) {
            return;
        }
    }

    var idb = getIDB();

    function isIndexedDBValid() {
        try {
            // Initialize IndexedDB; fall back to vendor-prefixed versions
            // if needed.
            if (!idb || !idb.open) {
                return false;
            }
            // We mimic PouchDB here;
            //
            // We test for openDatabase because IE Mobile identifies itself
            // as Safari. Oh the lulz...
            var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

            var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

            // Safari <10.1 does not meet our requirements for IDB support
            // (see: https://github.com/pouchdb/pouchdb/issues/5572).
            // Safari 10.1 shipped with fetch, we can use that to detect it.
            // Note: this creates issues with `window.fetch` polyfills and
            // overrides; see:
            // https://github.com/localForage/localForage/issues/856
            return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
            // some outdated implementations of IDB that appear on Samsung
            // and HTC Android devices <4.4 are missing IDBKeyRange
            // See: https://github.com/mozilla/localForage/issues/128
            // See: https://github.com/mozilla/localForage/issues/272
            typeof IDBKeyRange !== 'undefined';
        } catch (e) {
            return false;
        }
    }

    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    function createBlob(parts, properties) {
        /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
        parts = parts || [];
        properties = properties || {};
        try {
            return new Blob(parts, properties);
        } catch (e) {
            if (e.name !== 'TypeError') {
                throw e;
            }
            var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
            var builder = new Builder();
            for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
        }
    }

    // This is CommonJS because lie is an external dependency, so Rollup
    // can just ignore it.
    if (typeof Promise === 'undefined') {
        // In the "nopromises" build this will just throw if you don't have
        // a global promise object, but it would throw anyway later.
        _dereq_(3);
    }
    var Promise$1 = Promise;

    function executeCallback(promise, callback) {
        if (callback) {
            promise.then(function (result) {
                callback(null, result);
            }, function (error) {
                callback(error);
            });
        }
    }

    function executeTwoCallbacks(promise, callback, errorCallback) {
        if (typeof callback === 'function') {
            promise.then(callback);
        }

        if (typeof errorCallback === 'function') {
            promise["catch"](errorCallback);
        }
    }

    function normalizeKey(key) {
        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        return key;
    }

    function getCallback() {
        if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
            return arguments[arguments.length - 1];
        }
    }

    // Some code originally from async_storage.js in
    // [Gaia](https://github.com/mozilla-b2g/gaia).

    var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
    var supportsBlobs = void 0;
    var dbContexts = {};
    var toString = Object.prototype.toString;

    // Transaction Modes
    var READ_ONLY = 'readonly';
    var READ_WRITE = 'readwrite';

    // Transform a binary string to an array buffer, because otherwise
    // weird stuff happens when you try to work with the binary string directly.
    // It is known.
    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
    // encode-decode-image-with-base64-breaks-image (2013-04-21)
    function _binStringToArrayBuffer(bin) {
        var length = bin.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return buf;
    }

    //
    // Blobs are not supported in all versions of IndexedDB, notably
    // Chrome <37 and Android <5. In those versions, storing a blob will throw.
    //
    // Various other blob bugs exist in Chrome v37-42 (inclusive).
    // Detecting them is expensive and confusing to users, and Chrome 37-42
    // is at very low usage worldwide, so we do a hacky userAgent check instead.
    //
    // content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
    // 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
    // FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
    //
    // Code borrowed from PouchDB. See:
    // https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
    //
    function _checkBlobSupportWithoutCaching(idb) {
        return new Promise$1(function (resolve) {
            var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
            var blob = createBlob(['']);
            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

            txn.onabort = function (e) {
                // If the transaction aborts now its due to not being able to
                // write to the database, likely due to the disk being full
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
            };

            txn.oncomplete = function () {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                // MS Edge pretends to be Chrome 42:
                // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
            };
        })["catch"](function () {
            return false; // error, so assume unsupported
        });
    }

    function _checkBlobSupport(idb) {
        if (typeof supportsBlobs === 'boolean') {
            return Promise$1.resolve(supportsBlobs);
        }
        return _checkBlobSupportWithoutCaching(idb).then(function (value) {
            supportsBlobs = value;
            return supportsBlobs;
        });
    }

    function _deferReadiness(dbInfo) {
        var dbContext = dbContexts[dbInfo.name];

        // Create a deferred object representing the current database operation.
        var deferredOperation = {};

        deferredOperation.promise = new Promise$1(function (resolve, reject) {
            deferredOperation.resolve = resolve;
            deferredOperation.reject = reject;
        });

        // Enqueue the deferred operation.
        dbContext.deferredOperations.push(deferredOperation);

        // Chain its promise to the database readiness.
        if (!dbContext.dbReady) {
            dbContext.dbReady = deferredOperation.promise;
        } else {
            dbContext.dbReady = dbContext.dbReady.then(function () {
                return deferredOperation.promise;
            });
        }
    }

    function _advanceReadiness(dbInfo) {
        var dbContext = dbContexts[dbInfo.name];

        // Dequeue a deferred operation.
        var deferredOperation = dbContext.deferredOperations.pop();

        // Resolve its promise (which is part of the database readiness
        // chain of promises).
        if (deferredOperation) {
            deferredOperation.resolve();
            return deferredOperation.promise;
        }
    }

    function _rejectReadiness(dbInfo, err) {
        var dbContext = dbContexts[dbInfo.name];

        // Dequeue a deferred operation.
        var deferredOperation = dbContext.deferredOperations.pop();

        // Reject its promise (which is part of the database readiness
        // chain of promises).
        if (deferredOperation) {
            deferredOperation.reject(err);
            return deferredOperation.promise;
        }
    }

    function _getConnection(dbInfo, upgradeNeeded) {
        return new Promise$1(function (resolve, reject) {
            dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

            if (dbInfo.db) {
                if (upgradeNeeded) {
                    _deferReadiness(dbInfo);
                    dbInfo.db.close();
                } else {
                    return resolve(dbInfo.db);
                }
            }

            var dbArgs = [dbInfo.name];

            if (upgradeNeeded) {
                dbArgs.push(dbInfo.version);
            }

            var openreq = idb.open.apply(idb, dbArgs);

            if (upgradeNeeded) {
                openreq.onupgradeneeded = function (e) {
                    var db = openreq.result;
                    try {
                        db.createObjectStore(dbInfo.storeName);
                        if (e.oldVersion <= 1) {
                            // Added when support for blob shims was added
                            db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                        }
                    } catch (ex) {
                        if (ex.name === 'ConstraintError') {
                            console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                        } else {
                            throw ex;
                        }
                    }
                };
            }

            openreq.onerror = function (e) {
                e.preventDefault();
                reject(openreq.error);
            };

            openreq.onsuccess = function () {
                resolve(openreq.result);
                _advanceReadiness(dbInfo);
            };
        });
    }

    function _getOriginalConnection(dbInfo) {
        return _getConnection(dbInfo, false);
    }

    function _getUpgradedConnection(dbInfo) {
        return _getConnection(dbInfo, true);
    }

    function _isUpgradeNeeded(dbInfo, defaultVersion) {
        if (!dbInfo.db) {
            return true;
        }

        var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
        var isDowngrade = dbInfo.version < dbInfo.db.version;
        var isUpgrade = dbInfo.version > dbInfo.db.version;

        if (isDowngrade) {
            // If the version is not the default one
            // then warn for impossible downgrade.
            if (dbInfo.version !== defaultVersion) {
                console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
            }
            // Align the versions to prevent errors.
            dbInfo.version = dbInfo.db.version;
        }

        if (isUpgrade || isNewStore) {
            // If the store is new then increment the version (if needed).
            // This will trigger an "upgradeneeded" event which is required
            // for creating a store.
            if (isNewStore) {
                var incVersion = dbInfo.db.version + 1;
                if (incVersion > dbInfo.version) {
                    dbInfo.version = incVersion;
                }
            }

            return true;
        }

        return false;
    }

    // encode a blob for indexeddb engines that don't support blobs
    function _encodeBlob(blob) {
        return new Promise$1(function (resolve, reject) {
            var reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = function (e) {
                var base64 = btoa(e.target.result || '');
                resolve({
                    __local_forage_encoded_blob: true,
                    data: base64,
                    type: blob.type
                });
            };
            reader.readAsBinaryString(blob);
        });
    }

    // decode an encoded blob
    function _decodeBlob(encodedBlob) {
        var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
        return createBlob([arrayBuff], { type: encodedBlob.type });
    }

    // is this one of our fancy encoded blobs?
    function _isEncodedBlob(value) {
        return value && value.__local_forage_encoded_blob;
    }

    // Specialize the default `ready()` function by making it dependent
    // on the current database operations. Thus, the driver will be actually
    // ready when it's been initialized (default) *and* there are no pending
    // operations on the database (initiated by some other instances).
    function _fullyReady(callback) {
        var self = this;

        var promise = self._initReady().then(function () {
            var dbContext = dbContexts[self._dbInfo.name];

            if (dbContext && dbContext.dbReady) {
                return dbContext.dbReady;
            }
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    }

    // Try to establish a new db connection to replace the
    // current one which is broken (i.e. experiencing
    // InvalidStateError while creating a transaction).
    function _tryReconnect(dbInfo) {
        _deferReadiness(dbInfo);

        var dbContext = dbContexts[dbInfo.name];
        var forages = dbContext.forages;

        for (var i = 0; i < forages.length; i++) {
            var forage = forages[i];
            if (forage._dbInfo.db) {
                forage._dbInfo.db.close();
                forage._dbInfo.db = null;
            }
        }
        dbInfo.db = null;

        return _getOriginalConnection(dbInfo).then(function (db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo)) {
                // Reopen the database for upgrading.
                return _getUpgradedConnection(dbInfo);
            }
            return db;
        }).then(function (db) {
            // store the latest db reference
            // in case the db was upgraded
            dbInfo.db = dbContext.db = db;
            for (var i = 0; i < forages.length; i++) {
                forages[i]._dbInfo.db = db;
            }
        })["catch"](function (err) {
            _rejectReadiness(dbInfo, err);
            throw err;
        });
    }

    // FF doesn't like Promises (micro-tasks) and IDDB store operations,
    // so we have to do it with callbacks
    function createTransaction(dbInfo, mode, callback, retries) {
        if (retries === undefined) {
            retries = 1;
        }

        try {
            var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
            callback(null, tx);
        } catch (err) {
            if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
                return Promise$1.resolve().then(function () {
                    if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                        // increase the db version, to create the new ObjectStore
                        if (dbInfo.db) {
                            dbInfo.version = dbInfo.db.version + 1;
                        }
                        // Reopen the database for upgrading.
                        return _getUpgradedConnection(dbInfo);
                    }
                }).then(function () {
                    return _tryReconnect(dbInfo).then(function () {
                        createTransaction(dbInfo, mode, callback, retries - 1);
                    });
                })["catch"](callback);
            }

            callback(err);
        }
    }

    function createDbContext() {
        return {
            // Running localForages sharing a database.
            forages: [],
            // Shared database.
            db: null,
            // Database readiness (promise).
            dbReady: null,
            // Deferred operations on the database.
            deferredOperations: []
        };
    }

    // Open the IndexedDB database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage(options) {
        var self = this;
        var dbInfo = {
            db: null
        };

        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        // Get the current context of the database;
        var dbContext = dbContexts[dbInfo.name];

        // ...or create a new context.
        if (!dbContext) {
            dbContext = createDbContext();
            // Register the new context in the global container.
            dbContexts[dbInfo.name] = dbContext;
        }

        // Register itself as a running localForage in the current context.
        dbContext.forages.push(self);

        // Replace the default `ready()` function with the specialized one.
        if (!self._initReady) {
            self._initReady = self.ready;
            self.ready = _fullyReady;
        }

        // Create an array of initialization states of the related localForages.
        var initPromises = [];

        function ignoreErrors() {
            // Don't handle errors here,
            // just makes sure related localForages aren't pending.
            return Promise$1.resolve();
        }

        for (var j = 0; j < dbContext.forages.length; j++) {
            var forage = dbContext.forages[j];
            if (forage !== self) {
                // Don't wait for itself...
                initPromises.push(forage._initReady()["catch"](ignoreErrors));
            }
        }

        // Take a snapshot of the related localForages.
        var forages = dbContext.forages.slice(0);

        // Initialize the connection process only when
        // all the related localForages aren't pending.
        return Promise$1.all(initPromises).then(function () {
            dbInfo.db = dbContext.db;
            // Get the connection or open a new one without upgrade.
            return _getOriginalConnection(dbInfo);
        }).then(function (db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
                // Reopen the database for upgrading.
                return _getUpgradedConnection(dbInfo);
            }
            return db;
        }).then(function (db) {
            dbInfo.db = dbContext.db = db;
            self._dbInfo = dbInfo;
            // Share the final connection amongst related localForages.
            for (var k = 0; k < forages.length; k++) {
                var forage = forages[k];
                if (forage !== self) {
                    // Self is already up-to-date.
                    forage._dbInfo.db = dbInfo.db;
                    forage._dbInfo.version = dbInfo.version;
                }
            }
        });
    }

    function getItem(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.get(key);

                        req.onsuccess = function () {
                            var value = req.result;
                            if (value === undefined) {
                                value = null;
                            }
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            resolve(value);
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Iterate over all items stored in database.
    function iterate(iterator, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.openCursor();
                        var iterationNumber = 1;

                        req.onsuccess = function () {
                            var cursor = req.result;

                            if (cursor) {
                                var value = cursor.value;
                                if (_isEncodedBlob(value)) {
                                    value = _decodeBlob(value);
                                }
                                var result = iterator(value, cursor.key, iterationNumber++);

                                // when the iterator callback returns any
                                // (non-`undefined`) value, then we stop
                                // the iteration immediately
                                if (result !== void 0) {
                                    resolve(result);
                                } else {
                                    cursor["continue"]();
                                }
                            } else {
                                resolve();
                            }
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);

        return promise;
    }

    function setItem(key, value, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            var dbInfo;
            self.ready().then(function () {
                dbInfo = self._dbInfo;
                if (toString.call(value) === '[object Blob]') {
                    return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                        if (blobSupport) {
                            return value;
                        }
                        return _encodeBlob(value);
                    });
                }
                return value;
            }).then(function (value) {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);

                        // The reason we don't _save_ null is because IE 10 does
                        // not support saving the `null` type in IndexedDB. How
                        // ironic, given the bug below!
                        // See: https://github.com/mozilla/localForage/issues/161
                        if (value === null) {
                            value = undefined;
                        }

                        var req = store.put(value, key);

                        transaction.oncomplete = function () {
                            // Cast to undefined so the value passed to
                            // callback/promise is the same as what one would get out
                            // of `getItem()` later. This leads to some weirdness
                            // (setItem('foo', undefined) will return `null`), but
                            // it's not my fault localStorage is our baseline and that
                            // it's weird.
                            if (value === undefined) {
                                value = null;
                            }

                            resolve(value);
                        };
                        transaction.onabort = transaction.onerror = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function removeItem(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        // We use a Grunt task to make this safe for IE and some
                        // versions of Android (including those used by Cordova).
                        // Normally IE won't like `.delete()` and will insist on
                        // using `['delete']()`, but we have a build step that
                        // fixes this for us now.
                        var req = store["delete"](key);
                        transaction.oncomplete = function () {
                            resolve();
                        };

                        transaction.onerror = function () {
                            reject(req.error);
                        };

                        // The request will be also be aborted if we've exceeded our storage
                        // space.
                        transaction.onabort = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function clear(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.clear();

                        transaction.oncomplete = function () {
                            resolve();
                        };

                        transaction.onabort = transaction.onerror = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function length(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.count();

                        req.onsuccess = function () {
                            resolve(req.result);
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function key(n, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            if (n < 0) {
                resolve(null);

                return;
            }

            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var advanced = false;
                        var req = store.openKeyCursor();

                        req.onsuccess = function () {
                            var cursor = req.result;
                            if (!cursor) {
                                // this means there weren't enough keys
                                resolve(null);

                                return;
                            }

                            if (n === 0) {
                                // We have the first key, return it if that's what they
                                // wanted.
                                resolve(cursor.key);
                            } else {
                                if (!advanced) {
                                    // Otherwise, ask the cursor to skip ahead n
                                    // records.
                                    advanced = true;
                                    cursor.advance(n);
                                } else {
                                    // When we get here, we've got the nth key.
                                    resolve(cursor.key);
                                }
                            }
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.openKeyCursor();
                        var keys = [];

                        req.onsuccess = function () {
                            var cursor = req.result;

                            if (!cursor) {
                                resolve(keys);
                                return;
                            }

                            keys.push(cursor.key);
                            cursor["continue"]();
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function dropInstance(options, callback) {
        callback = getCallback.apply(this, arguments);

        var currentConfig = this.config();
        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

            var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                dbContext.db = db;
                for (var i = 0; i < forages.length; i++) {
                    forages[i]._dbInfo.db = db;
                }
                return db;
            });

            if (!options.storeName) {
                promise = dbPromise.then(function (db) {
                    _deferReadiness(options);

                    var dbContext = dbContexts[options.name];
                    var forages = dbContext.forages;

                    db.close();
                    for (var i = 0; i < forages.length; i++) {
                        var forage = forages[i];
                        forage._dbInfo.db = null;
                    }

                    var dropDBPromise = new Promise$1(function (resolve, reject) {
                        var req = idb.deleteDatabase(options.name);

                        req.onerror = req.onblocked = function (err) {
                            var db = req.result;
                            if (db) {
                                db.close();
                            }
                            reject(err);
                        };

                        req.onsuccess = function () {
                            var db = req.result;
                            if (db) {
                                db.close();
                            }
                            resolve(db);
                        };
                    });

                    return dropDBPromise.then(function (db) {
                        dbContext.db = db;
                        for (var i = 0; i < forages.length; i++) {
                            var _forage = forages[i];
                            _advanceReadiness(_forage._dbInfo);
                        }
                    })["catch"](function (err) {
                        (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                        throw err;
                    });
                });
            } else {
                promise = dbPromise.then(function (db) {
                    if (!db.objectStoreNames.contains(options.storeName)) {
                        return;
                    }

                    var newVersion = db.version + 1;

                    _deferReadiness(options);

                    var dbContext = dbContexts[options.name];
                    var forages = dbContext.forages;

                    db.close();
                    for (var i = 0; i < forages.length; i++) {
                        var forage = forages[i];
                        forage._dbInfo.db = null;
                        forage._dbInfo.version = newVersion;
                    }

                    var dropObjectPromise = new Promise$1(function (resolve, reject) {
                        var req = idb.open(options.name, newVersion);

                        req.onerror = function (err) {
                            var db = req.result;
                            db.close();
                            reject(err);
                        };

                        req.onupgradeneeded = function () {
                            var db = req.result;
                            db.deleteObjectStore(options.storeName);
                        };

                        req.onsuccess = function () {
                            var db = req.result;
                            db.close();
                            resolve(db);
                        };
                    });

                    return dropObjectPromise.then(function (db) {
                        dbContext.db = db;
                        for (var j = 0; j < forages.length; j++) {
                            var _forage2 = forages[j];
                            _forage2._dbInfo.db = db;
                            _advanceReadiness(_forage2._dbInfo);
                        }
                    })["catch"](function (err) {
                        (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                        throw err;
                    });
                });
            }
        }

        executeCallback(promise, callback);
        return promise;
    }

    var asyncStorage = {
        _driver: 'asyncStorage',
        _initStorage: _initStorage,
        _support: isIndexedDBValid(),
        iterate: iterate,
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear,
        length: length,
        key: key,
        keys: keys,
        dropInstance: dropInstance
    };

    function isWebSQLValid() {
        return typeof openDatabase === 'function';
    }

    // Sadly, the best way to save binary data in WebSQL/localStorage is serializing
    // it to Base64, so this is how we store it to prevent very strange errors with less
    // verbose ways of binary <-> string data storage.
    var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var BLOB_TYPE_PREFIX = '~~local_forage_type~';
    var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

    var SERIALIZED_MARKER = '__lfsc__:';
    var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

    // OMG the serializations!
    var TYPE_ARRAYBUFFER = 'arbf';
    var TYPE_BLOB = 'blob';
    var TYPE_INT8ARRAY = 'si08';
    var TYPE_UINT8ARRAY = 'ui08';
    var TYPE_UINT8CLAMPEDARRAY = 'uic8';
    var TYPE_INT16ARRAY = 'si16';
    var TYPE_INT32ARRAY = 'si32';
    var TYPE_UINT16ARRAY = 'ur16';
    var TYPE_UINT32ARRAY = 'ui32';
    var TYPE_FLOAT32ARRAY = 'fl32';
    var TYPE_FLOAT64ARRAY = 'fl64';
    var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

    var toString$1 = Object.prototype.toString;

    function stringToBuffer(serializedString) {
        // Fill the string into a ArrayBuffer.
        var bufferLength = serializedString.length * 0.75;
        var len = serializedString.length;
        var i;
        var p = 0;
        var encoded1, encoded2, encoded3, encoded4;

        if (serializedString[serializedString.length - 1] === '=') {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === '=') {
                bufferLength--;
            }
        }

        var buffer = new ArrayBuffer(bufferLength);
        var bytes = new Uint8Array(buffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

            /*jslint bitwise: true */
            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return buffer;
    }

    // Converts a buffer to a string to store, serialized, in the backend
    // storage library.
    function bufferToString(buffer) {
        // base64-arraybuffer
        var bytes = new Uint8Array(buffer);
        var base64String = '';
        var i;

        for (i = 0; i < bytes.length; i += 3) {
            /*jslint bitwise: true */
            base64String += BASE_CHARS[bytes[i] >> 2];
            base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
            base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
            base64String += BASE_CHARS[bytes[i + 2] & 63];
        }

        if (bytes.length % 3 === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + '=';
        } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + '==';
        }

        return base64String;
    }

    // Serialize a value, afterwards executing a callback (which usually
    // instructs the `setItem()` callback/promise to be executed). This is how
    // we store binary data with localStorage.
    function serialize(value, callback) {
        var valueType = '';
        if (value) {
            valueType = toString$1.call(value);
        }

        // Cannot use `value instanceof ArrayBuffer` or such here, as these
        // checks fail when running the tests using casper.js...
        //
        // TODO: See why those tests fail and use a better solution.
        if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
            // Convert binary arrays to a string and prefix the string with
            // a special marker.
            var buffer;
            var marker = SERIALIZED_MARKER;

            if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
            } else {
                buffer = value.buffer;

                if (valueType === '[object Int8Array]') {
                    marker += TYPE_INT8ARRAY;
                } else if (valueType === '[object Uint8Array]') {
                    marker += TYPE_UINT8ARRAY;
                } else if (valueType === '[object Uint8ClampedArray]') {
                    marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueType === '[object Int16Array]') {
                    marker += TYPE_INT16ARRAY;
                } else if (valueType === '[object Uint16Array]') {
                    marker += TYPE_UINT16ARRAY;
                } else if (valueType === '[object Int32Array]') {
                    marker += TYPE_INT32ARRAY;
                } else if (valueType === '[object Uint32Array]') {
                    marker += TYPE_UINT32ARRAY;
                } else if (valueType === '[object Float32Array]') {
                    marker += TYPE_FLOAT32ARRAY;
                } else if (valueType === '[object Float64Array]') {
                    marker += TYPE_FLOAT64ARRAY;
                } else {
                    callback(new Error('Failed to get type for BinaryArray'));
                }
            }

            callback(marker + bufferToString(buffer));
        } else if (valueType === '[object Blob]') {
            // Conver the blob to a binaryArray and then to a string.
            var fileReader = new FileReader();

            fileReader.onload = function () {
                // Backwards-compatible prefix for the blob type.
                var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };

            fileReader.readAsArrayBuffer(value);
        } else {
            try {
                callback(JSON.stringify(value));
            } catch (e) {
                console.error("Couldn't convert value into a JSON string: ", value);

                callback(null, e);
            }
        }
    }

    // Deserialize data we've inserted into a value column/field. We place
    // special markers into our strings to mark them as encoded; this isn't
    // as nice as a meta field, but it's the only sane thing we can do whilst
    // keeping localStorage support intact.
    //
    // Oftentimes this will just deserialize JSON content, but if we have a
    // special marker (SERIALIZED_MARKER, defined above), we will extract
    // some kind of arraybuffer/binary data/typed array out of the string.
    function deserialize(value) {
        // If we haven't marked this string as being specially serialized (i.e.
        // something other than serialized JSON), we can just return it and be
        // done with it.
        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
        }

        // The following code deals with deserializing some kind of Blob or
        // TypedArray. First we separate out the type of data we're dealing
        // with from the data itself.
        var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
        var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

        var blobType;
        // Backwards-compatible blob type serialization strategy.
        // DBs created with older versions of localForage will simply not have the blob type.
        if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
            blobType = matcher[1];
            serializedString = serializedString.substring(matcher[0].length);
        }
        var buffer = stringToBuffer(serializedString);

        // Return the right type based on the code/type set during
        // serialization.
        switch (type) {
            case TYPE_ARRAYBUFFER:
                return buffer;
            case TYPE_BLOB:
                return createBlob([buffer], { type: blobType });
            case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
            default:
                throw new Error('Unkown type: ' + type);
        }
    }

    var localforageSerializer = {
        serialize: serialize,
        deserialize: deserialize,
        stringToBuffer: stringToBuffer,
        bufferToString: bufferToString
    };

    /*
     * Includes code from:
     *
     * base64-arraybuffer
     * https://github.com/niklasvh/base64-arraybuffer
     *
     * Copyright (c) 2012 Niklas von Hertzen
     * Licensed under the MIT license.
     */

    function createDbTable(t, dbInfo, callback, errorCallback) {
        t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
    }

    // Open the WebSQL database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage$1(options) {
        var self = this;
        var dbInfo = {
            db: null
        };

        if (options) {
            for (var i in options) {
                dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
            }
        }

        var dbInfoPromise = new Promise$1(function (resolve, reject) {
            // Open the database; the openDatabase API will automatically
            // create it for us if it doesn't exist.
            try {
                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
            } catch (e) {
                return reject(e);
            }

            // Create our key/value table if it doesn't exist.
            dbInfo.db.transaction(function (t) {
                createDbTable(t, dbInfo, function () {
                    self._dbInfo = dbInfo;
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            }, reject);
        });

        dbInfo.serializer = localforageSerializer;
        return dbInfoPromise;
    }

    function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
        t.executeSql(sqlStatement, args, callback, function (t, error) {
            if (error.code === error.SYNTAX_ERR) {
                t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
                    if (!results.rows.length) {
                        // if the table is missing (was deleted)
                        // re-create it table and retry
                        createDbTable(t, dbInfo, function () {
                            t.executeSql(sqlStatement, args, callback, errorCallback);
                        }, errorCallback);
                    } else {
                        errorCallback(t, error);
                    }
                }, errorCallback);
            } else {
                errorCallback(t, error);
            }
        }, errorCallback);
    }

    function getItem$1(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                        var result = results.rows.length ? results.rows.item(0).value : null;

                        // Check to see if this is serialized content we need to
                        // unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function iterate$1(iterator, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;

                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                        var rows = results.rows;
                        var length = rows.length;

                        for (var i = 0; i < length; i++) {
                            var item = rows.item(i);
                            var result = item.value;

                            // Check to see if this is serialized content
                            // we need to unpack.
                            if (result) {
                                result = dbInfo.serializer.deserialize(result);
                            }

                            result = iterator(result, item.key, i + 1);

                            // void(0) prevents problems with redefinition
                            // of `undefined`.
                            if (result !== void 0) {
                                resolve(result);
                                return;
                            }
                        }

                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function _setItem(key, value, callback, retriesLeft) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                // The localStorage API doesn't return undefined values in an
                // "expected" way, so undefined is always cast to null in all
                // drivers. See: https://github.com/mozilla/localForage/pull/42
                if (value === undefined) {
                    value = null;
                }

                // Save the original value to pass to the callback.
                var originalValue = value;

                var dbInfo = self._dbInfo;
                dbInfo.serializer.serialize(value, function (value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        dbInfo.db.transaction(function (t) {
                            tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
                                resolve(originalValue);
                            }, function (t, error) {
                                reject(error);
                            });
                        }, function (sqlError) {
                            // The transaction failed; check
                            // to see if it's a quota error.
                            if (sqlError.code === sqlError.QUOTA_ERR) {
                                // We reject the callback outright for now, but
                                // it's worth trying to re-run the transaction.
                                // Even if the user accepts the prompt to use
                                // more storage on Safari, this error will
                                // be called.
                                //
                                // Try to re-run the transaction.
                                if (retriesLeft > 0) {
                                    resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                    return;
                                }
                                reject(sqlError);
                            }
                        });
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function setItem$1(key, value, callback) {
        return _setItem.apply(this, [key, value, callback, 1]);
    }

    function removeItem$1(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Deletes every item in the table.
    // TODO: Find out if this resets the AUTO_INCREMENT number.
    function clear$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Does a simple `COUNT(key)` to get the number of items stored in
    // localForage.
    function length$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    // Ahhh, SQL makes this one soooooo easy.
                    tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                        var result = results.rows.item(0).c;
                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Return the key located at key index X; essentially gets the key from a
    // `WHERE id = ?`. This is the most efficient way I can think to implement
    // this rarely-used (in my experience) part of the API, but it can seem
    // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
    // the ID of each key will change every time it's updated. Perhaps a stored
    // procedure for the `setItem()` SQL would solve this problem?
    // TODO: Don't change ID on `setItem()`.
    function key$1(n, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                        var result = results.rows.length ? results.rows.item(0).key : null;
                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                        var keys = [];

                        for (var i = 0; i < results.rows.length; i++) {
                            keys.push(results.rows.item(i).key);
                        }

                        resolve(keys);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // https://www.w3.org/TR/webdatabase/#databases
    // > There is no way to enumerate or delete the databases available for an origin from this API.
    function getAllStoreNames(db) {
        return new Promise$1(function (resolve, reject) {
            db.transaction(function (t) {
                t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
                    var storeNames = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        storeNames.push(results.rows.item(i).name);
                    }

                    resolve({
                        db: db,
                        storeNames: storeNames
                    });
                }, function (t, error) {
                    reject(error);
                });
            }, function (sqlError) {
                reject(sqlError);
            });
        });
    }

    function dropInstance$1(options, callback) {
        callback = getCallback.apply(this, arguments);

        var currentConfig = this.config();
        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            promise = new Promise$1(function (resolve) {
                var db;
                if (options.name === currentConfig.name) {
                    // use the db reference of the current instance
                    db = self._dbInfo.db;
                } else {
                    db = openDatabase(options.name, '', '', 0);
                }

                if (!options.storeName) {
                    // drop all database tables
                    resolve(getAllStoreNames(db));
                } else {
                    resolve({
                        db: db,
                        storeNames: [options.storeName]
                    });
                }
            }).then(function (operationInfo) {
                return new Promise$1(function (resolve, reject) {
                    operationInfo.db.transaction(function (t) {
                        function dropTable(storeName) {
                            return new Promise$1(function (resolve, reject) {
                                t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
                                    resolve();
                                }, function (t, error) {
                                    reject(error);
                                });
                            });
                        }

                        var operations = [];
                        for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                            operations.push(dropTable(operationInfo.storeNames[i]));
                        }

                        Promise$1.all(operations).then(function () {
                            resolve();
                        })["catch"](function (e) {
                            reject(e);
                        });
                    }, function (sqlError) {
                        reject(sqlError);
                    });
                });
            });
        }

        executeCallback(promise, callback);
        return promise;
    }

    var webSQLStorage = {
        _driver: 'webSQLStorage',
        _initStorage: _initStorage$1,
        _support: isWebSQLValid(),
        iterate: iterate$1,
        getItem: getItem$1,
        setItem: setItem$1,
        removeItem: removeItem$1,
        clear: clear$1,
        length: length$1,
        key: key$1,
        keys: keys$1,
        dropInstance: dropInstance$1
    };

    function isLocalStorageValid() {
        try {
            return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
            // in IE8 typeof localStorage.setItem === 'object'
            !!localStorage.setItem;
        } catch (e) {
            return false;
        }
    }

    function _getKeyPrefix(options, defaultConfig) {
        var keyPrefix = options.name + '/';

        if (options.storeName !== defaultConfig.storeName) {
            keyPrefix += options.storeName + '/';
        }
        return keyPrefix;
    }

    // Check if localStorage throws when saving an item
    function checkIfLocalStorageThrows() {
        var localStorageTestKey = '_localforage_support_test';

        try {
            localStorage.setItem(localStorageTestKey, true);
            localStorage.removeItem(localStorageTestKey);

            return false;
        } catch (e) {
            return true;
        }
    }

    // Check if localStorage is usable and allows to save an item
    // This method checks if localStorage is usable in Safari Private Browsing
    // mode, or in any other case where the available quota for localStorage
    // is 0 and there wasn't any saved items yet.
    function _isLocalStorageUsable() {
        return !checkIfLocalStorageThrows() || localStorage.length > 0;
    }

    // Config the localStorage backend, using options set in the config.
    function _initStorage$2(options) {
        var self = this;
        var dbInfo = {};
        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

        if (!_isLocalStorageUsable()) {
            return Promise$1.reject();
        }

        self._dbInfo = dbInfo;
        dbInfo.serializer = localforageSerializer;

        return Promise$1.resolve();
    }

    // Remove all keys from the datastore, effectively destroying all data in
    // the app's key/value store!
    function clear$2(callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var keyPrefix = self._dbInfo.keyPrefix;

            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);

                if (key.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key);
                }
            }
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Retrieve an item from the store. Unlike the original async_storage
    // library in Gaia, we don't modify return values at all. If a key's value
    // is `undefined`, we pass that value to the callback function.
    function getItem$2(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var result = localStorage.getItem(dbInfo.keyPrefix + key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the key
            // is likely undefined and we'll pass it straight to the
            // callback.
            if (result) {
                result = dbInfo.serializer.deserialize(result);
            }

            return result;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Iterate over all items in the store.
    function iterate$2(iterator, callback) {
        var self = this;

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var keyPrefix = dbInfo.keyPrefix;
            var keyPrefixLength = keyPrefix.length;
            var length = localStorage.length;

            // We use a dedicated iterator instead of the `i` variable below
            // so other keys we fetch in localStorage aren't counted in
            // the `iterationNumber` argument passed to the `iterate()`
            // callback.
            //
            // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
            var iterationNumber = 1;

            for (var i = 0; i < length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(keyPrefix) !== 0) {
                    continue;
                }
                var value = localStorage.getItem(key);

                // If a result was found, parse it from the serialized
                // string into a JS object. If result isn't truthy, the
                // key is likely undefined and we'll pass it straight
                // to the iterator.
                if (value) {
                    value = dbInfo.serializer.deserialize(value);
                }

                value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

                if (value !== void 0) {
                    return value;
                }
            }
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Same as localStorage's key() method, except takes a callback.
    function key$2(n, callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var result;
            try {
                result = localStorage.key(n);
            } catch (error) {
                result = null;
            }

            // Remove the prefix from the key, if a key is found.
            if (result) {
                result = result.substring(dbInfo.keyPrefix.length);
            }

            return result;
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys$2(callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var length = localStorage.length;
            var keys = [];

            for (var i = 0; i < length; i++) {
                var itemKey = localStorage.key(i);
                if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                    keys.push(itemKey.substring(dbInfo.keyPrefix.length));
                }
            }

            return keys;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Supply the number of keys in the datastore to the callback function.
    function length$2(callback) {
        var self = this;
        var promise = self.keys().then(function (keys) {
            return keys.length;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Remove an item from the store, nice and simple.
    function removeItem$2(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            localStorage.removeItem(dbInfo.keyPrefix + key);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Set a key's value and run an optional callback once the value is set.
    // Unlike Gaia's implementation, the callback function is passed the value,
    // in case you want to operate on that value only after you're sure it
    // saved, or something like that.
    function setItem$2(key, value, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            // Convert undefined values to null.
            // https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            return new Promise$1(function (resolve, reject) {
                var dbInfo = self._dbInfo;
                dbInfo.serializer.serialize(value, function (value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        try {
                            localStorage.setItem(dbInfo.keyPrefix + key, value);
                            resolve(originalValue);
                        } catch (e) {
                            // localStorage capacity exceeded.
                            // TODO: Make this a specific error/event.
                            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                reject(e);
                            }
                            reject(e);
                        }
                    }
                });
            });
        });

        executeCallback(promise, callback);
        return promise;
    }

    function dropInstance$2(options, callback) {
        callback = getCallback.apply(this, arguments);

        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            var currentConfig = this.config();
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            promise = new Promise$1(function (resolve) {
                if (!options.storeName) {
                    resolve(options.name + '/');
                } else {
                    resolve(_getKeyPrefix(options, self._defaultConfig));
                }
            }).then(function (keyPrefix) {
                for (var i = localStorage.length - 1; i >= 0; i--) {
                    var key = localStorage.key(i);

                    if (key.indexOf(keyPrefix) === 0) {
                        localStorage.removeItem(key);
                    }
                }
            });
        }

        executeCallback(promise, callback);
        return promise;
    }

    var localStorageWrapper = {
        _driver: 'localStorageWrapper',
        _initStorage: _initStorage$2,
        _support: isLocalStorageValid(),
        iterate: iterate$2,
        getItem: getItem$2,
        setItem: setItem$2,
        removeItem: removeItem$2,
        clear: clear$2,
        length: length$2,
        key: key$2,
        keys: keys$2,
        dropInstance: dropInstance$2
    };

    var sameValue = function sameValue(x, y) {
        return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
    };

    var includes = function includes(array, searchElement) {
        var len = array.length;
        var i = 0;
        while (i < len) {
            if (sameValue(array[i], searchElement)) {
                return true;
            }
            i++;
        }

        return false;
    };

    var isArray = Array.isArray || function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };

    // Drivers are stored here when `defineDriver()` is called.
    // They are shared across all instances of localForage.
    var DefinedDrivers = {};

    var DriverSupport = {};

    var DefaultDrivers = {
        INDEXEDDB: asyncStorage,
        WEBSQL: webSQLStorage,
        LOCALSTORAGE: localStorageWrapper
    };

    var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

    var OptionalDriverMethods = ['dropInstance'];

    var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

    var DefaultConfig = {
        description: '',
        driver: DefaultDriverOrder.slice(),
        name: 'localforage',
        // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
        // we can use without a prompt.
        size: 4980736,
        storeName: 'keyvaluepairs',
        version: 1.0
    };

    function callWhenReady(localForageInstance, libraryMethod) {
        localForageInstance[libraryMethod] = function () {
            var _args = arguments;
            return localForageInstance.ready().then(function () {
                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
            });
        };
    }

    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];

            if (arg) {
                for (var _key in arg) {
                    if (arg.hasOwnProperty(_key)) {
                        if (isArray(arg[_key])) {
                            arguments[0][_key] = arg[_key].slice();
                        } else {
                            arguments[0][_key] = arg[_key];
                        }
                    }
                }
            }
        }

        return arguments[0];
    }

    var LocalForage = function () {
        function LocalForage(options) {
            _classCallCheck(this, LocalForage);

            for (var driverTypeKey in DefaultDrivers) {
                if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                    var driver = DefaultDrivers[driverTypeKey];
                    var driverName = driver._driver;
                    this[driverTypeKey] = driverName;

                    if (!DefinedDrivers[driverName]) {
                        // we don't need to wait for the promise,
                        // since the default drivers can be defined
                        // in a blocking manner
                        this.defineDriver(driver);
                    }
                }
            }

            this._defaultConfig = extend({}, DefaultConfig);
            this._config = extend({}, this._defaultConfig, options);
            this._driverSet = null;
            this._initDriver = null;
            this._ready = false;
            this._dbInfo = null;

            this._wrapLibraryMethodsWithReady();
            this.setDriver(this._config.driver)["catch"](function () {});
        }

        // Set any config values for localForage; can be called anytime before
        // the first API call (e.g. `getItem`, `setItem`).
        // We loop through options so we don't overwrite existing config
        // values.


        LocalForage.prototype.config = function config(options) {
            // If the options argument is an object, we use it to set values.
            // Otherwise, we return either a specified config value or all
            // config values.
            if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                // If localforage is ready and fully initialized, we can't set
                // any new configuration values. Instead, we return an error.
                if (this._ready) {
                    return new Error("Can't call config() after localforage " + 'has been used.');
                }

                for (var i in options) {
                    if (i === 'storeName') {
                        options[i] = options[i].replace(/\W/g, '_');
                    }

                    if (i === 'version' && typeof options[i] !== 'number') {
                        return new Error('Database version must be a number.');
                    }

                    this._config[i] = options[i];
                }

                // after all config options are set and
                // the driver option is used, try setting it
                if ('driver' in options && options.driver) {
                    return this.setDriver(this._config.driver);
                }

                return true;
            } else if (typeof options === 'string') {
                return this._config[options];
            } else {
                return this._config;
            }
        };

        // Used to define a custom driver, shared across all instances of
        // localForage.


        LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
            var promise = new Promise$1(function (resolve, reject) {
                try {
                    var driverName = driverObject._driver;
                    var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

                    // A driver name should be defined and not overlap with the
                    // library-defined, default drivers.
                    if (!driverObject._driver) {
                        reject(complianceError);
                        return;
                    }

                    var driverMethods = LibraryMethods.concat('_initStorage');
                    for (var i = 0, len = driverMethods.length; i < len; i++) {
                        var driverMethodName = driverMethods[i];

                        // when the property is there,
                        // it should be a method even when optional
                        var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                        if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
                            reject(complianceError);
                            return;
                        }
                    }

                    var configureMissingMethods = function configureMissingMethods() {
                        var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                            return function () {
                                var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
                                var promise = Promise$1.reject(error);
                                executeCallback(promise, arguments[arguments.length - 1]);
                                return promise;
                            };
                        };

                        for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                            var optionalDriverMethod = OptionalDriverMethods[_i];
                            if (!driverObject[optionalDriverMethod]) {
                                driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                            }
                        }
                    };

                    configureMissingMethods();

                    var setDriverSupport = function setDriverSupport(support) {
                        if (DefinedDrivers[driverName]) {
                            console.info('Redefining LocalForage driver: ' + driverName);
                        }
                        DefinedDrivers[driverName] = driverObject;
                        DriverSupport[driverName] = support;
                        // don't use a then, so that we can define
                        // drivers that have simple _support methods
                        // in a blocking manner
                        resolve();
                    };

                    if ('_support' in driverObject) {
                        if (driverObject._support && typeof driverObject._support === 'function') {
                            driverObject._support().then(setDriverSupport, reject);
                        } else {
                            setDriverSupport(!!driverObject._support);
                        }
                    } else {
                        setDriverSupport(true);
                    }
                } catch (e) {
                    reject(e);
                }
            });

            executeTwoCallbacks(promise, callback, errorCallback);
            return promise;
        };

        LocalForage.prototype.driver = function driver() {
            return this._driver || null;
        };

        LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
            var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

            executeTwoCallbacks(getDriverPromise, callback, errorCallback);
            return getDriverPromise;
        };

        LocalForage.prototype.getSerializer = function getSerializer(callback) {
            var serializerPromise = Promise$1.resolve(localforageSerializer);
            executeTwoCallbacks(serializerPromise, callback);
            return serializerPromise;
        };

        LocalForage.prototype.ready = function ready(callback) {
            var self = this;

            var promise = self._driverSet.then(function () {
                if (self._ready === null) {
                    self._ready = self._initDriver();
                }

                return self._ready;
            });

            executeTwoCallbacks(promise, callback, callback);
            return promise;
        };

        LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
            var self = this;

            if (!isArray(drivers)) {
                drivers = [drivers];
            }

            var supportedDrivers = this._getSupportedDrivers(drivers);

            function setDriverToConfig() {
                self._config.driver = self.driver();
            }

            function extendSelfWithDriver(driver) {
                self._extend(driver);
                setDriverToConfig();

                self._ready = self._initStorage(self._config);
                return self._ready;
            }

            function initDriver(supportedDrivers) {
                return function () {
                    var currentDriverIndex = 0;

                    function driverPromiseLoop() {
                        while (currentDriverIndex < supportedDrivers.length) {
                            var driverName = supportedDrivers[currentDriverIndex];
                            currentDriverIndex++;

                            self._dbInfo = null;
                            self._ready = null;

                            return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                        }

                        setDriverToConfig();
                        var error = new Error('No available storage method found.');
                        self._driverSet = Promise$1.reject(error);
                        return self._driverSet;
                    }

                    return driverPromiseLoop();
                };
            }

            // There might be a driver initialization in progress
            // so wait for it to finish in order to avoid a possible
            // race condition to set _dbInfo
            var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
                return Promise$1.resolve();
            }) : Promise$1.resolve();

            this._driverSet = oldDriverSetDone.then(function () {
                var driverName = supportedDrivers[0];
                self._dbInfo = null;
                self._ready = null;

                return self.getDriver(driverName).then(function (driver) {
                    self._driver = driver._driver;
                    setDriverToConfig();
                    self._wrapLibraryMethodsWithReady();
                    self._initDriver = initDriver(supportedDrivers);
                });
            })["catch"](function () {
                setDriverToConfig();
                var error = new Error('No available storage method found.');
                self._driverSet = Promise$1.reject(error);
                return self._driverSet;
            });

            executeTwoCallbacks(this._driverSet, callback, errorCallback);
            return this._driverSet;
        };

        LocalForage.prototype.supports = function supports(driverName) {
            return !!DriverSupport[driverName];
        };

        LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
            extend(this, libraryMethodsAndProperties);
        };

        LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
            var supportedDrivers = [];
            for (var i = 0, len = drivers.length; i < len; i++) {
                var driverName = drivers[i];
                if (this.supports(driverName)) {
                    supportedDrivers.push(driverName);
                }
            }
            return supportedDrivers;
        };

        LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
            // Add a stub for each driver API method that delays the call to the
            // corresponding driver method until localForage is ready. These stubs
            // will be replaced by the driver methods as soon as the driver is
            // loaded, so there is no performance impact.
            for (var i = 0, len = LibraryMethods.length; i < len; i++) {
                callWhenReady(this, LibraryMethods[i]);
            }
        };

        LocalForage.prototype.createInstance = function createInstance(options) {
            return new LocalForage(options);
        };

        return LocalForage;
    }();

    // The actual localForage object that we expose as a module or via a
    // global. It's extended by pulling in one of our other libraries.


    var localforage_js = new LocalForage();

    module.exports = localforage_js;

    },{"3":3}]},{},[4])(4)
    });
    });

    /* src\App.svelte generated by Svelte v3.29.0 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (167:2) {#each habitView as habit}
    function create_each_block(ctx) {
    	let habitview;
    	let current;

    	habitview = new Habit({
    			props: {
    				habit: /*habit*/ ctx[10],
    				handleDelete: /*deleteHabit*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(habitview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(habitview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const habitview_changes = {};
    			if (dirty & /*habitView*/ 1) habitview_changes.habit = /*habit*/ ctx[10];
    			habitview.$set(habitview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(habitview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(habitview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(habitview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(167:2) {#each habitView as habit}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let t0;
    	let div;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*habitView*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "New";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Save";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "Delete All";
    			attr_dev(button0, "class", "neumorphButton svelte-1cdv1km");
    			add_location(button0, file$1, 170, 4, 3915);
    			attr_dev(button1, "class", "neumorphButton svelte-1cdv1km");
    			add_location(button1, file$1, 171, 4, 3986);
    			attr_dev(button2, "class", "neumorphButton svelte-1cdv1km");
    			add_location(button2, file$1, 172, 4, 4060);
    			attr_dev(div, "class", "flex justify-center");
    			add_location(div, file$1, 169, 2, 3876);
    			attr_dev(main, "charset", "UTF-8");
    			attr_dev(main, "class", "mainBG");
    			add_location(main, file$1, 165, 0, 3740);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t0);
    			append_dev(main, div);
    			append_dev(div, button0);
    			append_dev(div, t2);
    			append_dev(div, button1);
    			append_dev(div, t4);
    			append_dev(div, button2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*addHabit*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*saveHabits*/ ctx[1], false, false, false),
    					listen_dev(button2, "click", /*resetHabits*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*habitView, deleteHabit*/ 17) {
    				each_value = /*habitView*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function create_UUID() {
    	var dt = new Date().getTime();

    	var uuid = ("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(/[xy]/g, function (c) {
    		var r = (dt + Math.random() * 16) % 16 | 0;
    		dt = Math.floor(dt / 16);
    		return (c == "x" ? r : r & 3 | 8).toString(16);
    	});

    	return uuid;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	const habitState = {
    		COMPLETE: "complete",
    		ALMOSTCOMPLETE: "almostComplete",
    		INCOMPLETE: "incomplete"
    	};

    	class Habit$1 {
    		constructor() {
    			this.id = create_UUID();
    			this.name = "";
    			this.duration = null;
    			this.hitCount = 0;
    			this.habitState = habitState.INCOMPLETE;
    			this.prevDuration = null;
    		}
    	}

    	// localforage.config({ name: "HabitReminder" });
    	let habits;

    	let habitView = [];

    	onMount(async () => {
    		console.log("onMount triggered");
    		habits = await loadHabits();
    		await updateHabitView();
    	});

    	async function saveHabits() {
    		console.log("Saving habits");
    		await localforage.setItem("habits", JSON.stringify([...habits.values()]));
    	}

    	async function loadHabits() {
    		let habitMap = new Map();
    		console.log("Loading habits");
    		let loadedHabits;

    		await localforage.getItem("habits").then(value => {
    			loadedHabits = JSON.parse(value);

    			if (loadedHabits.length != 0) {
    				for (let val of loadedHabits) {
    					habitMap.set(val.id, val);
    				}
    			} else {
    				habitMap = new Map();
    			}
    		}).catch(err => {
    			console.log(err);
    			loadedHabits = new Array();
    			habitMap = new Map();
    		});

    		console.log("Loaded objects:");
    		console.log("loadedHabits:");
    		console.log(loadedHabits);
    		console.log("HabitMap:");
    		console.log(habitMap);
    		return habitMap;
    	}

    	function addHabit() {
    		let newHabit = new Habit$1();
    		console.log("addHabit");
    		console.log(habits);
    		habits.set(newHabit.id, newHabit);
    		updateHabitView();
    	}

    	async function resetHabits() {
    		await localforage.removeItem("habits");
    		habits = new Map();
    		updateHabitView();
    	}

    	function deleteHabit(habitId) {
    		console.log(JSON.stringify(habits.get(habitId)));
    		habits.delete(habitId);
    		updateHabitView();
    	}

    	function updateHabitView() {
    		$$invalidate(0, habitView = Array.from(habits.values()));
    		saveHabits();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Tailwindcss,
    		HabitView: Habit,
    		onMount,
    		localforage,
    		habitState,
    		Habit: Habit$1,
    		habits,
    		habitView,
    		saveHabits,
    		loadHabits,
    		create_UUID,
    		addHabit,
    		resetHabits,
    		deleteHabit,
    		updateHabitView
    	});

    	$$self.$inject_state = $$props => {
    		if ("habits" in $$props) habits = $$props.habits;
    		if ("habitView" in $$props) $$invalidate(0, habitView = $$props.habitView);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [habitView, saveHabits, addHabit, resetHabits, deleteHabit];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    // document.onkeypress = (e) => {
    // 	console.log(e)
    // }
    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
