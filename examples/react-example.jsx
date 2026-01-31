import { useEffect, useRef, useState } from 'react';
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

function FlexiEditorComponent({ initialContent = '', onChange }) {
    const editorRef = useRef(null);
    const instanceRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (editorRef.current && !instanceRef.current) {
            instanceRef.current = new FlexiEditor({
                element: editorRef.current,
                placeholder: 'Start typing...',
                content: initialContent
            });

            // Listen to changes
            instanceRef.current.on('change', () => {
                if (onChange) {
                    onChange(instanceRef.current.getData());
                }
            });

            instanceRef.current.on('ready', () => {
                setIsReady(true);
            });
        }

        return () => {
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
        };
    }, []);

    return (
        <div>
            <div ref={editorRef} />
            {isReady && <p>Editor is ready!</p>}
        </div>
    );
}

export default FlexiEditorComponent;
