import { HTML } from "imperative-html/dist/esm/elements-strict";
const { button, div, h2, input, label, br } = HTML;
export class InstrumentExportPrompt {
    constructor(_doc) {
        this._doc = _doc;
        this._cancelButton = button({ class: "cancelButton" });
        this._exportButton = button({ class: "exportButton", style: "width:45%;" }, "Export");
        this._exportMultipleBox = input({ style: "width: 3em; margin-left: 1em;", type: "checkbox" });
        this._channelName = this._doc.song.channels[this._doc.channel].name == "" ? "Beepbox-Instrument" : this._doc.song.channels[this._doc.channel].name;
        this._fileName = input({ type: "text", style: "width: 10em;", value: this._channelName, maxlength: 250, "autofocus": "autofocus" });
        this.container = div({ class: "prompt noSelection", style: "width: 200px;" }, div({ class: "promptTitle" }, h2({ class: "export-instrumentExt", style: "text-align: inherit;" }, ""), h2({ class: "export-instrumentTitle" }, "Export Instruments Options")), div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: space-between;" }, "File name:", this._fileName), label({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" }, "Export all instruments", br(), "in channel:", this._exportMultipleBox), div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._exportButton), this._cancelButton);
        this._close = () => {
            this._doc.undo();
        };
        this.cleanUp = () => {
            this._cancelButton.removeEventListener("click", this._close);
            this._exportButton.removeEventListener("click", this._decide_export);
            this._fileName.removeEventListener("input", InstrumentExportPrompt._validateFileName);
        };
        this._decide_export = () => {
            this._exportMultipleBox.checked ? this._export_multiple() : this._export_single();
        };
        this._export_multiple = () => {
            const channel = this._doc.song.channels[this._doc.channel];
            const instruments = channel.instruments.map((instrument) => {
                const instrumentCopy = instrument.toJsonObject();
                instrumentCopy["isDrum"] = this._doc.song.getChannelIsNoise(this._doc.channel);
                return instrumentCopy;
            });
            const jsonBlob = new Blob([JSON.stringify(instruments)], { type: 'application/json' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(jsonBlob);
            downloadLink.download = this._fileName.value + '.json';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            this._close();
        };
        this._export_single = () => {
            const channel = this._doc.song.channels[this._doc.channel];
            const instrument = channel.instruments[this._doc.getCurrentInstrument()];
            const instrumentCopy = instrument.toJsonObject();
            instrumentCopy["isDrum"] = this._doc.song.getChannelIsNoise(this._doc.channel);
            const jsonBlob = new Blob([JSON.stringify(instrumentCopy)], { type: 'application/json' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(jsonBlob);
            downloadLink.download = this._fileName.value + '.json';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            this._close();
        };
        this._cancelButton.addEventListener("click", this._close);
        this._exportButton.addEventListener("click", this._decide_export);
        this._fileName.addEventListener("input", InstrumentExportPrompt._validateFileName);
    }
    static _validateFileName(event, use) {
        let input;
        if (event != null) {
            input = event.target;
        }
        else if (use != undefined) {
            input = use;
        }
        else {
            return;
        }
        const deleteChars = /[\+\*\$\?\|\{\}\\\/<>#%!`&'"=:@]/gi;
        if (deleteChars.test(input.value)) {
            let cursorPos = input.selectionStart;
            input.value = input.value.replace(deleteChars, "");
            cursorPos--;
            input.setSelectionRange(cursorPos, cursorPos);
        }
    }
}
//# sourceMappingURL=InstrumentExportPrompt.js.map