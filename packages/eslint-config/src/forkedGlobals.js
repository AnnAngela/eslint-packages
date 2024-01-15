/**
 * @fileoverview Forked from https://github.com/sindresorhus/globals/blob/v13.24.0/globals.json
 */

const globals = {
    jquery: {
        $: false,
        jQuery: false,
    },
    greasemonkey: {
        cloneInto: false,
        createObjectIn: false,
        exportFunction: false,
        GM: false,
        /* eslint-disable camelcase */
        GM_addElement: false,
        GM_addStyle: false,
        GM_addValueChangeListener: false,
        GM_deleteValue: false,
        GM_download: false,
        GM_getResourceText: false,
        GM_getResourceURL: false,
        GM_getTab: false,
        GM_getTabs: false,
        GM_getValue: false,
        GM_info: false,
        GM_listValues: false,
        GM_log: false,
        GM_notification: false,
        GM_openInTab: false,
        GM_registerMenuCommand: false,
        GM_removeValueChangeListener: false,
        GM_saveTab: false,
        GM_setClipboard: false,
        GM_setValue: false,
        GM_unregisterMenuCommand: false,
        GM_xmlhttpRequest: false,
        /* eslint-enable camelcase */
        unsafeWindow: false,
    },
    mocha: {
        after: false,
        afterEach: false,
        before: false,
        beforeEach: false,
        context: false,
        describe: false,
        it: false,
        mocha: false,
        run: false,
        setup: false,
        specify: false,
        suite: false,
        suiteSetup: false,
        suiteTeardown: false,
        teardown: false,
        test: false,
        xcontext: false,
        xdescribe: false,
        xit: false,
        xspecify: false,
    },
};
export default globals;
