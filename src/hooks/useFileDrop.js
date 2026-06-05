import { useCallback, useState } from 'react';

/**
 * Reusable drag-and-drop file hook for upload dropzones.
 *
 * Usage:
 *   const { isDragOver, dropProps } = useFileDrop(files => setFile(files[0]), {
 *     accept: ['audio/', 'video/'],
 *     multiple: false,
 *   });
 *   <Box {...dropProps} onClick={openPicker}>…</Box>
 *
 * Returns `dropProps` (onDragOver/onDragLeave/onDrop) and `isDragOver`
 * so callers can style the active state.
 */
export default function useFileDrop(onFiles, { accept = [], multiple = true, disabled = false } = {}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const matches = useCallback((file) => {
    if (!accept || accept.length === 0) return true;
    const name = (file.name || '').toLowerCase();
    const type = (file.type || '').toLowerCase();
    return accept.some((a) => {
      const rule = a.toLowerCase();
      if (rule.startsWith('.')) return name.endsWith(rule);
      if (rule.endsWith('/')) return type.startsWith(rule);          // e.g. "audio/"
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1)); // e.g. "audio/*"
      return type === rule;
    });
  }, [accept]);

  const onDragOver = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, [disabled]);

  const onDragLeave = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, [disabled]);

  const onDrop = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const dropped = Array.from(e.dataTransfer?.files || []);
    if (!dropped.length) return;
    const valid = dropped.filter(matches);
    if (!valid.length) return;
    onFiles(multiple ? valid : [valid[0]]);
  }, [disabled, matches, multiple, onFiles]);

  return {
    isDragOver,
    dropProps: { onDragOver, onDragLeave, onDrop },
  };
}
