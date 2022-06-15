
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$2() { }
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
            return noop$2;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$2;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$2;

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
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self$1(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop$2;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop$2;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop$2, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$2, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$2, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$2,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$2;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.6' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
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
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quadIn(t) {
        return t * t;
    }
    function quadOut(t) {
        return -t * (t - 2.0);
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest$1(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest$1(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    /* node_modules\svelte-material-icons\Shuffle.svelte generated by Svelte v3.46.6 */

    const file$T = "node_modules\\svelte-material-icons\\Shuffle.svelte";

    function create_fragment$Z(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$T, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$T, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Shuffle', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Shuffle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Shuffle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$Z, create_fragment$Z, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Shuffle",
    			options,
    			id: create_fragment$Z.name
    		});
    	}

    	get size() {
    		throw new Error("<Shuffle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Shuffle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Shuffle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Shuffle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Shuffle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Shuffle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Shuffle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Shuffle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Shuffle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Shuffle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class TrieNode {
        constructor() {
            this.terminal = false;
            this.children = new Map();
        }
    }
    class Trie {
        constructor() {
            this.root = new TrieNode();
            this.elements = 0;
        }
        get length() {
            return this.elements;
        }
        get(key) {
            const node = this.getNode(key);
            if (node) {
                return node.value;
            }
            return null;
        }
        contains(key) {
            const node = this.getNode(key);
            return !!node;
        }
        insert(key, value) {
            let node = this.root;
            let remaining = key;
            while (remaining.length > 0) {
                let child = null;
                for (const childKey of node.children.keys()) {
                    const prefix = this.commonPrefix(remaining, childKey);
                    if (!prefix.length) {
                        continue;
                    }
                    if (prefix.length === childKey.length) {
                        // enter child node
                        child = node.children.get(childKey);
                        remaining = remaining.slice(childKey.length);
                        break;
                    }
                    else {
                        // split the child
                        child = new TrieNode();
                        child.children.set(childKey.slice(prefix.length), node.children.get(childKey));
                        node.children.delete(childKey);
                        node.children.set(prefix, child);
                        remaining = remaining.slice(prefix.length);
                        break;
                    }
                }
                if (!child && remaining.length) {
                    child = new TrieNode();
                    node.children.set(remaining[0], child);
                    remaining = remaining.slice(1);
                }
                node = child;
            }
            if (!node.terminal) {
                node.terminal = true;
                this.elements += 1;
            }
            node.value = value;
        }
        remove(key) {
            const node = this.getNode(key);
            if (node) {
                node.terminal = false;
                this.elements -= 1;
            }
        }
        map(prefix, func) {
            const mapped = [];
            const node = this.getNode(prefix);
            const stack = [];
            if (node) {
                stack.push([prefix, node]);
            }
            while (stack.length) {
                const [key, node] = stack.pop();
                if (node.terminal) {
                    mapped.push(func(key, node.value));
                }
                for (const c of node.children.keys()) {
                    stack.push([key + c, node.children.get(c)]);
                }
            }
            return mapped;
        }
        getNode(key) {
            let node = this.root;
            let remaining = key;
            while (node && remaining.length > 0) {
                let child = null;
                for (let i = 1; i <= remaining.length; i += 1) {
                    child = node.children.get(remaining.slice(0, i));
                    if (child) {
                        remaining = remaining.slice(i);
                        break;
                    }
                }
                node = child;
            }
            return remaining.length === 0 && node; // && node.terminal ? node : null;
        }
        commonPrefix(a, b) {
            const shortest = Math.min(a.length, b.length);
            let i = 0;
            for (; i < shortest; i += 1) {
                if (a[i] !== b[i]) {
                    break;
                }
            }
            return a.slice(0, i);
        }
    }

    const loadDictionary = async () => {
        const dictionary = new Trie();
        const request = await fetch('./words.json');
        const words = await request.json();
        words.forEach((w) => {
            dictionary.insert(w, w);
        });
        return dictionary;
    };

    const bigrams = {
        A: {
            AT: 18317,
            RA: 13999,
            AL: 13873,
            AN: 13554,
            AR: 12030,
            LA: 10282,
            TA: 8059,
            AS: 8029,
            CA: 7624,
            MA: 6973,
            EA: 6561,
            NA: 6367,
            AC: 6328,
            IA: 5664,
            HA: 4913,
            PA: 4717,
            AM: 4620,
            AB: 4455,
            AD: 4153,
            AP: 3856,
            GA: 3849,
            AG: 3578,
            SA: 3517,
            BA: 3481,
            AI: 3209,
            FA: 2620,
            DA: 2506,
            WA: 2340,
            VA: 2286,
            AU: 1852,
            UA: 1818,
            OA: 1615,
            AV: 1554,
            AY: 1330,
            AK: 1277,
            AW: 924,
            AF: 901,
            ZA: 864,
            AE: 816,
            KA: 743,
            AZ: 632,
            YA: 544,
            JA: 537,
            AX: 458,
            AH: 453,
            XA: 399,
        },
        B: {
            BL: 4607,
            AB: 4455,
            BA: 3481,
            BE: 3400,
            BI: 3349,
            BO: 3344,
            BR: 2392,
            MB: 2246,
            BU: 1979,
            UB: 1969,
            BB: 1840,
            IB: 1800,
            OB: 1793,
            EB: 1382,
            RB: 1349,
            BS: 754,
            NB: 457,
            TB: 372,
            SB: 322,
            LB: 287,
            YB: 240,
            DB: 237,
            BY: 213,
        },
        C: {
            IC: 11478,
            CO: 8470,
            CA: 7624,
            CH: 6859,
            AC: 6328,
            EC: 5763,
            CE: 5726,
            NC: 5521,
            CI: 4851,
            CT: 4426,
            SC: 4042,
            CK: 3952,
            OC: 3593,
            CR: 3184,
            CU: 2977,
            CL: 2269,
            UC: 2078,
            RC: 1993,
            CC: 1798,
            TC: 1065,
            CY: 904,
            CS: 779,
            YC: 723,
            XC: 446,
            LC: 433,
        },
        D: {
            ED: 17538,
            DE: 10664,
            DI: 9448,
            ND: 6332,
            ID: 4615,
            AD: 4153,
            DO: 3749,
            DS: 2825,
            OD: 2744,
            DA: 2506,
            RD: 2425,
            DR: 2266,
            DD: 2004,
            DU: 1808,
            UD: 1374,
            DL: 1299,
            LD: 1169,
            DG: 617,
            DY: 576,
            DN: 460,
            YD: 403,
            DW: 274,
            DB: 237,
            DM: 210,
        },
        E: {
            ES: 35462,
            ER: 30628,
            TE: 19548,
            RE: 19205,
            ED: 17538,
            EN: 16909,
            LE: 14713,
            NE: 13210,
            SE: 11672,
            DE: 10664,
            IE: 9723,
            ME: 8158,
            EL: 8044,
            HE: 7868,
            EE: 7786,
            ET: 7760,
            VE: 7483,
            PE: 7177,
            EA: 6561,
            GE: 6042,
            EC: 5763,
            CE: 5726,
            EM: 5560,
            EP: 3910,
            KE: 3747,
            EX: 3551,
            ZE: 3486,
            BE: 3400,
            FE: 3029,
            EG: 1906,
            EV: 1901,
            EF: 1845,
            WE: 1837,
            EI: 1707,
            EO: 1706,
            UE: 1581,
            EU: 1394,
            EB: 1382,
            EW: 1244,
            OE: 900,
            EY: 864,
            XE: 819,
            AE: 816,
            YE: 777,
            EH: 577,
            EQ: 555,
            JE: 453,
            EK: 301,
        },
        F: {
            FI: 4353,
            FO: 3381,
            FF: 3262,
            FL: 3081,
            FE: 3029,
            FA: 2620,
            IF: 2364,
            FU: 2270,
            FR: 2070,
            EF: 1845,
            NF: 1244,
            AF: 901,
            OF: 886,
            FT: 685,
            RF: 684,
            UF: 506,
            LF: 453,
            FY: 428,
            TF: 403,
            FS: 288,
            SF: 243,
        },
        G: {
            NG: 18777,
            GE: 6042,
            OG: 4152,
            GI: 4024,
            GA: 3849,
            AG: 3578,
            IG: 3363,
            GR: 3290,
            GL: 2742,
            GG: 2552,
            GO: 2092,
            EG: 1906,
            GS: 1751,
            GH: 1643,
            GU: 1573,
            RG: 1540,
            UG: 1188,
            GN: 1109,
            GY: 637,
            DG: 617,
            GM: 345,
            LG: 282,
            YG: 238,
        },
        H: {
            HE: 7868,
            CH: 6859,
            TH: 5640,
            SH: 5533,
            HO: 5332,
            HI: 5169,
            HA: 4913,
            PH: 4210,
            HY: 1919,
            GH: 1643,
            HT: 1205,
            HR: 1179,
            HU: 1100,
            HS: 755,
            WH: 700,
            EH: 577,
            HL: 577,
            RH: 562,
            HN: 474,
            NH: 455,
            AH: 453,
            HM: 356,
            OH: 219,
        },
        I: {
            IN: 32499,
            TI: 21415,
            IS: 15386,
            RI: 14393,
            LI: 14112,
            IC: 11478,
            IT: 10191,
            IE: 9723,
            DI: 9448,
            IO: 8936,
            NI: 7728,
            MI: 7381,
            SI: 7264,
            IL: 7085,
            IA: 5664,
            HI: 5169,
            CI: 4851,
            ID: 4615,
            PI: 4577,
            IZ: 4381,
            FI: 4353,
            GI: 4024,
            IM: 3649,
            IV: 3549,
            IG: 3363,
            BI: 3349,
            IR: 3279,
            AI: 3209,
            VI: 3171,
            KI: 2456,
            IP: 2446,
            IF: 2364,
            OI: 2125,
            UI: 1841,
            IB: 1800,
            EI: 1707,
            WI: 1656,
            ZI: 1329,
            XI: 897,
            YI: 750,
            IK: 736,
            IU: 680,
            IX: 331,
            IQ: 210,
        },
        J: {
            JU: 546,
            JO: 546,
            JA: 537,
            JE: 453,
            NJ: 202,
        },
        K: {
            CK: 3952,
            KE: 3747,
            KI: 2456,
            KS: 1673,
            NK: 1297,
            AK: 1277,
            RK: 1118,
            SK: 909,
            OK: 873,
            KA: 743,
            IK: 736,
            KL: 577,
            LK: 498,
            KN: 378,
            KO: 357,
            KY: 310,
            EK: 301,
        },
        L: {
            LL: 15584,
            LE: 14713,
            LI: 14112,
            AL: 13873,
            LA: 10282,
            EL: 8044,
            LO: 7807,
            OL: 7387,
            IL: 7085,
            LY: 6602,
            UL: 5379,
            BL: 4607,
            PL: 3340,
            LU: 3113,
            FL: 3081,
            GL: 2742,
            LS: 2696,
            CL: 2269,
            LT: 1717,
            SL: 1673,
            TL: 1569,
            DL: 1299,
            LD: 1169,
            RL: 1161,
            YL: 872,
            NL: 604,
            HL: 577,
            KL: 577,
            LM: 543,
            LK: 498,
            LF: 453,
            LN: 434,
            LC: 433,
            LV: 414,
            LP: 368,
            LB: 287,
            LG: 282,
            WL: 268,
        },
        M: {
            ME: 8158,
            MI: 7381,
            MA: 6973,
            EM: 5560,
            OM: 5560,
            MO: 4623,
            AM: 4620,
            IM: 3649,
            UM: 3467,
            MP: 3138,
            MM: 3126,
            RM: 2768,
            SM: 2706,
            MB: 2246,
            MS: 2238,
            MU: 1660,
            YM: 858,
            MY: 693,
            LM: 543,
            NM: 425,
            HM: 356,
            GM: 345,
            TM: 334,
            MN: 270,
            DM: 210,
        },
        N: {
            IN: 32499,
            NG: 18777,
            ON: 17368,
            EN: 16909,
            AN: 13554,
            NE: 13210,
            NT: 11411,
            NS: 8832,
            NI: 7728,
            UN: 7212,
            NA: 6367,
            ND: 6332,
            NC: 5521,
            NO: 5173,
            NN: 3162,
            RN: 1804,
            NU: 1384,
            NK: 1297,
            NF: 1244,
            SN: 1116,
            GN: 1109,
            NV: 695,
            WN: 683,
            YN: 638,
            NL: 604,
            NY: 562,
            HN: 474,
            NR: 469,
            DN: 460,
            NB: 457,
            NH: 455,
            LN: 434,
            NM: 425,
            NP: 394,
            KN: 378,
            TN: 352,
            NW: 318,
            MN: 270,
            NJ: 202,
        },
        O: {
            ON: 17368,
            OR: 12462,
            RO: 10632,
            IO: 8936,
            CO: 8470,
            LO: 7807,
            TO: 7656,
            OO: 7648,
            OL: 7387,
            OU: 7269,
            OS: 5761,
            OM: 5560,
            HO: 5332,
            NO: 5173,
            OT: 4933,
            PO: 4919,
            MO: 4623,
            OP: 4462,
            OG: 4152,
            DO: 3749,
            OC: 3593,
            SO: 3539,
            FO: 3381,
            BO: 3344,
            OD: 2744,
            OV: 2673,
            OW: 2604,
            OI: 2125,
            GO: 2092,
            OB: 1793,
            EO: 1706,
            OA: 1615,
            WO: 1566,
            VO: 1170,
            OE: 900,
            OF: 886,
            OK: 873,
            OX: 780,
            JO: 546,
            ZO: 521,
            YO: 482,
            OY: 481,
            UO: 443,
            KO: 357,
            XO: 357,
            OZ: 309,
            OH: 219,
        },
        P: {
            PE: 7177,
            PR: 5514,
            PO: 4919,
            PA: 4717,
            PI: 4577,
            OP: 4462,
            PH: 4210,
            EP: 3910,
            AP: 3856,
            PP: 3672,
            SP: 3504,
            PL: 3340,
            MP: 3138,
            IP: 2446,
            UP: 2199,
            PS: 1869,
            PT: 1553,
            PU: 1534,
            RP: 1310,
            YP: 1065,
            XP: 822,
            PY: 540,
            NP: 394,
            LP: 368,
            TP: 225,
        },
        Q: {
            QU: 2433,
            EQ: 555,
            SQ: 391,
            IQ: 210,
        },
        R: {
            ER: 30628,
            RE: 19205,
            RI: 14393,
            RA: 13999,
            OR: 12462,
            AR: 12030,
            RO: 10632,
            RS: 9455,
            TR: 7743,
            UR: 5959,
            PR: 5514,
            RR: 4660,
            RT: 3658,
            GR: 3290,
            IR: 3279,
            CR: 3184,
            RM: 2768,
            RU: 2716,
            RD: 2425,
            BR: 2392,
            RY: 2309,
            DR: 2266,
            FR: 2070,
            RC: 1993,
            RN: 1804,
            RG: 1540,
            RB: 1349,
            RP: 1310,
            HR: 1179,
            RL: 1161,
            RK: 1118,
            RF: 684,
            RV: 674,
            RH: 562,
            YR: 557,
            NR: 469,
            WR: 416,
            RW: 376,
        },
        S: {
            ES: 35462,
            SS: 18944,
            ST: 15673,
            IS: 15386,
            SE: 11672,
            RS: 9455,
            NS: 8832,
            AS: 8029,
            SI: 7264,
            TS: 6361,
            US: 5991,
            OS: 5761,
            SH: 5533,
            SC: 4042,
            SU: 3867,
            SO: 3539,
            SA: 3517,
            SP: 3504,
            DS: 2825,
            SM: 2706,
            LS: 2696,
            MS: 2238,
            PS: 1869,
            GS: 1751,
            KS: 1673,
            SL: 1673,
            YS: 1407,
            SN: 1116,
            SY: 1053,
            SK: 909,
            CS: 779,
            HS: 755,
            BS: 754,
            SW: 689,
            WS: 585,
            SQ: 391,
            SB: 322,
            FS: 288,
            SF: 243,
        },
        T: {
            TI: 21415,
            TE: 19548,
            AT: 18317,
            ST: 15673,
            NT: 11411,
            IT: 10191,
            TA: 8059,
            ET: 7760,
            TR: 7743,
            TO: 7656,
            TS: 6361,
            TT: 6132,
            TH: 5640,
            OT: 4933,
            UT: 4467,
            CT: 4426,
            RT: 3658,
            TU: 2989,
            TY: 2394,
            LT: 1717,
            TL: 1569,
            PT: 1553,
            HT: 1205,
            TC: 1065,
            XT: 779,
            YT: 731,
            FT: 685,
            TW: 537,
            TF: 403,
            TB: 372,
            TN: 352,
            TM: 334,
            TP: 225,
            TZ: 223,
        },
        U: {
            OU: 7269,
            UN: 7212,
            US: 5991,
            UR: 5959,
            UL: 5379,
            UT: 4467,
            SU: 3867,
            UM: 3467,
            LU: 3113,
            TU: 2989,
            CU: 2977,
            RU: 2716,
            QU: 2433,
            FU: 2270,
            UP: 2199,
            UC: 2078,
            BU: 1979,
            UB: 1969,
            AU: 1852,
            UI: 1841,
            UA: 1818,
            DU: 1808,
            MU: 1660,
            UE: 1581,
            GU: 1573,
            PU: 1534,
            EU: 1394,
            NU: 1384,
            UD: 1374,
            UG: 1188,
            HU: 1100,
            IU: 680,
            JU: 546,
            UF: 506,
            UO: 443,
        },
        V: {
            VE: 7483,
            IV: 3549,
            VI: 3171,
            OV: 2673,
            VA: 2286,
            EV: 1901,
            AV: 1554,
            VO: 1170,
            NV: 695,
            RV: 674,
            LV: 414,
        },
        W: {
            OW: 2604,
            WA: 2340,
            WE: 1837,
            WI: 1656,
            WO: 1566,
            EW: 1244,
            AW: 924,
            WH: 700,
            SW: 689,
            WN: 683,
            WS: 585,
            TW: 537,
            WR: 416,
            RW: 376,
            NW: 318,
            DW: 274,
            WL: 268,
        },
        X: {
            EX: 3551,
            XI: 897,
            XP: 822,
            XE: 819,
            OX: 780,
            XT: 779,
            AX: 458,
            XC: 446,
            XA: 399,
            XO: 357,
            IX: 331,
        },
        Y: {
            LY: 6602,
            TY: 2394,
            RY: 2309,
            HY: 1919,
            YS: 1407,
            AY: 1330,
            YP: 1065,
            SY: 1053,
            CY: 904,
            YL: 872,
            EY: 864,
            YM: 858,
            YE: 777,
            YI: 750,
            YT: 731,
            YC: 723,
            MY: 693,
            YN: 638,
            GY: 637,
            DY: 576,
            NY: 562,
            YR: 557,
            YA: 544,
            PY: 540,
            YO: 482,
            OY: 481,
            FY: 428,
            YD: 403,
            KY: 310,
            YB: 240,
            YG: 238,
            BY: 213,
        },
        Z: {
            IZ: 4381,
            ZE: 3486,
            ZI: 1329,
            ZA: 864,
            ZZ: 788,
            AZ: 632,
            ZO: 521,
            OZ: 309,
            TZ: 223,
        },
    };

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$2) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
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
        function subscribe(run, invalidate = noop$2) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$2;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const version$6 = '1.35.3';

    // constants.ts
    const DEFAULT_HEADERS$4 = { 'X-Client-Info': `supabase-js/${version$6}` };
    const STORAGE_KEY$1 = 'supabase.auth.token';

    // helpers.ts
    function stripTrailingSlash(url) {
        return url.replace(/\/$/, '');
    }
    const isBrowser$1 = () => typeof window !== 'undefined';

    // generated by genversion
    const version$5 = '1.22.15';

    const GOTRUE_URL = 'http://localhost:9999';
    const DEFAULT_HEADERS$3 = { 'X-Client-Info': `gotrue-js/${version$5}` };
    const EXPIRY_MARGIN = 10; // in seconds
    const NETWORK_FAILURE = {
        ERROR_MESSAGE: 'Request Failed',
        MAX_RETRIES: 10,
        RETRY_INTERVAL: 2, // in deciseconds
    };
    const STORAGE_KEY = 'supabase.auth.token';
    const COOKIE_OPTIONS = {
        name: 'sb',
        lifetime: 60 * 60 * 8,
        domain: '',
        path: '/',
        sameSite: 'lax',
    };

    var __awaiter$a = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const _getErrorMessage$1 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    const handleError$1 = (error, reject) => {
        if (!(error === null || error === void 0 ? void 0 : error.status)) {
            return reject({ message: NETWORK_FAILURE.ERROR_MESSAGE });
        }
        if (typeof error.json !== 'function') {
            return reject(error);
        }
        error.json().then((err) => {
            return reject({
                message: _getErrorMessage$1(err),
                status: (error === null || error === void 0 ? void 0 : error.status) || 500,
            });
        });
    };
    const _getRequestParams$1 = (method, options, body) => {
        const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
        if (method === 'GET') {
            return params;
        }
        params.headers = Object.assign({ 'Content-Type': 'text/plain;charset=UTF-8' }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
        return params;
    };
    function _handleRequest$1(fetcher, method, url, options, body) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fetcher(url, _getRequestParams$1(method, options, body))
                    .then((result) => {
                    if (!result.ok)
                        throw result;
                    if (options === null || options === void 0 ? void 0 : options.noResolveJson)
                        return resolve;
                    return result.json();
                })
                    .then((data) => resolve(data))
                    .catch((error) => handleError$1(error, reject));
            });
        });
    }
    function get$1(fetcher, url, options) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return _handleRequest$1(fetcher, 'GET', url, options);
        });
    }
    function post$1(fetcher, url, body, options) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return _handleRequest$1(fetcher, 'POST', url, options, body);
        });
    }
    function put$1(fetcher, url, body, options) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return _handleRequest$1(fetcher, 'PUT', url, options, body);
        });
    }
    function remove$1(fetcher, url, body, options) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return _handleRequest$1(fetcher, 'DELETE', url, options, body);
        });
    }

    /**
     * Serialize data into a cookie header.
     */
    function serialize(name, val, options) {
        const opt = options || {};
        const enc = encodeURIComponent;
        /* eslint-disable-next-line no-control-regex */
        const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        if (typeof enc !== 'function') {
            throw new TypeError('option encode is invalid');
        }
        if (!fieldContentRegExp.test(name)) {
            throw new TypeError('argument name is invalid');
        }
        const value = enc(val);
        if (value && !fieldContentRegExp.test(value)) {
            throw new TypeError('argument val is invalid');
        }
        let str = name + '=' + value;
        if (null != opt.maxAge) {
            const maxAge = opt.maxAge - 0;
            if (isNaN(maxAge) || !isFinite(maxAge)) {
                throw new TypeError('option maxAge is invalid');
            }
            str += '; Max-Age=' + Math.floor(maxAge);
        }
        if (opt.domain) {
            if (!fieldContentRegExp.test(opt.domain)) {
                throw new TypeError('option domain is invalid');
            }
            str += '; Domain=' + opt.domain;
        }
        if (opt.path) {
            if (!fieldContentRegExp.test(opt.path)) {
                throw new TypeError('option path is invalid');
            }
            str += '; Path=' + opt.path;
        }
        if (opt.expires) {
            if (typeof opt.expires.toUTCString !== 'function') {
                throw new TypeError('option expires is invalid');
            }
            str += '; Expires=' + opt.expires.toUTCString();
        }
        if (opt.httpOnly) {
            str += '; HttpOnly';
        }
        if (opt.secure) {
            str += '; Secure';
        }
        if (opt.sameSite) {
            const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;
            switch (sameSite) {
                case 'lax':
                    str += '; SameSite=Lax';
                    break;
                case 'strict':
                    str += '; SameSite=Strict';
                    break;
                case 'none':
                    str += '; SameSite=None';
                    break;
                default:
                    throw new TypeError('option sameSite is invalid');
            }
        }
        return str;
    }
    /**
     * Based on the environment and the request we know if a secure cookie can be set.
     */
    function isSecureEnvironment(req) {
        if (!req || !req.headers || !req.headers.host) {
            throw new Error('The "host" request header is not available');
        }
        const host = (req.headers.host.indexOf(':') > -1 && req.headers.host.split(':')[0]) || req.headers.host;
        if (['localhost', '127.0.0.1'].indexOf(host) > -1 || host.endsWith('.local')) {
            return false;
        }
        return true;
    }
    /**
     * Serialize a cookie to a string.
     */
    function serializeCookie(cookie, secure) {
        var _a, _b, _c;
        return serialize(cookie.name, cookie.value, {
            maxAge: cookie.maxAge,
            expires: new Date(Date.now() + cookie.maxAge * 1000),
            httpOnly: true,
            secure,
            path: (_a = cookie.path) !== null && _a !== void 0 ? _a : '/',
            domain: (_b = cookie.domain) !== null && _b !== void 0 ? _b : '',
            sameSite: (_c = cookie.sameSite) !== null && _c !== void 0 ? _c : 'lax',
        });
    }
    /**
     * Get Cookie Header strings.
     */
    function getCookieString(req, res, cookies) {
        const strCookies = cookies.map((c) => serializeCookie(c, isSecureEnvironment(req)));
        const previousCookies = res.getHeader('Set-Cookie');
        if (previousCookies) {
            if (previousCookies instanceof Array) {
                Array.prototype.push.apply(strCookies, previousCookies);
            }
            else if (typeof previousCookies === 'string') {
                strCookies.push(previousCookies);
            }
        }
        return strCookies;
    }
    /**
     * Set one or more cookies.
     */
    function setCookies(req, res, cookies) {
        res.setHeader('Set-Cookie', getCookieString(req, res, cookies));
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var browserPonyfill = createCommonjsModule(function (module, exports) {
    var global = typeof self !== 'undefined' ? self : commonjsGlobal;
    var __self__ = (function () {
    function F() {
    this.fetch = false;
    this.DOMException = global.DOMException;
    }
    F.prototype = global;
    return new F();
    })();
    (function(self) {

    ((function (exports) {

      var support = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob:
          'FileReader' in self &&
          'Blob' in self &&
          (function() {
            try {
              new Blob();
              return true
            } catch (e) {
              return false
            }
          })(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
      };

      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
      }

      if (support.arrayBuffer) {
        var viewClasses = [
          '[object Int8Array]',
          '[object Uint8Array]',
          '[object Uint8ClampedArray]',
          '[object Int16Array]',
          '[object Uint16Array]',
          '[object Int32Array]',
          '[object Uint32Array]',
          '[object Float32Array]',
          '[object Float64Array]'
        ];

        var isArrayBufferView =
          ArrayBuffer.isView ||
          function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
          };
      }

      function normalizeName(name) {
        if (typeof name !== 'string') {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
      }

      function normalizeValue(value) {
        if (typeof value !== 'string') {
          value = String(value);
        }
        return value
      }

      // Build a destructive iterator for the value list
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value}
          }
        };

        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator
          };
        }

        return iterator
      }

      function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }

      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
      };

      Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)];
      };

      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null
      };

      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name))
      };

      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };

      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };

      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items)
      };

      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items)
      };

      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items)
      };

      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }

      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true;
      }

      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        })
      }

      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise
      }

      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise
      }

      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('')
      }

      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0)
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer
        }
      }

      function Body() {
        this.bodyUsed = false;

        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = '';
          } else if (typeof body === 'string') {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            // IE 10-11 can't handle a DataView body.
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }

          if (!this.headers.get('content-type')) {
            if (typeof body === 'string') {
              this.headers.set('content-type', 'text/plain;charset=UTF-8');
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set('content-type', this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
          }
        };

        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected
            }

            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob')
            } else {
              return Promise.resolve(new Blob([this._bodyText]))
            }
          };

          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
            } else {
              return this.blob().then(readBlobAsArrayBuffer)
            }
          };
        }

        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
          } else {
            return Promise.resolve(this._bodyText)
          }
        };

        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode)
          };
        }

        this.json = function() {
          return this.text().then(JSON.parse)
        };

        return this
      }

      // HTTP methods whose capitalization should be normalized
      var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method
      }

      function Request(input, options) {
        options = options || {};
        var body = options.body;

        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError('Already read')
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }

        this.credentials = options.credentials || this.credentials || 'same-origin';
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
          throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body);
      }

      Request.prototype.clone = function() {
        return new Request(this, {body: this._bodyInit})
      };

      function decode(body) {
        var form = new FormData();
        body
          .trim()
          .split('&')
          .forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
        return form
      }

      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(':');
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(':').trim();
            headers.append(key, value);
          }
        });
        return headers
      }

      Body.call(Request.prototype);

      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }

        this.type = 'default';
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = 'statusText' in options ? options.statusText : 'OK';
        this.headers = new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(bodyInit);
      }

      Body.call(Response.prototype);

      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        })
      };

      Response.error = function() {
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response
      };

      var redirectStatuses = [301, 302, 303, 307, 308];

      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
      };

      exports.DOMException = self.DOMException;
      try {
        new exports.DOMException();
      } catch (err) {
        exports.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
      }

      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);

          if (request.signal && request.signal.aborted) {
            return reject(new exports.DOMException('Aborted', 'AbortError'))
          }

          var xhr = new XMLHttpRequest();

          function abortXhr() {
            xhr.abort();
          }

          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || '')
            };
            options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
            var body = 'response' in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };

          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.ontimeout = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.onabort = function() {
            reject(new exports.DOMException('Aborted', 'AbortError'));
          };

          xhr.open(request.method, request.url, true);

          if (request.credentials === 'include') {
            xhr.withCredentials = true;
          } else if (request.credentials === 'omit') {
            xhr.withCredentials = false;
          }

          if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob';
          }

          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });

          if (request.signal) {
            request.signal.addEventListener('abort', abortXhr);

            xhr.onreadystatechange = function() {
              // DONE (success or failure)
              if (xhr.readyState === 4) {
                request.signal.removeEventListener('abort', abortXhr);
              }
            };
          }

          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        })
      }

      fetch.polyfill = true;

      if (!self.fetch) {
        self.fetch = fetch;
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
      }

      exports.Headers = Headers;
      exports.Request = Request;
      exports.Response = Response;
      exports.fetch = fetch;

      Object.defineProperty(exports, '__esModule', { value: true });

      return exports;

    }))({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    // Remove "polyfill" property added by whatwg-fetch
    delete __self__.fetch.polyfill;
    // Choose between native implementation (global) or custom implementation (__self__)
    // var ctx = global.fetch ? global : __self__;
    var ctx = __self__; // this line disable service worker support temporarily
    exports = ctx.fetch; // To enable: import fetch from 'cross-fetch'
    exports.default = ctx.fetch; // For TypeScript consumers without esModuleInterop.
    exports.fetch = ctx.fetch; // To enable: import {fetch} from 'cross-fetch'
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
    });

    var crossFetch = /*@__PURE__*/getDefaultExportFromCjs(browserPonyfill);

    var __awaiter$9 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    function expiresAt(expiresIn) {
        const timeNow = Math.round(Date.now() / 1000);
        return timeNow + expiresIn;
    }
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    const isBrowser = () => typeof window !== 'undefined';
    function getParameterByName(name, url) {
        var _a;
        if (!url)
            url = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) || '';
        // eslint-disable-next-line no-useless-escape
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    const resolveFetch$2 = (customFetch) => {
        let _fetch;
        if (customFetch) {
            _fetch = customFetch;
        }
        else if (typeof fetch === 'undefined') {
            _fetch = crossFetch;
        }
        else {
            _fetch = fetch;
        }
        return (...args) => _fetch(...args);
    };
    // LocalStorage helpers
    const setItemAsync = (storage, key, data) => __awaiter$9(void 0, void 0, void 0, function* () {
        isBrowser() && (yield (storage === null || storage === void 0 ? void 0 : storage.setItem(key, JSON.stringify(data))));
    });
    const getItemAsync = (storage, key) => __awaiter$9(void 0, void 0, void 0, function* () {
        const value = isBrowser() && (yield (storage === null || storage === void 0 ? void 0 : storage.getItem(key)));
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return value;
        }
    });
    const getItemSynchronously = (storage, key) => {
        const value = isBrowser() && (storage === null || storage === void 0 ? void 0 : storage.getItem(key));
        if (!value || typeof value !== 'string') {
            return null;
        }
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return value;
        }
    };
    const removeItemAsync = (storage, key) => __awaiter$9(void 0, void 0, void 0, function* () {
        isBrowser() && (yield (storage === null || storage === void 0 ? void 0 : storage.removeItem(key)));
    });

    var __awaiter$8 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class GoTrueApi {
        constructor({ url = '', headers = {}, cookieOptions, fetch, }) {
            this.url = url;
            this.headers = headers;
            this.cookieOptions = Object.assign(Object.assign({}, COOKIE_OPTIONS), cookieOptions);
            this.fetch = resolveFetch$2(fetch);
        }
        /**
         * Create a temporary object with all configured headers and
         * adds the Authorization token to be used on request methods
         * @param jwt A valid, logged-in JWT.
         */
        _createRequestHeaders(jwt) {
            const headers = Object.assign({}, this.headers);
            headers['Authorization'] = `Bearer ${jwt}`;
            return headers;
        }
        cookieName() {
            var _a;
            return (_a = this.cookieOptions.name) !== null && _a !== void 0 ? _a : '';
        }
        /**
         * Generates the relevant login URL for a third-party provider.
         * @param provider One of the providers supported by GoTrue.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         * @param scopes A space-separated list of scopes granted to the OAuth application.
         */
        getUrlForProvider(provider, options) {
            const urlParams = [`provider=${encodeURIComponent(provider)}`];
            if (options === null || options === void 0 ? void 0 : options.redirectTo) {
                urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
            }
            if (options === null || options === void 0 ? void 0 : options.scopes) {
                urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
            }
            return `${this.url}/authorize?${urlParams.join('&')}`;
        }
        /**
         * Creates a new user using their email address.
         * @param email The email address of the user.
         * @param password The password of the user.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         * @param data Optional user metadata.
         *
         * @returns A logged-in session if the server has "autoconfirm" ON
         * @returns A user if the server has "autoconfirm" OFF
         */
        signUpWithEmail(email, password, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '';
                    if (options.redirectTo) {
                        queryString = '?redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const data = yield post$1(this.fetch, `${this.url}/signup${queryString}`, {
                        email,
                        password,
                        data: options.data,
                        gotrue_meta_security: { hcaptcha_token: options.captchaToken },
                    }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Logs in an existing user using their email address.
         * @param email The email address of the user.
         * @param password The password of the user.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        signInWithEmail(email, password, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '?grant_type=password';
                    if (options.redirectTo) {
                        queryString += '&redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const data = yield post$1(this.fetch, `${this.url}/token${queryString}`, { email, password }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Signs up a new user using their phone number and a password.
         * @param phone The phone number of the user.
         * @param password The password of the user.
         * @param data Optional user metadata.
         */
        signUpWithPhone(phone, password, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const data = yield post$1(this.fetch, `${this.url}/signup`, {
                        phone,
                        password,
                        data: options.data,
                        gotrue_meta_security: { hcaptcha_token: options.captchaToken },
                    }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Logs in an existing user using their phone number and password.
         * @param phone The phone number of the user.
         * @param password The password of the user.
         */
        signInWithPhone(phone, password) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const queryString = '?grant_type=password';
                    const data = yield post$1(this.fetch, `${this.url}/token${queryString}`, { phone, password }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Logs in an OpenID Connect user using their id_token.
         * @param id_token The IDToken of the user.
         * @param nonce The nonce of the user. The nonce is a random value generated by the developer (= yourself) before the initial grant is started. You should check the OpenID Connect specification for details. https://openid.net/developers/specs/
         * @param provider The provider of the user.
         * @param client_id The clientID of the user.
         * @param issuer The issuer of the user.
         */
        signInWithOpenIDConnect({ id_token, nonce, client_id, issuer, provider, }) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const queryString = '?grant_type=id_token';
                    const data = yield post$1(this.fetch, `${this.url}/token${queryString}`, { id_token, nonce, client_id, issuer, provider }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Sends a magic login link to an email address.
         * @param email The email address of the user.
         * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        sendMagicLinkEmail(email, options = {}) {
            var _a;
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '';
                    if (options.redirectTo) {
                        queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const shouldCreateUser = (_a = options.shouldCreateUser) !== null && _a !== void 0 ? _a : true;
                    const data = yield post$1(this.fetch, `${this.url}/otp${queryString}`, {
                        email,
                        create_user: shouldCreateUser,
                        gotrue_meta_security: { hcaptcha_token: options.captchaToken },
                    }, { headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Sends a mobile OTP via SMS. Will register the account if it doesn't already exist
         * @param phone The user's phone number WITH international prefix
         * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
         */
        sendMobileOTP(phone, options = {}) {
            var _a;
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const shouldCreateUser = (_a = options.shouldCreateUser) !== null && _a !== void 0 ? _a : true;
                    const headers = Object.assign({}, this.headers);
                    const data = yield post$1(this.fetch, `${this.url}/otp`, {
                        phone,
                        create_user: shouldCreateUser,
                        gotrue_meta_security: { hcaptcha_token: options.captchaToken },
                    }, { headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Removes a logged-in session.
         * @param jwt A valid, logged-in JWT.
         */
        signOut(jwt) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    yield post$1(this.fetch, `${this.url}/logout`, {}, { headers: this._createRequestHeaders(jwt), noResolveJson: true });
                    return { error: null };
                }
                catch (e) {
                    return { error: e };
                }
            });
        }
        /**
         * @deprecated Use `verifyOTP` instead!
         * @param phone The user's phone number WITH international prefix
         * @param token token that user was sent to their mobile phone
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        verifyMobileOTP(phone, token, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const data = yield post$1(this.fetch, `${this.url}/verify`, { phone, token, type: 'sms', redirect_to: options.redirectTo }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Send User supplied Email / Mobile OTP to be verified
         * @param email The user's email address
         * @param phone The user's phone number WITH international prefix
         * @param token token that user was sent to their mobile phone
         * @param type verification type that the otp is generated for
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        verifyOTP({ email, phone, token, type = 'sms' }, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const data = yield post$1(this.fetch, `${this.url}/verify`, { email, phone, token, type, redirect_to: options.redirectTo }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Sends an invite link to an email address.
         * @param email The email address of the user.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         * @param data Optional user metadata
         */
        inviteUserByEmail(email, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '';
                    if (options.redirectTo) {
                        queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const data = yield post$1(this.fetch, `${this.url}/invite${queryString}`, { email, data: options.data }, { headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Sends a reset request to an email address.
         * @param email The email address of the user.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        resetPasswordForEmail(email, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '';
                    if (options.redirectTo) {
                        queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const data = yield post$1(this.fetch, `${this.url}/recover${queryString}`, { email, gotrue_meta_security: { hcaptcha_token: options.captchaToken } }, { headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Generates a new JWT.
         * @param refreshToken A valid refresh token that was returned on login.
         */
        refreshAccessToken(refreshToken) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield post$1(this.fetch, `${this.url}/token?grant_type=refresh_token`, { refresh_token: refreshToken }, { headers: this.headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Set/delete the auth cookie based on the AuthChangeEvent.
         * Works for Next.js & Express (requires cookie-parser middleware).
         * @param req The request object.
         * @param res The response object.
         */
        setAuthCookie(req, res) {
            if (req.method !== 'POST') {
                res.setHeader('Allow', 'POST');
                res.status(405).end('Method Not Allowed');
            }
            const { event, session } = req.body;
            if (!event)
                throw new Error('Auth event missing!');
            if (event === 'SIGNED_IN') {
                if (!session)
                    throw new Error('Auth session missing!');
                setCookies(req, res, [
                    { key: 'access-token', value: session.access_token },
                    { key: 'refresh-token', value: session.refresh_token },
                ].map((token) => {
                    var _a;
                    return ({
                        name: `${this.cookieName()}-${token.key}`,
                        value: token.value,
                        domain: this.cookieOptions.domain,
                        maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
                        path: this.cookieOptions.path,
                        sameSite: this.cookieOptions.sameSite,
                    });
                }));
            }
            if (event === 'SIGNED_OUT') {
                setCookies(req, res, ['access-token', 'refresh-token'].map((key) => ({
                    name: `${this.cookieName()}-${key}`,
                    value: '',
                    maxAge: -1,
                })));
            }
            res.status(200).json({});
        }
        /**
         * Deletes the Auth Cookies and redirects to the
         * @param req The request object.
         * @param res The response object.
         * @param options Optionally specify a `redirectTo` URL in the options.
         */
        deleteAuthCookie(req, res, { redirectTo = '/' }) {
            setCookies(req, res, ['access-token', 'refresh-token'].map((key) => ({
                name: `${this.cookieName()}-${key}`,
                value: '',
                maxAge: -1,
            })));
            return res.redirect(307, redirectTo);
        }
        /**
         * Helper method to generate the Auth Cookie string for you in case you can't use `setAuthCookie`.
         * @param req The request object.
         * @param res The response object.
         * @returns The Cookie string that needs to be set as the value for the `Set-Cookie` header.
         */
        getAuthCookieString(req, res) {
            if (req.method !== 'POST') {
                res.setHeader('Allow', 'POST');
                res.status(405).end('Method Not Allowed');
            }
            const { event, session } = req.body;
            if (!event)
                throw new Error('Auth event missing!');
            if (event === 'SIGNED_IN') {
                if (!session)
                    throw new Error('Auth session missing!');
                return getCookieString(req, res, [
                    { key: 'access-token', value: session.access_token },
                    { key: 'refresh-token', value: session.refresh_token },
                ].map((token) => {
                    var _a;
                    return ({
                        name: `${this.cookieName()}-${token.key}`,
                        value: token.value,
                        domain: this.cookieOptions.domain,
                        maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
                        path: this.cookieOptions.path,
                        sameSite: this.cookieOptions.sameSite,
                    });
                }));
            }
            if (event === 'SIGNED_OUT') {
                return getCookieString(req, res, ['access-token', 'refresh-token'].map((key) => ({
                    name: `${this.cookieName()}-${key}`,
                    value: '',
                    maxAge: -1,
                })));
            }
            return res.getHeader('Set-Cookie');
        }
        /**
         * Generates links to be sent via email or other.
         * @param type The link type ("signup" or "magiclink" or "recovery" or "invite").
         * @param email The user's email.
         * @param password User password. For signup only.
         * @param data Optional user metadata. For signup only.
         * @param redirectTo The link type ("signup" or "magiclink" or "recovery" or "invite").
         */
        generateLink(type, email, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield post$1(this.fetch, `${this.url}/admin/generate_link`, {
                        type,
                        email,
                        password: options.password,
                        data: options.data,
                        redirect_to: options.redirectTo,
                    }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        // User Admin API
        /**
         * Creates a new user.
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         *
         * @param attributes The data you want to create the user with.
         */
        createUser(attributes) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield post$1(this.fetch, `${this.url}/admin/users`, attributes, {
                        headers: this.headers,
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
        /**
         * Get a list of users.
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         */
        listUsers() {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield get$1(this.fetch, `${this.url}/admin/users`, {
                        headers: this.headers,
                    });
                    return { data: data.users, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Get user by id.
         *
         * @param uid The user's unique identifier
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         */
        getUserById(uid) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield get$1(this.fetch, `${this.url}/admin/users/${uid}`, {
                        headers: this.headers,
                    });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Get user by reading the cookie from the request.
         * Works for Next.js & Express (requires cookie-parser middleware).
         */
        getUserByCookie(req, res) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    if (!req.cookies) {
                        throw new Error('Not able to parse cookies! When using Express make sure the cookie-parser middleware is in use!');
                    }
                    const access_token = req.cookies[`${this.cookieName()}-access-token`];
                    const refresh_token = req.cookies[`${this.cookieName()}-refresh-token`];
                    if (!access_token) {
                        throw new Error('No cookie found!');
                    }
                    const { user, error: getUserError } = yield this.getUser(access_token);
                    if (getUserError) {
                        if (!refresh_token)
                            throw new Error('No refresh_token cookie found!');
                        if (!res)
                            throw new Error('You need to pass the res object to automatically refresh the session!');
                        const { data, error } = yield this.refreshAccessToken(refresh_token);
                        if (error) {
                            throw error;
                        }
                        else if (data) {
                            setCookies(req, res, [
                                { key: 'access-token', value: data.access_token },
                                { key: 'refresh-token', value: data.refresh_token },
                            ].map((token) => {
                                var _a;
                                return ({
                                    name: `${this.cookieName()}-${token.key}`,
                                    value: token.value,
                                    domain: this.cookieOptions.domain,
                                    maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
                                    path: this.cookieOptions.path,
                                    sameSite: this.cookieOptions.sameSite,
                                });
                            }));
                            return { token: data.access_token, user: data.user, data: data.user, error: null };
                        }
                    }
                    return { token: access_token, user: user, data: user, error: null };
                }
                catch (e) {
                    return { token: null, user: null, data: null, error: e };
                }
            });
        }
        /**
         * Updates the user data.
         *
         * @param attributes The data you want to update.
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         */
        updateUserById(uid, attributes) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    this; //
                    const data = yield put$1(this.fetch, `${this.url}/admin/users/${uid}`, attributes, {
                        headers: this.headers,
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
        /**
         * Delete a user. Requires a `service_role` key.
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         *
         * @param uid The user uid you want to remove.
         */
        deleteUser(uid) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield remove$1(this.fetch, `${this.url}/admin/users/${uid}`, {}, {
                        headers: this.headers,
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
        /**
         * Gets the current user details.
         *
         * This method is called by the GoTrueClient `update` where
         * the jwt is set to this.currentSession.access_token
         * and therefore, acts like getting the currently authenticated used
         *
         * @param jwt A valid, logged-in JWT. Typically, the access_token for the currentSession
         */
        getUser(jwt) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield get$1(this.fetch, `${this.url}/user`, {
                        headers: this._createRequestHeaders(jwt),
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
        /**
         * Updates the user data.
         * @param jwt A valid, logged-in JWT.
         * @param attributes The data you want to update.
         */
        updateUser(jwt, attributes) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield put$1(this.fetch, `${this.url}/user`, attributes, {
                        headers: this._createRequestHeaders(jwt),
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
    }

    /**
     * https://mathiasbynens.be/notes/globalthis
     */
    function polyfillGlobalThis() {
        if (typeof globalThis === 'object')
            return;
        try {
            Object.defineProperty(Object.prototype, '__magic__', {
                get: function () {
                    return this;
                },
                configurable: true,
            });
            // @ts-expect-error 'Allow access to magic'
            __magic__.globalThis = __magic__;
            // @ts-expect-error 'Allow access to magic'
            delete Object.prototype.__magic__;
        }
        catch (e) {
            if (typeof self !== 'undefined') {
                // @ts-expect-error 'Allow access to globals'
                self.globalThis = self;
            }
        }
    }

    var __awaiter$7 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    polyfillGlobalThis(); // Make "globalThis" available
    const DEFAULT_OPTIONS$1 = {
        url: GOTRUE_URL,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        multiTab: true,
        headers: DEFAULT_HEADERS$3,
    };
    class GoTrueClient {
        /**
         * Create a new client for use in the browser.
         * @param options.url The URL of the GoTrue server.
         * @param options.headers Any additional headers to send to the GoTrue server.
         * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
         * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
         * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
         * @param options.localStorage Provide your own local storage implementation to use instead of the browser's local storage.
         * @param options.multiTab Set to "false" if you want to disable multi-tab/window events.
         * @param options.cookieOptions
         * @param options.fetch A custom fetch implementation.
         */
        constructor(options) {
            this.stateChangeEmitters = new Map();
            this.networkRetries = 0;
            const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS$1), options);
            this.currentUser = null;
            this.currentSession = null;
            this.autoRefreshToken = settings.autoRefreshToken;
            this.persistSession = settings.persistSession;
            this.multiTab = settings.multiTab;
            this.localStorage = settings.localStorage || globalThis.localStorage;
            this.api = new GoTrueApi({
                url: settings.url,
                headers: settings.headers,
                cookieOptions: settings.cookieOptions,
                fetch: settings.fetch,
            });
            this._recoverSession();
            this._recoverAndRefresh();
            this._listenForMultiTabEvents();
            this._handleVisibilityChange();
            if (settings.detectSessionInUrl && isBrowser() && !!getParameterByName('access_token')) {
                // Handle the OAuth redirect
                this.getSessionFromUrl({ storeSession: true }).then(({ error }) => {
                    if (error) {
                        console.error('Error getting session from URL.', error);
                    }
                });
            }
        }
        /**
         * Creates a new user.
         * @type UserCredentials
         * @param email The user's email address.
         * @param password The user's password.
         * @param phone The user's phone number.
         * @param redirectTo The redirect URL attached to the signup confirmation link. Does not redirect the user if it's a mobile signup.
         * @param data Optional user metadata.
         */
        signUp({ email, password, phone }, options = {}) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    this._removeSession();
                    const { data, error } = phone && password
                        ? yield this.api.signUpWithPhone(phone, password, {
                            data: options.data,
                            captchaToken: options.captchaToken,
                        })
                        : yield this.api.signUpWithEmail(email, password, {
                            redirectTo: options.redirectTo,
                            data: options.data,
                            captchaToken: options.captchaToken,
                        });
                    if (error) {
                        throw error;
                    }
                    if (!data) {
                        throw 'An error occurred on sign up.';
                    }
                    let session = null;
                    let user = null;
                    if (data.access_token) {
                        session = data;
                        user = session.user;
                        this._saveSession(session);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                    if (data.id) {
                        user = data;
                    }
                    return { user, session, error: null };
                }
                catch (e) {
                    return { user: null, session: null, error: e };
                }
            });
        }
        /**
         * Log in an existing user, or login via a third-party provider.
         * @type UserCredentials
         * @param email The user's email address.
         * @param phone The user's phone number.
         * @param password The user's password.
         * @param refreshToken A valid refresh token that was returned on login.
         * @param provider One of the providers supported by GoTrue.
         * @param redirectTo A URL to send the user to after they are confirmed (OAuth logins only).
         * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
         * @param scopes A space-separated list of scopes granted to the OAuth application.
         */
        signIn({ email, phone, password, refreshToken, provider, oidc }, options = {}) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    this._removeSession();
                    if (email && !password) {
                        const { error } = yield this.api.sendMagicLinkEmail(email, {
                            redirectTo: options.redirectTo,
                            shouldCreateUser: options.shouldCreateUser,
                            captchaToken: options.captchaToken,
                        });
                        return { user: null, session: null, error };
                    }
                    if (email && password) {
                        return this._handleEmailSignIn(email, password, {
                            redirectTo: options.redirectTo,
                        });
                    }
                    if (phone && !password) {
                        const { error } = yield this.api.sendMobileOTP(phone, {
                            shouldCreateUser: options.shouldCreateUser,
                            captchaToken: options.captchaToken,
                        });
                        return { user: null, session: null, error };
                    }
                    if (phone && password) {
                        return this._handlePhoneSignIn(phone, password);
                    }
                    if (refreshToken) {
                        // currentSession and currentUser will be updated to latest on _callRefreshToken using the passed refreshToken
                        const { error } = yield this._callRefreshToken(refreshToken);
                        if (error)
                            throw error;
                        return {
                            user: this.currentUser,
                            session: this.currentSession,
                            error: null,
                        };
                    }
                    if (provider) {
                        return this._handleProviderSignIn(provider, {
                            redirectTo: options.redirectTo,
                            scopes: options.scopes,
                        });
                    }
                    if (oidc) {
                        return this._handleOpenIDConnectSignIn(oidc);
                    }
                    throw new Error(`You must provide either an email, phone number, a third-party provider or OpenID Connect.`);
                }
                catch (e) {
                    return { user: null, session: null, error: e };
                }
            });
        }
        /**
         * Log in a user given a User supplied OTP received via mobile.
         * @param email The user's email address.
         * @param phone The user's phone number.
         * @param token The user's password.
         * @param type The user's verification type.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        verifyOTP(params, options = {}) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    this._removeSession();
                    const { data, error } = yield this.api.verifyOTP(params, options);
                    if (error) {
                        throw error;
                    }
                    if (!data) {
                        throw 'An error occurred on token verification.';
                    }
                    let session = null;
                    let user = null;
                    if (data.access_token) {
                        session = data;
                        user = session.user;
                        this._saveSession(session);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                    if (data.id) {
                        user = data;
                    }
                    return { user, session, error: null };
                }
                catch (e) {
                    return { user: null, session: null, error: e };
                }
            });
        }
        /**
         * Inside a browser context, `user()` will return the user data, if there is a logged in user.
         *
         * For server-side management, you can get a user through `auth.api.getUserByCookie()`
         */
        user() {
            return this.currentUser;
        }
        /**
         * Returns the session data, if there is an active session.
         */
        session() {
            return this.currentSession;
        }
        /**
         * Force refreshes the session including the user data in case it was updated in a different session.
         */
        refreshSession() {
            var _a;
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
                        throw new Error('Not logged in.');
                    // currentSession and currentUser will be updated to latest on _callRefreshToken
                    const { error } = yield this._callRefreshToken();
                    if (error)
                        throw error;
                    return { data: this.currentSession, user: this.currentUser, error: null };
                }
                catch (e) {
                    return { data: null, user: null, error: e };
                }
            });
        }
        /**
         * Updates user data, if there is a logged in user.
         */
        update(attributes) {
            var _a;
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
                        throw new Error('Not logged in.');
                    const { user, error } = yield this.api.updateUser(this.currentSession.access_token, attributes);
                    if (error)
                        throw error;
                    if (!user)
                        throw Error('Invalid user data.');
                    const session = Object.assign(Object.assign({}, this.currentSession), { user });
                    this._saveSession(session);
                    this._notifyAllSubscribers('USER_UPDATED');
                    return { data: user, user, error: null };
                }
                catch (e) {
                    return { data: null, user: null, error: e };
                }
            });
        }
        /**
         * Sets the session data from refresh_token and returns current Session and Error
         * @param refresh_token a JWT token
         */
        setSession(refresh_token) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!refresh_token) {
                        throw new Error('No current session.');
                    }
                    const { data, error } = yield this.api.refreshAccessToken(refresh_token);
                    if (error) {
                        return { session: null, error: error };
                    }
                    this._saveSession(data);
                    this._notifyAllSubscribers('SIGNED_IN');
                    return { session: data, error: null };
                }
                catch (e) {
                    return { error: e, session: null };
                }
            });
        }
        /**
         * Overrides the JWT on the current client. The JWT will then be sent in all subsequent network requests.
         * @param access_token a jwt access token
         */
        setAuth(access_token) {
            this.currentSession = Object.assign(Object.assign({}, this.currentSession), { access_token, token_type: 'bearer', user: this.user() });
            this._notifyAllSubscribers('TOKEN_REFRESHED');
            return this.currentSession;
        }
        /**
         * Gets the session data from a URL string
         * @param options.storeSession Optionally store the session in the browser
         */
        getSessionFromUrl(options) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!isBrowser())
                        throw new Error('No browser detected.');
                    const error_description = getParameterByName('error_description');
                    if (error_description)
                        throw new Error(error_description);
                    const provider_token = getParameterByName('provider_token');
                    const access_token = getParameterByName('access_token');
                    if (!access_token)
                        throw new Error('No access_token detected.');
                    const expires_in = getParameterByName('expires_in');
                    if (!expires_in)
                        throw new Error('No expires_in detected.');
                    const refresh_token = getParameterByName('refresh_token');
                    if (!refresh_token)
                        throw new Error('No refresh_token detected.');
                    const token_type = getParameterByName('token_type');
                    if (!token_type)
                        throw new Error('No token_type detected.');
                    const timeNow = Math.round(Date.now() / 1000);
                    const expires_at = timeNow + parseInt(expires_in);
                    const { user, error } = yield this.api.getUser(access_token);
                    if (error)
                        throw error;
                    const session = {
                        provider_token,
                        access_token,
                        expires_in: parseInt(expires_in),
                        expires_at,
                        refresh_token,
                        token_type,
                        user: user,
                    };
                    if (options === null || options === void 0 ? void 0 : options.storeSession) {
                        this._saveSession(session);
                        const recoveryMode = getParameterByName('type');
                        this._notifyAllSubscribers('SIGNED_IN');
                        if (recoveryMode === 'recovery') {
                            this._notifyAllSubscribers('PASSWORD_RECOVERY');
                        }
                    }
                    // Remove tokens from URL
                    window.location.hash = '';
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Inside a browser context, `signOut()` will remove the logged in user from the browser session
         * and log them out - removing all items from localstorage and then trigger a "SIGNED_OUT" event.
         *
         * For server-side management, you can disable sessions by passing a JWT through to `auth.api.signOut(JWT: string)`
         */
        signOut() {
            var _a;
            return __awaiter$7(this, void 0, void 0, function* () {
                const accessToken = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token;
                this._removeSession();
                this._notifyAllSubscribers('SIGNED_OUT');
                if (accessToken) {
                    const { error } = yield this.api.signOut(accessToken);
                    if (error)
                        return { error };
                }
                return { error: null };
            });
        }
        /**
         * Receive a notification every time an auth event happens.
         * @returns {Subscription} A subscription object which can be used to unsubscribe itself.
         */
        onAuthStateChange(callback) {
            try {
                const id = uuid();
                const subscription = {
                    id,
                    callback,
                    unsubscribe: () => {
                        this.stateChangeEmitters.delete(id);
                    },
                };
                this.stateChangeEmitters.set(id, subscription);
                return { data: subscription, error: null };
            }
            catch (e) {
                return { data: null, error: e };
            }
        }
        _handleEmailSignIn(email, password, options = {}) {
            var _a, _b;
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    const { data, error } = yield this.api.signInWithEmail(email, password, {
                        redirectTo: options.redirectTo,
                    });
                    if (error || !data)
                        return { data: null, user: null, session: null, error };
                    if (((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.confirmed_at) || ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.email_confirmed_at)) {
                        this._saveSession(data);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                    return { data, user: data.user, session: data, error: null };
                }
                catch (e) {
                    return { data: null, user: null, session: null, error: e };
                }
            });
        }
        _handlePhoneSignIn(phone, password) {
            var _a;
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    const { data, error } = yield this.api.signInWithPhone(phone, password);
                    if (error || !data)
                        return { data: null, user: null, session: null, error };
                    if ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.phone_confirmed_at) {
                        this._saveSession(data);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                    return { data, user: data.user, session: data, error: null };
                }
                catch (e) {
                    return { data: null, user: null, session: null, error: e };
                }
            });
        }
        _handleProviderSignIn(provider, options = {}) {
            const url = this.api.getUrlForProvider(provider, {
                redirectTo: options.redirectTo,
                scopes: options.scopes,
            });
            try {
                // try to open on the browser
                if (isBrowser()) {
                    window.location.href = url;
                }
                return { provider, url, data: null, session: null, user: null, error: null };
            }
            catch (e) {
                // fallback to returning the URL
                if (url)
                    return { provider, url, data: null, session: null, user: null, error: null };
                return { data: null, user: null, session: null, error: e };
            }
        }
        _handleOpenIDConnectSignIn({ id_token, nonce, client_id, issuer, provider, }) {
            return __awaiter$7(this, void 0, void 0, function* () {
                if (id_token && nonce && ((client_id && issuer) || provider)) {
                    try {
                        const { data, error } = yield this.api.signInWithOpenIDConnect({
                            id_token,
                            nonce,
                            client_id,
                            issuer,
                            provider,
                        });
                        if (error || !data)
                            return { user: null, session: null, error };
                        this._saveSession(data);
                        this._notifyAllSubscribers('SIGNED_IN');
                        return { user: data.user, session: data, error: null };
                    }
                    catch (e) {
                        return { user: null, session: null, error: e };
                    }
                }
                throw new Error(`You must provide a OpenID Connect provider with your id token and nonce.`);
            });
        }
        /**
         * Attempts to get the session from LocalStorage
         * Note: this should never be async (even for React Native), as we need it to return immediately in the constructor.
         */
        _recoverSession() {
            try {
                const data = getItemSynchronously(this.localStorage, STORAGE_KEY);
                if (!data)
                    return null;
                const { currentSession, expiresAt } = data;
                const timeNow = Math.round(Date.now() / 1000);
                if (expiresAt >= timeNow + EXPIRY_MARGIN && (currentSession === null || currentSession === void 0 ? void 0 : currentSession.user)) {
                    this._saveSession(currentSession);
                    this._notifyAllSubscribers('SIGNED_IN');
                }
            }
            catch (error) {
                console.log('error', error);
            }
        }
        /**
         * Recovers the session from LocalStorage and refreshes
         * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
         */
        _recoverAndRefresh() {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    const data = yield getItemAsync(this.localStorage, STORAGE_KEY);
                    if (!data)
                        return null;
                    const { currentSession, expiresAt } = data;
                    const timeNow = Math.round(Date.now() / 1000);
                    if (expiresAt < timeNow + EXPIRY_MARGIN) {
                        if (this.autoRefreshToken && currentSession.refresh_token) {
                            this.networkRetries++;
                            const { error } = yield this._callRefreshToken(currentSession.refresh_token);
                            if (error) {
                                console.log(error.message);
                                if (error.message === NETWORK_FAILURE.ERROR_MESSAGE &&
                                    this.networkRetries < NETWORK_FAILURE.MAX_RETRIES) {
                                    if (this.refreshTokenTimer)
                                        clearTimeout(this.refreshTokenTimer);
                                    this.refreshTokenTimer = setTimeout(() => this._recoverAndRefresh(), Math.pow(NETWORK_FAILURE.RETRY_INTERVAL, this.networkRetries) * 100 // exponential backoff
                                    );
                                    return;
                                }
                                yield this._removeSession();
                            }
                            this.networkRetries = 0;
                        }
                        else {
                            this._removeSession();
                        }
                    }
                    else if (!currentSession) {
                        console.log('Current session is missing data.');
                        this._removeSession();
                    }
                    else {
                        // should be handled on _recoverSession method already
                        // But we still need the code here to accommodate for AsyncStorage e.g. in React native
                        this._saveSession(currentSession);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                }
                catch (err) {
                    console.error(err);
                    return null;
                }
            });
        }
        _callRefreshToken(refresh_token) {
            var _a;
            if (refresh_token === void 0) { refresh_token = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.refresh_token; }
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!refresh_token) {
                        throw new Error('No current session.');
                    }
                    const { data, error } = yield this.api.refreshAccessToken(refresh_token);
                    if (error)
                        throw error;
                    if (!data)
                        throw Error('Invalid session data.');
                    this._saveSession(data);
                    this._notifyAllSubscribers('TOKEN_REFRESHED');
                    this._notifyAllSubscribers('SIGNED_IN');
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        _notifyAllSubscribers(event) {
            this.stateChangeEmitters.forEach((x) => x.callback(event, this.currentSession));
        }
        /**
         * set currentSession and currentUser
         * {"env":{"dev":true}} to _startAutoRefreshToken if possible
         */
        _saveSession(session) {
            this.currentSession = session;
            this.currentUser = session.user;
            const expiresAt = session.expires_at;
            if (expiresAt) {
                const timeNow = Math.round(Date.now() / 1000);
                const expiresIn = expiresAt - timeNow;
                const refreshDurationBeforeExpires = expiresIn > EXPIRY_MARGIN ? EXPIRY_MARGIN : 0.5;
                this._startAutoRefreshToken((expiresIn - refreshDurationBeforeExpires) * 1000);
            }
            // Do we need any extra check before persist session
            // access_token or user ?
            if (this.persistSession && session.expires_at) {
                this._persistSession(this.currentSession);
            }
        }
        _persistSession(currentSession) {
            const data = { currentSession, expiresAt: currentSession.expires_at };
            setItemAsync(this.localStorage, STORAGE_KEY, data);
        }
        _removeSession() {
            return __awaiter$7(this, void 0, void 0, function* () {
                this.currentSession = null;
                this.currentUser = null;
                if (this.refreshTokenTimer)
                    clearTimeout(this.refreshTokenTimer);
                removeItemAsync(this.localStorage, STORAGE_KEY);
            });
        }
        /**
         * Clear and re-create refresh token timer
         * @param value time intervals in milliseconds
         */
        _startAutoRefreshToken(value) {
            if (this.refreshTokenTimer)
                clearTimeout(this.refreshTokenTimer);
            if (value <= 0 || !this.autoRefreshToken)
                return;
            this.refreshTokenTimer = setTimeout(() => __awaiter$7(this, void 0, void 0, function* () {
                this.networkRetries++;
                const { error } = yield this._callRefreshToken();
                if (!error)
                    this.networkRetries = 0;
                if ((error === null || error === void 0 ? void 0 : error.message) === NETWORK_FAILURE.ERROR_MESSAGE &&
                    this.networkRetries < NETWORK_FAILURE.MAX_RETRIES)
                    this._startAutoRefreshToken(Math.pow(NETWORK_FAILURE.RETRY_INTERVAL, this.networkRetries) * 100); // exponential backoff
            }), value);
            if (typeof this.refreshTokenTimer.unref === 'function')
                this.refreshTokenTimer.unref();
        }
        /**
         * Listens for changes to LocalStorage and updates the current session.
         */
        _listenForMultiTabEvents() {
            if (!this.multiTab || !isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
                return false;
            }
            try {
                window === null || window === void 0 ? void 0 : window.addEventListener('storage', (e) => {
                    var _a;
                    if (e.key === STORAGE_KEY) {
                        const newSession = JSON.parse(String(e.newValue));
                        if ((_a = newSession === null || newSession === void 0 ? void 0 : newSession.currentSession) === null || _a === void 0 ? void 0 : _a.access_token) {
                            this._saveSession(newSession.currentSession);
                            this._notifyAllSubscribers('SIGNED_IN');
                        }
                        else {
                            this._removeSession();
                            this._notifyAllSubscribers('SIGNED_OUT');
                        }
                    }
                });
            }
            catch (error) {
                console.error('_listenForMultiTabEvents', error);
            }
        }
        _handleVisibilityChange() {
            if (!this.multiTab || !isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
                return false;
            }
            try {
                window === null || window === void 0 ? void 0 : window.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') {
                        this._recoverAndRefresh();
                    }
                });
            }
            catch (error) {
                console.error('_handleVisibilityChange', error);
            }
        }
    }

    class SupabaseAuthClient extends GoTrueClient {
        constructor(options) {
            super(options);
        }
    }

    var __awaiter$6 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class PostgrestBuilder {
        constructor(builder) {
            Object.assign(this, builder);
            let _fetch;
            if (builder.fetch) {
                _fetch = builder.fetch;
            }
            else if (typeof fetch === 'undefined') {
                _fetch = crossFetch;
            }
            else {
                _fetch = fetch;
            }
            this.fetch = (...args) => _fetch(...args);
            this.shouldThrowOnError = builder.shouldThrowOnError || false;
        }
        /**
         * If there's an error with the query, throwOnError will reject the promise by
         * throwing the error instead of returning it as part of a successful response.
         *
         * {@link https://github.com/supabase/supabase-js/issues/92}
         */
        throwOnError(throwOnError) {
            if (throwOnError === null || throwOnError === undefined) {
                throwOnError = true;
            }
            this.shouldThrowOnError = throwOnError;
            return this;
        }
        then(onfulfilled, onrejected) {
            // https://postgrest.org/en/stable/api.html#switching-schemas
            if (typeof this.schema === 'undefined') ;
            else if (['GET', 'HEAD'].includes(this.method)) {
                this.headers['Accept-Profile'] = this.schema;
            }
            else {
                this.headers['Content-Profile'] = this.schema;
            }
            if (this.method !== 'GET' && this.method !== 'HEAD') {
                this.headers['Content-Type'] = 'application/json';
            }
            let res = this.fetch(this.url.toString(), {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(this.body),
                signal: this.signal,
            }).then((res) => __awaiter$6(this, void 0, void 0, function* () {
                var _a, _b, _c;
                let error = null;
                let data = null;
                let count = null;
                if (res.ok) {
                    const isReturnMinimal = (_a = this.headers['Prefer']) === null || _a === void 0 ? void 0 : _a.split(',').includes('return=minimal');
                    if (this.method !== 'HEAD' && !isReturnMinimal) {
                        const text = yield res.text();
                        if (!text) ;
                        else if (this.headers['Accept'] === 'text/csv') {
                            data = text;
                        }
                        else {
                            data = JSON.parse(text);
                        }
                    }
                    const countHeader = (_b = this.headers['Prefer']) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
                    const contentRange = (_c = res.headers.get('content-range')) === null || _c === void 0 ? void 0 : _c.split('/');
                    if (countHeader && contentRange && contentRange.length > 1) {
                        count = parseInt(contentRange[1]);
                    }
                }
                else {
                    const body = yield res.text();
                    try {
                        error = JSON.parse(body);
                    }
                    catch (_d) {
                        error = {
                            message: body,
                        };
                    }
                    if (error && this.shouldThrowOnError) {
                        throw error;
                    }
                }
                const postgrestResponse = {
                    error,
                    data,
                    count,
                    status: res.status,
                    statusText: res.statusText,
                    body: data,
                };
                return postgrestResponse;
            }));
            if (!this.shouldThrowOnError) {
                res = res.catch((fetchError) => ({
                    error: {
                        message: `FetchError: ${fetchError.message}`,
                        details: '',
                        hint: '',
                        code: fetchError.code || '',
                    },
                    data: null,
                    body: null,
                    count: null,
                    status: 400,
                    statusText: 'Bad Request',
                }));
            }
            return res.then(onfulfilled, onrejected);
        }
    }

    /**
     * Post-filters (transforms)
     */
    class PostgrestTransformBuilder extends PostgrestBuilder {
        /**
         * Performs vertical filtering with SELECT.
         *
         * @param columns  The columns to retrieve, separated by commas.
         */
        select(columns = '*') {
            // Remove whitespaces except when quoted
            let quoted = false;
            const cleanedColumns = columns
                .split('')
                .map((c) => {
                if (/\s/.test(c) && !quoted) {
                    return '';
                }
                if (c === '"') {
                    quoted = !quoted;
                }
                return c;
            })
                .join('');
            this.url.searchParams.set('select', cleanedColumns);
            return this;
        }
        /**
         * Orders the result with the specified `column`.
         *
         * @param column  The column to order on.
         * @param ascending  If `true`, the result will be in ascending order.
         * @param nullsFirst  If `true`, `null`s appear first.
         * @param foreignTable  The foreign table to use (if `column` is a foreign column).
         */
        order(column, { ascending = true, nullsFirst = false, foreignTable, } = {}) {
            const key = typeof foreignTable === 'undefined' ? 'order' : `${foreignTable}.order`;
            const existingOrder = this.url.searchParams.get(key);
            this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}.${nullsFirst ? 'nullsfirst' : 'nullslast'}`);
            return this;
        }
        /**
         * Limits the result with the specified `count`.
         *
         * @param count  The maximum no. of rows to limit to.
         * @param foreignTable  The foreign table to use (for foreign columns).
         */
        limit(count, { foreignTable } = {}) {
            const key = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`;
            this.url.searchParams.set(key, `${count}`);
            return this;
        }
        /**
         * Limits the result to rows within the specified range, inclusive.
         *
         * @param from  The starting index from which to limit the result, inclusive.
         * @param to  The last index to which to limit the result, inclusive.
         * @param foreignTable  The foreign table to use (for foreign columns).
         */
        range(from, to, { foreignTable } = {}) {
            const keyOffset = typeof foreignTable === 'undefined' ? 'offset' : `${foreignTable}.offset`;
            const keyLimit = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`;
            this.url.searchParams.set(keyOffset, `${from}`);
            // Range is inclusive, so add 1
            this.url.searchParams.set(keyLimit, `${to - from + 1}`);
            return this;
        }
        /**
         * Sets the AbortSignal for the fetch request.
         */
        abortSignal(signal) {
            this.signal = signal;
            return this;
        }
        /**
         * Retrieves only one row from the result. Result must be one row (e.g. using
         * `limit`), otherwise this will result in an error.
         */
        single() {
            this.headers['Accept'] = 'application/vnd.pgrst.object+json';
            return this;
        }
        /**
         * Retrieves at most one row from the result. Result must be at most one row
         * (e.g. using `eq` on a UNIQUE column), otherwise this will result in an
         * error.
         */
        maybeSingle() {
            this.headers['Accept'] = 'application/vnd.pgrst.object+json';
            const _this = new PostgrestTransformBuilder(this);
            _this.then = ((onfulfilled, onrejected) => this.then((res) => {
                var _a, _b;
                if ((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.details) === null || _b === void 0 ? void 0 : _b.includes('Results contain 0 rows')) {
                    return onfulfilled({
                        error: null,
                        data: null,
                        count: res.count,
                        status: 200,
                        statusText: 'OK',
                        body: null,
                    });
                }
                return onfulfilled(res);
            }, onrejected));
            return _this;
        }
        /**
         * Set the response type to CSV.
         */
        csv() {
            this.headers['Accept'] = 'text/csv';
            return this;
        }
    }

    class PostgrestFilterBuilder extends PostgrestTransformBuilder {
        constructor() {
            super(...arguments);
            /** @deprecated Use `contains()` instead. */
            this.cs = this.contains;
            /** @deprecated Use `containedBy()` instead. */
            this.cd = this.containedBy;
            /** @deprecated Use `rangeLt()` instead. */
            this.sl = this.rangeLt;
            /** @deprecated Use `rangeGt()` instead. */
            this.sr = this.rangeGt;
            /** @deprecated Use `rangeGte()` instead. */
            this.nxl = this.rangeGte;
            /** @deprecated Use `rangeLte()` instead. */
            this.nxr = this.rangeLte;
            /** @deprecated Use `rangeAdjacent()` instead. */
            this.adj = this.rangeAdjacent;
            /** @deprecated Use `overlaps()` instead. */
            this.ov = this.overlaps;
        }
        /**
         * Finds all rows which doesn't satisfy the filter.
         *
         * @param column  The column to filter on.
         * @param operator  The operator to filter with.
         * @param value  The value to filter with.
         */
        not(column, operator, value) {
            this.url.searchParams.append(`${column}`, `not.${operator}.${value}`);
            return this;
        }
        /**
         * Finds all rows satisfying at least one of the filters.
         *
         * @param filters  The filters to use, separated by commas.
         * @param foreignTable  The foreign table to use (if `column` is a foreign column).
         */
        or(filters, { foreignTable } = {}) {
            const key = typeof foreignTable === 'undefined' ? 'or' : `${foreignTable}.or`;
            this.url.searchParams.append(key, `(${filters})`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` exactly matches the
         * specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        eq(column, value) {
            this.url.searchParams.append(`${column}`, `eq.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` doesn't match the
         * specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        neq(column, value) {
            this.url.searchParams.append(`${column}`, `neq.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is greater than the
         * specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        gt(column, value) {
            this.url.searchParams.append(`${column}`, `gt.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is greater than or
         * equal to the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        gte(column, value) {
            this.url.searchParams.append(`${column}`, `gte.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is less than the
         * specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        lt(column, value) {
            this.url.searchParams.append(`${column}`, `lt.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is less than or equal
         * to the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        lte(column, value) {
            this.url.searchParams.append(`${column}`, `lte.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value in the stated `column` matches the supplied
         * `pattern` (case sensitive).
         *
         * @param column  The column to filter on.
         * @param pattern  The pattern to filter with.
         */
        like(column, pattern) {
            this.url.searchParams.append(`${column}`, `like.${pattern}`);
            return this;
        }
        /**
         * Finds all rows whose value in the stated `column` matches the supplied
         * `pattern` (case insensitive).
         *
         * @param column  The column to filter on.
         * @param pattern  The pattern to filter with.
         */
        ilike(column, pattern) {
            this.url.searchParams.append(`${column}`, `ilike.${pattern}`);
            return this;
        }
        /**
         * A check for exact equality (null, true, false), finds all rows whose
         * value on the stated `column` exactly match the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        is(column, value) {
            this.url.searchParams.append(`${column}`, `is.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is found on the
         * specified `values`.
         *
         * @param column  The column to filter on.
         * @param values  The values to filter with.
         */
        in(column, values) {
            const cleanedValues = values
                .map((s) => {
                // handle postgrest reserved characters
                // https://postgrest.org/en/v7.0.0/api.html#reserved-characters
                if (typeof s === 'string' && new RegExp('[,()]').test(s))
                    return `"${s}"`;
                else
                    return `${s}`;
            })
                .join(',');
            this.url.searchParams.append(`${column}`, `in.(${cleanedValues})`);
            return this;
        }
        /**
         * Finds all rows whose json, array, or range value on the stated `column`
         * contains the values specified in `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        contains(column, value) {
            if (typeof value === 'string') {
                // range types can be inclusive '[', ']' or exclusive '(', ')' so just
                // keep it simple and accept a string
                this.url.searchParams.append(`${column}`, `cs.${value}`);
            }
            else if (Array.isArray(value)) {
                // array
                this.url.searchParams.append(`${column}`, `cs.{${value.join(',')}}`);
            }
            else {
                // json
                this.url.searchParams.append(`${column}`, `cs.${JSON.stringify(value)}`);
            }
            return this;
        }
        /**
         * Finds all rows whose json, array, or range value on the stated `column` is
         * contained by the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        containedBy(column, value) {
            if (typeof value === 'string') {
                // range
                this.url.searchParams.append(`${column}`, `cd.${value}`);
            }
            else if (Array.isArray(value)) {
                // array
                this.url.searchParams.append(`${column}`, `cd.{${value.join(',')}}`);
            }
            else {
                // json
                this.url.searchParams.append(`${column}`, `cd.${JSON.stringify(value)}`);
            }
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` is strictly to the
         * left of the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeLt(column, range) {
            this.url.searchParams.append(`${column}`, `sl.${range}`);
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` is strictly to
         * the right of the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeGt(column, range) {
            this.url.searchParams.append(`${column}`, `sr.${range}`);
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` does not extend
         * to the left of the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeGte(column, range) {
            this.url.searchParams.append(`${column}`, `nxl.${range}`);
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` does not extend
         * to the right of the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeLte(column, range) {
            this.url.searchParams.append(`${column}`, `nxr.${range}`);
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` is adjacent to
         * the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeAdjacent(column, range) {
            this.url.searchParams.append(`${column}`, `adj.${range}`);
            return this;
        }
        /**
         * Finds all rows whose array or range value on the stated `column` overlaps
         * (has a value in common) with the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        overlaps(column, value) {
            if (typeof value === 'string') {
                // range
                this.url.searchParams.append(`${column}`, `ov.${value}`);
            }
            else {
                // array
                this.url.searchParams.append(`${column}`, `ov.{${value.join(',')}}`);
            }
            return this;
        }
        /**
         * Finds all rows whose text or tsvector value on the stated `column` matches
         * the tsquery in `query`.
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         * @param type  The type of tsquery conversion to use on `query`.
         */
        textSearch(column, query, { config, type = null, } = {}) {
            let typePart = '';
            if (type === 'plain') {
                typePart = 'pl';
            }
            else if (type === 'phrase') {
                typePart = 'ph';
            }
            else if (type === 'websearch') {
                typePart = 'w';
            }
            const configPart = config === undefined ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `${typePart}fts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose tsvector value on the stated `column` matches
         * to_tsquery(`query`).
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         *
         * @deprecated Use `textSearch()` instead.
         */
        fts(column, query, { config } = {}) {
            const configPart = typeof config === 'undefined' ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `fts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose tsvector value on the stated `column` matches
         * plainto_tsquery(`query`).
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         *
         * @deprecated Use `textSearch()` with `type: 'plain'` instead.
         */
        plfts(column, query, { config } = {}) {
            const configPart = typeof config === 'undefined' ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `plfts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose tsvector value on the stated `column` matches
         * phraseto_tsquery(`query`).
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         *
         * @deprecated Use `textSearch()` with `type: 'phrase'` instead.
         */
        phfts(column, query, { config } = {}) {
            const configPart = typeof config === 'undefined' ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `phfts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose tsvector value on the stated `column` matches
         * websearch_to_tsquery(`query`).
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         *
         * @deprecated Use `textSearch()` with `type: 'websearch'` instead.
         */
        wfts(column, query, { config } = {}) {
            const configPart = typeof config === 'undefined' ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `wfts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose `column` satisfies the filter.
         *
         * @param column  The column to filter on.
         * @param operator  The operator to filter with.
         * @param value  The value to filter with.
         */
        filter(column, operator, value) {
            this.url.searchParams.append(`${column}`, `${operator}.${value}`);
            return this;
        }
        /**
         * Finds all rows whose columns match the specified `query` object.
         *
         * @param query  The object to filter with, with column names as keys mapped
         *               to their filter values.
         */
        match(query) {
            Object.keys(query).forEach((key) => {
                this.url.searchParams.append(`${key}`, `eq.${query[key]}`);
            });
            return this;
        }
    }

    class PostgrestQueryBuilder extends PostgrestBuilder {
        constructor(url, { headers = {}, schema, fetch, shouldThrowOnError, } = {}) {
            super({ fetch, shouldThrowOnError });
            this.url = new URL(url);
            this.headers = Object.assign({}, headers);
            this.schema = schema;
        }
        /**
         * Performs vertical filtering with SELECT.
         *
         * @param columns  The columns to retrieve, separated by commas.
         * @param head  When set to true, select will void data.
         * @param count  Count algorithm to use to count rows in a table.
         */
        select(columns = '*', { head = false, count = null, } = {}) {
            this.method = 'GET';
            // Remove whitespaces except when quoted
            let quoted = false;
            const cleanedColumns = columns
                .split('')
                .map((c) => {
                if (/\s/.test(c) && !quoted) {
                    return '';
                }
                if (c === '"') {
                    quoted = !quoted;
                }
                return c;
            })
                .join('');
            this.url.searchParams.set('select', cleanedColumns);
            if (count) {
                this.headers['Prefer'] = `count=${count}`;
            }
            if (head) {
                this.method = 'HEAD';
            }
            return new PostgrestFilterBuilder(this);
        }
        insert(values, { upsert = false, onConflict, returning = 'representation', count = null, } = {}) {
            this.method = 'POST';
            const prefersHeaders = [`return=${returning}`];
            if (upsert)
                prefersHeaders.push('resolution=merge-duplicates');
            if (upsert && onConflict !== undefined)
                this.url.searchParams.set('on_conflict', onConflict);
            this.body = values;
            if (count) {
                prefersHeaders.push(`count=${count}`);
            }
            if (this.headers['Prefer']) {
                prefersHeaders.unshift(this.headers['Prefer']);
            }
            this.headers['Prefer'] = prefersHeaders.join(',');
            if (Array.isArray(values)) {
                const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
                if (columns.length > 0) {
                    const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
                    this.url.searchParams.set('columns', uniqueColumns.join(','));
                }
            }
            return new PostgrestFilterBuilder(this);
        }
        /**
         * Performs an UPSERT into the table.
         *
         * @param values  The values to insert.
         * @param onConflict  By specifying the `on_conflict` query parameter, you can make UPSERT work on a column(s) that has a UNIQUE constraint.
         * @param returning  By default the new record is returned. Set this to 'minimal' if you don't need this value.
         * @param count  Count algorithm to use to count rows in a table.
         * @param ignoreDuplicates  Specifies if duplicate rows should be ignored and not inserted.
         */
        upsert(values, { onConflict, returning = 'representation', count = null, ignoreDuplicates = false, } = {}) {
            this.method = 'POST';
            const prefersHeaders = [
                `resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`,
                `return=${returning}`,
            ];
            if (onConflict !== undefined)
                this.url.searchParams.set('on_conflict', onConflict);
            this.body = values;
            if (count) {
                prefersHeaders.push(`count=${count}`);
            }
            if (this.headers['Prefer']) {
                prefersHeaders.unshift(this.headers['Prefer']);
            }
            this.headers['Prefer'] = prefersHeaders.join(',');
            return new PostgrestFilterBuilder(this);
        }
        /**
         * Performs an UPDATE on the table.
         *
         * @param values  The values to update.
         * @param returning  By default the updated record is returned. Set this to 'minimal' if you don't need this value.
         * @param count  Count algorithm to use to count rows in a table.
         */
        update(values, { returning = 'representation', count = null, } = {}) {
            this.method = 'PATCH';
            const prefersHeaders = [`return=${returning}`];
            this.body = values;
            if (count) {
                prefersHeaders.push(`count=${count}`);
            }
            if (this.headers['Prefer']) {
                prefersHeaders.unshift(this.headers['Prefer']);
            }
            this.headers['Prefer'] = prefersHeaders.join(',');
            return new PostgrestFilterBuilder(this);
        }
        /**
         * Performs a DELETE on the table.
         *
         * @param returning  If `true`, return the deleted row(s) in the response.
         * @param count  Count algorithm to use to count rows in a table.
         */
        delete({ returning = 'representation', count = null, } = {}) {
            this.method = 'DELETE';
            const prefersHeaders = [`return=${returning}`];
            if (count) {
                prefersHeaders.push(`count=${count}`);
            }
            if (this.headers['Prefer']) {
                prefersHeaders.unshift(this.headers['Prefer']);
            }
            this.headers['Prefer'] = prefersHeaders.join(',');
            return new PostgrestFilterBuilder(this);
        }
    }

    class PostgrestRpcBuilder extends PostgrestBuilder {
        constructor(url, { headers = {}, schema, fetch, shouldThrowOnError, } = {}) {
            super({ fetch, shouldThrowOnError });
            this.url = new URL(url);
            this.headers = Object.assign({}, headers);
            this.schema = schema;
        }
        /**
         * Perform a function call.
         */
        rpc(params, { head = false, count = null, } = {}) {
            if (head) {
                this.method = 'HEAD';
                if (params) {
                    Object.entries(params).forEach(([name, value]) => {
                        this.url.searchParams.append(name, value);
                    });
                }
            }
            else {
                this.method = 'POST';
                this.body = params;
            }
            if (count) {
                if (this.headers['Prefer'] !== undefined)
                    this.headers['Prefer'] += `,count=${count}`;
                else
                    this.headers['Prefer'] = `count=${count}`;
            }
            return new PostgrestFilterBuilder(this);
        }
    }

    // generated by genversion
    const version$4 = '0.37.2';

    const DEFAULT_HEADERS$2 = { 'X-Client-Info': `postgrest-js/${version$4}` };

    class PostgrestClient {
        /**
         * Creates a PostgREST client.
         *
         * @param url  URL of the PostgREST endpoint.
         * @param headers  Custom headers.
         * @param schema  Postgres schema to switch to.
         */
        constructor(url, { headers = {}, schema, fetch, throwOnError, } = {}) {
            this.url = url;
            this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$2), headers);
            this.schema = schema;
            this.fetch = fetch;
            this.shouldThrowOnError = throwOnError;
        }
        /**
         * Authenticates the request with JWT.
         *
         * @param token  The JWT token to use.
         */
        auth(token) {
            this.headers['Authorization'] = `Bearer ${token}`;
            return this;
        }
        /**
         * Perform a table operation.
         *
         * @param table  The table name to operate on.
         */
        from(table) {
            const url = `${this.url}/${table}`;
            return new PostgrestQueryBuilder(url, {
                headers: this.headers,
                schema: this.schema,
                fetch: this.fetch,
                shouldThrowOnError: this.shouldThrowOnError,
            });
        }
        /**
         * Perform a function call.
         *
         * @param fn  The function name to call.
         * @param params  The parameters to pass to the function call.
         * @param head  When set to true, no data will be returned.
         * @param count  Count algorithm to use to count rows in a table.
         */
        rpc(fn, params, { head = false, count = null, } = {}) {
            const url = `${this.url}/rpc/${fn}`;
            return new PostgrestRpcBuilder(url, {
                headers: this.headers,
                schema: this.schema,
                fetch: this.fetch,
                shouldThrowOnError: this.shouldThrowOnError,
            }).rpc(params, { head, count });
        }
    }

    /**
     * Helpers to convert the change Payload into native JS types.
     */
    // Adapted from epgsql (src/epgsql_binary.erl), this module licensed under
    // 3-clause BSD found here: https://raw.githubusercontent.com/epgsql/epgsql/devel/LICENSE
    var PostgresTypes;
    (function (PostgresTypes) {
        PostgresTypes["abstime"] = "abstime";
        PostgresTypes["bool"] = "bool";
        PostgresTypes["date"] = "date";
        PostgresTypes["daterange"] = "daterange";
        PostgresTypes["float4"] = "float4";
        PostgresTypes["float8"] = "float8";
        PostgresTypes["int2"] = "int2";
        PostgresTypes["int4"] = "int4";
        PostgresTypes["int4range"] = "int4range";
        PostgresTypes["int8"] = "int8";
        PostgresTypes["int8range"] = "int8range";
        PostgresTypes["json"] = "json";
        PostgresTypes["jsonb"] = "jsonb";
        PostgresTypes["money"] = "money";
        PostgresTypes["numeric"] = "numeric";
        PostgresTypes["oid"] = "oid";
        PostgresTypes["reltime"] = "reltime";
        PostgresTypes["text"] = "text";
        PostgresTypes["time"] = "time";
        PostgresTypes["timestamp"] = "timestamp";
        PostgresTypes["timestamptz"] = "timestamptz";
        PostgresTypes["timetz"] = "timetz";
        PostgresTypes["tsrange"] = "tsrange";
        PostgresTypes["tstzrange"] = "tstzrange";
    })(PostgresTypes || (PostgresTypes = {}));
    /**
     * Takes an array of columns and an object of string values then converts each string value
     * to its mapped type.
     *
     * @param {{name: String, type: String}[]} columns
     * @param {Object} record
     * @param {Object} options The map of various options that can be applied to the mapper
     * @param {Array} options.skipTypes The array of types that should not be converted
     *
     * @example convertChangeData([{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age:'33'}, {})
     * //=>{ first_name: 'Paul', age: 33 }
     */
    const convertChangeData = (columns, record, options = {}) => {
        var _a;
        const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
        return Object.keys(record).reduce((acc, rec_key) => {
            acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
            return acc;
        }, {});
    };
    /**
     * Converts the value of an individual column.
     *
     * @param {String} columnName The column that you want to convert
     * @param {{name: String, type: String}[]} columns All of the columns
     * @param {Object} record The map of string values
     * @param {Array} skipTypes An array of types that should not be converted
     * @return {object} Useless information
     *
     * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, [])
     * //=> 33
     * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, ['int4'])
     * //=> "33"
     */
    const convertColumn = (columnName, columns, record, skipTypes) => {
        const column = columns.find((x) => x.name === columnName);
        const colType = column === null || column === void 0 ? void 0 : column.type;
        const value = record[columnName];
        if (colType && !skipTypes.includes(colType)) {
            return convertCell(colType, value);
        }
        return noop$1(value);
    };
    /**
     * If the value of the cell is `null`, returns null.
     * Otherwise converts the string value to the correct type.
     * @param {String} type A postgres column type
     * @param {String} stringValue The cell value
     *
     * @example convertCell('bool', 't')
     * //=> true
     * @example convertCell('int8', '10')
     * //=> 10
     * @example convertCell('_int4', '{1,2,3,4}')
     * //=> [1,2,3,4]
     */
    const convertCell = (type, value) => {
        // if data type is an array
        if (type.charAt(0) === '_') {
            const dataType = type.slice(1, type.length);
            return toArray(value, dataType);
        }
        // If not null, convert to correct type.
        switch (type) {
            case PostgresTypes.bool:
                return toBoolean(value);
            case PostgresTypes.float4:
            case PostgresTypes.float8:
            case PostgresTypes.int2:
            case PostgresTypes.int4:
            case PostgresTypes.int8:
            case PostgresTypes.numeric:
            case PostgresTypes.oid:
                return toNumber(value);
            case PostgresTypes.json:
            case PostgresTypes.jsonb:
                return toJson(value);
            case PostgresTypes.timestamp:
                return toTimestampString(value); // Format to be consistent with PostgREST
            case PostgresTypes.abstime: // To allow users to cast it based on Timezone
            case PostgresTypes.date: // To allow users to cast it based on Timezone
            case PostgresTypes.daterange:
            case PostgresTypes.int4range:
            case PostgresTypes.int8range:
            case PostgresTypes.money:
            case PostgresTypes.reltime: // To allow users to cast it based on Timezone
            case PostgresTypes.text:
            case PostgresTypes.time: // To allow users to cast it based on Timezone
            case PostgresTypes.timestamptz: // To allow users to cast it based on Timezone
            case PostgresTypes.timetz: // To allow users to cast it based on Timezone
            case PostgresTypes.tsrange:
            case PostgresTypes.tstzrange:
                return noop$1(value);
            default:
                // Return the value for remaining types
                return noop$1(value);
        }
    };
    const noop$1 = (value) => {
        return value;
    };
    const toBoolean = (value) => {
        switch (value) {
            case 't':
                return true;
            case 'f':
                return false;
            default:
                return value;
        }
    };
    const toNumber = (value) => {
        if (typeof value === 'string') {
            const parsedValue = parseFloat(value);
            if (!Number.isNaN(parsedValue)) {
                return parsedValue;
            }
        }
        return value;
    };
    const toJson = (value) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch (error) {
                console.log(`JSON parse error: ${error}`);
                return value;
            }
        }
        return value;
    };
    /**
     * Converts a Postgres Array into a native JS array
     *
     * @example toArray('{}', 'int4')
     * //=> []
     * @example toArray('{"[2021-01-01,2021-12-31)","(2021-01-01,2021-12-32]"}', 'daterange')
     * //=> ['[2021-01-01,2021-12-31)', '(2021-01-01,2021-12-32]']
     * @example toArray([1,2,3,4], 'int4')
     * //=> [1,2,3,4]
     */
    const toArray = (value, type) => {
        if (typeof value !== 'string') {
            return value;
        }
        const lastIdx = value.length - 1;
        const closeBrace = value[lastIdx];
        const openBrace = value[0];
        // Confirm value is a Postgres array by checking curly brackets
        if (openBrace === '{' && closeBrace === '}') {
            let arr;
            const valTrim = value.slice(1, lastIdx);
            // TODO: find a better solution to separate Postgres array data
            try {
                arr = JSON.parse('[' + valTrim + ']');
            }
            catch (_) {
                // WARNING: splitting on comma does not cover all edge cases
                arr = valTrim ? valTrim.split(',') : [];
            }
            return arr.map((val) => convertCell(type, val));
        }
        return value;
    };
    /**
     * Fixes timestamp to be ISO-8601. Swaps the space between the date and time for a 'T'
     * See https://github.com/supabase/supabase/issues/18
     *
     * @example toTimestampString('2019-09-10 00:00:00')
     * //=> '2019-09-10T00:00:00'
     */
    const toTimestampString = (value) => {
        if (typeof value === 'string') {
            return value.replace(' ', 'T');
        }
        return value;
    };

    var naiveFallback = function () {
    	if (typeof self === "object" && self) return self;
    	if (typeof window === "object" && window) return window;
    	throw new Error("Unable to resolve global `this`");
    };

    var global$1 = (function () {
    	if (this) return this;

    	// Unexpected strict mode (may happen if e.g. bundled into ESM module)

    	// Fallback to standard globalThis if available
    	if (typeof globalThis === "object" && globalThis) return globalThis;

    	// Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
    	// In all ES5+ engines global object inherits from Object.prototype
    	// (if you approached one that doesn't please report)
    	try {
    		Object.defineProperty(Object.prototype, "__global__", {
    			get: function () { return this; },
    			configurable: true
    		});
    	} catch (error) {
    		// Unfortunate case of updates to Object.prototype being restricted
    		// via preventExtensions, seal or freeze
    		return naiveFallback();
    	}
    	try {
    		// Safari case (window.__global__ works, but __global__ does not)
    		if (!__global__) return naiveFallback();
    		return __global__;
    	} finally {
    		delete Object.prototype.__global__;
    	}
    })();

    var _args = [
    	[
    		"websocket@1.0.34",
    		"C:\\Users\\rj\\Documents\\GitHub\\gram-jam"
    	]
    ];
    var _from = "websocket@1.0.34";
    var _id = "websocket@1.0.34";
    var _inBundle = false;
    var _integrity = "sha512-PRDso2sGwF6kM75QykIesBijKSVceR6jL2G8NGYyq2XrItNC2P5/qL5XeR056GhA+Ly7JMFvJb9I312mJfmqnQ==";
    var _location = "/websocket";
    var _phantomChildren = {
    };
    var _requested = {
    	type: "version",
    	registry: true,
    	raw: "websocket@1.0.34",
    	name: "websocket",
    	escapedName: "websocket",
    	rawSpec: "1.0.34",
    	saveSpec: null,
    	fetchSpec: "1.0.34"
    };
    var _requiredBy = [
    	"/@supabase/realtime-js"
    ];
    var _resolved = "https://registry.npmjs.org/websocket/-/websocket-1.0.34.tgz";
    var _spec = "1.0.34";
    var _where = "C:\\Users\\rj\\Documents\\GitHub\\gram-jam";
    var author = {
    	name: "Brian McKelvey",
    	email: "theturtle32@gmail.com",
    	url: "https://github.com/theturtle32"
    };
    var browser$1 = "lib/browser.js";
    var bugs = {
    	url: "https://github.com/theturtle32/WebSocket-Node/issues"
    };
    var config = {
    	verbose: false
    };
    var contributors = [
    	{
    		name: "Iñaki Baz Castillo",
    		email: "ibc@aliax.net",
    		url: "http://dev.sipdoc.net"
    	}
    ];
    var dependencies = {
    	bufferutil: "^4.0.1",
    	debug: "^2.2.0",
    	"es5-ext": "^0.10.50",
    	"typedarray-to-buffer": "^3.1.5",
    	"utf-8-validate": "^5.0.2",
    	yaeti: "^0.0.6"
    };
    var description = "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.";
    var devDependencies = {
    	"buffer-equal": "^1.0.0",
    	gulp: "^4.0.2",
    	"gulp-jshint": "^2.0.4",
    	jshint: "^2.0.0",
    	"jshint-stylish": "^2.2.1",
    	tape: "^4.9.1"
    };
    var directories = {
    	lib: "./lib"
    };
    var engines = {
    	node: ">=4.0.0"
    };
    var homepage = "https://github.com/theturtle32/WebSocket-Node";
    var keywords = [
    	"websocket",
    	"websockets",
    	"socket",
    	"networking",
    	"comet",
    	"push",
    	"RFC-6455",
    	"realtime",
    	"server",
    	"client"
    ];
    var license = "Apache-2.0";
    var main = "index";
    var name = "websocket";
    var repository = {
    	type: "git",
    	url: "git+https://github.com/theturtle32/WebSocket-Node.git"
    };
    var scripts = {
    	gulp: "gulp",
    	test: "tape test/unit/*.js"
    };
    var version$3 = "1.0.34";
    var require$$0 = {
    	_args: _args,
    	_from: _from,
    	_id: _id,
    	_inBundle: _inBundle,
    	_integrity: _integrity,
    	_location: _location,
    	_phantomChildren: _phantomChildren,
    	_requested: _requested,
    	_requiredBy: _requiredBy,
    	_resolved: _resolved,
    	_spec: _spec,
    	_where: _where,
    	author: author,
    	browser: browser$1,
    	bugs: bugs,
    	config: config,
    	contributors: contributors,
    	dependencies: dependencies,
    	description: description,
    	devDependencies: devDependencies,
    	directories: directories,
    	engines: engines,
    	homepage: homepage,
    	keywords: keywords,
    	license: license,
    	main: main,
    	name: name,
    	repository: repository,
    	scripts: scripts,
    	version: version$3
    };

    var version$2 = require$$0.version;

    var _globalThis;
    if (typeof globalThis === 'object') {
    	_globalThis = globalThis;
    } else {
    	try {
    		_globalThis = global$1;
    	} catch (error) {
    	} finally {
    		if (!_globalThis && typeof window !== 'undefined') { _globalThis = window; }
    		if (!_globalThis) { throw new Error('Could not determine global this'); }
    	}
    }

    var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;



    /**
     * Expose a W3C WebSocket class with just one or two arguments.
     */
    function W3CWebSocket(uri, protocols) {
    	var native_instance;

    	if (protocols) {
    		native_instance = new NativeWebSocket(uri, protocols);
    	}
    	else {
    		native_instance = new NativeWebSocket(uri);
    	}

    	/**
    	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
    	 * class). Since it is an Object it will be returned as it is when creating an
    	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
    	 *
    	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
    	 */
    	return native_instance;
    }
    if (NativeWebSocket) {
    	['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function(prop) {
    		Object.defineProperty(W3CWebSocket, prop, {
    			get: function() { return NativeWebSocket[prop]; }
    		});
    	});
    }

    /**
     * Module exports.
     */
    var browser = {
        'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
        'version'      : version$2
    };

    const version$1 = '1.7.2';

    const DEFAULT_HEADERS$1 = { 'X-Client-Info': `realtime-js/${version$1}` };
    const VSN = '1.0.0';
    const DEFAULT_TIMEOUT = 10000;
    const WS_CLOSE_NORMAL = 1000;
    var SOCKET_STATES;
    (function (SOCKET_STATES) {
        SOCKET_STATES[SOCKET_STATES["connecting"] = 0] = "connecting";
        SOCKET_STATES[SOCKET_STATES["open"] = 1] = "open";
        SOCKET_STATES[SOCKET_STATES["closing"] = 2] = "closing";
        SOCKET_STATES[SOCKET_STATES["closed"] = 3] = "closed";
    })(SOCKET_STATES || (SOCKET_STATES = {}));
    var CHANNEL_STATES;
    (function (CHANNEL_STATES) {
        CHANNEL_STATES["closed"] = "closed";
        CHANNEL_STATES["errored"] = "errored";
        CHANNEL_STATES["joined"] = "joined";
        CHANNEL_STATES["joining"] = "joining";
        CHANNEL_STATES["leaving"] = "leaving";
    })(CHANNEL_STATES || (CHANNEL_STATES = {}));
    var CHANNEL_EVENTS;
    (function (CHANNEL_EVENTS) {
        CHANNEL_EVENTS["close"] = "phx_close";
        CHANNEL_EVENTS["error"] = "phx_error";
        CHANNEL_EVENTS["join"] = "phx_join";
        CHANNEL_EVENTS["reply"] = "phx_reply";
        CHANNEL_EVENTS["leave"] = "phx_leave";
        CHANNEL_EVENTS["access_token"] = "access_token";
    })(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
    var TRANSPORTS;
    (function (TRANSPORTS) {
        TRANSPORTS["websocket"] = "websocket";
    })(TRANSPORTS || (TRANSPORTS = {}));
    var CONNECTION_STATE;
    (function (CONNECTION_STATE) {
        CONNECTION_STATE["Connecting"] = "connecting";
        CONNECTION_STATE["Open"] = "open";
        CONNECTION_STATE["Closing"] = "closing";
        CONNECTION_STATE["Closed"] = "closed";
    })(CONNECTION_STATE || (CONNECTION_STATE = {}));

    /**
     * Creates a timer that accepts a `timerCalc` function to perform calculated timeout retries, such as exponential backoff.
     *
     * @example
     *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
     *      return [1000, 5000, 10000][tries - 1] || 10000
     *    })
     *    reconnectTimer.scheduleTimeout() // fires after 1000
     *    reconnectTimer.scheduleTimeout() // fires after 5000
     *    reconnectTimer.reset()
     *    reconnectTimer.scheduleTimeout() // fires after 1000
     */
    class Timer {
        constructor(callback, timerCalc) {
            this.callback = callback;
            this.timerCalc = timerCalc;
            this.timer = undefined;
            this.tries = 0;
            this.callback = callback;
            this.timerCalc = timerCalc;
        }
        reset() {
            this.tries = 0;
            clearTimeout(this.timer);
        }
        // Cancels any previous scheduleTimeout and schedules callback
        scheduleTimeout() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.tries = this.tries + 1;
                this.callback();
            }, this.timerCalc(this.tries + 1));
        }
    }

    // This file draws heavily from https://github.com/phoenixframework/phoenix/commit/cf098e9cf7a44ee6479d31d911a97d3c7430c6fe
    // License: https://github.com/phoenixframework/phoenix/blob/master/LICENSE.md
    class Serializer {
        constructor() {
            this.HEADER_LENGTH = 1;
        }
        decode(rawPayload, callback) {
            if (rawPayload.constructor === ArrayBuffer) {
                return callback(this._binaryDecode(rawPayload));
            }
            if (typeof rawPayload === 'string') {
                return callback(JSON.parse(rawPayload));
            }
            return callback({});
        }
        _binaryDecode(buffer) {
            const view = new DataView(buffer);
            const decoder = new TextDecoder();
            return this._decodeBroadcast(buffer, view, decoder);
        }
        _decodeBroadcast(buffer, view, decoder) {
            const topicSize = view.getUint8(1);
            const eventSize = view.getUint8(2);
            let offset = this.HEADER_LENGTH + 2;
            const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
            offset = offset + topicSize;
            const event = decoder.decode(buffer.slice(offset, offset + eventSize));
            offset = offset + eventSize;
            const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
            return { ref: null, topic: topic, event: event, payload: data };
        }
    }

    class Push {
        /**
         * Initializes the Push
         *
         * @param channel The Channel
         * @param event The event, for example `"phx_join"`
         * @param payload The payload, for example `{user_id: 123}`
         * @param timeout The push timeout in milliseconds
         */
        constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
            this.channel = channel;
            this.event = event;
            this.payload = payload;
            this.timeout = timeout;
            this.sent = false;
            this.timeoutTimer = undefined;
            this.ref = '';
            this.receivedResp = null;
            this.recHooks = [];
            this.refEvent = null;
        }
        resend(timeout) {
            this.timeout = timeout;
            this._cancelRefEvent();
            this.ref = '';
            this.refEvent = null;
            this.receivedResp = null;
            this.sent = false;
            this.send();
        }
        send() {
            if (this._hasReceived('timeout')) {
                return;
            }
            this.startTimeout();
            this.sent = true;
            this.channel.socket.push({
                topic: this.channel.topic,
                event: this.event,
                payload: this.payload,
                ref: this.ref,
            });
        }
        updatePayload(payload) {
            this.payload = Object.assign(Object.assign({}, this.payload), payload);
        }
        receive(status, callback) {
            var _a;
            if (this._hasReceived(status)) {
                callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
            }
            this.recHooks.push({ status, callback });
            return this;
        }
        startTimeout() {
            if (this.timeoutTimer) {
                return;
            }
            this.ref = this.channel.socket.makeRef();
            this.refEvent = this.channel.replyEventName(this.ref);
            const callback = (payload) => {
                this._cancelRefEvent();
                this._cancelTimeout();
                this.receivedResp = payload;
                this._matchReceive(payload);
            };
            if (this.channel instanceof RealtimeSubscription) {
                this.channel.on(this.refEvent, callback);
            }
            else {
                this.channel.on(this.refEvent, {}, callback);
            }
            this.timeoutTimer = setTimeout(() => {
                this.trigger('timeout', {});
            }, this.timeout);
        }
        trigger(status, response) {
            if (this.refEvent)
                this.channel.trigger(this.refEvent, { status, response });
        }
        destroy() {
            this._cancelRefEvent();
            this._cancelTimeout();
        }
        _cancelRefEvent() {
            if (!this.refEvent) {
                return;
            }
            if (this.channel instanceof RealtimeSubscription) {
                this.channel.off(this.refEvent);
            }
            else {
                this.channel.off(this.refEvent, {});
            }
        }
        _cancelTimeout() {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = undefined;
        }
        _matchReceive({ status, response, }) {
            this.recHooks
                .filter((h) => h.status === status)
                .forEach((h) => h.callback(response));
        }
        _hasReceived(status) {
            return this.receivedResp && this.receivedResp.status === status;
        }
    }

    class RealtimeSubscription {
        constructor(topic, params = {}, socket) {
            this.topic = topic;
            this.params = params;
            this.socket = socket;
            this.bindings = [];
            this.state = CHANNEL_STATES.closed;
            this.joinedOnce = false;
            this.pushBuffer = [];
            this.timeout = this.socket.timeout;
            this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
            this.rejoinTimer = new Timer(() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
            this.joinPush.receive('ok', () => {
                this.state = CHANNEL_STATES.joined;
                this.rejoinTimer.reset();
                this.pushBuffer.forEach((pushEvent) => pushEvent.send());
                this.pushBuffer = [];
            });
            this.onClose(() => {
                this.rejoinTimer.reset();
                this.socket.log('channel', `close ${this.topic} ${this.joinRef()}`);
                this.state = CHANNEL_STATES.closed;
                this.socket.remove(this);
            });
            this.onError((reason) => {
                if (this.isLeaving() || this.isClosed()) {
                    return;
                }
                this.socket.log('channel', `error ${this.topic}`, reason);
                this.state = CHANNEL_STATES.errored;
                this.rejoinTimer.scheduleTimeout();
            });
            this.joinPush.receive('timeout', () => {
                if (!this.isJoining()) {
                    return;
                }
                this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
                this.state = CHANNEL_STATES.errored;
                this.rejoinTimer.scheduleTimeout();
            });
            this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
                this.trigger(this.replyEventName(ref), payload);
            });
        }
        rejoinUntilConnected() {
            this.rejoinTimer.scheduleTimeout();
            if (this.socket.isConnected()) {
                this.rejoin();
            }
        }
        subscribe(timeout = this.timeout) {
            if (this.joinedOnce) {
                throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
            }
            else {
                this.joinedOnce = true;
                this.rejoin(timeout);
                return this.joinPush;
            }
        }
        onClose(callback) {
            this.on(CHANNEL_EVENTS.close, callback);
        }
        onError(callback) {
            this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
        }
        on(event, callback) {
            this.bindings.push({ event, callback });
        }
        off(event) {
            this.bindings = this.bindings.filter((bind) => bind.event !== event);
        }
        canPush() {
            return this.socket.isConnected() && this.isJoined();
        }
        push(event, payload, timeout = this.timeout) {
            if (!this.joinedOnce) {
                throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
            }
            let pushEvent = new Push(this, event, payload, timeout);
            if (this.canPush()) {
                pushEvent.send();
            }
            else {
                pushEvent.startTimeout();
                this.pushBuffer.push(pushEvent);
            }
            return pushEvent;
        }
        updateJoinPayload(payload) {
            this.joinPush.updatePayload(payload);
        }
        /**
         * Leaves the channel
         *
         * Unsubscribes from server events, and instructs channel to terminate on server.
         * Triggers onClose() hooks.
         *
         * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
         * channel.unsubscribe().receive("ok", () => alert("left!") )
         */
        unsubscribe(timeout = this.timeout) {
            this.state = CHANNEL_STATES.leaving;
            let onClose = () => {
                this.socket.log('channel', `leave ${this.topic}`);
                this.trigger(CHANNEL_EVENTS.close, 'leave', this.joinRef());
            };
            // Destroy joinPush to avoid connection timeouts during unscription phase
            this.joinPush.destroy();
            let leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
            leavePush.receive('ok', () => onClose()).receive('timeout', () => onClose());
            leavePush.send();
            if (!this.canPush()) {
                leavePush.trigger('ok', {});
            }
            return leavePush;
        }
        /**
         * Overridable message hook
         *
         * Receives all events for specialized message handling before dispatching to the channel callbacks.
         * Must return the payload, modified or unmodified.
         */
        onMessage(event, payload, ref) {
            return payload;
        }
        isMember(topic) {
            return this.topic === topic;
        }
        joinRef() {
            return this.joinPush.ref;
        }
        rejoin(timeout = this.timeout) {
            if (this.isLeaving()) {
                return;
            }
            this.socket.leaveOpenTopic(this.topic);
            this.state = CHANNEL_STATES.joining;
            this.joinPush.resend(timeout);
        }
        trigger(event, payload, ref) {
            let { close, error, leave, join } = CHANNEL_EVENTS;
            let events = [close, error, leave, join];
            if (ref && events.indexOf(event) >= 0 && ref !== this.joinRef()) {
                return;
            }
            let handledPayload = this.onMessage(event, payload, ref);
            if (payload && !handledPayload) {
                throw 'channel onMessage callbacks must return the payload, modified or unmodified';
            }
            this.bindings
                .filter((bind) => {
                // Bind all events if the user specifies a wildcard.
                if (bind.event === '*') {
                    return event === (payload === null || payload === void 0 ? void 0 : payload.type);
                }
                else {
                    return bind.event === event;
                }
            })
                .map((bind) => bind.callback(handledPayload, ref));
        }
        replyEventName(ref) {
            return `chan_reply_${ref}`;
        }
        isClosed() {
            return this.state === CHANNEL_STATES.closed;
        }
        isErrored() {
            return this.state === CHANNEL_STATES.errored;
        }
        isJoined() {
            return this.state === CHANNEL_STATES.joined;
        }
        isJoining() {
            return this.state === CHANNEL_STATES.joining;
        }
        isLeaving() {
            return this.state === CHANNEL_STATES.leaving;
        }
    }

    /*
      This file draws heavily from https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/assets/js/phoenix/presence.js
      License: https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/LICENSE.md
    */
    class RealtimePresence {
        /**
         * Initializes the Presence.
         *
         * @param channel - The RealtimeSubscription
         * @param opts - The options,
         *        for example `{events: {state: 'state', diff: 'diff'}}`
         */
        constructor(channel, opts) {
            this.channel = channel;
            this.state = {};
            this.pendingDiffs = [];
            this.joinRef = null;
            this.caller = {
                onJoin: () => { },
                onLeave: () => { },
                onSync: () => { },
            };
            const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
                state: 'presence_state',
                diff: 'presence_diff',
            };
            this.channel.on(events.state, {}, (newState) => {
                const { onJoin, onLeave, onSync } = this.caller;
                this.joinRef = this.channel.joinRef();
                this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
                this.pendingDiffs.forEach((diff) => {
                    this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
                });
                this.pendingDiffs = [];
                onSync();
            });
            this.channel.on(events.diff, {}, (diff) => {
                const { onJoin, onLeave, onSync } = this.caller;
                if (this.inPendingSyncState()) {
                    this.pendingDiffs.push(diff);
                }
                else {
                    this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
                    onSync();
                }
            });
        }
        /**
         * Used to sync the list of presences on the server with the
         * client's state.
         *
         * An optional `onJoin` and `onLeave` callback can be provided to
         * react to changes in the client's local presences across
         * disconnects and reconnects with the server.
         */
        static syncState(currentState, newState, onJoin, onLeave) {
            const state = this.cloneDeep(currentState);
            const transformedState = this.transformState(newState);
            const joins = {};
            const leaves = {};
            this.map(state, (key, presences) => {
                if (!transformedState[key]) {
                    leaves[key] = presences;
                }
            });
            this.map(transformedState, (key, newPresences) => {
                const currentPresences = state[key];
                if (currentPresences) {
                    const newPresenceIds = newPresences.map((m) => m.presence_id);
                    const curPresenceIds = currentPresences.map((m) => m.presence_id);
                    const joinedPresences = newPresences.filter((m) => curPresenceIds.indexOf(m.presence_id) < 0);
                    const leftPresences = currentPresences.filter((m) => newPresenceIds.indexOf(m.presence_id) < 0);
                    if (joinedPresences.length > 0) {
                        joins[key] = joinedPresences;
                    }
                    if (leftPresences.length > 0) {
                        leaves[key] = leftPresences;
                    }
                }
                else {
                    joins[key] = newPresences;
                }
            });
            return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
        }
        /**
         * Used to sync a diff of presence join and leave events from the
         * server, as they happen.
         *
         * Like `syncState`, `syncDiff` accepts optional `onJoin` and
         * `onLeave` callbacks to react to a user joining or leaving from a
         * device.
         */
        static syncDiff(state, diff, onJoin, onLeave) {
            const { joins, leaves } = {
                joins: this.transformState(diff.joins),
                leaves: this.transformState(diff.leaves),
            };
            if (!onJoin) {
                onJoin = () => { };
            }
            if (!onLeave) {
                onLeave = () => { };
            }
            this.map(joins, (key, newPresences) => {
                const currentPresences = state[key];
                state[key] = this.cloneDeep(newPresences);
                if (currentPresences) {
                    const joinedPresenceIds = state[key].map((m) => m.presence_id);
                    const curPresences = currentPresences.filter((m) => joinedPresenceIds.indexOf(m.presence_id) < 0);
                    state[key].unshift(...curPresences);
                }
                onJoin(key, currentPresences, newPresences);
            });
            this.map(leaves, (key, leftPresences) => {
                let currentPresences = state[key];
                if (!currentPresences)
                    return;
                const presenceIdsToRemove = leftPresences.map((m) => m.presence_id);
                currentPresences = currentPresences.filter((m) => presenceIdsToRemove.indexOf(m.presence_id) < 0);
                state[key] = currentPresences;
                onLeave(key, currentPresences, leftPresences);
                if (currentPresences.length === 0)
                    delete state[key];
            });
            return state;
        }
        /**
         * Returns the array of presences, with selected metadata.
         */
        static list(presences, chooser) {
            if (!chooser) {
                chooser = (_key, pres) => pres;
            }
            return this.map(presences, (key, presences) => chooser(key, presences));
        }
        static map(obj, func) {
            return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
        }
        /**
         * Remove 'metas' key
         * Change 'phx_ref' to 'presence_id'
         * Remove 'phx_ref' and 'phx_ref_prev'
         *
         * @example
         * // returns {
         *  abc123: [
         *    { presence_id: '2', user_id: 1 },
         *    { presence_id: '3', user_id: 2 }
         *  ]
         * }
         * RealtimePresence.transformState({
         *  abc123: {
         *    metas: [
         *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
         *      { phx_ref: '3', user_id: 2 }
         *    ]
         *  }
         * })
         */
        static transformState(state) {
            state = this.cloneDeep(state);
            return Object.getOwnPropertyNames(state).reduce((newState, key) => {
                const presences = state[key];
                if ('metas' in presences) {
                    newState[key] = presences.metas.map((presence) => {
                        presence['presence_id'] = presence['phx_ref'];
                        delete presence['phx_ref'];
                        delete presence['phx_ref_prev'];
                        return presence;
                    });
                }
                else {
                    newState[key] = presences;
                }
                return newState;
            }, {});
        }
        static cloneDeep(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        onJoin(callback) {
            this.caller.onJoin = callback;
        }
        onLeave(callback) {
            this.caller.onLeave = callback;
        }
        onSync(callback) {
            this.caller.onSync = callback;
        }
        list(by) {
            return RealtimePresence.list(this.state, by);
        }
        inPendingSyncState() {
            return !this.joinRef || this.joinRef !== this.channel.joinRef();
        }
    }

    class RealtimeChannel {
        constructor(topic, params = {}, socket) {
            this.topic = topic;
            this.params = params;
            this.socket = socket;
            this.bindings = [];
            this.state = CHANNEL_STATES.closed;
            this.joinedOnce = false;
            this.pushBuffer = [];
            this.timeout = this.socket.timeout;
            this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
            this.rejoinTimer = new Timer(() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
            this.joinPush.receive('ok', () => {
                this.state = CHANNEL_STATES.joined;
                this.rejoinTimer.reset();
                this.pushBuffer.forEach((pushEvent) => pushEvent.send());
                this.pushBuffer = [];
            });
            this.onClose(() => {
                this.rejoinTimer.reset();
                this.socket.log('channel', `close ${this.topic} ${this.joinRef()}`);
                this.state = CHANNEL_STATES.closed;
                this.socket.remove(this);
            });
            this.onError((reason) => {
                if (this.isLeaving() || this.isClosed()) {
                    return;
                }
                this.socket.log('channel', `error ${this.topic}`, reason);
                this.state = CHANNEL_STATES.errored;
                this.rejoinTimer.scheduleTimeout();
            });
            this.joinPush.receive('timeout', () => {
                if (!this.isJoining()) {
                    return;
                }
                this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
                this.state = CHANNEL_STATES.errored;
                this.rejoinTimer.scheduleTimeout();
            });
            this.on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
                this.trigger(this.replyEventName(ref), payload);
            });
            this.presence = new RealtimePresence(this);
        }
        list() {
            return this.presence.list();
        }
        rejoinUntilConnected() {
            this.rejoinTimer.scheduleTimeout();
            if (this.socket.isConnected()) {
                this.rejoin();
            }
        }
        subscribe(timeout = this.timeout) {
            if (this.joinedOnce) {
                throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
            }
            else {
                const configs = this.bindings.reduce((acc, binding) => {
                    const { type } = binding;
                    if (![
                        'phx_close',
                        'phx_error',
                        'phx_reply',
                        'presence_diff',
                        'presence_state',
                    ].includes(type)) {
                        acc[type] = binding;
                    }
                    return acc;
                }, {});
                if (Object.keys(configs).length) {
                    this.updateJoinPayload({ configs });
                }
                this.joinedOnce = true;
                this.rejoin(timeout);
                return this.joinPush;
            }
        }
        /**
         * Registers a callback that will be executed when the channel closes.
         */
        onClose(callback) {
            this.on(CHANNEL_EVENTS.close, {}, callback);
        }
        /**
         * Registers a callback that will be executed when the channel encounteres an error.
         */
        onError(callback) {
            this.on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
        }
        on(type, filter, callback) {
            this.bindings.push({
                type,
                filter: filter !== null && filter !== void 0 ? filter : {},
                callback: callback !== null && callback !== void 0 ? callback : (() => { }),
            });
        }
        off(type, filter) {
            this.bindings = this.bindings.filter((bind) => {
                return !(bind.type === type && RealtimeChannel.isEqual(bind.filter, filter));
            });
        }
        /**
         * Returns `true` if the socket is connected and the channel has been joined.
         */
        canPush() {
            return this.socket.isConnected() && this.isJoined();
        }
        push(event, payload, timeout = this.timeout) {
            if (!this.joinedOnce) {
                throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
            }
            let pushEvent = new Push(this, event, payload, timeout);
            if (this.canPush()) {
                pushEvent.send();
            }
            else {
                pushEvent.startTimeout();
                this.pushBuffer.push(pushEvent);
            }
            return pushEvent;
        }
        updateJoinPayload(payload) {
            this.joinPush.updatePayload(payload);
        }
        /**
         * Leaves the channel.
         *
         * Unsubscribes from server events, and instructs channel to terminate on server.
         * Triggers onClose() hooks.
         *
         * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
         * channel.unsubscribe().receive("ok", () => alert("left!") )
         */
        unsubscribe(timeout = this.timeout) {
            this.state = CHANNEL_STATES.leaving;
            const onClose = () => {
                this.socket.log('channel', `leave ${this.topic}`);
                this.trigger(CHANNEL_EVENTS.close, 'leave', this.joinRef());
            };
            // Destroy joinPush to avoid connection timeouts during unscription phase
            this.joinPush.destroy();
            const leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
            leavePush.receive('ok', () => onClose()).receive('timeout', () => onClose());
            leavePush.send();
            if (!this.canPush()) {
                leavePush.trigger('ok', {});
            }
            return leavePush;
        }
        /**
         * Overridable message hook
         *
         * Receives all events for specialized message handling before dispatching to the channel callbacks.
         * Must return the payload, modified or unmodified.
         */
        onMessage(event, payload, ref) {
            return payload;
        }
        isMember(topic) {
            return this.topic === topic;
        }
        joinRef() {
            return this.joinPush.ref;
        }
        rejoin(timeout = this.timeout) {
            if (this.isLeaving()) {
                return;
            }
            this.socket.leaveOpenTopic(this.topic);
            this.state = CHANNEL_STATES.joining;
            this.joinPush.resend(timeout);
        }
        trigger(type, payload, ref) {
            const { close, error, leave, join } = CHANNEL_EVENTS;
            const events = [close, error, leave, join];
            if (ref && events.indexOf(type) >= 0 && ref !== this.joinRef()) {
                return;
            }
            const handledPayload = this.onMessage(type, payload, ref);
            if (payload && !handledPayload) {
                throw 'channel onMessage callbacks must return the payload, modified or unmodified';
            }
            this.bindings
                .filter((bind) => {
                var _a, _b;
                return ((bind === null || bind === void 0 ? void 0 : bind.type) === type &&
                    (((_a = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _a === void 0 ? void 0 : _a.event) === '*' ||
                        ((_b = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _b === void 0 ? void 0 : _b.event) === (payload === null || payload === void 0 ? void 0 : payload.event)));
            })
                .map((bind) => bind.callback(handledPayload, ref));
        }
        send(payload) {
            const push = this.push(payload.type, payload);
            return new Promise((resolve, reject) => {
                push.receive('ok', () => resolve('ok'));
                push.receive('timeout', () => reject('timeout'));
            });
        }
        replyEventName(ref) {
            return `chan_reply_${ref}`;
        }
        isClosed() {
            return this.state === CHANNEL_STATES.closed;
        }
        isErrored() {
            return this.state === CHANNEL_STATES.errored;
        }
        isJoined() {
            return this.state === CHANNEL_STATES.joined;
        }
        isJoining() {
            return this.state === CHANNEL_STATES.joining;
        }
        isLeaving() {
            return this.state === CHANNEL_STATES.leaving;
        }
        static isEqual(obj1, obj2) {
            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false;
            }
            for (const k in obj1) {
                if (obj1[k] !== obj2[k]) {
                    return false;
                }
            }
            return true;
        }
    }

    var __awaiter$5 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __rest = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
    const noop = () => { };
    class RealtimeClient {
        /**
         * Initializes the Socket.
         *
         * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
         * @param options.transport The Websocket Transport, for example WebSocket.
         * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
         * @param options.params The optional params to pass when connecting.
         * @param options.headers The optional headers to pass when connecting.
         * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
         * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
         * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
         * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
         * @param options.longpollerTimeout The maximum timeout of a long poll AJAX request. Defaults to 20s (double the server long poll timer).
         * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
         */
        constructor(endPoint, options) {
            this.accessToken = null;
            this.channels = [];
            this.endPoint = '';
            this.headers = DEFAULT_HEADERS$1;
            this.params = {};
            this.timeout = DEFAULT_TIMEOUT;
            this.transport = browser.w3cwebsocket;
            this.heartbeatIntervalMs = 30000;
            this.longpollerTimeout = 20000;
            this.heartbeatTimer = undefined;
            this.pendingHeartbeatRef = null;
            this.ref = 0;
            this.logger = noop;
            this.conn = null;
            this.sendBuffer = [];
            this.serializer = new Serializer();
            this.stateChangeCallbacks = {
                open: [],
                close: [],
                error: [],
                message: [],
            };
            this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
            if (options === null || options === void 0 ? void 0 : options.params)
                this.params = options.params;
            if (options === null || options === void 0 ? void 0 : options.headers)
                this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
            if (options === null || options === void 0 ? void 0 : options.timeout)
                this.timeout = options.timeout;
            if (options === null || options === void 0 ? void 0 : options.logger)
                this.logger = options.logger;
            if (options === null || options === void 0 ? void 0 : options.transport)
                this.transport = options.transport;
            if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs)
                this.heartbeatIntervalMs = options.heartbeatIntervalMs;
            if (options === null || options === void 0 ? void 0 : options.longpollerTimeout)
                this.longpollerTimeout = options.longpollerTimeout;
            this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs
                : (tries) => {
                    return [1000, 2000, 5000, 10000][tries - 1] || 10000;
                };
            this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode
                : (payload, callback) => {
                    return callback(JSON.stringify(payload));
                };
            this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode
                : this.serializer.decode.bind(this.serializer);
            this.reconnectTimer = new Timer(() => __awaiter$5(this, void 0, void 0, function* () {
                yield this.disconnect();
                this.connect();
            }), this.reconnectAfterMs);
        }
        /**
         * Connects the socket, unless already connected.
         */
        connect() {
            if (this.conn) {
                return;
            }
            this.conn = new this.transport(this.endPointURL(), [], null, this.headers);
            if (this.conn) {
                // this.conn.timeout = this.longpollerTimeout // TYPE ERROR
                this.conn.binaryType = 'arraybuffer';
                this.conn.onopen = () => this._onConnOpen();
                this.conn.onerror = (error) => this._onConnError(error);
                this.conn.onmessage = (event) => this.onConnMessage(event);
                this.conn.onclose = (event) => this._onConnClose(event);
            }
        }
        /**
         * Disconnects the socket.
         *
         * @param code A numeric status code to send on disconnect.
         * @param reason A custom reason for the disconnect.
         */
        disconnect(code, reason) {
            return new Promise((resolve, _reject) => {
                try {
                    if (this.conn) {
                        this.conn.onclose = function () { }; // noop
                        if (code) {
                            this.conn.close(code, reason || '');
                        }
                        else {
                            this.conn.close();
                        }
                        this.conn = null;
                        // remove open handles
                        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
                        this.reconnectTimer.reset();
                    }
                    resolve({ error: null, data: true });
                }
                catch (error) {
                    resolve({ error: error, data: false });
                }
            });
        }
        /**
         * Logs the message.
         *
         * For customized logging, `this.logger` can be overriden.
         */
        log(kind, msg, data) {
            this.logger(kind, msg, data);
        }
        /**
         * Registers a callback for connection state change event.
         *
         * @param callback A function to be called when the event occurs.
         *
         * @example
         *    socket.onOpen(() => console.log("Socket opened."))
         */
        onOpen(callback) {
            this.stateChangeCallbacks.open.push(callback);
        }
        /**
         * Registers a callback for connection state change events.
         *
         * @param callback A function to be called when the event occurs.
         *
         * @example
         *    socket.onOpen(() => console.log("Socket closed."))
         */
        onClose(callback) {
            this.stateChangeCallbacks.close.push(callback);
        }
        /**
         * Registers a callback for connection state change events.
         *
         * @param callback A function to be called when the event occurs.
         *
         * @example
         *    socket.onOpen((error) => console.log("An error occurred"))
         */
        onError(callback) {
            this.stateChangeCallbacks.error.push(callback);
        }
        /**
         * Calls a function any time a message is received.
         *
         * @param callback A function to be called when the event occurs.
         *
         * @example
         *    socket.onMessage((message) => console.log(message))
         */
        onMessage(callback) {
            this.stateChangeCallbacks.message.push(callback);
        }
        /**
         * Returns the current state of the socket.
         */
        connectionState() {
            switch (this.conn && this.conn.readyState) {
                case SOCKET_STATES.connecting:
                    return CONNECTION_STATE.Connecting;
                case SOCKET_STATES.open:
                    return CONNECTION_STATE.Open;
                case SOCKET_STATES.closing:
                    return CONNECTION_STATE.Closing;
                default:
                    return CONNECTION_STATE.Closed;
            }
        }
        /**
         * Retuns `true` is the connection is open.
         */
        isConnected() {
            return this.connectionState() === CONNECTION_STATE.Open;
        }
        /**
         * Removes a subscription from the socket.
         *
         * @param channel An open subscription.
         */
        remove(channel) {
            this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
        }
        channel(topic, chanParams = {}) {
            var _a;
            const { selfBroadcast } = chanParams, params = __rest(chanParams, ["selfBroadcast"]);
            if (selfBroadcast) {
                params.self_broadcast = selfBroadcast;
            }
            const chan = ((_a = this.params) === null || _a === void 0 ? void 0 : _a.vsndate) ? new RealtimeChannel(topic, params, this)
                : new RealtimeSubscription(topic, params, this);
            if (chan instanceof RealtimeChannel) {
                chan.presence.onJoin((key, currentPresences, newPresences) => {
                    chan.trigger('presence', {
                        event: 'JOIN',
                        key,
                        currentPresences,
                        newPresences,
                    });
                });
                chan.presence.onLeave((key, currentPresences, leftPresences) => {
                    chan.trigger('presence', {
                        event: 'LEAVE',
                        key,
                        currentPresences,
                        leftPresences,
                    });
                });
                chan.presence.onSync(() => {
                    chan.trigger('presence', { event: 'SYNC' });
                });
            }
            this.channels.push(chan);
            return chan;
        }
        /**
         * Push out a message if the socket is connected.
         *
         * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
         */
        push(data) {
            const { topic, event, payload, ref } = data;
            let callback = () => {
                this.encode(data, (result) => {
                    var _a;
                    (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
                });
            };
            this.log('push', `${topic} ${event} (${ref})`, payload);
            if (this.isConnected()) {
                callback();
            }
            else {
                this.sendBuffer.push(callback);
            }
        }
        onConnMessage(rawMessage) {
            this.decode(rawMessage.data, (msg) => {
                let { topic, event, payload, ref } = msg;
                if ((ref && ref === this.pendingHeartbeatRef) ||
                    event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
                    this.pendingHeartbeatRef = null;
                }
                this.log('receive', `${payload.status || ''} ${topic} ${event} ${(ref && '(' + ref + ')') || ''}`, payload);
                this.channels
                    .filter((channel) => channel.isMember(topic))
                    .forEach((channel) => channel.trigger(event, payload, ref));
                this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
            });
        }
        /**
         * Returns the URL of the websocket.
         */
        endPointURL() {
            return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
        }
        /**
         * Return the next message ref, accounting for overflows
         */
        makeRef() {
            let newRef = this.ref + 1;
            if (newRef === this.ref) {
                this.ref = 0;
            }
            else {
                this.ref = newRef;
            }
            return this.ref.toString();
        }
        /**
         * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
         *
         * @param token A JWT string.
         */
        setAuth(token) {
            this.accessToken = token;
            this.channels.forEach((channel) => {
                token && channel.updateJoinPayload({ user_token: token });
                if (channel.joinedOnce && channel.isJoined()) {
                    channel.push(CHANNEL_EVENTS.access_token, { access_token: token });
                }
            });
        }
        /**
         * Unsubscribe from channels with the specified topic.
         */
        leaveOpenTopic(topic) {
            let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
            if (dupChannel) {
                this.log('transport', `leaving duplicate topic "${topic}"`);
                dupChannel.unsubscribe();
            }
        }
        _onConnOpen() {
            this.log('transport', `connected to ${this.endPointURL()}`);
            this._flushSendBuffer();
            this.reconnectTimer.reset();
            this.heartbeatTimer && clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
            this.stateChangeCallbacks.open.forEach((callback) => callback());
        }
        _onConnClose(event) {
            this.log('transport', 'close', event);
            this._triggerChanError();
            this.heartbeatTimer && clearInterval(this.heartbeatTimer);
            this.reconnectTimer.scheduleTimeout();
            this.stateChangeCallbacks.close.forEach((callback) => callback(event));
        }
        _onConnError(error) {
            this.log('transport', error.message);
            this._triggerChanError();
            this.stateChangeCallbacks.error.forEach((callback) => callback(error));
        }
        _triggerChanError() {
            this.channels.forEach((channel) => channel.trigger(CHANNEL_EVENTS.error));
        }
        _appendParams(url, params) {
            if (Object.keys(params).length === 0) {
                return url;
            }
            const prefix = url.match(/\?/) ? '&' : '?';
            const query = new URLSearchParams(params);
            return `${url}${prefix}${query}`;
        }
        _flushSendBuffer() {
            if (this.isConnected() && this.sendBuffer.length > 0) {
                this.sendBuffer.forEach((callback) => callback());
                this.sendBuffer = [];
            }
        }
        _sendHeartbeat() {
            var _a;
            if (!this.isConnected()) {
                return;
            }
            if (this.pendingHeartbeatRef) {
                this.pendingHeartbeatRef = null;
                this.log('transport', 'heartbeat timeout. Attempting to re-establish connection');
                (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, 'hearbeat timeout');
                return;
            }
            this.pendingHeartbeatRef = this.makeRef();
            this.push({
                topic: 'phoenix',
                event: 'heartbeat',
                payload: {},
                ref: this.pendingHeartbeatRef,
            });
            this.setAuth(this.accessToken);
        }
    }

    class SupabaseRealtimeClient {
        constructor(socket, headers, schema, tableName) {
            const chanParams = {};
            const topic = tableName === '*' ? `realtime:${schema}` : `realtime:${schema}:${tableName}`;
            const userToken = headers['Authorization'].split(' ')[1];
            if (userToken) {
                chanParams['user_token'] = userToken;
            }
            this.subscription = socket.channel(topic, chanParams);
        }
        getPayloadRecords(payload) {
            const records = {
                new: {},
                old: {},
            };
            if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
                records.new = convertChangeData(payload.columns, payload.record);
            }
            if (payload.type === 'UPDATE' || payload.type === 'DELETE') {
                records.old = convertChangeData(payload.columns, payload.old_record);
            }
            return records;
        }
        /**
         * The event you want to listen to.
         *
         * @param event The event
         * @param callback A callback function that is called whenever the event occurs.
         */
        on(event, callback) {
            this.subscription.on(event, (payload) => {
                let enrichedPayload = {
                    schema: payload.schema,
                    table: payload.table,
                    commit_timestamp: payload.commit_timestamp,
                    eventType: payload.type,
                    new: {},
                    old: {},
                    errors: payload.errors,
                };
                enrichedPayload = Object.assign(Object.assign({}, enrichedPayload), this.getPayloadRecords(payload));
                callback(enrichedPayload);
            });
            return this;
        }
        /**
         * Enables the subscription.
         */
        subscribe(callback = () => { }) {
            this.subscription.onError((e) => callback('SUBSCRIPTION_ERROR', e));
            this.subscription.onClose(() => callback('CLOSED'));
            this.subscription
                .subscribe()
                .receive('ok', () => callback('SUBSCRIBED'))
                .receive('error', (e) => callback('SUBSCRIPTION_ERROR', e))
                .receive('timeout', () => callback('RETRYING_AFTER_TIMEOUT'));
            return this.subscription;
        }
    }

    class SupabaseQueryBuilder extends PostgrestQueryBuilder {
        constructor(url, { headers = {}, schema, realtime, table, fetch, shouldThrowOnError, }) {
            super(url, { headers, schema, fetch, shouldThrowOnError });
            this._subscription = null;
            this._realtime = realtime;
            this._headers = headers;
            this._schema = schema;
            this._table = table;
        }
        /**
         * Subscribe to realtime changes in your database.
         * @param event The database event which you would like to receive updates for, or you can use the special wildcard `*` to listen to all changes.
         * @param callback A callback that will handle the payload that is sent whenever your database changes.
         */
        on(event, callback) {
            if (!this._realtime.isConnected()) {
                this._realtime.connect();
            }
            if (!this._subscription) {
                this._subscription = new SupabaseRealtimeClient(this._realtime, this._headers, this._schema, this._table);
            }
            return this._subscription.on(event, callback);
        }
    }

    // generated by genversion
    const version = '0.0.0';

    const DEFAULT_HEADERS = { 'X-Client-Info': `storage-js/${version}` };

    var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    const handleError = (error, reject) => {
        if (typeof error.json !== 'function') {
            return reject(error);
        }
        error.json().then((err) => {
            return reject({
                message: _getErrorMessage(err),
                status: (error === null || error === void 0 ? void 0 : error.status) || 500,
            });
        });
    };
    const _getRequestParams = (method, options, parameters, body) => {
        const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
        if (method === 'GET') {
            return params;
        }
        params.headers = Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
        return Object.assign(Object.assign({}, params), parameters);
    };
    function _handleRequest(fetcher, method, url, options, parameters, body) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fetcher(url, _getRequestParams(method, options, parameters, body))
                    .then((result) => {
                    if (!result.ok)
                        throw result;
                    if (options === null || options === void 0 ? void 0 : options.noResolveJson)
                        return resolve(result);
                    return result.json();
                })
                    .then((data) => resolve(data))
                    .catch((error) => handleError(error, reject));
            });
        });
    }
    function get(fetcher, url, options, parameters) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return _handleRequest(fetcher, 'GET', url, options, parameters);
        });
    }
    function post(fetcher, url, body, options, parameters) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return _handleRequest(fetcher, 'POST', url, options, parameters, body);
        });
    }
    function put(fetcher, url, body, options, parameters) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return _handleRequest(fetcher, 'PUT', url, options, parameters, body);
        });
    }
    function remove(fetcher, url, body, options, parameters) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return _handleRequest(fetcher, 'DELETE', url, options, parameters, body);
        });
    }

    const resolveFetch$1 = (customFetch) => {
        let _fetch;
        if (customFetch) {
            _fetch = customFetch;
        }
        else if (typeof fetch === 'undefined') {
            _fetch = crossFetch;
        }
        else {
            _fetch = fetch;
        }
        return (...args) => _fetch(...args);
    };

    var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class StorageBucketApi {
        constructor(url, headers = {}, fetch) {
            this.url = url;
            this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS), headers);
            this.fetch = resolveFetch$1(fetch);
        }
        /**
         * Retrieves the details of all Storage buckets within an existing product.
         */
        listBuckets() {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Retrieves the details of an existing Storage bucket.
         *
         * @param id The unique identifier of the bucket you would like to retrieve.
         */
        getBucket(id) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Creates a new Storage bucket
         *
         * @param id A unique identifier for the bucket you are creating.
         * @returns newly created bucket id
         */
        createBucket(id, options = { public: false }) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/bucket`, { id, name: id, public: options.public }, { headers: this.headers });
                    return { data: data.name, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Updates a new Storage bucket
         *
         * @param id A unique identifier for the bucket you are creating.
         */
        updateBucket(id, options) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield put(this.fetch, `${this.url}/bucket/${id}`, { id, name: id, public: options.public }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Removes all objects inside a single bucket.
         *
         * @param id The unique identifier of the bucket you would like to empty.
         */
        emptyBucket(id) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
         * You must first `empty()` the bucket.
         *
         * @param id The unique identifier of the bucket you would like to delete.
         */
        deleteBucket(id) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield remove(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
    }

    var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const DEFAULT_SEARCH_OPTIONS = {
        limit: 100,
        offset: 0,
        sortBy: {
            column: 'name',
            order: 'asc',
        },
    };
    const DEFAULT_FILE_OPTIONS = {
        cacheControl: '3600',
        contentType: 'text/plain;charset=UTF-8',
        upsert: false,
    };
    class StorageFileApi {
        constructor(url, headers = {}, bucketId, fetch) {
            this.url = url;
            this.headers = headers;
            this.bucketId = bucketId;
            this.fetch = resolveFetch$1(fetch);
        }
        /**
         * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
         *
         * @param method HTTP method.
         * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
         * @param fileBody The body of the file to be stored in the bucket.
         * @param fileOptions HTTP headers.
         * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
         * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
         * `upsert`: boolean, whether to perform an upsert.
         */
        uploadOrUpdate(method, path, fileBody, fileOptions) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    let body;
                    const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
                    const headers = Object.assign(Object.assign({}, this.headers), (method === 'POST' && { 'x-upsert': String(options.upsert) }));
                    if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
                        body = new FormData();
                        body.append('cacheControl', options.cacheControl);
                        body.append('', fileBody);
                    }
                    else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
                        body = fileBody;
                        body.append('cacheControl', options.cacheControl);
                    }
                    else {
                        body = fileBody;
                        headers['cache-control'] = `max-age=${options.cacheControl}`;
                        headers['content-type'] = options.contentType;
                    }
                    const cleanPath = this._removeEmptyFolders(path);
                    const _path = this._getFinalPath(cleanPath);
                    const res = yield this.fetch(`${this.url}/object/${_path}`, {
                        method,
                        body: body,
                        headers,
                    });
                    if (res.ok) {
                        // const data = await res.json()
                        // temporary fix till backend is updated to the latest storage-api version
                        return { data: { Key: _path }, error: null };
                    }
                    else {
                        const error = yield res.json();
                        return { data: null, error };
                    }
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Uploads a file to an existing bucket.
         *
         * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
         * @param fileBody The body of the file to be stored in the bucket.
         * @param fileOptions HTTP headers.
         * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
         * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
         * `upsert`: boolean, whether to perform an upsert.
         */
        upload(path, fileBody, fileOptions) {
            return __awaiter$2(this, void 0, void 0, function* () {
                return this.uploadOrUpdate('POST', path, fileBody, fileOptions);
            });
        }
        /**
         * Replaces an existing file at the specified path with a new one.
         *
         * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
         * @param fileBody The body of the file to be stored in the bucket.
         * @param fileOptions HTTP headers.
         * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
         * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
         * `upsert`: boolean, whether to perform an upsert.
         */
        update(path, fileBody, fileOptions) {
            return __awaiter$2(this, void 0, void 0, function* () {
                return this.uploadOrUpdate('PUT', path, fileBody, fileOptions);
            });
        }
        /**
         * Moves an existing file.
         *
         * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
         * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
         */
        move(fromPath, toPath) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Copies an existing file.
         *
         * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
         * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
         */
        copy(fromPath, toPath) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Create signed URL to download file without requiring permissions. This URL can be valid for a set number of seconds.
         *
         * @param path The file path to be downloaded, including the current file name. For example `folder/image.png`.
         * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
         */
        createSignedUrl(path, expiresIn) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const _path = this._getFinalPath(path);
                    let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, { expiresIn }, { headers: this.headers });
                    const signedURL = `${this.url}${data.signedURL}`;
                    data = { signedURL };
                    return { data, error: null, signedURL };
                }
                catch (error) {
                    return { data: null, error, signedURL: null };
                }
            });
        }
        /**
         * Create signed URLs to download files without requiring permissions. These URLs can be valid for a set number of seconds.
         *
         * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
         * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
         */
        createSignedUrls(paths, expiresIn) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
                    return {
                        data: data.map((datum) => (Object.assign(Object.assign({}, datum), { signedURL: datum.signedURL ? `${this.url}${datum.signedURL}` : null }))),
                        error: null,
                    };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Downloads a file.
         *
         * @param path The file path to be downloaded, including the path and file name. For example `folder/image.png`.
         */
        download(path) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const _path = this._getFinalPath(path);
                    const res = yield get(this.fetch, `${this.url}/object/${_path}`, {
                        headers: this.headers,
                        noResolveJson: true,
                    });
                    const data = yield res.blob();
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Retrieve URLs for assets in public buckets
         *
         * @param path The file path to be downloaded, including the path and file name. For example `folder/image.png`.
         */
        getPublicUrl(path) {
            try {
                const _path = this._getFinalPath(path);
                const publicURL = `${this.url}/object/public/${_path}`;
                const data = { publicURL };
                return { data, error: null, publicURL };
            }
            catch (error) {
                return { data: null, error, publicURL: null };
            }
        }
        /**
         * Deletes files within the same bucket
         *
         * @param paths An array of files to be deleted, including the path and file name. For example [`folder/image.png`].
         */
        remove(paths) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const data = yield remove(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Get file metadata
         * @param id the file id to retrieve metadata
         */
        // async getMetadata(id: string): Promise<{ data: Metadata | null; error: Error | null }> {
        //   try {
        //     const data = await get(`${this.url}/metadata/${id}`, { headers: this.headers })
        //     return { data, error: null }
        //   } catch (error) {
        //     return { data: null, error }
        //   }
        // }
        /**
         * Update file metadata
         * @param id the file id to update metadata
         * @param meta the new file metadata
         */
        // async updateMetadata(
        //   id: string,
        //   meta: Metadata
        // ): Promise<{ data: Metadata | null; error: Error | null }> {
        //   try {
        //     const data = await post(`${this.url}/metadata/${id}`, { ...meta }, { headers: this.headers })
        //     return { data, error: null }
        //   } catch (error) {
        //     return { data: null, error }
        //   }
        // }
        /**
         * Lists all the files within a bucket.
         * @param path The folder path.
         * @param options Search options, including `limit`, `offset`, and `sortBy`.
         * @param parameters Fetch parameters, currently only supports `signal`, which is an AbortController's signal
         */
        list(path, options, parameters) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || '' });
                    const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        _getFinalPath(path) {
            return `${this.bucketId}/${path}`;
        }
        _removeEmptyFolders(path) {
            return path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/');
        }
    }

    class StorageClient extends StorageBucketApi {
        constructor(url, headers = {}, fetch) {
            super(url, headers, fetch);
        }
        /**
         * Perform file operation in a bucket.
         *
         * @param id The bucket id to operate on.
         */
        from(id) {
            return new StorageFileApi(this.url, this.headers, id, this.fetch);
        }
    }

    const resolveFetch = (customFetch) => {
        let _fetch;
        if (customFetch) {
            _fetch = customFetch;
        }
        else if (typeof fetch === 'undefined') {
            _fetch = crossFetch;
        }
        else {
            _fetch = fetch;
        }
        return (...args) => _fetch(...args);
    };

    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class FunctionsClient {
        constructor(url, { headers = {}, customFetch, } = {}) {
            this.url = url;
            this.headers = headers;
            this.fetch = resolveFetch(customFetch);
        }
        /**
         * Updates the authorization header
         * @params token - the new jwt token sent in the authorisation header
         */
        setAuth(token) {
            this.headers.Authorization = `Bearer ${token}`;
        }
        /**
         * Invokes a function
         * @param functionName - the name of the function to invoke
         * @param invokeOptions - object with the following properties
         * `headers`: object representing the headers to send with the request
         * `body`: the body of the request
         * `responseType`: how the response should be parsed. The default is `json`
         */
        invoke(functionName, invokeOptions) {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    const { headers, body } = invokeOptions !== null && invokeOptions !== void 0 ? invokeOptions : {};
                    const response = yield this.fetch(`${this.url}/${functionName}`, {
                        method: 'POST',
                        headers: Object.assign({}, this.headers, headers),
                        body,
                    });
                    const isRelayError = response.headers.get('x-relay-error');
                    if (isRelayError && isRelayError === 'true') {
                        return { data: null, error: new Error(yield response.text()) };
                    }
                    let data;
                    const { responseType } = invokeOptions !== null && invokeOptions !== void 0 ? invokeOptions : {};
                    if (!responseType || responseType === 'json') {
                        data = yield response.json();
                    }
                    else if (responseType === 'arrayBuffer') {
                        data = yield response.arrayBuffer();
                    }
                    else if (responseType === 'blob') {
                        data = yield response.blob();
                    }
                    else {
                        data = yield response.text();
                    }
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
    }

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const DEFAULT_OPTIONS = {
        schema: 'public',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        multiTab: true,
        headers: DEFAULT_HEADERS$4,
    };
    /**
     * Supabase Client.
     *
     * An isomorphic Javascript client for interacting with Postgres.
     */
    class SupabaseClient {
        /**
         * Create a new client for use in the browser.
         * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
         * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
         * @param options.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
         * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
         * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
         * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
         * @param options.headers Any additional headers to send with each network request.
         * @param options.realtime Options passed along to realtime-js constructor.
         * @param options.multiTab Set to "false" if you want to disable multi-tab/window events.
         * @param options.fetch A custom fetch implementation.
         */
        constructor(supabaseUrl, supabaseKey, options) {
            this.supabaseUrl = supabaseUrl;
            this.supabaseKey = supabaseKey;
            if (!supabaseUrl)
                throw new Error('supabaseUrl is required.');
            if (!supabaseKey)
                throw new Error('supabaseKey is required.');
            const _supabaseUrl = stripTrailingSlash(supabaseUrl);
            const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
            this.restUrl = `${_supabaseUrl}/rest/v1`;
            this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace('http', 'ws');
            this.authUrl = `${_supabaseUrl}/auth/v1`;
            this.storageUrl = `${_supabaseUrl}/storage/v1`;
            const isPlatform = _supabaseUrl.match(/(supabase\.co)|(supabase\.in)/);
            if (isPlatform) {
                const urlParts = _supabaseUrl.split('.');
                this.functionsUrl = `${urlParts[0]}.functions.${urlParts[1]}.${urlParts[2]}`;
            }
            else {
                this.functionsUrl = `${_supabaseUrl}/functions/v1`;
            }
            this.schema = settings.schema;
            this.multiTab = settings.multiTab;
            this.fetch = settings.fetch;
            this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$4), options === null || options === void 0 ? void 0 : options.headers);
            this.shouldThrowOnError = settings.shouldThrowOnError || false;
            this.auth = this._initSupabaseAuthClient(settings);
            this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, settings.realtime));
            this._listenForAuthEvents();
            this._listenForMultiTabEvents();
            // In the future we might allow the user to pass in a logger to receive these events.
            // this.realtime.onOpen(() => console.log('OPEN'))
            // this.realtime.onClose(() => console.log('CLOSED'))
            // this.realtime.onError((e: Error) => console.log('Socket error', e))
        }
        /**
         * Supabase Functions allows you to deploy and invoke edge functions.
         */
        get functions() {
            return new FunctionsClient(this.functionsUrl, {
                headers: this._getAuthHeaders(),
                customFetch: this.fetch,
            });
        }
        /**
         * Supabase Storage allows you to manage user-generated content, such as photos or videos.
         */
        get storage() {
            return new StorageClient(this.storageUrl, this._getAuthHeaders(), this.fetch);
        }
        /**
         * Perform a table operation.
         *
         * @param table The table name to operate on.
         */
        from(table) {
            const url = `${this.restUrl}/${table}`;
            return new SupabaseQueryBuilder(url, {
                headers: this._getAuthHeaders(),
                schema: this.schema,
                realtime: this.realtime,
                table,
                fetch: this.fetch,
                shouldThrowOnError: this.shouldThrowOnError,
            });
        }
        /**
         * Perform a function call.
         *
         * @param fn  The function name to call.
         * @param params  The parameters to pass to the function call.
         * @param head   When set to true, no data will be returned.
         * @param count  Count algorithm to use to count rows in a table.
         *
         */
        rpc(fn, params, { head = false, count = null, } = {}) {
            const rest = this._initPostgRESTClient();
            return rest.rpc(fn, params, { head, count });
        }
        /**
         * Creates a channel with Broadcast and Presence.
         * Activated when vsndate query param is present in the WebSocket URL.
         */
        channel(name, opts) {
            var _a, _b;
            const userToken = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
            if (!this.realtime.isConnected()) {
                this.realtime.connect();
            }
            return this.realtime.channel(name, Object.assign(Object.assign({}, opts), { user_token: userToken }));
        }
        /**
         * Closes and removes all subscriptions and returns a list of removed
         * subscriptions and their errors.
         */
        removeAllSubscriptions() {
            return __awaiter(this, void 0, void 0, function* () {
                const allSubs = this.getSubscriptions().slice();
                const allSubPromises = allSubs.map((sub) => this.removeSubscription(sub));
                const allRemovedSubs = yield Promise.all(allSubPromises);
                return allRemovedSubs.map(({ error }, i) => {
                    return {
                        data: { subscription: allSubs[i] },
                        error,
                    };
                });
            });
        }
        /**
         * Closes and removes a channel and returns the number of open channels.
         *
         * @param channel The channel you want to close and remove.
         */
        removeChannel(channel) {
            return __awaiter(this, void 0, void 0, function* () {
                const { error } = yield this._closeSubscription(channel);
                const allChans = this.getSubscriptions();
                const openChanCount = allChans.filter((chan) => chan.isJoined()).length;
                if (allChans.length === 0)
                    yield this.realtime.disconnect();
                return { data: { openChannels: openChanCount }, error };
            });
        }
        /**
         * Closes and removes a subscription and returns the number of open subscriptions.
         *
         * @param subscription The subscription you want to close and remove.
         */
        removeSubscription(subscription) {
            return __awaiter(this, void 0, void 0, function* () {
                const { error } = yield this._closeSubscription(subscription);
                const allSubs = this.getSubscriptions();
                const openSubCount = allSubs.filter((chan) => chan.isJoined()).length;
                if (allSubs.length === 0)
                    yield this.realtime.disconnect();
                return { data: { openSubscriptions: openSubCount }, error };
            });
        }
        _closeSubscription(subscription) {
            return __awaiter(this, void 0, void 0, function* () {
                let error = null;
                if (!subscription.isClosed()) {
                    const { error: unsubError } = yield this._unsubscribeSubscription(subscription);
                    error = unsubError;
                }
                this.realtime.remove(subscription);
                return { error };
            });
        }
        _unsubscribeSubscription(subscription) {
            return new Promise((resolve) => {
                subscription
                    .unsubscribe()
                    .receive('ok', () => resolve({ error: null }))
                    .receive('error', (error) => resolve({ error }))
                    .receive('timeout', () => resolve({ error: new Error('timed out') }));
            });
        }
        /**
         * Returns an array of all your subscriptions.
         */
        getSubscriptions() {
            return this.realtime.channels;
        }
        _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, localStorage, headers, fetch, cookieOptions, multiTab, }) {
            const authHeaders = {
                Authorization: `Bearer ${this.supabaseKey}`,
                apikey: `${this.supabaseKey}`,
            };
            return new SupabaseAuthClient({
                url: this.authUrl,
                headers: Object.assign(Object.assign({}, headers), authHeaders),
                autoRefreshToken,
                persistSession,
                detectSessionInUrl,
                localStorage,
                fetch,
                cookieOptions,
                multiTab,
            });
        }
        _initRealtimeClient(options) {
            return new RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), { params: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.params), { apikey: this.supabaseKey }) }));
        }
        _initPostgRESTClient() {
            return new PostgrestClient(this.restUrl, {
                headers: this._getAuthHeaders(),
                schema: this.schema,
                fetch: this.fetch,
                throwOnError: this.shouldThrowOnError,
            });
        }
        _getAuthHeaders() {
            var _a, _b;
            const headers = Object.assign({}, this.headers);
            const authBearer = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
            headers['apikey'] = this.supabaseKey;
            headers['Authorization'] = headers['Authorization'] || `Bearer ${authBearer}`;
            return headers;
        }
        _listenForMultiTabEvents() {
            if (!this.multiTab || !isBrowser$1() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
                return null;
            }
            try {
                return window === null || window === void 0 ? void 0 : window.addEventListener('storage', (e) => {
                    var _a, _b, _c;
                    if (e.key === STORAGE_KEY$1) {
                        const newSession = JSON.parse(String(e.newValue));
                        const accessToken = (_b = (_a = newSession === null || newSession === void 0 ? void 0 : newSession.currentSession) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : undefined;
                        const previousAccessToken = (_c = this.auth.session()) === null || _c === void 0 ? void 0 : _c.access_token;
                        if (!accessToken) {
                            this._handleTokenChanged('SIGNED_OUT', accessToken, 'STORAGE');
                        }
                        else if (!previousAccessToken && accessToken) {
                            this._handleTokenChanged('SIGNED_IN', accessToken, 'STORAGE');
                        }
                        else if (previousAccessToken !== accessToken) {
                            this._handleTokenChanged('TOKEN_REFRESHED', accessToken, 'STORAGE');
                        }
                    }
                });
            }
            catch (error) {
                console.error('_listenForMultiTabEvents', error);
                return null;
            }
        }
        _listenForAuthEvents() {
            let { data } = this.auth.onAuthStateChange((event, session) => {
                this._handleTokenChanged(event, session === null || session === void 0 ? void 0 : session.access_token, 'CLIENT');
            });
            return data;
        }
        _handleTokenChanged(event, token, source) {
            if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') &&
                this.changedAccessToken !== token) {
                // Token has changed
                this.realtime.setAuth(token);
                // Ideally we should call this.auth.recoverSession() - need to make public
                // to trigger a "SIGNED_IN" event on this client.
                if (source == 'STORAGE')
                    this.auth.setAuth(token);
                this.changedAccessToken = token;
            }
            else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                // Token is removed
                this.realtime.setAuth(this.supabaseKey);
                if (source == 'STORAGE')
                    this.auth.signOut();
            }
        }
    }

    /**
     * Creates a new Supabase Client.
     */
    const createClient = (supabaseUrl, supabaseKey, options) => {
        return new SupabaseClient(supabaseUrl, supabaseKey, options);
    };

    const options = {
        schema: 'public',
    };
    const supabase = createClient('https://dohysbywpvqieovitawt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvaHlzYnl3cHZxaWVvdml0YXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0ODcwMTQsImV4cCI6MTk2ODA2MzAxNH0.rYFZrXwMUOhgnzhnVBRaMb3i9ZGatErKkWSZYN9RZAg', options);

    const initializeTurns = () => ({
        turns: [],
        prevWordPointer: 0,
        lastTurnTimestamp: +new Date(),
    });
    const turns = writable(initializeTurns());
    const updateTurns = (coords, words) => {
        turns.update(prev => ({
            turns: prev.turns.concat([{
                    durationSeconds: (+(new Date()) - prev.lastTurnTimestamp) / 1000,
                    words: words.slice(prev.prevWordPointer),
                    coords
                }]),
            lastTurnTimestamp: +new Date(),
            prevWordPointer: words.length,
        }));
    };
    const resetTurns = () => {
        turns.set(initializeTurns());
    };
    const defaultProps = {
        abandoned: false,
    };
    const saveAnalytics = async (game, turns, props = defaultProps) => {
    };
    const saveLocalStats = (game) => {
        var _a, _b, _c, _d, _e;
        const stats = JSON.parse((_a = localStorage.getItem('stats')) !== null && _a !== void 0 ? _a : '{}');
        stats.gamesPlayed = ((_b = stats.gamesPlayed) !== null && _b !== void 0 ? _b : 0) + 1;
        stats.totalWordsPlayed = ((_c = stats.totalWordsPlayed) !== null && _c !== void 0 ? _c : 0) + game.words.length;
        if (!stats.wordScoreFreqs) {
            stats.wordScoreFreqs = {};
        }
        if (!stats.wordLengths) {
            stats.wordLengths = {};
        }
        for (const word of game.words) {
            stats.wordScoreFreqs[word.score] = ((_d = stats.wordScoreFreqs[word.score]) !== null && _d !== void 0 ? _d : 0) + 1;
            const wordLength = word.word.reduce((total, t) => total + t.letter.length, 0);
            stats.wordLengths[wordLength] = ((_e = stats.wordLengths[wordLength]) !== null && _e !== void 0 ? _e : 0) + 1;
        }
        localStorage.setItem('stats', JSON.stringify(stats));
    };
    const saveLocalLeaderboard = (entry) => {
        var _a;
        const localGames = JSON.parse((_a = localStorage.getItem('games')) !== null && _a !== void 0 ? _a : '[]');
        localGames.push(entry);
        localStorage.setItem('games', JSON.stringify(localGames));
    };

    const getTileId = () => Math.random().toString(36).slice(2);
    const initializeGameState = (initialBoard = []) => ({
        startedAt: +new Date(),
        id: v4(),
        board: initialBoard,
        latestWord: undefined,
        highlighted: {},
        intersections: {},
        words: [],
        turn: 0,
        remainingSwaps: 10,
        shuffles: 1,
        streak: 0,
        bestStreak: 0,
        lost: false,
        score: 0,
        latestChain: 0,
        bestChain: 0,
        marquee: undefined,
    });
    const gameState = writable(initializeGameState());
    const makeBoardFromLetters = (letters) => (letters.map(row => row.map(letter => ({
        letter,
        id: getTileId(),
        multiplier: 1,
    }))));
    makeBoardFromLetters([
        ["B", "G", "V", "A", "N", "D", "E"],
        ["A", "T", "C", "H", "O", "A", "A"],
        ["E", "I", "D", "E", "X", "R", "R"],
        ["T", "C", "T", "N", "S", "L", "E"],
        ["C", "I", "F", "E", "F", "E", "I"],
        ["P", "U", "Z", "Z", "L", "A", "O"],
    ]);
    const getUserId = () => {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = v4();
            localStorage.setItem('userId', userId);
        }
        return userId;
    };
    const loadGame = (dictionary) => {
        const game = localStorage.getItem('currGame');
        const prevTurns = localStorage.getItem('currTurns');
        if (game) {
            gameState.set(JSON.parse(game));
        }
        else {
            gameState.set(resetGame(initializeGameState(), dictionary));
        }
        if (prevTurns) {
            turns.set(JSON.parse(prevTurns));
        }
    };
    const saveGame = (game, turns) => {
        localStorage.setItem('currGame', JSON.stringify(game));
        localStorage.setItem('currTurns', JSON.stringify(turns));
    };
    const clearGame = () => {
        localStorage.removeItem('currGame');
        localStorage.removeItem('currTurns');
    };

    const dictionaryFreqs = {
        A: 8.4966,
        B: 2.0720,
        C: 4.5388,
        D: 3.3844,
        E: 11.16078,
        F: 1.8121,
        G: 2.4705,
        H: 3.0034,
        I: 7.5448,
        J: 0.1965,
        K: 1.1016,
        L: 5.4893,
        M: 3.0129,
        N: 6.6544,
        O: 7.1635,
        P: 3.1671,
        Q: 0.1962,
        R: 7.5809,
        S: 5.7351,
        T: 6.9509,
        U: 3.6308,
        V: 1.0074,
        W: 1.2899,
        X: 0.2902,
        Y: 1.7779,
        Z: 0.2722,
    };
    const letterFreqs = dictionaryFreqs;
    const points = {
        A: 1,
        B: 3,
        C: 3,
        D: 2,
        E: 1,
        F: 4,
        G: 2,
        H: 4,
        I: 1,
        J: 8,
        K: 5,
        L: 1,
        M: 3,
        N: 1,
        O: 1,
        P: 3,
        Q: 10,
        R: 1,
        S: 1,
        T: 1,
        U: 1,
        V: 4,
        W: 4,
        X: 8,
        Y: 4,
        Z: 10,
    };
    const multFreqs = {
        1: 92,
        2: 6,
        3: 2,
    };
    const getCDF = (freqs) => {
        const cum = [];
        let sum = 0;
        Object.entries(freqs).forEach(([value, freq]) => {
            sum += freq;
            cum.push([value, sum]);
        });
        return cum;
    };
    const countLetters = (board) => {
        var _a, _b;
        // smooth letter counts to make rare letters less biased
        const letterCounts = Object.fromEntries(Object.keys(letterFreqs).map(l => [l, 1]));
        const multiplierCounts = { 1: 1, 2: 1, 3: 1 };
        let total = 0;
        for (const row of board) {
            for (const tile of row) {
                if (tile) {
                    const { letter, multiplier } = tile;
                    letterCounts[letter] = ((_a = letterCounts[letter]) !== null && _a !== void 0 ? _a : 0) + 1;
                    multiplierCounts[multiplier] = ((_b = multiplierCounts[multiplier]) !== null && _b !== void 0 ? _b : 0) + 1;
                    total++;
                }
            }
        }
        return {
            letterCounts,
            multiplierCounts,
            total,
        };
    };
    // sigmoid parameters
    const K = 0.75;
    const OFFSET = 0.2;
    const sigmoid = (z) => {
        return 1 / (1 + Math.exp(-(z - OFFSET) / K));
    };
    const updateFreqs = (globalFreqs, boardFreqs) => {
        var _a;
        const updatedFreqs = {};
        const total = Object.values(boardFreqs).reduce((a, b) => a + b);
        for (const [value, globalFreq] of Object.entries(globalFreqs)) {
            // frequency as percentage
            const freq = 100 * ((_a = boardFreqs[value]) !== null && _a !== void 0 ? _a : 0) / total;
            const diff = globalFreq - freq;
            const posterior = sigmoid(diff);
            updatedFreqs[value] = posterior;
        }
        return updatedFreqs;
    };
    const sampleCDF = (cum) => {
        const sum = cum.slice(-1)[0][1];
        const sampleWeight = Math.random() * sum;
        for (const [value, weight] of cum) {
            if (weight > sampleWeight) {
                return value;
            }
        }
    };
    const sample = (board, sampleSize, turn = 0) => {
        let freqs;
        let mFreqs;
        if (board.length) {
            const { total, letterCounts, multiplierCounts } = countLetters(board);
            freqs = updateFreqs(letterFreqs, letterCounts);
            // console.log(Object.values(freqs).reduce((a, b) => a + b) / Object.keys(freqs).length);
            // console.log(Object.entries(freqs).sort((a, b) => +b[1] - +a[1]))
            mFreqs = Object.assign({}, multFreqs); //updateFreqs(multFreqs, multiplierCounts, 0.5);
            if (multiplierCounts[2] > 5) {
                mFreqs[2] = 0;
            }
            if (multiplierCounts[3] > 2) {
                mFreqs[3] = 0;
            }
        }
        else {
            freqs = letterFreqs;
            mFreqs = multFreqs;
        }
        const cdf = getCDF(freqs);
        let sampledLetter = sampleCDF(cdf);
        // testing bigrams
        if (Math.random() > Math.max(1 - turn / 200, 0.85)) {
            const bigramCDF = getCDF(bigrams[sampledLetter]);
            sampledLetter = sampleCDF(bigramCDF);
        }
        const mCDF = getCDF(mFreqs);
        const sampledMult = +sampleCDF(mCDF);
        return [freqs, {
                letter: sampledLetter,
                id: getTileId(),
                multiplier: sampledMult,
            }];
    };
    const scoreWord = (match) => {
        let score = 0;
        let multiplier = 1;
        for (const tile of match) {
            score += scoreTile(tile.letter);
            multiplier *= tile.multiplier;
        }
        return score * multiplier;
    };
    const scoreTile = (letter) => {
        let tilePoints = 0;
        for (let i = 0; i < letter.length; i++) {
            tilePoints += points[letter.charAt(i).toUpperCase()];
        }
        return tilePoints;
    };

    // import { stats } from '../Stats.svelte';
    const DIMS = {
        ROWS: 7,
        COLS: 6,
    };
    const resetGame = (game, dictionary) => {
        var _a;
        const prevBoard = game.board;
        game = initializeGameState();
        if (!game.board.length) {
            for (let i = 0; i < DIMS.COLS; i++) {
                game.board.push([]);
                for (let j = 0; j < DIMS.ROWS; j++) {
                    const [, tile] = sample([]);
                    game.board[i].push(tile);
                }
            }
        }
        let { words } = findWords(dictionary, game.board);
        while (words.length) {
            for (const word of words) {
                const a = word.coords[Math.floor(Math.random() * word.word.length)];
                const b = word.coords[Math.floor(Math.random() * word.word.length)];
                const tempTile = game.board[a[0]][a[1]];
                game.board[a[0]][a[1]] = game.board[b[0]][b[1]];
                game.board[b[0]][b[1]] = tempTile;
            }
            words = findWords(dictionary, game.board).words;
        }
        for (const [i, col] of game.board.entries()) {
            for (const [j, row] of col.entries()) {
                // reset multipliers
                game.board[i][j].multiplier = 1;
                const prevTile = (_a = prevBoard === null || prevBoard === void 0 ? void 0 : prevBoard[i]) === null || _a === void 0 ? void 0 : _a[j];
                // keep reference to previous tileId for flip transition
                // TODO consider just having a gameOver specific fallback here
                if (prevTile) {
                    game.board[i][j].id = prevTile.id;
                }
            }
        }
        // start game with 3 2x multipliers
        for (let i = 0; i < 3; i++) {
            const col = Math.floor(Math.random() * DIMS.COLS);
            const row = Math.floor(Math.random() * DIMS.ROWS);
            game.board[col][row].multiplier = 2;
        }
        return game;
    };
    const coordToStr = (c) => c.join(',');
    const findWords = (dictionary, board) => {
        var _a, _b;
        const rows = {};
        const cols = {};
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                for (const axis of ['row', 'col']) {
                    const word = findWord(dictionary, board, i, j, axis);
                    if (word.length) {
                        const coords = word.map((_, offset) => [
                            i + (axis === 'col' ? 0 : offset),
                            j + (axis === 'row' ? 0 : offset),
                        ]);
                        const match = {
                            word,
                            coords,
                            axis,
                            score: scoreWord(word),
                            intersectingIds: [],
                        };
                        if (axis === 'row') {
                            rows[j] = ((_a = rows[j]) !== null && _a !== void 0 ? _a : []).concat([match]);
                        }
                        else {
                            cols[i] = ((_b = cols[i]) !== null && _b !== void 0 ? _b : []).concat([match]);
                        }
                    }
                }
            }
        }
        // eliminate overlapping matches
        removeOverlappingWords(rows);
        removeOverlappingWords(cols);
        const rowWords = Object.values(rows).flat();
        const colWords = Object.values(cols).flat();
        // find intersections
        const intersections = {};
        const intersectingWords = {};
        // loop over cross-product of rows and columns
        for (const [i1, w1] of Object.entries(rowWords)) {
            for (const [i2, w2] of Object.entries(colWords)) {
                const coord = getIntersection(w1, w2);
                if (coord) {
                    const [i, j] = coord;
                    const tile = board[i][j];
                    const intersectingId = getTileId();
                    intersections[intersectingId] = { tile, coord };
                    const tileIdx = w1.word.findIndex(t => t.id === tile.id);
                    w1.word[tileIdx] = Object.assign(Object.assign({}, w1.word[tileIdx]), { id: intersectingId });
                    w1.intersectingIds.push(intersectingId);
                    w2.intersectingIds.push(tile.id);
                    intersectingWords[i1] = w1;
                }
            }
        }
        return {
            words: rowWords.concat(colWords).sort((a, b) => {
                if (a.intersectingIds.length && b.intersectingIds.length) {
                    return a.axis === 'row' ? -1 : 1;
                }
                return a.coords[0][1] - b.coords[0][1];
            }),
            intersections,
        };
    };
    const getIntersection = (w1, w2) => {
        const c1 = w1.coords.map(coordToStr);
        const c2 = w2.coords.map(coordToStr);
        const [intersection] = c1.filter(c => c2.includes(c));
        if (intersection) {
            return intersection.split(',').map(x => parseInt(x));
        }
        else {
            return undefined;
        }
    };
    const removeOverlappingWords = (axis) => {
        // eliminate overlapping matches
        const filteredWords = [];
        for (const [idx, words] of Object.entries(axis)) {
            for (const [i1, w1] of Object.entries(words)) {
                for (const [i2, w2] of Object.entries(words).slice(+i1 + 1)) {
                    if (getIntersection(w1, w2)) {
                        if (w1.word.length > w2.word.length) {
                            filteredWords.push(+i2);
                        }
                        else {
                            filteredWords.push(+i1);
                        }
                    }
                }
            }
            axis[idx] = words.filter((w, i) => !filteredWords.includes(i));
        }
    };
    const findWord = (dictionary, board, i, j, axis) => {
        const firstTile = board[i][j];
        const firstLetter = firstTile.letter.toLowerCase();
        let currWord = [firstTile];
        let longestWord = [];
        let node = dictionary.getNode(firstLetter);
        // scan rows
        const [start, end] = axis === 'row'
            ? [i, board.length]
            : [j, board[0].length];
        for (let k = start + 1; k < end && node; k++) {
            const nextTile = board[axis === 'row' ? k : i][axis === 'col' ? k : j];
            const nextLetter = nextTile.letter.toLowerCase();
            currWord.push(nextTile);
            node = node.children.get(nextLetter.charAt(0));
            if (node && nextLetter.length > 1) {
                node = node.children.get(nextLetter.charAt(1));
            }
            if (node === null || node === void 0 ? void 0 : node.terminal) {
                longestWord = [...currWord];
            }
        }
        return longestWord;
    };
    const removeLetters = (board, turn, coords) => {
        // clear column
        for (const [x, y] of coords) {
            board[x][y] = undefined;
        }
        const cleared = board.map(col => (col.reverse()
            .filter(tile => tile != undefined)));
        let newLetters = [];
        for (let i = 0; i < DIMS.COLS; i++) {
            for (let j = 0; j < DIMS.ROWS; j++) {
                if (cleared[i][j] == undefined) {
                    const [stats, tile] = sample(cleared, 1, turn);
                    cleared[i][j] = tile;
                    newLetters.push(tile.letter);
                }
            }
        }
        // stats.set({ freqs, newLetters })
        return cleared.map(col => col.reverse());
    };
    const getMarqueeText = (match, chain) => {
        if (match.score >= 50 || chain >= 5) {
            return '🎆 UNBELIEVABLE!';
        }
        else if (match.score >= 40 || chain === 4 || match.word.length === 8) {
            return '🎉 INCREDIBLE!';
        }
        else if (match.score >= 30 || chain === 3 || match.word.length === 7 || match.intersection) {
            return '🎊 IMPRESSIVE!';
        }
        else if (match.score >= 20 || chain === 2 || match.word.length === 6) {
            return '✨ WOW!';
        }
        else if (match.score >= 10 || chain === 1 || match.word.length === 5) {
            return '👍 NICE!';
        }
    };

    /* node_modules\svelte-material-icons\Flash.svelte generated by Svelte v3.46.6 */

    const file$S = "node_modules\\svelte-material-icons\\Flash.svelte";

    function create_fragment$Y(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M7,2V13H10V22L17,10H13L17,2H7Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$S, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$S, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Flash', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Flash> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Flash extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$Y, create_fragment$Y, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Flash",
    			options,
    			id: create_fragment$Y.name
    		});
    	}

    	get size() {
    		throw new Error("<Flash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Flash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Flash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Flash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Flash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Flash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Flash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Flash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Flash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Flash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Pill.svelte generated by Svelte v3.46.6 */
    const file$R = "src\\components\\Pill.svelte";

    // (23:2) {#key value}
    function create_key_block$6(ctx) {
    	let div;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*value*/ ctx[0]);
    			attr_dev(div, "class", "text svelte-1xkxutm");
    			add_location(div, file$R, 23, 4, 464);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*value*/ 1) set_data_dev(t, /*value*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fly, { y: 20 * /*direction*/ ctx[4] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fly, { y: -20 * /*direction*/ ctx[4] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$6.name,
    		type: "key",
    		source: "(23:2) {#key value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$X(ctx) {
    	let div;
    	let previous_key = /*value*/ ctx[0];
    	let t;
    	let div_class_value;
    	let div_style_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let key_block = create_key_block$6(ctx);
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			key_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(`pill ${/*large*/ ctx[1] ? 'large' : ''}`) + " svelte-1xkxutm"));

    			attr_dev(div, "style", div_style_value = `
    background-color: ${/*backgroundColor*/ ctx[3]};
    color: ${/*color*/ ctx[2]};
  `);

    			add_location(div, file$R, 13, 0, 287);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			key_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1 && safe_not_equal(previous_key, previous_key = /*value*/ ctx[0])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$2);
    				check_outros();
    				key_block = create_key_block$6(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(div, t);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*large*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(`pill ${/*large*/ ctx[1] ? 'large' : ''}`) + " svelte-1xkxutm"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*backgroundColor, color*/ 12 && div_style_value !== (div_style_value = `
    background-color: ${/*backgroundColor*/ ctx[3]};
    color: ${/*color*/ ctx[2]};
  `)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			key_block.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$X.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$X($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pill', slots, ['default']);
    	let { value } = $$props;
    	let { large = undefined } = $$props;
    	let prevValue;
    	let direction;
    	let { color } = $$props;
    	let { backgroundColor } = $$props;
    	const writable_props = ['value', 'large', 'color', 'backgroundColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pill> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('large' in $$props) $$invalidate(1, large = $$props.large);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('backgroundColor' in $$props) $$invalidate(3, backgroundColor = $$props.backgroundColor);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		value,
    		large,
    		prevValue,
    		direction,
    		color,
    		backgroundColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('large' in $$props) $$invalidate(1, large = $$props.large);
    		if ('prevValue' in $$props) $$invalidate(5, prevValue = $$props.prevValue);
    		if ('direction' in $$props) $$invalidate(4, direction = $$props.direction);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('backgroundColor' in $$props) $$invalidate(3, backgroundColor = $$props.backgroundColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*prevValue, value*/ 33) {
    			{
    				$$invalidate(4, direction = prevValue < value ? 1 : -1);
    				$$invalidate(5, prevValue = value);
    			}
    		}
    	};

    	return [value, large, color, backgroundColor, direction, prevValue, $$scope, slots];
    }

    class Pill extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$X, create_fragment$X, safe_not_equal, {
    			value: 0,
    			large: 1,
    			color: 2,
    			backgroundColor: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pill",
    			options,
    			id: create_fragment$X.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<Pill> was created without expected prop 'value'");
    		}

    		if (/*color*/ ctx[2] === undefined && !('color' in props)) {
    			console.warn("<Pill> was created without expected prop 'color'");
    		}

    		if (/*backgroundColor*/ ctx[3] === undefined && !('backgroundColor' in props)) {
    			console.warn("<Pill> was created without expected prop 'backgroundColor'");
    		}
    	}

    	get value() {
    		throw new Error("<Pill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Pill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get large() {
    		throw new Error("<Pill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set large(value) {
    		throw new Error("<Pill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Pill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Pill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundColor() {
    		throw new Error("<Pill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundColor(value) {
    		throw new Error("<Pill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function colors(specifier) {
      var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
      while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
      return colors;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
        reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
        reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
        reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
        reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
        reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHex8: color_formatHex8,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHex8() {
      return this.rgb().formatHex8();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
      },
      displayable() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatHex8: rgb_formatHex8,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
    }

    function rgb_formatHex8() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
    }

    function rgb_formatRgb() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
    }

    function clampa(opacity) {
      return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
    }

    function clampi(value) {
      return Math.max(0, Math.min(255, Math.round(value) || 0));
    }

    function hex(value) {
      value = clampi(value);
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      clamp() {
        return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
      },
      displayable() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl() {
        const a = clampa(this.opacity);
        return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
      }
    }));

    function clamph(value) {
      value = (value || 0) % 360;
      return value < 0 ? value + 360 : value;
    }

    function clampt(value) {
      return Math.max(0, Math.min(1, value || 0));
    }

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    function basis(t1, v0, v1, v2, v3) {
      var t2 = t1 * t1, t3 = t2 * t1;
      return ((1 - 3 * t1 + 3 * t2 - t3) * v0
          + (4 - 6 * t2 + 3 * t3) * v1
          + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
          + t3 * v3) / 6;
    }

    function basis$1(values) {
      var n = values.length - 1;
      return function(t) {
        var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
            v1 = values[i],
            v2 = values[i + 1],
            v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
            v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
        return basis((t - i / n) * n, v0, v1, v2, v3);
      };
    }

    function rgbSpline(spline) {
      return function(colors) {
        var n = colors.length,
            r = new Array(n),
            g = new Array(n),
            b = new Array(n),
            i, color;
        for (i = 0; i < n; ++i) {
          color = rgb(colors[i]);
          r[i] = color.r || 0;
          g[i] = color.g || 0;
          b[i] = color.b || 0;
        }
        r = spline(r);
        g = spline(g);
        b = spline(b);
        color.opacity = 1;
        return function(t) {
          color.r = r(t);
          color.g = g(t);
          color.b = b(t);
          return color + "";
        };
      };
    }

    var rgbBasis = rgbSpline(basis$1);

    var ramp = scheme => rgbBasis(scheme[scheme.length - 1]);

    var scheme = new Array(3).concat(
      "fc8d59ffffbf99d594",
      "d7191cfdae61abdda42b83ba",
      "d7191cfdae61ffffbfabdda42b83ba",
      "d53e4ffc8d59fee08be6f59899d5943288bd",
      "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
      "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
      "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
      "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
      "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
    ).map(colors);

    ramp(scheme);

    /* src\pills\WordChain.svelte generated by Svelte v3.46.6 */

    // (9:0) {#if chain > 0}
    function create_if_block$k(ctx) {
    	let pill;
    	let current;

    	pill = new Pill({
    			props: {
    				value: /*chain*/ ctx[0] + 1,
    				color: "black",
    				backgroundColor: "#FFFF00",
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pill.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pill, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pill_changes = {};
    			if (dirty & /*chain*/ 1) pill_changes.value = /*chain*/ ctx[0] + 1;

    			if (dirty & /*$$scope*/ 8) {
    				pill_changes.$$scope = { dirty, ctx };
    			}

    			pill.$set(pill_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pill.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pill.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pill, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(9:0) {#if chain > 0}",
    		ctx
    	});

    	return block;
    }

    // (10:2) <Pill      value={chain + 1}      color='black'      backgroundColor='#FFFF00'    >
    function create_default_slot$g(ctx) {
    	let flash;
    	let current;
    	flash = new Flash({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(flash.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flash, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flash.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flash.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flash, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(10:2) <Pill      value={chain + 1}      color='black'      backgroundColor='#FFFF00'    >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$W(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*chain*/ ctx[0] > 0 && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*chain*/ ctx[0] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*chain*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$k(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$W.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$W($$self, $$props, $$invalidate) {
    	let backgroundColor;
    	let color;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WordChain', slots, []);
    	let { chain } = $$props;
    	const writable_props = ['chain'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WordChain> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('chain' in $$props) $$invalidate(0, chain = $$props.chain);
    	};

    	$$self.$capture_state = () => ({
    		Flash,
    		Pill,
    		schemeSpectral: scheme,
    		chain,
    		color,
    		backgroundColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('chain' in $$props) $$invalidate(0, chain = $$props.chain);
    		if ('color' in $$props) color = $$props.color;
    		if ('backgroundColor' in $$props) backgroundColor = $$props.backgroundColor;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*chain*/ 1) {
    			backgroundColor = scheme[11][Math.min(Math.round(chain), 10)];
    		}

    		if ($$self.$$.dirty & /*chain*/ 1) {
    			color = 3 < chain && chain < 8 ? 'black' : 'white';
    		}
    	};

    	return [chain];
    }

    class WordChain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$W, create_fragment$W, safe_not_equal, { chain: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WordChain",
    			options,
    			id: create_fragment$W.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*chain*/ ctx[0] === undefined && !('chain' in props)) {
    			console.warn("<WordChain> was created without expected prop 'chain'");
    		}
    	}

    	get chain() {
    		throw new Error("<WordChain>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chain(value) {
    		throw new Error("<WordChain>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\Autorenew.svelte generated by Svelte v3.46.6 */

    const file$Q = "node_modules\\svelte-material-icons\\Autorenew.svelte";

    function create_fragment$V(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$Q, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$Q, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$V.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$V($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Autorenew', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Autorenew> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Autorenew extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$V, create_fragment$V, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Autorenew",
    			options,
    			id: create_fragment$V.name
    		});
    	}

    	get size() {
    		throw new Error("<Autorenew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Autorenew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Autorenew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Autorenew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Autorenew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Autorenew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Autorenew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Autorenew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Autorenew>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Autorenew>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const getMajorAxis = () => {
        if (document.body.clientHeight / document.body.clientWidth > 16 / 9) {
            return document.body.clientWidth;
        }
        else {
            return document.body.clientHeight;
        }
    };
    const getTileSize = () => {
        const boardSize = document.querySelector('.board').getBoundingClientRect();
        const tileSize = boardSize.width / 6;
        return tileSize;
    };
    const flipDuration = (len) => animationDuration * Math.sqrt(len / getMajorAxis());
    const [send, receive] = crossfade({
        duration: flipDuration,
        easing: quadOut,
        fallback: (node, params, intro) => (fly(node, {
            y: intro ? -getTileSize() : 0,
            x: intro ? 0 : 100,
            duration: animationDuration,
            easing: intro ? quadIn : quadOut
        }))
    });
    const flyIn = (node, { y = 20, duration = 500, delay = 0, }) => ({
        duration,
        delay,
        easing: quintOut,
        css: (t) => `transform: translateY(${t * y}px); transform: scale(${t})`,
    });
    const animationDuration = 750;
    const delay = async (t) => new Promise(resolve => setTimeout(resolve, t));
    const flipOver = (node, { delay = 0, duration = 500, shouldFlip = false, }) => {
        if (!shouldFlip)
            return {};
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        return {
            delay,
            duration,
            easing: quadIn,
            css: (t, u) => `
      transform: ${transform} rotateY(${u * 90}deg);
    `
        };
    };
    const flipOut = (node, { delay = 0, duration = 500, shouldFlip = false, }) => {
        if (!shouldFlip)
            return {};
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        return {
            delay,
            duration,
            easing: quadOut,
            css: (t, u) => `
      transform: ${transform} rotateY(${1 - (u * 90)}deg);
    `
        };
    };
    const getBBoxJSON = () => {
        var _a;
        return (JSON.stringify((_a = document.querySelector('.large.selected')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()));
    };

    /* src\Swaps.svelte generated by Svelte v3.46.6 */

    // (45:2) {#key swaps}
    function create_key_block$5(ctx) {
    	let autorenew;
    	let current;
    	autorenew = new Autorenew({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(autorenew.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(autorenew, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(autorenew.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(autorenew.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(autorenew, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$5.name,
    		type: "key",
    		source: "(45:2) {#key swaps}",
    		ctx
    	});

    	return block;
    }

    // (39:0) <Pill    large    value={Math.max(swaps, 0)}    color={getSwapLevel(swaps)[0]}    backgroundColor={getSwapLevel(swaps)[1]}  >
    function create_default_slot$f(ctx) {
    	/*swaps*/ ctx[0];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block$5(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(39:0) <Pill    large    value={Math.max(swaps, 0)}    color={getSwapLevel(swaps)[0]}    backgroundColor={getSwapLevel(swaps)[1]}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$U(ctx) {
    	let t;
    	let pill;
    	let current;
    	let if_block = false ;

    	pill = new Pill({
    			props: {
    				large: true,
    				value: Math.max(/*swaps*/ ctx[0], 0),
    				color: /*getSwapLevel*/ ctx[2](/*swaps*/ ctx[0])[0],
    				backgroundColor: /*getSwapLevel*/ ctx[2](/*swaps*/ ctx[0])[1],
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t = space();
    			create_component(pill.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(pill, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const pill_changes = {};
    			if (dirty & /*swaps*/ 1) pill_changes.value = Math.max(/*swaps*/ ctx[0], 0);
    			if (dirty & /*swaps*/ 1) pill_changes.color = /*getSwapLevel*/ ctx[2](/*swaps*/ ctx[0])[0];
    			if (dirty & /*swaps*/ 1) pill_changes.backgroundColor = /*getSwapLevel*/ ctx[2](/*swaps*/ ctx[0])[1];

    			if (dirty & /*$$scope*/ 16) {
    				pill_changes.$$scope = { dirty, ctx };
    			}

    			pill.$set(pill_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(pill.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(pill.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(pill, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$U.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$U($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Swaps', slots, []);
    	let { swaps } = $$props;
    	let prevSwaps;
    	let diff;

    	const getSwapLevel = swaps => {
    		if (swaps < 3) return ['white', '#b71c1c']; else if (swaps < 5) return ['white', '#e65100']; else if (swaps < 8) return ['black', '#fbc02d']; else if (swaps < 11) return ['white', '#33691e']; else if (swaps < 14) return ['white', '#01579b']; else if (swaps < 17) return ['white', '#311b92']; else return ['white', '#C2185B'];
    	};

    	const writable_props = ['swaps'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Swaps> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('swaps' in $$props) $$invalidate(0, swaps = $$props.swaps);
    	};

    	$$self.$capture_state = () => ({
    		Autorenew,
    		Pill,
    		swaps,
    		prevSwaps,
    		diff,
    		getSwapLevel
    	});

    	$$self.$inject_state = $$props => {
    		if ('swaps' in $$props) $$invalidate(0, swaps = $$props.swaps);
    		if ('prevSwaps' in $$props) $$invalidate(3, prevSwaps = $$props.prevSwaps);
    		if ('diff' in $$props) $$invalidate(1, diff = $$props.diff);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*swaps, prevSwaps*/ 9) {
    			{
    				$$invalidate(1, diff = swaps - prevSwaps);
    				$$invalidate(3, prevSwaps = swaps);
    			}
    		}
    	};

    	return [swaps, diff, getSwapLevel, prevSwaps];
    }

    class Swaps extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$U, create_fragment$U, safe_not_equal, { swaps: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Swaps",
    			options,
    			id: create_fragment$U.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*swaps*/ ctx[0] === undefined && !('swaps' in props)) {
    			console.warn("<Swaps> was created without expected prop 'swaps'");
    		}
    	}

    	get swaps() {
    		throw new Error("<Swaps>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set swaps(value) {
    		throw new Error("<Swaps>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\Fire.svelte generated by Svelte v3.46.6 */

    const file$P = "node_modules\\svelte-material-icons\\Fire.svelte";

    function create_fragment$T(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$P, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$P, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$T.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$T($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fire', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Fire> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Fire extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$T, create_fragment$T, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fire",
    			options,
    			id: create_fragment$T.name
    		});
    	}

    	get size() {
    		throw new Error("<Fire>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Fire>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Fire>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Fire>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Fire>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Fire>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Fire>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Fire>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Fire>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Fire>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pills\Streak.svelte generated by Svelte v3.46.6 */

    // (9:0) {#if streak > 0}
    function create_if_block$j(ctx) {
    	let pill;
    	let current;

    	pill = new Pill({
    			props: {
    				color: "black",
    				backgroundColor: "#FFB74D",
    				value: /*streak*/ ctx[0],
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pill.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pill, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pill_changes = {};
    			if (dirty & /*streak*/ 1) pill_changes.value = /*streak*/ ctx[0];

    			if (dirty & /*$$scope*/ 8) {
    				pill_changes.$$scope = { dirty, ctx };
    			}

    			pill.$set(pill_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pill.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pill.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pill, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(9:0) {#if streak > 0}",
    		ctx
    	});

    	return block;
    }

    // (10:2) <Pill      color='black'      backgroundColor='#FFB74D'      value={streak}    >
    function create_default_slot$e(ctx) {
    	let hot;
    	let current;
    	hot = new Fire({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(hot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hot, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(10:2) <Pill      color='black'      backgroundColor='#FFB74D'      value={streak}    >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$S(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*streak*/ ctx[0] > 0 && create_if_block$j(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*streak*/ ctx[0] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*streak*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$j(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$S($$self, $$props, $$invalidate) {
    	let backgroundColor;
    	let color;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Streak', slots, []);
    	let { streak } = $$props;
    	const writable_props = ['streak'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Streak> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('streak' in $$props) $$invalidate(0, streak = $$props.streak);
    	};

    	$$self.$capture_state = () => ({
    		Hot: Fire,
    		schemeSpectral: scheme,
    		Pill,
    		streak,
    		color,
    		backgroundColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('streak' in $$props) $$invalidate(0, streak = $$props.streak);
    		if ('color' in $$props) color = $$props.color;
    		if ('backgroundColor' in $$props) backgroundColor = $$props.backgroundColor;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*streak*/ 1) {
    			backgroundColor = scheme[11][Math.min(Math.round(streak / 2), 10)];
    		}

    		if ($$self.$$.dirty & /*streak*/ 1) {
    			color = 6 < streak && streak < 15 ? 'black' : 'white';
    		}
    	};

    	return [streak];
    }

    class Streak extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$S, create_fragment$S, safe_not_equal, { streak: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Streak",
    			options,
    			id: create_fragment$S.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*streak*/ ctx[0] === undefined && !('streak' in props)) {
    			console.warn("<Streak> was created without expected prop 'streak'");
    		}
    	}

    	get streak() {
    		throw new Error("<Streak>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set streak(value) {
    		throw new Error("<Streak>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\ContentCopy.svelte generated by Svelte v3.46.6 */

    const file$O = "node_modules\\svelte-material-icons\\ContentCopy.svelte";

    function create_fragment$R(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$O, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$O, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentCopy', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContentCopy> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class ContentCopy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$R, create_fragment$R, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentCopy",
    			options,
    			id: create_fragment$R.name
    		});
    	}

    	get size() {
    		throw new Error("<ContentCopy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ContentCopy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<ContentCopy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<ContentCopy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<ContentCopy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<ContentCopy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<ContentCopy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ContentCopy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<ContentCopy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<ContentCopy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\ContentPaste.svelte generated by Svelte v3.46.6 */

    const file$N = "node_modules\\svelte-material-icons\\ContentPaste.svelte";

    function create_fragment$Q(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$N, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$N, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentPaste', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContentPaste> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class ContentPaste extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentPaste",
    			options,
    			id: create_fragment$Q.name
    		});
    	}

    	get size() {
    		throw new Error("<ContentPaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ContentPaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<ContentPaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<ContentPaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<ContentPaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<ContentPaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<ContentPaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ContentPaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<ContentPaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<ContentPaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\Restart.svelte generated by Svelte v3.46.6 */

    const file$M = "node_modules\\svelte-material-icons\\Restart.svelte";

    function create_fragment$P(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$M, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$M, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Restart', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Restart> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Restart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$P, create_fragment$P, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Restart",
    			options,
    			id: create_fragment$P.name
    		});
    	}

    	get size() {
    		throw new Error("<Restart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Restart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Restart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Restart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Restart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Restart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Restart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Restart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Restart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Restart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Modal.svelte generated by Svelte v3.46.6 */
    const file$L = "src\\components\\Modal.svelte";
    const get_controls_slot_changes = dirty => ({});
    const get_controls_slot_context = ctx => ({});
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (9:0) {#if open}
    function create_if_block$i(ctx) {
    	let div;
    	let previous_key = /*open*/ ctx[3];
    	let current;
    	let mounted;
    	let dispose;
    	let key_block = create_key_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			key_block.c();
    			attr_dev(div, "class", "container svelte-jpxcdx");
    			toggle_class(div, "visible", /*open*/ ctx[3]);
    			add_location(div, file$L, 9, 2, 211);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			key_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					self$1(function () {
    						if (is_function(/*onClose*/ ctx[4])) /*onClose*/ ctx[4].apply(this, arguments);
    					}),
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*open*/ 8 && safe_not_equal(previous_key, previous_key = /*open*/ ctx[3])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$2);
    				check_outros();
    				key_block = create_key_block$4(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(div, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (dirty & /*open*/ 8) {
    				toggle_class(div, "visible", /*open*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			key_block.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(9:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#key open}
    function create_key_block$4(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let t1;
    	let div3;
    	let div4_intro;
    	let div4_outro;
    	let current;
    	const title_slot_template = /*#slots*/ ctx[6].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[5], get_title_slot_context);
    	const content_slot_template = /*#slots*/ ctx[6].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[5], get_content_slot_context);
    	const controls_slot_template = /*#slots*/ ctx[6].controls;
    	const controls_slot = create_slot(controls_slot_template, ctx, /*$$scope*/ ctx[5], get_controls_slot_context);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			if (title_slot) title_slot.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			if (content_slot) content_slot.c();
    			t1 = space();
    			div3 = element("div");
    			if (controls_slot) controls_slot.c();
    			attr_dev(div0, "class", "title svelte-jpxcdx");
    			add_location(div0, file$L, 23, 8, 545);
    			attr_dev(div1, "class", "scroll-container-inner svelte-jpxcdx");
    			add_location(div1, file$L, 27, 10, 658);
    			attr_dev(div2, "class", "scroll-container svelte-jpxcdx");
    			add_location(div2, file$L, 26, 8, 618);
    			attr_dev(div3, "class", "controls svelte-jpxcdx");
    			add_location(div3, file$L, 31, 8, 770);
    			attr_dev(div4, "id", /*id*/ ctx[0]);
    			attr_dev(div4, "class", "panel svelte-jpxcdx");
    			toggle_class(div4, "index-2", /*index*/ ctx[2] === 2);
    			toggle_class(div4, "full-height", /*fullHeight*/ ctx[1]);
    			add_location(div4, file$L, 15, 6, 321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);

    			if (title_slot) {
    				title_slot.m(div0, null);
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div1);

    			if (content_slot) {
    				content_slot.m(div1, null);
    			}

    			append_dev(div4, t1);
    			append_dev(div4, div3);

    			if (controls_slot) {
    				controls_slot.m(div3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[5], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			}

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[5], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}

    			if (controls_slot) {
    				if (controls_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						controls_slot,
    						controls_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(controls_slot_template, /*$$scope*/ ctx[5], dirty, get_controls_slot_changes),
    						get_controls_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 1) {
    				attr_dev(div4, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*index*/ 4) {
    				toggle_class(div4, "index-2", /*index*/ ctx[2] === 2);
    			}

    			if (dirty & /*fullHeight*/ 2) {
    				toggle_class(div4, "full-height", /*fullHeight*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot, local);
    			transition_in(content_slot, local);
    			transition_in(controls_slot, local);

    			add_render_callback(() => {
    				if (div4_outro) div4_outro.end(1);
    				div4_intro = create_in_transition(div4, fly, { y: 100, duration: 250 });
    				div4_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot, local);
    			transition_out(content_slot, local);
    			transition_out(controls_slot, local);
    			if (div4_intro) div4_intro.invalidate();
    			div4_outro = create_out_transition(div4, fly, { y: 100, duration: 250 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (title_slot) title_slot.d(detaching);
    			if (content_slot) content_slot.d(detaching);
    			if (controls_slot) controls_slot.d(detaching);
    			if (detaching && div4_outro) div4_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$4.name,
    		type: "key",
    		source: "(15:4) {#key open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$O(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[3] && create_if_block$i(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['title','content','controls']);
    	let { id = undefined } = $$props;
    	let { fullHeight = false } = $$props;
    	let { index = 1 } = $$props;
    	let { open } = $$props;
    	let { onClose } = $$props;
    	const writable_props = ['id', 'fullHeight', 'index', 'open', 'onClose'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('fullHeight' in $$props) $$invalidate(1, fullHeight = $$props.fullHeight);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    		if ('open' in $$props) $$invalidate(3, open = $$props.open);
    		if ('onClose' in $$props) $$invalidate(4, onClose = $$props.onClose);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		id,
    		fullHeight,
    		index,
    		open,
    		onClose
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('fullHeight' in $$props) $$invalidate(1, fullHeight = $$props.fullHeight);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    		if ('open' in $$props) $$invalidate(3, open = $$props.open);
    		if ('onClose' in $$props) $$invalidate(4, onClose = $$props.onClose);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, fullHeight, index, open, onClose, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$O, create_fragment$O, safe_not_equal, {
    			id: 0,
    			fullHeight: 1,
    			index: 2,
    			open: 3,
    			onClose: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$O.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*open*/ ctx[3] === undefined && !('open' in props)) {
    			console.warn("<Modal> was created without expected prop 'open'");
    		}

    		if (/*onClose*/ ctx[4] === undefined && !('onClose' in props)) {
    			console.warn("<Modal> was created without expected prop 'onClose'");
    		}
    	}

    	get id() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullHeight() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullHeight(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ActionButton.svelte generated by Svelte v3.46.6 */

    const file$K = "src\\components\\ActionButton.svelte";

    // (15:0) {:else}
    function create_else_block$9(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "type", /*type*/ ctx[2]);
    			button.disabled = /*disabled*/ ctx[1];
    			attr_dev(button, "form", /*form*/ ctx[3]);
    			attr_dev(button, "class", "action svelte-cbz2ff");
    			add_location(button, file$K, 15, 2, 274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[0])) /*onClick*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 4) {
    				attr_dev(button, "type", /*type*/ ctx[2]);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}

    			if (!current || dirty & /*form*/ 8) {
    				attr_dev(button, "form", /*form*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if href}
    function create_if_block$h(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*href*/ ctx[4]);
    			attr_dev(a, "class", "action svelte-cbz2ff");
    			add_location(a, file$K, 8, 2, 202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*href*/ 16) {
    				attr_dev(a, "href", /*href*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(8:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$N(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$h, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ActionButton', slots, ['default']);
    	let { onClick = undefined } = $$props;
    	let { disabled = undefined } = $$props;
    	let { type = undefined } = $$props;
    	let { form = undefined } = $$props;
    	let { href = undefined } = $$props;
    	const writable_props = ['onClick', 'disabled', 'type', 'form', 'href'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ActionButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('form' in $$props) $$invalidate(3, form = $$props.form);
    		if ('href' in $$props) $$invalidate(4, href = $$props.href);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onClick, disabled, type, form, href });

    	$$self.$inject_state = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('form' in $$props) $$invalidate(3, form = $$props.form);
    		if ('href' in $$props) $$invalidate(4, href = $$props.href);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClick, disabled, type, form, href, $$scope, slots];
    }

    class ActionButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$N, create_fragment$N, safe_not_equal, {
    			onClick: 0,
    			disabled: 1,
    			type: 2,
    			form: 3,
    			href: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActionButton",
    			options,
    			id: create_fragment$N.name
    		});
    	}

    	get onClick() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const loadLeaderboard = async (from = undefined, direction = 'desc') => {
        let q = supabase
            .from('leaderboard')
            .select('*')
            .order('score', { ascending: direction === 'asc' })
            .limit(10);
        if (from === null || from === void 0 ? void 0 : from.id) {
            q = q.neq('id', from.id);
            if (direction === 'asc') {
                q = q.gte('score', from.score);
            }
            else {
                q = q.lte('score', from.score);
            }
        }
        const { data } = await q;
        return data !== null && data !== void 0 ? data : [];
    };
    const loadLocalLeaderboard = () => {
        var _a;
        // load local
        if (localStorage.getItem('updated') !== 'true') {
            localStorage.removeItem('games');
            localStorage.setItem('updated', 'true');
        }
        const games = (_a = JSON.parse(localStorage.getItem('games'))) !== null && _a !== void 0 ? _a : [];
        return games
            .filter(g => g.score)
            .map(g => {
            var _a, _b;
            return (Object.assign(Object.assign({}, g), { id: g.gameId, userName: (_a = g.userName) !== null && _a !== void 0 ? _a : g.name, numTurns: (_b = g.numTurns) !== null && _b !== void 0 ? _b : g.turns }));
        })
            .sort((a, b) => b.score - a.score)
            .slice(0, 50);
    };
    const submitScore = async (game) => {
        var _a, _b;
        const words = game.words.sort((a, b) => b.score - a.score);
        const name = localStorage.getItem('name') || '';
        const date = new Date();
        const response = await supabase.from('leaderboard')
            .insert({
            id: game.id,
            userId: getUserId(),
            gameId: game.id,
            userName: name,
            score: game.score,
            bestStreak: game.bestStreak,
            bestChain: game.bestChain,
            bestWord: (_b = (_a = words[0]) === null || _a === void 0 ? void 0 : _a.word) !== null && _b !== void 0 ? _b : [],
            numWords: game.words.length,
            numTurns: game.turn,
            date: date.toISOString(),
        });
        return response.data[0];
    };

    /* node_modules\svelte-material-icons\Close.svelte generated by Svelte v3.46.6 */

    const file$J = "node_modules\\svelte-material-icons\\Close.svelte";

    function create_fragment$M(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$J, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$J, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Close> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Close extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$M, create_fragment$M, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close",
    			options,
    			id: create_fragment$M.name
    		});
    	}

    	get size() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\tabs\Tabs.svelte generated by Svelte v3.46.6 */
    const file$I = "src\\components\\tabs\\Tabs.svelte";

    function create_fragment$L(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tabs");
    			add_location(div, file$I, 39, 0, 1405);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TABS = {};

    function instance$L($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, ['default']);
    	const tabs = [];
    	const panels = [];
    	const selectedTab = writable(null);
    	const selectedPanel = writable(null);

    	setContext(TABS, {
    		registerTab: tab => {
    			tabs.push(tab);
    			selectedTab.update(current => current !== null && current !== void 0 ? current : tab);

    			onDestroy(() => {
    				const i = tabs.indexOf(tab);
    				tabs.splice(i, 1);

    				selectedTab.update(current => {
    					var _a;

    					return current === tab
    					? (_a = tabs[i]) !== null && _a !== void 0
    						? _a
    						: tabs[tabs.length - 1]
    					: current;
    				});
    			});
    		},
    		registerPanel: panel => {
    			panels.push(panel);
    			selectedPanel.update(current => current !== null && current !== void 0 ? current : panel);

    			onDestroy(() => {
    				const i = panels.indexOf(panel);
    				panels.splice(i, 1);

    				selectedPanel.update(current => {
    					var _a;

    					return current === panel
    					? (_a = panels[i]) !== null && _a !== void 0
    						? _a
    						: panels[panels.length - 1]
    					: current;
    				});
    			});
    		},
    		selectTab: tab => {
    			const i = tabs.indexOf(tab);
    			selectedTab.set(tab);
    			selectedPanel.set(panels[i]);
    		},
    		selectedTab,
    		selectedPanel
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		TABS,
    		setContext,
    		onDestroy,
    		writable,
    		tabs,
    		panels,
    		selectedTab,
    		selectedPanel
    	});

    	return [$$scope, slots];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$L.name
    		});
    	}
    }

    /* src\components\tabs\TabList.svelte generated by Svelte v3.46.6 */

    const file$H = "src\\components\\tabs\\TabList.svelte";

    function create_fragment$K(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tab-list svelte-js0hq1");
    			add_location(div, file$H, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabList', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TabList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabList",
    			options,
    			id: create_fragment$K.name
    		});
    	}
    }

    /* src\components\tabs\TabPanel.svelte generated by Svelte v3.46.6 */
    const file$G = "src\\components\\tabs\\TabPanel.svelte";

    // (10:1) {#if $selectedPanel === idx}
    function create_if_block$g(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tab-panel");
    			add_location(div, file$G, 10, 2, 293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				div_intro = create_in_transition(div, fly, {
    					x: (/*selectedPanel*/ ctx[2] < /*idx*/ ctx[0] ? -1 : 1) * 480,
    					duration: 250
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, fly, {
    				x: (/*selectedPanel*/ ctx[2] > /*idx*/ ctx[0] ? -1 : 1) * 480,
    				duration: 250
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(10:1) {#if $selectedPanel === idx}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#key idx}
    function create_key_block$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$selectedPanel*/ ctx[1] === /*idx*/ ctx[0] && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$selectedPanel*/ ctx[1] === /*idx*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$selectedPanel, idx*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$3.name,
    		type: "key",
    		source: "(9:0) {#key idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$J(ctx) {
    	let previous_key = /*idx*/ ctx[0];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block$3(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*idx*/ 1 && safe_not_equal(previous_key, previous_key = /*idx*/ ctx[0])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$2);
    				check_outros();
    				key_block = create_key_block$3(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let $selectedPanel;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabPanel', slots, ['default']);
    	let { idx } = $$props;
    	const { registerPanel, selectedPanel } = getContext(TABS);
    	validate_store(selectedPanel, 'selectedPanel');
    	component_subscribe($$self, selectedPanel, value => $$invalidate(1, $selectedPanel = value));
    	registerPanel(idx);
    	const writable_props = ['idx'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabPanel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		getContext,
    		TABS,
    		idx,
    		registerPanel,
    		selectedPanel,
    		$selectedPanel
    	});

    	$$self.$inject_state = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [idx, $selectedPanel, selectedPanel, $$scope, slots];
    }

    class TabPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, { idx: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPanel",
    			options,
    			id: create_fragment$J.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*idx*/ ctx[0] === undefined && !('idx' in props)) {
    			console.warn("<TabPanel> was created without expected prop 'idx'");
    		}
    	}

    	get idx() {
    		throw new Error("<TabPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idx(value) {
    		throw new Error("<TabPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\tabs\Tab.svelte generated by Svelte v3.46.6 */
    const file$F = "src\\components\\tabs\\Tab.svelte";

    function create_fragment$I(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "svelte-10idsgf");
    			toggle_class(button, "selected", /*$selectedTab*/ ctx[1] === /*idx*/ ctx[0]);
    			add_location(button, file$F, 31, 0, 590);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*$selectedTab, idx*/ 3) {
    				toggle_class(button, "selected", /*$selectedTab*/ ctx[1] === /*idx*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let $selectedTab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default']);
    	let { idx } = $$props;
    	const { registerTab, selectTab, selectedTab } = getContext(TABS);
    	validate_store(selectedTab, 'selectedTab');
    	component_subscribe($$self, selectedTab, value => $$invalidate(1, $selectedTab = value));
    	registerTab(idx);
    	const writable_props = ['idx'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => selectTab(idx);

    	$$self.$$set = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		TABS,
    		idx,
    		registerTab,
    		selectTab,
    		selectedTab,
    		$selectedTab
    	});

    	$$self.$inject_state = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [idx, $selectedTab, selectTab, selectedTab, $$scope, slots, click_handler];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, { idx: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$I.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*idx*/ ctx[0] === undefined && !('idx' in props)) {
    			console.warn("<Tab> was created without expected prop 'idx'");
    		}
    	}

    	get idx() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idx(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const ALIGNMENT = {
    	AUTO:   'auto',
    	START:  'start',
    	CENTER: 'center',
    	END:    'end',
    };

    const DIRECTION = {
    	HORIZONTAL: 'horizontal',
    	VERTICAL:   'vertical',
    };

    const SCROLL_CHANGE_REASON = {
    	OBSERVED:  0,
    	REQUESTED: 1,
    };

    const SCROLL_PROP = {
    	[DIRECTION.VERTICAL]:   'scrollTop',
    	[DIRECTION.HORIZONTAL]: 'scrollLeft',
    };

    /* Forked from react-virtualized 💖 */

    /**
     * @callback ItemSizeGetter
     * @param {number} index
     * @return {number}
     */

    /**
     * @typedef ItemSize
     * @type {number | number[] | ItemSizeGetter}
     */

    /**
     * @typedef SizeAndPosition
     * @type {object}
     * @property {number} size
     * @property {number} offset
     */

    /**
     * @typedef SizeAndPositionData
     * @type {Object.<number, SizeAndPosition>}
     */

    /**
     * @typedef Options
     * @type {object}
     * @property {number} itemCount
     * @property {ItemSize} itemSize
     * @property {number} estimatedItemSize
     */

    class SizeAndPositionManager {

    	/**
    	 * @param {Options} options
    	 */
    	constructor({ itemSize, itemCount, estimatedItemSize }) {
    		/**
    		 * @private
    		 * @type {ItemSize}
    		 */
    		this.itemSize = itemSize;

    		/**
    		 * @private
    		 * @type {number}
    		 */
    		this.itemCount = itemCount;

    		/**
    		 * @private
    		 * @type {number}
    		 */
    		this.estimatedItemSize = estimatedItemSize;

    		/**
    		 * Cache of size and position data for items, mapped by item index.
    		 *
    		 * @private
    		 * @type {SizeAndPositionData}
    		 */
    		this.itemSizeAndPositionData = {};

    		/**
    		 * Measurements for items up to this index can be trusted; items afterward should be estimated.
    		 *
    		 * @private
    		 * @type {number}
    		 */
    		this.lastMeasuredIndex = -1;

    		this.checkForMismatchItemSizeAndItemCount();

    		if (!this.justInTime) this.computeTotalSizeAndPositionData();
    	}

    	get justInTime() {
    		return typeof this.itemSize === 'function';
    	}

    	/**
    	 * @param {Options} options
    	 */
    	updateConfig({ itemSize, itemCount, estimatedItemSize }) {
    		if (itemCount != null) {
    			this.itemCount = itemCount;
    		}

    		if (estimatedItemSize != null) {
    			this.estimatedItemSize = estimatedItemSize;
    		}

    		if (itemSize != null) {
    			this.itemSize = itemSize;
    		}

    		this.checkForMismatchItemSizeAndItemCount();

    		if (this.justInTime && this.totalSize != null) {
    			this.totalSize = undefined;
    		} else {
    			this.computeTotalSizeAndPositionData();
    		}
    	}

    	checkForMismatchItemSizeAndItemCount() {
    		if (Array.isArray(this.itemSize) && this.itemSize.length < this.itemCount) {
    			throw Error(
    				`When itemSize is an array, itemSize.length can't be smaller than itemCount`,
    			);
    		}
    	}

    	/**
    	 * @param {number} index
    	 */
    	getSize(index) {
    		const { itemSize } = this;

    		if (typeof itemSize === 'function') {
    			return itemSize(index);
    		}

    		return Array.isArray(itemSize) ? itemSize[index] : itemSize;
    	}

    	/**
    	 * Compute the totalSize and itemSizeAndPositionData at the start,
    	 * only when itemSize is a number or an array.
    	 */
    	computeTotalSizeAndPositionData() {
    		let totalSize = 0;
    		for (let i = 0; i < this.itemCount; i++) {
    			const size = this.getSize(i);
    			const offset = totalSize;
    			totalSize += size;

    			this.itemSizeAndPositionData[i] = {
    				offset,
    				size,
    			};
    		}

    		this.totalSize = totalSize;
    	}

    	getLastMeasuredIndex() {
    		return this.lastMeasuredIndex;
    	}


    	/**
    	 * This method returns the size and position for the item at the specified index.
    	 *
    	 * @param {number} index
    	 */
    	getSizeAndPositionForIndex(index) {
    		if (index < 0 || index >= this.itemCount) {
    			throw Error(
    				`Requested index ${index} is outside of range 0..${this.itemCount}`,
    			);
    		}

    		return this.justInTime
    			? this.getJustInTimeSizeAndPositionForIndex(index)
    			: this.itemSizeAndPositionData[index];
    	}

    	/**
    	 * This is used when itemSize is a function.
    	 * just-in-time calculates (or used cached values) for items leading up to the index.
    	 *
    	 * @param {number} index
    	 */
    	getJustInTimeSizeAndPositionForIndex(index) {
    		if (index > this.lastMeasuredIndex) {
    			const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
    			let offset =
    				    lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size;

    			for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {
    				const size = this.getSize(i);

    				if (size == null || isNaN(size)) {
    					throw Error(`Invalid size returned for index ${i} of value ${size}`);
    				}

    				this.itemSizeAndPositionData[i] = {
    					offset,
    					size,
    				};

    				offset += size;
    			}

    			this.lastMeasuredIndex = index;
    		}

    		return this.itemSizeAndPositionData[index];
    	}

    	getSizeAndPositionOfLastMeasuredItem() {
    		return this.lastMeasuredIndex >= 0
    			? this.itemSizeAndPositionData[this.lastMeasuredIndex]
    			: { offset: 0, size: 0 };
    	}

    	/**
    	 * Total size of all items being measured.
    	 *
    	 * @return {number}
    	 */
    	getTotalSize() {
    		// Return the pre computed totalSize when itemSize is number or array.
    		if (this.totalSize) return this.totalSize;

    		/**
    		 * When itemSize is a function,
    		 * This value will be completedly estimated initially.
    		 * As items as measured the estimate will be updated.
    		 */
    		const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();

    		return (
    			lastMeasuredSizeAndPosition.offset +
    			lastMeasuredSizeAndPosition.size +
    			(this.itemCount - this.lastMeasuredIndex - 1) * this.estimatedItemSize
    		);
    	}

    	/**
    	 * Determines a new offset that ensures a certain item is visible, given the alignment.
    	 *
    	 * @param {'auto' | 'start' | 'center' | 'end'} align Desired alignment within container
    	 * @param {number | undefined} containerSize Size (width or height) of the container viewport
    	 * @param {number | undefined} currentOffset
    	 * @param {number | undefined} targetIndex
    	 * @return {number} Offset to use to ensure the specified item is visible
    	 */
    	getUpdatedOffsetForIndex({ align = ALIGNMENT.START, containerSize, currentOffset, targetIndex }) {
    		if (containerSize <= 0) {
    			return 0;
    		}

    		const datum = this.getSizeAndPositionForIndex(targetIndex);
    		const maxOffset = datum.offset;
    		const minOffset = maxOffset - containerSize + datum.size;

    		let idealOffset;

    		switch (align) {
    			case ALIGNMENT.END:
    				idealOffset = minOffset;
    				break;
    			case ALIGNMENT.CENTER:
    				idealOffset = maxOffset - (containerSize - datum.size) / 2;
    				break;
    			case ALIGNMENT.START:
    				idealOffset = maxOffset;
    				break;
    			default:
    				idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
    		}

    		const totalSize = this.getTotalSize();

    		return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
    	}

    	/**
    	 * @param {number} containerSize
    	 * @param {number} offset
    	 * @param {number} overscanCount
    	 * @return {{stop: number|undefined, start: number|undefined}}
    	 */
    	getVisibleRange({ containerSize = 0, offset, overscanCount }) {
    		const totalSize = this.getTotalSize();

    		if (totalSize === 0) {
    			return {};
    		}

    		const maxOffset = offset + containerSize;
    		let start = this.findNearestItem(offset);

    		if (start === undefined) {
    			throw Error(`Invalid offset ${offset} specified`);
    		}

    		const datum = this.getSizeAndPositionForIndex(start);
    		offset = datum.offset + datum.size;

    		let stop = start;

    		while (offset < maxOffset && stop < this.itemCount - 1) {
    			stop++;
    			offset += this.getSizeAndPositionForIndex(stop).size;
    		}

    		if (overscanCount) {
    			start = Math.max(0, start - overscanCount);
    			stop = Math.min(stop + overscanCount, this.itemCount - 1);
    		}

    		return {
    			start,
    			stop,
    		};
    	}

    	/**
    	 * Clear all cached values for items after the specified index.
    	 * This method should be called for any item that has changed its size.
    	 * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionForIndex() is called.
    	 *
    	 * @param {number} index
    	 */
    	resetItem(index) {
    		this.lastMeasuredIndex = Math.min(this.lastMeasuredIndex, index - 1);
    	}

    	/**
    	 * Searches for the item (index) nearest the specified offset.
    	 *
    	 * If no exact match is found the next lowest item index will be returned.
    	 * This allows partially visible items (with offsets just before/above the fold) to be visible.
    	 *
    	 * @param {number} offset
    	 */
    	findNearestItem(offset) {
    		if (isNaN(offset)) {
    			throw Error(`Invalid offset ${offset} specified`);
    		}

    		// Our search algorithms find the nearest match at or below the specified offset.
    		// So make sure the offset is at least 0 or no match will be found.
    		offset = Math.max(0, offset);

    		const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
    		const lastMeasuredIndex = Math.max(0, this.lastMeasuredIndex);

    		if (lastMeasuredSizeAndPosition.offset >= offset) {
    			// If we've already measured items within this range just use a binary search as it's faster.
    			return this.binarySearch({
    				high: lastMeasuredIndex,
    				low:  0,
    				offset,
    			});
    		} else {
    			// If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
    			// The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
    			// The overall complexity for this approach is O(log n).
    			return this.exponentialSearch({
    				index: lastMeasuredIndex,
    				offset,
    			});
    		}
    	}

    	/**
    	 * @private
    	 * @param {number} low
    	 * @param {number} high
    	 * @param {number} offset
    	 */
    	binarySearch({ low, high, offset }) {
    		let middle = 0;
    		let currentOffset = 0;

    		while (low <= high) {
    			middle = low + Math.floor((high - low) / 2);
    			currentOffset = this.getSizeAndPositionForIndex(middle).offset;

    			if (currentOffset === offset) {
    				return middle;
    			} else if (currentOffset < offset) {
    				low = middle + 1;
    			} else if (currentOffset > offset) {
    				high = middle - 1;
    			}
    		}

    		if (low > 0) {
    			return low - 1;
    		}

    		return 0;
    	}

    	/**
    	 * @private
    	 * @param {number} index
    	 * @param {number} offset
    	 */
    	exponentialSearch({ index, offset }) {
    		let interval = 1;

    		while (
    			index < this.itemCount &&
    			this.getSizeAndPositionForIndex(index).offset < offset
    			) {
    			index += interval;
    			interval *= 2;
    		}

    		return this.binarySearch({
    			high: Math.min(index, this.itemCount - 1),
    			low:  Math.floor(index / 2),
    			offset,
    		});
    	}
    }

    /* node_modules\svelte-tiny-virtual-list\src\VirtualList.svelte generated by Svelte v3.46.6 */

    const { Object: Object_1$4 } = globals;
    const file$E = "node_modules\\svelte-tiny-virtual-list\\src\\VirtualList.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    const get_item_slot_changes = dirty => ({
    	style: dirty[0] & /*items*/ 4,
    	index: dirty[0] & /*items*/ 4
    });

    const get_item_slot_context = ctx => ({
    	style: /*item*/ ctx[36].style,
    	index: /*item*/ ctx[36].index
    });

    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    // (322:2) {#each items as item (getKey ? getKey(item.index) : item.index)}
    function create_each_block$8(key_1, ctx) {
    	let first;
    	let current;
    	const item_slot_template = /*#slots*/ ctx[20].item;
    	const item_slot = create_slot(item_slot_template, ctx, /*$$scope*/ ctx[19], get_item_slot_context);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (item_slot) item_slot.c();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (item_slot) {
    				item_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (item_slot) {
    				if (item_slot.p && (!current || dirty[0] & /*$$scope, items*/ 524292)) {
    					update_slot_base(
    						item_slot,
    						item_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(item_slot_template, /*$$scope*/ ctx[19], dirty, get_item_slot_changes),
    						get_item_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (item_slot) item_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(322:2) {#each items as item (getKey ? getKey(item.index) : item.index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$H(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t1;
    	let current;
    	const header_slot_template = /*#slots*/ ctx[20].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[19], get_header_slot_context);
    	let each_value = /*items*/ ctx[2];
    	validate_each_argument(each_value);

    	const get_key = ctx => /*getKey*/ ctx[0]
    	? /*getKey*/ ctx[0](/*item*/ ctx[36].index)
    	: /*item*/ ctx[36].index;

    	validate_each_keys(ctx, each_value, get_each_context$8, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$8(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$8(key, child_ctx));
    	}

    	const footer_slot_template = /*#slots*/ ctx[20].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[19], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (header_slot) header_slot.c();
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (footer_slot) footer_slot.c();
    			attr_dev(div0, "class", "virtual-list-inner svelte-dwpad5");
    			attr_dev(div0, "style", /*innerStyle*/ ctx[4]);
    			add_location(div0, file$E, 320, 1, 7266);
    			attr_dev(div1, "class", "virtual-list-wrapper svelte-dwpad5");
    			attr_dev(div1, "style", /*wrapperStyle*/ ctx[3]);
    			add_location(div1, file$E, 317, 0, 7164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (header_slot) {
    				header_slot.m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);

    			if (footer_slot) {
    				footer_slot.m(div1, null);
    			}

    			/*div1_binding*/ ctx[21](div1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[19], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}

    			if (dirty[0] & /*$$scope, items, getKey*/ 524293) {
    				each_value = /*items*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$8, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$8, null, get_each_context$8);
    				check_outros();
    			}

    			if (!current || dirty[0] & /*innerStyle*/ 16) {
    				attr_dev(div0, "style", /*innerStyle*/ ctx[4]);
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[19], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*wrapperStyle*/ 8) {
    				attr_dev(div1, "style", /*wrapperStyle*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (header_slot) header_slot.d(detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (footer_slot) footer_slot.d(detaching);
    			/*div1_binding*/ ctx[21](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const thirdEventArg$1 = (() => {
    	let result = false;

    	try {
    		const arg = Object.defineProperty({}, 'passive', {
    			get() {
    				result = { passive: true };
    				return true;
    			}
    		});

    		window.addEventListener('testpassive', arg, arg);
    		window.remove('testpassive', arg, arg);
    	} catch(e) {
    		
    	} /* */

    	return result;
    })();

    function instance$H($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VirtualList', slots, ['header','item','footer']);
    	let { height } = $$props;
    	let { width = '100%' } = $$props;
    	let { itemCount } = $$props;
    	let { itemSize } = $$props;
    	let { estimatedItemSize = null } = $$props;
    	let { stickyIndices = null } = $$props;
    	let { getKey = null } = $$props;
    	let { scrollDirection = DIRECTION.VERTICAL } = $$props;
    	let { scrollOffset = null } = $$props;
    	let { scrollToIndex = null } = $$props;
    	let { scrollToAlignment = null } = $$props;
    	let { overscanCount = 3 } = $$props;
    	const dispatchEvent = createEventDispatcher();

    	const sizeAndPositionManager = new SizeAndPositionManager({
    			itemCount,
    			itemSize,
    			estimatedItemSize: getEstimatedItemSize()
    		});

    	let mounted = false;
    	let wrapper;
    	let items = [];

    	let state = {
    		offset: scrollOffset || scrollToIndex != null && items.length && getOffsetForIndex(scrollToIndex) || 0,
    		scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
    	};

    	let prevState = state;

    	let prevProps = {
    		scrollToIndex,
    		scrollToAlignment,
    		scrollOffset,
    		itemCount,
    		itemSize,
    		estimatedItemSize
    	};

    	let styleCache = {};
    	let wrapperStyle = '';
    	let innerStyle = '';
    	refresh(); // Initial Load

    	onMount(() => {
    		$$invalidate(17, mounted = true);
    		wrapper.addEventListener('scroll', handleScroll, thirdEventArg$1);

    		if (scrollOffset != null) {
    			scrollTo(scrollOffset);
    		} else if (scrollToIndex != null) {
    			scrollTo(getOffsetForIndex(scrollToIndex));
    		}
    	});

    	onDestroy(() => {
    		if (mounted) wrapper.removeEventListener('scroll', handleScroll);
    	});

    	function propsUpdated() {
    		if (!mounted) return;
    		const scrollPropsHaveChanged = prevProps.scrollToIndex !== scrollToIndex || prevProps.scrollToAlignment !== scrollToAlignment;
    		const itemPropsHaveChanged = prevProps.itemCount !== itemCount || prevProps.itemSize !== itemSize || prevProps.estimatedItemSize !== estimatedItemSize;

    		if (itemPropsHaveChanged) {
    			sizeAndPositionManager.updateConfig({
    				itemSize,
    				itemCount,
    				estimatedItemSize: getEstimatedItemSize()
    			});

    			recomputeSizes();
    		}

    		if (prevProps.scrollOffset !== scrollOffset) {
    			$$invalidate(18, state = {
    				offset: scrollOffset || 0,
    				scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
    			});
    		} else if (typeof scrollToIndex === 'number' && (scrollPropsHaveChanged || itemPropsHaveChanged)) {
    			$$invalidate(18, state = {
    				offset: getOffsetForIndex(scrollToIndex, scrollToAlignment, itemCount),
    				scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
    			});
    		}

    		prevProps = {
    			scrollToIndex,
    			scrollToAlignment,
    			scrollOffset,
    			itemCount,
    			itemSize,
    			estimatedItemSize
    		};
    	}

    	function stateUpdated() {
    		if (!mounted) return;
    		const { offset, scrollChangeReason } = state;

    		if (prevState.offset !== offset || prevState.scrollChangeReason !== scrollChangeReason) {
    			refresh();
    		}

    		if (prevState.offset !== offset && scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
    			scrollTo(offset);
    		}

    		prevState = state;
    	}

    	function refresh() {
    		const { offset } = state;

    		const { start, stop } = sizeAndPositionManager.getVisibleRange({
    			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
    			offset,
    			overscanCount
    		});

    		let updatedItems = [];
    		const totalSize = sizeAndPositionManager.getTotalSize();

    		if (scrollDirection === DIRECTION.VERTICAL) {
    			$$invalidate(3, wrapperStyle = `height:${height}px;width:${width};`);
    			$$invalidate(4, innerStyle = `flex-direction:column;height:${totalSize}px;`);
    		} else {
    			$$invalidate(3, wrapperStyle = `height:${height};width:${width}px`);
    			$$invalidate(4, innerStyle = `min-height:100%;width:${totalSize}px;`);
    		}

    		const hasStickyIndices = stickyIndices != null && stickyIndices.length !== 0;

    		if (hasStickyIndices) {
    			for (let i = 0; i < stickyIndices.length; i++) {
    				const index = stickyIndices[i];
    				updatedItems.push({ index, style: getStyle(index, true) });
    			}
    		}

    		if (start !== undefined && stop !== undefined) {
    			for (let index = start; index <= stop; index++) {
    				if (hasStickyIndices && stickyIndices.includes(index)) {
    					continue;
    				}

    				updatedItems.push({ index, style: getStyle(index, false) });
    			}

    			dispatchEvent('itemsUpdated', { start, end: stop });
    		}

    		$$invalidate(2, items = updatedItems);
    	}

    	function scrollTo(value) {
    		$$invalidate(1, wrapper[SCROLL_PROP[scrollDirection]] = value, wrapper);
    	}

    	function recomputeSizes(startIndex = 0) {
    		styleCache = {};
    		sizeAndPositionManager.resetItem(startIndex);
    		refresh();
    	}

    	function getOffsetForIndex(index, align = scrollToAlignment, _itemCount = itemCount) {
    		if (index < 0 || index >= _itemCount) {
    			index = 0;
    		}

    		return sizeAndPositionManager.getUpdatedOffsetForIndex({
    			align,
    			containerSize: scrollDirection === DIRECTION.VERTICAL ? height : width,
    			currentOffset: state.offset || 0,
    			targetIndex: index
    		});
    	}

    	function handleScroll(event) {
    		const offset = getWrapperOffset();
    		if (offset < 0 || state.offset === offset || event.target !== wrapper) return;

    		$$invalidate(18, state = {
    			offset,
    			scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED
    		});

    		dispatchEvent('afterScroll', { offset, event });
    	}

    	function getWrapperOffset() {
    		return wrapper[SCROLL_PROP[scrollDirection]];
    	}

    	function getEstimatedItemSize() {
    		return estimatedItemSize || typeof itemSize === 'number' && itemSize || 50;
    	}

    	function getStyle(index, sticky) {
    		if (styleCache[index]) return styleCache[index];
    		const { size, offset } = sizeAndPositionManager.getSizeAndPositionForIndex(index);
    		let style;

    		if (scrollDirection === DIRECTION.VERTICAL) {
    			style = `left:0;width:100%;height:${size}px;`;

    			if (sticky) {
    				style += `position:sticky;flex-grow:0;z-index:1;top:0;margin-top:${offset}px;margin-bottom:${-(offset + size)}px;`;
    			} else {
    				style += `position:absolute;top:${offset}px;`;
    			}
    		} else {
    			style = `top:0;width:${size}px;`;

    			if (sticky) {
    				style += `position:sticky;z-index:1;left:0;margin-left:${offset}px;margin-right:${-(offset + size)}px;`;
    			} else {
    				style += `position:absolute;height:100%;left:${offset}px;`;
    			}
    		}

    		return styleCache[index] = style;
    	}

    	const writable_props = [
    		'height',
    		'width',
    		'itemCount',
    		'itemSize',
    		'estimatedItemSize',
    		'stickyIndices',
    		'getKey',
    		'scrollDirection',
    		'scrollOffset',
    		'scrollToIndex',
    		'scrollToAlignment',
    		'overscanCount'
    	];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VirtualList> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(1, wrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('height' in $$props) $$invalidate(5, height = $$props.height);
    		if ('width' in $$props) $$invalidate(6, width = $$props.width);
    		if ('itemCount' in $$props) $$invalidate(7, itemCount = $$props.itemCount);
    		if ('itemSize' in $$props) $$invalidate(8, itemSize = $$props.itemSize);
    		if ('estimatedItemSize' in $$props) $$invalidate(9, estimatedItemSize = $$props.estimatedItemSize);
    		if ('stickyIndices' in $$props) $$invalidate(10, stickyIndices = $$props.stickyIndices);
    		if ('getKey' in $$props) $$invalidate(0, getKey = $$props.getKey);
    		if ('scrollDirection' in $$props) $$invalidate(11, scrollDirection = $$props.scrollDirection);
    		if ('scrollOffset' in $$props) $$invalidate(12, scrollOffset = $$props.scrollOffset);
    		if ('scrollToIndex' in $$props) $$invalidate(13, scrollToIndex = $$props.scrollToIndex);
    		if ('scrollToAlignment' in $$props) $$invalidate(14, scrollToAlignment = $$props.scrollToAlignment);
    		if ('overscanCount' in $$props) $$invalidate(15, overscanCount = $$props.overscanCount);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		thirdEventArg: thirdEventArg$1,
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		SizeAndPositionManager,
    		DIRECTION,
    		SCROLL_CHANGE_REASON,
    		SCROLL_PROP,
    		height,
    		width,
    		itemCount,
    		itemSize,
    		estimatedItemSize,
    		stickyIndices,
    		getKey,
    		scrollDirection,
    		scrollOffset,
    		scrollToIndex,
    		scrollToAlignment,
    		overscanCount,
    		dispatchEvent,
    		sizeAndPositionManager,
    		mounted,
    		wrapper,
    		items,
    		state,
    		prevState,
    		prevProps,
    		styleCache,
    		wrapperStyle,
    		innerStyle,
    		propsUpdated,
    		stateUpdated,
    		refresh,
    		scrollTo,
    		recomputeSizes,
    		getOffsetForIndex,
    		handleScroll,
    		getWrapperOffset,
    		getEstimatedItemSize,
    		getStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(5, height = $$props.height);
    		if ('width' in $$props) $$invalidate(6, width = $$props.width);
    		if ('itemCount' in $$props) $$invalidate(7, itemCount = $$props.itemCount);
    		if ('itemSize' in $$props) $$invalidate(8, itemSize = $$props.itemSize);
    		if ('estimatedItemSize' in $$props) $$invalidate(9, estimatedItemSize = $$props.estimatedItemSize);
    		if ('stickyIndices' in $$props) $$invalidate(10, stickyIndices = $$props.stickyIndices);
    		if ('getKey' in $$props) $$invalidate(0, getKey = $$props.getKey);
    		if ('scrollDirection' in $$props) $$invalidate(11, scrollDirection = $$props.scrollDirection);
    		if ('scrollOffset' in $$props) $$invalidate(12, scrollOffset = $$props.scrollOffset);
    		if ('scrollToIndex' in $$props) $$invalidate(13, scrollToIndex = $$props.scrollToIndex);
    		if ('scrollToAlignment' in $$props) $$invalidate(14, scrollToAlignment = $$props.scrollToAlignment);
    		if ('overscanCount' in $$props) $$invalidate(15, overscanCount = $$props.overscanCount);
    		if ('mounted' in $$props) $$invalidate(17, mounted = $$props.mounted);
    		if ('wrapper' in $$props) $$invalidate(1, wrapper = $$props.wrapper);
    		if ('items' in $$props) $$invalidate(2, items = $$props.items);
    		if ('state' in $$props) $$invalidate(18, state = $$props.state);
    		if ('prevState' in $$props) prevState = $$props.prevState;
    		if ('prevProps' in $$props) prevProps = $$props.prevProps;
    		if ('styleCache' in $$props) styleCache = $$props.styleCache;
    		if ('wrapperStyle' in $$props) $$invalidate(3, wrapperStyle = $$props.wrapperStyle);
    		if ('innerStyle' in $$props) $$invalidate(4, innerStyle = $$props.innerStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*scrollToIndex, scrollToAlignment, scrollOffset, itemCount, itemSize, estimatedItemSize*/ 29568) {
    			{

    				propsUpdated();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 262144) {
    			{

    				stateUpdated();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*height, width, stickyIndices, mounted*/ 132192) {
    			{

    				if (mounted) recomputeSizes(0); // call scroll.reset;
    			}
    		}
    	};

    	return [
    		getKey,
    		wrapper,
    		items,
    		wrapperStyle,
    		innerStyle,
    		height,
    		width,
    		itemCount,
    		itemSize,
    		estimatedItemSize,
    		stickyIndices,
    		scrollDirection,
    		scrollOffset,
    		scrollToIndex,
    		scrollToAlignment,
    		overscanCount,
    		recomputeSizes,
    		mounted,
    		state,
    		$$scope,
    		slots,
    		div1_binding
    	];
    }

    class VirtualList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$H,
    			create_fragment$H,
    			safe_not_equal,
    			{
    				height: 5,
    				width: 6,
    				itemCount: 7,
    				itemSize: 8,
    				estimatedItemSize: 9,
    				stickyIndices: 10,
    				getKey: 0,
    				scrollDirection: 11,
    				scrollOffset: 12,
    				scrollToIndex: 13,
    				scrollToAlignment: 14,
    				overscanCount: 15,
    				recomputeSizes: 16
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VirtualList",
    			options,
    			id: create_fragment$H.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*height*/ ctx[5] === undefined && !('height' in props)) {
    			console.warn("<VirtualList> was created without expected prop 'height'");
    		}

    		if (/*itemCount*/ ctx[7] === undefined && !('itemCount' in props)) {
    			console.warn("<VirtualList> was created without expected prop 'itemCount'");
    		}

    		if (/*itemSize*/ ctx[8] === undefined && !('itemSize' in props)) {
    			console.warn("<VirtualList> was created without expected prop 'itemSize'");
    		}
    	}

    	get height() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemCount() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemCount(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemSize() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemSize(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get estimatedItemSize() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set estimatedItemSize(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stickyIndices() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stickyIndices(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getKey() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getKey(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollDirection() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollDirection(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollOffset() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollOffset(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToIndex() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollToIndex(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToAlignment() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollToAlignment(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overscanCount() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overscanCount(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get recomputeSizes() {
    		return this.$$.ctx[16];
    	}

    	set recomputeSizes(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-infinite-loading\src\Spinner.svelte generated by Svelte v3.46.6 */

    const file$D = "node_modules\\svelte-infinite-loading\\src\\Spinner.svelte";

    // (49:0) {:else}
    function create_else_block$8(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "loading-default svelte-10h86fq");
    			add_location(i, file$D, 51, 1, 1184);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(49:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:33) 
    function create_if_block_3$2(ctx) {
    	let span5;
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let span2;
    	let t2;
    	let span3;
    	let t3;
    	let span4;

    	const block = {
    		c: function create() {
    			span5 = element("span");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = space();
    			span2 = element("span");
    			t2 = space();
    			span3 = element("span");
    			t3 = space();
    			span4 = element("span");
    			attr_dev(span0, "class", "wave-item svelte-10h86fq");
    			add_location(span0, file$D, 41, 2, 978);
    			attr_dev(span1, "class", "wave-item svelte-10h86fq");
    			add_location(span1, file$D, 42, 2, 1012);
    			attr_dev(span2, "class", "wave-item svelte-10h86fq");
    			add_location(span2, file$D, 43, 2, 1046);
    			attr_dev(span3, "class", "wave-item svelte-10h86fq");
    			add_location(span3, file$D, 44, 2, 1080);
    			attr_dev(span4, "class", "wave-item svelte-10h86fq");
    			add_location(span4, file$D, 45, 2, 1114);
    			attr_dev(span5, "class", "loading-wave-dots svelte-10h86fq");
    			add_location(span5, file$D, 40, 1, 943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span5, anchor);
    			append_dev(span5, span0);
    			append_dev(span5, t0);
    			append_dev(span5, span1);
    			append_dev(span5, t1);
    			append_dev(span5, span2);
    			append_dev(span5, t2);
    			append_dev(span5, span3);
    			append_dev(span5, t3);
    			append_dev(span5, span4);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(38:33) ",
    		ctx
    	});

    	return block;
    }

    // (33:31) 
    function create_if_block_2$3(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "loading-spiral svelte-10h86fq");
    			add_location(i, file$D, 35, 1, 856);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(33:31) ",
    		ctx
    	});

    	return block;
    }

    // (19:32) 
    function create_if_block_1$4(ctx) {
    	let span8;
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let span2;
    	let t2;
    	let span3;
    	let t3;
    	let span4;
    	let t4;
    	let span5;
    	let t5;
    	let span6;
    	let t6;
    	let span7;

    	const block = {
    		c: function create() {
    			span8 = element("span");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = space();
    			span2 = element("span");
    			t2 = space();
    			span3 = element("span");
    			t3 = space();
    			span4 = element("span");
    			t4 = space();
    			span5 = element("span");
    			t5 = space();
    			span6 = element("span");
    			t6 = space();
    			span7 = element("span");
    			attr_dev(span0, "class", "circle-item svelte-10h86fq");
    			add_location(span0, file$D, 22, 2, 509);
    			attr_dev(span1, "class", "circle-item svelte-10h86fq");
    			add_location(span1, file$D, 23, 2, 545);
    			attr_dev(span2, "class", "circle-item svelte-10h86fq");
    			add_location(span2, file$D, 24, 2, 581);
    			attr_dev(span3, "class", "circle-item svelte-10h86fq");
    			add_location(span3, file$D, 25, 2, 617);
    			attr_dev(span4, "class", "circle-item svelte-10h86fq");
    			add_location(span4, file$D, 26, 2, 653);
    			attr_dev(span5, "class", "circle-item svelte-10h86fq");
    			add_location(span5, file$D, 27, 2, 689);
    			attr_dev(span6, "class", "circle-item svelte-10h86fq");
    			add_location(span6, file$D, 28, 2, 725);
    			attr_dev(span7, "class", "circle-item svelte-10h86fq");
    			add_location(span7, file$D, 29, 2, 761);
    			attr_dev(span8, "class", "loading-circles svelte-10h86fq");
    			add_location(span8, file$D, 21, 1, 476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span8, anchor);
    			append_dev(span8, span0);
    			append_dev(span8, t0);
    			append_dev(span8, span1);
    			append_dev(span8, t1);
    			append_dev(span8, span2);
    			append_dev(span8, t2);
    			append_dev(span8, span3);
    			append_dev(span8, t3);
    			append_dev(span8, span4);
    			append_dev(span8, t4);
    			append_dev(span8, span5);
    			append_dev(span8, t5);
    			append_dev(span8, span6);
    			append_dev(span8, t6);
    			append_dev(span8, span7);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(19:32) ",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if spinner === 'bubbles'}
    function create_if_block$f(ctx) {
    	let span8;
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let span2;
    	let t2;
    	let span3;
    	let t3;
    	let span4;
    	let t4;
    	let span5;
    	let t5;
    	let span6;
    	let t6;
    	let span7;

    	const block = {
    		c: function create() {
    			span8 = element("span");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = space();
    			span2 = element("span");
    			t2 = space();
    			span3 = element("span");
    			t3 = space();
    			span4 = element("span");
    			t4 = space();
    			span5 = element("span");
    			t5 = space();
    			span6 = element("span");
    			t6 = space();
    			span7 = element("span");
    			attr_dev(span0, "class", "bubble-item svelte-10h86fq");
    			add_location(span0, file$D, 8, 2, 127);
    			attr_dev(span1, "class", "bubble-item svelte-10h86fq");
    			add_location(span1, file$D, 9, 2, 163);
    			attr_dev(span2, "class", "bubble-item svelte-10h86fq");
    			add_location(span2, file$D, 10, 2, 199);
    			attr_dev(span3, "class", "bubble-item svelte-10h86fq");
    			add_location(span3, file$D, 11, 2, 235);
    			attr_dev(span4, "class", "bubble-item svelte-10h86fq");
    			add_location(span4, file$D, 12, 2, 271);
    			attr_dev(span5, "class", "bubble-item svelte-10h86fq");
    			add_location(span5, file$D, 13, 2, 307);
    			attr_dev(span6, "class", "bubble-item svelte-10h86fq");
    			add_location(span6, file$D, 14, 2, 343);
    			attr_dev(span7, "class", "bubble-item svelte-10h86fq");
    			add_location(span7, file$D, 15, 2, 379);
    			attr_dev(span8, "class", "loading-bubbles svelte-10h86fq");
    			add_location(span8, file$D, 7, 1, 94);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span8, anchor);
    			append_dev(span8, span0);
    			append_dev(span8, t0);
    			append_dev(span8, span1);
    			append_dev(span8, t1);
    			append_dev(span8, span2);
    			append_dev(span8, t2);
    			append_dev(span8, span3);
    			append_dev(span8, t3);
    			append_dev(span8, span4);
    			append_dev(span8, t4);
    			append_dev(span8, span5);
    			append_dev(span8, t5);
    			append_dev(span8, span6);
    			append_dev(span8, t6);
    			append_dev(span8, span7);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(5:0) {#if spinner === 'bubbles'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$G(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*spinner*/ ctx[0] === 'bubbles') return create_if_block$f;
    		if (/*spinner*/ ctx[0] === 'circles') return create_if_block_1$4;
    		if (/*spinner*/ ctx[0] === 'spiral') return create_if_block_2$3;
    		if (/*spinner*/ ctx[0] === 'wavedots') return create_if_block_3$2;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spinner', slots, []);
    	let { spinner = '' } = $$props;
    	const writable_props = ['spinner'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spinner> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('spinner' in $$props) $$invalidate(0, spinner = $$props.spinner);
    	};

    	$$self.$capture_state = () => ({ spinner });

    	$$self.$inject_state = $$props => {
    		if ('spinner' in $$props) $$invalidate(0, spinner = $$props.spinner);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [spinner];
    }

    class Spinner$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, { spinner: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinner",
    			options,
    			id: create_fragment$G.name
    		});
    	}

    	get spinner() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinner(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-infinite-loading\src\InfiniteLoading.svelte generated by Svelte v3.46.6 */

    const { Object: Object_1$3, console: console_1 } = globals;
    const file$C = "node_modules\\svelte-infinite-loading\\src\\InfiniteLoading.svelte";
    const get_error_slot_changes = dirty => ({});
    const get_error_slot_context = ctx => ({ attemptLoad: /*attemptLoad*/ ctx[7] });
    const get_noMore_slot_changes = dirty => ({});
    const get_noMore_slot_context = ctx => ({});
    const get_noResults_slot_changes = dirty => ({});
    const get_noResults_slot_context = ctx => ({});
    const get_spinner_slot_changes = dirty => ({ isFirstLoad: dirty & /*isFirstLoad*/ 2 });
    const get_spinner_slot_context = ctx => ({ isFirstLoad: /*isFirstLoad*/ ctx[1] });

    // (326:1) {#if showSpinner}
    function create_if_block_3$1(ctx) {
    	let div;
    	let current;
    	const spinner_slot_template = /*#slots*/ ctx[15].spinner;
    	const spinner_slot = create_slot(spinner_slot_template, ctx, /*$$scope*/ ctx[14], get_spinner_slot_context);
    	const spinner_slot_or_fallback = spinner_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (spinner_slot_or_fallback) spinner_slot_or_fallback.c();
    			attr_dev(div, "class", "infinite-status-prompt");
    			add_location(div, file$C, 326, 2, 8147);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (spinner_slot_or_fallback) {
    				spinner_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (spinner_slot) {
    				if (spinner_slot.p && (!current || dirty & /*$$scope, isFirstLoad*/ 16386)) {
    					update_slot_base(
    						spinner_slot,
    						spinner_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(spinner_slot_template, /*$$scope*/ ctx[14], dirty, get_spinner_slot_changes),
    						get_spinner_slot_context
    					);
    				}
    			} else {
    				if (spinner_slot_or_fallback && spinner_slot_or_fallback.p && (!current || dirty & /*spinner*/ 1)) {
    					spinner_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (spinner_slot_or_fallback) spinner_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(326:1) {#if showSpinner}",
    		ctx
    	});

    	return block;
    }

    // (328:38)      
    function fallback_block_3(ctx) {
    	let spinner_1;
    	let current;

    	spinner_1 = new Spinner$1({
    			props: { spinner: /*spinner*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinner_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const spinner_1_changes = {};
    			if (dirty & /*spinner*/ 1) spinner_1_changes.spinner = /*spinner*/ ctx[0];
    			spinner_1.$set(spinner_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(328:38)      ",
    		ctx
    	});

    	return block;
    }

    // (334:1) {#if showNoResults}
    function create_if_block_2$2(ctx) {
    	let div;
    	let current;
    	const noResults_slot_template = /*#slots*/ ctx[15].noResults;
    	const noResults_slot = create_slot(noResults_slot_template, ctx, /*$$scope*/ ctx[14], get_noResults_slot_context);
    	const noResults_slot_or_fallback = noResults_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (noResults_slot_or_fallback) noResults_slot_or_fallback.c();
    			attr_dev(div, "class", "infinite-status-prompt");
    			add_location(div, file$C, 334, 2, 8300);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (noResults_slot_or_fallback) {
    				noResults_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (noResults_slot) {
    				if (noResults_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						noResults_slot,
    						noResults_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(noResults_slot_template, /*$$scope*/ ctx[14], dirty, get_noResults_slot_changes),
    						get_noResults_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(noResults_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(noResults_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (noResults_slot_or_fallback) noResults_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(334:1) {#if showNoResults}",
    		ctx
    	});

    	return block;
    }

    // (336:26)      No results :(    
    function fallback_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("No results :(");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(336:26)      No results :(    ",
    		ctx
    	});

    	return block;
    }

    // (342:1) {#if showNoMore}
    function create_if_block_1$3(ctx) {
    	let div;
    	let current;
    	const noMore_slot_template = /*#slots*/ ctx[15].noMore;
    	const noMore_slot = create_slot(noMore_slot_template, ctx, /*$$scope*/ ctx[14], get_noMore_slot_context);
    	const noMore_slot_or_fallback = noMore_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (noMore_slot_or_fallback) noMore_slot_or_fallback.c();
    			attr_dev(div, "class", "infinite-status-prompt");
    			add_location(div, file$C, 342, 2, 8430);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (noMore_slot_or_fallback) {
    				noMore_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (noMore_slot) {
    				if (noMore_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						noMore_slot,
    						noMore_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(noMore_slot_template, /*$$scope*/ ctx[14], dirty, get_noMore_slot_changes),
    						get_noMore_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(noMore_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(noMore_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (noMore_slot_or_fallback) noMore_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(342:1) {#if showNoMore}",
    		ctx
    	});

    	return block;
    }

    // (344:23)      No more data :)    
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("No more data :)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(344:23)      No more data :)    ",
    		ctx
    	});

    	return block;
    }

    // (350:1) {#if showError}
    function create_if_block$e(ctx) {
    	let div;
    	let current;
    	const error_slot_template = /*#slots*/ ctx[15].error;
    	const error_slot = create_slot(error_slot_template, ctx, /*$$scope*/ ctx[14], get_error_slot_context);
    	const error_slot_or_fallback = error_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (error_slot_or_fallback) error_slot_or_fallback.c();
    			attr_dev(div, "class", "infinite-status-prompt");
    			add_location(div, file$C, 350, 2, 8558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (error_slot_or_fallback) {
    				error_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (error_slot) {
    				if (error_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						error_slot,
    						error_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(error_slot_template, /*$$scope*/ ctx[14], dirty, get_error_slot_changes),
    						get_error_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(error_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(error_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (error_slot_or_fallback) error_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(350:1) {#if showError}",
    		ctx
    	});

    	return block;
    }

    // (352:36)      Oops, something went wrong :(     
    function fallback_block(ctx) {
    	let t0;
    	let br;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Oops, something went wrong :(\n\t\t\t\t");
    			br = element("br");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Retry";
    			add_location(br, file$C, 353, 4, 8670);
    			attr_dev(button, "class", "btn-try-infinite svelte-o3w4bf");
    			add_location(button, file$C, 354, 4, 8679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*attemptLoad*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(352:36)      Oops, something went wrong :(     ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$F(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	let if_block0 = /*showSpinner*/ ctx[6] && create_if_block_3$1(ctx);
    	let if_block1 = /*showNoResults*/ ctx[4] && create_if_block_2$2(ctx);
    	let if_block2 = /*showNoMore*/ ctx[3] && create_if_block_1$3(ctx);
    	let if_block3 = /*showError*/ ctx[5] && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(div, "class", "infinite-loading-container svelte-o3w4bf");
    			add_location(div, file$C, 324, 0, 8061);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			/*div_binding*/ ctx[16](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showSpinner*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*showSpinner*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*showNoResults*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*showNoResults*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*showNoMore*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*showNoMore*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*showError*/ ctx[5]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*showError*/ 32) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$e(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			/*div_binding*/ ctx[16](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const THROTTLE_LIMIT = 50;
    const LOOP_CHECK_TIMEOUT = 1000;
    const LOOP_CHECK_MAX_CALLS = 10;

    const ERROR_INFINITE_LOOP = [
    	`executed the callback function more than ${LOOP_CHECK_MAX_CALLS} times for a short time, it looks like searched a wrong scroll wrapper that doest not has fixed height or maximum height, please check it. If you want to force to set a element as scroll wrapper rather than automatic searching, you can do this:`,
    	'<!-- add a special attribute for the real scroll wrapper (can also be data-infinite-wrapper) -->',
    	'<div infinite-wrapper>',
    	'  ...',
    	'  <!-- set forceUseInfiniteWrapper -->',
    	'  <InfiniteLoading forceUseInfiniteWrapper>',
    	'</div>',
    	'or',
    	'<div class="infinite-wrapper">',
    	'  ...',
    	'  <!-- set forceUseInfiniteWrapper as css selector of the real scroll wrapper -->',
    	'  <InfiniteLoading forceUseInfiniteWrapper=".infinite-wrapper" />',
    	'</div>'
    ].join('\n');

    /**
     * the third argument for event bundler
     * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
     */
    const thirdEventArg = (() => {
    	let supportsPassive = false;

    	try {
    		const opts = Object.defineProperty({}, 'passive', {
    			get() {
    				supportsPassive = { passive: true };
    				return true;
    			}
    		});

    		window.addEventListener('testPassive', null, opts);
    		window.removeEventListener('testPassive', null, opts);
    	} catch(e) {
    		
    	} //

    	return supportsPassive;
    })();

    const throttler = {
    	timers: [],
    	caches: [],
    	throttle(fn) {
    		if (this.caches.indexOf(fn) === -1) {
    			// cache current handler
    			this.caches.push(fn);

    			// save timer for current handler
    			this.timers.push(setTimeout(
    				() => {
    					fn();

    					// empty cache and timer
    					this.caches.splice(this.caches.indexOf(fn), 1);

    					this.timers.shift();
    				},
    				THROTTLE_LIMIT
    			));
    		}
    	},
    	reset() {
    		// reset all timers
    		this.timers.forEach(timer => {
    			clearTimeout(timer);
    		});

    		this.timers.length = 0;

    		// empty caches
    		this.caches = [];
    	}
    };

    const loopTracker = {
    	isChecked: false,
    	timer: null,
    	times: 0,
    	track() {
    		// record track times
    		this.times += 1;

    		// try to mark check status
    		clearTimeout(this.timer);

    		this.timer = setTimeout(
    			() => {
    				this.isChecked = true;
    			},
    			LOOP_CHECK_TIMEOUT
    		);

    		// throw warning if the times of continuous calls large than the maximum times
    		if (this.times > LOOP_CHECK_MAX_CALLS) {
    			console.error(ERROR_INFINITE_LOOP);
    			this.isChecked = true;
    		}
    	}
    };

    const scrollBarStorage = {
    	key: '_infiniteScrollHeight',
    	getScrollElement(element) {
    		return element === window ? document.documentElement : element;
    	},
    	save(element) {
    		const target = this.getScrollElement(element);

    		// save scroll height on the scroll parent
    		target[this.key] = target.scrollHeight;
    	},
    	restore(element) {
    		const target = this.getScrollElement(element);

    		/* istanbul ignore else */
    		if (typeof target[this.key] === 'number') {
    			target.scrollTop = target.scrollHeight - target[this.key] + target.scrollTop;
    		}

    		this.remove(target);
    	},
    	remove(element) {
    		if (element[this.key] !== undefined) {
    			// remove scroll height
    			delete element[this.key]; // eslint-disable-line no-param-reassign
    		}
    	}
    };

    function isVisible(element) {
    	return element && element.offsetWidth + element.offsetHeight > 0;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	let showSpinner;
    	let showError;
    	let showNoResults;
    	let showNoMore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfiniteLoading', slots, ['spinner','noResults','noMore','error']);
    	const dispatch = createEventDispatcher();

    	const STATUS = {
    		READY: 0,
    		LOADING: 1,
    		COMPLETE: 2,
    		ERROR: 3
    	};

    	let { distance = 100 } = $$props;
    	let { spinner = 'default' } = $$props;
    	let { direction = 'bottom' } = $$props;
    	let { forceUseInfiniteWrapper = false } = $$props;
    	let { identifier = +new Date() } = $$props;
    	let isFirstLoad = true; // save the current loading whether it is the first loading
    	let status = STATUS.READY;
    	let mounted = false;
    	let thisElement;
    	let scrollParent;

    	const stateChanger = {
    		loaded: async () => {
    			$$invalidate(1, isFirstLoad = false);

    			if (direction === 'top') {
    				// wait for DOM updated
    				await tick();

    				scrollBarStorage.restore(scrollParent);
    			}

    			if (status === STATUS.LOADING) {
    				await tick();
    				await attemptLoad(true);
    			}
    		},
    		complete: async () => {
    			$$invalidate(12, status = STATUS.COMPLETE);

    			// force re-complation computed properties to fix the problem of get slot text delay
    			await tick();

    			scrollParent.removeEventListener('scroll', scrollHandler, thirdEventArg);
    		},
    		reset: async () => {
    			$$invalidate(12, status = STATUS.READY);
    			$$invalidate(1, isFirstLoad = true);
    			scrollBarStorage.remove(scrollParent);
    			scrollParent.addEventListener('scroll', scrollHandler, thirdEventArg);

    			// wait for list to be empty and the empty action may trigger a scroll event
    			setTimeout(
    				() => {
    					throttler.reset();
    					scrollHandler();
    				},
    				1
    			);
    		},
    		error: () => {
    			$$invalidate(12, status = STATUS.ERROR);
    			throttler.reset();
    		}
    	};

    	function scrollHandler(event) {
    		if (status === STATUS.READY) {
    			if (event && event.constructor === Event && isVisible(thisElement)) {
    				throttler.throttle(attemptLoad);
    			} else {
    				attemptLoad();
    			}
    		}
    	}

    	// Attempt to trigger load
    	async function attemptLoad(isContinuousCall) {
    		if (status !== STATUS.COMPLETE && isVisible(thisElement) && getCurrentDistance() <= distance) {
    			$$invalidate(12, status = STATUS.LOADING);

    			if (direction === 'top') {
    				// wait for spinner display
    				await tick();

    				scrollBarStorage.save(scrollParent);
    			}

    			dispatch('infinite', stateChanger);

    			if (isContinuousCall && !forceUseInfiniteWrapper && !loopTracker.isChecked) {
    				// check this component whether be in an infinite loop if it is not checked
    				loopTracker.track();
    			}
    		} else if (status === STATUS.LOADING) {
    			$$invalidate(12, status = STATUS.READY);
    		}
    	}

    	// Get current distance from the specified direction
    	function getCurrentDistance() {
    		let distance;

    		if (direction === 'top') {
    			distance = typeof scrollParent.scrollTop === 'number'
    			? scrollParent.scrollTop
    			: scrollParent.pageYOffset;
    		} else {
    			const infiniteElementOffsetTopFromBottom = thisElement.getBoundingClientRect().top;

    			const scrollElementOffsetTopFromBottom = scrollParent === window
    			? window.innerHeight
    			: scrollParent.getBoundingClientRect().bottom;

    			distance = infiniteElementOffsetTopFromBottom - scrollElementOffsetTopFromBottom;
    		}

    		return distance;
    	}

    	// Get the first scroll parent of an element
    	function getScrollParent(element = thisElement) {
    		let result;

    		if (typeof forceUseInfiniteWrapper === 'string') {
    			result = document.querySelector(forceUseInfiniteWrapper);
    		}

    		if (!result) {
    			if (element.tagName === 'BODY') {
    				result = window;
    			} else if (!forceUseInfiniteWrapper && ['scroll', 'auto'].indexOf(getComputedStyle(element).overflowY) > -1) {
    				result = element;
    			} else if (element.hasAttribute('infinite-wrapper') || element.hasAttribute('data-infinite-wrapper')) {
    				result = element;
    			}
    		}

    		return result || getScrollParent(element.parentNode);
    	}

    	function updateScrollParent() {
    		if (mounted) scrollParent = getScrollParent();
    	}

    	function identifierUpdated() {
    		if (mounted) stateChanger.reset();
    	}

    	onMount(async () => {
    		$$invalidate(13, mounted = true);

    		setTimeout(
    			() => {
    				scrollHandler();
    				scrollParent.addEventListener('scroll', scrollHandler, thirdEventArg);
    			},
    			1
    		);
    	});

    	onDestroy(() => {
    		if (mounted && status !== STATUS.COMPLETE) {
    			throttler.reset();
    			scrollBarStorage.remove(scrollParent);
    			scrollParent.removeEventListener('scroll', scrollHandler, thirdEventArg);
    		}
    	});

    	const writable_props = ['distance', 'spinner', 'direction', 'forceUseInfiniteWrapper', 'identifier'];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<InfiniteLoading> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thisElement = $$value;
    			$$invalidate(2, thisElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('distance' in $$props) $$invalidate(8, distance = $$props.distance);
    		if ('spinner' in $$props) $$invalidate(0, spinner = $$props.spinner);
    		if ('direction' in $$props) $$invalidate(9, direction = $$props.direction);
    		if ('forceUseInfiniteWrapper' in $$props) $$invalidate(10, forceUseInfiniteWrapper = $$props.forceUseInfiniteWrapper);
    		if ('identifier' in $$props) $$invalidate(11, identifier = $$props.identifier);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		THROTTLE_LIMIT,
    		LOOP_CHECK_TIMEOUT,
    		LOOP_CHECK_MAX_CALLS,
    		ERROR_INFINITE_LOOP,
    		thirdEventArg,
    		throttler,
    		loopTracker,
    		scrollBarStorage,
    		isVisible,
    		onMount,
    		onDestroy,
    		tick,
    		createEventDispatcher,
    		Spinner: Spinner$1,
    		dispatch,
    		STATUS,
    		distance,
    		spinner,
    		direction,
    		forceUseInfiniteWrapper,
    		identifier,
    		isFirstLoad,
    		status,
    		mounted,
    		thisElement,
    		scrollParent,
    		stateChanger,
    		scrollHandler,
    		attemptLoad,
    		getCurrentDistance,
    		getScrollParent,
    		updateScrollParent,
    		identifierUpdated,
    		showNoMore,
    		showNoResults,
    		showError,
    		showSpinner
    	});

    	$$self.$inject_state = $$props => {
    		if ('distance' in $$props) $$invalidate(8, distance = $$props.distance);
    		if ('spinner' in $$props) $$invalidate(0, spinner = $$props.spinner);
    		if ('direction' in $$props) $$invalidate(9, direction = $$props.direction);
    		if ('forceUseInfiniteWrapper' in $$props) $$invalidate(10, forceUseInfiniteWrapper = $$props.forceUseInfiniteWrapper);
    		if ('identifier' in $$props) $$invalidate(11, identifier = $$props.identifier);
    		if ('isFirstLoad' in $$props) $$invalidate(1, isFirstLoad = $$props.isFirstLoad);
    		if ('status' in $$props) $$invalidate(12, status = $$props.status);
    		if ('mounted' in $$props) $$invalidate(13, mounted = $$props.mounted);
    		if ('thisElement' in $$props) $$invalidate(2, thisElement = $$props.thisElement);
    		if ('scrollParent' in $$props) scrollParent = $$props.scrollParent;
    		if ('showNoMore' in $$props) $$invalidate(3, showNoMore = $$props.showNoMore);
    		if ('showNoResults' in $$props) $$invalidate(4, showNoResults = $$props.showNoResults);
    		if ('showError' in $$props) $$invalidate(5, showError = $$props.showError);
    		if ('showSpinner' in $$props) $$invalidate(6, showSpinner = $$props.showSpinner);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*status*/ 4096) {
    			$$invalidate(6, showSpinner = status === STATUS.LOADING);
    		}

    		if ($$self.$$.dirty & /*status*/ 4096) {
    			$$invalidate(5, showError = status === STATUS.ERROR);
    		}

    		if ($$self.$$.dirty & /*status, isFirstLoad*/ 4098) {
    			$$invalidate(4, showNoResults = status === STATUS.COMPLETE && isFirstLoad);
    		}

    		if ($$self.$$.dirty & /*status, isFirstLoad*/ 4098) {
    			$$invalidate(3, showNoMore = status === STATUS.COMPLETE && !isFirstLoad);
    		}

    		if ($$self.$$.dirty & /*forceUseInfiniteWrapper, mounted*/ 9216) {
    			// Watch forceUseInfiniteWrapper and mounted
    			(updateScrollParent());
    		}

    		if ($$self.$$.dirty & /*identifier, mounted*/ 10240) {
    			// Watch identifier and mounted
    			(identifierUpdated());
    		}
    	};

    	return [
    		spinner,
    		isFirstLoad,
    		thisElement,
    		showNoMore,
    		showNoResults,
    		showError,
    		showSpinner,
    		attemptLoad,
    		distance,
    		direction,
    		forceUseInfiniteWrapper,
    		identifier,
    		status,
    		mounted,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class InfiniteLoading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {
    			distance: 8,
    			spinner: 0,
    			direction: 9,
    			forceUseInfiniteWrapper: 10,
    			identifier: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfiniteLoading",
    			options,
    			id: create_fragment$F.name
    		});
    	}

    	get distance() {
    		throw new Error("<InfiniteLoading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set distance(value) {
    		throw new Error("<InfiniteLoading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinner() {
    		throw new Error("<InfiniteLoading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinner(value) {
    		throw new Error("<InfiniteLoading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<InfiniteLoading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<InfiniteLoading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get forceUseInfiniteWrapper() {
    		throw new Error("<InfiniteLoading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set forceUseInfiniteWrapper(value) {
    		throw new Error("<InfiniteLoading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get identifier() {
    		throw new Error("<InfiniteLoading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set identifier(value) {
    		throw new Error("<InfiniteLoading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\Update.svelte generated by Svelte v3.46.6 */

    const file$B = "node_modules\\svelte-material-icons\\Update.svelte";

    function create_fragment$E(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$B, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$B, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Update', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Update> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Update extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Update",
    			options,
    			id: create_fragment$E.name
    		});
    	}

    	get size() {
    		throw new Error("<Update>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Update>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Update>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Update>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Update>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Update>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Update>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Update>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Update>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Update>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pills\Turns.svelte generated by Svelte v3.46.6 */

    // (6:0) <Pill    value={turns}    color='white'    backgroundColor='#D32F2F'  >
    function create_default_slot$d(ctx) {
    	let update;
    	let current;
    	update = new Update({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(update.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(update, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(update.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(update.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(update, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(6:0) <Pill    value={turns}    color='white'    backgroundColor='#D32F2F'  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let pill;
    	let current;

    	pill = new Pill({
    			props: {
    				value: /*turns*/ ctx[0],
    				color: "white",
    				backgroundColor: "#D32F2F",
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pill.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(pill, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const pill_changes = {};
    			if (dirty & /*turns*/ 1) pill_changes.value = /*turns*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				pill_changes.$$scope = { dirty, ctx };
    			}

    			pill.$set(pill_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pill.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pill.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pill, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Turns', slots, []);
    	let { turns } = $$props;
    	const writable_props = ['turns'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Turns> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('turns' in $$props) $$invalidate(0, turns = $$props.turns);
    	};

    	$$self.$capture_state = () => ({ Update, Pill, turns });

    	$$self.$inject_state = $$props => {
    		if ('turns' in $$props) $$invalidate(0, turns = $$props.turns);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [turns];
    }

    class Turns extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, { turns: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Turns",
    			options,
    			id: create_fragment$D.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*turns*/ ctx[0] === undefined && !('turns' in props)) {
    			console.warn("<Turns> was created without expected prop 'turns'");
    		}
    	}

    	get turns() {
    		throw new Error("<Turns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set turns(value) {
    		throw new Error("<Turns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\icons\Tile.svelte generated by Svelte v3.46.6 */

    const file$A = "src\\icons\\Tile.svelte";

    function create_fragment$C(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.17 15.5h5.64l1.14 3h2.09l-5.11-13h-1.86l-5.11 13h2.09l1.12-3zM12 7.98l2.07 5.52H9.93L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z");
    			add_location(path, file$A, 8, 72, 255);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			attr_dev(svg, "fill", /*color*/ ctx[2]);
    			add_location(svg, file$A, 8, 0, 183);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 4) {
    				attr_dev(svg, "fill", /*color*/ ctx[2]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tile', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tile> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Tile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tile",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get size() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pills\Words.svelte generated by Svelte v3.46.6 */

    // (7:0) <Pill    value={numWords}    color='black'    backgroundColor='#81C784'  >
    function create_default_slot$c(ctx) {
    	let tile;
    	let current;

    	tile = new Tile({
    			props: { color: "black" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tile, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(7:0) <Pill    value={numWords}    color='black'    backgroundColor='#81C784'  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let pill;
    	let current;

    	pill = new Pill({
    			props: {
    				value: /*numWords*/ ctx[0],
    				color: "black",
    				backgroundColor: "#81C784",
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pill.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(pill, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const pill_changes = {};
    			if (dirty & /*numWords*/ 1) pill_changes.value = /*numWords*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				pill_changes.$$scope = { dirty, ctx };
    			}

    			pill.$set(pill_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pill.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pill.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pill, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Words', slots, []);
    	let { numWords } = $$props;
    	const writable_props = ['numWords'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Words> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('numWords' in $$props) $$invalidate(0, numWords = $$props.numWords);
    	};

    	$$self.$capture_state = () => ({ Pill, Tile, numWords });

    	$$self.$inject_state = $$props => {
    		if ('numWords' in $$props) $$invalidate(0, numWords = $$props.numWords);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [numWords];
    }

    class Words extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { numWords: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Words",
    			options,
    			id: create_fragment$B.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*numWords*/ ctx[0] === undefined && !('numWords' in props)) {
    			console.warn("<Words> was created without expected prop 'numWords'");
    		}
    	}

    	get numWords() {
    		throw new Error("<Words>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numWords(value) {
    		throw new Error("<Words>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\BoardTile.svelte generated by Svelte v3.46.6 */
    const file$z = "src\\BoardTile.svelte";

    // (31:2) {#if multiplier > 1}
    function create_if_block$d(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let close;
    	let current;

    	close = new Close({
    			props: { size: "0.625em" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*multiplier*/ ctx[6]);
    			t1 = space();
    			create_component(close.$$.fragment);
    			attr_dev(span, "class", "multiplier svelte-zb5ym7");
    			toggle_class(span, "two", /*multiplier*/ ctx[6] === 2);
    			toggle_class(span, "three", /*multiplier*/ ctx[6] === 3);
    			add_location(span, file$z, 31, 4, 962);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			mount_component(close, span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*multiplier*/ 64) set_data_dev(t0, /*multiplier*/ ctx[6]);

    			if (dirty & /*multiplier*/ 64) {
    				toggle_class(span, "two", /*multiplier*/ ctx[6] === 2);
    			}

    			if (dirty & /*multiplier*/ 64) {
    				toggle_class(span, "three", /*multiplier*/ ctx[6] === 3);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(close);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(31:2) {#if multiplier > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let div;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = scoreTile(/*letter*/ ctx[0]) + "";
    	let t2;
    	let t3;
    	let current;
    	let if_block = /*multiplier*/ ctx[6] > 1 && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text(/*letter*/ ctx[0]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			add_location(span0, file$z, 28, 2, 863);
    			attr_dev(span1, "class", "score svelte-zb5ym7");
    			add_location(span1, file$z, 29, 2, 888);
    			attr_dev(div, "class", "tile svelte-zb5ym7");
    			toggle_class(div, "selected", /*selected*/ ctx[2]);
    			toggle_class(div, "adjacent", /*adjacent*/ ctx[3] && !/*selected*/ ctx[2]);
    			toggle_class(div, "non-adjacent", /*active*/ ctx[1] && !/*adjacent*/ ctx[3] && !/*selected*/ ctx[2]);
    			toggle_class(div, "matched", /*highlighted*/ ctx[4] === 'green');
    			toggle_class(div, "bonus", /*highlighted*/ ctx[4] === 'purple');
    			toggle_class(div, "intersection", /*highlighted*/ ctx[4] === 'red');
    			toggle_class(div, "long", /*highlighted*/ ctx[4] === 'orange');
    			toggle_class(div, "tiny", /*size*/ ctx[5] === 'tiny');
    			toggle_class(div, "small", /*size*/ ctx[5] === 'small');
    			toggle_class(div, "large", /*size*/ ctx[5] === 'large');
    			add_location(div, file$z, 15, 0, 438);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    			append_dev(div, t3);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*letter*/ 1) set_data_dev(t0, /*letter*/ ctx[0]);
    			if ((!current || dirty & /*letter*/ 1) && t2_value !== (t2_value = scoreTile(/*letter*/ ctx[0]) + "")) set_data_dev(t2, t2_value);

    			if (/*multiplier*/ ctx[6] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*multiplier*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*selected*/ 4) {
    				toggle_class(div, "selected", /*selected*/ ctx[2]);
    			}

    			if (dirty & /*adjacent, selected*/ 12) {
    				toggle_class(div, "adjacent", /*adjacent*/ ctx[3] && !/*selected*/ ctx[2]);
    			}

    			if (dirty & /*active, adjacent, selected*/ 14) {
    				toggle_class(div, "non-adjacent", /*active*/ ctx[1] && !/*adjacent*/ ctx[3] && !/*selected*/ ctx[2]);
    			}

    			if (dirty & /*highlighted*/ 16) {
    				toggle_class(div, "matched", /*highlighted*/ ctx[4] === 'green');
    			}

    			if (dirty & /*highlighted*/ 16) {
    				toggle_class(div, "bonus", /*highlighted*/ ctx[4] === 'purple');
    			}

    			if (dirty & /*highlighted*/ 16) {
    				toggle_class(div, "intersection", /*highlighted*/ ctx[4] === 'red');
    			}

    			if (dirty & /*highlighted*/ 16) {
    				toggle_class(div, "long", /*highlighted*/ ctx[4] === 'orange');
    			}

    			if (dirty & /*size*/ 32) {
    				toggle_class(div, "tiny", /*size*/ ctx[5] === 'tiny');
    			}

    			if (dirty & /*size*/ 32) {
    				toggle_class(div, "small", /*size*/ ctx[5] === 'small');
    			}

    			if (dirty & /*size*/ 32) {
    				toggle_class(div, "large", /*size*/ ctx[5] === 'large');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BoardTile', slots, []);
    	let { letter } = $$props;
    	let { active = false } = $$props;
    	let { selected = false } = $$props;
    	let { adjacent = false } = $$props;
    	let { highlighted = undefined } = $$props;
    	let { size = 'large' } = $$props;
    	let { multiplier = 1 } = $$props;

    	const handleSwipe = e => {
    		
    	}; //console.log(e);
    	//console.log(e.detail.direction);

    	const writable_props = [
    		'letter',
    		'active',
    		'selected',
    		'adjacent',
    		'highlighted',
    		'size',
    		'multiplier'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BoardTile> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('letter' in $$props) $$invalidate(0, letter = $$props.letter);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    		if ('adjacent' in $$props) $$invalidate(3, adjacent = $$props.adjacent);
    		if ('highlighted' in $$props) $$invalidate(4, highlighted = $$props.highlighted);
    		if ('size' in $$props) $$invalidate(5, size = $$props.size);
    		if ('multiplier' in $$props) $$invalidate(6, multiplier = $$props.multiplier);
    	};

    	$$self.$capture_state = () => ({
    		Close,
    		scoreTile,
    		letter,
    		active,
    		selected,
    		adjacent,
    		highlighted,
    		size,
    		multiplier,
    		handleSwipe
    	});

    	$$self.$inject_state = $$props => {
    		if ('letter' in $$props) $$invalidate(0, letter = $$props.letter);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    		if ('adjacent' in $$props) $$invalidate(3, adjacent = $$props.adjacent);
    		if ('highlighted' in $$props) $$invalidate(4, highlighted = $$props.highlighted);
    		if ('size' in $$props) $$invalidate(5, size = $$props.size);
    		if ('multiplier' in $$props) $$invalidate(6, multiplier = $$props.multiplier);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [letter, active, selected, adjacent, highlighted, size, multiplier];
    }

    class BoardTile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {
    			letter: 0,
    			active: 1,
    			selected: 2,
    			adjacent: 3,
    			highlighted: 4,
    			size: 5,
    			multiplier: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BoardTile",
    			options,
    			id: create_fragment$A.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*letter*/ ctx[0] === undefined && !('letter' in props)) {
    			console.warn("<BoardTile> was created without expected prop 'letter'");
    		}
    	}

    	get letter() {
    		throw new Error("<BoardTile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set letter(value) {
    		throw new Error("<BoardTile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<BoardTile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<BoardTile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<BoardTile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<BoardTile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get adjacent() {
    		throw new Error("<BoardTile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set adjacent(value) {
    		throw new Error("<BoardTile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<BoardTile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<BoardTile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<BoardTile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<BoardTile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiplier() {
    		throw new Error("<BoardTile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiplier(value) {
    		throw new Error("<BoardTile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\StaticWord.svelte generated by Svelte v3.46.6 */
    const file$y = "src\\StaticWord.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each word as tile (tile.id)}
    function create_each_block$7(key_1, ctx) {
    	let first;
    	let boardtile;
    	let current;

    	boardtile = new BoardTile({
    			props: {
    				id: /*tile*/ ctx[1].id,
    				active: false,
    				adjacent: false,
    				letter: /*tile*/ ctx[1].letter,
    				selected: false,
    				multiplier: /*tile*/ ctx[1].multiplier,
    				highlighted: "green",
    				size: "small"
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(boardtile.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(boardtile, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const boardtile_changes = {};
    			if (dirty & /*word*/ 1) boardtile_changes.id = /*tile*/ ctx[1].id;
    			if (dirty & /*word*/ 1) boardtile_changes.letter = /*tile*/ ctx[1].letter;
    			if (dirty & /*word*/ 1) boardtile_changes.multiplier = /*tile*/ ctx[1].multiplier;
    			boardtile.$set(boardtile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boardtile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boardtile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(boardtile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(6:2) {#each word as tile (tile.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*word*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*tile*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$7, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$7(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$7(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "container svelte-1wzq7ec");
    			add_location(div, file$y, 4, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*word*/ 1) {
    				each_value = /*word*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$7, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$7, null, get_each_context$7);
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
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StaticWord', slots, []);
    	let { word } = $$props;
    	const writable_props = ['word'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StaticWord> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('word' in $$props) $$invalidate(0, word = $$props.word);
    	};

    	$$self.$capture_state = () => ({ BoardTile, word });

    	$$self.$inject_state = $$props => {
    		if ('word' in $$props) $$invalidate(0, word = $$props.word);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [word];
    }

    class StaticWord extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { word: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StaticWord",
    			options,
    			id: create_fragment$z.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*word*/ ctx[0] === undefined && !('word' in props)) {
    			console.warn("<StaticWord> was created without expected prop 'word'");
    		}
    	}

    	get word() {
    		throw new Error("<StaticWord>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set word(value) {
    		throw new Error("<StaticWord>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\leaderboard\Entry.svelte generated by Svelte v3.46.6 */
    const file$x = "src\\leaderboard\\Entry.svelte";

    // (38:8) {#if position !== undefined}
    function create_if_block_1$2(ctx) {
    	let t0;
    	let t1_value = /*position*/ ctx[2] + 1 + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("#");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*position*/ 4 && t1_value !== (t1_value = /*position*/ ctx[2] + 1 + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(38:8) {#if position !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (49:6) {#if entry.numWords}
    function create_if_block$c(ctx) {
    	let words;
    	let current;

    	words = new Words({
    			props: { numWords: /*entry*/ ctx[0].numWords },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(words.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(words, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const words_changes = {};
    			if (dirty & /*entry*/ 1) words_changes.numWords = /*entry*/ ctx[0].numWords;
    			words.$set(words_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(words.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(words.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(words, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(49:6) {#if entry.numWords}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let div6;
    	let div1;
    	let div0;
    	let h20;
    	let t0;
    	let h3;
    	let t1_value = /*entry*/ ctx[0].userName + "";
    	let t1;
    	let t2;
    	let h21;
    	let t3_value = /*entry*/ ctx[0].score + "";
    	let t3;
    	let t4;
    	let div3;
    	let div2;
    	let turns;
    	let t5;
    	let t6;
    	let wordchain;
    	let t7;
    	let streak;
    	let t8;
    	let div4;
    	let staticword;
    	let t9;
    	let h50;
    	let t10;
    	let t11_value = scoreWord(/*entry*/ ctx[0].bestWord) + "";
    	let t11;
    	let t12;
    	let div5;
    	let h51;
    	let t13_value = /*formatDate*/ ctx[5](/*parseDate*/ ctx[4](/*entry*/ ctx[0].date)) + "";
    	let t13;
    	let div6_id_value;
    	let current;
    	let if_block0 = /*position*/ ctx[2] !== undefined && create_if_block_1$2(ctx);

    	turns = new Turns({
    			props: { turns: /*entry*/ ctx[0].numTurns },
    			$$inline: true
    		});

    	let if_block1 = /*entry*/ ctx[0].numWords && create_if_block$c(ctx);

    	wordchain = new WordChain({
    			props: { chain: /*entry*/ ctx[0].bestChain },
    			$$inline: true
    		});

    	streak = new Streak({
    			props: { streak: /*entry*/ ctx[0].bestStreak },
    			$$inline: true
    		});

    	staticword = new StaticWord({
    			props: {
    				word: /*entry*/ ctx[0].bestWord.map(/*func*/ ctx[6])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			h21 = element("h2");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			create_component(turns.$$.fragment);
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			create_component(wordchain.$$.fragment);
    			t7 = space();
    			create_component(streak.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			create_component(staticword.$$.fragment);
    			t9 = space();
    			h50 = element("h5");
    			t10 = text("+");
    			t11 = text(t11_value);
    			t12 = space();
    			div5 = element("div");
    			h51 = element("h5");
    			t13 = text(t13_value);
    			attr_dev(h20, "class", "rank svelte-1dofynj");
    			add_location(h20, file$x, 36, 6, 987);
    			attr_dev(h3, "class", "name svelte-1dofynj");
    			add_location(h3, file$x, 41, 6, 1103);
    			attr_dev(h21, "class", "score svelte-1dofynj");
    			add_location(h21, file$x, 42, 6, 1147);
    			attr_dev(div0, "class", "topline svelte-1dofynj");
    			add_location(div0, file$x, 35, 4, 960);
    			attr_dev(div1, "class", "row svelte-1dofynj");
    			add_location(div1, file$x, 34, 2, 939);
    			attr_dev(div2, "class", "pills svelte-1dofynj");
    			add_location(div2, file$x, 46, 4, 1228);
    			attr_dev(div3, "class", "row svelte-1dofynj");
    			add_location(div3, file$x, 45, 2, 1207);
    			attr_dev(h50, "class", "svelte-1dofynj");
    			add_location(h50, file$x, 57, 4, 1595);
    			attr_dev(div4, "class", "row svelte-1dofynj");
    			add_location(div4, file$x, 55, 2, 1486);
    			attr_dev(h51, "class", "date svelte-1dofynj");
    			add_location(h51, file$x, 60, 4, 1667);
    			attr_dev(div5, "class", "row svelte-1dofynj");
    			add_location(div5, file$x, 59, 2, 1646);
    			attr_dev(div6, "id", div6_id_value = /*entry*/ ctx[0].id);
    			attr_dev(div6, "class", "container svelte-1dofynj");
    			toggle_class(div6, "selected", /*current*/ ctx[1]);
    			add_location(div6, file$x, 28, 0, 845);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h20);
    			if (if_block0) if_block0.m(h20, null);
    			append_dev(div0, t0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div0, t2);
    			append_dev(div0, h21);
    			append_dev(h21, t3);
    			append_dev(div6, t4);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			mount_component(turns, div2, null);
    			append_dev(div2, t5);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t6);
    			mount_component(wordchain, div2, null);
    			append_dev(div2, t7);
    			mount_component(streak, div2, null);
    			append_dev(div6, t8);
    			append_dev(div6, div4);
    			mount_component(staticword, div4, null);
    			append_dev(div4, t9);
    			append_dev(div4, h50);
    			append_dev(h50, t10);
    			append_dev(h50, t11);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div5, h51);
    			append_dev(h51, t13);
    			/*div6_binding*/ ctx[7](div6);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*position*/ ctx[2] !== undefined) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(h20, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*entry*/ 1) && t1_value !== (t1_value = /*entry*/ ctx[0].userName + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*entry*/ 1) && t3_value !== (t3_value = /*entry*/ ctx[0].score + "")) set_data_dev(t3, t3_value);
    			const turns_changes = {};
    			if (dirty & /*entry*/ 1) turns_changes.turns = /*entry*/ ctx[0].numTurns;
    			turns.$set(turns_changes);

    			if (/*entry*/ ctx[0].numWords) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*entry*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$c(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t6);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const wordchain_changes = {};
    			if (dirty & /*entry*/ 1) wordchain_changes.chain = /*entry*/ ctx[0].bestChain;
    			wordchain.$set(wordchain_changes);
    			const streak_changes = {};
    			if (dirty & /*entry*/ 1) streak_changes.streak = /*entry*/ ctx[0].bestStreak;
    			streak.$set(streak_changes);
    			const staticword_changes = {};
    			if (dirty & /*entry*/ 1) staticword_changes.word = /*entry*/ ctx[0].bestWord.map(/*func*/ ctx[6]);
    			staticword.$set(staticword_changes);
    			if ((!current || dirty & /*entry*/ 1) && t11_value !== (t11_value = scoreWord(/*entry*/ ctx[0].bestWord) + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*entry*/ 1) && t13_value !== (t13_value = /*formatDate*/ ctx[5](/*parseDate*/ ctx[4](/*entry*/ ctx[0].date)) + "")) set_data_dev(t13, t13_value);

    			if (!current || dirty & /*entry*/ 1 && div6_id_value !== (div6_id_value = /*entry*/ ctx[0].id)) {
    				attr_dev(div6, "id", div6_id_value);
    			}

    			if (dirty & /*current*/ 2) {
    				toggle_class(div6, "selected", /*current*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(turns.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(wordchain.$$.fragment, local);
    			transition_in(streak.$$.fragment, local);
    			transition_in(staticword.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(turns.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(wordchain.$$.fragment, local);
    			transition_out(streak.$$.fragment, local);
    			transition_out(staticword.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block0) if_block0.d();
    			destroy_component(turns);
    			if (if_block1) if_block1.d();
    			destroy_component(wordchain);
    			destroy_component(streak);
    			destroy_component(staticword);
    			/*div6_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Entry', slots, []);
    	let { entry } = $$props;
    	let { current } = $$props;
    	let { position } = $$props;
    	let ref;

    	onMount(() => {
    		if (ref && current) {
    			ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    		}
    	});

    	const parseDate = timestamp => typeof timestamp === 'string'
    	? new Date(timestamp)
    	: new Date(timestamp.seconds * 1000);

    	const formatDate = date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    	const writable_props = ['entry', 'current', 'position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Entry> was created with unknown prop '${key}'`);
    	});

    	const func = tile => ({ ...tile, id: Math.random() });

    	function div6_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(3, ref);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('entry' in $$props) $$invalidate(0, entry = $$props.entry);
    		if ('current' in $$props) $$invalidate(1, current = $$props.current);
    		if ('position' in $$props) $$invalidate(2, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({
    		Streak,
    		WordChain,
    		scoreWord,
    		Turns,
    		Words,
    		StaticWord,
    		onMount,
    		entry,
    		current,
    		position,
    		ref,
    		parseDate,
    		formatDate
    	});

    	$$self.$inject_state = $$props => {
    		if ('entry' in $$props) $$invalidate(0, entry = $$props.entry);
    		if ('current' in $$props) $$invalidate(1, current = $$props.current);
    		if ('position' in $$props) $$invalidate(2, position = $$props.position);
    		if ('ref' in $$props) $$invalidate(3, ref = $$props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entry, current, position, ref, parseDate, formatDate, func, div6_binding];
    }

    class Entry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { entry: 0, current: 1, position: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Entry",
    			options,
    			id: create_fragment$y.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*entry*/ ctx[0] === undefined && !('entry' in props)) {
    			console.warn("<Entry> was created without expected prop 'entry'");
    		}

    		if (/*current*/ ctx[1] === undefined && !('current' in props)) {
    			console.warn("<Entry> was created without expected prop 'current'");
    		}

    		if (/*position*/ ctx[2] === undefined && !('position' in props)) {
    			console.warn("<Entry> was created without expected prop 'position'");
    		}
    	}

    	get entry() {
    		throw new Error("<Entry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry(value) {
    		throw new Error("<Entry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current() {
    		throw new Error("<Entry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current(value) {
    		throw new Error("<Entry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Entry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Entry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Spinner.svelte generated by Svelte v3.46.6 */

    const file$w = "src\\components\\Spinner.svelte";

    function create_fragment$x(ctx) {
    	let div4;
    	let div0;
    	let div1;
    	let div2;
    	let div3;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			div1 = element("div");
    			div2 = element("div");
    			div3 = element("div");
    			attr_dev(div0, "class", "svelte-1moldmh");
    			add_location(div0, file$w, 1, 2, 30);
    			attr_dev(div1, "class", "svelte-1moldmh");
    			add_location(div1, file$w, 1, 9, 37);
    			attr_dev(div2, "class", "svelte-1moldmh");
    			add_location(div2, file$w, 1, 16, 44);
    			attr_dev(div3, "class", "svelte-1moldmh");
    			add_location(div3, file$w, 1, 23, 51);
    			attr_dev(div4, "class", "lds-ellipsis svelte-1moldmh");
    			add_location(div4, file$w, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, div1);
    			append_dev(div4, div2);
    			append_dev(div4, div3);
    		},
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spinner', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spinner> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Spinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinner",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* src\leaderboard\EntryList.svelte generated by Svelte v3.46.6 */
    const file$v = "src\\leaderboard\\EntryList.svelte";

    // (30:4) 
    function create_noResults_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "slot", "noResults");
    			add_location(div, file$v, 29, 4, 930);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_noResults_slot_1.name,
    		type: "slot",
    		source: "(30:4) ",
    		ctx
    	});

    	return block;
    }

    // (31:4) 
    function create_spinner_slot_1(ctx) {
    	let spinner;
    	let current;

    	spinner = new Spinner({
    			props: { slot: "spinner" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_spinner_slot_1.name,
    		type: "slot",
    		source: "(31:4) ",
    		ctx
    	});

    	return block;
    }

    // (25:2) 
    function create_header_slot(ctx) {
    	let infiniteloading;
    	let current;

    	infiniteloading = new InfiniteLoading({
    			props: {
    				slot: "header",
    				direction: "top",
    				$$slots: {
    					spinner: [create_spinner_slot_1],
    					noResults: [create_noResults_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	infiniteloading.$on("infinite", /*infinite_handler_1*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(infiniteloading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(infiniteloading, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const infiniteloading_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				infiniteloading_changes.$$scope = { dirty, ctx };
    			}

    			infiniteloading.$set(infiniteloading_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infiniteloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infiniteloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(infiniteloading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(25:2) ",
    		ctx
    	});

    	return block;
    }

    // (33:2) 
    function create_item_slot(ctx) {
    	let div;
    	let entry;
    	let div_style_value;
    	let current;

    	entry = new Entry({
    			props: {
    				entry: /*entries*/ ctx[2][/*index*/ ctx[8]],
    				current: (/*entries*/ ctx[2][/*index*/ ctx[8]].id ?? /*entries*/ ctx[2][/*index*/ ctx[8]].gameId) === /*currGameId*/ ctx[1],
    				position: /*relative*/ ctx[0] ? undefined : /*index*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(entry.$$.fragment);
    			attr_dev(div, "slot", "item");
    			attr_dev(div, "style", div_style_value = /*style*/ ctx[7]);
    			add_location(div, file$v, 32, 2, 1012);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(entry, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const entry_changes = {};
    			if (dirty & /*entries, index*/ 260) entry_changes.entry = /*entries*/ ctx[2][/*index*/ ctx[8]];
    			if (dirty & /*entries, index, currGameId*/ 262) entry_changes.current = (/*entries*/ ctx[2][/*index*/ ctx[8]].id ?? /*entries*/ ctx[2][/*index*/ ctx[8]].gameId) === /*currGameId*/ ctx[1];
    			if (dirty & /*relative, index*/ 257) entry_changes.position = /*relative*/ ctx[0] ? undefined : /*index*/ ctx[8];
    			entry.$set(entry_changes);

    			if (!current || dirty & /*style*/ 128 && div_style_value !== (div_style_value = /*style*/ ctx[7])) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entry.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entry.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(entry);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_item_slot.name,
    		type: "slot",
    		source: "(33:2) ",
    		ctx
    	});

    	return block;
    }

    // (50:4) 
    function create_noResults_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "slot", "noResults");
    			add_location(div, file$v, 49, 4, 1387);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_noResults_slot.name,
    		type: "slot",
    		source: "(50:4) ",
    		ctx
    	});

    	return block;
    }

    // (51:4) 
    function create_spinner_slot(ctx) {
    	let spinner;
    	let current;

    	spinner = new Spinner({
    			props: { slot: "spinner" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_spinner_slot.name,
    		type: "slot",
    		source: "(51:4) ",
    		ctx
    	});

    	return block;
    }

    // (45:2) 
    function create_footer_slot(ctx) {
    	let infiniteloading;
    	let current;

    	infiniteloading = new InfiniteLoading({
    			props: {
    				slot: "footer",
    				direction: "bottom",
    				$$slots: {
    					spinner: [create_spinner_slot],
    					noResults: [create_noResults_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	infiniteloading.$on("infinite", /*infinite_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(infiniteloading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(infiniteloading, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const infiniteloading_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				infiniteloading_changes.$$scope = { dirty, ctx };
    			}

    			infiniteloading.$set(infiniteloading_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infiniteloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infiniteloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(infiniteloading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(45:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let virtuallist;
    	let current;

    	virtuallist = new VirtualList({
    			props: {
    				width: "100%",
    				height: /*listHeight*/ ctx[4],
    				itemCount: /*entries*/ ctx[2].length,
    				itemSize: 180,
    				overscanCount: 15,
    				$$slots: {
    					footer: [create_footer_slot],
    					item: [
    						create_item_slot,
    						({ style, index }) => ({ 7: style, 8: index }),
    						({ style, index }) => (style ? 128 : 0) | (index ? 256 : 0)
    					],
    					header: [create_header_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(virtuallist.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(virtuallist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const virtuallist_changes = {};
    			if (dirty & /*listHeight*/ 16) virtuallist_changes.height = /*listHeight*/ ctx[4];
    			if (dirty & /*entries*/ 4) virtuallist_changes.itemCount = /*entries*/ ctx[2].length;

    			if (dirty & /*$$scope, handleInfinite, style, entries, index, currGameId, relative*/ 911) {
    				virtuallist_changes.$$scope = { dirty, ctx };
    			}

    			virtuallist.$set(virtuallist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(virtuallist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(virtuallist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(virtuallist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EntryList', slots, []);
    	let { relative } = $$props;
    	let { currGameId } = $$props;
    	let { entries } = $$props;
    	let { handleInfinite = undefined } = $$props;
    	let listHeight;

    	onMount(() => {
    		var _a, _b;

    		$$invalidate(4, listHeight = (_b = (_a = document.querySelector('#leaderboard .scroll-container-inner')) === null || _a === void 0
    		? void 0
    		: _a.getBoundingClientRect().height) !== null && _b !== void 0
    		? _b
    		: 600);
    	});

    	const writable_props = ['relative', 'currGameId', 'entries', 'handleInfinite'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EntryList> was created with unknown prop '${key}'`);
    	});

    	const infinite_handler = e => handleInfinite('desc', e);
    	const infinite_handler_1 = e => handleInfinite('asc', e);

    	$$self.$$set = $$props => {
    		if ('relative' in $$props) $$invalidate(0, relative = $$props.relative);
    		if ('currGameId' in $$props) $$invalidate(1, currGameId = $$props.currGameId);
    		if ('entries' in $$props) $$invalidate(2, entries = $$props.entries);
    		if ('handleInfinite' in $$props) $$invalidate(3, handleInfinite = $$props.handleInfinite);
    	};

    	$$self.$capture_state = () => ({
    		VirtualList,
    		InfiniteLoading,
    		Entry,
    		onMount,
    		Spinner,
    		relative,
    		currGameId,
    		entries,
    		handleInfinite,
    		listHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ('relative' in $$props) $$invalidate(0, relative = $$props.relative);
    		if ('currGameId' in $$props) $$invalidate(1, currGameId = $$props.currGameId);
    		if ('entries' in $$props) $$invalidate(2, entries = $$props.entries);
    		if ('handleInfinite' in $$props) $$invalidate(3, handleInfinite = $$props.handleInfinite);
    		if ('listHeight' in $$props) $$invalidate(4, listHeight = $$props.listHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		relative,
    		currGameId,
    		entries,
    		handleInfinite,
    		listHeight,
    		infinite_handler,
    		infinite_handler_1
    	];
    }

    class EntryList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			relative: 0,
    			currGameId: 1,
    			entries: 2,
    			handleInfinite: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EntryList",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*relative*/ ctx[0] === undefined && !('relative' in props)) {
    			console.warn("<EntryList> was created without expected prop 'relative'");
    		}

    		if (/*currGameId*/ ctx[1] === undefined && !('currGameId' in props)) {
    			console.warn("<EntryList> was created without expected prop 'currGameId'");
    		}

    		if (/*entries*/ ctx[2] === undefined && !('entries' in props)) {
    			console.warn("<EntryList> was created without expected prop 'entries'");
    		}
    	}

    	get relative() {
    		throw new Error("<EntryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set relative(value) {
    		throw new Error("<EntryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currGameId() {
    		throw new Error("<EntryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currGameId(value) {
    		throw new Error("<EntryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get entries() {
    		throw new Error("<EntryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entries(value) {
    		throw new Error("<EntryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleInfinite() {
    		throw new Error("<EntryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleInfinite(value) {
    		throw new Error("<EntryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\leaderboard\Leaderboard.svelte generated by Svelte v3.46.6 */
    const file$u = "src\\leaderboard\\Leaderboard.svelte";

    // (83:8) <Tab idx={0}>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Global");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(83:8) <Tab idx={0}>",
    		ctx
    	});

    	return block;
    }

    // (84:8) <Tab idx={1}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Personal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(84:8) <Tab idx={1}>",
    		ctx
    	});

    	return block;
    }

    // (82:6) <TabList>
    function create_default_slot_4(ctx) {
    	let tab0;
    	let t;
    	let tab1;
    	let current;

    	tab0 = new Tab({
    			props: {
    				idx: 0,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				idx: 1,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab0.$$.fragment);
    			t = space();
    			create_component(tab1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tab1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tab1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(82:6) <TabList>",
    		ctx
    	});

    	return block;
    }

    // (80:4) 
    function create_title_slot$7(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let tablist;
    	let current;

    	tablist = new TabList({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Leaderboards";
    			t1 = space();
    			create_component(tablist.$$.fragment);
    			add_location(h1, file$u, 80, 6, 2409);
    			attr_dev(div, "slot", "title");
    			add_location(div, file$u, 79, 4, 2385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(tablist, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablist_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tablist_changes.$$scope = { dirty, ctx };
    			}

    			tablist.$set(tablist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tablist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$7.name,
    		type: "slot",
    		source: "(80:4) ",
    		ctx
    	});

    	return block;
    }

    // (96:8) {:else}
    function create_else_block$7(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(96:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (89:8) {#if $loaded}
    function create_if_block$b(ctx) {
    	let entrylist;
    	let current;

    	entrylist = new EntryList({
    			props: {
    				currGameId: /*$game*/ ctx[3].id,
    				relative: /*$game*/ ctx[3].remainingSwaps === 0,
    				entries: /*$entries*/ ctx[0],
    				handleInfinite: /*handleInfinite*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(entrylist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entrylist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const entrylist_changes = {};
    			if (dirty & /*$game*/ 8) entrylist_changes.currGameId = /*$game*/ ctx[3].id;
    			if (dirty & /*$game*/ 8) entrylist_changes.relative = /*$game*/ ctx[3].remainingSwaps === 0;
    			if (dirty & /*$entries*/ 1) entrylist_changes.entries = /*$entries*/ ctx[0];
    			entrylist.$set(entrylist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entrylist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entrylist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entrylist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(89:8) {#if $loaded}",
    		ctx
    	});

    	return block;
    }

    // (88:6) <TabPanel idx={0}>
    function create_default_slot_3$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$loaded*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(88:6) <TabPanel idx={0}>",
    		ctx
    	});

    	return block;
    }

    // (100:6) <TabPanel idx={1}>
    function create_default_slot_2$6(ctx) {
    	let entrylist;
    	let current;

    	entrylist = new EntryList({
    			props: {
    				currGameId: /*$game*/ ctx[3].id,
    				relative: false,
    				entries: /*$localEntries*/ ctx[4],
    				handleInfinite: func$1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(entrylist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entrylist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const entrylist_changes = {};
    			if (dirty & /*$game*/ 8) entrylist_changes.currGameId = /*$game*/ ctx[3].id;
    			if (dirty & /*$localEntries*/ 16) entrylist_changes.entries = /*$localEntries*/ ctx[4];
    			entrylist.$set(entrylist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entrylist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entrylist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entrylist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(100:6) <TabPanel idx={1}>",
    		ctx
    	});

    	return block;
    }

    // (87:4) 
    function create_content_slot$6(ctx) {
    	let div;
    	let tabpanel0;
    	let t;
    	let tabpanel1;
    	let current;

    	tabpanel0 = new TabPanel({
    			props: {
    				idx: 0,
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel1 = new TabPanel({
    			props: {
    				idx: 1,
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tabpanel0.$$.fragment);
    			t = space();
    			create_component(tabpanel1.$$.fragment);
    			attr_dev(div, "slot", "content");
    			attr_dev(div, "class", "content svelte-wgd1zz");
    			add_location(div, file$u, 86, 4, 2555);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tabpanel0, div, null);
    			append_dev(div, t);
    			mount_component(tabpanel1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabpanel0_changes = {};

    			if (dirty & /*$$scope, $game, $entries, $loaded*/ 141) {
    				tabpanel0_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel0.$set(tabpanel0_changes);
    			const tabpanel1_changes = {};

    			if (dirty & /*$$scope, $game, $localEntries*/ 152) {
    				tabpanel1_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel1.$set(tabpanel1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabpanel0.$$.fragment, local);
    			transition_in(tabpanel1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabpanel0.$$.fragment, local);
    			transition_out(tabpanel1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tabpanel0);
    			destroy_component(tabpanel1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$6.name,
    		type: "slot",
    		source: "(87:4) ",
    		ctx
    	});

    	return block;
    }

    // (110:6) <ActionButton onClick={closeLeaderboard}>
    function create_default_slot_1$8(ctx) {
    	let close;
    	let t;
    	let current;
    	close = new Close({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(close.$$.fragment);
    			t = text("\r\n        Close");
    		},
    		m: function mount(target, anchor) {
    			mount_component(close, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(close, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(110:6) <ActionButton onClick={closeLeaderboard}>",
    		ctx
    	});

    	return block;
    }

    // (109:4) 
    function create_controls_slot$7(ctx) {
    	let div;
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: closeLeaderboard,
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(actionbutton.$$.fragment);
    			attr_dev(div, "slot", "controls");
    			add_location(div, file$u, 108, 4, 3158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot$7.name,
    		type: "slot",
    		source: "(109:4) ",
    		ctx
    	});

    	return block;
    }

    // (72:0) <Tabs>
    function create_default_slot$b(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				id: "leaderboard",
    				fullHeight: true,
    				index: 2,
    				open: /*$open*/ ctx[1],
    				onClose: closeLeaderboard,
    				$$slots: {
    					controls: [create_controls_slot$7],
    					content: [create_content_slot$6],
    					title: [create_title_slot$7]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};
    			if (dirty & /*$open*/ 2) modal_changes.open = /*$open*/ ctx[1];

    			if (dirty & /*$$scope, $game, $localEntries, $entries, $loaded*/ 157) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(72:0) <Tabs>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let tabs;
    	let current;

    	tabs = new Tabs({
    			props: {
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabs.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabs, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabs_changes = {};

    			if (dirty & /*$$scope, $open, $game, $localEntries, $entries, $loaded*/ 159) {
    				tabs_changes.$$scope = { dirty, ctx };
    			}

    			tabs.$set(tabs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const open = writable(false);
    let loaded = writable(false);
    const gameOver = writable(false);
    const entries = writable([]);
    const localEntries = writable([]);

    const closeLeaderboard = () => {
    	gameOver.set(false);
    	entries.set([]);
    	open.set(false);
    	loaded.set(false);
    };

    const openLeaderboard = async (from = undefined) => {
    	open.set(true);
    	localEntries.set(loadLocalLeaderboard());

    	if (from) {
    		gameOver.set(true);
    		entries.set([from]);
    		await Promise.all([loadAbove(from), loadBelow(from)]);
    	}

    	loaded.set(true);

    	// load local
    	if (localStorage.getItem('updated') !== 'true') {
    		localStorage.removeItem('games');
    		localStorage.setItem('updated', 'true');
    	}
    };

    const loadAbove = async first => {
    	const newEntries = await loadLeaderboard(first, 'asc');
    	entries.update(entries => [...newEntries.reverse(), ...entries]);
    	return newEntries.length;
    };

    const loadBelow = async last => {
    	const newEntries = await loadLeaderboard(last, 'desc');
    	entries.update(entries => [...entries, ...newEntries]);
    	return newEntries.length;
    };

    const func$1 = (_, e) => e.detail.complete();

    function instance$v($$self, $$props, $$invalidate) {
    	let $entries;
    	let $gameOver;
    	let $open;
    	let $loaded;
    	let $game;
    	let $localEntries;
    	validate_store(entries, 'entries');
    	component_subscribe($$self, entries, $$value => $$invalidate(0, $entries = $$value));
    	validate_store(gameOver, 'gameOver');
    	component_subscribe($$self, gameOver, $$value => $$invalidate(6, $gameOver = $$value));
    	validate_store(open, 'open');
    	component_subscribe($$self, open, $$value => $$invalidate(1, $open = $$value));
    	validate_store(loaded, 'loaded');
    	component_subscribe($$self, loaded, $$value => $$invalidate(2, $loaded = $$value));
    	validate_store(gameState, 'game');
    	component_subscribe($$self, gameState, $$value => $$invalidate(3, $game = $$value));
    	validate_store(localEntries, 'localEntries');
    	component_subscribe($$self, localEntries, $$value => $$invalidate(4, $localEntries = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Leaderboard', slots, []);

    	const handleInfinite = async (direction, e) => {
    		if (!$gameOver && direction === 'asc') {
    			e.detail.complete();
    			return [];
    		}

    		let numLoaded = undefined;

    		if (direction === 'asc') {
    			numLoaded = await loadAbove($entries[0]);
    		} else {
    			numLoaded = await loadBelow($entries[$entries.length - 1]);
    		}

    		if (numLoaded === 10) {
    			e.detail.loaded();
    		} else {
    			e.detail.complete();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Leaderboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		writable,
    		game: gameState,
    		loadLeaderboard,
    		loadLocalLeaderboard,
    		open,
    		loaded,
    		gameOver,
    		entries,
    		localEntries,
    		closeLeaderboard,
    		openLeaderboard,
    		loadAbove,
    		loadBelow,
    		Close,
    		Modal,
    		ActionButton,
    		Tabs,
    		TabList,
    		TabPanel,
    		Tab,
    		EntryList,
    		Spinner,
    		handleInfinite,
    		$entries,
    		$gameOver,
    		$open,
    		$loaded,
    		$game,
    		$localEntries
    	});

    	return [$entries, $open, $loaded, $game, $localEntries, handleInfinite];
    }

    class Leaderboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Leaderboard",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* node_modules\svelte-material-icons\Send.svelte generated by Svelte v3.46.6 */

    const file$t = "node_modules\\svelte-material-icons\\Send.svelte";

    function create_fragment$u(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M2,21L23,12L2,3V10L17,12L2,14V21Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$t, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$t, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Send', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Send> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Send extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Send",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get size() {
    		throw new Error("<Send>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Send>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Send>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Send>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Send>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Send>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Send>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Send>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Send>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Send>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\leaderboard\PostScore.svelte generated by Svelte v3.46.6 */
    const file$s = "src\\leaderboard\\PostScore.svelte";

    // (28:0) <ActionButton onClick={() => { open = true }}>
    function create_default_slot_2$5(ctx) {
    	let send;
    	let t;
    	let current;
    	send = new Send({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(send.$$.fragment);
    			t = text("\r\n  Submit Score");
    		},
    		m: function mount(target, anchor) {
    			mount_component(send, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(send.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(send.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(send, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(28:0) <ActionButton onClick={() => { open = true }}>",
    		ctx
    	});

    	return block;
    }

    // (33:2) 
    function create_title_slot$6(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Submit Score";
    			add_location(h2, file$s, 33, 4, 1037);
    			attr_dev(div, "slot", "title");
    			add_location(div, file$s, 32, 2, 1015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$6.name,
    		type: "slot",
    		source: "(33:2) ",
    		ctx
    	});

    	return block;
    }

    // (44:8) {:else}
    function create_else_block$6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "name");
    			input.required = true;
    			add_location(input, file$s, 44, 10, 1287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*name*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2 && input.value !== /*name*/ ctx[1]) {
    				set_input_value(input, /*name*/ ctx[1]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(44:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#if loading}
    function create_if_block$a(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(42:8) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (36:2) 
    function create_content_slot$5(ctx) {
    	let div1;
    	let form;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$a, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			form = element("form");
    			div0 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "submit-score svelte-ywdme8");
    			add_location(div0, file$s, 40, 6, 1188);
    			attr_dev(form, "name", "submit-score");
    			add_location(form, file$s, 36, 4, 1096);
    			attr_dev(div1, "slot", "content");
    			add_location(div1, file$s, 35, 2, 1072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, form);
    			append_dev(form, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$5.name,
    		type: "slot",
    		source: "(36:2) ",
    		ctx
    	});

    	return block;
    }

    // (56:4) <ActionButton onClick={handleClose}>
    function create_default_slot_1$7(ctx) {
    	let close;
    	let t;
    	let current;
    	close = new Close({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(close.$$.fragment);
    			t = text("\r\n      Close");
    		},
    		m: function mount(target, anchor) {
    			mount_component(close, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(close, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(56:4) <ActionButton onClick={handleClose}>",
    		ctx
    	});

    	return block;
    }

    // (61:4) <ActionButton onClick={handleSubmit}>
    function create_default_slot$a(ctx) {
    	let send;
    	let t;
    	let current;
    	send = new Send({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(send.$$.fragment);
    			t = text("\r\n      Submit");
    		},
    		m: function mount(target, anchor) {
    			mount_component(send, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(send.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(send.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(send, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(61:4) <ActionButton onClick={handleSubmit}>",
    		ctx
    	});

    	return block;
    }

    // (55:2) 
    function create_controls_slot$6(ctx) {
    	let div1;
    	let actionbutton0;
    	let t0;
    	let div0;
    	let t1;
    	let actionbutton1;
    	let current;

    	actionbutton0 = new ActionButton({
    			props: {
    				onClick: /*handleClose*/ ctx[4],
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionbutton1 = new ActionButton({
    			props: {
    				onClick: /*handleSubmit*/ ctx[3],
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(actionbutton0.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			create_component(actionbutton1.$$.fragment);
    			attr_dev(div0, "class", "spacer svelte-ywdme8");
    			add_location(div0, file$s, 59, 4, 1606);
    			attr_dev(div1, "slot", "controls");
    			attr_dev(div1, "class", "controls svelte-ywdme8");
    			add_location(div1, file$s, 54, 2, 1473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(actionbutton0, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			mount_component(actionbutton1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionbutton0_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton0.$set(actionbutton0_changes);
    			const actionbutton1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionbutton1_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton1.$set(actionbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(actionbutton0);
    			destroy_component(actionbutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot$6.name,
    		type: "slot",
    		source: "(55:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let actionbutton;
    	let t;
    	let modal;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*func*/ ctx[5],
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal = new Modal({
    			props: {
    				open: /*open*/ ctx[0],
    				onClose: /*handleClose*/ ctx[4],
    				$$slots: {
    					controls: [create_controls_slot$6],
    					content: [create_content_slot$5],
    					title: [create_title_slot$6]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const actionbutton_changes = {};
    			if (dirty & /*open*/ 1) actionbutton_changes.onClick = /*func*/ ctx[5];

    			if (dirty & /*$$scope*/ 256) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.open = /*open*/ ctx[0];

    			if (dirty & /*$$scope, loading, name*/ 262) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let $game;
    	validate_store(gameState, 'game');
    	component_subscribe($$self, gameState, $$value => $$invalidate(7, $game = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PostScore', slots, []);
    	let open = false;
    	let name = localStorage.getItem('name') || '';
    	let loading = false;

    	const handleSubmit = async () => {
    		localStorage.setItem('name', name);

    		if (!loading) {
    			$$invalidate(2, loading = true);
    			const e = await submitScore($game);
    			$$invalidate(2, loading = false);
    			openLeaderboard(e);
    			handleClose();
    		}
    	};

    	const handleClose = () => {
    		$$invalidate(0, open = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PostScore> was created with unknown prop '${key}'`);
    	});

    	const func = () => {
    		$$invalidate(0, open = true);
    	};

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	$$self.$capture_state = () => ({
    		ActionButton,
    		Modal,
    		Close,
    		Send,
    		game: gameState,
    		openLeaderboard,
    		submitScore,
    		Spinner,
    		open,
    		name,
    		loading,
    		handleSubmit,
    		handleClose,
    		$game
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('loading' in $$props) $$invalidate(2, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, name, loading, handleSubmit, handleClose, func, input_input_handler];
    }

    class PostScore extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostScore",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\icons\Trophy.svelte generated by Svelte v3.46.6 */

    const file$r = "src\\icons\\Trophy.svelte";

    function create_fragment$s(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M18 2C17.1 2 16 3 16 4H8C8 3 6.9 2 6 2H2V11C2 12 3 13 4 13H6.2C6.6 15 7.9 16.7 11 17V19.08C8 19.54 8 22 8 22H16C16 22 16 19.54 13 19.08V17C16.1 16.7 17.4 15 17.8 13H20C21 13 22 12 22 11V2H18M6 11H4V4H6V11M20 11H18V4H20V11Z");
    			add_location(path, file$r, 8, 72, 255);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			attr_dev(svg, "fill", /*color*/ ctx[2]);
    			add_location(svg, file$r, 8, 0, 183);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 4) {
    				attr_dev(svg, "fill", /*color*/ ctx[2]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Trophy', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Trophy> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Trophy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Trophy",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get size() {
    		throw new Error("<Trophy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Trophy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Trophy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Trophy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Trophy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Trophy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Trophy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Trophy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Trophy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Trophy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\modals\GameOver.svelte generated by Svelte v3.46.6 */
    const file$q = "src\\modals\\GameOver.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (70:2) 
    function create_title_slot$5(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Game Over";
    			add_location(h1, file$q, 70, 4, 2704);
    			attr_dev(div, "slot", "title");
    			add_location(div, file$q, 69, 2, 2682);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$5.name,
    		type: "slot",
    		source: "(70:2) ",
    		ctx
    	});

    	return block;
    }

    // (93:4) {#each words.slice(0, 5) as word}
    function create_each_block$6(ctx) {
    	let li;
    	let staticword;
    	let t0;
    	let span;
    	let t1_value = /*word*/ ctx[8].score + "";
    	let t1;
    	let t2;
    	let current;

    	staticword = new StaticWord({
    			props: { word: /*word*/ ctx[8].word },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(staticword.$$.fragment);
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(span, "class", "score svelte-t2krh7");
    			add_location(span, file$q, 95, 8, 3330);
    			attr_dev(li, "class", "word-container svelte-t2krh7");
    			add_location(li, file$q, 93, 6, 3252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(staticword, li, null);
    			append_dev(li, t0);
    			append_dev(li, span);
    			append_dev(span, t1);
    			append_dev(li, t2);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(staticword.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(staticword.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(staticword);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(93:4) {#each words.slice(0, 5) as word}",
    		ctx
    	});

    	return block;
    }

    // (73:2) 
    function create_content_slot$4(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1_value = /*$game*/ ctx[2].score + "";
    	let t1;
    	let t2;
    	let h40;
    	let t3;
    	let turns_1;
    	let t4;
    	let h41;
    	let t5;
    	let streak;
    	let t6;
    	let h42;
    	let t7;
    	let wordchain;
    	let t8;
    	let h43;
    	let t9;
    	let words_1;
    	let t10;
    	let h44;
    	let t12;
    	let ul;
    	let current;

    	turns_1 = new Turns({
    			props: { turns: /*$game*/ ctx[2].turn },
    			$$inline: true
    		});

    	streak = new Streak({
    			props: { streak: /*$game*/ ctx[2].bestStreak },
    			$$inline: true
    		});

    	wordchain = new WordChain({
    			props: { chain: /*$game*/ ctx[2].bestChain },
    			$$inline: true
    		});

    	words_1 = new Words({
    			props: { numWords: /*$game*/ ctx[2].words.length },
    			$$inline: true
    		});

    	let each_value = /*words*/ ctx[3].slice(0, 5);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text("Score: ");
    			t1 = text(t1_value);
    			t2 = space();
    			h40 = element("h4");
    			t3 = text("Turns:\r\n      ");
    			create_component(turns_1.$$.fragment);
    			t4 = space();
    			h41 = element("h4");
    			t5 = text("Best Streak:\r\n      ");
    			create_component(streak.$$.fragment);
    			t6 = space();
    			h42 = element("h4");
    			t7 = text("Best Chain:\r\n      ");
    			create_component(wordchain.$$.fragment);
    			t8 = space();
    			h43 = element("h4");
    			t9 = text("Words Made:\r\n      ");
    			create_component(words_1.$$.fragment);
    			t10 = space();
    			h44 = element("h4");
    			h44.textContent = "Best Words:";
    			t12 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$q, 73, 4, 2760);
    			attr_dev(h40, "class", "result svelte-t2krh7");
    			add_location(h40, file$q, 74, 4, 2795);
    			attr_dev(h41, "class", "result svelte-t2krh7");
    			add_location(h41, file$q, 78, 4, 2879);
    			attr_dev(h42, "class", "result svelte-t2krh7");
    			add_location(h42, file$q, 82, 4, 2977);
    			attr_dev(h43, "class", "result svelte-t2krh7");
    			add_location(h43, file$q, 86, 4, 3075);
    			add_location(h44, file$q, 90, 4, 3175);
    			add_location(ul, file$q, 91, 4, 3201);
    			attr_dev(div, "slot", "content");
    			add_location(div, file$q, 72, 2, 2736);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(div, t2);
    			append_dev(div, h40);
    			append_dev(h40, t3);
    			mount_component(turns_1, h40, null);
    			append_dev(div, t4);
    			append_dev(div, h41);
    			append_dev(h41, t5);
    			mount_component(streak, h41, null);
    			append_dev(div, t6);
    			append_dev(div, h42);
    			append_dev(h42, t7);
    			mount_component(wordchain, h42, null);
    			append_dev(div, t8);
    			append_dev(div, h43);
    			append_dev(h43, t9);
    			mount_component(words_1, h43, null);
    			append_dev(div, t10);
    			append_dev(div, h44);
    			append_dev(div, t12);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$game*/ 4) && t1_value !== (t1_value = /*$game*/ ctx[2].score + "")) set_data_dev(t1, t1_value);
    			const turns_1_changes = {};
    			if (dirty & /*$game*/ 4) turns_1_changes.turns = /*$game*/ ctx[2].turn;
    			turns_1.$set(turns_1_changes);
    			const streak_changes = {};
    			if (dirty & /*$game*/ 4) streak_changes.streak = /*$game*/ ctx[2].bestStreak;
    			streak.$set(streak_changes);
    			const wordchain_changes = {};
    			if (dirty & /*$game*/ 4) wordchain_changes.chain = /*$game*/ ctx[2].bestChain;
    			wordchain.$set(wordchain_changes);
    			const words_1_changes = {};
    			if (dirty & /*$game*/ 4) words_1_changes.numWords = /*$game*/ ctx[2].words.length;
    			words_1.$set(words_1_changes);

    			if (dirty & /*words*/ 8) {
    				each_value = /*words*/ ctx[3].slice(0, 5);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
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
    			transition_in(turns_1.$$.fragment, local);
    			transition_in(streak.$$.fragment, local);
    			transition_in(wordchain.$$.fragment, local);
    			transition_in(words_1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(turns_1.$$.fragment, local);
    			transition_out(streak.$$.fragment, local);
    			transition_out(wordchain.$$.fragment, local);
    			transition_out(words_1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(turns_1);
    			destroy_component(streak);
    			destroy_component(wordchain);
    			destroy_component(words_1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$4.name,
    		type: "slot",
    		source: "(73:2) ",
    		ctx
    	});

    	return block;
    }

    // (107:4) {:else}
    function create_else_block$5(ctx) {
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*handleShare*/ ctx[4],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(107:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (103:4) {#if copied}
    function create_if_block$9(ctx) {
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*handleShare*/ ctx[4],
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(103:4) {#if copied}",
    		ctx
    	});

    	return block;
    }

    // (108:6) <ActionButton onClick={handleShare}>
    function create_default_slot_3(ctx) {
    	let contentcopy;
    	let t;
    	let current;
    	contentcopy = new ContentCopy({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contentcopy.$$.fragment);
    			t = text(" Copy results");
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentcopy, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentcopy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentcopy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentcopy, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(108:6) <ActionButton onClick={handleShare}>",
    		ctx
    	});

    	return block;
    }

    // (104:6) <ActionButton onClick={handleShare}>
    function create_default_slot_2$4(ctx) {
    	let contentpaste;
    	let t;
    	let current;
    	contentpaste = new ContentPaste({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contentpaste.$$.fragment);
    			t = text(" Copied");
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentpaste, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentpaste.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentpaste.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentpaste, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(104:6) <ActionButton onClick={handleShare}>",
    		ctx
    	});

    	return block;
    }

    // (112:4) <ActionButton onClick={() => openLeaderboard()}>
    function create_default_slot_1$6(ctx) {
    	let trophy;
    	let t;
    	let current;
    	trophy = new Trophy({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(trophy.$$.fragment);
    			t = text("\r\n      Leaderboard");
    		},
    		m: function mount(target, anchor) {
    			mount_component(trophy, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trophy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trophy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(trophy, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(112:4) <ActionButton onClick={() => openLeaderboard()}>",
    		ctx
    	});

    	return block;
    }

    // (116:4) <ActionButton onClick={onReset}>
    function create_default_slot$9(ctx) {
    	let restart;
    	let t;
    	let current;
    	restart = new Restart({ props: { size: "1em" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(restart.$$.fragment);
    			t = text("\r\n      Reset Game");
    		},
    		m: function mount(target, anchor) {
    			mount_component(restart, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(restart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(restart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(restart, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(116:4) <ActionButton onClick={onReset}>",
    		ctx
    	});

    	return block;
    }

    // (101:2) 
    function create_controls_slot$5(ctx) {
    	let div;
    	let postscore;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let actionbutton0;
    	let t2;
    	let actionbutton1;
    	let current;
    	postscore = new PostScore({ $$inline: true });
    	const if_block_creators = [create_if_block$9, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*copied*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	actionbutton0 = new ActionButton({
    			props: {
    				onClick: /*func*/ ctx[5],
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionbutton1 = new ActionButton({
    			props: {
    				onClick: /*onReset*/ ctx[0],
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(postscore.$$.fragment);
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			create_component(actionbutton0.$$.fragment);
    			t2 = space();
    			create_component(actionbutton1.$$.fragment);
    			attr_dev(div, "slot", "controls");
    			attr_dev(div, "class", "controls svelte-t2krh7");
    			add_location(div, file$q, 100, 2, 3418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(postscore, div, null);
    			append_dev(div, t0);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t1);
    			mount_component(actionbutton0, div, null);
    			append_dev(div, t2);
    			mount_component(actionbutton1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, t1);
    			}

    			const actionbutton0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				actionbutton0_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton0.$set(actionbutton0_changes);
    			const actionbutton1_changes = {};
    			if (dirty & /*onReset*/ 1) actionbutton1_changes.onClick = /*onReset*/ ctx[0];

    			if (dirty & /*$$scope*/ 2048) {
    				actionbutton1_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton1.$set(actionbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(postscore.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(postscore.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(postscore);
    			if_blocks[current_block_type_index].d();
    			destroy_component(actionbutton0);
    			destroy_component(actionbutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot$5.name,
    		type: "slot",
    		source: "(101:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				open: true,
    				onClose: /*onReset*/ ctx[0],
    				$$slots: {
    					controls: [create_controls_slot$5],
    					content: [create_content_slot$4],
    					title: [create_title_slot$5]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*onReset*/ 1) modal_changes.onClose = /*onReset*/ ctx[0];

    			if (dirty & /*$$scope, onReset, copied, $game*/ 2055) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let $game;
    	let $turns;
    	validate_store(gameState, 'game');
    	component_subscribe($$self, gameState, $$value => $$invalidate(2, $game = $$value));
    	validate_store(turns, 'turns');
    	component_subscribe($$self, turns, $$value => $$invalidate(7, $turns = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameOver', slots, []);
    	let { onReset } = $$props;
    	const words = $game.words.sort((a, b) => b.score - a.score);
    	let shareText;
    	let copied = false;

    	onMount(() => {
    		var _a, _b;

    		const entry = {
    			name: '',
    			gameId: $game.id,
    			score: $game.score,
    			bestStreak: $game.bestStreak,
    			bestChain: $game.bestChain,
    			turns: $game.turn,
    			bestWord: (_b = (_a = words[0]) === null || _a === void 0
    			? void 0
    			: _a.word) !== null && _b !== void 0
    			? _b
    			: [],
    			numWords: $game.words.length,
    			date: new Date().toISOString()
    		};

    		saveLocalStats($game);
    		saveLocalLeaderboard(entry);
    		saveAnalytics($game, $turns.turns);
    		resetTurns();
    	});

    	const handleShare = () => {
    		shareText = 'GRAM JAM\n';
    		shareText += `Score: ${$game.score}\n\n`;
    		shareText += `🔥 Best Streak: ${$game.bestStreak}\n`;
    		shareText += `⚡ Best Chain: ${$game.bestChain}\n`;
    		shareText += '📘 Best Words:\n';
    		shareText += '--------------\n';

    		for (const word of words.slice(0, 5)) {
    			for (const tile of word.word) {
    				shareText += tile.letter;
    			}

    			shareText += ` ${word.score}\n`;
    		}

    		shareText += `https://gramjam.app/`;
    		const copyArea = document.createElement('textarea');
    		copyArea.textContent = shareText;
    		document.body.appendChild(copyArea);
    		var selection = document.getSelection();
    		var range = document.createRange();

    		//  range.selectNodeContents(textarea);
    		range.selectNode(copyArea);

    		selection.removeAllRanges();
    		selection.addRange(range);
    		document.execCommand('copy');
    		selection.removeAllRanges();
    		document.body.removeChild(copyArea);
    		$$invalidate(1, copied = true);
    	};

    	const writable_props = ['onReset'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameOver> was created with unknown prop '${key}'`);
    	});

    	const func = () => openLeaderboard();

    	$$self.$$set = $$props => {
    		if ('onReset' in $$props) $$invalidate(0, onReset = $$props.onReset);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		ContentCopy,
    		ContentPaste,
    		Restart,
    		Modal,
    		ActionButton,
    		Streak,
    		WordChain,
    		openLeaderboard,
    		PostScore,
    		Turns,
    		Words,
    		turns,
    		saveAnalytics,
    		resetTurns,
    		saveLocalLeaderboard,
    		saveLocalStats,
    		game: gameState,
    		StaticWord,
    		Trophy,
    		onReset,
    		words,
    		shareText,
    		copied,
    		handleShare,
    		$game,
    		$turns
    	});

    	$$self.$inject_state = $$props => {
    		if ('onReset' in $$props) $$invalidate(0, onReset = $$props.onReset);
    		if ('shareText' in $$props) shareText = $$props.shareText;
    		if ('copied' in $$props) $$invalidate(1, copied = $$props.copied);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onReset, copied, $game, words, handleShare, func];
    }

    class GameOver extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { onReset: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameOver",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onReset*/ ctx[0] === undefined && !('onReset' in props)) {
    			console.warn("<GameOver> was created without expected prop 'onReset'");
    		}
    	}

    	get onReset() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onReset(value) {
    		throw new Error("<GameOver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Title.svelte generated by Svelte v3.46.6 */
    const file$p = "src\\Title.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	child_ctx[2] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	child_ctx[2] = i;
    	return child_ctx;
    }

    // (8:4) {#each ['G', 'R', 'A', 'M'] as letter, i}
    function create_each_block_1$2(ctx) {
    	let boardtile;
    	let current;

    	boardtile = new BoardTile({
    			props: {
    				selected: /*i*/ ctx[2] === 0,
    				letter: /*letter*/ ctx[0],
    				size: "tiny"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(boardtile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(boardtile, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boardtile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boardtile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(boardtile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(8:4) {#each ['G', 'R', 'A', 'M'] as letter, i}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#each ['J', 'A', 'M'] as letter, i}
    function create_each_block$5(ctx) {
    	let boardtile;
    	let current;

    	boardtile = new BoardTile({
    			props: {
    				highlighted: /*i*/ ctx[2] === 0 ? 'green' : undefined,
    				letter: /*letter*/ ctx[0],
    				size: "tiny"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(boardtile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(boardtile, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boardtile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boardtile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(boardtile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(17:4) {#each ['J', 'A', 'M'] as letter, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	let each_value_1 = ['G', 'R', 'A', 'M'];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = ['J', 'A', 'M'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 3; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "subtitle svelte-ohxp88");
    			add_location(div0, file$p, 6, 2, 91);
    			attr_dev(div1, "class", "subtitle svelte-ohxp88");
    			add_location(div1, file$p, 15, 2, 287);
    			attr_dev(div2, "class", "title svelte-ohxp88");
    			add_location(div2, file$p, 5, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*undefined*/ 0) {
    				each_value = ['J', 'A', 'M'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 3; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = 3; i < 3; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 4; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < 3; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < 4; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < 3; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ BoardTile });
    	return [];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    function shuffle(array) {
        let currentIndex = array.length;
        let randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }
        return array;
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src\Flipper.svelte generated by Svelte v3.46.6 */
    const file$o = "src\\Flipper.svelte";

    // (10:0) {#key id}
    function create_key_block$2(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "flip svelte-1uc2kwz");
    			add_location(div, file$o, 10, 2, 204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				div_intro = create_in_transition(div, flipOver, {
    					shouldFlip: /*shouldFlip*/ ctx[3],
    					duration: dur,
    					delay: dur + stagger * (/*i*/ ctx[1] + /*j*/ ctx[2])
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, flipOut, {
    				shouldFlip: /*shouldFlip*/ ctx[3],
    				duration: dur,
    				delay: stagger * (/*i*/ ctx[1] + /*j*/ ctx[2])
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$2.name,
    		type: "key",
    		source: "(10:0) {#key id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let previous_key = /*id*/ ctx[0];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block$2(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1 && safe_not_equal(previous_key, previous_key = /*id*/ ctx[0])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$2);
    				check_outros();
    				key_block = create_key_block$2(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dur = 500;
    const stagger = 75;

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Flipper', slots, ['default']);
    	let { id } = $$props;
    	let { i } = $$props;
    	let { j } = $$props;
    	let { shouldFlip } = $$props;
    	const writable_props = ['id', 'i', 'j', 'shouldFlip'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Flipper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('i' in $$props) $$invalidate(1, i = $$props.i);
    		if ('j' in $$props) $$invalidate(2, j = $$props.j);
    		if ('shouldFlip' in $$props) $$invalidate(3, shouldFlip = $$props.shouldFlip);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		flipOver,
    		flipOut,
    		id,
    		i,
    		j,
    		shouldFlip,
    		dur,
    		stagger
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('i' in $$props) $$invalidate(1, i = $$props.i);
    		if ('j' in $$props) $$invalidate(2, j = $$props.j);
    		if ('shouldFlip' in $$props) $$invalidate(3, shouldFlip = $$props.shouldFlip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, i, j, shouldFlip, $$scope, slots];
    }

    class Flipper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { id: 0, i: 1, j: 2, shouldFlip: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Flipper",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Flipper> was created without expected prop 'id'");
    		}

    		if (/*i*/ ctx[1] === undefined && !('i' in props)) {
    			console.warn("<Flipper> was created without expected prop 'i'");
    		}

    		if (/*j*/ ctx[2] === undefined && !('j' in props)) {
    			console.warn("<Flipper> was created without expected prop 'j'");
    		}

    		if (/*shouldFlip*/ ctx[3] === undefined && !('shouldFlip' in props)) {
    			console.warn("<Flipper> was created without expected prop 'shouldFlip'");
    		}
    	}

    	get id() {
    		throw new Error("<Flipper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Flipper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get i() {
    		throw new Error("<Flipper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set i(value) {
    		throw new Error("<Flipper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get j() {
    		throw new Error("<Flipper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set j(value) {
    		throw new Error("<Flipper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldFlip() {
    		throw new Error("<Flipper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldFlip(value) {
    		throw new Error("<Flipper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Board.svelte generated by Svelte v3.46.6 */

    const { Object: Object_1$2 } = globals;
    const file$n = "src\\Board.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i][0];
    	child_ctx[11] = list[i][1].tile;
    	child_ctx[12] = list[i][1].coord;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i].tile;
    	child_ctx[15] = list[i].i;
    	child_ctx[16] = list[i].j;
    	return child_ctx;
    }

    // (113:6) <Flipper          id={$game.id}          shouldFlip={prevGameId !== $game.id}          {i} {j}        >
    function create_default_slot$8(ctx) {
    	let boardtile;
    	let current;

    	boardtile = new BoardTile({
    			props: {
    				letter: /*tile*/ ctx[11].letter,
    				active: !!/*$selected*/ ctx[3].tiles.size,
    				selected: /*$selected*/ ctx[3].tiles.has(/*tile*/ ctx[11].id),
    				highlighted: /*$game*/ ctx[0].highlighted[/*tile*/ ctx[11].id],
    				adjacent: false,
    				multiplier: /*tile*/ ctx[11].multiplier
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(boardtile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(boardtile, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const boardtile_changes = {};
    			if (dirty & /*tiles*/ 4) boardtile_changes.letter = /*tile*/ ctx[11].letter;
    			if (dirty & /*$selected*/ 8) boardtile_changes.active = !!/*$selected*/ ctx[3].tiles.size;
    			if (dirty & /*$selected, tiles*/ 12) boardtile_changes.selected = /*$selected*/ ctx[3].tiles.has(/*tile*/ ctx[11].id);
    			if (dirty & /*$game, tiles*/ 5) boardtile_changes.highlighted = /*$game*/ ctx[0].highlighted[/*tile*/ ctx[11].id];
    			if (dirty & /*tiles*/ 4) boardtile_changes.multiplier = /*tile*/ ctx[11].multiplier;
    			boardtile.$set(boardtile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boardtile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boardtile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(boardtile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(113:6) <Flipper          id={$game.id}          shouldFlip={prevGameId !== $game.id}          {i} {j}        >",
    		ctx
    	});

    	return block;
    }

    // (91:2) {#each tiles as { tile, i, j }
    function create_each_block_1$1(key_1, ctx) {
    	let div;
    	let flipper;
    	let div_data_id_value;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop$2;
    	let current;
    	let mounted;
    	let dispose;

    	flipper = new Flipper({
    			props: {
    				id: /*$game*/ ctx[0].id,
    				shouldFlip: /*prevGameId*/ ctx[1] !== /*$game*/ ctx[0].id,
    				i: /*i*/ ctx[15],
    				j: /*j*/ ctx[16],
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[15], /*j*/ ctx[16]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(flipper.$$.fragment);
    			attr_dev(div, "class", "tile-container svelte-bo7bz");
    			set_style(div, "grid-row", /*j*/ ctx[16] + 1);
    			set_style(div, "grid-column", /*i*/ ctx[15] + 1);
    			attr_dev(div, "data-id", div_data_id_value = /*tile*/ ctx[11].id);
    			toggle_class(div, "flying", /*$game*/ ctx[0].highlighted[/*tile*/ ctx[11].id] || /*$selected*/ ctx[3].tiles.has(/*tile*/ ctx[11].id));
    			add_location(div, file$n, 91, 4, 3100);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(flipper, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const flipper_changes = {};
    			if (dirty & /*$game*/ 1) flipper_changes.id = /*$game*/ ctx[0].id;
    			if (dirty & /*prevGameId, $game*/ 3) flipper_changes.shouldFlip = /*prevGameId*/ ctx[1] !== /*$game*/ ctx[0].id;
    			if (dirty & /*tiles*/ 4) flipper_changes.i = /*i*/ ctx[15];
    			if (dirty & /*tiles*/ 4) flipper_changes.j = /*j*/ ctx[16];

    			if (dirty & /*$$scope, tiles, $selected, $game*/ 524301) {
    				flipper_changes.$$scope = { dirty, ctx };
    			}

    			flipper.$set(flipper_changes);

    			if (!current || dirty & /*tiles*/ 4) {
    				set_style(div, "grid-row", /*j*/ ctx[16] + 1);
    			}

    			if (!current || dirty & /*tiles*/ 4) {
    				set_style(div, "grid-column", /*i*/ ctx[15] + 1);
    			}

    			if (!current || dirty & /*tiles*/ 4 && div_data_id_value !== (div_data_id_value = /*tile*/ ctx[11].id)) {
    				attr_dev(div, "data-id", div_data_id_value);
    			}

    			if (dirty & /*$game, tiles, $selected*/ 13) {
    				toggle_class(div, "flying", /*$game*/ ctx[0].highlighted[/*tile*/ ctx[11].id] || /*$selected*/ ctx[3].tiles.has(/*tile*/ ctx[11].id));
    			}
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, { duration: flipDuration });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flipper.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				div_intro = create_in_transition(div, receive, {
    					key: /*tile*/ ctx[11].id,
    					duration: flipDuration,
    					delay: 0
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flipper.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, send, {
    				key: /*tile*/ ctx[11].id,
    				duration: flipDuration,
    				delay: 0
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(flipper);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(91:2) {#each tiles as { tile, i, j }",
    		ctx
    	});

    	return block;
    }

    // (129:2) {#each Object.entries($game.intersections) as [ id, { tile, coord }
    function create_each_block$4(key_1, ctx) {
    	let div;
    	let boardtile;
    	let t;
    	let div_data_id_value;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop$2;
    	let current;

    	boardtile = new BoardTile({
    			props: {
    				letter: /*tile*/ ctx[11].letter,
    				active: /*$selected*/ ctx[3].tiles.size > 0,
    				selected: false,
    				highlighted: "red",
    				adjacent: false,
    				multiplier: /*tile*/ ctx[11].multiplier
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(boardtile.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "tile-container svelte-bo7bz");
    			set_style(div, "grid-row", /*coord*/ ctx[12][1] + 1);
    			set_style(div, "grid-column", /*coord*/ ctx[12][0] + 1);
    			attr_dev(div, "data-id", div_data_id_value = /*id*/ ctx[10]);
    			toggle_class(div, "flying", true);
    			add_location(div, file$n, 129, 4, 4149);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(boardtile, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const boardtile_changes = {};
    			if (dirty & /*$game*/ 1) boardtile_changes.letter = /*tile*/ ctx[11].letter;
    			if (dirty & /*$selected*/ 8) boardtile_changes.active = /*$selected*/ ctx[3].tiles.size > 0;
    			if (dirty & /*$game*/ 1) boardtile_changes.multiplier = /*tile*/ ctx[11].multiplier;
    			boardtile.$set(boardtile_changes);

    			if (!current || dirty & /*$game*/ 1) {
    				set_style(div, "grid-row", /*coord*/ ctx[12][1] + 1);
    			}

    			if (!current || dirty & /*$game*/ 1) {
    				set_style(div, "grid-column", /*coord*/ ctx[12][0] + 1);
    			}

    			if (!current || dirty & /*$game*/ 1 && div_data_id_value !== (div_data_id_value = /*id*/ ctx[10])) {
    				attr_dev(div, "data-id", div_data_id_value);
    			}
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, { duration: flipDuration });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boardtile.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boardtile.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, send, {
    				key: /*id*/ ctx[10],
    				duration: flipDuration
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(boardtile);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(129:2) {#each Object.entries($game.intersections) as [ id, { tile, coord }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let current;
    	let each_value_1 = /*tiles*/ ctx[2];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*tile*/ ctx[11].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1$1(key, child_ctx));
    	}

    	let each_value = Object.entries(/*$game*/ ctx[0].intersections);
    	validate_each_argument(each_value);
    	const get_key_1 = ctx => /*id*/ ctx[10];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key_1);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "board svelte-bo7bz");
    			add_location(div, file$n, 89, 0, 3032);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div, null);
    			}

    			append_dev(div, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tiles, flipDuration, $game, $selected, handleClick, prevGameId*/ 31) {
    				each_value_1 = /*tiles*/ ctx[2];
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, div, fix_and_outro_and_destroy_block, create_each_block_1$1, t, get_each_context_1$1);
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].a();
    				check_outros();
    			}

    			if (dirty & /*Object, $game, flipDuration, $selected*/ 9) {
    				each_value = Object.entries(/*$game*/ ctx[0].intersections);
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, div, fix_and_outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const initializeSelection = () => ({ coords: [], tiles: new Set() });
    const animating = writable(false);
    const selected = writable(initializeSelection());

    const clearSelection = () => {
    	selected.set(initializeSelection());
    };

    function instance$o($$self, $$props, $$invalidate) {
    	let tiles;
    	let $game;

    	let $animating,
    		$$unsubscribe_animating = noop$2;

    	let $turns;
    	let $selected;
    	validate_store(gameState, 'game');
    	component_subscribe($$self, gameState, $$value => $$invalidate(0, $game = $$value));
    	validate_store(animating, 'animating');
    	component_subscribe($$self, animating, $$value => $$invalidate(7, $animating = $$value));
    	validate_store(turns, 'turns');
    	component_subscribe($$self, turns, $$value => $$invalidate(8, $turns = $$value));
    	validate_store(selected, 'selected');
    	component_subscribe($$self, selected, $$value => $$invalidate(3, $selected = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_animating());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Board', slots, []);
    	let { handleScore } = $$props;
    	let prevGameId = '';
    	const coordStr2Int = c => c.split(',').map(i => parseInt(i));

    	const handleClick = async (i, j) => {
    		if (!$animating) {
    			set_store_value(animating, $animating = true, $animating);
    			const coord = [i, j].join(',');
    			const tileId = $game.board[i][j].id;

    			if ($selected.coords.length === 0) {
    				set_store_value(selected, $selected.coords = [coord], $selected);
    				$selected.tiles.add(tileId);
    			} else if ($selected.tiles.size === 1 && !$selected.tiles.has(tileId)) {
    				set_store_value(gameState, $game.turn++, $game);
    				const [i2, j2] = coordStr2Int($selected.coords[0]);

    				// the ol' switcheroo
    				const first = $game.board[i][j];

    				set_store_value(gameState, $game.board[i][j] = $game.board[i2][j2], $game);
    				set_store_value(gameState, $game.board[i2][j2] = first, $game);

    				// clear selection after switch
    				$selected.coords.push(coord);

    				$selected.tiles.add(tileId);

    				// if tiles are adjacent deduct 1 swap
    				// else deduct 2
    				const distanceX = Math.abs(i - i2);

    				const distanceY = Math.abs(j - j2);
    				let penalty = 0;

    				if (Math.max(distanceX, distanceY) === 1) {
    					penalty = 1;
    				} else {
    					penalty = 2;
    				}

    				if ($game.streak > 0) {
    					penalty--;
    				}

    				set_store_value(gameState, $game.remainingSwaps -= penalty, $game);

    				// gross!
    				// wait for end of swap animation
    				let bbox = getBBoxJSON();

    				while ($selected.coords.length) {
    					await delay(50);
    					const bbox2 = getBBoxJSON();

    					if (bbox === bbox2) {
    						clearSelection();
    						break;
    					}

    					bbox = bbox2;
    				}
    				await handleScore();
    				updateTurns([[i, j], [i2, j2]], $game.words);
    				saveGame($game, $turns);
    			} else {
    				// click same tile twice
    				clearSelection();
    			}

    			set_store_value(animating, $animating = false, $animating);
    		}
    	};

    	const writable_props = ['handleScore'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Board> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (i, j) => handleClick(i, j);

    	$$self.$$set = $$props => {
    		if ('handleScore' in $$props) $$invalidate(5, handleScore = $$props.handleScore);
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		initializeSelection,
    		animating,
    		selected,
    		clearSelection,
    		flip,
    		fade,
    		send,
    		receive,
    		flipDuration,
    		getBBoxJSON,
    		delay,
    		game: gameState,
    		saveGame,
    		BoardTile,
    		Flipper,
    		turns,
    		updateTurns,
    		handleScore,
    		prevGameId,
    		coordStr2Int,
    		handleClick,
    		tiles,
    		$game,
    		$animating,
    		$turns,
    		$selected
    	});

    	$$self.$inject_state = $$props => {
    		if ('handleScore' in $$props) $$invalidate(5, handleScore = $$props.handleScore);
    		if ('prevGameId' in $$props) $$invalidate(1, prevGameId = $$props.prevGameId);
    		if ('tiles' in $$props) $$invalidate(2, tiles = $$props.tiles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$game*/ 1) {
    			{
    				// play flip animation
    				setTimeout(
    					() => {
    						$$invalidate(1, prevGameId = $game.id);
    					},
    					1000
    				);
    			}
    		}

    		if ($$self.$$.dirty & /*$game*/ 1) {
    			$$invalidate(2, tiles = $game.board.flatMap((row, i) => row.map((tile, j) => ({ i, j, tile }))));
    		}
    	};

    	return [$game, prevGameId, tiles, $selected, handleClick, handleScore, click_handler];
    }

    class Board extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { handleScore: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Board",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleScore*/ ctx[5] === undefined && !('handleScore' in props)) {
    			console.warn("<Board> was created without expected prop 'handleScore'");
    		}
    	}

    	get handleScore() {
    		throw new Error("<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleScore(value) {
    		throw new Error("<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\Twitter.svelte generated by Svelte v3.46.6 */

    const file$m = "node_modules\\svelte-material-icons\\Twitter.svelte";

    function create_fragment$n(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$m, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$m, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Twitter', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Twitter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Twitter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Twitter",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get size() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const accordion = (node, { isOpen, axis = 'height', duration = 100, }) => {
        let initial = axis === 'height' ? node.offsetHeight : node.offsetWidth;
        node.style[axis] = isOpen ? 'auto' : '0';
        node.style.overflow = "hidden";
        return {
            update(isOpen) {
                let animation = node.animate([
                    {
                        [axis]: 0,
                        overflow: 'hidden'
                    },
                    {
                        [axis]: initial + 'px',
                        overflow: 'hidden'
                    },
                ], { duration, fill: 'both' });
                animation.pause();
                if (!isOpen) {
                    animation.play();
                }
                else {
                    animation.reverse();
                }
            }
        };
    };

    /* node_modules\svelte-material-icons\Information.svelte generated by Svelte v3.46.6 */

    const file$l = "node_modules\\svelte-material-icons\\Information.svelte";

    function create_fragment$m(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$l, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$l, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Information', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Information> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Information extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Information",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get size() {
    		throw new Error("<Information>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Information>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Information>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Information>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Information>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Information>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Information>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Information>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Information>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Information>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\SwapHorizontal.svelte generated by Svelte v3.46.6 */

    const file$k = "node_modules\\svelte-material-icons\\SwapHorizontal.svelte";

    function create_fragment$l(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$k, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$k, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SwapHorizontal', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SwapHorizontal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class SwapHorizontal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SwapHorizontal",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get size() {
    		throw new Error("<SwapHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<SwapHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<SwapHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<SwapHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<SwapHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<SwapHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<SwapHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<SwapHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<SwapHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<SwapHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\modals\Tutorial.svelte generated by Svelte v3.46.6 */
    const file$j = "src\\modals\\Tutorial.svelte";

    // (40:2) {#if !hideText}
    function create_if_block$8(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let span;
    	let accordion_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Tutorial";
    			attr_dev(div0, "class", "badge svelte-1c3wyi1");
    			add_location(div0, file$j, 41, 6, 1379);
    			attr_dev(div1, "class", "text svelte-1c3wyi1");
    			add_location(div1, file$j, 40, 4, 1355);
    			add_location(span, file$j, 43, 4, 1416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(accordion_action = accordion.call(null, span, {
    					duration,
    					isOpen: !/*$tutorialViewed*/ ctx[0],
    					axis: 'width'
    				}));

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (accordion_action && is_function(accordion_action.update) && dirty & /*$tutorialViewed*/ 1) accordion_action.update.call(null, {
    				duration,
    				isOpen: !/*$tutorialViewed*/ ctx[0],
    				axis: 'width'
    			});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(40:2) {#if !hideText}",
    		ctx
    	});

    	return block;
    }

    // (38:0) <ActionButton onClick={handleClick}>
    function create_default_slot_1$5(ctx) {
    	let info;
    	let t;
    	let if_block_anchor;
    	let current;
    	info = new Information({ props: { size: "1em" }, $$inline: true });
    	let if_block = !/*hideText*/ ctx[2] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			create_component(info.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(info, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*hideText*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(info, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(38:0) <ActionButton onClick={handleClick}>",
    		ctx
    	});

    	return block;
    }

    // (51:2) 
    function create_title_slot$4(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "How to play";
    			add_location(h2, file$j, 51, 4, 1646);
    			attr_dev(div, "class", "container svelte-1c3wyi1");
    			attr_dev(div, "slot", "title");
    			add_location(div, file$j, 50, 2, 1608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$4.name,
    		type: "slot",
    		source: "(51:2) ",
    		ctx
    	});

    	return block;
    }

    // (54:2) 
    function create_content_slot$3(ctx) {
    	let div5;
    	let div0;
    	let autorenew;
    	let t0;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let p2;
    	let t6;
    	let p3;
    	let t8;
    	let p4;
    	let t10;
    	let p5;
    	let t12;
    	let p6;
    	let t14;
    	let div1;
    	let swaphorizontal;
    	let t15;
    	let p7;
    	let t17;
    	let p8;
    	let t18;
    	let br0;
    	let t19;
    	let br1;
    	let t20;
    	let t21;
    	let div2;
    	let fire;
    	let t22;
    	let p9;
    	let t24;
    	let p10;
    	let t26;
    	let div3;
    	let flash;
    	let t27;
    	let p11;
    	let t29;
    	let p12;
    	let t31;
    	let div4;
    	let shuffle;
    	let t32;
    	let p13;
    	let t34;
    	let p14;
    	let t36;
    	let p15;
    	let current;
    	autorenew = new Autorenew({ props: { size: "1.5em" }, $$inline: true });
    	swaphorizontal = new SwapHorizontal({ props: { size: "1.5em" }, $$inline: true });
    	fire = new Fire({ props: { size: "1.5em" }, $$inline: true });
    	flash = new Flash({ props: { size: "1.5em" }, $$inline: true });
    	shuffle = new Shuffle({ props: { size: "1.5em" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			create_component(autorenew.$$.fragment);
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "swap letters to make words along rows and columns";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "swap two letters by tapping them";
    			t4 = space();
    			p2 = element("p");
    			p2.textContent = "words must be 4 or more letters long";
    			t6 = space();
    			p3 = element("p");
    			p3.textContent = "words must not read backwards";
    			t8 = space();
    			p4 = element("p");
    			p4.textContent = "Swapping adjacent tiles costs 1 swap";
    			t10 = space();
    			p5 = element("p");
    			p5.textContent = "Swapping non-adjacent tiles costs 2 swaps";
    			t12 = space();
    			p6 = element("p");
    			p6.textContent = "Double-letter tiles must appear together in the word";
    			t14 = space();
    			div1 = element("div");
    			create_component(swaphorizontal.$$.fragment);
    			t15 = space();
    			p7 = element("p");
    			p7.textContent = "Earn back swaps by making longer words";
    			t17 = space();
    			p8 = element("p");
    			t18 = text("5 letters = 1 swap");
    			br0 = element("br");
    			t19 = text("6 letters = 2 swaps");
    			br1 = element("br");
    			t20 = text("7 letters = 3 swaps");
    			t21 = space();
    			div2 = element("div");
    			create_component(fire.$$.fragment);
    			t22 = space();
    			p9 = element("p");
    			p9.textContent = "Maintain a word streak by creating a word every swap";
    			t24 = space();
    			p10 = element("p");
    			p10.textContent = "Your swap cost is decreased by 1 during a streak";
    			t26 = space();
    			div3 = element("div");
    			create_component(flash.$$.fragment);
    			t27 = space();
    			p11 = element("p");
    			p11.textContent = "Create chains by creating multiple words in a swap";
    			t29 = space();
    			p12 = element("p");
    			p12.textContent = "Chains give you back one swap per word";
    			t31 = space();
    			div4 = element("div");
    			create_component(shuffle.$$.fragment);
    			t32 = space();
    			p13 = element("p");
    			p13.textContent = "Use a shuffle to mix up the letters on the board";
    			t34 = space();
    			p14 = element("p");
    			p14.textContent = "Earn back shuffles by completing full-row, full-column, or intersecting words";
    			t36 = space();
    			p15 = element("p");
    			p15.textContent = "Shuffles do not use up swaps";
    			attr_dev(p0, "class", "primary svelte-1c3wyi1");
    			add_location(p0, file$j, 56, 6, 1763);
    			attr_dev(p1, "class", "secondary svelte-1c3wyi1");
    			add_location(p1, file$j, 57, 6, 1841);
    			attr_dev(p2, "class", "secondary svelte-1c3wyi1");
    			add_location(p2, file$j, 58, 6, 1904);
    			attr_dev(p3, "class", "secondary svelte-1c3wyi1");
    			add_location(p3, file$j, 59, 6, 1972);
    			attr_dev(p4, "class", "secondary svelte-1c3wyi1");
    			add_location(p4, file$j, 60, 6, 2033);
    			attr_dev(p5, "class", "secondary svelte-1c3wyi1");
    			add_location(p5, file$j, 61, 6, 2100);
    			attr_dev(p6, "class", "secondary svelte-1c3wyi1");
    			add_location(p6, file$j, 62, 6, 2172);
    			add_location(div0, file$j, 54, 4, 1718);
    			attr_dev(p7, "class", "primary svelte-1c3wyi1");
    			add_location(p7, file$j, 66, 6, 2317);
    			add_location(br0, file$j, 67, 43, 2421);
    			add_location(br1, file$j, 67, 67, 2445);
    			attr_dev(p8, "class", "secondary svelte-1c3wyi1");
    			add_location(p8, file$j, 67, 6, 2384);
    			add_location(div1, file$j, 64, 4, 2265);
    			attr_dev(p9, "class", "primary svelte-1c3wyi1");
    			add_location(p9, file$j, 71, 6, 2533);
    			attr_dev(p10, "class", "secondary svelte-1c3wyi1");
    			add_location(p10, file$j, 72, 6, 2614);
    			add_location(div2, file$j, 69, 4, 2491);
    			attr_dev(p11, "class", "primary svelte-1c3wyi1");
    			add_location(p11, file$j, 76, 6, 2746);
    			attr_dev(p12, "class", "secondary svelte-1c3wyi1");
    			add_location(p12, file$j, 77, 6, 2825);
    			add_location(div3, file$j, 74, 4, 2703);
    			attr_dev(p13, "class", "primary svelte-1c3wyi1");
    			add_location(p13, file$j, 81, 6, 2949);
    			attr_dev(p14, "class", "secondary svelte-1c3wyi1");
    			add_location(p14, file$j, 82, 6, 3026);
    			attr_dev(p15, "class", "secondary svelte-1c3wyi1");
    			add_location(p15, file$j, 83, 6, 3134);
    			add_location(div4, file$j, 79, 4, 2904);
    			attr_dev(div5, "class", "content svelte-1c3wyi1");
    			attr_dev(div5, "slot", "content");
    			add_location(div5, file$j, 53, 2, 1680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			mount_component(autorenew, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p0);
    			append_dev(div0, t2);
    			append_dev(div0, p1);
    			append_dev(div0, t4);
    			append_dev(div0, p2);
    			append_dev(div0, t6);
    			append_dev(div0, p3);
    			append_dev(div0, t8);
    			append_dev(div0, p4);
    			append_dev(div0, t10);
    			append_dev(div0, p5);
    			append_dev(div0, t12);
    			append_dev(div0, p6);
    			append_dev(div5, t14);
    			append_dev(div5, div1);
    			mount_component(swaphorizontal, div1, null);
    			append_dev(div1, t15);
    			append_dev(div1, p7);
    			append_dev(div1, t17);
    			append_dev(div1, p8);
    			append_dev(p8, t18);
    			append_dev(p8, br0);
    			append_dev(p8, t19);
    			append_dev(p8, br1);
    			append_dev(p8, t20);
    			append_dev(div5, t21);
    			append_dev(div5, div2);
    			mount_component(fire, div2, null);
    			append_dev(div2, t22);
    			append_dev(div2, p9);
    			append_dev(div2, t24);
    			append_dev(div2, p10);
    			append_dev(div5, t26);
    			append_dev(div5, div3);
    			mount_component(flash, div3, null);
    			append_dev(div3, t27);
    			append_dev(div3, p11);
    			append_dev(div3, t29);
    			append_dev(div3, p12);
    			append_dev(div5, t31);
    			append_dev(div5, div4);
    			mount_component(shuffle, div4, null);
    			append_dev(div4, t32);
    			append_dev(div4, p13);
    			append_dev(div4, t34);
    			append_dev(div4, p14);
    			append_dev(div4, t36);
    			append_dev(div4, p15);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(autorenew.$$.fragment, local);
    			transition_in(swaphorizontal.$$.fragment, local);
    			transition_in(fire.$$.fragment, local);
    			transition_in(flash.$$.fragment, local);
    			transition_in(shuffle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(autorenew.$$.fragment, local);
    			transition_out(swaphorizontal.$$.fragment, local);
    			transition_out(fire.$$.fragment, local);
    			transition_out(flash.$$.fragment, local);
    			transition_out(shuffle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(autorenew);
    			destroy_component(swaphorizontal);
    			destroy_component(fire);
    			destroy_component(flash);
    			destroy_component(shuffle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$3.name,
    		type: "slot",
    		source: "(54:2) ",
    		ctx
    	});

    	return block;
    }

    // (88:4) <ActionButton onClick={handleClose}>
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(88:4) <ActionButton onClick={handleClose}>",
    		ctx
    	});

    	return block;
    }

    // (89:6) 
    function create_icon_slot(ctx) {
    	let close;
    	let current;
    	close = new Close({ props: { slot: "icon" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(close.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(close, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(close, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot.name,
    		type: "slot",
    		source: "(89:6) ",
    		ctx
    	});

    	return block;
    }

    // (87:2) 
    function create_controls_slot$4(ctx) {
    	let div;
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*handleClose*/ ctx[4],
    				$$slots: {
    					icon: [create_icon_slot],
    					default: [create_default_slot$7]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(actionbutton.$$.fragment);
    			attr_dev(div, "slot", "controls");
    			add_location(div, file$j, 86, 2, 3211);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot$4.name,
    		type: "slot",
    		source: "(87:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let actionbutton;
    	let t;
    	let modal;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*handleClick*/ ctx[3],
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal = new Modal({
    			props: {
    				open: /*infoVisible*/ ctx[1],
    				onClose: /*handleClose*/ ctx[4],
    				$$slots: {
    					controls: [create_controls_slot$4],
    					content: [create_content_slot$3],
    					title: [create_title_slot$4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const actionbutton_changes = {};

    			if (dirty & /*$$scope, $tutorialViewed, hideText*/ 37) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    			const modal_changes = {};
    			if (dirty & /*infoVisible*/ 2) modal_changes.open = /*infoVisible*/ ctx[1];

    			if (dirty & /*$$scope*/ 32) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const tutorialViewed = writable(false);
    const VERSION = '7';
    const duration = 500;

    function instance$k($$self, $$props, $$invalidate) {
    	let $tutorialViewed,
    		$$unsubscribe_tutorialViewed = noop$2;

    	validate_store(tutorialViewed, 'tutorialViewed');
    	component_subscribe($$self, tutorialViewed, $$value => $$invalidate(0, $tutorialViewed = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tutorialViewed());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tutorial', slots, []);
    	let infoVisible = false;
    	let hideText = false;

    	onMount(() => {
    		set_store_value(tutorialViewed, $tutorialViewed = localStorage.getItem('version') === VERSION, $tutorialViewed);
    	});

    	const handleClick = () => {
    		$$invalidate(1, infoVisible = true);
    	};

    	const handleClose = () => {
    		$$invalidate(1, infoVisible = false);
    		set_store_value(tutorialViewed, $tutorialViewed = true, $tutorialViewed);
    		localStorage.setItem('version', VERSION);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tutorial> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		tutorialViewed,
    		accordion,
    		Info: Information,
    		SwapHorizontal,
    		Autorenew,
    		Fire,
    		Modal,
    		ActionButton,
    		Close,
    		Flash,
    		Shuffle,
    		onMount,
    		writable,
    		VERSION,
    		duration,
    		infoVisible,
    		hideText,
    		handleClick,
    		handleClose,
    		$tutorialViewed
    	});

    	$$self.$inject_state = $$props => {
    		if ('infoVisible' in $$props) $$invalidate(1, infoVisible = $$props.infoVisible);
    		if ('hideText' in $$props) $$invalidate(2, hideText = $$props.hideText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$tutorialViewed*/ 1) {
    			{
    				if ($tutorialViewed) {
    					setTimeout(
    						() => {
    							$$invalidate(2, hideText = true);
    						},
    						duration
    					);
    				}
    			}
    		}
    	};

    	return [$tutorialViewed, infoVisible, hideText, handleClick, handleClose];
    }

    class Tutorial extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tutorial",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\components\IconButton.svelte generated by Svelte v3.46.6 */

    const file$i = "src\\components\\IconButton.svelte";

    function create_fragment$j(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "type", /*type*/ ctx[2]);
    			button.disabled = /*disabled*/ ctx[1];
    			attr_dev(button, "form", /*form*/ ctx[3]);
    			attr_dev(button, "class", button_class_value = "action " + /*clazz*/ ctx[4] + " svelte-3x0jhu");
    			add_location(button, file$i, 8, 0, 210);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[0])) /*onClick*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 4) {
    				attr_dev(button, "type", /*type*/ ctx[2]);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}

    			if (!current || dirty & /*form*/ 8) {
    				attr_dev(button, "form", /*form*/ ctx[3]);
    			}

    			if (!current || dirty & /*clazz*/ 16 && button_class_value !== (button_class_value = "action " + /*clazz*/ ctx[4] + " svelte-3x0jhu")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconButton', slots, ['default']);
    	let { onClick = undefined } = $$props;
    	let { disabled = undefined } = $$props;
    	let { type = undefined } = $$props;
    	let { form = undefined } = $$props;
    	let { class: clazz = undefined } = $$props;
    	const writable_props = ['onClick', 'disabled', 'type', 'form', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('form' in $$props) $$invalidate(3, form = $$props.form);
    		if ('class' in $$props) $$invalidate(4, clazz = $$props.class);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onClick, disabled, type, form, clazz });

    	$$self.$inject_state = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('form' in $$props) $$invalidate(3, form = $$props.form);
    		if ('clazz' in $$props) $$invalidate(4, clazz = $$props.clazz);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClick, disabled, type, form, clazz, $$scope, slots];
    }

    class IconButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			onClick: 0,
    			disabled: 1,
    			type: 2,
    			form: 3,
    			class: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconButton",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get onClick() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\Brightness3.svelte generated by Svelte v3.46.6 */

    const file$h = "node_modules\\svelte-material-icons\\Brightness3.svelte";

    function create_fragment$i(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9,2C7.95,2 6.95,2.16 6,2.46C10.06,3.73 13,7.5 13,12C13,16.5 10.06,20.27 6,21.54C6.95,21.84 7.95,22 9,22A10,10 0 0,0 19,12A10,10 0 0,0 9,2Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$h, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$h, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Brightness3', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Brightness3> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Brightness3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Brightness3",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get size() {
    		throw new Error("<Brightness3>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Brightness3>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Brightness3>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Brightness3>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Brightness3>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Brightness3>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Brightness3>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Brightness3>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Brightness3>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Brightness3>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\Brightness7.svelte generated by Svelte v3.46.6 */

    const file$g = "node_modules\\svelte-material-icons\\Brightness7.svelte";

    function create_fragment$h(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$g, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$g, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Brightness7', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Brightness7> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Brightness7 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Brightness7",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get size() {
    		throw new Error("<Brightness7>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Brightness7>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Brightness7>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Brightness7>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Brightness7>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Brightness7>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Brightness7>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Brightness7>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Brightness7>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Brightness7>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\DarkMode.svelte generated by Svelte v3.46.6 */

    // (19:2) {:else}
    function create_else_block$4(ctx) {
    	let lightmode;
    	let current;
    	lightmode = new Brightness7({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(lightmode.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lightmode, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightmode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightmode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lightmode, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(19:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#if mode === 'light'}
    function create_if_block$7(ctx) {
    	let darkmode;
    	let current;
    	darkmode = new Brightness3({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(darkmode.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(darkmode, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(darkmode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(darkmode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(darkmode, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(17:2) {#if mode === 'light'}",
    		ctx
    	});

    	return block;
    }

    // (16:0) <IconButton onClick={toggle}>
    function create_default_slot$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*mode*/ ctx[0] === 'light') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(16:0) <IconButton onClick={toggle}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let iconbutton;
    	let current;

    	iconbutton = new IconButton({
    			props: {
    				onClick: /*toggle*/ ctx[1],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iconbutton.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbutton_changes = {};

    			if (dirty & /*$$scope, mode*/ 9) {
    				iconbutton_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton.$set(iconbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DarkMode', slots, []);
    	var _a;

    	let mode = (_a = localStorage.getItem('darkMode')) !== null && _a !== void 0
    	? _a
    	: 'light';

    	if (mode === 'dark') {
    		window.document.body.classList.add('dark-mode');
    	}

    	const toggle = () => {
    		window.document.body.classList.toggle('dark-mode');

    		$$invalidate(0, mode = window.document.body.classList.contains('dark-mode')
    		? 'dark'
    		: 'light');

    		localStorage.setItem('darkMode', mode);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DarkMode> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		_a,
    		IconButton,
    		DarkMode: Brightness3,
    		LightMode: Brightness7,
    		mode,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) _a = $$props._a;
    		if ('mode' in $$props) $$invalidate(0, mode = $$props.mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mode, toggle];
    }

    class DarkMode_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DarkMode_1",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* node_modules\svelte-material-icons\Email.svelte generated by Svelte v3.46.6 */

    const file$f = "node_modules\\svelte-material-icons\\Email.svelte";

    function create_fragment$f(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$f, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$f, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Email', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Email> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Email extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Email",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get size() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\modals\Feedback.svelte generated by Svelte v3.46.6 */
    const file$e = "src\\modals\\Feedback.svelte";

    // (36:0) <IconButton onClick={handleOpen}>
    function create_default_slot_2$3(ctx) {
    	let email;
    	let current;

    	email = new Email({
    			props: {
    				color: /*viewedFeedback*/ ctx[3] ? 'currentColor' : 'red'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(email.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(email, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const email_changes = {};
    			if (dirty & /*viewedFeedback*/ 8) email_changes.color = /*viewedFeedback*/ ctx[3] ? 'currentColor' : 'red';
    			email.$set(email_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(email.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(email.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(email, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(36:0) <IconButton onClick={handleOpen}>",
    		ctx
    	});

    	return block;
    }

    // (40:2) 
    function create_title_slot$3(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Submit Feedback";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Tell me what you like and what you don't";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "I'm still changing a lot, so tell me how to make the game better";
    			add_location(h1, file$e, 40, 4, 1295);
    			add_location(p0, file$e, 41, 4, 1325);
    			add_location(p1, file$e, 42, 4, 1378);
    			attr_dev(div, "class", "title svelte-y7tjqx");
    			attr_dev(div, "slot", "title");
    			add_location(div, file$e, 39, 2, 1261);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(div, t3);
    			append_dev(div, p1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$3.name,
    		type: "slot",
    		source: "(40:2) ",
    		ctx
    	});

    	return block;
    }

    // (48:4) {:else}
    function create_else_block$3(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "class", "feedback svelte-y7tjqx");
    			add_location(textarea, file$e, 48, 6, 1540);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*feedback*/ ctx[2]);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*feedback*/ 4) {
    				set_input_value(textarea, /*feedback*/ ctx[2]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(48:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if loading}
    function create_if_block$6(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(46:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (45:2) 
    function create_content_slot$2(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "slot", "content");
    			add_location(div, file$e, 44, 2, 1463);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$2.name,
    		type: "slot",
    		source: "(45:2) ",
    		ctx
    	});

    	return block;
    }

    // (53:4) <ActionButton onClick={handleClose}>
    function create_default_slot_1$4(ctx) {
    	let close;
    	let t;
    	let current;
    	close = new Close({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(close.$$.fragment);
    			t = text("\r\n      Close");
    		},
    		m: function mount(target, anchor) {
    			mount_component(close, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(close, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(53:4) <ActionButton onClick={handleClose}>",
    		ctx
    	});

    	return block;
    }

    // (57:4) <ActionButton onClick={handleSendFeedback}>
    function create_default_slot$5(ctx) {
    	let send;
    	let t;
    	let current;
    	send = new Send({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(send.$$.fragment);
    			t = text("\r\n      Send");
    		},
    		m: function mount(target, anchor) {
    			mount_component(send, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(send.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(send.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(send, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(57:4) <ActionButton onClick={handleSendFeedback}>",
    		ctx
    	});

    	return block;
    }

    // (52:2) 
    function create_controls_slot$3(ctx) {
    	let div;
    	let actionbutton0;
    	let t;
    	let actionbutton1;
    	let current;

    	actionbutton0 = new ActionButton({
    			props: {
    				onClick: /*handleClose*/ ctx[5],
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionbutton1 = new ActionButton({
    			props: {
    				onClick: /*handleSendFeedback*/ ctx[6],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(actionbutton0.$$.fragment);
    			t = space();
    			create_component(actionbutton1.$$.fragment);
    			attr_dev(div, "class", "controls svelte-y7tjqx");
    			attr_dev(div, "slot", "controls");
    			add_location(div, file$e, 51, 2, 1614);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton0, div, null);
    			append_dev(div, t);
    			mount_component(actionbutton1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionbutton0_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton0.$set(actionbutton0_changes);
    			const actionbutton1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionbutton1_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton1.$set(actionbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton0);
    			destroy_component(actionbutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot$3.name,
    		type: "slot",
    		source: "(52:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let iconbutton;
    	let t;
    	let modal;
    	let current;

    	iconbutton = new IconButton({
    			props: {
    				onClick: /*handleOpen*/ ctx[4],
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal = new Modal({
    			props: {
    				open: /*open*/ ctx[0],
    				onClose: /*handleClose*/ ctx[5],
    				$$slots: {
    					controls: [create_controls_slot$3],
    					content: [create_content_slot$2],
    					title: [create_title_slot$3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iconbutton.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbutton, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbutton_changes = {};

    			if (dirty & /*$$scope, viewedFeedback*/ 264) {
    				iconbutton_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton.$set(iconbutton_changes);
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.open = /*open*/ ctx[0];

    			if (dirty & /*$$scope, loading, feedback*/ 262) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbutton, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Feedback', slots, []);
    	let open = false;
    	let loading = false;
    	let feedback;
    	let viewedFeedback = localStorage.getItem('viewedFeedback') === 'true';

    	const handleOpen = async () => {
    		$$invalidate(0, open = true);
    		localStorage.setItem('viewedFeedback', 'true');
    		$$invalidate(3, viewedFeedback = true);
    	};

    	const handleClose = () => {
    		$$invalidate(0, open = false);
    		$$invalidate(1, loading = false);
    	};

    	const handleSendFeedback = async () => {
    		$$invalidate(1, loading = true);
    		await supabase.from('feedback').insert({ userId: getUserId(), feedback });
    		$$invalidate(1, loading = false);
    		$$invalidate(2, feedback = undefined);
    		$$invalidate(0, open = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Feedback> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		feedback = this.value;
    		$$invalidate(2, feedback);
    	}

    	$$self.$capture_state = () => ({
    		Close,
    		Email,
    		IconButton,
    		ActionButton,
    		Modal,
    		Send,
    		supabase,
    		getUserId,
    		Spinner,
    		open,
    		loading,
    		feedback,
    		viewedFeedback,
    		handleOpen,
    		handleClose,
    		handleSendFeedback
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('feedback' in $$props) $$invalidate(2, feedback = $$props.feedback);
    		if ('viewedFeedback' in $$props) $$invalidate(3, viewedFeedback = $$props.viewedFeedback);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		loading,
    		feedback,
    		viewedFeedback,
    		handleOpen,
    		handleClose,
    		handleSendFeedback,
    		textarea_input_handler
    	];
    }

    class Feedback extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Feedback",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\modals\ConfirmReset.svelte generated by Svelte v3.46.6 */
    const file$d = "src\\modals\\ConfirmReset.svelte";

    // (22:2) {#if $tutorialViewed}
    function create_if_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Reset");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(22:2) {#if $tutorialViewed}",
    		ctx
    	});

    	return block;
    }

    // (20:0) <ActionButton onClick={handleOpen}>
    function create_default_slot_2$2(ctx) {
    	let restart;
    	let t;
    	let if_block_anchor;
    	let current;
    	restart = new Restart({ props: { size: "1em" }, $$inline: true });
    	let if_block = /*$tutorialViewed*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			create_component(restart.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(restart, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$tutorialViewed*/ ctx[1]) {
    				if (if_block) ; else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(restart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(restart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(restart, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(20:0) <ActionButton onClick={handleOpen}>",
    		ctx
    	});

    	return block;
    }

    // (27:2) 
    function create_title_slot$2(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Are you sure?";
    			add_location(h1, file$d, 27, 4, 714);
    			attr_dev(div, "slot", "title");
    			add_location(div, file$d, 26, 2, 692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$2.name,
    		type: "slot",
    		source: "(27:2) ",
    		ctx
    	});

    	return block;
    }

    // (31:4) <ActionButton onClick={handleReset}>
    function create_default_slot_1$3(ctx) {
    	let restart;
    	let t;
    	let current;
    	restart = new Restart({ props: { size: "1em" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(restart.$$.fragment);
    			t = text("\r\n      Reset");
    		},
    		m: function mount(target, anchor) {
    			mount_component(restart, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(restart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(restart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(restart, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(31:4) <ActionButton onClick={handleReset}>",
    		ctx
    	});

    	return block;
    }

    // (35:4) <ActionButton onClick={handleClose}>
    function create_default_slot$4(ctx) {
    	let close;
    	let t;
    	let current;
    	close = new Close({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(close.$$.fragment);
    			t = text("\r\n      Close");
    		},
    		m: function mount(target, anchor) {
    			mount_component(close, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(close, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(35:4) <ActionButton onClick={handleClose}>",
    		ctx
    	});

    	return block;
    }

    // (30:2) 
    function create_controls_slot$2(ctx) {
    	let div;
    	let actionbutton0;
    	let t;
    	let actionbutton1;
    	let current;

    	actionbutton0 = new ActionButton({
    			props: {
    				onClick: /*handleReset*/ ctx[4],
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionbutton1 = new ActionButton({
    			props: {
    				onClick: /*handleClose*/ ctx[3],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(actionbutton0.$$.fragment);
    			t = space();
    			create_component(actionbutton1.$$.fragment);
    			attr_dev(div, "class", "controls svelte-w380oi");
    			attr_dev(div, "slot", "controls");
    			add_location(div, file$d, 29, 2, 750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton0, div, null);
    			append_dev(div, t);
    			mount_component(actionbutton1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				actionbutton0_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton0.$set(actionbutton0_changes);
    			const actionbutton1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				actionbutton1_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton1.$set(actionbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton0);
    			destroy_component(actionbutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot$2.name,
    		type: "slot",
    		source: "(30:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let actionbutton;
    	let t;
    	let modal;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*handleOpen*/ ctx[2],
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal = new Modal({
    			props: {
    				open: /*open*/ ctx[0],
    				onClose: /*handleClose*/ ctx[3],
    				$$slots: {
    					controls: [create_controls_slot$2],
    					title: [create_title_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const actionbutton_changes = {};

    			if (dirty & /*$$scope, $tutorialViewed*/ 66) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.open = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 64) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $tutorialViewed;
    	validate_store(tutorialViewed, 'tutorialViewed');
    	component_subscribe($$self, tutorialViewed, $$value => $$invalidate(1, $tutorialViewed = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ConfirmReset', slots, []);
    	let { onReset } = $$props;
    	let open = false;

    	const handleOpen = () => {
    		$$invalidate(0, open = true);
    	};

    	const handleClose = () => {
    		$$invalidate(0, open = false);
    	};

    	const handleReset = () => {
    		onReset();
    		$$invalidate(0, open = false);
    	};

    	const writable_props = ['onReset'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ConfirmReset> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onReset' in $$props) $$invalidate(5, onReset = $$props.onReset);
    	};

    	$$self.$capture_state = () => ({
    		Close,
    		ActionButton,
    		Modal,
    		Restart,
    		tutorialViewed,
    		onReset,
    		open,
    		handleOpen,
    		handleClose,
    		handleReset,
    		$tutorialViewed
    	});

    	$$self.$inject_state = $$props => {
    		if ('onReset' in $$props) $$invalidate(5, onReset = $$props.onReset);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, $tutorialViewed, handleOpen, handleClose, handleReset, onReset];
    }

    class ConfirmReset extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { onReset: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConfirmReset",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onReset*/ ctx[5] === undefined && !('onReset' in props)) {
    			console.warn("<ConfirmReset> was created without expected prop 'onReset'");
    		}
    	}

    	get onReset() {
    		throw new Error("<ConfirmReset>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onReset(value) {
    		throw new Error("<ConfirmReset>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\BottomControls.svelte generated by Svelte v3.46.6 */
    const file$c = "src\\BottomControls.svelte";

    // (14:2) <ActionButton href='https://twitter.com/GramJamGame'>
    function create_default_slot_1$2(ctx) {
    	let twitter;
    	let current;
    	twitter = new Twitter({ props: { size: "1em" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(twitter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(twitter, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(twitter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(twitter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(twitter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(14:2) <ActionButton href='https://twitter.com/GramJamGame'>",
    		ctx
    	});

    	return block;
    }

    // (17:2) <ActionButton onClick={() => openLeaderboard()}>
    function create_default_slot$3(ctx) {
    	let trophy;
    	let current;
    	trophy = new Trophy({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(trophy.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(trophy, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trophy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trophy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(trophy, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(17:2) <ActionButton onClick={() => openLeaderboard()}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let actionbutton0;
    	let t0;
    	let actionbutton1;
    	let t1;
    	let feedback;
    	let t2;
    	let confirmreset;
    	let t3;
    	let tutorial;
    	let t4;
    	let darkmode;
    	let t5;
    	let leaderboard;
    	let current;

    	actionbutton0 = new ActionButton({
    			props: {
    				href: "https://twitter.com/GramJamGame",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionbutton1 = new ActionButton({
    			props: {
    				onClick: /*func*/ ctx[1],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	feedback = new Feedback({ $$inline: true });

    	confirmreset = new ConfirmReset({
    			props: { onReset: /*onReset*/ ctx[0] },
    			$$inline: true
    		});

    	tutorial = new Tutorial({ $$inline: true });
    	darkmode = new DarkMode_1({ $$inline: true });
    	leaderboard = new Leaderboard({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(actionbutton0.$$.fragment);
    			t0 = space();
    			create_component(actionbutton1.$$.fragment);
    			t1 = space();
    			create_component(feedback.$$.fragment);
    			t2 = space();
    			create_component(confirmreset.$$.fragment);
    			t3 = space();
    			create_component(tutorial.$$.fragment);
    			t4 = space();
    			create_component(darkmode.$$.fragment);
    			t5 = space();
    			create_component(leaderboard.$$.fragment);
    			attr_dev(div, "class", "controls svelte-1h0oo89");
    			add_location(div, file$c, 12, 0, 551);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton0, div, null);
    			append_dev(div, t0);
    			mount_component(actionbutton1, div, null);
    			append_dev(div, t1);
    			mount_component(feedback, div, null);
    			append_dev(div, t2);
    			mount_component(confirmreset, div, null);
    			append_dev(div, t3);
    			mount_component(tutorial, div, null);
    			append_dev(div, t4);
    			mount_component(darkmode, div, null);
    			insert_dev(target, t5, anchor);
    			mount_component(leaderboard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const actionbutton0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				actionbutton0_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton0.$set(actionbutton0_changes);
    			const actionbutton1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				actionbutton1_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton1.$set(actionbutton1_changes);
    			const confirmreset_changes = {};
    			if (dirty & /*onReset*/ 1) confirmreset_changes.onReset = /*onReset*/ ctx[0];
    			confirmreset.$set(confirmreset_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			transition_in(feedback.$$.fragment, local);
    			transition_in(confirmreset.$$.fragment, local);
    			transition_in(tutorial.$$.fragment, local);
    			transition_in(darkmode.$$.fragment, local);
    			transition_in(leaderboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			transition_out(feedback.$$.fragment, local);
    			transition_out(confirmreset.$$.fragment, local);
    			transition_out(tutorial.$$.fragment, local);
    			transition_out(darkmode.$$.fragment, local);
    			transition_out(leaderboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton0);
    			destroy_component(actionbutton1);
    			destroy_component(feedback);
    			destroy_component(confirmreset);
    			destroy_component(tutorial);
    			destroy_component(darkmode);
    			if (detaching) detach_dev(t5);
    			destroy_component(leaderboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BottomControls', slots, []);
    	let { onReset } = $$props;
    	const writable_props = ['onReset'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BottomControls> was created with unknown prop '${key}'`);
    	});

    	const func = () => openLeaderboard();

    	$$self.$$set = $$props => {
    		if ('onReset' in $$props) $$invalidate(0, onReset = $$props.onReset);
    	};

    	$$self.$capture_state = () => ({
    		Twitter,
    		ActionButton,
    		Tutorial,
    		DarkMode: DarkMode_1,
    		Feedback,
    		Leaderboard,
    		openLeaderboard,
    		Trophy,
    		ConfirmReset,
    		onReset
    	});

    	$$self.$inject_state = $$props => {
    		if ('onReset' in $$props) $$invalidate(0, onReset = $$props.onReset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onReset, func];
    }

    class BottomControls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { onReset: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BottomControls",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onReset*/ ctx[0] === undefined && !('onReset' in props)) {
    			console.warn("<BottomControls> was created without expected prop 'onReset'");
    		}
    	}

    	get onReset() {
    		throw new Error("<BottomControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onReset(value) {
    		throw new Error("<BottomControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-confetti\src\Confetti.svelte generated by Svelte v3.46.6 */
    const file$b = "node_modules\\svelte-confetti\\src\\Confetti.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (40:0) {#if !complete}
    function create_if_block$4(ctx) {
    	let div;
    	let each_value = { length: /*amount*/ ctx[6] };
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "confetti-holder svelte-1dbmbqw");
    			toggle_class(div, "rounded", /*rounded*/ ctx[9]);
    			toggle_class(div, "cone", /*cone*/ ctx[10]);
    			toggle_class(div, "no-gravity", /*noGravity*/ ctx[11]);
    			add_location(div, file$b, 40, 2, 1075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fallDistance, size, getColor, randomBetween, y, x, infinite, duration, delay, iterationCount, amount*/ 8703) {
    				each_value = { length: /*amount*/ ctx[6] };
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*rounded*/ 512) {
    				toggle_class(div, "rounded", /*rounded*/ ctx[9]);
    			}

    			if (dirty & /*cone*/ 1024) {
    				toggle_class(div, "cone", /*cone*/ ctx[10]);
    			}

    			if (dirty & /*noGravity*/ 2048) {
    				toggle_class(div, "no-gravity", /*noGravity*/ ctx[11]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(40:0) {#if !complete}",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#each { length: amount } as _}
    function create_each_block$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "confetti svelte-1dbmbqw");
    			set_style(div, "--fall-distance", /*fallDistance*/ ctx[8]);
    			set_style(div, "--size", /*size*/ ctx[0] + "px");
    			set_style(div, "--color", /*getColor*/ ctx[13]());
    			set_style(div, "--skew", randomBetween(-45, 45) + "deg," + randomBetween(-45, 45) + "deg");
    			set_style(div, "--rotation-xyz", randomBetween(-10, 10) + ", " + randomBetween(-10, 10) + ", " + randomBetween(-10, 10));
    			set_style(div, "--rotation-deg", randomBetween(0, 360) + "deg");
    			set_style(div, "--translate-y-multiplier", randomBetween(/*y*/ ctx[2][0], /*y*/ ctx[2][1]));
    			set_style(div, "--translate-x-multiplier", randomBetween(/*x*/ ctx[1][0], /*x*/ ctx[1][1]));
    			set_style(div, "--scale", 0.1 * randomBetween(2, 10));

    			set_style(div, "--transition-duration", /*infinite*/ ctx[4]
    			? `calc(${/*duration*/ ctx[3]}ms * var(--scale))`
    			: `${/*duration*/ ctx[3]}ms`);

    			set_style(div, "--transition-delay", randomBetween(/*delay*/ ctx[5][0], /*delay*/ ctx[5][1]) + "ms");

    			set_style(div, "--transition-iteration-count", /*infinite*/ ctx[4]
    			? 'infinite'
    			: /*iterationCount*/ ctx[7]);

    			add_location(div, file$b, 42, 6, 1203);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fallDistance*/ 256) {
    				set_style(div, "--fall-distance", /*fallDistance*/ ctx[8]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "--size", /*size*/ ctx[0] + "px");
    			}

    			if (dirty & /*y*/ 4) {
    				set_style(div, "--translate-y-multiplier", randomBetween(/*y*/ ctx[2][0], /*y*/ ctx[2][1]));
    			}

    			if (dirty & /*x*/ 2) {
    				set_style(div, "--translate-x-multiplier", randomBetween(/*x*/ ctx[1][0], /*x*/ ctx[1][1]));
    			}

    			if (dirty & /*infinite, duration*/ 24) {
    				set_style(div, "--transition-duration", /*infinite*/ ctx[4]
    				? `calc(${/*duration*/ ctx[3]}ms * var(--scale))`
    				: `${/*duration*/ ctx[3]}ms`);
    			}

    			if (dirty & /*delay*/ 32) {
    				set_style(div, "--transition-delay", randomBetween(/*delay*/ ctx[5][0], /*delay*/ ctx[5][1]) + "ms");
    			}

    			if (dirty & /*infinite, iterationCount*/ 144) {
    				set_style(div, "--transition-iteration-count", /*infinite*/ ctx[4]
    				? 'infinite'
    				: /*iterationCount*/ ctx[7]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(42:4) {#each { length: amount } as _}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;
    	let if_block = !/*complete*/ ctx[12] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*complete*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function randomBetween(min, max) {
    	return Math.random() * (max - min) + min;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Confetti', slots, []);
    	let { size = 10 } = $$props;
    	let { x = [-0.5, 0.5] } = $$props;
    	let { y = [0.25, 1] } = $$props;
    	let { duration = 2000 } = $$props;
    	let { infinite = false } = $$props;
    	let { delay = [0, 50] } = $$props;
    	let { colorRange = [0, 360] } = $$props;
    	let { colorArray = [] } = $$props;
    	let { amount = 50 } = $$props;
    	let { iterationCount = 1 } = $$props;
    	let { fallDistance = "100px" } = $$props;
    	let { rounded = false } = $$props;
    	let { cone = false } = $$props;
    	let { noGravity = false } = $$props;
    	let { destroyOnComplete = true } = $$props;
    	let complete = false;

    	onMount(() => {
    		if (!destroyOnComplete || infinite || iterationCount == "infinite") return;
    		setTimeout(() => $$invalidate(12, complete = true), (duration + delay[1]) * iterationCount);
    	});

    	function getColor() {
    		if (colorArray.length) return colorArray[Math.round(Math.random() * (colorArray.length - 1))]; else return `hsl(${Math.round(randomBetween(colorRange[0], colorRange[1]))}, 75%, 50%`;
    	}

    	const writable_props = [
    		'size',
    		'x',
    		'y',
    		'duration',
    		'infinite',
    		'delay',
    		'colorRange',
    		'colorArray',
    		'amount',
    		'iterationCount',
    		'fallDistance',
    		'rounded',
    		'cone',
    		'noGravity',
    		'destroyOnComplete'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Confetti> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('infinite' in $$props) $$invalidate(4, infinite = $$props.infinite);
    		if ('delay' in $$props) $$invalidate(5, delay = $$props.delay);
    		if ('colorRange' in $$props) $$invalidate(14, colorRange = $$props.colorRange);
    		if ('colorArray' in $$props) $$invalidate(15, colorArray = $$props.colorArray);
    		if ('amount' in $$props) $$invalidate(6, amount = $$props.amount);
    		if ('iterationCount' in $$props) $$invalidate(7, iterationCount = $$props.iterationCount);
    		if ('fallDistance' in $$props) $$invalidate(8, fallDistance = $$props.fallDistance);
    		if ('rounded' in $$props) $$invalidate(9, rounded = $$props.rounded);
    		if ('cone' in $$props) $$invalidate(10, cone = $$props.cone);
    		if ('noGravity' in $$props) $$invalidate(11, noGravity = $$props.noGravity);
    		if ('destroyOnComplete' in $$props) $$invalidate(16, destroyOnComplete = $$props.destroyOnComplete);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		size,
    		x,
    		y,
    		duration,
    		infinite,
    		delay,
    		colorRange,
    		colorArray,
    		amount,
    		iterationCount,
    		fallDistance,
    		rounded,
    		cone,
    		noGravity,
    		destroyOnComplete,
    		complete,
    		randomBetween,
    		getColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('infinite' in $$props) $$invalidate(4, infinite = $$props.infinite);
    		if ('delay' in $$props) $$invalidate(5, delay = $$props.delay);
    		if ('colorRange' in $$props) $$invalidate(14, colorRange = $$props.colorRange);
    		if ('colorArray' in $$props) $$invalidate(15, colorArray = $$props.colorArray);
    		if ('amount' in $$props) $$invalidate(6, amount = $$props.amount);
    		if ('iterationCount' in $$props) $$invalidate(7, iterationCount = $$props.iterationCount);
    		if ('fallDistance' in $$props) $$invalidate(8, fallDistance = $$props.fallDistance);
    		if ('rounded' in $$props) $$invalidate(9, rounded = $$props.rounded);
    		if ('cone' in $$props) $$invalidate(10, cone = $$props.cone);
    		if ('noGravity' in $$props) $$invalidate(11, noGravity = $$props.noGravity);
    		if ('destroyOnComplete' in $$props) $$invalidate(16, destroyOnComplete = $$props.destroyOnComplete);
    		if ('complete' in $$props) $$invalidate(12, complete = $$props.complete);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		x,
    		y,
    		duration,
    		infinite,
    		delay,
    		amount,
    		iterationCount,
    		fallDistance,
    		rounded,
    		cone,
    		noGravity,
    		complete,
    		getColor,
    		colorRange,
    		colorArray,
    		destroyOnComplete
    	];
    }

    class Confetti extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			size: 0,
    			x: 1,
    			y: 2,
    			duration: 3,
    			infinite: 4,
    			delay: 5,
    			colorRange: 14,
    			colorArray: 15,
    			amount: 6,
    			iterationCount: 7,
    			fallDistance: 8,
    			rounded: 9,
    			cone: 10,
    			noGravity: 11,
    			destroyOnComplete: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Confetti",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get size() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get infinite() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infinite(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delay() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delay(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorRange() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorRange(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorArray() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorArray(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get amount() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iterationCount() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iterationCount(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fallDistance() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fallDistance(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cone() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cone(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGravity() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGravity(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get destroyOnComplete() {
    		throw new Error("<Confetti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set destroyOnComplete(value) {
    		throw new Error("<Confetti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-material-icons\Flag.svelte generated by Svelte v3.46.6 */

    const file$a = "node_modules\\svelte-material-icons\\Flag.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z");
    			attr_dev(path, "fill", /*color*/ ctx[2]);
    			add_location(path, file$a, 8, 59, 234);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			add_location(svg, file$a, 8, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 4) {
    				attr_dev(path, "fill", /*color*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Flag', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Flag> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Flag extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Flag",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get size() {
    		throw new Error("<Flag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Flag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Flag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Flag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Flag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Flag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Flag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Flag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Flag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Flag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\icons\Dictionary.svelte generated by Svelte v3.46.6 */

    const file$9 = "src\\icons\\Dictionary.svelte";

    function create_fragment$9(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17.5 14.33C18.29 14.33 19.13 14.41 20 14.57V16.07C19.38 15.91 18.54 15.83 17.5 15.83C15.6 15.83 14.11 16.16 13 16.82V15.13C14.17 14.6 15.67 14.33 17.5 14.33M13 12.46C14.29 11.93 15.79 11.67 17.5 11.67C18.29 11.67 19.13 11.74 20 11.9V13.4C19.38 13.24 18.54 13.16 17.5 13.16C15.6 13.16 14.11 13.5 13 14.15M17.5 10.5C15.6 10.5 14.11 10.82 13 11.5V9.84C14.23 9.28 15.73 9 17.5 9C18.29 9 19.13 9.08 20 9.23V10.78C19.26 10.59 18.41 10.5 17.5 10.5M21 18.5V7C19.96 6.67 18.79 6.5 17.5 6.5C15.45 6.5 13.62 7 12 8V19.5C13.62 18.5 15.45 18 17.5 18C18.69 18 19.86 18.16 21 18.5M17.5 4.5C19.85 4.5 21.69 5 23 6V20.56C23 20.68 22.95 20.8 22.84 20.91C22.73 21 22.61 21.08 22.5 21.08C22.39 21.08 22.31 21.06 22.25 21.03C20.97 20.34 19.38 20 17.5 20C15.45 20 13.62 20.5 12 21.5C10.66 20.5 8.83 20 6.5 20C4.84 20 3.25 20.36 1.75 21.07C1.72 21.08 1.68 21.08 1.63 21.1C1.59 21.11 1.55 21.12 1.5 21.12C1.39 21.12 1.27 21.08 1.16 21C1.05 20.89 1 20.78 1 20.65V6C2.34 5 4.18 4.5 6.5 4.5C8.83 4.5 10.66 5 12 6C13.34 5 15.17 4.5 17.5 4.5Z");
    			add_location(path, file$9, 8, 72, 255);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			attr_dev(svg, "fill", /*color*/ ctx[2]);
    			add_location(svg, file$9, 8, 0, 183);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 4) {
    				attr_dev(svg, "fill", /*color*/ ctx[2]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dictionary', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dictionary> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Dictionary extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dictionary",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get size() {
    		throw new Error("<Dictionary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Dictionary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Dictionary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Dictionary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Dictionary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Dictionary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Dictionary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Dictionary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Dictionary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Dictionary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\icons\QuestionMark.svelte generated by Svelte v3.46.6 */

    const file$8 = "src\\icons\\QuestionMark.svelte";

    function create_fragment$8(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path, "d", "M11.07,12.85c0.77-1.39,2.25-2.21,3.11-3.44c0.91-1.29,0.4-3.7-2.18-3.7c-1.69,0-2.52,1.28-2.87,2.34L6.54,6.96 C7.25,4.83,9.18,3,11.99,3c2.35,0,3.96,1.07,4.78,2.41c0.7,1.15,1.11,3.3,0.03,4.9c-1.2,1.77-2.35,2.31-2.97,3.45 c-0.25,0.46-0.35,0.76-0.35,2.24h-2.89C10.58,15.22,10.46,13.95,11.07,12.85z M14,20c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-1.1,0.9-2,2-2 S14,18.9,14,20z");
    			add_location(path, file$8, 8, 72, 255);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			attr_dev(svg, "fill", /*color*/ ctx[2]);
    			add_location(svg, file$8, 8, 0, 183);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 4) {
    				attr_dev(svg, "fill", /*color*/ ctx[2]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QuestionMark', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QuestionMark> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class QuestionMark extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuestionMark",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get size() {
    		throw new Error("<QuestionMark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<QuestionMark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<QuestionMark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<QuestionMark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<QuestionMark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<QuestionMark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<QuestionMark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<QuestionMark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<QuestionMark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<QuestionMark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\icons\Insensitive.svelte generated by Svelte v3.46.6 */

    const file$7 = "src\\icons\\Insensitive.svelte";

    function create_fragment$7(ctx) {
    	let svg;
    	let path0;
    	let circle0;
    	let circle1;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0V0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$7, 9, 2, 259);
    			attr_dev(circle0, "cx", "15.5");
    			attr_dev(circle0, "cy", "9.5");
    			attr_dev(circle0, "r", "1.5");
    			add_location(circle0, file$7, 9, 41, 298);
    			attr_dev(circle1, "cx", "8.5");
    			attr_dev(circle1, "cy", "9.5");
    			attr_dev(circle1, "r", "1.5");
    			add_location(circle1, file$7, 9, 77, 334);
    			attr_dev(path1, "d", "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z");
    			add_location(path1, file$7, 10, 2, 373);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			attr_dev(svg, "fill", /*color*/ ctx[2]);
    			add_location(svg, file$7, 8, 0, 183);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewBox*/ 8) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 4) {
    				attr_dev(svg, "fill", /*color*/ ctx[2]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Insensitive', slots, []);
    	let { size = "1em" } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { color = "currentColor" } = $$props;
    	let { viewBox = "0 0 24 24" } = $$props;
    	const writable_props = ['size', 'width', 'height', 'color', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Insensitive> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	$$self.$capture_state = () => ({ size, width, height, color, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('viewBox' in $$props) $$invalidate(3, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, color, viewBox, size];
    }

    class Insensitive extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			size: 4,
    			width: 0,
    			height: 1,
    			color: 2,
    			viewBox: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Insensitive",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get size() {
    		throw new Error("<Insensitive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Insensitive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Insensitive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Insensitive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Insensitive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Insensitive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Insensitive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Insensitive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Insensitive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Insensitive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\modals\Report.svelte generated by Svelte v3.46.6 */
    const file$6 = "src\\modals\\Report.svelte";

    // (31:2) 
    function create_title_slot$1(ctx) {
    	let h1;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Report ");
    			t1 = text(/*word*/ ctx[1]);
    			attr_dev(h1, "slot", "title");
    			add_location(h1, file$6, 30, 2, 881);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*word*/ 2) set_data_dev(t1, /*word*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$1.name,
    		type: "slot",
    		source: "(31:2) ",
    		ctx
    	});

    	return block;
    }

    // (35:4) {:else}
    function create_else_block$2(ctx) {
    	let actionbutton0;
    	let t;
    	let actionbutton1;
    	let current;

    	actionbutton0 = new ActionButton({
    			props: {
    				onClick: /*func*/ ctx[6],
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	actionbutton1 = new ActionButton({
    			props: {
    				onClick: /*func_1*/ ctx[7],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(actionbutton0.$$.fragment);
    			t = space();
    			create_component(actionbutton1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(actionbutton1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionbutton0_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton0.$set(actionbutton0_changes);
    			const actionbutton1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionbutton1_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton1.$set(actionbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(actionbutton1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(35:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if success}
    function create_if_block$3(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "submitted! Thank you!";
    			add_location(h5, file$6, 33, 6, 978);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(33:4) {#if success}",
    		ctx
    	});

    	return block;
    }

    // (36:6) <ActionButton onClick={() => handleReport('insensitive')}>
    function create_default_slot_2$1(ctx) {
    	let insensitive;
    	let t;
    	let current;
    	insensitive = new Insensitive({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(insensitive.$$.fragment);
    			t = text("\r\n        Offensive");
    		},
    		m: function mount(target, anchor) {
    			mount_component(insensitive, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(insensitive.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(insensitive.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(insensitive, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(36:6) <ActionButton onClick={() => handleReport('insensitive')}>",
    		ctx
    	});

    	return block;
    }

    // (40:6) <ActionButton onClick={() => handleReport('obscure')}>
    function create_default_slot_1$1(ctx) {
    	let questionmark;
    	let t;
    	let current;
    	questionmark = new QuestionMark({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(questionmark.$$.fragment);
    			t = text("\r\n        Obscure");
    		},
    		m: function mount(target, anchor) {
    			mount_component(questionmark, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(questionmark.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(questionmark.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(questionmark, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(40:6) <ActionButton onClick={() => handleReport('obscure')}>",
    		ctx
    	});

    	return block;
    }

    // (32:2) 
    function create_content_slot$1(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*success*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "controls svelte-1bjm625");
    			attr_dev(div, "slot", "content");
    			add_location(div, file$6, 31, 2, 918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$1.name,
    		type: "slot",
    		source: "(32:2) ",
    		ctx
    	});

    	return block;
    }

    // (47:4) <ActionButton onClick={handleClose}>
    function create_default_slot$2(ctx) {
    	let close;
    	let t;
    	let current;
    	close = new Close({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(close.$$.fragment);
    			t = text("\r\n      Close");
    		},
    		m: function mount(target, anchor) {
    			mount_component(close, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(close, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(47:4) <ActionButton onClick={handleClose}>",
    		ctx
    	});

    	return block;
    }

    // (46:2) 
    function create_controls_slot$1(ctx) {
    	let div;
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*handleClose*/ ctx[5],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(actionbutton.$$.fragment);
    			attr_dev(div, "class", "controls svelte-1bjm625");
    			attr_dev(div, "slot", "controls");
    			add_location(div, file$6, 45, 2, 1307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot$1.name,
    		type: "slot",
    		source: "(46:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				open: /*open*/ ctx[0],
    				onClose: /*onClose*/ ctx[2],
    				$$slots: {
    					controls: [create_controls_slot$1],
    					content: [create_content_slot$1],
    					title: [create_title_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.open = /*open*/ ctx[0];
    			if (dirty & /*onClose*/ 4) modal_changes.onClose = /*onClose*/ ctx[2];

    			if (dirty & /*$$scope, success, word*/ 266) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Report', slots, []);
    	let { word } = $$props;
    	let { onClose } = $$props;
    	let { open = false } = $$props;
    	let success = false;

    	const handleReport = async reason => {
    		await supabase.from('flagged').insert({ userId: getUserId(), word, reason });
    		$$invalidate(3, success = true);
    		await delay(1000);
    		$$invalidate(0, open = false);
    	};

    	const handleClose = () => {
    		$$invalidate(3, success = false);
    		onClose();
    	};

    	const writable_props = ['word', 'onClose', 'open'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Report> was created with unknown prop '${key}'`);
    	});

    	const func = () => handleReport('insensitive');
    	const func_1 = () => handleReport('obscure');

    	$$self.$$set = $$props => {
    		if ('word' in $$props) $$invalidate(1, word = $$props.word);
    		if ('onClose' in $$props) $$invalidate(2, onClose = $$props.onClose);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	$$self.$capture_state = () => ({
    		QuestionMark,
    		Close,
    		ActionButton,
    		Modal,
    		Insensitive,
    		supabase,
    		delay,
    		getUserId,
    		word,
    		onClose,
    		open,
    		success,
    		handleReport,
    		handleClose
    	});

    	$$self.$inject_state = $$props => {
    		if ('word' in $$props) $$invalidate(1, word = $$props.word);
    		if ('onClose' in $$props) $$invalidate(2, onClose = $$props.onClose);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('success' in $$props) $$invalidate(3, success = $$props.success);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, word, onClose, success, handleReport, handleClose, func, func_1];
    }

    class Report extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { word: 1, onClose: 2, open: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Report",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*word*/ ctx[1] === undefined && !('word' in props)) {
    			console.warn("<Report> was created without expected prop 'word'");
    		}

    		if (/*onClose*/ ctx[2] === undefined && !('onClose' in props)) {
    			console.warn("<Report> was created without expected prop 'onClose'");
    		}
    	}

    	get word() {
    		throw new Error("<Report>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set word(value) {
    		throw new Error("<Report>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClose() {
    		throw new Error("<Report>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<Report>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Report>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Report>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\modals\Definition.svelte generated by Svelte v3.46.6 */
    const file$5 = "src\\modals\\Definition.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (33:0) <IconButton onClick={handleOpen}>
    function create_default_slot_2(ctx) {
    	let dictionary;
    	let current;
    	dictionary = new Dictionary({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dictionary.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dictionary, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dictionary.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dictionary.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dictionary, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(33:0) <IconButton onClick={handleOpen}>",
    		ctx
    	});

    	return block;
    }

    // (40:6) <IconButton onClick={handleOpenReport}>
    function create_default_slot_1(ctx) {
    	let flag;
    	let current;
    	flag = new Flag({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(flag.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flag, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flag.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flag.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flag, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(40:6) <IconButton onClick={handleOpenReport}>",
    		ctx
    	});

    	return block;
    }

    // (37:2) 
    function create_title_slot(ctx) {
    	let div1;
    	let h1;
    	let t0;
    	let t1;
    	let div0;
    	let iconbutton;
    	let current;

    	iconbutton = new IconButton({
    			props: {
    				onClick: /*handleOpenReport*/ ctx[7],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			t0 = text(/*word*/ ctx[0]);
    			t1 = space();
    			div0 = element("div");
    			create_component(iconbutton.$$.fragment);
    			add_location(h1, file$5, 37, 4, 1164);
    			attr_dev(div0, "class", "report svelte-1yamken");
    			add_location(div0, file$5, 38, 4, 1185);
    			attr_dev(div1, "class", "title svelte-1yamken");
    			attr_dev(div1, "slot", "title");
    			add_location(div1, file$5, 36, 2, 1130);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(h1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(iconbutton, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*word*/ 1) set_data_dev(t0, /*word*/ ctx[0]);
    			const iconbutton_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				iconbutton_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton.$set(iconbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(iconbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot.name,
    		type: "slot",
    		source: "(37:2) ",
    		ctx
    	});

    	return block;
    }

    // (48:21) 
    function create_if_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*result*/ ctx[3][0]) return create_if_block_2$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(48:21) ",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if loading}
    function create_if_block$2(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(46:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (66:6) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("no definitions found");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(66:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:6) {#if result[0]}
    function create_if_block_2$1(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let t2;
    	let a;
    	let t3;
    	let a_href_value;
    	let if_block = /*result*/ ctx[3][0].phonetic && create_if_block_3(ctx);
    	let each_value = /*result*/ ctx[3][0].meanings;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div = element("div");
    			t2 = text("Provided by ");
    			a = element("a");
    			t3 = text("Wiktionary");
    			attr_dev(a, "href", a_href_value = /*result*/ ctx[3][0].sourceUrls[0]);
    			add_location(a, file$5, 63, 22, 1844);
    			add_location(div, file$5, 62, 8, 1815);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t2);
    			append_dev(div, a);
    			append_dev(a, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (/*result*/ ctx[3][0].phonetic) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*result*/ 8) {
    				each_value = /*result*/ ctx[3][0].meanings;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*result*/ 8 && a_href_value !== (a_href_value = /*result*/ ctx[3][0].sourceUrls[0])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(49:6) {#if result[0]}",
    		ctx
    	});

    	return block;
    }

    // (50:8) {#if result[0].phonetic}
    function create_if_block_3(ctx) {
    	let h2;
    	let t_value = /*result*/ ctx[3][0].phonetic + "";
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			add_location(h2, file$5, 50, 10, 1463);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result*/ 8 && t_value !== (t_value = /*result*/ ctx[3][0].phonetic + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(50:8) {#if result[0].phonetic}",
    		ctx
    	});

    	return block;
    }

    // (56:12) {#each meaning.definitions as definition}
    function create_each_block_1(ctx) {
    	let p;
    	let t_value = /*definition*/ ctx[12].definition + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-1yamken");
    			add_location(p, file$5, 56, 14, 1685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result*/ 8 && t_value !== (t_value = /*definition*/ ctx[12].definition + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(56:12) {#each meaning.definitions as definition}",
    		ctx
    	});

    	return block;
    }

    // (53:8) {#each result[0].meanings as meaning}
    function create_each_block$2(ctx) {
    	let h3;
    	let t0_value = /*meaning*/ ctx[9].partOfSpeech + "";
    	let t0;
    	let t1;
    	let div;
    	let each_value_1 = /*meaning*/ ctx[9].definitions;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$5, 53, 10, 1566);
    			add_location(div, file$5, 54, 10, 1609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result*/ 8 && t0_value !== (t0_value = /*meaning*/ ctx[9].partOfSpeech + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*result*/ 8) {
    				each_value_1 = /*meaning*/ ctx[9].definitions;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(53:8) {#each result[0].meanings as meaning}",
    		ctx
    	});

    	return block;
    }

    // (45:2) 
    function create_content_slot(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[4]) return 0;
    		if (/*result*/ ctx[3]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "slot", "content");
    			add_location(div, file$5, 44, 2, 1315);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(45:2) ",
    		ctx
    	});

    	return block;
    }

    // (72:4) <ActionButton onClick={handleClose}>
    function create_default_slot$1(ctx) {
    	let close;
    	let t;
    	let current;
    	close = new Close({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(close.$$.fragment);
    			t = text("\r\n      Close");
    		},
    		m: function mount(target, anchor) {
    			mount_component(close, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(close, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(72:4) <ActionButton onClick={handleClose}>",
    		ctx
    	});

    	return block;
    }

    // (71:2) 
    function create_controls_slot(ctx) {
    	let div;
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*handleClose*/ ctx[6],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(actionbutton.$$.fragment);
    			attr_dev(div, "slot", "controls");
    			add_location(div, file$5, 70, 2, 1991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot.name,
    		type: "slot",
    		source: "(71:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let iconbutton;
    	let t0;
    	let modal;
    	let t1;
    	let report;
    	let current;

    	iconbutton = new IconButton({
    			props: {
    				onClick: /*handleOpen*/ ctx[5],
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal = new Modal({
    			props: {
    				open: /*open*/ ctx[1],
    				onClose: /*handleClose*/ ctx[6],
    				$$slots: {
    					controls: [create_controls_slot],
    					content: [create_content_slot],
    					title: [create_title_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	report = new Report({
    			props: {
    				word: /*word*/ ctx[0],
    				open: /*openReport*/ ctx[2],
    				onClose: /*handleCloseReport*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iconbutton.$$.fragment);
    			t0 = space();
    			create_component(modal.$$.fragment);
    			t1 = space();
    			create_component(report.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbutton, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modal, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(report, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbutton_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				iconbutton_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton.$set(iconbutton_changes);
    			const modal_changes = {};
    			if (dirty & /*open*/ 2) modal_changes.open = /*open*/ ctx[1];

    			if (dirty & /*$$scope, loading, result, word*/ 32793) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    			const report_changes = {};
    			if (dirty & /*word*/ 1) report_changes.word = /*word*/ ctx[0];
    			if (dirty & /*openReport*/ 4) report_changes.open = /*openReport*/ ctx[2];
    			report.$set(report_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			transition_in(report.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			transition_out(report.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbutton, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modal, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(report, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Definition', slots, []);
    	let { word = '' } = $$props;
    	let open = false;
    	let openReport = false;
    	let result;
    	let loading = false;

    	const handleOpen = async () => {
    		$$invalidate(1, open = true);
    		$$invalidate(4, loading = true);
    		const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    		$$invalidate(4, loading = false);
    		$$invalidate(3, result = await response.json());
    	};

    	const handleClose = () => {
    		$$invalidate(3, result = undefined);
    		$$invalidate(1, open = false);
    	};

    	const handleOpenReport = () => {
    		$$invalidate(2, openReport = true);
    	};

    	const handleCloseReport = () => {
    		$$invalidate(2, openReport = false);
    	};

    	const writable_props = ['word'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Definition> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('word' in $$props) $$invalidate(0, word = $$props.word);
    	};

    	$$self.$capture_state = () => ({
    		Close,
    		Flag,
    		IconButton,
    		ActionButton,
    		Dictionary,
    		Modal,
    		Report,
    		Spinner,
    		word,
    		open,
    		openReport,
    		result,
    		loading,
    		handleOpen,
    		handleClose,
    		handleOpenReport,
    		handleCloseReport
    	});

    	$$self.$inject_state = $$props => {
    		if ('word' in $$props) $$invalidate(0, word = $$props.word);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    		if ('openReport' in $$props) $$invalidate(2, openReport = $$props.openReport);
    		if ('result' in $$props) $$invalidate(3, result = $$props.result);
    		if ('loading' in $$props) $$invalidate(4, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		word,
    		open,
    		openReport,
    		result,
    		loading,
    		handleOpen,
    		handleClose,
    		handleOpenReport,
    		handleCloseReport
    	];
    }

    class Definition extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { word: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Definition",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get word() {
    		throw new Error("<Definition>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set word(value) {
    		throw new Error("<Definition>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Word.svelte generated by Svelte v3.46.6 */
    const file$4 = "src\\Word.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (8:2) {#each word as tile (tile.id)}
    function create_each_block$1(key_1, ctx) {
    	let div;
    	let boardtile;
    	let t;
    	let div_data_id_value;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop$2;
    	let current;

    	boardtile = new BoardTile({
    			props: {
    				active: false,
    				adjacent: false,
    				letter: /*tile*/ ctx[1].letter,
    				selected: false,
    				multiplier: /*tile*/ ctx[1].multiplier,
    				highlighted: "green",
    				size: "small"
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(boardtile.$$.fragment);
    			t = space();
    			attr_dev(div, "data-id", div_data_id_value = /*tile*/ ctx[1].id);
    			add_location(div, file$4, 8, 4, 256);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(boardtile, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const boardtile_changes = {};
    			if (dirty & /*word*/ 1) boardtile_changes.letter = /*tile*/ ctx[1].letter;
    			if (dirty & /*word*/ 1) boardtile_changes.multiplier = /*tile*/ ctx[1].multiplier;
    			boardtile.$set(boardtile_changes);

    			if (!current || dirty & /*word*/ 1 && div_data_id_value !== (div_data_id_value = /*tile*/ ctx[1].id)) {
    				attr_dev(div, "data-id", div_data_id_value);
    			}
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, { duration: flipDuration });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boardtile.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				div_intro = create_in_transition(div, receive, {
    					key: /*tile*/ ctx[1].id,
    					duration: flipDuration
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boardtile.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, send, {
    				key: /*tile*/ ctx[1].id,
    				duration: flipDuration
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(boardtile);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(8:2) {#each word as tile (tile.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*word*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*tile*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "container svelte-1wzq7ec");
    			add_location(div, file$4, 6, 0, 195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*word, flipDuration*/ 1) {
    				each_value = /*word*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
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
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Word', slots, []);
    	let { word } = $$props;
    	const writable_props = ['word'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Word> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('word' in $$props) $$invalidate(0, word = $$props.word);
    	};

    	$$self.$capture_state = () => ({
    		flip,
    		BoardTile,
    		send,
    		receive,
    		flipDuration,
    		word
    	});

    	$$self.$inject_state = $$props => {
    		if ('word' in $$props) $$invalidate(0, word = $$props.word);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [word];
    }

    class Word extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { word: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Word",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*word*/ ctx[0] === undefined && !('word' in props)) {
    			console.warn("<Word> was created without expected prop 'word'");
    		}
    	}

    	get word() {
    		throw new Error("<Word>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set word(value) {
    		throw new Error("<Word>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\WordContainer.svelte generated by Svelte v3.46.6 */
    const file$3 = "src\\WordContainer.svelte";

    // (10:4) {#if $game.latestWord !== undefined}
    function create_if_block$1(ctx) {
    	let previous_key = /*$game*/ ctx[0].latestWord.map(func).join();
    	let t0;
    	let div0;
    	let previous_key_1 = /*$game*/ ctx[0].marquee;
    	let t1;
    	let div2;
    	let div1;
    	let definition;
    	let t2;
    	let word;
    	let t3;
    	let previous_key_2 = /*$game*/ ctx[0].latestWord.map(func_2).join();
    	let current;
    	let key_block0 = create_key_block_2(ctx);
    	let key_block1 = create_key_block_1$1(ctx);

    	definition = new Definition({
    			props: {
    				word: /*$game*/ ctx[0].latestWord.map(func_1).join('')
    			},
    			$$inline: true
    		});

    	word = new Word({
    			props: { word: /*$game*/ ctx[0].latestWord },
    			$$inline: true
    		});

    	let key_block2 = create_key_block$1(ctx);

    	const block = {
    		c: function create() {
    			key_block0.c();
    			t0 = space();
    			div0 = element("div");
    			key_block1.c();
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(definition.$$.fragment);
    			t2 = space();
    			create_component(word.$$.fragment);
    			t3 = space();
    			key_block2.c();
    			attr_dev(div0, "class", "marquee-outer svelte-nkmujb");
    			add_location(div0, file$3, 17, 6, 556);
    			attr_dev(div1, "class", "word-score svelte-nkmujb");
    			add_location(div1, file$3, 29, 8, 900);
    			attr_dev(div2, "class", "word-container svelte-nkmujb");
    			add_location(div2, file$3, 28, 6, 864);
    		},
    		m: function mount(target, anchor) {
    			key_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			key_block1.m(div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			mount_component(definition, div1, null);
    			append_dev(div2, t2);
    			mount_component(word, div2, null);
    			append_dev(div2, t3);
    			key_block2.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$game*/ 1 && safe_not_equal(previous_key, previous_key = /*$game*/ ctx[0].latestWord.map(func).join())) {
    				group_outros();
    				transition_out(key_block0, 1, 1, noop$2);
    				check_outros();
    				key_block0 = create_key_block_2(ctx);
    				key_block0.c();
    				transition_in(key_block0);
    				key_block0.m(t0.parentNode, t0);
    			} else {
    				key_block0.p(ctx, dirty);
    			}

    			if (dirty & /*$game*/ 1 && safe_not_equal(previous_key_1, previous_key_1 = /*$game*/ ctx[0].marquee)) {
    				group_outros();
    				transition_out(key_block1, 1, 1, noop$2);
    				check_outros();
    				key_block1 = create_key_block_1$1(ctx);
    				key_block1.c();
    				transition_in(key_block1);
    				key_block1.m(div0, null);
    			} else {
    				key_block1.p(ctx, dirty);
    			}

    			const definition_changes = {};
    			if (dirty & /*$game*/ 1) definition_changes.word = /*$game*/ ctx[0].latestWord.map(func_1).join('');
    			definition.$set(definition_changes);
    			const word_changes = {};
    			if (dirty & /*$game*/ 1) word_changes.word = /*$game*/ ctx[0].latestWord;
    			word.$set(word_changes);

    			if (dirty & /*$game*/ 1 && safe_not_equal(previous_key_2, previous_key_2 = /*$game*/ ctx[0].latestWord.map(func_2).join())) {
    				group_outros();
    				transition_out(key_block2, 1, 1, noop$2);
    				check_outros();
    				key_block2 = create_key_block$1(ctx);
    				key_block2.c();
    				transition_in(key_block2);
    				key_block2.m(div2, null);
    			} else {
    				key_block2.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block0);
    			transition_in(key_block1);
    			transition_in(definition.$$.fragment, local);
    			transition_in(word.$$.fragment, local);
    			transition_in(key_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block0);
    			transition_out(key_block1);
    			transition_out(definition.$$.fragment, local);
    			transition_out(word.$$.fragment, local);
    			transition_out(key_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			key_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			key_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			destroy_component(definition);
    			destroy_component(word);
    			key_block2.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:4) {#if $game.latestWord !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (12:8) {#if $game.latestScore > 30}
    function create_if_block_1(ctx) {
    	let div;
    	let confetti;
    	let current;
    	confetti = new Confetti({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(confetti.$$.fragment);
    			attr_dev(div, "class", "confetti svelte-nkmujb");
    			add_location(div, file$3, 12, 10, 455);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(confetti, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(confetti.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(confetti.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(confetti);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(12:8) {#if $game.latestScore > 30}",
    		ctx
    	});

    	return block;
    }

    // (11:6) {#key $game.latestWord.map(t => t.letter).join()}
    function create_key_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$game*/ ctx[0].latestScore > 30 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$game*/ ctx[0].latestScore > 30) {
    				if (if_block) {
    					if (dirty & /*$game*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block_2.name,
    		type: "key",
    		source: "(11:6) {#key $game.latestWord.map(t => t.letter).join()}",
    		ctx
    	});

    	return block;
    }

    // (19:8) {#key $game.marquee}
    function create_key_block_1$1(ctx) {
    	let span;
    	let t_value = (/*$game*/ ctx[0].marquee ?? 'LATEST WORD') + "";
    	let t;
    	let span_intro;
    	let span_outro;
    	let current;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "marquee-inner svelte-nkmujb");
    			add_location(span, file$3, 19, 10, 623);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$game*/ 1) && t_value !== (t_value = (/*$game*/ ctx[0].marquee ?? 'LATEST WORD') + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (span_outro) span_outro.end(1);
    				span_intro = create_in_transition(span, fly, { y: 20, delay: 500 });
    				span_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (span_intro) span_intro.invalidate();
    			span_outro = create_out_transition(span, fade, { duration: 250 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching && span_outro) span_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block_1$1.name,
    		type: "key",
    		source: "(19:8) {#key $game.marquee}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#key $game.latestWord.map(t => t.letter).join()}
    function create_key_block$1(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*$game*/ ctx[0].latestScore + "";
    	let t1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("+");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "word-score svelte-nkmujb");
    			add_location(div, file$3, 34, 10, 1129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$game*/ 1 && t1_value !== (t1_value = /*$game*/ ctx[0].latestScore + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, flyIn, { y: 20, delay: 500 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$1.name,
    		type: "key",
    		source: "(34:8) {#key $game.latestWord.map(t => t.letter).join()}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	let if_block = /*$game*/ ctx[0].latestWord !== undefined && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "latest-word svelte-nkmujb");
    			add_location(div, file$3, 8, 2, 283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$game*/ ctx[0].latestWord !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$game*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = t => t.letter;
    const func_1 = t => t.letter;
    const func_2 = t => t.letter;

    function instance$3($$self, $$props, $$invalidate) {
    	let $game;
    	validate_store(gameState, 'game');
    	component_subscribe($$self, gameState, $$value => $$invalidate(0, $game = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WordContainer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WordContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fly,
    		fade,
    		Confetti,
    		Definition,
    		game: gameState,
    		Word,
    		flyIn,
    		$game
    	});

    	return [$game];
    }

    class WordContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WordContainer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Stats.svelte generated by Svelte v3.46.6 */

    const { Object: Object_1$1 } = globals;
    const file$2 = "src\\Stats.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i][0];
    	child_ctx[6] = list[i][1];
    	return child_ctx;
    }

    // (14:2) {#each sorted.slice(0, 15) as [ letter, weight ] (letter)}
    function create_each_block(key_1, ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let span;
    	let t1_value = /*letter*/ ctx[5] + "";
    	let t1;
    	let t2;
    	let div1_intro;
    	let div1_outro;
    	let rect;
    	let stop_animation = noop$2;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div0, "class", "bar svelte-pcyia3");
    			set_style(div0, "height", 100 * /*weight*/ ctx[6] / /*max*/ ctx[2] + "%");
    			toggle_class(div0, "sampled", /*$stats*/ ctx[1].newLetters.includes(/*letter*/ ctx[5]));
    			add_location(div0, file$2, 20, 6, 815);
    			attr_dev(span, "class", "letter svelte-pcyia3");
    			add_location(span, file$2, 25, 6, 964);
    			attr_dev(div1, "class", "bar-container svelte-pcyia3");
    			add_location(div1, file$2, 14, 4, 587);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, span);
    			append_dev(span, t1);
    			append_dev(div1, t2);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*sorted, max*/ 5) {
    				set_style(div0, "height", 100 * /*weight*/ ctx[6] / /*max*/ ctx[2] + "%");
    			}

    			if (dirty & /*$stats, sorted*/ 3) {
    				toggle_class(div0, "sampled", /*$stats*/ ctx[1].newLetters.includes(/*letter*/ ctx[5]));
    			}

    			if ((!current || dirty & /*sorted*/ 1) && t1_value !== (t1_value = /*letter*/ ctx[5] + "")) set_data_dev(t1, t1_value);
    		},
    		r: function measure() {
    			rect = div1.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div1);
    			stop_animation();
    			add_transform(div1, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div1, rect, flip, { duration: 500, delay: 500 });
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);

    				div1_intro = create_in_transition(div1, receive, {
    					key: /*letter*/ ctx[5],
    					duration: 500,
    					delay: 500
    				});

    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();

    			div1_outro = create_out_transition(div1, send, {
    				key: /*letter*/ ctx[5],
    				duration: 500,
    				delay: 500
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(14:2) {#each sorted.slice(0, 15) as [ letter, weight ] (letter)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*sorted*/ ctx[0].slice(0, 15);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*letter*/ ctx[5];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "chart svelte-pcyia3");
    			add_location(div, file$2, 12, 0, 502);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sorted, max, $stats*/ 7) {
    				each_value = /*sorted*/ ctx[0].slice(0, 15);
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
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
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
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
    const stats = writable({});

    function instance$2($$self, $$props, $$invalidate) {
    	let sorted;
    	let max;

    	let $stats,
    		$$unsubscribe_stats = noop$2;

    	validate_store(stats, 'stats');
    	component_subscribe($$self, stats, $$value => $$invalidate(1, $stats = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_stats());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stats', slots, []);
    	var _a, _b;
    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Stats> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		_a,
    		_b,
    		writable,
    		stats,
    		_a,
    		_b,
    		flip,
    		send,
    		receive,
    		sorted,
    		max,
    		$stats
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) $$invalidate(3, _a = $$props._a);
    		if ('_b' in $$props) $$invalidate(4, _b = $$props._b);
    		if ('sorted' in $$props) $$invalidate(0, sorted = $$props.sorted);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$stats*/ 2) {
    			$$invalidate(0, sorted = Object.entries($stats.freqs).sort((a, b) => b[1] - a[1]));
    		}

    		if ($$self.$$.dirty & /*sorted, _a, _b*/ 25) {
    			$$invalidate(2, max = $$invalidate(4, _b = $$invalidate(3, _a = sorted === null || sorted === void 0
    			? void 0
    			: sorted[0]) === null || _a === void 0
    			? void 0
    			: _a[1]) !== null && _b !== void 0
    			? _b
    			: 0);
    		}
    	};

    	return [sorted, $stats, max, _a, _b];
    }

    class Stats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stats",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Game.svelte generated by Svelte v3.46.6 */

    const { Object: Object_1 } = globals;
    const file$1 = "src\\Game.svelte";

    // (154:4) <ActionButton        onClick={$game.shuffles > 0 ? handleShuffle : undefined}        disabled={$game.shuffles === 0}      >
    function create_default_slot(ctx) {
    	let span;
    	let t0_value = /*$game*/ ctx[1].shuffles + "";
    	let t0;
    	let t1;
    	let shuffle_1;
    	let current;
    	shuffle_1 = new Shuffle({ $$inline: true });

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(shuffle_1.$$.fragment);
    			attr_dev(span, "class", "svelte-1wnuyp1");
    			add_location(span, file$1, 157, 6, 5794);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(shuffle_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$game*/ 2) && t0_value !== (t0_value = /*$game*/ ctx[1].shuffles + "")) set_data_dev(t0, t0_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(shuffle_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(shuffle_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			destroy_component(shuffle_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(154:4) <ActionButton        onClick={$game.shuffles > 0 ? handleShuffle : undefined}        disabled={$game.shuffles === 0}      >",
    		ctx
    	});

    	return block;
    }

    // (171:4) {:else}
    function create_else_block(ctx) {
    	let previous_key = /*$game*/ ctx[1].score;
    	let key_block_anchor;
    	let key_block = create_key_block_1(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$game*/ 2 && safe_not_equal(previous_key, previous_key = /*$game*/ ctx[1].score)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$2);
    				check_outros();
    				key_block = create_key_block_1(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(key_block);
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(171:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (165:4) {#if loading}
    function create_if_block_2(ctx) {
    	let div;
    	let t0;
    	let br;
    	let t1;
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Loading Dictionary...\r\n        ");
    			br = element("br");
    			t1 = space();
    			create_component(spinner.$$.fragment);
    			add_location(br, file$1, 167, 8, 6007);
    			attr_dev(div, "class", "loading svelte-1wnuyp1");
    			add_location(div, file$1, 165, 6, 5949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, br);
    			append_dev(div, t1);
    			mount_component(spinner, div, null);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(spinner);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(165:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (172:6) {#key $game.score}
    function create_key_block_1(ctx) {
    	let div;
    	let t_value = /*$game*/ ctx[1].score + "";
    	let t;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "svelte-1wnuyp1");
    			add_location(div, file$1, 172, 8, 6096);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$game*/ 2 && t_value !== (t_value = /*$game*/ ctx[1].score + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fly, { y: 20 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block_1.name,
    		type: "key",
    		source: "(172:6) {#key $game.score}",
    		ctx
    	});

    	return block;
    }

    // (185:0) {#if $game.lost}
    function create_if_block(ctx) {
    	let previous_key = /*$game*/ ctx[1].id;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$game*/ 2 && safe_not_equal(previous_key, previous_key = /*$game*/ ctx[1].id)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$2);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(185:0) {#if $game.lost}",
    		ctx
    	});

    	return block;
    }

    // (186:2) {#key $game.id}
    function create_key_block(ctx) {
    	let gameover;
    	let current;

    	gameover = new GameOver({
    			props: { onReset: /*handleReset*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(gameover.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(gameover, target, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gameover.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gameover.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gameover, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(186:2) {#key $game.id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let title;
    	let t0;
    	let div0;
    	let swaps;
    	let t1;
    	let streak;
    	let t2;
    	let wordchain;
    	let t3;
    	let div1;
    	let actionbutton;
    	let t4;
    	let div2;
    	let current_block_type_index;
    	let if_block0;
    	let t5;
    	let wordcontainer;
    	let t6;
    	let gameboard;
    	let t7;
    	let t8;
    	let div3;
    	let t9;
    	let bottomcontrols;
    	let t10;
    	let if_block2_anchor;
    	let current;
    	title = new Title({ $$inline: true });

    	swaps = new Swaps({
    			props: { swaps: /*$game*/ ctx[1].remainingSwaps },
    			$$inline: true
    		});

    	streak = new Streak({
    			props: { streak: /*$game*/ ctx[1].streak },
    			$$inline: true
    		});

    	wordchain = new WordChain({
    			props: { chain: /*$game*/ ctx[1].latestChain },
    			$$inline: true
    		});

    	actionbutton = new ActionButton({
    			props: {
    				onClick: /*$game*/ ctx[1].shuffles > 0
    				? /*handleShuffle*/ ctx[4]
    				: undefined,
    				disabled: /*$game*/ ctx[1].shuffles === 0,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	wordcontainer = new WordContainer({ $$inline: true });

    	gameboard = new Board({
    			props: { handleScore: /*handleScore*/ ctx[3] },
    			$$inline: true
    		});

    	let if_block1 = showStats ;

    	bottomcontrols = new BottomControls({
    			props: { onReset: /*func*/ ctx[5] },
    			$$inline: true
    		});

    	let if_block2 = /*$game*/ ctx[1].lost && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			create_component(title.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(swaps.$$.fragment);
    			t1 = space();
    			create_component(streak.$$.fragment);
    			t2 = space();
    			create_component(wordchain.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			create_component(actionbutton.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			if_block0.c();
    			t5 = space();
    			create_component(wordcontainer.$$.fragment);
    			t6 = space();
    			create_component(gameboard.$$.fragment);
    			t7 = space();
    			t8 = space();
    			div3 = element("div");
    			t9 = space();
    			create_component(bottomcontrols.$$.fragment);
    			t10 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div0, "class", "status svelte-1wnuyp1");
    			add_location(div0, file$1, 147, 2, 5469);
    			attr_dev(div1, "class", "shuffle-container svelte-1wnuyp1");
    			add_location(div1, file$1, 152, 2, 5628);
    			attr_dev(div2, "class", "score-container svelte-1wnuyp1");
    			add_location(div2, file$1, 163, 2, 5895);
    			attr_dev(div3, "class", "spacer svelte-1wnuyp1");
    			add_location(div3, file$1, 181, 2, 6273);
    			attr_dev(div4, "class", "container svelte-1wnuyp1");
    			add_location(div4, file$1, 145, 0, 5431);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			mount_component(title, div4, null);
    			append_dev(div4, t0);
    			append_dev(div4, div0);
    			mount_component(swaps, div0, null);
    			append_dev(div0, t1);
    			mount_component(streak, div0, null);
    			append_dev(div0, t2);
    			mount_component(wordchain, div0, null);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			mount_component(actionbutton, div1, null);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div4, t5);
    			mount_component(wordcontainer, div4, null);
    			append_dev(div4, t6);
    			mount_component(gameboard, div4, null);
    			append_dev(div4, t7);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div4, t9);
    			mount_component(bottomcontrols, div4, null);
    			insert_dev(target, t10, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const swaps_changes = {};
    			if (dirty & /*$game*/ 2) swaps_changes.swaps = /*$game*/ ctx[1].remainingSwaps;
    			swaps.$set(swaps_changes);
    			const streak_changes = {};
    			if (dirty & /*$game*/ 2) streak_changes.streak = /*$game*/ ctx[1].streak;
    			streak.$set(streak_changes);
    			const wordchain_changes = {};
    			if (dirty & /*$game*/ 2) wordchain_changes.chain = /*$game*/ ctx[1].latestChain;
    			wordchain.$set(wordchain_changes);
    			const actionbutton_changes = {};

    			if (dirty & /*$game*/ 2) actionbutton_changes.onClick = /*$game*/ ctx[1].shuffles > 0
    			? /*handleShuffle*/ ctx[4]
    			: undefined;

    			if (dirty & /*$game*/ 2) actionbutton_changes.disabled = /*$game*/ ctx[1].shuffles === 0;

    			if (dirty & /*$$scope, $game*/ 4098) {
    				actionbutton_changes.$$scope = { dirty, ctx };
    			}

    			actionbutton.$set(actionbutton_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div2, null);
    			}

    			if (/*$game*/ ctx[1].lost) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$game*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(swaps.$$.fragment, local);
    			transition_in(streak.$$.fragment, local);
    			transition_in(wordchain.$$.fragment, local);
    			transition_in(actionbutton.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(wordcontainer.$$.fragment, local);
    			transition_in(gameboard.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(bottomcontrols.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(swaps.$$.fragment, local);
    			transition_out(streak.$$.fragment, local);
    			transition_out(wordchain.$$.fragment, local);
    			transition_out(actionbutton.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(wordcontainer.$$.fragment, local);
    			transition_out(gameboard.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(bottomcontrols.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(title);
    			destroy_component(swaps);
    			destroy_component(streak);
    			destroy_component(wordchain);
    			destroy_component(actionbutton);
    			if_blocks[current_block_type_index].d();
    			destroy_component(wordcontainer);
    			destroy_component(gameboard);
    			destroy_component(bottomcontrols);
    			if (detaching) detach_dev(t10);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
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

    const showStats = false;

    function instance$1($$self, $$props, $$invalidate) {
    	let $game;
    	let $animating;
    	let $turns;
    	validate_store(gameState, 'game');
    	component_subscribe($$self, gameState, $$value => $$invalidate(1, $game = $$value));
    	validate_store(animating, 'animating');
    	component_subscribe($$self, animating, $$value => $$invalidate(7, $animating = $$value));
    	validate_store(turns, 'turns');
    	component_subscribe($$self, turns, $$value => $$invalidate(8, $turns = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Game', slots, []);
    	let dictionary;
    	let loading = true;

    	onMount(async () => {
    		dictionary = await loadDictionary();
    		$$invalidate(0, loading = false);

    		// initialize board on first load
    		loadGame(dictionary);
    	});

    	const handleReset = (abandoned = false) => {
    		if (abandoned) {
    			saveAnalytics($game, $turns.turns, { abandoned });
    		}

    		set_store_value(gameState, $game = resetGame($game, dictionary), $game);
    		clearGame();
    		resetTurns();
    	};

    	// const getTileId = (e) => parseInt((e.target as HTMLElement).getAttribute('data-id'));
    	const handleEndTurn = async () => {
    		if ($game.remainingSwaps <= 0) {
    			await delay(animationDuration * 2);
    			set_store_value(gameState, $game.lost = true, $game);
    			set_store_value(animating, $animating = false, $animating);
    		} else {
    			// re-enable input faster
    			set_store_value(animating, $animating = false, $animating);

    			await delay(animationDuration * 3);
    			set_store_value(gameState, $game.latestChain = 0, $game);
    			set_store_value(gameState, $game.marquee = undefined, $game);
    		}

    		return $game.lost;
    	};

    	// chain is incremented on subsequent recursive calls of handleScore
    	const handleScore = async (chain = 0, shuffle = false) => {
    		let { words, intersections } = findWords(dictionary, $game.board);

    		if (!words.length) {
    			if (!shuffle && chain === 0) {
    				set_store_value(gameState, $game.streak = 0, $game);
    			}

    			return await handleEndTurn();
    		}

    		const word = words[0];
    		$game.words.push(word);
    		set_store_value(gameState, $game.highlighted = highlightTiles(words, $game.highlighted), $game);
    		set_store_value(gameState, $game.intersections = intersections, $game);

    		// let user see match before exiting
    		await delay(2 * animationDuration / 3);

    		score(words[0], chain);
    		const filteredCoords = word.coords.filter((c, i) => !$game.intersections[word.word[i].id]);
    		set_store_value(gameState, $game.board = removeLetters($game.board, $game.turn, filteredCoords), $game);
    		set_store_value(gameState, $game.intersections = {}, $game);
    		await delay(animationDuration);
    		await handleScore(chain + 1);
    	};

    	const highlightTiles = (words, prevHighlighted) => {
    		const highlighted = Object.assign({}, prevHighlighted);

    		for (const word of words) {
    			let highlight = 'green';

    			if (word.axis === 'row' && word.word.length === DIMS.COLS || word.axis === 'col' && word.word.length === DIMS.ROWS) {
    				highlight = 'orange';
    			} else if (word.intersectingIds.length) {
    				for (const id of word.intersectingIds) {
    					highlighted[id] = 'red';
    				}

    				highlight = 'purple';
    			}

    			for (const tile of word.word) {
    				if (!highlighted[tile.id]) {
    					highlighted[tile.id] = highlight;
    				}
    			}
    		}

    		return highlighted;
    	};

    	const score = (word, chain) => {
    		set_store_value(gameState, $game.streak++, $game);

    		if ($game.streak > $game.bestStreak) {
    			set_store_value(gameState, $game.bestStreak = $game.streak, $game);
    		}

    		if (word.axis === 'row' && word.intersectingIds) {
    			set_store_value(gameState, $game.shuffles += word.intersectingIds.length, $game);
    		}

    		if (word.word.length === DIMS.COLS && word.axis === 'row') {
    			set_store_value(gameState, $game.shuffles++, $game);
    		}

    		if (word.word.length === DIMS.ROWS && word.axis === 'col') {
    			set_store_value(gameState, $game.shuffles++, $game);
    		}

    		if (chain === 0) {
    			set_store_value(gameState, $game.remainingSwaps += Math.max(word.word.length - 4, 0), $game);
    		} else {
    			set_store_value(gameState, $game.remainingSwaps++, $game);
    		}

    		set_store_value(gameState, $game.latestChain = chain, $game);
    		set_store_value(gameState, $game.bestChain = Math.max($game.bestChain, $game.latestChain), $game);
    		set_store_value(gameState, $game.latestWord = word.word, $game);
    		set_store_value(gameState, $game.latestScore = word.score, $game);
    		set_store_value(gameState, $game.score += word.score, $game);
    		set_store_value(gameState, $game.marquee = getMarqueeText(word, chain), $game);
    	};

    	const handleShuffle = async () => {
    		if (!$animating) {
    			set_store_value(gameState, $game.shuffles--, $game);
    			clearSelection();
    			const coords = Array.from({ length: DIMS.COLS }).flatMap((_, i) => Array.from({ length: DIMS.ROWS }).map((_, j) => [i, j]));
    			const shuffledCoords = shuffle([...coords]);
    			const tempBoard = $game.board.map(col => col.map(tile => tile));

    			coords.forEach((coord, i) => {
    				const newCoord = shuffledCoords[i];
    				const tmp = tempBoard[coord[0]][coord[1]];
    				tempBoard[coord[0]][coord[1]] = tempBoard[newCoord[0]][newCoord[1]];
    				tempBoard[newCoord[0]][newCoord[1]] = tmp;
    			});

    			set_store_value(gameState, $game.board = tempBoard, $game);

    			// pause for animation
    			await delay(1200);

    			await handleScore(0, true);
    		}
    	};

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	const func = () => handleReset(true);

    	$$self.$capture_state = () => ({
    		onMount,
    		fly,
    		Shuffle,
    		loadDictionary,
    		DIMS,
    		findWords,
    		getMarqueeText,
    		removeLetters,
    		resetGame,
    		WordChain,
    		Swaps,
    		Streak,
    		GameOver,
    		ActionButton,
    		Title,
    		shuffle,
    		animationDuration,
    		delay,
    		GameBoard: Board,
    		clearSelection,
    		animating,
    		game: gameState,
    		clearGame,
    		loadGame,
    		BottomControls,
    		WordContainer,
    		Stats,
    		turns,
    		resetTurns,
    		saveAnalytics,
    		Spinner,
    		dictionary,
    		loading,
    		showStats,
    		handleReset,
    		handleEndTurn,
    		handleScore,
    		highlightTiles,
    		score,
    		handleShuffle,
    		$game,
    		$animating,
    		$turns
    	});

    	$$self.$inject_state = $$props => {
    		if ('dictionary' in $$props) dictionary = $$props.dictionary;
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading, $game, handleReset, handleScore, handleShuffle, func];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.6 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let game;
    	let current;
    	game = new Game({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(game.$$.fragment);
    			attr_dev(main, "class", "svelte-16uyjiw");
    			add_location(main, file, 3, 0, 66);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(game, main, null);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(game);
    		}
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Game });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
