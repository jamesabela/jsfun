# Activity TSV format

The download contains one row per recorded event, in event order. `file_id` identifies each file loaded within the tab session. Timings are elapsed milliseconds, not calendar timestamps. Nothing is uploaded or persisted by the activity logger.

Code is stored as beginning/end text and intervening changes:

- `code_begin`: full starting code on the first row for each file.
- `code_end`: full final code on the last row for each file at the time of download.
- `change_start_utf16`: zero-based position in the previous code where a replacement begins.
- `change_delete_utf16`: number of UTF-16 code units to remove from that position.
- `change_insert`: text to insert at that position. An empty string represents deletion without insertion.

The text fields are JSON-encoded, so tabs, quotes and newlines stay within one TSV cell. A blank beginning/end cell means no snapshot on that row; `""` means an actual empty program. Rows without edits have blank change offsets. File initialization uses `code_begin` rather than an edit. Beginning and ending code may appear on the same row for a file with only one event.

To reconstruct states, read rows in order, initialize from `code_begin`, and apply changes using JavaScript UTF-16 offsets:

```js
code = code.slice(0, start) + JSON.parse(changeInsertCell)
     + code.slice(start + deleteCount);
```

After applying a row's change, its state corresponds to `revision_id`. On a row with `code_end`, the reconstructed text should match that ending code. Other languages must account for UTF-16 offsets (especially for emoji). `characters_added`, `characters_removed`, and `code_length` count Unicode code points, not UTF-16 units.

Run/save events with unchanged code remain separate events but do not repeat code text. Exporting again updates ending snapshots without retaining another full code copy in the activity history. The separate visual playback history still retains up to 1,000 full snapshots.
