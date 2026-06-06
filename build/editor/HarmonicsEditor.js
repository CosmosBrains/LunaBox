import { Config } from "../synth/SynthConfig";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";
import { ChangeHarmonics } from "./changes";
import { prettyNumber } from "./EditorConfig";
export class HarmonicsEditor {
    constructor(_doc, _isPrompt = false) {
        this._doc = _doc;
        this._isPrompt = _isPrompt;
        this._editorWidth = 120;
        this._editorHeight = 26;
        this._octaves = SVG.svg({ "pointer-events": "none" });
        this._fifths = SVG.svg({ "pointer-events": "none" });
        this._curve = SVG.path({ fill: "none", stroke: "currentColor", "stroke-width": 2, "pointer-events": "none" });
        this._lastControlPoints = [];
        this._lastControlPointContainer = SVG.svg({ "pointer-events": "none" });
        this._svg = SVG.svg({ style: "background-color: ${ColorConfig.editorBackground}; touch-action: none; cursor: crosshair;", width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" }, this._octaves, this._fifths, this._curve, this._lastControlPointContainer);
        this.container = HTML.div({ class: "harmonics", style: "height: 100%;" }, this._svg);
        this._mouseX = 0;
        this._mouseY = 0;
        this._freqPrev = 0;
        this._ampPrev = 0;
        this._mouseDown = false;
        this._change = null;
        this._renderedPath = "";
        this._renderedFifths = true;
        this.instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        this._initial = this.instrument.harmonicsWave;
        this._undoHistoryState = 0;
        this._changeQueue = [];
        this.storeChange = () => {
            var sameCheck = true;
            if (this._changeQueue.length > 0) {
                for (var i = 0; i < Config.harmonicsControlPoints; i++) {
                    if (this._changeQueue[this._undoHistoryState][i] != this.instrument.harmonicsWave.harmonics[i]) {
                        sameCheck = false;
                        i = Config.harmonicsControlPoints;
                    }
                }
            }
            if (sameCheck == false || this._changeQueue.length == 0) {
                this._changeQueue.splice(0, this._undoHistoryState);
                this._undoHistoryState = 0;
                this._changeQueue.unshift(this.instrument.harmonicsWave.harmonics.slice());
                if (this._changeQueue.length > 32) {
                    this._changeQueue.pop();
                }
            }
        };
        this.undo = () => {
            if (this._undoHistoryState < this._changeQueue.length - 1) {
                this._undoHistoryState++;
                const harmonics = this._changeQueue[this._undoHistoryState].slice();
                this.setHarmonicsWave(harmonics);
            }
        };
        this.redo = () => {
            if (this._undoHistoryState > 0) {
                this._undoHistoryState--;
                const harmonics = this._changeQueue[this._undoHistoryState].slice();
                this.setHarmonicsWave(harmonics);
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
        for (let i = 1; i <= Config.harmonicsControlPoints; i = i * 2) {
            this._octaves.appendChild(SVG.rect({ fill: ColorConfig.tonic, x: (i - 0.5) * (this._editorWidth - 8) / (Config.harmonicsControlPoints - 1) - 1, y: 0, width: 2, height: this._editorHeight }));
        }
        for (let i = 3; i <= Config.harmonicsControlPoints; i = i * 2) {
            this._fifths.appendChild(SVG.rect({ fill: ColorConfig.fifthNote, x: (i - 0.5) * (this._editorWidth - 8) / (Config.harmonicsControlPoints - 1) - 1, y: 0, width: 2, height: this._editorHeight }));
        }
        for (let i = 0; i < 4; i++) {
            const rect = SVG.rect({ fill: "currentColor", x: (this._editorWidth - i * 2 - 1), y: 0, width: 1, height: this._editorHeight });
            this._lastControlPoints.push(rect);
            this._lastControlPointContainer.appendChild(rect);
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
        return (Config.harmonicsControlPoints - 1) * x / (this._editorWidth - 8) - 0.5;
    }
    _yToAmp(y) {
        return Config.harmonicsMax * (1 - y / this._editorHeight);
    }
    _whenCursorMoved() {
        if (this._mouseDown) {
            const freq = this._xToFreq(this._mouseX);
            const amp = this._yToAmp(this._mouseY);
            const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
            const harmonicsWave = instrument.harmonicsWave;
            if (freq != this._freqPrev) {
                const slope = (amp - this._ampPrev) / (freq - this._freqPrev);
                const offset = this._ampPrev - this._freqPrev * slope;
                const lowerFreq = Math.ceil(Math.min(this._freqPrev, freq));
                const upperFreq = Math.floor(Math.max(this._freqPrev, freq));
                for (let i = lowerFreq; i <= upperFreq; i++) {
                    if (i < 0 || i >= Config.harmonicsControlPoints)
                        continue;
                    harmonicsWave.harmonics[i] = Math.max(0, Math.min(Config.harmonicsMax, Math.round(i * slope + offset)));
                }
            }
            harmonicsWave.harmonics[Math.max(0, Math.min(Config.harmonicsControlPoints - 1, Math.round(freq)))] = Math.max(0, Math.min(Config.harmonicsMax, Math.round(amp)));
            this._freqPrev = freq;
            this._ampPrev = amp;
            this._change = new ChangeHarmonics(this._doc, instrument, harmonicsWave);
            this._doc.setProspectiveChange(this._change);
        }
    }
    getHarmonicsWave() {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        return instrument.harmonicsWave;
    }
    setHarmonicsWave(harmonics) {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        for (let i = 0; i < Config.harmonicsControlPoints; i++) {
            instrument.harmonicsWave.harmonics[i] = harmonics[i];
        }
        this._doc.record(new ChangeHarmonics(this._doc, instrument, instrument.harmonicsWave));
        this.render();
    }
    saveSettings() {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        return new ChangeHarmonics(this._doc, instrument, instrument.harmonicsWave);
    }
    resetToInitial() {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        this.setHarmonicsWave(this._initial.harmonics);
        this._doc.record(new ChangeHarmonics(this._doc, instrument, this._initial));
    }
    render() {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        const harmonicsWave = instrument.harmonicsWave;
        const controlPointToHeight = (point) => {
            return (1 - (point / Config.harmonicsMax)) * this._editorHeight;
        };
        let bottom = prettyNumber(this._editorHeight);
        let path = "";
        for (let i = 0; i < Config.harmonicsControlPoints - 1; i++) {
            if (harmonicsWave.harmonics[i] == 0)
                continue;
            let xPos = prettyNumber((i + 0.5) * (this._editorWidth - 8) / (Config.harmonicsControlPoints - 1));
            path += "M " + xPos + " " + bottom + " ";
            path += "L " + xPos + " " + prettyNumber(controlPointToHeight(harmonicsWave.harmonics[i])) + " ";
        }
        const lastHeight = controlPointToHeight(harmonicsWave.harmonics[Config.harmonicsControlPoints - 1]);
        for (let i = 0; i < 4; i++) {
            const rect = this._lastControlPoints[i];
            rect.setAttribute("y", prettyNumber(lastHeight));
            rect.setAttribute("height", prettyNumber(this._editorHeight - lastHeight));
        }
        if (this._renderedPath != path) {
            this._renderedPath = path;
            this._curve.setAttribute("d", path);
        }
        if (this._renderedFifths != this._doc.prefs.showFifth) {
            this._renderedFifths = this._doc.prefs.showFifth;
            this._fifths.style.display = this._doc.prefs.showFifth ? "" : "none";
        }
    }
}
export class HarmonicsEditorPrompt {
    constructor(_doc, _songEditor) {
        this._doc = _doc;
        this._songEditor = _songEditor;
        this.harmonicsEditor = new HarmonicsEditor(this._doc, true);
        this._playButton = HTML.button({ style: "width: 55%;", type: "button" });
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
        this.container = HTML.div({ class: "prompt noSelection", style: "width: 500px;" }, HTML.h2("Edit Harmonics Instrument"), HTML.div({ style: "display: flex; width: 55%; align-self: center; flex-direction: row; align-items: center; justify-content: center;" }, this._playButton), HTML.div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: center;" }, this.harmonicsEditor.container), HTML.div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._okayButton, this.copyPasteContainer), this._cancelButton);
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
            this.harmonicsEditor.container.removeEventListener("mousemove", () => this.harmonicsEditor.render());
            this._playButton.removeEventListener("click", this._togglePlay);
        };
        this._copySettings = () => {
            const harmonicsCopy = this.harmonicsEditor.getHarmonicsWave();
            window.localStorage.setItem("harmonicsCopy", JSON.stringify(harmonicsCopy.harmonics));
        };
        this._pasteSettings = () => {
            const storedHarmonicsWave = JSON.parse(String(window.localStorage.getItem("harmonicsCopy")));
            this.harmonicsEditor.setHarmonicsWave(storedHarmonicsWave);
            this.harmonicsEditor.storeChange();
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
                this.harmonicsEditor.undo();
                event.stopPropagation();
            }
            else if (event.keyCode == 89) {
                this.harmonicsEditor.redo();
                event.stopPropagation();
            }
            else if (event.keyCode == 219) {
                this._doc.synth.goToPrevBar();
            }
            else if (event.keyCode == 221) {
                this._doc.synth.goToNextBar();
            }
        };
        this._saveChanges = () => {
            this._doc.prompt = null;
            this._doc.record(this.harmonicsEditor.saveSettings(), true);
            this._doc.prompt = null;
        };
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);
        this.container.addEventListener("keydown", this.whenKeyPressed);
        this.copyButton.addEventListener("click", this._copySettings);
        this.pasteButton.addEventListener("click", this._pasteSettings);
        this._playButton.addEventListener("click", this._togglePlay);
        this.harmonicsEditor.container.addEventListener("mousemove", () => this.harmonicsEditor.render());
        this.harmonicsEditor.container.addEventListener("mousedown", () => this.harmonicsEditor.render());
        this.container.addEventListener("mousemove", () => this.harmonicsEditor.render());
        this.container.addEventListener("mousedown", () => this.harmonicsEditor.render());
        this.updatePlayButton();
        setTimeout(() => this._playButton.focus());
        this.harmonicsEditor.render();
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
//# sourceMappingURL=HarmonicsEditor.js.map