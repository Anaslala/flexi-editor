import { Icons } from '../ui/Icons';

export class DictationPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Dictation';
        this.recognition = null;
        this.isListening = false;
        this.previewClass = 'dictation-preview'; // Common class for all previews
    }

    init() {
        if (!this.editor.toolbar) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Voice Dictation is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US'; // Lock language for better accuracy

        this.recognition.onresult = (event) => {
            let final = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            // 1. NUCLEAR CLEANUP: Remove ALL existing previews to prevent stacking
            const existingPreviews = this.editor.contentArea.querySelectorAll('.' + this.previewClass);
            existingPreviews.forEach(el => el.remove());

            // Ensure editor has focus
            if (document.activeElement !== this.editor.contentArea) {
                this.editor.contentArea.focus();
            }

            // 2. Handle Final Text
            if (final) {
                // Smart Spacing: Add leading space if needed (basic heuristic)
                // This ensures "Hello" + "World" becomes "Hello World"
                const lastChar = this.editor.contentArea.innerText.slice(-1);
                const needsSpace = lastChar && !/\\s/.test(lastChar);

                const textToInsert = (needsSpace ? ' ' : '') + final.trim();

                // Use execCommand to preserve Undo history
                this.editor.execCommand('insertText', textToInsert + ' ');
            }

            // 3. Handle Interim (Preview)
            if (interim) {
                const span = document.createElement('span');
                span.className = this.previewClass;
                span.style.color = '#aaa';
                span.textContent = interim;

                const range = this.editor.selection.getRange();
                if (range) {
                    range.deleteContents();
                    range.insertNode(span);

                    // Move cursor visually AFTER the preview
                    range.setStartAfter(span);
                    range.setEndAfter(span);

                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please check settings.');
                this.stop();
            }
            // For other errors like 'no-speech', we just ignore/restart implicitly via onend
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                try {
                    this.recognition.start();
                } catch (e) {
                    // ignore if already started
                }
            } else {
                this.editor.toolbar.updateActiveStates();
            }
        };

        this.editor.toolbar.registerButton('dictation', {
            title: 'Voice Dictation',
            icon: Icons.mic,
            command: 'toggleDictation',
            onAction: (editor) => this.toggle(),
            checkActive: () => this.isListening
        });
    }

    toggle() {
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.recognition) return;
        this.editor.selection.saveSelection();

        try {
            this.isListening = true;
            this.recognition.start();
            if (this.editor.toolbar.updateActiveStates) {
                this.editor.toolbar.updateActiveStates();
            }
        } catch (e) {
            if (e.name === 'InvalidStateError') {
                this.isListening = true;
                if (this.editor.toolbar.updateActiveStates) {
                    this.editor.toolbar.updateActiveStates();
                }
                return;
            }
            this.isListening = false;
            alert('Start failed: ' + e.message);
        }
    }

    stop() {
        this.isListening = false;

        // Final cleanup of any previews
        const existingPreviews = this.editor.contentArea.querySelectorAll('.' + this.previewClass);
        existingPreviews.forEach(el => el.remove());

        if (this.recognition) this.recognition.stop();
        if (this.editor.toolbar.updateActiveStates) {
            this.editor.toolbar.updateActiveStates();
        }
    }
}
