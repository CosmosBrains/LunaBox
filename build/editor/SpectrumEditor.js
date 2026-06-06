import { Config } from "../synth/SynthConfig";
import { SpectrumWave } from "../synth/synth";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";
import { ChangeSpectrum } from "./changes";
import { prettyNumber } from "./EditorConfig";
import { ChangeGroup } from "./Change";
export class SpectrumEditor {
    constructor(_doc, _spectrumIndex, _isPrompt = false) {
        this._doc = _doc;
        this._spectrumIndex = _spectrumIndex;
        this._isPrompt = _isPrompt;
        this._editorWidth = 120;
        this._editorHeight = 26;
        this._fill = SVG.path({ fill: ColorConfig.uiWidgetBackground, "pointer-events": "none" });
        this._octaves = SVG.svg({ "pointer-events": "none" });
        this._fifths = SVG.svg({ "pointer-events": "none" });
        this._curve = SVG.path({ fill: "none", stroke: "currentColor", "stroke-width": 2, "pointer-events": "none" });
        this._arrow = SVG.path({ fill: "currentColor", "pointer-events": "none" });
        this._svg = SVG.svg({ style: `background-color: ${ColorConfig.editorBackground}; touch-action: none; cursor: crosshair;`, width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" }, this._fill, this._octaves, this._fifths, this._curve, this._arrow);
        this.container = HTML.div({ class: "spectrum", style: "height: 100%;" }, this._svg);
        this._mouseX = 0;
        this._mouseY = 0;
        this._freqPrev = 0;
        this._ampPrev = 0;
        this._mouseDown = false;
        this._change = null;
        this._renderedPath = "";
        this._renderedFifths = true;
        this.instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        this._initial = new SpectrumWave(this._spectrumIndex != null);
        this._undoHistoryState = 0;
        this._changeQueue = [];
        this.storeChange = () => {
            var sameCheck = true;
            if (this._changeQueue.length > 0) {
                for (var i = 0; i < Config.spectrumControlPoints; i++) {
                    if (this._changeQueue[this._undoHistoryState][i] != this.instrument.spectrumWave.spectrum[i]) {
                        sameCheck = false;
                        i = Config.spectrumControlPoints;
                    }
                }
            }
            if (sameCheck == false || this._changeQueue.length == 0) {
                this._changeQueue.splice(0, this._undoHistoryState);
                this._undoHistoryState = 0;
                this._changeQueue.unshift(this.instrument.spectrumWave.spectrum.slice());
                if (this._changeQueue.length > 32) {
                    this._changeQueue.pop();
                }
            }
        };
        this.undo = () => {
            if (this._undoHistoryState < this._changeQueue.length - 1) {
                this._undoHistoryState++;
                const spectrum = this._changeQueue[this._undoHistoryState].slice();
                this.setSpectrumWave(spectrum);
            }
        };
        this.redo = () => {
            if (this._undoHistoryState > 0) {
                this._undoHistoryState--;
                const spectrum = this._changeQueue[this._undoHistoryState].slice();
                this.setSpectrumWave(spectrum);
            }
        };
        this._whenMousePressed = (event) => {
            event.preventDefault();
            this._mouseDown = true;
            const boundingRect = this._svg.getBoundingClientRect();
            this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
            this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
            if (isNaN(this._mouseX))
                this._mouseX = 0;
            if (isNaN(this._mouseY))
                this._mouseY = 0;
            this._freqPrev = this._xToFreq(this._mouseX);
            this._ampPrev = this._yToAmp(this._mouseY);
            this._whenCursorMoved();
        };
        this._whenTouchPressed = (event) => {
            event.preventDefault();
            this._mouseDown = true;
            const boundingRect = this._svg.getBoundingClientRect();
            this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
            this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
            if (isNaN(this._mouseX))
                this._mouseX = 0;
            if (isNaN(this._mouseY))
                this._mouseY = 0;
            this._freqPrev = this._xToFreq(this._mouseX);
            this._ampPrev = this._yToAmp(this._mouseY);
            this._whenCursorMoved();
        };
        this._whenMouseMoved = (event) => {
            if (this.container.offsetParent == null)
                return;
            const boundingRect = this._svg.getBoundingClientRect();
            this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
            this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
            if (isNaN(this._mouseX))
                this._mouseX = 0;
            if (isNaN(this._mouseY))
                this._mouseY = 0;
            this._whenCursorMoved();
        };
        this._whenTouchMoved = (event) => {
            if (this.container.offsetParent == null)
                return;
            if (!this._mouseDown)
                return;
            event.preventDefault();
            const boundingRect = this._svg.getBoundingClientRect();
            this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
            this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
            if (isNaN(this._mouseX))
                this._mouseX = 0;
            if (isNaN(this._mouseY))
                this._mouseY = 0;
            this._whenCursorMoved();
        };
        this._whenCursorReleased = (event) => {
            if (this._mouseDown) {
                if (!this._isPrompt) {
                    this._doc.record(this._change);
                }
                this.storeChange();
                this._change = null;
            }
            this._mouseDown = false;
        };
        this._initial.spectrum = this._spectrumIndex == null ? this.instrument.spectrumWave.spectrum.slice() : this.instrument.drumsetSpectrumWaves[this._spectrumIndex].spectrum.slice();
        for (let i = 0; i < Config.spectrumControlPoints; i += Config.spectrumControlPointsPerOctave) {
            this._octaves.appendChild(SVG.rect({ fill: ColorConfig.tonic, x: (i + 1) * this._editorWidth / (Config.spectrumControlPoints + 2) - 1, y: 0, width: 2, height: this._editorHeight }));
        }
        for (let i = 4; i <= Config.spectrumControlPoints; i += Config.spectrumControlPointsPerOctave) {
            this._fifths.appendChild(SVG.rect({ fill: ColorConfig.fifthNote, x: (i + 1) * this._editorWidth / (Config.spectrumControlPoints + 2) - 1, y: 0, width: 2, height: this._editorHeight }));
        }
        this.storeChange();
        this.container.addEventListener("mousedown", this._whenMousePressed);
        document.addEventListener("mousemove", this._whenMouseMoved);
        document.addEventListener("mouseup", this._whenCursorReleased);
        this.container.addEventListener("touchstart", this._whenTouchPressed);
        this.container.addEventListener("touchmove", this._whenTouchMoved);
        this.container.addEventListener("touchend", this._whenCursorReleased);
        this.container.addEventListener("touchcancel", this._whenCursorReleased);
    }
    _xToFreq(x) {
        return (Config.spectrumControlPoints + 2) * x / this._editorWidth - 1;
    }
    _yToAmp(y) {
        return Config.spectrumMax * (1 - (y - 1) / (this._editorHeight - 2));
    }
    _whenCursorMoved() {
        if (this._mouseDown) {
            const freq = this._xToFreq(this._mouseX);
            const amp = this._yToAmp(this._mouseY);
            const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
            const spectrumWave = (this._spectrumIndex == null) ? instrument.spectrumWave : instrument.drumsetSpectrumWaves[this._spectrumIndex];
            if (freq != this._freqPrev) {
                const slope = (amp - this._ampPrev) / (freq - this._freqPrev);
                const offset = this._ampPrev - this._freqPrev * slope;
                const lowerFreq = Math.ceil(Math.min(this._freqPrev, freq));
                const upperFreq = Math.floor(Math.max(this._freqPrev, freq));
                for (let i = lowerFreq; i <= upperFreq; i++) {
                    if (i < 0 || i >= Config.spectrumControlPoints)
                        continue;
                    spectrumWave.spectrum[i] = Math.max(0, Math.min(Config.spectrumMax, Math.round(i * slope + offset)));
                }
            }
            spectrumWave.spectrum[Math.max(0, Math.min(Config.spectrumControlPoints - 1, Math.round(freq)))] = Math.max(0, Math.min(Config.spectrumMax, Math.round(amp)));
            this._freqPrev = freq;
            this._ampPrev = amp;
            this._change = new ChangeSpectrum(this._doc, instrument, spectrumWave);
            this._doc.setProspectiveChange(this._change);
        }
    }
    getSpectrumWave() {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        if (this._spectrumIndex == null) {
            return instrument.spectrumWave;
        }
        else {
            return instrument.drumsetSpectrumWaves[this._spectrumIndex];
        }
    }
    setSpectrumWave(spectrum, saveHistory = false) {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        if (this._spectrumIndex == null) {
            for (let i = 0; i < Config.spectrumControlPoints; i++) {
                instrument.spectrumWave.spectrum[i] = spectrum[i];
            }
            const spectrumChange = new ChangeSpectrum(this._doc, instrument, instrument.spectrumWave);
            if (saveHistory) {
                this._doc.record(spectrumChange);
            }
        }
        else {
            for (let i = 0; i < Config.spectrumControlPoints; i++) {
                instrument.drumsetSpectrumWaves[this._spectrumIndex].spectrum[i] = spectrum[i];
            }
            const spectrumChange = new ChangeSpectrum(this._doc, instrument, instrument.drumsetSpectrumWaves[this._spectrumIndex]);
            if (saveHistory) {
                this._doc.record(spectrumChange);
            }
        }
        this.render();
    }
    saveSettings() {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        if (this._spectrumIndex == null || this._spectrumIndex == undefined) {
            return new ChangeSpectrum(this._doc, instrument, instrument.spectrumWave);
        }
        else {
            return new ChangeSpectrum(this._doc, instrument, instrument.drumsetSpectrumWaves[this._spectrumIndex]);
        }
    }
    resetToInitial() {
        this._changeQueue = [];
        this._undoHistoryState = 0;
    }
    render() {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        const spectrumWave = (this._spectrumIndex == null) ? instrument.spectrumWave : instrument.drumsetSpectrumWaves[this._spectrumIndex];
        const controlPointToHeight = (point) => {
            return (1 - (point / Config.spectrumMax)) * (this._editorHeight - 1) + 1;
        };
        let lastValue = 0;
        let path = "M 0 " + prettyNumber(this._editorHeight) + " ";
        for (let i = 0; i < Config.spectrumControlPoints; i++) {
            let nextValue = spectrumWave.spectrum[i];
            if (lastValue != 0 || nextValue != 0) {
                path += "L ";
            }
            else {
                path += "M ";
            }
            path += prettyNumber((i + 1) * this._editorWidth / (Config.spectrumControlPoints + 2)) + " " + prettyNumber(controlPointToHeight(nextValue)) + " ";
            lastValue = nextValue;
        }
        const lastHeight = controlPointToHeight(lastValue);
        if (lastValue > 0) {
            path += "L " + (this._editorWidth - 1) + " " + prettyNumber(lastHeight) + " ";
        }
        if (this._renderedPath != path) {
            this._renderedPath = path;
            this._curve.setAttribute("d", path);
            this._fill.setAttribute("d", path + "L " + this._editorWidth + " " + prettyNumber(lastHeight) + " L " + this._editorWidth + " " + prettyNumber(this._editorHeight) + " L 0 " + prettyNumber(this._editorHeight) + " z ");
            this._arrow.setAttribute("d", "M " + this._editorWidth + " " + prettyNumber(lastHeight) + " L " + (this._editorWidth - 4) + " " + prettyNumber(lastHeight - 4) + " L " + (this._editorWidth - 4) + " " + prettyNumber(lastHeight + 4) + " z");
            this._arrow.style.display = (lastValue > 0) ? "" : "none";
        }
        if (this._renderedFifths != this._doc.prefs.showFifth) {
            this._renderedFifths = this._doc.prefs.showFifth;
            this._fifths.style.display = this._doc.prefs.showFifth ? "" : "none";
        }
    }
}
export class SpectrumEditorPrompt {
    constructor(_doc, _songEditor, _isDrumset) {
        this._doc = _doc;
        this._songEditor = _songEditor;
        this._isDrumset = _isDrumset;
        this.spectrumEditor = new SpectrumEditor(this._doc, null, true);
        this.spectrumEditors = [];
        this._drumsetSpectrumIndex = 0;
        this._playButton = HTML.button({ style: "width: 55%;", type: "button" });
        this._drumsetButtons = [];
        this._drumsetButtonContainer = HTML.div({ class: "instrument-bar", style: "justify-content: center;" });
        this._cancelButton = HTML.button({ class: "cancelButton" });
        this._okayButton = HTML.button({ class: "okayButton", style: "width:45%;" }, "Okay");
        this.copyButton = HTML.button({ style: "width:86px; margin-right: 5px;", class: "copyButton" }, [
            "Copy",
            SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 50%; margin-top: -1em; pointer-events: none;", width: "2em", height: "2em", viewBox: "-5 -21 26 26" }, [
                SVG.path({ d: "M 0 -15 L 1 -15 L 1 0 L 13 0 L 13 1 L 0 1 L 0 -15 z M 2 -1 L 2 -17 L 10 -17 L 14 -13 L 14 -1 z M 3 -2 L 13 -2 L 13 -12 L 9 -12 L 9 -16 L 3 -16 z", fill: "currentColor" }),
            ]),
        ]);
        this.pasteButton = HTML.button({ style: "width:86px;", class: "pasteButton" }, [
            "Paste",
            SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 50%; margin-top: -1em; pointer-events: none;", width: "2em", height: "2em", viewBox: "0 0 26 26" }, [
                SVG.path({ d: "M 8 18 L 6 18 L 6 5 L 17 5 L 17 7 M 9 8 L 16 8 L 20 12 L 20 22 L 9 22 z", stroke: "currentColor", fill: "none" }),
                SVG.path({ d: "M 9 3 L 14 3 L 14 6 L 9 6 L 9 3 z M 16 8 L 20 12 L 16 12 L 16 8 z", fill: "currentColor", }),
            ]),
        ]);
        this.copyPasteContainer = HTML.div({ style: "width: 185px;" }, this.copyButton, this.pasteButton);
        this.container = HTML.div({ class: "prompt noSelection", style: "width: 500px;" }, HTML.h2("Edit Spectrum Instrument"), HTML.div({ style: "display: flex; width: 55%; align-self: center; flex-direction: row; align-items: center; justify-content: center;" }, this._playButton), this._drumsetButtonContainer, HTML.div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: center; height: 80%" }, this.spectrumEditor.container), HTML.div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._okayButton, this.copyPasteContainer), this._cancelButton);
        this._setDrumSpectrum = (index) => {
            this._drumsetButtons[this._drumsetSpectrumIndex].classList.remove("selected-instrument");
            this.spectrumEditors[this._drumsetSpectrumIndex].setSpectrumWave(this.spectrumEditor.getSpectrumWave().spectrum);
            this._drumsetSpectrumIndex = index;
            this._drumsetButtons[index].classList.add("selected-instrument");
            this.spectrumEditor.setSpectrumWave(this.spectrumEditors[this._drumsetSpectrumIndex].getSpectrumWave().spectrum);
            this.spectrumEditor.render();
        };
        this._togglePlay = () => {
            this._songEditor.togglePlay();
            this.updatePlayButton();
        };
        this._close = () => {
            this._doc.prompt = null;
            this._doc.undo();
        };
        this.cleanUp = () => {
            this._okayButton.removeEventListener("click", this._saveChanges);
            this._cancelButton.removeEventListener("click", this._close);
            this.container.removeEventListener("keydown", this.whenKeyPressed);
            this.spectrumEditor.container.removeEventListener("mousemove", () => this.spectrumEditor.render());
            this._playButton.removeEventListener("click", this._togglePlay);
        };
        this._copySettings = () => {
            const spectrumCopy = this.spectrumEditor.getSpectrumWave();
            window.localStorage.setItem("spectrumCopy", JSON.stringify(spectrumCopy.spectrum));
        };
        this._pasteSettings = () => {
            const storedSpectrumWave = JSON.parse(String(window.localStorage.getItem("spectrumCopy")));
            this.spectrumEditor.setSpectrumWave(storedSpectrumWave);
        };
        this.whenKeyPressed = (event) => {
            if (event.target.tagName != "BUTTON" && event.keyCode == 13) {
                this._saveChanges();
            }
            else if (event.keyCode == 32) {
                this._togglePlay();
                event.preventDefault();
            }
            else if (event.keyCode == 90) {
                this.spectrumEditor.undo();
                event.stopPropagation();
            }
            else if (event.keyCode == 89) {
                this.spectrumEditor.redo();
                event.stopPropagation();
            }
            else if (event.keyCode == 219) {
                this._doc.synth.goToPrevBar();
            }
            else if (event.keyCode == 221) {
                this._doc.synth.goToNextBar();
            }
            else if (event.keyCode >= 49 && event.keyCode <= 57) {
                if (event.shiftKey && this._isDrumset) {
                    this._setDrumSpectrum(event.keyCode - 49);
                }
            }
            else if (event.keyCode == 48) {
                if (event.shiftKey && this._isDrumset) {
                    this._setDrumSpectrum(9);
                }
            }
            else if (event.keyCode == 189 || event.keyCode == 173) {
                if (event.shiftKey && this._isDrumset) {
                    this._setDrumSpectrum(10);
                }
            }
            else if (event.keyCode == 187 || event.keyCode == 61 || event.keyCode == 171) {
                if (event.shiftKey && this._isDrumset) {
                    this._setDrumSpectrum(11);
                }
            }
        };
        this._saveChanges = () => {
            const group = new ChangeGroup();
            for (let i = 0; i < this.spectrumEditors.length; i++) {
                group.append(this.spectrumEditors[i].saveSettings());
            }
            this._doc.record(group, true);
            this._doc.prompt = null;
        };
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);
        this.container.addEventListener("keydown", this.whenKeyPressed);
        this.copyButton.addEventListener("click", this._copySettings);
        this.pasteButton.addEventListener("click", this._pasteSettings);
        this._playButton.addEventListener("click", this._togglePlay);
        this.container.addEventListener("mousemove", () => {
            this.spectrumEditor.render();
            this.spectrumEditors[this._drumsetSpectrumIndex].setSpectrumWave(this.spectrumEditor.getSpectrumWave().spectrum);
        });
        this.container.addEventListener("mousedown", this.spectrumEditor.render);
        this.spectrumEditor.container.addEventListener("mousemove", () => {
            this.spectrumEditor.render();
            this.spectrumEditors[this._drumsetSpectrumIndex].setSpectrumWave(this.spectrumEditor.getSpectrumWave().spectrum);
        });
        this.spectrumEditor.container.addEventListener("mousedown", this.spectrumEditor.render);
        this.updatePlayButton();
        if (this._isDrumset) {
            for (let i = Config.drumCount - 1; i >= 0; i--) {
                this.spectrumEditors[i] = new SpectrumEditor(this._doc, Config.drumCount - 1 - i, true);
                this.spectrumEditors[i].setSpectrumWave(this._songEditor._drumsetSpectrumEditors[Config.drumCount - 1 - i].getSpectrumWave().spectrum);
            }
            let colors = ColorConfig.getChannelColor(this._doc.song, this._doc.channel);
            for (let i = 0; i < Config.drumCount; i++) {
                let newSpectrumButton = HTML.button({ class: "no-underline", style: "max-width: 2em;" }, "" + (i + 1));
                this._drumsetButtons.push(newSpectrumButton);
                this._drumsetButtonContainer.appendChild(newSpectrumButton);
                newSpectrumButton.addEventListener("click", () => { this._setDrumSpectrum(i); });
            }
            this._drumsetButtons[Config.drumCount - 1].classList.add("last-button");
            this._drumsetButtons[0].classList.add("selected-instrument");
            this._drumsetButtonContainer.style.setProperty("--text-color-lit", colors.primaryNote);
            this._drumsetButtonContainer.style.setProperty("--text-color-dim", colors.secondaryNote);
            this._drumsetButtonContainer.style.setProperty("--background-color-lit", colors.primaryChannel);
            this._drumsetButtonContainer.style.setProperty("--background-color-dim", colors.secondaryChannel);
            this._drumsetButtonContainer.style.display = "";
            this.spectrumEditor.container.style.display = "";
            this.spectrumEditor.setSpectrumWave(this.spectrumEditors[this._drumsetSpectrumIndex].getSpectrumWave().spectrum);
        }
        else {
            this._drumsetButtonContainer.style.display = "none";
            this.spectrumEditors[0] = this.spectrumEditor;
        }
        setTimeout(() => this._playButton.focus());
        this.spectrumEditor.render();
    }
    updatePlayButton() {
        if (this._doc.synth.playing) {
            this._playButton.classList.remove("playButton");
            this._playButton.classList.add("pauseButton");
            this._playButton.title = "Pause (Space)";
            this._playButton.innerText = "Pause";
        }
        else {
            this._playButton.classList.remove("pauseButton");
            this._playButton.classList.add("playButton");
            this._playButton.title = "Play (Space)";
            this._playButton.innerText = "Play";
        }
    }
}
//# sourceMappingURL=SpectrumEditor.js.map