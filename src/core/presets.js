/**
 * ADDITIVE FEATURE: Editor Presets
 * Predefined plugin configurations for different use cases
 * This is OPTIONAL - users can still use the original way
 */

import { ParagraphPlugin } from '../plugins/ParagraphPlugin';
import { BoldPlugin } from '../plugins/BoldPlugin';
import { ItalicPlugin } from '../plugins/ItalicPlugin';
import { UnderlinePlugin } from '../plugins/UnderlinePlugin';
import { ListPlugin } from '../plugins/ListPlugin';
import { HeadingPlugin } from '../plugins/HeadingPlugin';
import { ColorPlugin } from '../plugins/ColorPlugin';
import { ImagePlugin } from '../plugins/ImagePlugin';
import { AlignmentPlugin } from '../plugins/AlignmentPlugin';
import { LinkPlugin } from '../plugins/LinkPlugin';
import { TablePlugin } from '../plugins/TablePlugin';
import { ScriptPlugin } from '../plugins/ScriptPlugin';
import { ClearFormatPlugin } from '../plugins/ClearFormatPlugin';
import { HistoryPlugin } from '../plugins/HistoryPlugin';
import { BlockUtilsPlugin } from '../plugins/BlockUtilsPlugin';
import { CodePlugin } from '../plugins/CodePlugin';
import { StrikethroughPlugin } from '../plugins/StrikethroughPlugin';
import { VideoPlugin } from '../plugins/VideoPlugin';
import { SourceViewPlugin } from '../plugins/SourceViewPlugin';
import { FullscreenPlugin } from '../plugins/FullscreenPlugin';
import { PrintPlugin } from '../plugins/PrintPlugin';
import { SelectAllPlugin } from '../plugins/SelectAllPlugin';
import { DateTimePlugin } from '../plugins/DateTimePlugin';
import { FindReplacePlugin } from '../plugins/FindReplacePlugin';
import { WordCountPlugin } from '../plugins/WordCountPlugin';
import { EmojiPlugin } from '../plugins/EmojiPlugin';
import { SpecialCharPlugin } from '../plugins/SpecialCharPlugin';
import { FontPlugin } from '../plugins/FontPlugin';
import { DictationPlugin } from '../plugins/DictationPlugin';
import { TemplatePlugin } from '../plugins/TemplatePlugin';
import { LineHeightPlugin } from '../plugins/LineHeightPlugin';
import { TextTransformPlugin } from '../plugins/TextTransformPlugin';
import { LetterSpacingPlugin } from '../plugins/LetterSpacingPlugin';
import { DirectionPlugin } from '../plugins/DirectionPlugin';
import { TextShadowPlugin } from '../plugins/TextShadowPlugin';

/**
 * Basic preset - Essential formatting only
 */
export const PRESET_BASIC = [
    { name: 'Paragraph', class: ParagraphPlugin },
    { name: 'Bold', class: BoldPlugin },
    { name: 'Italic', class: ItalicPlugin },
    { name: 'Underline', class: UnderlinePlugin },
    { name: 'List', class: ListPlugin },
    { name: 'Link', class: LinkPlugin },
    { name: 'History', class: HistoryPlugin }
];

/**
 * Standard preset - Common features
 */
export const PRESET_STANDARD = [
    { name: 'Paragraph', class: ParagraphPlugin },
    { name: 'Bold', class: BoldPlugin },
    { name: 'Italic', class: ItalicPlugin },
    { name: 'Underline', class: UnderlinePlugin },
    { name: 'Strikethrough', class: StrikethroughPlugin },
    { name: 'List', class: ListPlugin },
    { name: 'Heading', class: HeadingPlugin },
    { name: 'Alignment', class: AlignmentPlugin },
    { name: 'Link', class: LinkPlugin },
    { name: 'Image', class: ImagePlugin },
    { name: 'Color', class: ColorPlugin },
    { name: 'ClearFormat', class: ClearFormatPlugin },
    { name: 'History', class: HistoryPlugin },
    { name: 'BlockUtils', class: BlockUtilsPlugin },
    { name: 'Code', class: CodePlugin }
];

/**
 * Full preset - All features enabled
 */
export const PRESET_FULL = [
    { name: 'Paragraph', class: ParagraphPlugin },
    { name: 'Bold', class: BoldPlugin },
    { name: 'Italic', class: ItalicPlugin },
    { name: 'Underline', class: UnderlinePlugin },
    { name: 'Strikethrough', class: StrikethroughPlugin },
    { name: 'List', class: ListPlugin },
    { name: 'Heading', class: HeadingPlugin },
    { name: 'Color', class: ColorPlugin },
    { name: 'Font', class: FontPlugin },
    { name: 'ClearFormat', class: ClearFormatPlugin },
    { name: 'Alignment', class: AlignmentPlugin },
    { name: 'Link', class: LinkPlugin },
    { name: 'Image', class: ImagePlugin },
    { name: 'Video', class: VideoPlugin },
    { name: 'Table', class: TablePlugin },
    { name: 'BlockUtils', class: BlockUtilsPlugin },
    { name: 'Code', class: CodePlugin },
    { name: 'Script', class: ScriptPlugin },
    { name: 'History', class: HistoryPlugin },
    { name: 'SourceView', class: SourceViewPlugin },
    { name: 'Fullscreen', class: FullscreenPlugin },
    { name: 'Print', class: PrintPlugin },
    { name: 'SelectAll', class: SelectAllPlugin },
    { name: 'DateTime', class: DateTimePlugin },
    { name: 'FindReplace', class: FindReplacePlugin },
    { name: 'WordCount', class: WordCountPlugin },
    { name: 'Emoji', class: EmojiPlugin },
    { name: 'SpecialChar', class: SpecialCharPlugin },
    { name: 'Dictation', class: DictationPlugin },
    { name: 'Template', class: TemplatePlugin },
    { name: 'LineHeight', class: LineHeightPlugin },
    { name: 'TextTransform', class: TextTransformPlugin },
    { name: 'LetterSpacing', class: LetterSpacingPlugin },
    { name: 'Direction', class: DirectionPlugin },
    { name: 'TextShadow', class: TextShadowPlugin }
];

/**
 * Get preset by name
 */
export function getPreset(presetName) {
    const presets = {
        'basic': PRESET_BASIC,
        'standard': PRESET_STANDARD,
        'full': PRESET_FULL
    };

    return presets[presetName] || null;
}
