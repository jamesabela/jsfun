/* Session-only activity data: no storage, network requests, or personal identifiers. */
class PythonCopyActivityLog {
  constructor(now = () => performance.now()) {
    this.now = now;
    this.started = now();
    this.events = [];
    this.code = '';
    this.revision = 0;
    this.file = 0;
    this.lastKey = null;
    this.fileEnds = new Map();
    this.frustration = '';
    this.feeling = '';
    this.challengeFeeling = '';
  }

  setFeeling(feeling) {
    this.feeling = feeling ? String(feeling).trim() : '';
  }

  setFrustration(frustration) {
    this.frustration = frustration ? String(frustration).trim() : '';
  }

  setChallengeFeeling(challengeFeeling) {
    this.challengeFeeling = challengeFeeling ? String(challengeFeeling).trim() : '';
  }

  record(type, code = this.code, { newFile = false, visible = true, feeling, frustration, challengeFeeling } = {}) {
    newFile = newFile || this.file === 0;
    const elapsed = Math.max(0, Math.round(this.now() - this.started));
    if (newFile) {
      this.file++;
      this.lastKey = null;
    }
    const previous = newFile ? '' : this.code;
    let start = 0;
    while (start < previous.length && start < code.length && previous[start] === code[start]) start++;
    let oldEnd = previous.length;
    let newEnd = code.length;
    while (oldEnd > start && newEnd > start && previous[oldEnd - 1] === code[newEnd - 1]) {
      oldEnd--;
      newEnd--;
    }
    if (newFile || code !== this.code) this.revision++;
    if (feeling !== undefined) this.feeling = feeling ? String(feeling).trim() : '';
    if (frustration !== undefined) this.frustration = frustration ? String(frustration).trim() : '';
    if (challengeFeeling !== undefined) this.challengeFeeling = challengeFeeling ? String(challengeFeeling).trim() : '';

    const event = {
      event_number: this.events.length + 1,
      file_id: this.file,
      revision_id: this.revision,
      event_type: type,
      elapsed_ms: elapsed,
      since_previous_event_ms: this.events.length ? elapsed - this.events[this.events.length - 1].elapsed_ms : '',
      // For a key event this is the gap BEFORE that key, not a constant zero.
      since_last_editor_key_ms: this.lastKey === null ? '' : elapsed - this.lastKey,
      characters_added: newFile ? 0 : Array.from(code.slice(start, newEnd)).length,
      characters_removed: newFile ? 0 : Array.from(previous.slice(start, oldEnd)).length,
      code_length: Array.from(code).length,
      page_visible: visible,
      // Offsets use JavaScript UTF-16 units so slice() reconstructs code exactly.
      change_start_utf16: !newFile && code !== previous ? start : '',
      change_delete_utf16: !newFile && code !== previous ? oldEnd - start : '',
      change_insert: newFile ? '' : code.slice(start, newEnd),
      code_begin: newFile ? code : null,
      frustration: this.frustration,
      feeling: this.feeling,
      challenge_feeling: this.challengeFeeling
    };
    this.code = code;
    if (type === 'editor_key') this.lastKey = elapsed;
    this.events.push(event);
    this.fileEnds.set(this.file, { event_number: event.event_number, code });
    return event;
  }

  toTSV() {
    const columns = ['event_number', 'file_id', 'revision_id', 'event_type', 'elapsed_ms',
      'since_previous_event_ms', 'since_last_editor_key_ms', 'characters_added',
      'characters_removed', 'code_length', 'page_visible', 'change_start_utf16',
      'change_delete_utf16', 'change_insert', 'code_begin', 'code_end',
      'frustration', 'feeling', 'challenge_feeling'];
    // JSON encoding keeps arbitrary code on one physical TSV row and prevents
    // code beginning with spreadsheet formula characters from being evaluated.
    return columns.join('\t') + '\n' + this.events.map(event => {
      const end = this.fileEnds.get(event.file_id);
      return columns.map(column => {
        if (column === 'code_end') return end.event_number === event.event_number ? JSON.stringify(end.code) : '';
        if (column === 'code_begin') return event.code_begin === null ? '' : JSON.stringify(event.code_begin);
        if (column === 'change_insert') return JSON.stringify(event.change_insert);
        if (['frustration', 'feeling', 'challenge_feeling'].includes(column)) {
          const val = event[column] == null ? '' : String(event[column]);
          return val.replace(/[\t\r\n]+/g, ' ').trim();
        }
        return String(event[column] ?? '');
      }).join('\t');
    }).join('\n') + '\n';
  }
}
