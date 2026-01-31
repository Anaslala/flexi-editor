export class PluginManager {
    constructor(editor) {
        this.editor = editor;
        this.plugins = new Map();
    }

    /**
     * Registers a plugin Class or Object.
     * @param {Function|Object} Plugin - The plugin class or definition.
     * @param {Object} options - Plugin options.
     */
    register(Plugin, options = {}) {
        let instance;
        let name;

        try {
            if (typeof Plugin === 'function') {
                instance = new Plugin(this.editor, options);
                name = instance.name || Plugin.name;
            } else {
                instance = Plugin;
                name = instance.name;
                instance.editor = this.editor;
            }

            if (!name) {
                console.warn('Plugin registered without a name.');
                return;
            }

            // Check for duplicate
            if (this.plugins.has(name)) {
                console.warn(`Plugin "${name}" is already registered. Skipping.`);
                return;
            }

            this.plugins.set(name, instance);
        } catch (error) {
            console.error('Failed to register plugin:', error);
        }
    }

    /**
     * Initializes all registered plugins.
     */
    initAll() {
        for (const [name, plugin] of this.plugins) {
            if (typeof plugin.init === 'function') {
                try {
                    plugin.init();
                } catch (error) {
                    console.error(`Failed to initialize plugin "${name}":`, error);
                }
            }
        }
    }

    /**
     * Destroys all plugins.
     */
    destroyAll() {
        for (const [name, plugin] of this.plugins) {
            if (typeof plugin.destroy === 'function') {
                try {
                    plugin.destroy();
                } catch (error) {
                    console.error(`Failed to destroy plugin "${name}":`, error);
                }
            }
        }
        this.plugins.clear();
    }

    get(name) {
        return this.plugins.get(name);
    }
}
