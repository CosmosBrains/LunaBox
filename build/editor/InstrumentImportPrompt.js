import { HTML } from "imperative-html/dist/esm/elements-strict";
import { ChangePasteInstrument, ChangeAppendInstrument, ChangeViewInstrument } from "./changes";
const { button, div, h2, input, select, option, code } = HTML;
export class InstrumentImportPrompt {
    constructor(_doc) {
        this._doc = _doc;
        this._cancelButton = button({ class: "cancelButton" });
        this._importStrategySelect = select({ style: "width: 100%;" }, option({ value: "append" }, "Append instruments to the end of the list."), option({ value: "replace" }, "Replace only the selected instrument."), option({ value: "all" }, "Replace all instruments in the channel."));
        this._fileInput = input({ type: "file", accept: ".json,application/json" });
        this.importStratSelectDiv = div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" }, div({ class: "selectContainer", style: "width: 100%;" }, this._importStrategySelect));
        this.warningText = div({}, div({ style: "text-align: left;" }, "You must enable either ", code("Simultaneous instruments per channel"), " or ", code("Different instruments per pattern"), " to change the import strategy."));
        this.container = div({ class: "prompt noSelection", style: "width: 300px;" }, div({ class: "promptTitle" }, h2({ class: "import-instrumentExt", style: "text-align: inherit;" }, ""), h2({ class: "import-instrumentTitle" }, "Import Instrument(s)")), this.warningText, this.importStratSelectDiv, this._fileInput, this._cancelButton);
        this._whenFileSelected = () => {
            const file = this._fileInput.files[0];
            if (!file)
                return;
            const reader = new FileReader();
            reader.onload = (e) => {
                var _a;
                try {
                    const fileParsed = JSON.parse(String((_a = e.target) === null || _a === void 0 ? void 0 : _a.result));
                    console.log("Processing file:", fileParsed);
                    if (fileParsed.constructor.name == "Array") {
                        if ((this._doc.song.patternInstruments || this._doc.song.layeredInstruments) == false) {
                            alert("Instrument file contains multiple instruments! Please turn on either Simultaneous instruments per channel or Different instruments per pattern!");
                            return;
                        }
                        this._import_multiple(fileParsed);
                        return;
                    }
                    else {
                        this._import_single(fileParsed);
                    }
                }
                catch (error) {
                    console.error('Error reading file:', error);
                }
            };
            reader.readAsText(file);
        };
        this._close = () => {
            this._doc.undo();
        };
        this.cleanUp = () => {
            this._fileInput.removeEventListener("change", this._whenFileSelected);
            this._cancelButton.removeEventListener("click", this._close);
        };
        this._import_multiple = (file) => {
            const channel = this._doc.song.channels[this._doc.channel];
            const currentInstrum = channel.instruments[this._doc.getCurrentInstrument()];
            switch (this._importStrategySelect.value) {
                case "replace":
                    window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
                    const firstInstrum = file[0];
                    this._doc.record(new ChangePasteInstrument(this._doc, currentInstrum, firstInstrum));
                    for (let i = 1; i < file.length; i++) {
                        const insturm = file[i];
                        if (!this._validate_instrument_limit(channel)) {
                            alert("Max instruments reached! Some instruments were not imported.");
                            break;
                        }
                        this._doc.record(new ChangeAppendInstrument(this._doc, channel, insturm));
                    }
                    this._doc.record(new ChangeViewInstrument(this._doc, this._doc.getCurrentInstrument()));
                    this._doc.prompt = null;
                    this._doc.notifier.changed();
                    return;
                case "all":
                    window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
                    channel.instruments.length = 0;
                    for (let insturm of file) {
                        if (!this._validate_instrument_limit(channel)) {
                            alert("Max instruments reached! Some instruments were not imported.");
                            break;
                        }
                        this._doc.record(new ChangeAppendInstrument(this._doc, channel, insturm));
                    }
                    this._doc.record(new ChangeViewInstrument(this._doc, channel.instruments.length - 1));
                    this._doc.prompt = null;
                    this._doc.notifier.changed();
                    return;
                default:
                    window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
                    for (let insturm of file) {
                        if (!this._validate_instrument_limit(channel)) {
                            alert("Max instruments reached! Some instruments were not imported.");
                            break;
                        }
                        this._doc.record(new ChangeAppendInstrument(this._doc, channel, insturm));
                    }
                    this._doc.record(new ChangeViewInstrument(this._doc, channel.instruments.length - 1));
                    this._doc.prompt = null;
                    this._doc.notifier.changed();
                    return;
            }
        };
        this._validate_instrument_limit = (channel) => {
            if (this._doc.song.getMaxInstrumentsPerChannel() <= channel.instruments.length) {
                return false;
            }
            return true;
        };
        this._import_single = (file) => {
            const channel = this._doc.song.channels[this._doc.channel];
            const currentInstrum = channel.instruments[this._doc.getCurrentInstrument()];
            switch (this._importStrategySelect.value) {
                case "replace":
                    window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
                    this._doc.record(new ChangePasteInstrument(this._doc, currentInstrum, file));
                    this._doc.record(new ChangeViewInstrument(this._doc, this._doc.getCurrentInstrument()));
                    this._doc.prompt = null;
                    this._doc.notifier.changed();
                    return;
                case "all":
                    window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
                    channel.instruments.length = 1;
                    const firstInstrum = channel.instruments[0];
                    this._doc.record(new ChangePasteInstrument(this._doc, firstInstrum, file));
                    this._doc.record(new ChangeViewInstrument(this._doc, 0));
                    this._doc.prompt = null;
                    this._doc.notifier.changed();
                    return;
                default:
                    if (!this._validate_instrument_limit(channel)) {
                        alert("Max instruments reached! The instrument was not imported.");
                        this._doc.prompt = null;
                        return;
                    }
                    window.localStorage.setItem("instrumentImportStrategy", this._importStrategySelect.value);
                    this._doc.record(new ChangeAppendInstrument(this._doc, channel, file));
                    this._doc.record(new ChangeViewInstrument(this._doc, channel.instruments.length - 1));
                    this._doc.prompt = null;
                    this._doc.notifier.changed();
                    return;
            }
        };
        if ((_doc.song.patternInstruments || _doc.song.layeredInstruments) == false) {
            this._importStrategySelect.disabled = true;
            this._importStrategySelect.value = "replace";
            this.importStratSelectDiv.style.display = "none";
            this.warningText.style.display = "";
        }
        else {
            const lastStrategy = window.localStorage.getItem("instrumentImportStrategy");
            if (lastStrategy != null)
                this._importStrategySelect.value = lastStrategy;
            this.importStratSelectDiv.style.display = "";
            this.warningText.style.display = "none";
        }
        this._fileInput.addEventListener("change", this._whenFileSelected);
        this._cancelButton.addEventListener("click", this._close);
    }
}
//# sourceMappingURL=InstrumentImportPrompt.js.map