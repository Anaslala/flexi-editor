<template>
    <div>
        <div ref="editorElement"></div>
        <p v-if="isReady">Editor is ready!</p>
    </div>
</template>

<script>
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

export default {
    name: 'FlexiEditorComponent',
    props: {
        initialContent: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            editor: null,
            isReady: false
        };
    },
    mounted() {
        this.editor = new FlexiEditor({
            element: this.$refs.editorElement,
            placeholder: 'Start typing...',
            content: this.initialContent
        });

        this.editor.on('change', () => {
            this.$emit('change', this.editor.getData());
        });

        this.editor.on('ready', () => {
            this.isReady = true;
        });
    },
    beforeUnmount() {
        if (this.editor) {
            this.editor.destroy();
        }
    }
};
</script>
