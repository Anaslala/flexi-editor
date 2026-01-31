export class CommandManager {
    constructor(editor) {
        this.editor = editor;
        this.undoStack = [];
        this.redoStack = [];
        this.maxStackSize = 100;
    }

    /**
     * Executes a command and pushes it to the undo stack.
     * @param {Object} command - { execute: () => void, undo: () => void }
     */
    execute(command) {
        if (!command || typeof command.execute !== 'function') {
            console.error('Invalid command structure');
            return;
        }

        command.execute();

        this.undoStack.push(command);

        // Clear redo stack on new action
        this.redoStack = [];

        // Limit stack size
        if (this.undoStack.length > this.maxStackSize) {
            this.undoStack.shift();
        }

        // Trigger update
        this.editor.trigger('change');
        this.editor.trigger('selection-change');
    }

    undo() {
        if (this.undoStack.length === 0) return;

        const command = this.undoStack.pop();
        if (command && typeof command.undo === 'function') {
            command.undo();
            this.redoStack.push(command);

            // Trigger update
            this.editor.trigger('change');
            this.editor.trigger('selection-change');
        }
    }

    redo() {
        if (this.redoStack.length === 0) return;

        const command = this.redoStack.pop();
        if (command && typeof command.execute === 'function') {
            command.execute();
            this.undoStack.push(command);

            // Trigger update
            this.editor.trigger('change');
            this.editor.trigger('selection-change');
        }
    }
}
