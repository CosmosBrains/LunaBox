import { sampleLoadEvents, Config, effectsIncludeTransition, effectsIncludeChord, effectsIncludePitchShift, effectsIncludeDetune, effectsIncludeVibrato, effectsIncludeNoteFilter, effectsIncludeDistortion, effectsIncludeBitcrusher, effectsIncludePanning, effectsIncludeChorus, effectsIncludeEcho, effectsIncludeReverb, effectsIncludeRM, effectsIncludePhaser, effectsIncludeNoteRange, effectsIncludeInvertWave, effectsIncludeGranular } from "../synth/SynthConfig";
import { BarScrollBar } from "./BarScrollBar";
import { BeatsPerBarPrompt } from "./BeatsPerBarPrompt";
import { ChangeGroup } from "./Change";
import { ChannelSettingsPrompt } from "./ChannelSettingsPrompt";
import { ColorConfig } from "./ColorConfig";
import { CustomChipPrompt } from "./CustomChipPrompt";
import { CustomFilterPrompt } from "./CustomFilterPrompt";
import { InstrumentExportPrompt } from "./InstrumentExportPrompt";
import { InstrumentImportPrompt } from "./InstrumentImportPrompt";
import { EditorConfig, isMobile, prettyNumber } from "./EditorConfig";
import { SetThemePrompt } from "./SongThemePrompt";
import { EuclideanRhythmPrompt } from "./EuclidgenRhythmPrompt";
import "./Layout";
import { Synth, clamp } from "../synth/synth";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { HarmonicsEditor, HarmonicsEditorPrompt } from "./HarmonicsEditor";
import { InputBox, Slider } from "./HTMLWrapper";
import { ImportPrompt } from "./ImportPrompt";
import { ChannelRow } from "./ChannelRow";
import { LayoutPrompt } from "./LayoutPrompt";
import { EnvelopeEditor } from "./EnvelopeEditor";
import { FadeInOutEditor } from "./FadeInOutEditor";
import { FilterEditor } from "./FilterEditor";
import { LimiterPrompt } from "./LimiterPrompt";
import { CustomScalePrompt } from "./CustomScalePrompt";
import { LoopEditor } from "./LoopEditor";
import { MoveNotesSidewaysPrompt } from "./MoveNotesSidewaysPrompt";
import { MuteEditor } from "./MuteEditor";
import { OctaveScrollBar } from "./OctaveScrollBar";
import { MidiInputHandler } from "./MidiInput";
import { KeyboardLayout } from "./KeyboardLayout";
import { PatternEditor } from "./PatternEditor";
import { Piano } from "./Piano";
import { SongDurationPrompt } from "./SongDurationPrompt";
import { SustainPrompt } from "./SustainPrompt";
import { SongRecoveryPrompt } from "./SongRecoveryPrompt";
import { RecordingSetupPrompt } from "./RecordingSetupPrompt";
import { SpectrumEditor, SpectrumEditorPrompt } from "./SpectrumEditor";
import { ThemePrompt } from "./ThemePrompt";
import { CustomPrompt } from "./CustomPrompt";
import { PresetPrompt, } from "./PresetPrompt";
import { TipPrompt } from "./TipPrompt";
import { ChangeTempo, ChangeKeyOctave, ChangeChorus, ChangeEchoDelay, ChangeEchoSustain, ChangeReverb, ChangeVolume, ChangePan, ChangePatternSelection, ChangePatternsPerChannel, ChangePatternNumbers, ChangeSupersawDynamism, ChangeSupersawSpread, ChangeSupersawShape, ChangePulseWidth, ChangeFeedbackAmplitude, ChangeOperatorAmplitude, ChangeOperatorFrequency, ChangeDrumsetEnvelope, ChangePasteInstrument, ChangePreset, pickRandomPresetValue, ChangeRandomGeneratedInstrument, ChangeEQFilterType, ChangeNoteFilterType, ChangeEQFilterSimpleCut, ChangeEQFilterSimplePeak, ChangeNoteFilterSimpleCut, ChangeNoteFilterSimplePeak, ChangeScale, ChangeDetectKey, ChangeKey, ChangeRhythm, ChangeFeedbackType, ChangeAlgorithm, ChangeChipWave, ChangeRMChipWave, ChangeNoiseWave, ChangeTransition, ChangeToggleEffects, ChangeVibrato, ChangeUnison, ChangeChord, ChangeSong, ChangePitchShift, ChangeDetune, ChangeDistortion, ChangeStringSustain, ChangeBitcrusherFreq, ChangeBitcrusherQuantization, ChangeAddEnvelope, ChangeEnvelopeSpeed, ChangeDiscreteEnvelope, ChangeAddChannelInstrument, ChangeRemoveChannelInstrument, ChangeCustomWave, ChangeOperatorWaveform, ChangeOperatorPulseWidth, ChangeSongTitle, ChangeVibratoDepth, ChangeVibratoSpeed, ChangeVibratoDelay, ChangeVibratoType, ChangePanDelay, ChangeArpeggioSpeed, ChangeFastTwoNoteArp, ChangeClicklessTransition, ChangeAliasing, ChangeSetPatternInstruments, ChangeHoldingModRecording, ChangeChipWavePlayBackwards, ChangeChipWaveStartOffset, ChangeChipWaveLoopEnd, ChangeChipWaveLoopStart, ChangeChipWaveLoopMode, ChangeChipWaveUseAdvancedLoopControls, ChangeDecimalOffset, ChangeUnisonVoices, ChangeUnisonSpread, ChangeUnisonOffset, ChangeUnisonExpression, ChangeUnisonSign, ChangeUnisonBuzzing, Change6OpFeedbackType, Change6OpAlgorithm, ChangeCustomAlgorythmorFeedback, ChangeRingMod, ChangeRingModHz, ChangeRingModPulseWidth, ChangePhaserMix, ChangePhaserFreq, ChangePhaserFeedback, ChangePhaserStages, ChangeUpperLimit, ChangeLowerLimit, ChangeSlideSpeed, ChangeStrumSpeed, ChangeRmHzOffset, ChangeInvertWave, ChangeGranular, ChangeGrainSize, ChangeGrainAmounts, ChangeGrainRange, ChangeInstrumentsFlags, } from "./changes";
import { TrackEditor } from "./TrackEditor";
import { oscilascopeCanvas } from "../global/Oscilascope";
import { VisualLoopControlsPrompt } from "./VisualLoopControlsPrompt";
import { SampleLoadingStatusPrompt } from "./SampleLoadingStatusPrompt";
import { AddSamplesPrompt } from "./AddSamplesPrompt";
import { ShortenerConfigPrompt } from "./ShortenerConfigPrompt";
import { FontPrompt } from "./CustomFontPrompt";
import { TutorialPrompt } from "./TutorialPrompt";
import { SongDetailsPrompt } from "./SongDetailsPrompt";
const { button, div, input, select, span, optgroup, option, canvas } = HTML;
const beepboxEditorContainer = document.getElementById("beepboxEditorContainer");
function buildOptions(menu, items) {
    for (let index = 0; index < items.length; index++) {
        menu.appendChild(option({ value: index }, items[index]));
    }
    return menu;
}
function buildHeaderedOptions(header, menu, items) {
    menu.appendChild(option({ selected: true, disabled: true, value: header }, header));
    for (const item of items) {
        menu.appendChild(option({ value: item }, item));
    }
    return menu;
}
function buildPresetOptions(isNoise, idSet) {
    const menu = select({ id: idSet });
    if (isNoise) {
        menu.appendChild(option({ value: 2 }, EditorConfig.valueToPreset(2).name));
        menu.appendChild(option({ value: 3 }, EditorConfig.valueToPreset(3).name));
        menu.appendChild(option({ value: 4 }, EditorConfig.valueToPreset(4).name));
    }
    else {
        menu.appendChild(option({ value: 0 }, EditorConfig.valueToPreset(0).name));
        menu.appendChild(option({ value: 9 }, EditorConfig.valueToPreset(9).name));
        menu.appendChild(option({ value: 6 }, EditorConfig.valueToPreset(6).name));
        menu.appendChild(option({ value: 1 }, EditorConfig.valueToPreset(1).name));
        menu.appendChild(option({ value: 11 }, EditorConfig.instrumentToPreset(11).name));
        menu.appendChild(option({ value: 8 }, EditorConfig.valueToPreset(8).name));
        menu.appendChild(option({ value: 5 }, EditorConfig.valueToPreset(5).name));
        menu.appendChild(option({ value: 7 }, EditorConfig.valueToPreset(7).name));
        menu.appendChild(option({ value: 3 }, EditorConfig.valueToPreset(3).name));
        menu.appendChild(option({ value: 2 }, EditorConfig.valueToPreset(2).name));
    }
    const randomGroup = optgroup({ label: "Randomize ▾" });
    randomGroup.appendChild(option({ value: "randomPreset" }, "Random Preset"));
    randomGroup.appendChild(option({ value: "randomGenerated" }, "Random Generated"));
    menu.appendChild(randomGroup);
    let firstCategoryGroup = null;
    let customSampleCategoryGroup = null;
    for (let categoryIndex = 1; categoryIndex < EditorConfig.presetCategories.length; categoryIndex++) {
        const category = EditorConfig.presetCategories[categoryIndex];
        const group = optgroup({ label: category.name + " ▾" });
        let foundAny = false;
        for (let presetIndex = 0; presetIndex < category.presets.length; presetIndex++) {
            const preset = category.presets[presetIndex];
            if ((preset.isNoise == true) == isNoise) {
                group.appendChild(option({ value: (categoryIndex << 6) + presetIndex }, preset.name));
                foundAny = true;
            }
        }
        if (categoryIndex === 1 && foundAny) {
            firstCategoryGroup = group;
        }
        else if (category.name === "Custom Sample Presets" && foundAny) {
            customSampleCategoryGroup = group;
        }
        if (category.name == "String Presets" && foundAny) {
            let moveViolin2 = group.removeChild(group.children[11]);
            group.insertBefore(moveViolin2, group.children[1]);
        }
        if (category.name == "Flute Presets" && foundAny) {
            let moveFlute2 = group.removeChild(group.children[11]);
            group.insertBefore(moveFlute2, group.children[1]);
        }
        if (category.name == "Keyboard Presets" && foundAny) {
            let moveGrandPiano2 = group.removeChild(group.children[9]);
            let moveGrandPiano3 = group.removeChild(group.children[9]);
            group.insertBefore(moveGrandPiano3, group.children[1]);
            group.insertBefore(moveGrandPiano2, group.children[1]);
        }
        if (foundAny)
            menu.appendChild(group);
    }
    if (firstCategoryGroup != null && customSampleCategoryGroup != null) {
        const parent = customSampleCategoryGroup.parentNode;
        parent.removeChild(customSampleCategoryGroup);
        parent.insertBefore(customSampleCategoryGroup, firstCategoryGroup);
    }
    return menu;
}
function setSelectedValue(menu, value, isSelect2 = false) {
    const stringValue = value.toString();
    if (menu.value != stringValue) {
        menu.value = stringValue;
        if (isSelect2) {
            $(menu).val(value).trigger('change.select2');
        }
    }
}
class CustomChipCanvas {
    constructor(canvas, _doc, _getChange) {
        this.canvas = canvas;
        this._doc = _doc;
        this._getChange = _getChange;
        this._change = null;
        this._onMouseMove = (event) => {
            if (this.mouseDown) {
                var x = (event.clientX || event.pageX) - this.canvas.getBoundingClientRect().left;
                var y = Math.floor((event.clientY || event.pageY) - this.canvas.getBoundingClientRect().top);
                if (y < 2)
                    y = 2;
                if (y > 50)
                    y = 50;
                var ctx = this.canvas.getContext("2d");
                if (this.continuousEdit == true && Math.abs(this.lastX - x) < 40) {
                    var lowerBound = (x < this.lastX) ? x : this.lastX;
                    var upperBound = (x < this.lastX) ? this.lastX : x;
                    for (let i = lowerBound; i <= upperBound; i += 2) {
                        var progress = (Math.abs(x - this.lastX) > 2.0) ? ((x > this.lastX) ?
                            1.0 - ((i - lowerBound) / (upperBound - lowerBound))
                            : ((i - lowerBound) / (upperBound - lowerBound))) : 0.0;
                        var j = Math.round(y + (this.lastY - y) * progress);
                        ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                        ctx.fillRect(Math.floor(i / 2) * 2, 0, 2, 53);
                        ctx.fillStyle = ColorConfig.getComputed("--ui-widget-background");
                        ctx.fillRect(Math.floor(i / 2) * 2, 25, 2, 2);
                        ctx.fillStyle = ColorConfig.getComputed("--track-editor-bg-pitch-dim");
                        ctx.fillRect(Math.floor(i / 2) * 2, 13, 2, 1);
                        ctx.fillRect(Math.floor(i / 2) * 2, 39, 2, 1);
                        ctx.fillStyle = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;
                        ctx.fillRect(Math.floor(i / 2) * 2, j - 2, 2, 4);
                        this.newArray[Math.floor(i / 2)] = (j - 26);
                    }
                }
                else {
                    ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                    ctx.fillRect(Math.floor(x / 2) * 2, 0, 2, 52);
                    ctx.fillStyle = ColorConfig.getComputed("--ui-widget-background");
                    ctx.fillRect(Math.floor(x / 2) * 2, 25, 2, 2);
                    ctx.fillStyle = ColorConfig.getComputed("--track-editor-bg-pitch-dim");
                    ctx.fillRect(Math.floor(x / 2) * 2, 13, 2, 1);
                    ctx.fillRect(Math.floor(x / 2) * 2, 39, 2, 1);
                    ctx.fillStyle = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;
                    ctx.fillRect(Math.floor(x / 2) * 2, y - 2, 2, 4);
                    this.newArray[Math.floor(x / 2)] = (y - 26);
                }
                this.continuousEdit = true;
                this.lastX = x;
                this.lastY = y;
                let instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                let sum = 0.0;
                for (let i = 0; i < this.newArray.length; i++) {
                    sum += this.newArray[i];
                }
                const average = sum / this.newArray.length;
                let cumulative = 0;
                let wavePrev = 0;
                for (let i = 0; i < this.newArray.length; i++) {
                    cumulative += wavePrev;
                    wavePrev = this.newArray[i] - average;
                    instrument.customChipWaveIntegral[i] = cumulative;
                }
                instrument.customChipWaveIntegral[64] = 0.0;
            }
        };
        this._onMouseDown = (event) => {
            this.mouseDown = true;
            this._onMouseMove(event);
        };
        this._onMouseUp = () => {
            this.mouseDown = false;
            this.continuousEdit = false;
            this._whenChange();
        };
        this._whenChange = () => {
            this._change = this._getChange(this.newArray);
            this._doc.record(this._change);
            this._change = null;
        };
        canvas.addEventListener("mousemove", this._onMouseMove);
        canvas.addEventListener("mousedown", this._onMouseDown);
        canvas.addEventListener("mouseup", this._onMouseUp);
        canvas.addEventListener("mouseleave", this._onMouseUp);
        this.mouseDown = false;
        this.continuousEdit = false;
        this.lastX = 0;
        this.lastY = 0;
        this.newArray = new Float32Array(64);
        this.renderedArray = new Float32Array(64);
        this.renderedColor = "";
        this.redrawCanvas();
    }
    redrawCanvas() {
        const chipData = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].customChipWave;
        const renderColor = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;
        let needsRedraw = false;
        if (renderColor != this.renderedColor) {
            needsRedraw = true;
        }
        else
            for (let i = 0; i < 64; i++) {
                if (chipData[i] != this.renderedArray[i]) {
                    needsRedraw = true;
                    i = 64;
                }
            }
        if (!needsRedraw) {
            return;
        }
        this.renderedArray.set(chipData);
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = ColorConfig.getComputed("--editor-background");
        ctx.fillRect(0, 0, 128, 52);
        ctx.fillStyle = ColorConfig.getComputed("--ui-widget-background");
        ctx.fillRect(0, 25, 128, 2);
        ctx.fillStyle = ColorConfig.getComputed("--track-editor-bg-pitch-dim");
        ctx.fillRect(0, 13, 128, 1);
        ctx.fillRect(0, 39, 128, 1);
        ctx.fillStyle = renderColor;
        for (let x = 0; x < 64; x++) {
            var y = chipData[x] + 26;
            ctx.fillRect(x * 2, y - 2, 2, 4);
            this.newArray[x] = y - 26;
        }
    }
}
class CustomAlgorythmCanvas {
    constructor(canvas, _doc, _getChange) {
        this.canvas = canvas;
        this._doc = _doc;
        this._getChange = _getChange;
        this._change = null;
        this._onMouseMove = (event) => {
            var _a, _b, _c, _d;
            if (this.mouseDown) {
                var x = (event.clientX || event.pageX) - this.canvas.getBoundingClientRect().left;
                var y = Math.floor((event.clientY || event.pageY) - this.canvas.getBoundingClientRect().top);
                var ctx = this.canvas.getContext("2d");
                ctx.fillStyle = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;
                var yindex = Math.ceil(y / 12);
                var xindex = Math.ceil(x / 12);
                yindex = (yindex / 2) - Math.floor(yindex / 2) >= 0.5 ? Math.floor(yindex / 2) : -1;
                xindex = (xindex / 2) + 0.5 - Math.floor(xindex / 2) <= 0.5 ? Math.floor(xindex / 2) - 1 : -1;
                yindex = yindex >= 0 && yindex <= 5 ? yindex : -1;
                xindex = xindex >= 0 && xindex <= 5 ? xindex : -1;
                ctx.fillRect(xindex * 24 + 12, yindex * 24, 2, 2);
                if (this.selected == -1) {
                    if (((_b = (_a = this.drawArray) === null || _a === void 0 ? void 0 : _a[yindex]) === null || _b === void 0 ? void 0 : _b[xindex]) != undefined) {
                        this.selected = this.drawArray[yindex][xindex];
                        ctx.fillRect(xindex * 24 + 12, yindex * 24, 12, 12);
                        ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                        ctx.fillText(this.drawArray[yindex][xindex] + "", xindex * 24 + 14, yindex * 24 + 10);
                        this.mouseDown = false;
                    }
                }
                else {
                    if (((_d = (_c = this.drawArray) === null || _c === void 0 ? void 0 : _c[yindex]) === null || _d === void 0 ? void 0 : _d[xindex]) != undefined) {
                        if (this.mode == "feedback") {
                            const newmod = this.drawArray[yindex][xindex];
                            let check = this.feedback[newmod - 1].indexOf(this.selected);
                            if (check != -1) {
                                this.feedback[newmod - 1].splice(check, 1);
                            }
                            else {
                                this.feedback[newmod - 1].push(this.selected);
                            }
                        }
                        else {
                            if (this.drawArray[yindex][xindex] == this.selected) {
                                if (this.selected == this.carriers) {
                                    if (this.selected > 1) {
                                        this.carriers--;
                                    }
                                }
                                else if (this.selected - 1 == this.carriers) {
                                    this.carriers++;
                                }
                            }
                            else {
                                const newmod = this.drawArray[yindex][xindex];
                                if (this.selected > newmod) {
                                    let check = this.newMods[newmod - 1].indexOf(this.selected);
                                    if (check != -1) {
                                        this.newMods[newmod - 1].splice(check, 1);
                                    }
                                    else {
                                        this.newMods[newmod - 1].push(this.selected);
                                    }
                                }
                                else {
                                    let check = this.newMods[this.selected - 1].indexOf(newmod);
                                    if (check != -1) {
                                        this.newMods[this.selected - 1].splice(check, 1);
                                    }
                                    else {
                                        this.newMods[this.selected - 1].push(newmod);
                                    }
                                }
                            }
                        }
                        this.selected = -1;
                        this.redrawCanvas(true);
                        this.mouseDown = false;
                    }
                    else {
                        this.selected = -1;
                        this.redrawCanvas(true);
                        this.mouseDown = false;
                    }
                }
            }
        };
        this._onMouseDown = (event) => {
            this.mouseDown = true;
            this._onMouseMove(event);
        };
        this._onMouseUp = () => {
            this.mouseDown = false;
            this._whenChange();
        };
        this._whenChange = () => {
            this._change = this._getChange(this.mode == "algorithm" ? this.newMods : this.feedback, this.carriers, this.mode);
            this._doc.record(this._change);
            this._change = null;
        };
        canvas.addEventListener("mousemove", this._onMouseMove);
        canvas.addEventListener("mousedown", this._onMouseDown);
        canvas.addEventListener("mouseup", this._onMouseUp);
        canvas.addEventListener("mouseleave", this._onMouseUp);
        this.mouseDown = false;
        this.drawArray = [[], [], [], [], [], []];
        this.lookUpArray = [[], [], [], [], [], []];
        this.carriers = 1;
        this.selected = -1;
        this.newMods = [[], [], [], [], [], []];
        this.inverseModulation = [[], [], [], [], [], []];
        this.feedback = [[], [], [], [], [], []];
        this.inverseFeedback = [[], [], [], [], [], []];
        this.mode = "algorithm";
        this.redrawCanvas();
    }
    reset() {
        this.redrawCanvas(false);
        this.selected = -1;
    }
    fillDrawArray(noReset = false) {
        if (noReset) {
            this.drawArray = [];
            this.drawArray = [[], [], [], [], [], []];
            this.inverseModulation = [[], [], [], [], [], []];
            this.lookUpArray = [[], [], [], [], [], []];
            for (let i = 0; i < this.newMods.length; i++) {
                for (let o = 0; o < this.newMods[i].length; o++) {
                    this.inverseModulation[this.newMods[i][o] - 1].push(i + 1);
                }
            }
            if (this.mode == "feedback") {
                this.inverseFeedback = [[], [], [], [], [], []];
                for (let i = 0; i < this.feedback.length; i++) {
                    for (let o = 0; o < this.feedback[i].length; o++) {
                        this.inverseFeedback[this.feedback[i][o] - 1].push(i + 1);
                    }
                }
            }
        }
        else {
            this.drawArray = [];
            this.drawArray = [[], [], [], [], [], []];
            this.carriers = 1;
            this.newMods = [[], [], [], [], [], []];
            this.inverseModulation = [[], [], [], [], [], []];
            this.lookUpArray = [[], [], [], [], [], []];
            var oldMods = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].customAlgorithm;
            this.carriers = oldMods.carrierCount;
            for (let i = 0; i < oldMods.modulatedBy.length; i++) {
                for (let o = 0; o < oldMods.modulatedBy[i].length; o++) {
                    this.inverseModulation[oldMods.modulatedBy[i][o] - 1].push(i + 1);
                    this.newMods[i][o] = oldMods.modulatedBy[i][o];
                }
            }
            if (this.mode == "feedback") {
                this.feedback = [[], [], [], [], [], []];
                this.inverseFeedback = [[], [], [], [], [], []];
                var oldfeed = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].customFeedbackType.indices;
                for (let i = 0; i < oldfeed.length; i++) {
                    for (let o = 0; o < oldfeed[i].length; o++) {
                        this.inverseFeedback[oldfeed[i][o] - 1].push(i + 1);
                        this.feedback[i][o] = oldfeed[i][o];
                    }
                }
            }
        }
        for (let i = 0; i < this.inverseModulation.length; i++) {
            if (i < this.carriers) {
                this.drawArray[this.drawArray.length - 1][i] = i + 1;
                this.lookUpArray[i] = [0, i];
            }
            else {
                if (this.inverseModulation[i][0] != undefined) {
                    let testPos = [this.drawArray.length - (this.lookUpArray[this.inverseModulation[i][this.inverseModulation[i].length - 1] - 1][0] + 2), this.lookUpArray[this.inverseModulation[i][this.inverseModulation[i].length - 1] - 1][1]];
                    if (this.drawArray[testPos[0]][testPos[1]] != undefined) {
                        while (this.drawArray[testPos[0]][testPos[1]] != undefined && testPos[1] < 6) {
                            testPos[1]++;
                            if (this.drawArray[testPos[0]][testPos[1]] == undefined) {
                                this.drawArray[testPos[0]][testPos[1]] = i + 1;
                                this.lookUpArray[i] = [this.drawArray.length - (testPos[0] + 1), testPos[1]];
                                break;
                            }
                            console.log(testPos[1]);
                        }
                    }
                    else {
                        this.drawArray[testPos[0]][testPos[1]] = i + 1;
                        this.lookUpArray[i] = [this.drawArray.length - (testPos[0] + 1), testPos[1]];
                    }
                }
                else {
                    let testPos = [5, 0];
                    while (this.drawArray[testPos[0]][testPos[1]] != undefined && testPos[1] < 6) {
                        testPos[1]++;
                        if (this.drawArray[testPos[0]][testPos[1]] == undefined) {
                            this.drawArray[testPos[0]][testPos[1]] = i + 1;
                            this.lookUpArray[i] = [this.drawArray.length - (testPos[0] + 1), testPos[1]];
                            break;
                        }
                    }
                }
            }
        }
    }
    drawLines(ctx) {
        if (this.mode == "feedback") {
            for (let off = 0; off < 6; off++) {
                ctx.strokeStyle = ColorConfig.getArbitaryChannelColor("pitch", off).primaryChannel;
                const set = off * 2 + 0.5;
                for (let i = 0; i < this.inverseFeedback[off].length; i++) {
                    let tar = this.inverseFeedback[off][i] - 1;
                    let srtpos = this.lookUpArray[off];
                    let tarpos = this.lookUpArray[tar];
                    ctx.beginPath();
                    ctx.moveTo(srtpos[1] * 24 + 12 + set, (6 - srtpos[0] - 1) * 24 + 12);
                    ctx.lineTo(srtpos[1] * 24 + 12 + set, (6 - srtpos[0] - 1) * 24 + 12 + set);
                    if (tarpos[1] != srtpos[1]) {
                        let side = 0;
                        if (tarpos[0] >= srtpos[0]) {
                            side = 24;
                        }
                        ctx.lineTo(srtpos[1] * 24 + side + set, (6 - srtpos[0] - 1) * 24 + 12 + set);
                        if ((tarpos[1] == (srtpos[1] - 1)) && (tarpos[0] <= (srtpos[0] - 1))) {
                        }
                        else {
                            if (tarpos[0] >= srtpos[0]) {
                                ctx.lineTo((tarpos[1] + 1) * 24 + set, (6 - srtpos[0] - 1) * 24 + 12 + set);
                                ctx.lineTo((tarpos[1] + 1) * 24 + set, (6 - tarpos[0] - 1) * 24 + 12 + set);
                            }
                            else {
                                ctx.lineTo(srtpos[1] * 24 + set, (6 - tarpos[0] - 1) * 24 + 12 + set);
                                ctx.lineTo((tarpos[1] + 1) * 24 + set, (6 - tarpos[0] - 1) * 24 + 12 + set);
                            }
                        }
                        ctx.lineTo((tarpos[1] + 1) * 24 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                        ctx.lineTo((tarpos[1]) * 24 + 12 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                        ctx.lineTo((tarpos[1]) * 24 + 12 + set, (6 - tarpos[0] - 1) * 24);
                    }
                    else {
                        if (srtpos[0] - tarpos[0] == 1) {
                            ctx.lineTo((tarpos[1]) * 24 + 12 + set, (6 - tarpos[0] - 1) * 24);
                        }
                        else {
                            if (tarpos[0] >= srtpos[0]) {
                                ctx.lineTo(srtpos[1] * 24 + 24 + set, (6 - srtpos[0] - 1) * 24 + 12 + set);
                                ctx.lineTo(srtpos[1] * 24 + 24 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                                ctx.lineTo(tarpos[1] * 24 + set + 12, (6 - tarpos[0] - 1) * 24 + set - 12);
                                ctx.lineTo(tarpos[1] * 24 + set + 12, (6 - tarpos[0] - 1) * 24);
                            }
                            else {
                                ctx.lineTo(srtpos[1] * 24 + set, (6 - srtpos[0] - 1) * 24 + 12 + set);
                                ctx.lineTo(srtpos[1] * 24 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                                ctx.lineTo(tarpos[1] * 24 + 12 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                                ctx.lineTo(tarpos[1] * 24 + 12 + set, (6 - tarpos[0] - 1) * 24);
                            }
                        }
                    }
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            return;
        }
        ;
        for (let off = 0; off < 6; off++) {
            ctx.strokeStyle = ColorConfig.getArbitaryChannelColor("pitch", off).primaryChannel;
            const set = off * 2 - 1 + 0.5;
            for (let i = 0; i < this.inverseModulation[off].length; i++) {
                let tar = this.inverseModulation[off][i] - 1;
                let srtpos = this.lookUpArray[off];
                let tarpos = this.lookUpArray[tar];
                ctx.beginPath();
                ctx.moveTo(srtpos[1] * 24 + 12 + set, (6 - srtpos[0] - 1) * 24 + 12);
                ctx.lineTo(srtpos[1] * 24 + 12 + set, (6 - srtpos[0] - 1) * 24 + 12 + set);
                if ((tarpos[1]) != srtpos[1]) {
                    ctx.lineTo(srtpos[1] * 24 + set, (6 - srtpos[0] - 1) * 24 + 12 + set);
                    if ((tarpos[1] == (srtpos[1] - 1)) && (tarpos[0] <= (srtpos[0] - 1))) {
                    }
                    else {
                        ctx.lineTo(srtpos[1] * 24 + set, (6 - tarpos[0] - 1) * 24 + 12 + set);
                        ctx.lineTo((tarpos[1] + 1) * 24 + set, (6 - tarpos[0] - 1) * 24 + 12 + set);
                    }
                    ctx.lineTo((tarpos[1] + 1) * 24 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                    ctx.lineTo((tarpos[1]) * 24 + 12 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                    ctx.lineTo((tarpos[1]) * 24 + 12 + set, (6 - tarpos[0] - 1) * 24);
                }
                else {
                    if (Math.abs(tarpos[0] - srtpos[0]) == 1) {
                        ctx.lineTo((tarpos[1]) * 24 + 12 + set, (6 - tarpos[0] - 1) * 24);
                    }
                    else {
                        ctx.lineTo(srtpos[1] * 24 + set, (6 - srtpos[0] - 1) * 24 + 12 + set);
                        ctx.lineTo(srtpos[1] * 24 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                        ctx.lineTo(srtpos[1] * 24 + 12 + set, (6 - tarpos[0] - 1) * 24 + set - 12);
                        ctx.lineTo(srtpos[1] * 24 + 12 + set, (6 - tarpos[0] - 1) * 24);
                    }
                }
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    redrawCanvas(noReset = false) {
        this.fillDrawArray(noReset);
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = ColorConfig.getComputed("--editor-background");
        ctx.fillRect(0, 0, 144, 144);
        for (let x = 0; x < 6; x++) {
            for (let y = 0; y < 6; y++) {
                ctx.fillStyle = ColorConfig.getComputed("--track-editor-bg-pitch-dim");
                ctx.fillRect(x * 24 + 12, ((y) * 24), 12, 12);
                ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                ctx.fillRect(x * 24 + 13, ((y) * 24) + 1, 10, 10);
                if (this.drawArray[y][x] != undefined) {
                    if (this.drawArray[y][x] <= this.carriers) {
                        ctx.fillStyle = ColorConfig.getComputed("--primary-text");
                        ctx.fillRect(x * 24 + 12, ((y) * 24), 12, 12);
                        ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                        ctx.fillRect(x * 24 + 13, ((y) * 24) + 1, 10, 10);
                        ctx.fillStyle = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;
                        ctx.fillText(this.drawArray[y][x] + "", x * 24 + 14, y * 24 + 10);
                    }
                    else {
                        ctx.fillStyle = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;
                        ctx.fillRect(x * 24 + 12, (y * 24), 12, 12);
                        ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                        ctx.fillRect(x * 24 + 13, ((y) * 24) + 1, 10, 10);
                        ctx.fillStyle = ColorConfig.getComputed("--primary-text");
                        ctx.fillText(this.drawArray[y][x] + "", x * 24 + 14, y * 24 + 10);
                    }
                }
            }
        }
        this.drawLines(ctx);
    }
}
export class SongEditor {
    constructor(_doc) {
        this._doc = _doc;
        this.prompt = null;
        this._menuMode = 1;
        this._instSettingMode = 1;
        this._mobilePatternButton = button({ class: "mobilePatternButton", type: "button", style: "display:none; width: 33vw; height: 75%;" });
        this._mobileTrackButton = button({ class: "mobileTrackButton", type: "button", style: "display:none; width: 34vw; height: 60%;" });
        this._mobileSettingsButton = button({ class: "mobileSettingsButton", type: "button", style: "display:none; width: 33vw; height: 60%;" });
        this.mobileMenu = div({ class: "mobileMenu", style: "position: fixed; bottom: 0px; height: 20vh; width: 100vw; display:none; background: var(--editor-background); z-index: 5;" });
        this._mobileEditMenuIcon = div({ class: "mobileEditMenuIcon" });
        this._mobileTrackMenuIcon = div({ class: "mobileTrackMenuIcon" });
        this._mobileSettingsMenuIcon = div({ class: "mobileSettingsMenuIcon" });
        this._keyboardLayout = new KeyboardLayout(this._doc);
        this._patternEditorPrev = new PatternEditor(this._doc, false, -1);
        this._patternEditor = new PatternEditor(this._doc, true, 0);
        this._patternEditorNext = new PatternEditor(this._doc, false, 1);
        this._trackEditor = new TrackEditor(this._doc, this);
        this._muteEditor = new MuteEditor(this._doc, this);
        this._loopEditor = new LoopEditor(this._doc, this._trackEditor);
        this._piano = new Piano(this._doc);
        this._octaveScrollBar = new OctaveScrollBar(this._doc, this._piano);
        this._playButton = button({ class: "playButton", type: "button", title: "Play (Space)" }, span("Play"));
        this._pauseButton = button({ class: "pauseButton", style: "display: none;", type: "button", title: "Pause (Space)" }, "Pause");
        this._recordButton = button({ class: "recordButton", style: "display: none;", type: "button", title: "Record (Ctrl+Space)" }, span("Record"));
        this._stopButton = button({ class: "stopButton", style: "display: none;", type: "button", title: "Stop Recording (Space)" }, "Stop Recording");
        this._prevBarButton = button({ class: "prevBarButton", type: "button", title: "Previous Bar (left bracket)" });
        this._nextBarButton = button({ class: "nextBarButton", type: "button", title: "Next Bar (right bracket)" });
        this._mobilePlayButton = button({ class: "mobilePlayButton", style: "width: 33%;", type: "button", title: "Play" });
        this._mobilePauseButton = button({ class: "mobilePauseButton", style: "display: none; width: 33%;", type: "button", title: "Pause", });
        this._mobilePrevBarButton = button({ class: "mobilePrevBarButton", type: "button", title: "Previous Bar", style: "width:34%" });
        this._mobileNextBarButton = button({ class: "mobileNextBarButton", type: "button", title: "Next Bar", style: "width:33%" });
        this._volumeSlider = new Slider(input({ title: "main volume", style: "width: 5em; flex-grow: 1; margin: 0;", type: "range", min: "0", max: "75", value: "50", step: "1" }), this._doc, null, false);
        this._outVolumeBarBg = SVG.rect({ "pointer-events": "none", width: "90%", height: "50%", x: "5%", y: "25%", fill: ColorConfig.uiWidgetBackground });
        this._outVolumeBar = SVG.rect({ "pointer-events": "none", height: "50%", width: "0%", x: "5%", y: "25%", fill: "url('#volumeGrad2')" });
        this._outVolumeCap = SVG.rect({ "pointer-events": "none", width: "2px", height: "50%", x: "5%", y: "25%", fill: ColorConfig.uiWidgetFocus });
        this._stop1 = SVG.stop({ "stop-color": "lime", offset: "60%" });
        this._stop2 = SVG.stop({ "stop-color": "orange", offset: "90%" });
        this._stop3 = SVG.stop({ "stop-color": "red", offset: "100%" });
        this._gradient = SVG.linearGradient({ id: "volumeGrad2", gradientUnits: "userSpaceOnUse" }, this._stop1, this._stop2, this._stop3);
        this._defs = SVG.defs({}, this._gradient);
        this._volumeBarContainer = SVG.svg({ style: `touch-action: none; overflow: visible; margin: auto; max-width: 20vw;`, width: "160px", height: "100%", preserveAspectRatio: "none", viewBox: "0 0 160 12" }, this._defs, this._outVolumeBarBg, this._outVolumeBar, this._outVolumeCap);
        this._volumeBarBox = div({ class: "playback-volume-bar", style: "height: 12px; align-self: center;" }, this._volumeBarContainer);
        this._fileMenu = select({ style: "width: 100%;" }, option({ selected: true, disabled: true, hidden: false }, "File"), option({ value: "new" }, "+ New Blank Song"), option({ value: "import" }, "↑ > Import/Export Song (" + EditorConfig.ctrlSymbol + "S/" + EditorConfig.ctrlSymbol + "O)"), option({ value: "copyUrl" }, "⎘ Copy Song URL"), option({ value: "shareUrl" }, "⤳ Share Song URL"), option({ value: "shortenUrl" }, "… Shorten Song URL"), option({ value: "configureShortener" }, "🛠 > Customize Url Shortener"), option({ value: "viewPlayer" }, "▶ View in Song Player"), option({ value: "copyEmbed" }, "⎘ Copy HTML Embed Code"), option({ value: "songRecovery" }, "⚠ > Recover Recent Song"), option({ value: "openManual" }, "🕮 > Open Manual"));
        this._editMenu = select({ style: "width: 100%;" }, option({ selected: true, disabled: true, hidden: false }, "Edit"), option({ value: "undo" }, "Undo (Z)"), option({ value: "redo" }, "Redo (Y)"), option({ value: "copy" }, "Copy Pattern (C)"), option({ value: "pasteNotes" }, "Paste Pattern Notes (V)"), option({ value: "pasteNumbers" }, "Paste Pattern Numbers (" + EditorConfig.ctrlSymbol + "⇧V)"), option({ value: "insertBars" }, "Insert Bar (⏎)"), option({ value: "deleteBars" }, "Delete Selected Bars (⌫)"), option({ value: "insertChannel" }, "Insert Channel (" + EditorConfig.ctrlSymbol + "⏎)"), option({ value: "deleteChannel" }, "Delete Selected Channels (" + EditorConfig.ctrlSymbol + "⌫)"), option({ value: "selectChannel" }, "Select Channel (⇧A)"), option({ value: "selectAll" }, "Select All (A)"), option({ value: "duplicatePatterns" }, "Duplicate Reused Patterns (D)"), option({ value: "transposeUp" }, "Move Notes Up (+ or ⇧+)"), option({ value: "transposeDown" }, "Move Notes Down (- or ⇧-)"), option({ value: "moveNotesSideways" }, "> Move All Notes Sideways (W)"), option({ value: "generateEuclideanRhythm" }, "> Generate Euclidean Rhythm (E)"), option({ value: "beatsPerBar" }, "> Change Beats Per Bar (B)"), option({ value: "barCount" }, "> Change Song Length (L)"), option({ value: "channelSettings" }, "> Channel Settings (Q)"), option({ value: "limiterSettings" }, "> Limiter Settings (⇧L)"), option({ value: "addExternal" }, "> Add Custom Samples (⇧Q)"), option({ value: "songTheme" }, "> Set Theme For Song"), option({ value: "presetsPrompt" }, "> Select Presets"));
        this._optionsMenu = select({ style: "width: 100%;" }, option({ selected: true, disabled: true, hidden: false }, "Preferences"), optgroup({ label: "Technical" }, option({ value: "autoPlay" }, "Auto Play on Load"), option({ value: "autoFollow" }, "Auto Follow Playhead"), option({ value: "enableNotePreview" }, "Hear Added Notes"), option({ value: "notesOutsideScale" }, "Place Notes Out of Scale"), option({ value: "setDefaultScale" }, "Set Current Scale as Default"), option({ value: "alwaysFineNoteVol" }, "Always Fine Note Volume"), option({ value: "enableChannelMuting" }, "Enable Channel Muting"), option({ value: "instrumentCopyPaste" }, "Enable Copy/Paste Buttons"), option({ value: "instrumentImportExport" }, "Enable Import/Export Buttons"), option({ value: "displayBrowserUrl" }, "Enable Song Data in URL"), option({ value: "closePromptByClickoff" }, "Close prompts on click off"), option({ value: "oldMobileLayout" }, "Use the Old mobile layout (Reload)"), option({ value: "instrumentSettingsSimplifier" }, "Use Instrument Setting Tabs"), option({ value: "promptSongDetails" }, "Prompt Song Details on Load"), option({ value: "recordingSetup" }, "Note Recording...")), optgroup({ label: "Appearance" }, option({ value: "showThird" }, 'Highlight "Third" Note (SandBox)'), option({ value: "showFifth" }, 'Highlight "Fifth" Note'), option({ value: "advancedColorScheme" }, "Advanced Color Scheme (ModBox)"), option({ value: "notesFlashWhenPlayed" }, "Notes Flash When Played (DB2)"), option({ value: "showChannels" }, "Show All Channels"), option({ value: "showScrollBar" }, "Show Octave Scroll Bar"), option({ value: "showLetters" }, "Show Piano Keys"), option({ value: "displayVolumeBar" }, "Show Playback Volume"), option({ value: "showOscilloscope" }, "Show Oscilloscope"), option({ value: "showSampleLoadingStatus" }, "Show Sample Loading Status"), option({ value: "showDescription" }, "Show Description"), option({ value: "frostedGlassBackground" }, "Use Frosted Glass Prompt Backdrops"), option({ value: "displayShortcutButtons" }, "Display Mobile Shortcut Buttons"), option({ value: "oldModNotes" }, 'Use Old Mod Notes'), option({ value: "selectionCounter" }, 'Selection Counter'), option({ value: "layout" }, "> Set Layout"), option({ value: "colorTheme" }, "> Set Theme"), option({ value: "customFont" }, "> Set Font"), option({ value: "customTheme" }, "> Custom Theme")));
        this._scaleSelect = buildOptions(select(), Config.scales.map(scale => scale.name));
        this._keySelect = buildOptions(select(), Config.keys.map(key => key.name).reverse());
        this._octaveStepper = input({ style: "width: 59.5%;", type: "number", min: Config.octaveMin, max: Config.octaveMax, value: "0" });
        this._tempoSlider = new Slider(input({ style: "margin: 0; vertical-align: middle;", type: "range", min: "1", max: "500", value: "160", step: "1" }), this._doc, (oldValue, newValue) => new ChangeTempo(this._doc, oldValue, newValue), false);
        this._tempoStepper = input({ style: "width: 4em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;", type: "number", step: "1" });
        this._chorusSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.chorusRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeChorus(this._doc, oldValue, newValue), false);
        this._chorusRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("chorus") }, "Chorus:"), this._chorusSlider.container);
        this._ringModWaveSelect = buildOptions(select({}), Config.operatorWaves.map(wave => wave.name));
        this._ringModSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.ringModRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeRingMod(this._doc, oldValue, newValue), false);
        this._ringModRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("ringMod") }, "Ring Mod:"), this._ringModSlider.container);
        this._ringModHzSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.ringModHzRange - 1, value: (Config.ringModHzRange - (Config.ringModHzRange / 2)), step: "1" }), this._doc, (oldValue, newValue) => new ChangeRingModHz(this._doc, oldValue, newValue), true);
        this._rmHzOffsetSlider = new Slider(input({ style: "margin: 0;", type: "range", min: Config.rmHzOffsetMin - Config.rmHzOffsetCenter, max: Config.rmHzOffsetMax - Config.rmHzOffsetCenter, value: 0, step: "4" }), this._doc, (oldValue, newValue) => new ChangeRmHzOffset(this._doc, oldValue, newValue), true);
        this._rmHzOffsetSliderInputBox = input({ style: "width: 4em; font-size: 80%; ", id: "rmHzOffsetSliderInputBox", type: "number", step: "1", min: Config.rmHzOffsetMin - Config.rmHzOffsetCenter, max: Config.rmHzOffsetMax - Config.rmHzOffsetCenter, value: 0 });
        this._ringModHzNum = div({ style: "font-size: 80%; ", id: "ringModHzNum" });
        this._ringModHzSliderRow = div({ class: "selectRow", style: "width:100%;" }, div({ style: "display:flex; flex-direction:column; align-items:center;" }, span({ class: "tip", style: "font-size: smaller;", onclick: () => this._openPrompt("RingModHz") }, "Hertz: "), div({ style: `color: ${ColorConfig.secondaryText}; ` }, this._ringModHzNum)), this._ringModHzSlider.container);
        this._rmOffsetHzSliderRow = div({ class: "selectRow", style: "width:100%;" }, div({ style: "display:flex; flex-direction:column; align-items:center;" }, span({ class: "tip", style: "font-size: smaller;", onclick: () => this._openPrompt("RingModHz") }, "Hz Offset: "), div({ style: `color: ${ColorConfig.secondaryText}; ` }, this._rmHzOffsetSliderInputBox)), this._rmHzOffsetSlider.container);
        this._ringModPulsewidthSlider = new Slider(input({ style: "margin-left: 10px; width: 85%;", type: "range", min: "0", max: Config.pwmOperatorWaves.length - 1, value: "0", step: "1", title: "Pulse Width" }), this._doc, (oldValue, newValue) => new ChangeRingModPulseWidth(this._doc, oldValue, newValue), true);
        this._ringModWaveText = span({ class: "tip", onclick: () => this._openPrompt("chipWave") }, "Wave: ");
        this._ringModWaveSelectRow = div({ class: "selectRow", style: "width: 100%;" }, this._ringModWaveText, this._ringModPulsewidthSlider.container, div({ class: "selectContainer", style: "width:40%;" }, this._ringModWaveSelect));
        this._ringModContainerRow = div({ class: "selectRow", style: "display:flex; flex-direction:column; height: 128px;" }, this._ringModRow, this._ringModHzSliderRow, this._rmOffsetHzSliderRow, this._ringModWaveSelectRow);
        this._granularSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.granularRange, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeGranular(this._doc, oldValue, newValue), false);
        this._granularRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("granular") }, "Granular:"), this._granularSlider.container);
        this._grainSizeSlider = new Slider(input({ style: "margin: 0;", type: "range", min: Config.grainSizeMin / Config.grainSizeStep, max: Config.grainSizeMax / Config.grainSizeStep, value: Config.grainSizeMin / Config.grainSizeStep, step: "1" }), this._doc, (oldValue, newValue) => new ChangeGrainSize(this._doc, oldValue, newValue), false);
        this.grainSizeNum = div({ style: "font-size: 80%; ", id: "grainSizeNum" });
        this._grainSizeSliderRow = div({ class: "selectRow", style: "width:100%;" }, div({ style: "display:flex; flex-direction:column; align-items:center;" }, span({ class: "tip", style: "font-size: smaller;", onclick: () => this._openPrompt("grainSize") }, "Grain: "), div({ style: `color: ${ColorConfig.secondaryText}; ` }, this.grainSizeNum)), this._grainSizeSlider.container);
        this._grainAmountsSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.grainAmountsMax, value: 8, step: "1" }), this._doc, (oldValue, newValue) => new ChangeGrainAmounts(this._doc, oldValue, newValue), false);
        this._grainAmountsRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("grainAmount") }, "Grain Freq:"), this._grainAmountsSlider.container);
        this._grainRangeSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.grainRangeMax / Config.grainSizeStep, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeGrainRange(this._doc, oldValue, newValue), false);
        this.grainRangeNum = div({ style: "font-size: 80%; ", id: "grainRangeNum" });
        this._grainRangeSliderRow = div({ class: "selectRow", style: "width:100%;" }, div({ style: "display:flex; flex-direction:column; align-items:center;" }, span({ class: "tip", style: "font-size: smaller;", onclick: () => this._openPrompt("grainRange") }, "Range: "), div({ style: `color: ${ColorConfig.secondaryText}; ` }, this.grainRangeNum)), this._grainRangeSlider.container);
        this._granularContainerRow = div({ class: "", style: "display:flex; flex-direction:column;" }, this._granularRow, this._grainAmountsRow, this._grainSizeSliderRow, this._grainRangeSliderRow);
        this._reverbSlider = new Slider(input({ style: "margin: 0; position: sticky,", type: "range", min: "0", max: Config.reverbRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeReverb(this._doc, oldValue, newValue), false);
        this._reverbRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("reverb") }, "Reverb:"), this._reverbSlider.container);
        this._echoSustainSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.echoSustainRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEchoSustain(this._doc, oldValue, newValue), false);
        this._echoSustainRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("echoSustain") }, "Echo:"), this._echoSustainSlider.container);
        this._echoDelaySlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.echoDelayRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEchoDelay(this._doc, oldValue, newValue), false);
        this._echoDelayRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("echoDelay") }, "Echo Delay:"), this._echoDelaySlider.container);
        this._rhythmSelect = buildOptions(select(), Config.rhythms.map(rhythm => rhythm.name));
        this._phaserMixSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.phaserMixRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangePhaserMix(this._doc, oldValue, newValue), false);
        this._phaserMixRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("phaserMix") }, span("Phaser:")), this._phaserMixSlider.container);
        this._phaserFreqSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.phaserFreqRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangePhaserFreq(this._doc, oldValue, newValue), false);
        this._phaserFreqRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("phaserFreq") }, span(" Freq:")), this._phaserFreqSlider.container);
        this._phaserFeedbackSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.phaserFeedbackRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangePhaserFeedback(this._doc, oldValue, newValue), false);
        this._phaserFeedbackRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("phaserFeedback") }, span(" Feedback:")), this._phaserFeedbackSlider.container);
        this._phaserStagesSlider = new Slider(input({ style: "margin: 0;", type: "range", min: Config.phaserMinStages, max: Config.phaserMaxStages, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangePhaserStages(this._doc, oldValue, newValue), false);
        this._phaserStagesRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("phaserStages") }, span(" Stages:")), this._phaserStagesSlider.container);
        this._pitchedPresetSelect = buildPresetOptions(false, "pitchPresetSelect");
        this._drumPresetSelect = buildPresetOptions(true, "drumPresetSelect");
        this._algorithmSelect = buildOptions(select(), Config.algorithms.map(algorithm => algorithm.name));
        this._algorithmSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("algorithm") }, "Algorithm: "), div({ class: "selectContainer" }, this._algorithmSelect));
        this._instrumentButtons = [];
        this._instrumentAddButton = button({ type: "button", class: "add-instrument last-button" });
        this._instrumentRemoveButton = button({ type: "button", class: "remove-instrument" });
        this._instrumentsButtonBar = div({ class: "instrument-bar" }, this._instrumentRemoveButton, this._instrumentAddButton);
        this._instrumentsButtonRow = div({ class: "selectRow", style: "display: none;" }, span({ class: "tip", onclick: () => this._openPrompt("instrumentIndex") }, "Instrument:"), this._instrumentsButtonBar);
        this._instrumentVolumeSlider = new Slider(input({ style: "margin: 0; position: sticky;", type: "range", min: Math.floor(-Config.volumeRange / 2), max: Math.floor(Config.volumeRange / 2), value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeVolume(this._doc, oldValue, newValue), true);
        this._instrumentVolumeSliderInputBox = input({ style: "width: 4em; font-size: 80%", id: "volumeSliderInputBox", type: "number", step: "1", min: Math.floor(-Config.volumeRange / 2), max: Math.floor(Config.volumeRange / 2), value: "0" });
        this._instrumentVolumeSliderTip = div({ class: "selectRow", style: "height: 1em" }, span({ class: "tip", style: "font-size: smaller;", onclick: () => this._openPrompt("instrumentVolume") }, "Volume: "));
        this._instrumentVolumeSliderRow = div({ class: "selectRow" }, div({}, div({ style: `color: ${ColorConfig.secondaryText};` }, span({ class: "tip" }, this._instrumentVolumeSliderTip)), div({ style: `color: ${ColorConfig.secondaryText}; margin-top: -3px;` }, this._instrumentVolumeSliderInputBox)), this._instrumentVolumeSlider.container);
        this._panSlider = new Slider(input({ style: "margin: 0; position: sticky;", type: "range", min: "0", max: Config.panMax, value: Config.panCenter, step: "1" }), this._doc, (oldValue, newValue) => new ChangePan(this._doc, oldValue, newValue), true);
        this._panDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(1) }, "▼");
        this._panSliderInputBox = input({ style: "width: 4em; font-size: 80%; ", id: "panSliderInputBox", type: "number", step: "1", min: "0", max: "100", value: "0" });
        this._panSliderRow = div({ class: "selectRow" }, div({}, span({ class: "tip", tabindex: "0", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("pan") }, "Pan: "), div({ style: "color: " + ColorConfig.secondaryText + "; margin-top: -3px;" }, this._panSliderInputBox)), this._panDropdown, this._panSlider.container);
        this._panDelaySlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["pan delay"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangePanDelay(this._doc, oldValue, newValue), false);
        this._panDelayRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("panDelay") }, "‣ Delay:"), this._panDelaySlider.container);
        this._panDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._panDelayRow);
        this._chipWaveSelect = buildOptions(select(), Config.chipWaves.map(wave => wave.name));
        this._chipNoiseSelect = buildOptions(select(), Config.chipNoises.map(wave => wave.name));
        this._useChipWaveAdvancedLoopControlsBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-left: 0.4em; margin-right: 4em;" });
        this._chipWaveLoopModeSelect = buildOptions(select(), ["Loop", "Ping-Pong", "Play Once", "Play Loop Once"]);
        this._chipWaveLoopStartStepper = input({ type: "number", min: "0", step: "1", value: "0", style: "width: 100%; height: 1.5em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;" });
        this._chipWaveLoopEndStepper = input({ type: "number", min: "0", step: "1", value: "0", style: "width: 100%; height: 1.5em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;" });
        this._setChipWaveLoopEndToEndButton = button({ type: "button", style: "width: 1.5em; height: 1.5em; padding: 0; margin-left: 0.5em;" }, SVG.svg({ width: "16", height: "16", viewBox: "-13 -14 26 26", "pointer-events": "none", style: "width: 100%; height: 100%;" }, SVG.rect({ x: "4", y: "-6", width: "2", height: "12", fill: ColorConfig.primaryText }), SVG.path({ d: "M -6 -6 L -6 6 L 3 0 z", fill: ColorConfig.primaryText })));
        this._chipWaveStartOffsetStepper = input({ type: "number", min: "0", step: "1", value: "0", style: "width: 100%; height: 1.5em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;" });
        this._chipWavePlayBackwardsBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-left: 0.4em; margin-right: 4em;" });
        this._chipWaveSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("chipWave") }, "Wave: "), div({ class: "selectContainer" }, this._chipWaveSelect));
        this._chipNoiseSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("chipNoise") }, "Noise: "), div({ class: "selectContainer" }, this._chipNoiseSelect));
        this._visualLoopControlsButton = button({ style: "margin-left: 0em; padding-left: 0.2em; height: 1.5em; max-width: 12px;", onclick: () => this._openPrompt("visualLoopControls") }, "+");
        this._useChipWaveAdvancedLoopControlsRow = div({ class: "selectRow" }, span({ class: "tip", style: "flex-shrink: 0;", onclick: () => this._openPrompt("loopControls") }, "Loop Controls: "), this._useChipWaveAdvancedLoopControlsBox);
        this._chipWaveLoopModeSelectRow = div({ class: "selectRow" }, span({ class: "tip", style: "font-size: x-small;", onclick: () => this._openPrompt("loopMode") }, "Loop Mode: "), div({ class: "selectContainer" }, this._chipWaveLoopModeSelect));
        this._chipWaveLoopStartRow = div({ class: "selectRow" }, span({ class: "tip", style: "font-size: x-small;", onclick: () => this._openPrompt("loopStart") }, "Loop Start: "), this._visualLoopControlsButton, span({ style: "display: flex;" }, this._chipWaveLoopStartStepper));
        this._chipWaveLoopEndRow = div({ class: "selectRow" }, span({ class: "tip", style: "font-size: x-small;", onclick: () => this._openPrompt("loopEnd") }, "Loop End: "), span({ style: "display: flex;" }, this._chipWaveLoopEndStepper, this._setChipWaveLoopEndToEndButton));
        this._chipWaveStartOffsetRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("offset") }, "Offset: "), span({ style: "display: flex;" }, this._chipWaveStartOffsetStepper));
        this._chipWavePlayBackwardsRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("backwards") }, "Backwards: "), this._chipWavePlayBackwardsBox);
        this._fadeInOutEditor = new FadeInOutEditor(this._doc);
        this._fadeInOutRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("fadeInOut") }, "Fade:"), this._fadeInOutEditor.container);
        this._transitionSelect = buildOptions(select(), Config.transitions.map(transition => transition.name));
        this._transitionDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(3) }, "▼");
        this._transitionRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("transition") }, "Transition:"), this._transitionDropdown, div({ class: "selectContainer", style: "width: 52.5%;" }, this._transitionSelect));
        this._clicklessTransitionBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" });
        this._clicklessTransitionRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("clicklessTransition") }, "‣ Clickless:"), this._clicklessTransitionBox);
        this._slideSpeedDisplay = span({ style: `color: ${ColorConfig.secondaryText}; font-size: smaller; text-overflow: clip;` }, "x1");
        this._slideSpeedSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "1", max: "48", value: "3", step: "1" }), this._doc, (oldValue, newValue) => new ChangeSlideSpeed(this._doc, oldValue, newValue), false);
        this._slideSpeedRow = div({ class: "selectRow" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("slideSpeedSlider") }, "‣ Spd:"), this._slideSpeedDisplay, this._slideSpeedSlider.container);
        this._transitionDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._slideSpeedRow, this._clicklessTransitionRow);
        this._effectsSelect = select(option({ selected: true, disabled: true, hidden: false }));
        this._eqFilterSimpleButton = button({ style: "font-size: x-small; width: 50%; height: 40%", class: "no-underline", onclick: () => this._switchEQFilterType(true) }, "simple");
        this._eqFilterAdvancedButton = button({ style: "font-size: x-small; width: 50%; height: 40%", class: "last-button no-underline", onclick: () => this._switchEQFilterType(false) }, "advanced");
        this._eqFilterTypeRow = div({ class: "selectRow", style: "padding-top: 4px; margin-bottom: 0px;" }, span({ style: "font-size: x-small;", class: "tip", onclick: () => this._openPrompt("filterType") }, "EQ Filt.Type:"), div({ class: "instrument-bar" }, this._eqFilterSimpleButton, this._eqFilterAdvancedButton));
        this._eqFilterEditor = new FilterEditor(this._doc);
        this._eqFilterZoom = button({ style: "margin-left:0em; padding-left:0.2em; height:1.5em; max-width: 12px;", onclick: () => this._openPrompt("customEQFilterSettings") }, "+");
        this._eqFilterRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("eqFilter") }, "EQ Filt:"), this._eqFilterZoom, this._eqFilterEditor.container);
        this._eqFilterSimpleCutSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.filterSimpleCutRange - 1, value: "6", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEQFilterSimpleCut(this._doc, oldValue, newValue), false);
        this._eqFilterSimpleCutRow = div({ class: "selectRow", title: "Low-pass Filter Cutoff Frequency" }, span({ class: "tip", onclick: () => this._openPrompt("filterCutoff") }, "Filter Cut:"), this._eqFilterSimpleCutSlider.container);
        this._eqFilterSimplePeakSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.filterSimplePeakRange - 1, value: "6", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEQFilterSimplePeak(this._doc, oldValue, newValue), false);
        this._eqFilterSimplePeakRow = div({ class: "selectRow", title: "Low-pass Filter Peak Resonance" }, span({ class: "tip", onclick: () => this._openPrompt("filterResonance") }, "Filter Peak:"), this._eqFilterSimplePeakSlider.container);
        this._noteFilterSimpleButton = button({ style: "font-size: x-small; width: 50%; height: 40%", class: "no-underline", onclick: () => this._switchNoteFilterType(true) }, "simple");
        this._noteFilterAdvancedButton = button({ style: "font-size: x-small; width: 50%; height: 40%", class: "last-button no-underline", onclick: () => this._switchNoteFilterType(false) }, "advanced");
        this._noteFilterTypeRow = div({ class: "selectRow", style: "padding-top: 4px; margin-bottom: 0px;" }, span({ style: "font-size: x-small;", class: "tip", onclick: () => this._openPrompt("filterType") }, "Note Filt.Type:"), div({ class: "instrument-bar" }, this._noteFilterSimpleButton, this._noteFilterAdvancedButton));
        this._noteFilterEditor = new FilterEditor(this._doc, true);
        this._noteFilterZoom = button({ style: "margin-left:0em; padding-left:0.2em; height:1.5em; max-width: 12px;", onclick: () => this._openPrompt("customNoteFilterSettings") }, "+");
        this._noteFilterRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("noteFilter") }, "Note Filt:"), this._noteFilterZoom, this._noteFilterEditor.container);
        this._noteFilterSimpleCutSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.filterSimpleCutRange - 1, value: "6", step: "1" }), this._doc, (oldValue, newValue) => new ChangeNoteFilterSimpleCut(this._doc, oldValue, newValue), false);
        this._noteFilterSimpleCutRow = div({ class: "selectRow", title: "Low-pass Filter Cutoff Frequency" }, span({ class: "tip", onclick: () => this._openPrompt("filterCutoff") }, "Filter Cut:"), this._noteFilterSimpleCutSlider.container);
        this._noteFilterSimplePeakSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.filterSimplePeakRange - 1, value: "6", step: "1" }), this._doc, (oldValue, newValue) => new ChangeNoteFilterSimplePeak(this._doc, oldValue, newValue), false);
        this._noteFilterSimplePeakRow = div({ class: "selectRow", title: "Low-pass Filter Peak Resonance" }, span({ class: "tip", onclick: () => this._openPrompt("filterResonance") }, "Filter Peak:"), this._noteFilterSimplePeakSlider.container);
        this._supersawDynamismSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.supersawDynamismMax, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeSupersawDynamism(this._doc, oldValue, newValue), false);
        this._supersawDynamismRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("supersawDynamism") }, "Dynamism:"), this._supersawDynamismSlider.container);
        this._supersawSpreadSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.supersawSpreadMax, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeSupersawSpread(this._doc, oldValue, newValue), false);
        this._supersawSpreadRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("supersawSpread") }, "Spread:"), this._supersawSpreadSlider.container);
        this._supersawShapeSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.supersawShapeMax, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeSupersawShape(this._doc, oldValue, newValue), false);
        this._supersawShapeRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("supersawShape"), style: "overflow: clip;" }, "Saw↔Pulse:"), this._supersawShapeSlider.container);
        this._pulseWidthSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "1", max: Config.pulseWidthRange, value: "1", step: "1" }), this._doc, (oldValue, newValue) => new ChangePulseWidth(this._doc, oldValue, newValue), true);
        this._pulseWidthDropdown = button({ style: "margin-left:53px; position: absolute; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(5) }, "▼");
        this._pwmSliderInputBox = input({ style: "width: 4em; font-size: 80%;", id: "pwmSliderInputBox", type: "number", step: "1", min: "1", max: Config.pulseWidthRange, value: "1" });
        this._pulseWidthRow = div({ class: "selectRow", style: "height:40px;" }, div({}, span({ class: "tip", tabindex: "0", style: "height:1em; font-size: smaller; white-space: nowrap;", onclick: () => this._openPrompt("pulseWidth") }, "Pulse", div, "Width:"), div({ style: `color: ${ColorConfig.secondaryText}; margin-top: -3px;` }, this._pwmSliderInputBox)), this._pulseWidthDropdown, this._pulseWidthSlider.container);
        this._decimalOffsetSlider = new Slider(input({ style: "margin: 0; transform: scaleX(-1);", type: "range", min: "0", max: "99", value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeDecimalOffset(this._doc, oldValue, 99 - newValue), false);
        this._decimalOffsetRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:10px;", onclick: () => this._openPrompt("decimalOffset") }, "‣ Offset:"), this._decimalOffsetSlider.container);
        this._pulseWidthDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._decimalOffsetRow);
        this._pitchShiftSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.pitchShiftRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangePitchShift(this._doc, oldValue, newValue), true);
        this._pitchShiftTonicMarkers = [div({ class: "pitchShiftMarker", style: { color: ColorConfig.tonic } }), div({ class: "pitchShiftMarker", style: { color: ColorConfig.tonic, left: "50%" } }), div({ class: "pitchShiftMarker", style: { color: ColorConfig.tonic, left: "100%" } })];
        this._pitchShiftFifthMarkers = [div({ class: "pitchShiftMarker", style: { color: ColorConfig.fifthNote, left: (100 * 7 / 24) + "%" } }), div({ class: "pitchShiftMarker", style: { color: ColorConfig.fifthNote, left: (100 * 19 / 24) + "%" } })];
        this._pitchShiftMarkerContainer = div({ style: "display: flex; position: relative;" }, this._pitchShiftSlider.container, div({ class: "pitchShiftMarkerContainer" }, this._pitchShiftTonicMarkers, this._pitchShiftFifthMarkers));
        this._pitchShiftRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("pitchShift") }, "Pitch Shift:"), this._pitchShiftMarkerContainer);
        this._detuneSlider = new Slider(input({ style: "margin: 0;", type: "range", min: Config.detuneMin - Config.detuneCenter, max: Config.detuneMax - Config.detuneCenter, value: 0, step: "4" }), this._doc, (oldValue, newValue) => new ChangeDetune(this._doc, oldValue, newValue), true);
        this._detuneSliderInputBox = input({ style: "width: 4em; font-size: 80%; ", id: "detuneSliderInputBox", type: "number", step: "1", min: Config.detuneMin - Config.detuneCenter, max: Config.detuneMax - Config.detuneCenter, value: 0 });
        this._detuneSliderRow = div({ class: "selectRow" }, div({}, span({ class: "tip", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("detune") }, "Detune: "), div({ style: `color: ${ColorConfig.secondaryText}; margin-top: -3px;` }, this._detuneSliderInputBox)), this._detuneSlider.container);
        this._distortionSlider = new Slider(input({ style: "margin: 0; position: sticky;", type: "range", min: "0", max: Config.distortionRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeDistortion(this._doc, oldValue, newValue), false);
        this._distortionRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("distortion") }, "Distortion:"), this._distortionSlider.container);
        this._aliasingBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" });
        this._aliasingRow = div({ class: "selectRow" }, span({ class: "tip", style: "margin-left:10px;", onclick: () => this._openPrompt("aliases") }, "Aliasing:"), this._aliasingBox);
        this._bitcrusherQuantizationSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.bitcrusherQuantizationRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeBitcrusherQuantization(this._doc, oldValue, newValue), false);
        this._bitcrusherQuantizationRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("bitcrusherQuantization") }, "Bit Crush:"), this._bitcrusherQuantizationSlider.container);
        this._bitcrusherFreqSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.bitcrusherFreqRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeBitcrusherFreq(this._doc, oldValue, newValue), false);
        this._bitcrusherFreqRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("bitcrusherFreq") }, "Freq Crush:"), this._bitcrusherFreqSlider.container);
        this._stringSustainSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.stringSustainRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeStringSustain(this._doc, oldValue, newValue), false);
        this._stringSustainLabel = span({ class: "tip", onclick: () => this._openPrompt("stringSustain") }, "Sustain:");
        this._stringSustainRow = div({ class: "selectRow" }, this._stringSustainLabel, this._stringSustainSlider.container);
        this._unisonDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(6) }, "▼");
        this._unisonSelect = buildOptions(select(), Config.unisons.map(unison => unison.name));
        this._unisonSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("unison") }, "Unison:"), this._unisonDropdown, div({ class: "selectContainer", style: "width: 61.5%;" }, this._unisonSelect));
        this._unisonVoicesInputBox = input({ style: "width: 150%; height: 1.5em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;", id: "unisonVoicesInputBox", type: "number", step: "1", min: Config.unisonVoicesMin, max: Config.unisonVoicesMax, value: 1 });
        this._unisonVoicesRow = div({ class: "selectRow dropFader" }, div({}, span({ class: "tip", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("unisonVoices") }, "‣ Voices: "), div({ style: "color: " + ColorConfig.secondaryText + "; margin-top: -3px;" }, this._unisonVoicesInputBox)));
        this._unisonSpreadInputBox = input({ style: "width: 150%; height: 1.5em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;", id: "unisonSpreadInputBox", type: "number", step: "0.001", min: Config.unisonSpreadMin, max: Config.unisonSpreadMax, value: 0.0 });
        this._unisonSpreadRow = div({ class: "selectRow dropFader" }, div({}, span({ class: "tip", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("unisonSpread") }, "‣ Spread: "), div({ style: "color: " + ColorConfig.secondaryText + "; margin-top: -3px;" }, this._unisonSpreadInputBox)));
        this._unisonOffsetInputBox = input({ style: "width: 150%; height: 1.5em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;", id: "unisonOffsetInputBox", type: "number", step: "0.001", min: Config.unisonOffsetMin, max: Config.unisonOffsetMax, value: 0.0 });
        this._unisonOffsetRow = div({ class: "selectRow dropFader" }, div({}, span({ class: "tip", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("unisonOffset") }, "‣ Offset: "), div({ style: "color: " + ColorConfig.secondaryText + "; margin-top: -3px;" }, this._unisonOffsetInputBox)));
        this._unisonExpressionInputBox = input({ style: "width: 150%; height: 1.5em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;", id: "unisonExpressionInputBox", type: "number", step: "0.001", min: Config.unisonExpressionMin, max: Config.unisonExpressionMax, value: 1.4 });
        this._unisonExpressionRow = div({ class: "selectRow dropFader" }, div({}, span({ class: "tip", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("unisonExpression") }, "‣ Volume: "), div({ style: "color: " + ColorConfig.secondaryText + "; margin-top: -3px;" }, this._unisonExpressionInputBox)));
        this._unisonSignInputBox = input({ style: "width: 150%; height: 1.5em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;", id: "unisonSignInputBox", type: "number", step: "0.001", min: Config.unisonSignMin, max: Config.unisonSignMax, value: 1.0 });
        this._unisonSignRow = div({ class: "selectRow dropFader" }, div({}, span({ class: "tip", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("unisonSign") }, "‣ Sign: "), div({ style: "color: " + ColorConfig.secondaryText + "; margin-top: -3px;" }, this._unisonSignInputBox)));
        this._unisonBuzzesBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-left: 0.4em; margin-right: 4em;" });
        this._unisonBuzzesBoxRow = div({ class: "selectRow" }, span({ class: "tip", style: "flex-shrink: 0;", onclick: () => this._openPrompt("unisonBuzzes") }, "Buzzes: "), this._unisonBuzzesBox);
        this._unisonDropdownGroup = div({ class: "editor-controls", style: "display: none; gap: 3px; margin-bottom: 0.5em;" }, this._unisonVoicesRow, this._unisonSpreadRow, this._unisonOffsetRow, this._unisonExpressionRow, this._unisonSignRow, this._unisonBuzzesBoxRow);
        this._chordSelect = buildOptions(select(), Config.chords.map(chord => chord.name));
        this._chordDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(2) }, "▼");
        this._chordSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("chords") }, "Chords:"), this._chordDropdown, div({ class: "selectContainer" }, this._chordSelect));
        this._arpeggioSpeedDisplay = span({ style: `color: ${ColorConfig.secondaryText}; font-size: smaller; text-overflow: clip;` }, "x1");
        this._arpeggioSpeedSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["arp speed"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeArpeggioSpeed(this._doc, oldValue, newValue), false);
        this._arpeggioSpeedRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("arpeggioSpeed") }, "‣ Spd:"), this._arpeggioSpeedDisplay, this._arpeggioSpeedSlider.container);
        this._strumSpeedDisplay = span({ style: `color: ${ColorConfig.secondaryText}; font-size: smaller; text-overflow: clip;` }, "0.04 beat(s)");
        this._strumSpeedSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "1", max: "48", value: "1", step: "1" }), this._doc, (oldValue, newValue) => new ChangeStrumSpeed(this._doc, oldValue, newValue), false);
        this._strumSpeedRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("strumSpeedSlider") }, "‣ Spd:"), this._strumSpeedDisplay, this._strumSpeedSlider.container);
        this._twoNoteArpBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" });
        this._twoNoteArpRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("twoNoteArpeggio") }, "‣ Fast Two-Note:"), this._twoNoteArpBox);
        this._chordDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._strumSpeedRow, this._arpeggioSpeedRow, this._twoNoteArpRow);
        this._invertWaveBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" });
        this._invertWaveRow = div({ class: "selectRow" }, span({ class: "tip", style: "margin-left:10px;", onclick: () => this._openPrompt("invertWave") }, "Invert Wave:"), this._invertWaveBox);
        this._vibratoSelect = buildOptions(select(), Config.vibratos.map(vibrato => vibrato.name));
        this._vibratoDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(0) }, "▼");
        this._vibratoSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("vibrato") }, "Vibrato:"), this._vibratoDropdown, div({ class: "selectContainer", style: "width: 61.5%;" }, this._vibratoSelect));
        this._vibratoDepthSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["vibrato depth"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeVibratoDepth(this._doc, oldValue, newValue), false);
        this._vibratoDepthRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("vibratoDepth") }, "‣ Depth:"), this._vibratoDepthSlider.container);
        this._vibratoSpeedDisplay = span({ style: `color: ${ColorConfig.secondaryText}; font-size: smaller; text-overflow: clip;` }, "x1");
        this._vibratoSpeedSlider = new Slider(input({ style: "margin: 0; text-overflow: clip;", type: "range", min: "0", max: Config.modulators.dictionary["vibrato speed"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeVibratoSpeed(this._doc, oldValue, newValue), false);
        this._vibratoSpeedRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("vibratoSpeed") }, "‣ Spd:"), this._vibratoSpeedDisplay, this._vibratoSpeedSlider.container);
        this._vibratoDelaySlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["vibrato delay"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeVibratoDelay(this._doc, oldValue, newValue), false);
        this._vibratoDelayRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("vibratoDelay") }, "‣ Delay:"), this._vibratoDelaySlider.container);
        this._vibratoTypeSelect = buildOptions(select(), Config.vibratoTypes.map(vibrato => vibrato.name));
        this._vibratoTypeSelectRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("vibratoType") }, "‣ Type:"), div({ class: "selectContainer", style: "width: 61.5%;" }, this._vibratoTypeSelect));
        this._vibratoDropdownGroup = div({ class: "editor-controls", style: `display: none;` }, this._vibratoDepthRow, this._vibratoSpeedRow, this._vibratoDelayRow, this._vibratoTypeSelectRow);
        this._phaseModGroup = div({ class: "editor-controls" });
        this._feedbackTypeSelect = buildOptions(select(), Config.feedbacks.map(feedback => feedback.name));
        this._feedbackRow1 = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("feedbackType") }, "Feedback:"), div({ class: "selectContainer" }, this._feedbackTypeSelect));
        this._spectrumEditor = new SpectrumEditor(this._doc, null);
        this._spectrumZoom = button({ style: "margin-left:0em; padding-left:0.2em; height:1.5em; max-width: 12px;", onclick: () => this._openPrompt("spectrumSettings") }, "+");
        this._spectrumRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("spectrum"), style: "font-size: smaller" }, "Spectrum:"), this._spectrumZoom, this._spectrumEditor.container);
        this._harmonicsEditor = new HarmonicsEditor(this._doc);
        this._harmonicsZoom = button({ style: "padding-left:0.2em; height:1.5em; max-width: 12px;", onclick: () => this._openPrompt("harmonicsSettings") }, "+");
        this._harmonicsRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("harmonics"), style: "font-size: smaller" }, "Harmonics:"), this._harmonicsZoom, this._harmonicsEditor.container);
        this._envelopeEditor = new EnvelopeEditor(this._doc);
        this._discreteEnvelopeBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" });
        this._discreteEnvelopeRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("discreteEnvelope") }, "‣ Discrete:"), this._discreteEnvelopeBox);
        this._envelopeSpeedDisplay = span({ style: `color: ${ColorConfig.secondaryText}; font-size: smaller; text-overflow: clip;` }, "x1");
        this._envelopeSpeedSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["envelope speed"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEnvelopeSpeed(this._doc, oldValue, newValue), false);
        this._envelopeSpeedRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("envelopeSpeed") }, "‣ Spd:"), this._envelopeSpeedDisplay, this._envelopeSpeedSlider.container);
        this._envelopeDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._discreteEnvelopeRow, this._envelopeSpeedRow);
        this._envelopeDropdown = button({ class: "envelopeDropdown", style: "margin-left:0em; margin-right: 1em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(7) }, "▼");
        this._drumsetGroup = div({ class: "editor-controls" });
        this._drumsetZoom = button({ style: "margin-left:0em; padding-left:0.3em; margin-right:0.5em; height:1.5em; max-width: 16px;", onclick: () => this._openPrompt("drumsetSettings") }, "+");
        this._modulatorGroup = div({ class: "editor-controls" });
        this._upperNoteLimitInputBox = input({ style: "width: 4em; font-size: 80%; ", id: "upperNoteLimitInputBox", type: "number", step: "1", min: 0, max: Config.maxPitch, value: 60 });
        this._upperNoteLimitRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("upperNoteLimit") }, "Upper Note Limit:"), this._upperNoteLimitInputBox);
        this._lowerNoteLimitInputBox = input({ style: "width: 4em; font-size: 80%; ", id: "lowerNoteLimitInputBox", type: "number", step: "1", min: 0, max: Config.maxPitch, value: 60 });
        this._lowerNoteLimitRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("lowerNoteLimit") }, "Lower Note Limit:"), this._lowerNoteLimitInputBox);
        this._feedback6OpTypeSelect = buildOptions(select(), Config.feedbacks6Op.map(feedback => feedback.name));
        this._feedback6OpRow1 = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("feedbackType") }, "Feedback:"), div({ class: "selectContainer" }, this._feedback6OpTypeSelect));
        this._algorithmCanvasSwitch = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: (e) => this._toggleAlgorithmCanvas(e) }, "F");
        this._customAlgorithmCanvas = new CustomAlgorythmCanvas(canvas({ width: 144, height: 144, style: "border:2px solid " + ColorConfig.uiWidgetBackground, id: "customAlgorithmCanvas" }), this._doc, (newArray, carry, mode) => new ChangeCustomAlgorythmorFeedback(this._doc, newArray, carry, mode));
        this._algorithm6OpSelect = buildOptions(select(), Config.algorithms6Op.map(algorithm => algorithm.name));
        this._algorithm6OpSelectRow = div(div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("algorithm") }, "Algorithm: "), div({ class: "selectContainer" }, this._algorithm6OpSelect)), div({ style: "height:144px; display:flex; flex-direction: row; align-items:center; justify-content:center;" }, div({ style: "display:block; width:10px; margin-right: 0.2em" }, this._algorithmCanvasSwitch), div({ style: "width:144px; height:144px;" }, this._customAlgorithmCanvas.canvas)));
        this._instrumentCopyButton = button({ style: "max-width:86px; width: 86px;", class: "copyButton", title: "Copy Instrument (⇧C)" }, [
            "Copy",
        ]);
        this._instrumentPasteButton = button({ style: "max-width:86px;", class: "pasteButton", title: "Paste Instrument (⇧V)" }, [
            "Paste",
        ]);
        this._instrumentExportButton = button({ style: "max-width:86px; width: 86px;", class: "exportInstrumentButton" }, [
            "Export",
        ]);
        this._instrumentImportButton = button({ style: "max-width:86px;", class: "importInstrumentButton" }, [
            "Import",
        ]);
        this._globalOscscope = new oscilascopeCanvas(canvas({ width: 144, height: 32, style: `border: 2px solid ${ColorConfig.uiWidgetBackground}; position: static;`, id: "oscilascopeAll" }), 1);
        this._globalOscscopeContainer = div({ style: "height: 38px; margin-left: auto; margin-right: auto;" }, this._globalOscscope.canvas);
        this._customWaveDrawCanvas = new CustomChipCanvas(canvas({ width: 128, height: 52, style: "border:2px solid " + ColorConfig.uiWidgetBackground, id: "customWaveDrawCanvas" }), this._doc, (newArray) => new ChangeCustomWave(this._doc, newArray));
        this._customWavePresetDrop = buildHeaderedOptions("Load Preset", select({ style: "width: 50%; height:1.5em; text-align: center; text-align-last: center;" }), Config.chipWaves.map(wave => wave.name));
        this._customWaveZoom = button({ style: "margin-left:0.5em; height:1.5em; max-width: 20px;", onclick: () => this._openPrompt("customChipSettings") }, "+");
        this._customWaveDraw = div({ style: "height:80px; margin-top:10px; margin-bottom:5px" }, [
            div({ style: "height:54px; display:flex; justify-content:center;" }, [this._customWaveDrawCanvas.canvas]),
            div({ style: "margin-top:5px; display:flex; justify-content:center;" }, [this._customWavePresetDrop, this._customWaveZoom]),
        ]);
        this._songTitleInputBox = new InputBox(input({ placeholder: EditorConfig.versionDisplayName, style: "font-weight:bold; width: 0; border:none; flex: 1; background-color:${ColorConfig.editorBackground}; color:${ColorConfig.primaryText}; text-align:center",
            maxlength: "30", type: "text" }), this._doc, (oldValue, newValue) => new ChangeSongTitle(this._doc, oldValue, newValue));
        this._feedbackAmplitudeSlider = new Slider(input({ type: "range", min: "0", max: Config.operatorAmplitudeMax, value: "0", step: "1", title: "Feedback Amplitude" }), this._doc, (oldValue, newValue) => new ChangeFeedbackAmplitude(this._doc, oldValue, newValue), false);
        this._feedbackRow2 = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("feedbackVolume") }, "Fdback Vol:"), this._feedbackAmplitudeSlider.container);
        this._addEnvelopeButton = button({ type: "button", class: "add-envelope" });
        this._instrumentDiv = div({ id: "InstrumentDiv" }, this._panSliderRow, this._panDropdownGroup, this._chipWaveSelectRow, this._chipNoiseSelectRow, this._useChipWaveAdvancedLoopControlsRow, this._chipWaveLoopModeSelectRow, this._chipWaveLoopStartRow, this._chipWaveLoopEndRow, this._chipWaveStartOffsetRow, this._chipWavePlayBackwardsRow, this._customWaveDraw, this._eqFilterTypeRow, this._eqFilterRow, this._eqFilterSimpleCutRow, this._eqFilterSimplePeakRow, this._fadeInOutRow, this._algorithmSelectRow, this._algorithm6OpSelectRow, this._phaseModGroup, this._feedbackRow1, this._feedback6OpRow1, this._feedbackRow2, this._spectrumRow, this._harmonicsRow, this._drumsetGroup, this._supersawDynamismRow, this._supersawSpreadRow, this._supersawShapeRow, this._pulseWidthRow, this._pulseWidthDropdownGroup, this._stringSustainRow, div({ style: "" }, this._unisonSelectRow), this._unisonDropdownGroup);
        this._effectDiv = div({ id: "effectsDiv" }, div({ class: "effectsNameDiv", style: `padding: 2px 0; margin-left: 2em; display: flex; align-items: center;` }, span({ style: `flex-grow: 1; text-align: center;` }, span({ class: "tip", onclick: () => this._openPrompt("effects") }, "Effects")), div({ class: "effects-menu" }, this._effectsSelect)), div({ class: "effectsOpDiv" }, this._transitionRow, this._transitionDropdownGroup, this._chordSelectRow, this._chordDropdownGroup, this._pitchShiftRow, this._detuneSliderRow, this._vibratoSelectRow, this._vibratoDropdownGroup, this._noteFilterTypeRow, this._noteFilterRow, this._noteFilterSimpleCutRow, this._noteFilterSimplePeakRow, this._distortionRow, this._aliasingRow, this._bitcrusherQuantizationRow, this._bitcrusherFreqRow, this._chorusRow, this._echoSustainRow, this._echoDelayRow, this._reverbRow, this._ringModContainerRow, this._phaserMixRow, this._phaserFreqRow, this._phaserFeedbackRow, this._phaserStagesRow, this._upperNoteLimitRow, this._lowerNoteLimitRow, this._invertWaveRow, this._granularContainerRow));
        this._envelopeDiv = div({ id: "envelopesDiv" }, div({ class: "envelopesNameDiv", style: `padding: 2px 0; margin-left: 2em; display: flex; align-items: center;` }, span({ style: `flex-grow: 1; text-align: center;` }, span({ class: "tip", onclick: () => this._openPrompt("envelopes") }, "Envelopes")), this._envelopeDropdown, this._addEnvelopeButton), div({ class: "envelopesOpDiv" }, this._envelopeDropdownGroup, this._envelopeEditor.container));
        this._customInstrumentSettingsGroup = div({ class: "editor-controls" }, this._instrumentDiv, this._effectDiv, this._envelopeDiv);
        this._instrumentCopyGroup = div({ class: "editor-controls" }, div({ class: "selectRow" }, this._instrumentCopyButton, this._instrumentPasteButton));
        this._instrumentExportGroup = div({ class: "editor-controls" }, div({ class: "selectRow" }, this._instrumentExportButton, this._instrumentImportButton));
        this._instrumentSettingsTextRow = div({ id: "instrumentSettingsText", style: `padding: 3px 0; max-width: 15em; text-align: center; color: ${ColorConfig.secondaryText};` }, "Instrument Settings");
        this._instrumentTypeSelectRow = div({ class: "selectRow", id: "typeSelectRow" }, span({ class: "tip", onclick: () => this._openPrompt("instrumentType") }, "Type:"), div(div({ class: "pitchSelect" }, this._pitchedPresetSelect), div({ class: "drumSelect" }, this._drumPresetSelect)));
        this.selectedPatternCounter = div({ style: "margin:5px; pointer-events: none;" }, this._doc.selection.boxSelectionWidth * this._doc.selection.boxSelectionHeight);
        this.selectedPatternDiv = div({ style: "background: var(--ui-widget-background); font-weight: bold; border-radius: 5px; height: 32px; position: absolute; font-size: 20px; text-align: center; align-content: center;", title: "The total number of patterns you have selected in the track editor." }, this.selectedPatternCounter);
        this._mobileInstSettingsButton = button({ class: "mobileInstButton", type: "button", style: "width:33%;", onclick: () => this._changeSetting(1) }, "Settings");
        this._mobileEffectsButton = button({ class: "mobileEffectsButton", type: "button", style: "width:30%; background: #fff0; color: var(--text-color-dim);", onclick: () => this._changeSetting(2) }, "Effects");
        this._mobileEnvelopesButton = button({ class: "mobileEnvelopesButton", type: "button", style: "width:37%; background: #fff0; color: var(--text-color-dim);", onclick: () => this._changeSetting(3) }, "Envelope");
        this._instOptionsDiv = div({ class: "instMobileOptions", style: "display:none; padding-bottom: 4px;" }, this._mobileInstSettingsButton, this._mobileEffectsButton, this._mobileEnvelopesButton);
        this._changeSetting = (setSetting) => {
            this._instSettingMode = setSetting;
            this.whenUpdated();
        };
        this._instrumentSettingsGroup = div({ class: "editor-controls" }, this._instrumentSettingsTextRow, this._instOptionsDiv, this._instrumentsButtonRow, this._instrumentTypeSelectRow, this._instrumentVolumeSliderRow, this._customInstrumentSettingsGroup);
        this._usedPatternIndicator = SVG.path({ d: "M -6 -6 H 6 V 6 H -6 V -6 M -2 -3 L -2 -3 L -1 -4 H 1 V 4 H -1 V -1.2 L -1.2 -1 H -2 V -3 z", fill: ColorConfig.indicatorSecondary, "fill-rule": "evenodd" });
        this._usedInstrumentIndicator = SVG.path({ d: "M -6 -0.8 H -3.8 V -6 H 0.8 V 4.4 H 2.2 V -0.8 H 6 V 0.8 H 3.8 V 6 H -0.8 V -4.4 H -2.2 V 0.8 H -6 z", fill: ColorConfig.indicatorSecondary });
        this._jumpToModIndicator = SVG.svg({ style: "width: 92%; height: 1.3em; flex-shrink: 0; position: absolute;", viewBox: "0 0 200 200" }, [
            SVG.path({ d: "M90 155 l0 -45 -45 0 c-25 0 -45 -4 -45 -10 0 -5 20 -10 45 -10 l45 0 0 -45 c0 -25 5 -45 10 -45 6 0 10 20 10 45 l0 45 45 0 c25 0 45 5 45 10 0 6 -20 10 -45 10 l -45 0 0 45 c0 25 -4 45 -10 45 -5 0 -10 -20 -10 -45z" }),
            SVG.path({ d: "M42 158 c-15 -15 -16 -38 -2 -38 6 0 10 7 10 15 0 8 7 15 15 15 8 0 15 5 15 10 0 14 -23 13 -38 -2z" }),
            SVG.path({ d: "M120 160 c0 -5 7 -10 15 -10 8 0 15 -7 15 -15 0 -8 5 -15 10 -15 14 0 13 23 -2 38 -15 15 -38 16 -38 2z" }),
            SVG.path({ d: "M32 58 c3 -23 48 -40 48 -19 0 6 -7 11 -15 11 -8 0 -15 7 -15 15 0 8 -5 15 -11 15 -6 0 -9 -10 -7 -22z" }),
            SVG.path({ d: "M150 65 c0 -8 -7 -15 -15 -15 -8 0 -15 -4 -15 -10 0 -14 23 -13 38 2 15 15 16 38 2 38 -5 0 -10 -7 -10 -15z" })
        ]);
        this._promptContainer = div({ class: "promptContainer", style: "display: none;" });
        this._promptContainerBG = div({ class: "promptContainerBG", style: "display: none; height: 100%; width: 100%; position: fixed; z-index: 99; overflow-x: hidden; pointer-events: none;" });
        this._zoomInButton = button({ class: "zoomInButton", type: "button", title: "Zoom In" });
        this._zoomOutButton = button({ class: "zoomOutButton", type: "button", title: "Zoom Out" });
        this._undoButton = button({ class: "undoButton", type: "button", title: "Undo Changes" });
        this._redoButton = button({ class: "redoButton", type: "button", title: "Redo Changes" });
        this._copyPatternButton = button({ class: "copyPatternButton", type: "button", title: "Copy Selected Notes" });
        this._pastePatternButton = button({ class: "pastePatternButton", type: "button", title: "Paste Selected Notes" });
        this._insertChannelButton = button({ class: "insertChannelButton", type: "button", title: "Insert Channel Below" });
        this._deleteChannelButton = button({ class: "deleteChannelButton", type: "button", title: "Delete Selected Channel" });
        this._selectAllButton = button({ class: "selectAllButton", type: "button", title: "Select All" });
        this._duplicateButton = button({ class: "duplicateButton", type: "button", title: "Duplicate Selected Pattern" });
        this._notesUpButton = button({ class: "notesUpButton", type: "button", title: "Move Notes Up" });
        this._notesDownButton = button({ class: "notesDownButton", type: "button", title: "Move Notes Down" });
        this._loopBarButton = button({ class: "loopBarButton", type: "button", title: "Loop only on the Currently Selected Bar" });
        this._fullscreenButton = button({ class: "fullscreenButton", type: "button", title: "Make the screen fit fully in your browser (Mobile Only)" });
        this._patternEditorRow = div({ style: "flex: 1; height: 100%; display: flex; overflow: hidden; justify-content: center;" }, this._patternEditorPrev.container, this._patternEditor.container, this._patternEditorNext.container);
        this._patternArea = div({ class: "pattern-area", id: "pattern-area" }, this._piano.container, this._patternEditorRow, this._octaveScrollBar.container, this._zoomInButton, this._zoomOutButton, this._undoButton, this._redoButton, this._copyPatternButton, this._pastePatternButton, this._insertChannelButton, this._deleteChannelButton, this._selectAllButton, this._duplicateButton, this._notesUpButton, this._notesDownButton, this._loopBarButton, this._fullscreenButton, this.selectedPatternDiv);
        this._trackContainer = div({ class: "trackContainer" }, this._trackEditor.container, this._loopEditor.container);
        this._trackVisibleArea = div({ style: "position: absolute; width: 100%; height: 100%; pointer-events: none;" });
        this._trackAndMuteContainer = div({ class: "trackAndMuteContainer" }, this._muteEditor.container, this._trackContainer, this._trackVisibleArea);
        this._barScrollBar = new BarScrollBar(this._doc);
        this._trackArea = div({ class: "track-area" }, this._trackAndMuteContainer, this._barScrollBar.container);
        this._menuArea = div({ class: "menu-area" }, div({ class: "selectContainer menu file" }, this._fileMenu), div({ class: "selectContainer menu edit" }, this._editMenu), div({ class: "selectContainer menu preferences" }, this._optionsMenu));
        this._sampleLoadingBar = div({ style: `width: 0%; height: 100%; background-color: ${ColorConfig.indicatorPrimary};` });
        this._sampleFailedBar = div({ style: `width: 0%; height: 100%; background-color: ${ColorConfig.sampleFailed};` });
        this._sampleLoadingBarContainer = div({ class: `sampleLoadingContainer`, style: `width: 80%; height: 4px; overflow: hidden; margin-left: auto; margin-right: auto; margin-top: 0.5em; cursor: pointer; display: flex; flex-direction: row; background-color: var(--empty-sample-bar, ${ColorConfig.indicatorSecondary});` }, this._sampleLoadingBar, this._sampleFailedBar);
        this._sampleLoadingStatusContainer = div({ style: "cursor: pointer;" }, div({ style: `margin-top: 0.5em; text-align: center; color: ${ColorConfig.secondaryText};` }, "Sample Loading Status"), div({ class: "selectRow", style: "height: 6px; margin-bottom: 0.5em;" }, this._sampleLoadingBarContainer));
        this._songSettingsArea = div({ class: "song-settings-area" }, div({ class: "editor-controls" }, div({ class: "editor-song-settings" }, div({ style: "margin: 3px 0; position: relative; text-align: center; color: ${ColorConfig.secondaryText};" }, div({ class: "tip", style: "flex-shrink: 0; position:absolute; left: 0; top: 0; width: 12px; height: 12px", onclick: () => this._openPrompt("usedPattern") }, SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 0; pointer-events: none;", width: "12px", height: "12px", "margin-right": "0.5em", viewBox: "-6 -6 12 12" }, this._usedPatternIndicator)), div({ class: "tip", style: "flex-shrink: 0; position: absolute; left: 14px; top: 0; width: 12px; height: 12px", onclick: () => this._openPrompt("usedInstrument") }, SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 0; pointer-events: none;", width: "12px", height: "12px", "margin-right": "1em", viewBox: "-6 -6 12 12" }, this._usedInstrumentIndicator)), "Song Settings", div({ style: "width: 100%; left: 0; top: -1px; position:absolute; overflow-x:clip;" }, this._jumpToModIndicator))), div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("scale") }, "Scale: "), div({ class: "selectContainer" }, this._scaleSelect)), div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("key") }, "Key: "), div({ class: "selectContainer" }, this._keySelect)), div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("key_octave") }, "Octave: "), this._octaveStepper), div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("tempo") }, "Tempo: "), span({ style: "display: flex;" }, this._tempoSlider.container, this._tempoStepper)), div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("rhythm") }, "Rhythm: "), div({ class: "selectContainer" }, this._rhythmSelect)), this._sampleLoadingStatusContainer));
        this._songDetailsButton = button({ class: "details-button" });
        this._instrumentSettingsArea = div({ class: "instrument-settings-area" }, this._instrumentSettingsGroup, this._modulatorGroup);
        this._playbackMobileDiv = div({ class: "playback-bar-controls2", id: 'playback-bar-controls2', style: 'width: 100%; display: flex; background: var(--editor-background); z-index: 6;' }, this._mobilePlayButton, this._mobilePauseButton, this._mobilePrevBarButton, this._mobileNextBarButton);
        this._playPauseAreaMobile = div({ class: "play-pause-area2", id: "play-pause-area2", style: 'flex-direction:row; position: absolute; width: 100%; display: flex; bottom: 16vh;' }, this._playbackMobileDiv);
        this._settingsArea = div({ class: "settings-area noSelection" }, div({ class: "version-area" }, div({ style: `text-align: center; margin: 3px 0; color: ${ColorConfig.secondaryText}; display:flex;` }, this._songTitleInputBox.input, this._songDetailsButton)), div({ class: "play-pause-area", id: "play-pause-area" }, this._volumeBarBox, div({ class: "playback-bar-controls" }, this._playButton, this._pauseButton, this._recordButton, this._stopButton, this._prevBarButton, this._nextBarButton), div({ class: "playback-volume-controls" }, span({ class: "volume-speaker" }), this._volumeSlider.container), this._globalOscscopeContainer), this._menuArea, this._songSettingsArea, this._instrumentSettingsArea);
        this.mainLayer = div({ class: "beepboxEditor", tabIndex: "0" }, this._patternArea, this._trackArea, this._settingsArea, this._promptContainer);
        this._wasPlaying = false;
        this._currentPromptName = null;
        this._highlightedInstrumentIndex = -1;
        this._renderedInstrumentCount = 0;
        this._renderedIsPlaying = false;
        this._renderedIsRecording = false;
        this._renderedShowRecordButton = false;
        this._renderedCtrlHeld = false;
        this._ctrlHeld = false;
        this._shiftHeld = false;
        this._deactivatedInstruments = false;
        this._operatorRows = [];
        this._operatorAmplitudeSliders = [];
        this._operatorFrequencySelects = [];
        this._operatorDropdowns = [];
        this._operatorWaveformSelects = [];
        this._operatorWaveformHints = [];
        this._operatorWaveformPulsewidthSliders = [];
        this._operatorDropdownRows = [];
        this._operatorDropdownGroups = [];
        this._drumsetSpectrumEditors = [];
        this._drumsetEnvelopeSelects = [];
        this._showModSliders = [];
        this._newShowModSliders = [];
        this._modSliderValues = [];
        this._hasActiveModSliders = false;
        this._openPanDropdown = false;
        this._openVibratoDropdown = false;
        this._openEnvelopeDropdown = false;
        this._openChordDropdown = false;
        this._openTransitionDropdown = false;
        this._openOperatorDropdowns = [];
        this._openPulseWidthDropdown = false;
        this._openUnisonDropdown = false;
        this.outVolumeHistoricTimer = 0;
        this.outVolumeHistoricCap = 0;
        this.lastOutVolumeCap = 0;
        this.patternUsed = false;
        this._modRecTimeout = -1;
        this._openDetails = () => {
            this._openPrompt("songDetails");
        };
        this._whenSampleLoadingStatusClicked = () => {
            this._openPrompt("sampleLoadingStatus");
        };
        this._loopTypeEvent = () => {
            if (this._doc.song.loopType == 3) {
                this._doc.synth.loopRepeatCount = 0;
                this._loopEditor.container.style.display = "none";
                SongEditor._styleElement.textContent = SongEditor._setLoopIcon[3];
                this._doc.synth.loopBarStart = -1;
                this._doc.synth.loopBarEnd = -1;
                this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                this._loopBarButton.style.display = "none";
                this._trackAndMuteContainer.style.marginBottom = "0.3em";
            }
            else if (this._doc.song.loopType == 2) {
                this._doc.synth.loopRepeatCount = -1;
                this._loopEditor.container.style.display = "none";
                SongEditor._styleElement.textContent = SongEditor._setLoopIcon[2];
                this._doc.synth.loopBarStart = -1;
                this._doc.synth.loopBarEnd = -1;
                this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                this._loopBarButton.style.display = "none";
                this._trackAndMuteContainer.style.marginBottom = "0.3em";
            }
            else if (this._doc.song.loopType == 1) {
                this._doc.synth.loopRepeatCount = -1;
                this._loopEditor.container.style.display = "";
                SongEditor._styleElement.textContent = SongEditor._setLoopIcon[1];
                this._loopBarButton.style.display = this._doc.prefs.displayShortcutButtons ? "" : "none";
                this._trackAndMuteContainer.style.marginBottom = "";
            }
        };
        this.refocusStage = () => {
            this.mainLayer.focus({ preventScroll: true });
        };
        this._dropHandler = () => {
            this._openPrompt("import");
        };
        this._onFocusIn = (event) => {
            if (this._doc.synth.recording && event.target != this.mainLayer && event.target != this._stopButton && event.target != this._volumeSlider.input) {
                this.refocusStage();
            }
        };
        this._refocusStageNotEditing = () => {
            if (!this._patternEditor.editingModLabel)
                this.mainLayer.focus({ preventScroll: true });
        };
        this.whenUpdated = () => {
            const prefs = this._doc.prefs;
            this._muteEditor.container.style.display = prefs.enableChannelMuting ? "" : "none";
            const trackBounds = this._trackVisibleArea.getBoundingClientRect();
            this._doc.trackVisibleBars = Math.floor((trackBounds.right - trackBounds.left - (prefs.enableChannelMuting ? 32 : 0)) / this._doc.getBarWidth());
            this._doc.trackVisibleChannels = Math.floor((trackBounds.bottom - trackBounds.top - 30) / ChannelRow.patternHeight);
            for (let i = this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount; i < this._doc.song.channels.length; i++) {
                const channel = this._doc.song.channels[i];
                for (let j = 0; j < channel.instruments.length; j++) {
                    this._doc.synth.determineInvalidModulators(channel.instruments[j]);
                }
            }
            this._loopTypeEvent();
            this._barScrollBar.render();
            this._trackEditor.render();
            this._muteEditor.render();
            this._trackAndMuteContainer.scrollLeft = this._doc.barScrollPos * this._doc.getBarWidth();
            this._trackAndMuteContainer.scrollTop = this._doc.channelScrollPos * ChannelRow.patternHeight;
            if (document.activeElement != this._patternEditor.modDragValueLabel && this._patternEditor.editingModLabel) {
                this._patternEditor.stopEditingModLabel(false);
            }
            this._piano.container.style.display = prefs.showLetters ? "" : "none";
            this._octaveScrollBar.container.style.display = prefs.showScrollBar ? "" : "none";
            this._barScrollBar.container.style.display = this._doc.song.barCount > this._doc.trackVisibleBars ? "" : "none";
            this._volumeBarBox.style.display = this._doc.prefs.displayVolumeBar ? "" : "none";
            this._globalOscscopeContainer.style.display = this._doc.prefs.showOscilloscope ? "" : "none";
            this._doc.synth.oscEnabled = this._doc.prefs.showOscilloscope;
            this._sampleLoadingStatusContainer.style.display = this._doc.prefs.showSampleLoadingStatus ? "" : "none";
            this._instrumentCopyGroup.style.display = this._doc.prefs.instrumentCopyPaste ? "" : "none";
            this._instrumentExportGroup.style.display = this._doc.prefs.instrumentImportExport ? "" : "none";
            if (document.getElementById('text-content'))
                document.getElementById('text-content').style.display = this._doc.prefs.showDescription ? "" : "none";
            if (!isMobile) {
                this._playPauseAreaMobile.style.display = "none";
                if (window.localStorage.getItem("tutorialComplete") != "true") {
                }
                if (this._doc.getFullScreen()) {
                    const semitoneHeight = this._patternEditorRow.clientHeight / this._doc.getVisiblePitchCount();
                    const targetBeatWidth = semitoneHeight * 5;
                    const minBeatWidth = this._patternEditorRow.clientWidth / (this._doc.song.beatsPerBar * 3);
                    const maxBeatWidth = this._patternEditorRow.clientWidth / (this._doc.song.beatsPerBar + 2);
                    const beatWidth = Math.max(minBeatWidth, Math.min(maxBeatWidth, targetBeatWidth));
                    const patternEditorWidth = beatWidth * this._doc.song.beatsPerBar;
                    if (this._doc.selection.boxSelectionWidth * this._doc.selection.boxSelectionHeight > 1) {
                        this.selectedPatternCounter.innerHTML = String(this._doc.selection.boxSelectionWidth * this._doc.selection.boxSelectionHeight);
                        this.selectedPatternDiv.style.display = this._doc.prefs.selectionCounter ? "" : "none";
                        this.selectedPatternDiv.style.left = prefs.showLetters ? "40px" : "10px";
                        this.selectedPatternDiv.style.top = prefs.displayShortcutButtons ? "200px" : "10px";
                        this.selectedPatternDiv.style.right = "";
                    }
                    else {
                        this.selectedPatternDiv.style.display = "none";
                    }
                    if (this._doc.prefs.showDescription == false) {
                        beepboxEditorContainer.style.paddingBottom = "0";
                        beepboxEditorContainer.style.borderStyle = "none";
                    }
                    else {
                        beepboxEditorContainer.style.paddingBottom = "";
                        beepboxEditorContainer.style.borderStyle = "";
                    }
                    this._patternEditorPrev.container.style.width = patternEditorWidth + "px";
                    this._patternEditor.container.style.width = patternEditorWidth + "px";
                    this._patternEditorNext.container.style.width = patternEditorWidth + "px";
                    this._patternEditorPrev.container.style.flexShrink = "0";
                    this._patternEditor.container.style.flexShrink = "0";
                    this._patternEditorNext.container.style.flexShrink = "0";
                    this._patternEditorPrev.container.style.display = "";
                    this._patternEditorNext.container.style.display = "";
                    this._patternEditorPrev.render();
                    this._patternEditorNext.render();
                    this._zoomInButton.style.display = (this._doc.channel < this._doc.song.pitchChannelCount) ? "" : "none";
                    this._zoomOutButton.style.display = (this._doc.channel < this._doc.song.pitchChannelCount) ? "" : "none";
                    this._zoomInButton.style.right = prefs.showScrollBar ? "24px" : "4px";
                    this._zoomOutButton.style.right = prefs.showScrollBar ? "24px" : "4px";
                    this._undoButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._redoButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._copyPatternButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._pastePatternButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._insertChannelButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._deleteChannelButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._selectAllButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._duplicateButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    if (this._doc.song.loopType != 1) {
                        this._loopBarButton.style.display = prefs.displayShortcutButtons ? "none" : "none";
                    }
                    else if (this._doc.song.loopType == 1) {
                        this._loopBarButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    }
                    this._notesDownButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._notesUpButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._undoButton.style.left = prefs.showLetters ? "40px" : "10px";
                    this._redoButton.style.left = prefs.showLetters ? "70px" : "40px";
                    this._copyPatternButton.style.left = prefs.showLetters ? "40px" : "10px";
                    this._pastePatternButton.style.left = prefs.showLetters ? "70px" : "40px";
                    this._insertChannelButton.style.left = prefs.showLetters ? "40px" : "10px";
                    this._deleteChannelButton.style.left = prefs.showLetters ? "70px" : "40px";
                    this._selectAllButton.style.left = prefs.showLetters ? "40px" : "10px";
                    this._duplicateButton.style.left = prefs.showLetters ? "70px" : "40px";
                    this._notesUpButton.style.left = prefs.showLetters ? "40px" : "10px";
                    this._notesDownButton.style.left = prefs.showLetters ? "70px" : "40px";
                    this._loopBarButton.style.left = prefs.showLetters ? "40px" : "10px";
                    this._fullscreenButton.style.display = "none";
                    const secondImage = document.getElementById("secondImage");
                    if (secondImage != null) {
                        secondImage.style.minHeight = "100vh";
                    }
                }
                else {
                    this._patternEditor.container.style.width = "";
                    this._patternEditor.container.style.flexShrink = "";
                    this._patternEditorPrev.container.style.display = "none";
                    this._patternEditorNext.container.style.display = "none";
                    this._zoomInButton.style.display = "none";
                    this._zoomOutButton.style.display = "none";
                    if (this._doc.selection.boxSelectionWidth * this._doc.selection.boxSelectionHeight > 1) {
                        this.selectedPatternCounter.innerHTML = String(this._doc.selection.boxSelectionWidth * this._doc.selection.boxSelectionHeight);
                        this.selectedPatternDiv.style.display = this._doc.prefs.selectionCounter ? "" : "none";
                        this.selectedPatternDiv.style.right = "104.5%";
                        this.selectedPatternDiv.style.left = "";
                        this.selectedPatternDiv.style.top = prefs.displayShortcutButtons ? "200px" : "10px";
                    }
                    else {
                        this.selectedPatternDiv.style.display = "none";
                    }
                    this._undoButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._redoButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._copyPatternButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._pastePatternButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._insertChannelButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._deleteChannelButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._selectAllButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._duplicateButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    if (this._doc.song.loopType != 1) {
                        this._loopBarButton.style.display = prefs.displayShortcutButtons ? "none" : "none";
                    }
                    else if (this._doc.song.loopType == 1) {
                        this._loopBarButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    }
                    this._notesDownButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._notesUpButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._undoButton.style.left = "-80px";
                    this._redoButton.style.left = "-50px";
                    this._copyPatternButton.style.left = "-80px";
                    this._pastePatternButton.style.left = "-50px";
                    this._insertChannelButton.style.left = "-80px";
                    this._deleteChannelButton.style.left = "-50px";
                    this._selectAllButton.style.left = "-80px";
                    this._duplicateButton.style.left = "-50px";
                    this._notesUpButton.style.left = "-80px";
                    this._notesDownButton.style.left = "-50px";
                    this._loopBarButton.style.left = "-50px";
                    this._fullscreenButton.style.display = "none";
                    beepboxEditorContainer.style.paddingBottom = "";
                    beepboxEditorContainer.style.borderStyle = "";
                    const secondImage = document.getElementById("secondImage");
                    if (secondImage != null) {
                        secondImage.style.minHeight = "100vh";
                    }
                }
            }
            else {
                this.selectedPatternDiv.style.display = "none";
                if (this._doc.prefs.oldMobileLayout != true) {
                    this._promptContainer.style.left = "50vw";
                    this._instSettingMode == 1 ? this._instrumentDiv.style.display = "" : this._instrumentDiv.style.display = "none";
                    this._instSettingMode == 2 ? this._effectDiv.style.display = "" : this._effectDiv.style.display = "none";
                    this._instSettingMode == 3 ? this._envelopeDiv.style.display = "" : this._envelopeDiv.style.display = "none";
                    beepboxEditorContainer.style.borderImageSource = "";
                    this._settingsArea.style.display = "none";
                    this._trackArea.style.display = "none";
                    this._patternArea.style.display = "";
                    this.mainLayer.style.display = "unset";
                    if (window.innerWidth > window.innerHeight) {
                        if (SongEditor.getMobileUi() != 'landscape') {
                            SongEditor.setMobileUi("landscape");
                        }
                        this._patternArea.style.display = this._menuMode == 1 ? "" : "none";
                        this._trackArea.style.display = this._menuMode == 2 ? "" : "none";
                        this._settingsArea.style.display = this._menuMode == 3 ? "" : "none";
                        this._mobilePatternButton.style.width = this._menuMode == 1 ? "100%" : "80%";
                        this._mobileTrackButton.style.width = this._menuMode == 2 ? "100%" : "80%";
                        this._mobileSettingsButton.style.width = this._menuMode == 3 ? "100%" : "80%";
                        this._playPauseAreaMobile.style.display = this._menuMode == 1 ? "flex" : "none";
                    }
                    else if (window.innerWidth < window.innerHeight) {
                        if (SongEditor.getMobileUi() != 'portrait') {
                            SongEditor.setMobileUi("portrait");
                        }
                        this._patternArea.style.display = this._menuMode == 1 ? "" : "none";
                        this._trackArea.style.display = this._menuMode == 2 ? "" : "none";
                        this._settingsArea.style.display = this._menuMode == 3 ? "" : "none";
                        this._mobilePatternButton.style.height = this._menuMode == 1 ? "100%" : "80%";
                        this._mobileTrackButton.style.height = this._menuMode == 2 ? "100%" : "80%";
                        this._mobileSettingsButton.style.height = this._menuMode == 3 ? "100%" : "80%";
                        this._playPauseAreaMobile.style.display = this._menuMode == 1 ? "flex" : "none";
                    }
                    this.mainLayer.style.minHeight = "80vh";
                    beepboxEditorContainer.style.maxHeight = "80vh";
                    this._mobilePatternButton.style.display = "";
                    this._mobileTrackButton.style.display = "";
                    this._mobileSettingsButton.style.display = "";
                    this.mobileMenu.style.display = "";
                    this._instOptionsDiv.style.display = "";
                    beepboxEditorContainer.appendChild(this._playPauseAreaMobile);
                    const playPauseArea = document.getElementById('play-pause-area');
                    const textContentMobile = document.getElementById('text-content');
                    textContentMobile.style.display = "none";
                    this._trackAndMuteContainer.style.maxHeight = "85vh";
                    playPauseArea.style.display = "flex";
                    playPauseArea.style.flexDirection = "column";
                }
                document.body.appendChild(this.mobileMenu);
                this.mobileMenu.appendChild(this._mobilePatternButton);
                this.mobileMenu.appendChild(this._mobileTrackButton);
                this.mobileMenu.appendChild(this._mobileSettingsButton);
                this._mobilePatternButton.appendChild(this._mobileEditMenuIcon);
                this._mobileTrackButton.appendChild(this._mobileTrackMenuIcon);
                this._mobileSettingsButton.appendChild(this._mobileSettingsMenuIcon);
                this._patternEditor.container.style.width = "";
                this._patternEditor.container.style.flexShrink = "";
                this._patternEditorPrev.container.style.display = "none";
                this._patternEditorNext.container.style.display = "none";
                this._undoButton.style.display = "";
                this._redoButton.style.display = "";
                this._copyPatternButton.style.display = "";
                this._pastePatternButton.style.display = "";
                this._insertChannelButton.style.display = "";
                this._deleteChannelButton.style.display = "";
                this._selectAllButton.style.display = "";
                this._duplicateButton.style.display = "";
                this._loopBarButton.style.display = "";
                this._notesDownButton.style.display = "";
                this._notesUpButton.style.display = "";
                this._undoButton.style.top = prefs.showScrollBar ? "0px" : "0px";
                this._undoButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._redoButton.style.top = prefs.showScrollBar ? "30px" : "30px";
                this._redoButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._copyPatternButton.style.top = prefs.showScrollBar ? "60px" : "60px";
                this._copyPatternButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._pastePatternButton.style.top = prefs.showScrollBar ? "90px" : "90px";
                this._pastePatternButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._insertChannelButton.style.top = prefs.showScrollBar ? "120px" : "120px";
                this._insertChannelButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._deleteChannelButton.style.top = prefs.showScrollBar ? "150px" : "150px";
                this._deleteChannelButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._selectAllButton.style.top = prefs.showScrollBar ? "180px" : "180px";
                this._selectAllButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._duplicateButton.style.top = prefs.showScrollBar ? "210px" : "210px";
                this._duplicateButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._notesUpButton.style.top = prefs.showScrollBar ? "240px" : "240px";
                this._notesUpButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._notesDownButton.style.top = prefs.showScrollBar ? "270px" : "270px";
                this._notesDownButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._loopBarButton.style.top = prefs.showScrollBar ? "300px" : "300px";
                this._loopBarButton.style.left = prefs.showScrollBar ? "2px" : "2px";
                this._fullscreenButton.style.display = "none";
                this._zoomInButton.style.display = "none";
                this._zoomOutButton.style.display = "none";
                this._patternArea.style.paddingLeft = prefs.showScrollBar ? "32px" : "32px";
                beepboxEditorContainer.style.paddingTop = "0px";
            }
            this._patternEditor.render();
            const textOnIcon = ColorConfig.getComputed("--text-enabled-icon") !== "" ? ColorConfig.getComputed("--text-enabled-icon") : "✓ ";
            const textOffIcon = ColorConfig.getComputed("--text-disabled-icon") !== "" ? ColorConfig.getComputed("--text-disabled-icon") : "　";
            const optionCommands = [
                "Technical",
                (prefs.autoPlay ? textOnIcon : textOffIcon) + "Auto Play on Load",
                (prefs.autoFollow ? textOnIcon : textOffIcon) + "Auto Follow Playhead",
                (prefs.enableNotePreview ? textOnIcon : textOffIcon) + "Hear Added Notes",
                (prefs.notesOutsideScale ? textOnIcon : textOffIcon) + "Place Notes Out of Scale",
                (prefs.defaultScale == this._doc.song.scale ? textOnIcon : textOffIcon) + "Set Current Scale as Default",
                (prefs.alwaysFineNoteVol ? textOnIcon : textOffIcon) + "Always Fine Note Volume",
                (prefs.enableChannelMuting ? textOnIcon : textOffIcon) + "Enable Channel Muting",
                (prefs.instrumentCopyPaste ? textOnIcon : textOffIcon) + "Enable Copy/Paste Buttons",
                (prefs.instrumentImportExport ? textOnIcon : textOffIcon) + "Enable Import/Export Buttons",
                (prefs.displayBrowserUrl ? textOnIcon : textOffIcon) + "Enable Song Data in URL",
                (prefs.closePromptByClickoff ? textOnIcon : textOffIcon) + "Close Prompts on Click Off",
                (prefs.oldMobileLayout ? textOnIcon : textOffIcon) + "Use the Old mobile layout (Reload)",
                (prefs.instrumentSettingsSimplifier ? textOnIcon : textOffIcon) + "Use Instrument Setting Tabs",
                (prefs.promptSongDetails ? textOnIcon : textOffIcon) + "Prompt Song Details on Load",
                "> Note Recording",
                "Appearance",
                (prefs.showThird ? textOnIcon : textOffIcon) + 'Highlight "Third" Note (SandBox)',
                (prefs.showFifth ? textOnIcon : textOffIcon) + 'Highlight "Fifth" Note',
                (prefs.advancedColorScheme ? textOnIcon : textOffIcon) + 'Advanced Color Scheme (ModBox)',
                (prefs.notesFlashWhenPlayed ? textOnIcon : textOffIcon) + "Notes Flash When Played (DB2)",
                (prefs.showChannels ? textOnIcon : textOffIcon) + "Show All Channels",
                (prefs.showScrollBar ? textOnIcon : textOffIcon) + "Show Octave Scroll Bar",
                (prefs.showLetters ? textOnIcon : textOffIcon) + "Show Piano Keys",
                (prefs.displayVolumeBar ? textOnIcon : textOffIcon) + "Show Playback Volume",
                (prefs.showOscilloscope ? textOnIcon : textOffIcon) + "Show Oscilloscope",
                (prefs.showSampleLoadingStatus ? textOnIcon : textOffIcon) + "Show Sample Loading Status",
                (prefs.showDescription ? textOnIcon : textOffIcon) + "Show Description",
                (prefs.frostedGlassBackground ? textOnIcon : textOffIcon) + "Use Frosted Glass Prompt Backdrop",
                (prefs.displayShortcutButtons ? textOnIcon : textOffIcon) + "Display Mobile Shortcut Buttons",
                (prefs.oldModNotes ? textOnIcon : textOffIcon) + "Use Old Mod Notes",
                (prefs.selectionCounter ? textOnIcon : textOffIcon) + "Selection Counter",
                "> Set Layout",
                "> Set Theme",
                "> Set Font",
                "> Custom Theme",
            ];
            const technicalOptionGroup = this._optionsMenu.children[1];
            for (let i = 0; i < technicalOptionGroup.children.length; i++) {
                const option = technicalOptionGroup.children[i];
                if (option.textContent != optionCommands[i + 1])
                    option.textContent = optionCommands[i + 1];
            }
            const appearanceOptionGroup = this._optionsMenu.children[2];
            for (let i = 0; i < appearanceOptionGroup.children.length; i++) {
                const option = appearanceOptionGroup.children[i];
                if (option.textContent != optionCommands[i + (technicalOptionGroup.children.length + 2)])
                    option.textContent = optionCommands[i + (technicalOptionGroup.children.length + 2)];
            }
            const channel = this._doc.song.channels[this._doc.channel];
            const instrumentIndex = this._doc.getCurrentInstrument();
            const instrument = channel.instruments[instrumentIndex];
            const wasActive = this.mainLayer.contains(document.activeElement);
            const activeElement = document.activeElement;
            const colors = ColorConfig.getChannelColor(this._doc.song, this._doc.channel);
            for (let i = this._effectsSelect.childElementCount - 1; i < Config.effectOrder.length; i++) {
                this._effectsSelect.appendChild(option({ value: i }));
            }
            this._effectsSelect.selectedIndex = -1;
            for (let i = 0; i < Config.effectOrder.length; i++) {
                let effectFlag = Config.effectOrder[i];
                const selected = ((instrument.effects & (1 << effectFlag)) != 0);
                const label = (selected ? textOnIcon : textOffIcon) + Config.effectNames[effectFlag];
                const option = this._effectsSelect.children[i + 1];
                if (option.textContent != label)
                    option.textContent = label;
            }
            setSelectedValue(this._scaleSelect, this._doc.song.scale);
            this._scaleSelect.title = Config.scales[this._doc.song.scale].realName;
            setSelectedValue(this._keySelect, Config.keys.length - 1 - this._doc.song.key);
            this._octaveStepper.value = Math.round(this._doc.song.octave).toString();
            this._tempoSlider.updateValue(Math.max(0, Math.round(this._doc.song.tempo)));
            this._tempoStepper.value = Math.round(this._doc.song.tempo).toString();
            this._songTitleInputBox.updateValue(this._doc.song.title);
            this._eqFilterTypeRow.style.setProperty("--text-color-lit", colors.primaryNote);
            this._eqFilterTypeRow.style.setProperty("--text-color-dim", colors.secondaryNote);
            this._eqFilterTypeRow.style.setProperty("--background-color-lit", colors.primaryChannel);
            this._eqFilterTypeRow.style.setProperty("--background-color-dim", colors.secondaryChannel);
            if (instrument.eqFilterType) {
                this._eqFilterSimpleButton.classList.remove("deactivated");
                this._eqFilterAdvancedButton.classList.add("deactivated");
                this._eqFilterRow.style.display = "none";
                this._eqFilterSimpleCutRow.style.display = "";
                this._eqFilterSimplePeakRow.style.display = "";
            }
            else {
                this._eqFilterSimpleButton.classList.add("deactivated");
                this._eqFilterAdvancedButton.classList.remove("deactivated");
                this._eqFilterRow.style.display = "";
                this._eqFilterSimpleCutRow.style.display = "none";
                this._eqFilterSimplePeakRow.style.display = "none";
            }
            setSelectedValue(this._rhythmSelect, this._doc.song.rhythm);
            if (!this._doc.song.getChannelIsMod(this._doc.channel)) {
                this._customInstrumentSettingsGroup.style.display = "";
                this._panSliderRow.style.display = "";
                this._panDropdownGroup.style.display = (this._openPanDropdown ? "" : "none");
                this._detuneSliderRow.style.display = "";
                this._instrumentVolumeSliderRow.style.display = "";
                this._instrumentTypeSelectRow.style.setProperty("display", "");
                this._instrumentSettingsGroup.insertBefore(this._instrumentExportGroup, this._instrumentSettingsGroup.firstChild);
                this._instrumentSettingsGroup.insertBefore(this._instrumentCopyGroup, this._instrumentSettingsGroup.firstChild);
                this._instrumentSettingsGroup.insertBefore(this._instrumentsButtonRow, this._instrumentSettingsGroup.firstChild);
                this._instrumentSettingsGroup.insertBefore(this._instrumentSettingsTextRow, this._instrumentSettingsGroup.firstChild);
                if (this._doc.song.channels[this._doc.channel].name == "") {
                    this._instrumentSettingsTextRow.textContent = "Instrument Settings";
                }
                else {
                    this._instrumentSettingsTextRow.textContent = this._doc.song.channels[this._doc.channel].name;
                }
                this._modulatorGroup.style.display = "none";
                this._usageCheck(this._doc.channel, instrumentIndex);
                if (this._doc.song.getChannelIsNoise(this._doc.channel)) {
                    this._pitchedPresetSelect.style.display = "none";
                    this._drumPresetSelect.style.display = "";
                    $("#pitchPresetSelect").parent().hide();
                    $("#drumPresetSelect").parent().show();
                    setSelectedValue(this._drumPresetSelect, instrument.preset, true);
                }
                else {
                    this._pitchedPresetSelect.style.display = "";
                    this._drumPresetSelect.style.display = "none";
                    $("#pitchPresetSelect").parent().show();
                    $("#drumPresetSelect").parent().hide();
                    setSelectedValue(this._pitchedPresetSelect, instrument.preset, true);
                }
                if (instrument.type == 2) {
                    this._chipWaveSelectRow.style.display = "none";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                    this._chipWaveLoopModeSelectRow.style.display = "none";
                    this._chipWaveLoopStartRow.style.display = "none";
                    this._chipWaveLoopEndRow.style.display = "none";
                    this._chipWaveStartOffsetRow.style.display = "none";
                    this._chipWavePlayBackwardsRow.style.display = "none";
                    this._chipNoiseSelectRow.style.display = "";
                    setSelectedValue(this._chipNoiseSelect, instrument.chipNoise, true);
                }
                else {
                    this._chipNoiseSelectRow.style.display = "none";
                }
                if (instrument.type == 3) {
                    this._chipWaveSelectRow.style.display = "none";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                    this._chipWaveLoopModeSelectRow.style.display = "none";
                    this._chipWaveLoopStartRow.style.display = "none";
                    this._chipWaveLoopEndRow.style.display = "none";
                    this._chipWaveStartOffsetRow.style.display = "none";
                    this._chipWavePlayBackwardsRow.style.display = "none";
                    this._spectrumRow.style.display = "";
                    this._spectrumEditor.render();
                }
                else {
                    this._spectrumRow.style.display = "none";
                }
                if (instrument.type == 5 || instrument.type == 7) {
                    this._chipWaveSelectRow.style.display = "none";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                    this._chipWaveLoopModeSelectRow.style.display = "none";
                    this._chipWaveLoopStartRow.style.display = "none";
                    this._chipWaveLoopEndRow.style.display = "none";
                    this._chipWaveStartOffsetRow.style.display = "none";
                    this._chipWavePlayBackwardsRow.style.display = "none";
                    this._harmonicsRow.style.display = "";
                    this._harmonicsEditor.render();
                }
                else {
                    this._harmonicsRow.style.display = "none";
                }
                if (instrument.type == 7) {
                    this._chipWaveSelectRow.style.display = "none";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                    this._chipWaveLoopModeSelectRow.style.display = "none";
                    this._chipWaveLoopStartRow.style.display = "none";
                    this._chipWaveLoopEndRow.style.display = "none";
                    this._chipWaveStartOffsetRow.style.display = "none";
                    this._chipWavePlayBackwardsRow.style.display = "none";
                    this._stringSustainRow.style.display = "";
                    this._stringSustainSlider.updateValue(instrument.stringSustain);
                    this._stringSustainLabel.textContent = Config.enableAcousticSustain ? "Sustain (" + Config.sustainTypeNames[instrument.stringSustainType].substring(0, 1).toUpperCase() + "):" : "Sustain:";
                }
                else {
                    this._stringSustainRow.style.display = "none";
                }
                if (instrument.type == 4) {
                    this._drumsetGroup.style.display = "";
                    this._chipWaveSelectRow.style.display = "none";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                    this._chipWaveLoopModeSelectRow.style.display = "none";
                    this._chipWaveLoopStartRow.style.display = "none";
                    this._chipWaveLoopEndRow.style.display = "none";
                    this._chipWaveStartOffsetRow.style.display = "none";
                    this._chipWavePlayBackwardsRow.style.display = "none";
                    this._fadeInOutRow.style.display = "none";
                    for (let i = 0; i < Config.drumCount; i++) {
                        setSelectedValue(this._drumsetEnvelopeSelects[i], instrument.drumsetEnvelopes[i]);
                        this._drumsetSpectrumEditors[i].render();
                    }
                }
                else {
                    this._drumsetGroup.style.display = "none";
                    this._fadeInOutRow.style.display = "";
                    this._fadeInOutEditor.render();
                }
                if (instrument.type == 0) {
                    this._chipWaveSelectRow.style.display = "";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "";
                    if (instrument.isUsingAdvancedLoopControls) {
                        this._chipWaveLoopModeSelectRow.style.display = "";
                        this._chipWaveLoopStartRow.style.display = "";
                        this._chipWaveLoopEndRow.style.display = "";
                        this._chipWaveStartOffsetRow.style.display = "";
                        this._chipWavePlayBackwardsRow.style.display = "";
                    }
                    else {
                        this._chipWaveLoopModeSelectRow.style.display = "none";
                        this._chipWaveLoopStartRow.style.display = "none";
                        this._chipWaveLoopEndRow.style.display = "none";
                        this._chipWaveStartOffsetRow.style.display = "none";
                        this._chipWavePlayBackwardsRow.style.display = "none";
                    }
                    setSelectedValue(this._chipWaveSelect, instrument.chipWave);
                    this._useChipWaveAdvancedLoopControlsBox.checked = instrument.isUsingAdvancedLoopControls ? true : false;
                    setSelectedValue(this._chipWaveLoopModeSelect, instrument.chipWaveLoopMode);
                    this._chipWaveLoopStartStepper.value = instrument.chipWaveLoopStart + "";
                    this._chipWaveLoopEndStepper.value = instrument.chipWaveLoopEnd + "";
                    this._chipWaveStartOffsetStepper.value = instrument.chipWaveStartOffset + "";
                    this._chipWavePlayBackwardsBox.checked = instrument.chipWavePlayBackwards ? true : false;
                }
                if (instrument.type == 9) {
                    this._customWaveDraw.style.display = "";
                    this._chipWaveSelectRow.style.display = "none";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                    this._chipWaveLoopModeSelectRow.style.display = "none";
                    this._chipWaveLoopStartRow.style.display = "none";
                    this._chipWaveLoopEndRow.style.display = "none";
                    this._chipWaveStartOffsetRow.style.display = "none";
                    this._chipWavePlayBackwardsRow.style.display = "none";
                }
                else {
                    this._customWaveDraw.style.display = "none";
                }
                if (instrument.type == 8) {
                    this._supersawDynamismRow.style.display = "";
                    this._supersawSpreadRow.style.display = "";
                    this._supersawShapeRow.style.display = "";
                    this._supersawDynamismSlider.updateValue(instrument.supersawDynamism);
                    this._supersawSpreadSlider.updateValue(instrument.supersawSpread);
                    this._supersawShapeSlider.updateValue(instrument.supersawShape);
                }
                else {
                    this._supersawDynamismRow.style.display = "none";
                    this._supersawSpreadRow.style.display = "none";
                    this._supersawShapeRow.style.display = "none";
                }
                if (instrument.type == 6 || instrument.type == 8) {
                    this._chipWaveSelectRow.style.display = "none";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                    this._chipWaveLoopModeSelectRow.style.display = "none";
                    this._chipWaveLoopStartRow.style.display = "none";
                    this._chipWaveLoopEndRow.style.display = "none";
                    this._chipWaveStartOffsetRow.style.display = "none";
                    this._chipWavePlayBackwardsRow.style.display = "none";
                    this._pulseWidthRow.style.display = "";
                    this._pulseWidthSlider.input.title = prettyNumber(instrument.pulseWidth) + "%";
                    this._pulseWidthSlider.updateValue(instrument.pulseWidth);
                    this._decimalOffsetSlider.input.title = instrument.decimalOffset / 100 <= 0 ? "none" : "-" + prettyNumber(instrument.decimalOffset / 100) + "%";
                    this._decimalOffsetSlider.updateValue(99 - instrument.decimalOffset);
                    this._pulseWidthDropdownGroup.style.display = (this._openPulseWidthDropdown ? "" : "none");
                }
                else {
                    this._pulseWidthRow.style.display = "none";
                    this._pulseWidthDropdownGroup.style.display = "none";
                }
                if (instrument.type == 1 || instrument.type == 11) {
                    this._phaseModGroup.style.display = "";
                    this._feedbackRow2.style.display = "";
                    this._chipWaveSelectRow.style.display = "none";
                    this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                    this._chipWaveLoopModeSelectRow.style.display = "none";
                    this._chipWaveLoopStartRow.style.display = "none";
                    this._chipWaveLoopEndRow.style.display = "none";
                    this._chipWaveStartOffsetRow.style.display = "none";
                    this._chipWavePlayBackwardsRow.style.display = "none";
                    setSelectedValue(this._algorithmSelect, instrument.algorithm);
                    setSelectedValue(this._feedbackTypeSelect, instrument.feedbackType);
                    this._feedbackAmplitudeSlider.updateValue(instrument.feedbackAmplitude);
                    for (let i = 0; i < Config.operatorCount + (instrument.type == 11 ? 2 : 0); i++) {
                        const isCarrier = instrument.type == 1 ? (i < Config.algorithms[instrument.algorithm].carrierCount) : (i < instrument.customAlgorithm.carrierCount);
                        this._operatorRows[i].style.color = isCarrier ? ColorConfig.primaryText : "";
                        setSelectedValue(this._operatorFrequencySelects[i], instrument.operators[i].frequency);
                        this._operatorAmplitudeSliders[i].updateValue(instrument.operators[i].amplitude);
                        setSelectedValue(this._operatorWaveformSelects[i], instrument.operators[i].waveform);
                        this._operatorWaveformPulsewidthSliders[i].updateValue(instrument.operators[i].pulseWidth);
                        this._operatorWaveformPulsewidthSliders[i].input.title = "" + Config.pwmOperatorWaves[instrument.operators[i].pulseWidth].name;
                        this._operatorDropdownGroups[i].style.color = isCarrier ? ColorConfig.primaryText : "";
                        const operatorName = (isCarrier ? "Voice " : "Modulator ") + (i + 1);
                        this._operatorFrequencySelects[i].title = operatorName + " Frequency";
                        this._operatorAmplitudeSliders[i].input.title = operatorName + (isCarrier ? " Volume" : " Amplitude");
                        this._operatorDropdownGroups[i].style.display = (this._openOperatorDropdowns[i] ? "" : "none");
                        if (instrument.operators[i].waveform == 2) {
                            this._operatorWaveformPulsewidthSliders[i].container.style.display = "";
                            this._operatorWaveformHints[i].style.display = "none";
                        }
                        else {
                            this._operatorWaveformPulsewidthSliders[i].container.style.display = "none";
                            this._operatorWaveformHints[i].style.display = "";
                        }
                    }
                    if (instrument.type == 11) {
                        setSelectedValue(this._algorithm6OpSelect, instrument.algorithm6Op);
                        setSelectedValue(this._feedback6OpTypeSelect, instrument.feedbackType6Op);
                        this._customAlgorithmCanvas.redrawCanvas();
                        this._algorithm6OpSelectRow.style.display = "";
                        this._feedback6OpRow1.style.display = "";
                        this._operatorRows[4].style.display = "";
                        this._operatorRows[5].style.display = "";
                        this._operatorDropdownGroups[4].style.display = (this._openOperatorDropdowns[4] ? "" : "none");
                        this._operatorDropdownGroups[5].style.display = (this._openOperatorDropdowns[5] ? "" : "none");
                        this._algorithmSelectRow.style.display = "none";
                        this._feedbackRow1.style.display = "none";
                    }
                    else {
                        this._algorithm6OpSelectRow.style.display = "none";
                        this._feedback6OpRow1.style.display = "none";
                        this._operatorRows[4].style.display = "none";
                        this._operatorRows[5].style.display = "none";
                        this._operatorDropdownGroups[4].style.display = "none";
                        this._operatorDropdownGroups[5].style.display = "none";
                        this._feedbackRow1.style.display = "";
                        this._algorithmSelectRow.style.display = "";
                    }
                }
                else {
                    this._algorithm6OpSelectRow.style.display = "none";
                    this._feedback6OpRow1.style.display = "none";
                    this._algorithmSelectRow.style.display = "none";
                    this._phaseModGroup.style.display = "none";
                    this._feedbackRow1.style.display = "none";
                    this._feedbackRow2.style.display = "none";
                }
                this._pulseWidthSlider.input.title = prettyNumber(instrument.pulseWidth) + "%";
                if (effectsIncludeTransition(instrument.effects)) {
                    this._transitionRow.style.display = "";
                    if (this._openTransitionDropdown)
                        this._transitionDropdownGroup.style.display = "";
                    setSelectedValue(this._transitionSelect, instrument.transition);
                    this._slideSpeedRow.style.display = (Config.transitions[instrument.transition].slides == true) ? "" : "none";
                    this._slideSpeedSlider.input.title = "x" + prettyNumber(49 - instrument.slideTicks);
                    this._slideSpeedDisplay.textContent = "x" + prettyNumber(49 - instrument.slideTicks);
                    this._slideSpeedSlider.updateValue(instrument.slideTicks);
                }
                else {
                    this._transitionDropdownGroup.style.display = "none";
                    this._transitionRow.style.display = "none";
                }
                if (effectsIncludeChord(instrument.effects)) {
                    this._chordSelectRow.style.display = "";
                    this._chordDropdown.style.display = (instrument.chord == Config.chords.dictionary["arpeggio"].index) || (instrument.chord == Config.chords.dictionary["strum"].index) ? "" : "none";
                    this._chordDropdownGroup.style.display = (((instrument.chord == Config.chords.dictionary["arpeggio"].index) || (instrument.chord == Config.chords.dictionary["strum"].index)) && this._openChordDropdown) ? "" : "none";
                    setSelectedValue(this._chordSelect, instrument.chord);
                    this._twoNoteArpRow.style.display = instrument.chord == Config.chords.dictionary["arpeggio"].index ? "" : "none";
                    this._arpeggioSpeedRow.style.display = instrument.chord == Config.chords.dictionary["arpeggio"].index ? "" : "none";
                    this._strumSpeedRow.style.display = instrument.chord == Config.chords.dictionary["strum"].index ? "" : "none";
                }
                else {
                    this._chordSelectRow.style.display = "none";
                    this._chordDropdown.style.display = "none";
                    this._chordDropdownGroup.style.display = "none";
                }
                if (effectsIncludePitchShift(instrument.effects)) {
                    this._pitchShiftRow.style.display = "";
                    this._pitchShiftSlider.updateValue(instrument.pitchShift);
                    this._pitchShiftSlider.input.title = (instrument.pitchShift - Config.pitchShiftCenter) + " semitone(s)";
                    for (const marker of this._pitchShiftFifthMarkers) {
                        marker.style.display = prefs.showFifth ? "" : "none";
                    }
                }
                else {
                    this._pitchShiftRow.style.display = "none";
                }
                if (effectsIncludeDetune(instrument.effects)) {
                    this._detuneSliderRow.style.display = "";
                    this._detuneSlider.updateValue(instrument.detune - Config.detuneCenter);
                    this._detuneSlider.input.title = (Synth.detuneToCents(instrument.detune)) + " cent(s)";
                }
                else {
                    this._detuneSliderRow.style.display = "none";
                }
                if (effectsIncludeVibrato(instrument.effects)) {
                    this._vibratoSelectRow.style.display = "";
                    if (this._openVibratoDropdown)
                        this._vibratoDropdownGroup.style.display = "";
                    setSelectedValue(this._vibratoSelect, instrument.vibrato);
                }
                else {
                    this._vibratoDropdownGroup.style.display = "none";
                    this._vibratoSelectRow.style.display = "none";
                }
                if (effectsIncludeNoteFilter(instrument.effects)) {
                    this._noteFilterTypeRow.style.setProperty("--text-color-lit", colors.primaryNote);
                    this._noteFilterTypeRow.style.setProperty("--text-color-dim", colors.secondaryNote);
                    this._noteFilterTypeRow.style.setProperty("--background-color-lit", colors.primaryChannel);
                    this._noteFilterTypeRow.style.setProperty("--background-color-dim", colors.secondaryChannel);
                    this._noteFilterTypeRow.style.display = "";
                    if (this._doc.synth.isFilterModActive(true, this._doc.channel, this._doc.getCurrentInstrument())) {
                        this._noteFilterEditor.render(true, this._ctrlHeld || this._shiftHeld);
                    }
                    else {
                        this._noteFilterEditor.render();
                    }
                    if (instrument.noteFilterType) {
                        this._noteFilterSimpleButton.classList.remove("deactivated");
                        this._noteFilterAdvancedButton.classList.add("deactivated");
                        this._noteFilterRow.style.display = "none";
                        this._noteFilterSimpleCutRow.style.display = "";
                        this._noteFilterSimplePeakRow.style.display = "";
                    }
                    else {
                        this._noteFilterSimpleButton.classList.add("deactivated");
                        this._noteFilterAdvancedButton.classList.remove("deactivated");
                        this._noteFilterRow.style.display = "";
                        this._noteFilterSimpleCutRow.style.display = "none";
                        this._noteFilterSimplePeakRow.style.display = "none";
                    }
                }
                else {
                    this._noteFilterRow.style.display = "none";
                    this._noteFilterSimpleCutRow.style.display = "none";
                    this._noteFilterSimplePeakRow.style.display = "none";
                    this._noteFilterTypeRow.style.display = "none";
                }
                if (this._doc.prefs.instrumentSettingsSimplifier) {
                    const colors = ColorConfig.getChannelColor(this._doc.song, this._doc.channel);
                    this._instOptionsDiv.style.setProperty("--text-color-lit", colors.primaryNote);
                    this._instOptionsDiv.style.setProperty("--text-color-dim", colors.secondaryNote);
                    this._instOptionsDiv.style.setProperty("--background-color-lit", colors.primaryChannel);
                    this._instOptionsDiv.style.setProperty("--background-color-dim", colors.secondaryChannel);
                    this._instrumentDiv.style.display = (this._instSettingMode == 1) ? "" : "none";
                    this._effectDiv.style.display = (this._instSettingMode == 2) ? "" : "none";
                    this._envelopeDiv.style.display = (this._instSettingMode == 3) ? "" : "none";
                    this._mobileInstSettingsButton.style.color = (this._instSettingMode == 1) ? "var(--text-color-lit)" : "var(--text-color-dim)";
                    this._mobileEffectsButton.style.color = (this._instSettingMode == 2) ? "var(--text-color-lit)" : "var(--text-color-dim)";
                    this._mobileEnvelopesButton.style.color = (this._instSettingMode == 3) ? "var(--text-color-lit)" : "var(--text-color-dim)";
                    this._mobileInstSettingsButton.style.background = (this._instSettingMode == 1) ? "" : "#fff0";
                    this._mobileEffectsButton.style.background = (this._instSettingMode == 2) ? "" : "#fff0";
                    this._mobileEnvelopesButton.style.background = (this._instSettingMode == 3) ? "" : "#fff0";
                    this._instSettingMode == 1 ? this._mobileInstSettingsButton.classList.remove("deactivated") : this._mobileInstSettingsButton.classList.add("deactivated");
                    this._instSettingMode == 2 ? this._mobileEffectsButton.classList.remove("deactivated") : this._mobileEffectsButton.classList.add("deactivated");
                    this._instSettingMode == 3 ? this._mobileEnvelopesButton.classList.remove("deactivated") : this._mobileEnvelopesButton.classList.add("deactivated");
                    this._loopBarButton.style.display = prefs.displayShortcutButtons ? "" : "none";
                    this._instOptionsDiv.style.display = "";
                }
                else {
                    this._instrumentDiv.style.display = "";
                    this._effectDiv.style.display = "";
                    this._envelopeDiv.style.display = "";
                    this._instOptionsDiv.style.display = "none";
                }
                if (effectsIncludeDistortion(instrument.effects)) {
                    this._distortionRow.style.display = "";
                    if (instrument.type == 0 || instrument.type == 9 || instrument.type == 6 || instrument.type == 8)
                        this._aliasingRow.style.display = "";
                    else
                        this._aliasingRow.style.display = "none";
                    this._distortionSlider.updateValue(instrument.distortion);
                }
                else {
                    this._distortionRow.style.display = "none";
                    this._aliasingRow.style.display = "none";
                }
                if (effectsIncludeInvertWave(instrument.effects)) {
                    this._invertWaveRow.style.display = "";
                }
                else {
                    this._invertWaveRow.style.display = "none";
                }
                if (effectsIncludeBitcrusher(instrument.effects)) {
                    this._bitcrusherQuantizationRow.style.display = "";
                    this._bitcrusherFreqRow.style.display = "";
                    this._bitcrusherQuantizationSlider.updateValue(instrument.bitcrusherQuantization);
                    this._bitcrusherFreqSlider.updateValue(instrument.bitcrusherFreq);
                }
                else {
                    this._bitcrusherQuantizationRow.style.display = "none";
                    this._bitcrusherFreqRow.style.display = "none";
                }
                if (effectsIncludePanning(instrument.effects)) {
                    this._panSliderRow.style.display = "";
                    if (this._openPanDropdown)
                        this._panDropdownGroup.style.display = "";
                    this._panSlider.updateValue(instrument.pan);
                }
                else {
                    this._panSliderRow.style.display = "none";
                    this._panDropdownGroup.style.display = "none";
                }
                if (effectsIncludeChorus(instrument.effects)) {
                    this._chorusRow.style.display = "";
                    this._chorusSlider.updateValue(instrument.chorus);
                }
                else {
                    this._chorusRow.style.display = "none";
                }
                if (effectsIncludeEcho(instrument.effects)) {
                    this._echoSustainRow.style.display = "";
                    this._echoSustainSlider.updateValue(instrument.echoSustain);
                    this._echoDelayRow.style.display = "";
                    this._echoDelaySlider.updateValue(instrument.echoDelay);
                    this._echoDelaySlider.input.title = (Math.round((instrument.echoDelay + 1) * Config.echoDelayStepTicks / (Config.ticksPerPart * Config.partsPerBeat) * 1000) / 1000) + " beat(s)";
                }
                else {
                    this._echoSustainRow.style.display = "none";
                    this._echoDelayRow.style.display = "none";
                }
                if (effectsIncludeReverb(instrument.effects)) {
                    this._reverbRow.style.display = "";
                    this._reverbSlider.updateValue(instrument.reverb);
                }
                else {
                    this._reverbRow.style.display = "none";
                }
                if (effectsIncludeRM(instrument.effects)) {
                    this._ringModContainerRow.style.display = "";
                    this._ringModSlider.updateValue(instrument.ringModulation);
                    this._ringModHzSlider.updateValue(instrument.ringModulationHz);
                    this._rmHzOffsetSlider.updateValue(instrument.rmHzOffset - Config.rmHzOffsetCenter);
                    setSelectedValue(this._ringModWaveSelect, instrument.rmWaveformIndex);
                    this._ringModPulsewidthSlider.updateValue(instrument.rmPulseWidth);
                }
                else {
                    this._ringModContainerRow.style.display = "none";
                }
                if (effectsIncludePhaser(instrument.effects)) {
                    this._phaserMixRow.style.display = "";
                    this._phaserMixSlider.updateValue(instrument.phaserMix);
                    this._phaserFreqRow.style.display = "";
                    this._phaserFreqSlider.updateValue(instrument.phaserFreq);
                    this._phaserFeedbackRow.style.display = "";
                    this._phaserFeedbackSlider.updateValue(instrument.phaserFeedback);
                    this._phaserStagesRow.style.display = "";
                    this._phaserStagesSlider.updateValue(instrument.phaserStages);
                }
                else {
                    this._phaserMixRow.style.display = "none";
                    this._phaserFreqRow.style.display = "none";
                    this._phaserFeedbackRow.style.display = "none";
                    this._phaserStagesRow.style.display = "none";
                }
                if (effectsIncludeNoteRange(instrument.effects)) {
                    this._upperNoteLimitRow.style.display = "";
                    this._lowerNoteLimitRow.style.display = "";
                    this._upperNoteLimitInputBox.value = String(instrument.upperNoteLimit);
                    this._lowerNoteLimitInputBox.value = String(instrument.lowerNoteLimit);
                }
                else {
                    this._upperNoteLimitRow.style.display = "none";
                    this._lowerNoteLimitRow.style.display = "none";
                }
                if (effectsIncludeGranular(instrument.effects)) {
                    this._granularContainerRow.style.display = "";
                    this._granularSlider.updateValue(instrument.granular);
                    this._grainSizeSlider.updateValue(instrument.grainSize);
                    this._grainAmountsSlider.updateValue(instrument.grainAmounts);
                    this._grainRangeSlider.updateValue(instrument.grainRange);
                }
                else {
                    this._granularContainerRow.style.display = "none";
                }
                if (instrument.type == 0 || instrument.type == 9 || instrument.type == 5 || instrument.type == 7 || instrument.type == 3 || instrument.type == 6 || instrument.type == 2) {
                    this._unisonSelectRow.style.display = "";
                    setSelectedValue(this._unisonSelect, instrument.unison);
                    this._unisonVoicesInputBox.value = instrument.unisonVoices + "";
                    this._unisonSpreadInputBox.value = instrument.unisonSpread + "";
                    this._unisonOffsetInputBox.value = instrument.unisonOffset + "";
                    this._unisonExpressionInputBox.value = instrument.unisonExpression + "";
                    this._unisonSignInputBox.value = instrument.unisonSign + "";
                    this._unisonBuzzesBox.checked = instrument.unisonBuzzes ? true : false;
                    this._unisonBuzzesBoxRow.style.display = (instrument.unison == Config.unisons.length ? "" : "none");
                    this._unisonDropdownGroup.style.display = (this._openUnisonDropdown ? "" : "none");
                }
                else {
                    this._unisonSelectRow.style.display = "none";
                    this._unisonDropdownGroup.style.display = "none";
                }
                if (this._openEnvelopeDropdown)
                    this._envelopeDropdownGroup.style.display = "";
                else
                    this._envelopeDropdownGroup.style.display = "none";
                this._envelopeEditor.render();
                for (let chordIndex = 0; chordIndex < Config.chords.length; chordIndex++) {
                    let hidden = (!Config.instrumentTypeHasSpecialInterval[instrument.type] && Config.chords[chordIndex].customInterval);
                    const option = this._chordSelect.children[chordIndex];
                    if (hidden) {
                        if (!option.hasAttribute("hidden")) {
                            option.setAttribute("hidden", "");
                        }
                    }
                    else {
                        option.removeAttribute("hidden");
                    }
                }
                this._instrumentSettingsGroup.style.color = ColorConfig.getChannelColor(this._doc.song, this._doc.channel).primaryNote;
                setSelectedValue(this._transitionSelect, instrument.transition);
                setSelectedValue(this._vibratoSelect, instrument.vibrato);
                setSelectedValue(this._vibratoTypeSelect, instrument.vibratoType);
                setSelectedValue(this._chordSelect, instrument.chord);
                this._panSliderInputBox.value = instrument.pan + "";
                this._pwmSliderInputBox.value = instrument.pulseWidth + "";
                this._detuneSliderInputBox.value = (instrument.detune - Config.detuneCenter) + "";
                this._rmHzOffsetSliderInputBox.value = (instrument.rmHzOffset - Config.rmHzOffsetCenter) + "";
                this._ringModHzNum.innerHTML = (clamp(1, 4600, Math.floor(20 * Math.pow(4400 / 20, Math.min(1.0, instrument.ringModulationHz / (Config.ringModHzRange - 1)))) + (instrument.rmHzOffset - Config.rmHzOffsetCenter))) + " (" + (Math.floor(20 * Math.pow(4400 / 20, Math.min(1.0, instrument.ringModulationHz / (Config.ringModHzRange - 1))))) + ")";
                this._instrumentVolumeSlider.updateValue(instrument.volume);
                this._instrumentVolumeSliderInputBox.value = "" + (instrument.volume);
                this._vibratoDepthSlider.updateValue(Math.round(instrument.vibratoDepth * 25));
                this._vibratoDelaySlider.updateValue(Math.round(instrument.vibratoDelay));
                this._vibratoSpeedSlider.updateValue(instrument.vibratoSpeed);
                setSelectedValue(this._vibratoTypeSelect, instrument.vibratoType);
                this._arpeggioSpeedSlider.updateValue(instrument.arpeggioSpeed);
                this._strumSpeedSlider.updateValue(instrument.strumParts);
                this._panDelaySlider.updateValue(instrument.panDelay);
                this._vibratoDelaySlider.input.title = "" + Math.round(instrument.vibratoDelay);
                this._vibratoDepthSlider.input.title = "" + instrument.vibratoDepth;
                this._vibratoSpeedSlider.input.title = "x" + instrument.vibratoSpeed / 10;
                this._vibratoSpeedDisplay.textContent = "x" + instrument.vibratoSpeed / 10;
                this._panDelaySlider.input.title = "" + instrument.panDelay;
                this._arpeggioSpeedSlider.input.title = "x" + prettyNumber(Config.arpSpeedScale[instrument.arpeggioSpeed]);
                this._arpeggioSpeedDisplay.textContent = "x" + prettyNumber(Config.arpSpeedScale[instrument.arpeggioSpeed]);
                this._strumSpeedSlider.input.title = prettyNumber(instrument.strumParts / Config.partsPerBeat) + " beat(s)";
                this._strumSpeedDisplay.textContent = prettyNumber(instrument.strumParts / Config.partsPerBeat) + " beat(s)";
                this._eqFilterSimpleCutSlider.updateValue(instrument.eqFilterSimpleCut);
                this._eqFilterSimplePeakSlider.updateValue(instrument.eqFilterSimplePeak);
                this._noteFilterSimpleCutSlider.updateValue(instrument.noteFilterSimpleCut);
                this._noteFilterSimplePeakSlider.updateValue(instrument.noteFilterSimplePeak);
                this._envelopeSpeedSlider.updateValue(instrument.envelopeSpeed);
                this._envelopeSpeedSlider.input.title = "x" + prettyNumber(Config.arpSpeedScale[instrument.envelopeSpeed]);
                this._envelopeSpeedDisplay.textContent = "x" + prettyNumber(Config.arpSpeedScale[instrument.envelopeSpeed]);
                this._upperNoteLimitRow.firstChild.textContent = "Upper Note Limit [" + Piano.getPitchNameAlwaysOctave((instrument.upperNoteLimit + Config.keys[this._doc.song.key].basePitch) % Config.pitchesPerOctave, instrument.upperNoteLimit, this._doc.song.octave)
                    + "]:";
                this._lowerNoteLimitRow.firstChild.textContent = "Lower Note Limit [" + Piano.getPitchNameAlwaysOctave((instrument.lowerNoteLimit + Config.keys[this._doc.song.key].basePitch) % Config.pitchesPerOctave, instrument.lowerNoteLimit, this._doc.song.octave)
                    + "]:";
                if (instrument.type == 9) {
                    this._customWaveDrawCanvas.redrawCanvas();
                    if (this.prompt instanceof CustomChipPrompt) {
                        this.prompt.customChipCanvas.render();
                    }
                }
                this._renderInstrumentBar(channel, instrumentIndex, colors);
            }
            else {
                this._usageCheck(this._doc.channel, instrumentIndex);
                this._pitchedPresetSelect.style.display = "none";
                this._drumPresetSelect.style.display = "none";
                $("#pitchPresetSelect").parent().hide();
                $("#drumPresetSelect").parent().hide();
                this._modulatorGroup.insertBefore(this._instrumentExportGroup, this._modulatorGroup.firstChild);
                this._modulatorGroup.insertBefore(this._instrumentCopyGroup, this._modulatorGroup.firstChild);
                this._modulatorGroup.insertBefore(this._instrumentsButtonRow, this._modulatorGroup.firstChild);
                this._modulatorGroup.insertBefore(this._instrumentSettingsTextRow, this._modulatorGroup.firstChild);
                if (this._doc.song.channels[this._doc.channel].name == "") {
                    this._instrumentSettingsTextRow.textContent = "Modulator Settings";
                }
                else {
                    this._instrumentSettingsTextRow.textContent = this._doc.song.channels[this._doc.channel].name;
                }
                if (this._doc.prefs.instrumentSettingsSimplifier == true) {
                    this._instOptionsDiv.style.display = "none";
                }
                this._chipNoiseSelectRow.style.display = "none";
                this._chipWaveSelectRow.style.display = "none";
                this._useChipWaveAdvancedLoopControlsRow.style.display = "none";
                this._chipWaveLoopModeSelectRow.style.display = "none";
                this._chipWaveLoopStartRow.style.display = "none";
                this._chipWaveLoopEndRow.style.display = "none";
                this._chipWaveStartOffsetRow.style.display = "none";
                this._chipWavePlayBackwardsRow.style.display = "none";
                this._spectrumRow.style.display = "none";
                this._harmonicsRow.style.display = "none";
                this._transitionRow.style.display = "none";
                this._chordSelectRow.style.display = "none";
                this._chordDropdownGroup.style.display = "none";
                this._drumsetGroup.style.display = "none";
                this._customWaveDraw.style.display = "none";
                this._supersawDynamismRow.style.display = "none";
                this._supersawSpreadRow.style.display = "none";
                this._supersawShapeRow.style.display = "none";
                this._algorithmSelectRow.style.display = "none";
                this._phaseModGroup.style.display = "none";
                this._feedbackRow1.style.display = "none";
                this._feedbackRow2.style.display = "none";
                this._pulseWidthRow.style.display = "none";
                this._vibratoSelectRow.style.display = "none";
                this._vibratoDropdownGroup.style.display = "none";
                this._envelopeDropdownGroup.style.display = "none";
                this._detuneSliderRow.style.display = "none";
                this._panSliderRow.style.display = "none";
                this._panDropdownGroup.style.display = "none";
                this._pulseWidthDropdownGroup.style.display = "none";
                this._unisonDropdownGroup.style.display = "none";
                this._modulatorGroup.style.display = "";
                this._modulatorGroup.style.color = ColorConfig.getChannelColor(this._doc.song, this._doc.channel).primaryNote;
                for (let mod = 0; mod < Config.modCount; mod++) {
                    let instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                    let modChannel = Math.max(0, instrument.modChannels[mod]);
                    let modInstrument = instrument.modInstruments[mod];
                    if (modInstrument >= this._doc.song.channels[modChannel].instruments.length + 2 || (modInstrument > 0 && this._doc.song.channels[modChannel].instruments.length <= 1)) {
                        modInstrument = 0;
                        instrument.modInstruments[mod] = 0;
                    }
                    if (modChannel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                        instrument.modInstruments[mod] = 0;
                        instrument.modulators[mod] = 0;
                    }
                    if (this._doc.recalcChannelNames || (this._modChannelBoxes[mod].children.length != 2 + this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)) {
                        while (this._modChannelBoxes[mod].firstChild)
                            this._modChannelBoxes[mod].remove(0);
                        const channelList = [];
                        channelList.push("none");
                        channelList.push("song");
                        for (let i = 0; i < this._doc.song.pitchChannelCount; i++) {
                            if (this._doc.song.channels[i].name == "") {
                                channelList.push("pitch " + (i + 1));
                            }
                            else {
                                channelList.push(this._doc.song.channels[i].name);
                            }
                        }
                        for (let i = 0; i < this._doc.song.noiseChannelCount; i++) {
                            if (this._doc.song.channels[i + this._doc.song.pitchChannelCount].name == "") {
                                channelList.push("noise " + (i + 1));
                            }
                            else {
                                channelList.push(this._doc.song.channels[i + this._doc.song.pitchChannelCount].name);
                            }
                        }
                        buildOptions(this._modChannelBoxes[mod], channelList);
                    }
                    this._modChannelBoxes[mod].selectedIndex = instrument.modChannels[mod] + 2;
                    let channel = this._doc.song.channels[modChannel];
                    if (this._modInstrumentBoxes[mod].children.length != channel.instruments.length + 2) {
                        while (this._modInstrumentBoxes[mod].firstChild)
                            this._modInstrumentBoxes[mod].remove(0);
                        const instrumentList = [];
                        for (let i = 0; i < channel.instruments.length; i++) {
                            instrumentList.push("" + i + 1);
                        }
                        instrumentList.push("all");
                        instrumentList.push("active");
                        buildOptions(this._modInstrumentBoxes[mod], instrumentList);
                    }
                    if (channel.bars[this._doc.bar] > 0) {
                        let usedInstruments = channel.patterns[channel.bars[this._doc.bar] - 1].instruments;
                        for (let i = 0; i < channel.instruments.length; i++) {
                            if (usedInstruments.includes(i)) {
                                this._modInstrumentBoxes[mod].options[i].label = "🢒" + (i + 1);
                            }
                            else {
                                this._modInstrumentBoxes[mod].options[i].label = "" + (i + 1);
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < channel.instruments.length; i++) {
                            this._modInstrumentBoxes[mod].options[i].label = "" + (i + 1);
                        }
                    }
                    this._modInstrumentBoxes[mod].selectedIndex = instrument.modInstruments[mod];
                    if (instrument.modChannels[mod] != -2) {
                        while (this._modSetBoxes[mod].firstChild)
                            this._modSetBoxes[mod].remove(0);
                        const settingList = [];
                        const unusedSettingList = [];
                        settingList.push("none");
                        if (instrument.modChannels[mod] == -1) {
                            settingList.push("song volume");
                            settingList.push("tempo");
                            settingList.push("song reverb");
                            settingList.push("next bar");
                            settingList.push("song detune");
                            settingList.push("song bitcrush");
                            settingList.push("song freqcrush");
                            settingList.push("song panning");
                            settingList.push("song chorus");
                            settingList.push("song distortion");
                            settingList.push("song ring modulation");
                            settingList.push("song pitch shift");
                        }
                        else {
                            settingList.push("note volume");
                            settingList.push("mix volume");
                            let tgtInstrumentTypes = [];
                            let anyInstrumentAdvancedEQ = false, anyInstrumentSimpleEQ = false, anyInstrumentAdvancedNote = false, anyInstrumentSimpleNote = false, anyInstrumentArps = false, anyInstrumentPitchShifts = false, anyInstrumentDetunes = false, anyInstrumentVibratos = false, anyInstrumentNoteFilters = false, anyInstrumentDistorts = false, anyInstrumentBitcrushes = false, anyInstrumentPans = false, anyInstrumentChorus = false, anyInstrumentEchoes = false, anyInstrumentReverbs = false, anyInstrumentRMs = false, anyInstrumentPhasers = false, anyInstrumentGranulars = false, anyInstrumentHasEnvelopes = false;
                            let allInstrumentPitchShifts = true, allInstrumentNoteFilters = true, allInstrumentDetunes = true, allInstrumentVibratos = true, allInstrumentDistorts = true, allInstrumentBitcrushes = true, allInstrumentPans = true, allInstrumentChorus = true, allInstrumentEchoes = true, allInstrumentReverbs = true, anyInstrumentInvertWave = true, allInstrumentGranulars = true;
                            let instrumentCandidates = [];
                            if (modInstrument >= channel.instruments.length) {
                                for (let i = 0; i < channel.instruments.length; i++) {
                                    instrumentCandidates.push(i);
                                }
                            }
                            else {
                                instrumentCandidates.push(modInstrument);
                            }
                            for (let i = 0; i < instrumentCandidates.length; i++) {
                                let instrumentIndex = instrumentCandidates[i];
                                if (!tgtInstrumentTypes.includes(channel.instruments[instrumentIndex].type))
                                    tgtInstrumentTypes.push(channel.instruments[instrumentIndex].type);
                                if (channel.instruments[instrumentIndex].eqFilterType)
                                    anyInstrumentSimpleEQ = true;
                                else
                                    anyInstrumentAdvancedEQ = true;
                                if (effectsIncludeChord(channel.instruments[instrumentIndex].effects) && channel.instruments[instrumentIndex].getChord().arpeggiates) {
                                    anyInstrumentArps = true;
                                }
                                if (effectsIncludePitchShift(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentPitchShifts = true;
                                }
                                if (effectsIncludeDetune(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentDetunes = true;
                                }
                                else {
                                    allInstrumentDetunes = false;
                                }
                                if (effectsIncludeVibrato(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentVibratos = true;
                                }
                                else {
                                    allInstrumentVibratos = false;
                                }
                                if (effectsIncludeNoteFilter(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentNoteFilters = true;
                                    if (channel.instruments[instrumentIndex].noteFilterType)
                                        anyInstrumentSimpleNote = true;
                                    else
                                        anyInstrumentAdvancedNote = true;
                                }
                                else {
                                    allInstrumentNoteFilters = false;
                                }
                                if (effectsIncludeDistortion(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentDistorts = true;
                                }
                                else {
                                    allInstrumentDistorts = false;
                                }
                                if (effectsIncludeBitcrusher(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentBitcrushes = true;
                                }
                                else {
                                    allInstrumentBitcrushes = false;
                                }
                                if (effectsIncludePanning(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentPans = true;
                                }
                                else {
                                    allInstrumentPans = false;
                                }
                                if (effectsIncludeChorus(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentChorus = true;
                                }
                                else {
                                    allInstrumentChorus = false;
                                }
                                if (effectsIncludeEcho(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentEchoes = true;
                                }
                                else {
                                    allInstrumentEchoes = false;
                                }
                                if (effectsIncludeReverb(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentReverbs = true;
                                }
                                else {
                                    allInstrumentReverbs = false;
                                }
                                if (effectsIncludeRM(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentRMs = true;
                                }
                                else {
                                    anyInstrumentRMs = false;
                                }
                                if (effectsIncludePhaser(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentPhasers = true;
                                }
                                else {
                                    anyInstrumentPhasers = false;
                                }
                                if (effectsIncludeInvertWave(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentInvertWave = true;
                                }
                                else {
                                    anyInstrumentInvertWave = false;
                                }
                                if (effectsIncludeGranular(channel.instruments[instrumentIndex].effects)) {
                                    anyInstrumentGranulars = true;
                                }
                                else {
                                    allInstrumentGranulars = false;
                                }
                                if (channel.instruments[instrumentIndex].envelopes.length > 0) {
                                    anyInstrumentHasEnvelopes = true;
                                }
                            }
                            if (anyInstrumentAdvancedEQ) {
                                settingList.push("eq filter");
                            }
                            if (anyInstrumentSimpleEQ) {
                                settingList.push("eq filt cut");
                                settingList.push("eq filt peak");
                            }
                            if (tgtInstrumentTypes.includes(1)) {
                                settingList.push("fm slider 1");
                                settingList.push("fm slider 2");
                                settingList.push("fm slider 3");
                                settingList.push("fm slider 4");
                                settingList.push("fm feedback");
                            }
                            if (tgtInstrumentTypes.includes(11)) {
                                settingList.push("fm slider 1");
                                settingList.push("fm slider 2");
                                settingList.push("fm slider 3");
                                settingList.push("fm slider 4");
                                settingList.push("fm slider 5");
                                settingList.push("fm slider 6");
                                settingList.push("fm feedback");
                            }
                            if (tgtInstrumentTypes.includes(6) || tgtInstrumentTypes.includes(8)) {
                                settingList.push("pulse width");
                                settingList.push("decimal offset");
                            }
                            if (tgtInstrumentTypes.includes(8)) {
                                settingList.push("dynamism");
                                settingList.push("spread");
                                settingList.push("saw shape");
                            }
                            if (tgtInstrumentTypes.includes(7)) {
                                settingList.push("sustain");
                            }
                            if (anyInstrumentArps) {
                                settingList.push("arp speed");
                                settingList.push("reset arp");
                            }
                            if (anyInstrumentPitchShifts) {
                                settingList.push("pitch shift");
                            }
                            if (!allInstrumentPitchShifts) {
                                unusedSettingList.push("+ pitch shift");
                            }
                            if (anyInstrumentDetunes) {
                                settingList.push("detune");
                            }
                            if (!allInstrumentDetunes) {
                                unusedSettingList.push("+ detune");
                            }
                            if (anyInstrumentVibratos) {
                                settingList.push("vibrato depth");
                                settingList.push("vibrato speed");
                                settingList.push("vibrato delay");
                            }
                            if (!allInstrumentVibratos) {
                                unusedSettingList.push("+ vibrato depth");
                                unusedSettingList.push("+ vibrato speed");
                                unusedSettingList.push("+ vibrato delay");
                            }
                            if (anyInstrumentNoteFilters) {
                                if (anyInstrumentAdvancedNote) {
                                    settingList.push("note filter");
                                }
                                if (anyInstrumentSimpleNote) {
                                    settingList.push("note filt cut");
                                    settingList.push("note filt peak");
                                }
                            }
                            if (!allInstrumentNoteFilters) {
                                unusedSettingList.push("+ note filter");
                            }
                            if (anyInstrumentDistorts) {
                                settingList.push("distortion");
                            }
                            if (!allInstrumentDistorts) {
                                unusedSettingList.push("+ distortion");
                            }
                            if (anyInstrumentBitcrushes) {
                                settingList.push("bit crush");
                                settingList.push("freq crush");
                            }
                            if (!allInstrumentBitcrushes) {
                                unusedSettingList.push("+ bit crush");
                                unusedSettingList.push("+ freq crush");
                            }
                            if (anyInstrumentPans) {
                                settingList.push("pan");
                                settingList.push("pan delay");
                            }
                            if (!allInstrumentPans) {
                                unusedSettingList.push("+ pan");
                                unusedSettingList.push("+ pan delay");
                            }
                            if (anyInstrumentChorus) {
                                settingList.push("chorus");
                            }
                            if (!allInstrumentChorus) {
                                unusedSettingList.push("+ chorus");
                            }
                            if (anyInstrumentEchoes) {
                                settingList.push("echo");
                            }
                            if (!allInstrumentEchoes) {
                                unusedSettingList.push("+ echo");
                            }
                            if (anyInstrumentReverbs) {
                                settingList.push("reverb");
                            }
                            if (!allInstrumentReverbs) {
                                unusedSettingList.push("+ reverb");
                            }
                            if (anyInstrumentHasEnvelopes) {
                                settingList.push("envelope speed");
                            }
                            if (anyInstrumentRMs) {
                                settingList.push("ring modulation");
                                settingList.push("ring mod hertz");
                            }
                            if (anyInstrumentPhasers) {
                                settingList.push("phaser");
                                settingList.push("phaser frequency");
                                settingList.push("phaser feedback");
                                settingList.push("phaser stages");
                            }
                            if (anyInstrumentInvertWave) {
                                settingList.push("invert wave");
                            }
                            if (anyInstrumentGranulars) {
                                settingList.push("granular");
                                settingList.push("grain freq");
                                settingList.push("grain size");
                                settingList.push("grain range");
                            }
                            if (!allInstrumentGranulars) {
                                unusedSettingList.push("+ granular");
                                unusedSettingList.push("+ grain freq");
                                unusedSettingList.push("+ grain size");
                                unusedSettingList.push("+ grain range");
                            }
                        }
                        buildOptions(this._modSetBoxes[mod], settingList);
                        if (unusedSettingList.length > 0) {
                            this._modSetBoxes[mod].appendChild(option({ selected: false, disabled: true, value: "Add Effect" }, "Add Effect"));
                            buildOptions(this._modSetBoxes[mod], unusedSettingList);
                        }
                        let setIndex = settingList.indexOf(Config.modulators[instrument.modulators[mod]].name);
                        if (setIndex == -1) {
                            this._modSetBoxes[mod].insertBefore(option({ value: Config.modulators[instrument.modulators[mod]].name, style: "color: red;" }, Config.modulators[instrument.modulators[mod]].name), this._modSetBoxes[mod].children[0]);
                            this._modSetBoxes[mod].selectedIndex = 0;
                            this._whenSetModSetting(mod, true);
                        }
                        else {
                            this._modSetBoxes[mod].selectedIndex = setIndex;
                            this._modSetBoxes[mod].classList.remove("invalidSetting");
                            instrument.invalidModulators[mod] = false;
                        }
                    }
                    else if (this._modSetBoxes[mod].selectedIndex > 0) {
                        this._modSetBoxes[mod].selectedIndex = 0;
                        this._whenSetModSetting(mod);
                    }
                    if (instrument.modChannels[mod] < 0) {
                        (this._modInstrumentBoxes[mod].parentElement).style.display = "none";
                        $("#modInstrumentText" + mod).get(0).style.display = "none";
                        $("#modChannelText" + mod).get(0).innerText = "Channel:";
                        if (instrument.modChannels[mod] == -2) {
                            $("#modSettingText" + mod).get(0).style.display = "none";
                            (this._modSetBoxes[mod].parentElement).style.display = "none";
                        }
                        else {
                            $("#modSettingText" + mod).get(0).style.display = "";
                            (this._modSetBoxes[mod].parentElement).style.display = "";
                        }
                        this._modTargetIndicators[mod].style.setProperty("fill", ColorConfig.uiWidgetFocus);
                        this._modTargetIndicators[mod].classList.remove("modTarget");
                    }
                    else {
                        (this._modInstrumentBoxes[mod].parentElement).style.display = (channel.instruments.length > 1) ? "" : "none";
                        $("#modInstrumentText" + mod).get(0).style.display = (channel.instruments.length > 1) ? "" : "none";
                        $("#modChannelText" + mod).get(0).innerText = (channel.instruments.length > 1) ? "Ch:" : "Channel:";
                        $("#modSettingText" + mod).get(0).style.display = "";
                        (this._modSetBoxes[mod].parentElement).style.display = "";
                        this._modTargetIndicators[mod].style.setProperty("fill", ColorConfig.indicatorPrimary);
                        this._modTargetIndicators[mod].classList.add("modTarget");
                    }
                    let filterType = Config.modulators[instrument.modulators[mod]].name;
                    if (filterType == "eq filter" || filterType == "note filter") {
                        $("#modFilterText" + mod).get(0).style.display = "";
                        $("#modSettingText" + mod).get(0).style.setProperty("margin-bottom", "2px");
                        let useInstrument = instrument.modInstruments[mod];
                        let modChannel = this._doc.song.channels[Math.max(0, instrument.modChannels[mod])];
                        let tmpCount = -1;
                        if (useInstrument >= modChannel.instruments.length) {
                            for (let i = 0; i < modChannel.instruments.length; i++) {
                                if (filterType == "eq filter") {
                                    if (modChannel.instruments[i].eqFilter.controlPointCount > tmpCount) {
                                        tmpCount = modChannel.instruments[i].eqFilter.controlPointCount;
                                        useInstrument = i;
                                    }
                                }
                                else {
                                    if (modChannel.instruments[i].noteFilter.controlPointCount > tmpCount) {
                                        tmpCount = modChannel.instruments[i].noteFilter.controlPointCount;
                                        useInstrument = i;
                                    }
                                }
                            }
                        }
                        let dotCount = (filterType == "eq filter")
                            ? channel.instruments[useInstrument].getLargestControlPointCount(false)
                            : channel.instruments[useInstrument].getLargestControlPointCount(true);
                        const isSimple = (filterType == "eq filter" ? channel.instruments[useInstrument].eqFilterType : channel.instruments[useInstrument].noteFilterType);
                        if (isSimple)
                            dotCount = 0;
                        if (isSimple || this._modFilterBoxes[mod].children.length != 1 + dotCount * 2) {
                            while (this._modFilterBoxes[mod].firstChild)
                                this._modFilterBoxes[mod].remove(0);
                            const dotList = [];
                            if (!isSimple)
                                dotList.push("morph");
                            for (let i = 0; i < dotCount; i++) {
                                dotList.push("dot " + (i + 1) + " x");
                                dotList.push("dot " + (i + 1) + " y");
                            }
                            buildOptions(this._modFilterBoxes[mod], dotList);
                        }
                        if (isSimple || instrument.modFilterTypes[mod] >= this._modFilterBoxes[mod].length) {
                            this._modFilterBoxes[mod].classList.add("invalidSetting");
                            instrument.invalidModulators[mod] = true;
                            let useName = ((instrument.modFilterTypes[mod] - 1) % 2 == 1) ?
                                "dot " + (Math.floor((instrument.modFilterTypes[mod] - 1) / 2) + 1) + " y"
                                : "dot " + (Math.floor((instrument.modFilterTypes[mod] - 1) / 2) + 1) + " x";
                            if (instrument.modFilterTypes[mod] == 0)
                                useName = "morph";
                            this._modFilterBoxes[mod].insertBefore(option({ value: useName, style: "color: red;" }, useName), this._modFilterBoxes[mod].children[0]);
                            this._modFilterBoxes[mod].selectedIndex = 0;
                        }
                        else {
                            this._modFilterBoxes[mod].classList.remove("invalidSetting");
                            instrument.invalidModulators[mod] = false;
                            this._modFilterBoxes[mod].selectedIndex = instrument.modFilterTypes[mod];
                        }
                    }
                    else {
                        $("#modFilterText" + mod).get(0).style.display = "none";
                        $("#modSettingText" + mod).get(0).style.setProperty("margin-bottom", "0.9em");
                    }
                }
                this._doc.recalcChannelNames = false;
                for (let chordIndex = 0; chordIndex < Config.chords.length; chordIndex++) {
                    const option = this._chordSelect.children[chordIndex];
                    if (!option.hasAttribute("hidden")) {
                        option.setAttribute("hidden", "");
                    }
                }
                this._customInstrumentSettingsGroup.style.display = "none";
                this._panSliderRow.style.display = "none";
                this._panDropdownGroup.style.display = "none";
                this._instrumentVolumeSliderRow.style.display = "none";
                this._instrumentTypeSelectRow.style.setProperty("display", "none");
                this._instrumentSettingsGroup.style.color = ColorConfig.getChannelColor(this._doc.song, this._doc.channel).primaryNote;
                if (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                    this._piano.forceRender();
                }
                this._renderInstrumentBar(channel, instrumentIndex, colors);
            }
            this._instrumentSettingsGroup.style.color = colors.primaryNote;
            if (this._doc.synth.isFilterModActive(false, this._doc.channel, this._doc.getCurrentInstrument())) {
                this._eqFilterEditor.render(true, this._ctrlHeld || this._shiftHeld);
            }
            else {
                this._eqFilterEditor.render();
            }
            this._instrumentVolumeSlider.updateValue(instrument.volume);
            this._detuneSlider.updateValue(instrument.detune - Config.detuneCenter);
            this._twoNoteArpBox.checked = instrument.fastTwoNoteArp ? true : false;
            this._clicklessTransitionBox.checked = instrument.clicklessTransition ? true : false;
            this._aliasingBox.checked = instrument.aliases ? true : false;
            this._invertWaveBox.checked = instrument.invertWave ? true : false;
            this._addEnvelopeButton.disabled = (instrument.envelopeCount >= Config.maxEnvelopeCount);
            this._discreteEnvelopeBox.checked = instrument.discreteEnvelope ? true : false;
            this._volumeSlider.updateValue(prefs.volume);
            if (wasActive && activeElement != null && activeElement.clientWidth == 0) {
                this.refocusStage();
            }
            this._setPrompt(this._doc.prompt);
            if (prefs.autoFollow && !this._doc.synth.playing) {
                this._doc.synth.goToBar(this._doc.bar);
            }
            if (this._doc.addedEffect) {
                const envButtonRect = this._addEnvelopeButton.getBoundingClientRect();
                const instSettingsRect = this._instrumentSettingsArea.getBoundingClientRect();
                const settingsRect = this._settingsArea.getBoundingClientRect();
                this._instrumentSettingsArea.scrollTop += Math.max(0, envButtonRect.top - (instSettingsRect.top + instSettingsRect.height));
                this._settingsArea.scrollTop += Math.max(0, envButtonRect.top - (settingsRect.top + settingsRect.height));
                this._doc.addedEffect = false;
            }
            if (this._doc.addedEnvelope) {
                this._instrumentSettingsArea.scrollTop = this._instrumentSettingsArea.scrollHeight;
                this._settingsArea.scrollTop = this._settingsArea.scrollHeight;
                this._doc.addedEnvelope = false;
            }
            this.handleModRecording();
            if (this._ringModWaveSelect.selectedIndex == 2) {
                this._ringModPulsewidthSlider.container.style.display = "";
                this._ringModWaveText.style.display = "none";
            }
            else {
                this._ringModPulsewidthSlider.container.style.display = "none";
                this._ringModWaveText.style.display = "";
            }
        };
        this.updatePlayButton = () => {
            if (this._renderedIsPlaying != this._doc.synth.playing || this._renderedIsRecording != this._doc.synth.recording || this._renderedShowRecordButton != this._doc.prefs.showRecordButton || this._renderedCtrlHeld != this._ctrlHeld) {
                this._renderedIsPlaying = this._doc.synth.playing;
                this._renderedIsRecording = this._doc.synth.recording;
                this._renderedShowRecordButton = this._doc.prefs.showRecordButton;
                this._renderedCtrlHeld = this._ctrlHeld;
                if (document.activeElement == this._playButton || document.activeElement == this._pauseButton || document.activeElement == this._recordButton || document.activeElement == this._stopButton) {
                    this.refocusStage();
                }
                this._playButton.style.display = "none";
                this._mobilePlayButton.style.display = "none";
                this._pauseButton.style.display = "none";
                this._mobilePauseButton.style.display = "none";
                this._recordButton.style.display = "none";
                this._stopButton.style.display = "none";
                this._prevBarButton.style.display = "";
                this._nextBarButton.style.display = "";
                this._playButton.classList.remove("shrunk");
                this._mobilePlayButton.classList.remove("shrunk");
                this._recordButton.classList.remove("shrunk");
                this._patternEditorRow.style.pointerEvents = "";
                this._octaveScrollBar.container.style.pointerEvents = "";
                this._octaveScrollBar.container.style.opacity = "";
                this._trackContainer.style.pointerEvents = "";
                this._loopEditor.container.style.opacity = "";
                this._instrumentSettingsArea.style.pointerEvents = "";
                this._instrumentSettingsArea.style.opacity = "";
                this._menuArea.style.pointerEvents = "";
                this._menuArea.style.opacity = "";
                this._songSettingsArea.style.pointerEvents = "";
                this._songSettingsArea.style.opacity = "";
                if (this._doc.synth.recording) {
                    this._stopButton.style.display = "";
                    this._prevBarButton.style.display = "none";
                    this._nextBarButton.style.display = "none";
                    this._patternEditorRow.style.pointerEvents = "none";
                    this._octaveScrollBar.container.style.pointerEvents = "none";
                    this._octaveScrollBar.container.style.opacity = "0.5";
                    this._trackContainer.style.pointerEvents = "none";
                    this._loopEditor.container.style.opacity = "0.5";
                    this._instrumentSettingsArea.style.pointerEvents = "none";
                    this._instrumentSettingsArea.style.opacity = "0.5";
                    this._menuArea.style.pointerEvents = "none";
                    this._menuArea.style.opacity = "0.5";
                    this._songSettingsArea.style.pointerEvents = "none";
                    this._songSettingsArea.style.opacity = "0.5";
                }
                else if (this._doc.synth.playing) {
                    this._pauseButton.style.display = "";
                    this._mobilePauseButton.style.display = "";
                }
                else if (this._doc.prefs.showRecordButton) {
                    this._playButton.style.display = "";
                    this._recordButton.style.display = "";
                    this._playButton.classList.add("shrunk");
                    this._mobilePlayButton.classList.add("shrunk");
                    this._recordButton.classList.add("shrunk");
                }
                else if (this._ctrlHeld) {
                    this._recordButton.style.display = "";
                }
                else {
                    this._playButton.style.display = "";
                    this._mobilePlayButton.style.display = "";
                }
            }
            window.requestAnimationFrame(this.updatePlayButton);
        };
        this._onTrackAreaScroll = (event) => {
            this._doc.barScrollPos = (this._trackAndMuteContainer.scrollLeft / this._doc.getBarWidth());
            this._doc.channelScrollPos = (this._trackAndMuteContainer.scrollTop / ChannelRow.patternHeight);
        };
        this._disableCtrlContextMenu = (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                return false;
            }
            return true;
        };
        this._tempoStepperCaptureNumberKeys = (event) => {
            switch (event.keyCode) {
                case 8:
                case 13:
                case 38:
                case 40:
                case 37:
                case 39:
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                    event.stopPropagation();
                    break;
            }
        };
        this._whenKeyPressed = (event) => {
            this._ctrlHeld = event.ctrlKey;
            this._shiftHeld = event.shiftKey;
            if (this.prompt) {
                if (this.prompt instanceof CustomChipPrompt || this.prompt instanceof LimiterPrompt || this.prompt instanceof CustomScalePrompt || this.prompt instanceof CustomFilterPrompt) {
                    this.prompt.whenKeyPressed(event);
                }
                if (event.keyCode == 27) {
                    this._doc.undo();
                }
                return;
            }
            if (document.activeElement == this._songTitleInputBox.input || this._patternEditor.editingModLabel || document.activeElement == this._muteEditor._channelNameInput.input) {
                if (event.keyCode == 13 || event.keyCode == 27) {
                    this.mainLayer.focus();
                    this._patternEditor.stopEditingModLabel(event.keyCode == 27);
                }
                return;
            }
            if (document.activeElement == this._panSliderInputBox
                || document.activeElement == this._pwmSliderInputBox
                || document.activeElement == this._detuneSliderInputBox
                || document.activeElement == this._instrumentVolumeSliderInputBox
                || document.activeElement == this._chipWaveLoopStartStepper
                || document.activeElement == this._chipWaveLoopEndStepper
                || document.activeElement == this._chipWaveStartOffsetStepper
                || document.activeElement == this._octaveStepper
                || document.activeElement == this._unisonVoicesInputBox
                || document.activeElement == this._unisonSpreadInputBox
                || document.activeElement == this._unisonOffsetInputBox
                || document.activeElement == this._unisonExpressionInputBox
                || document.activeElement == this._unisonSignInputBox
                || document.activeElement == this._rmHzOffsetSliderInputBox) {
                if (event.keyCode == 13 || event.keyCode == 27) {
                    this.mainLayer.focus();
                }
                return;
            }
            if (document.activeElement == this._upperNoteLimitInputBox || document.activeElement == this._lowerNoteLimitInputBox) {
                if (event.keyCode == 13 || event.keyCode == 27) {
                    this.mainLayer.focus();
                }
                return;
            }
            if (this._doc.synth.recording) {
                if (!event.ctrlKey && !event.metaKey) {
                    this._keyboardLayout.handleKeyEvent(event, true);
                }
                if (event.keyCode == 32) {
                    this._toggleRecord();
                    event.preventDefault();
                    this.refocusStage();
                }
                else if (event.keyCode == 80 && (event.ctrlKey || event.metaKey)) {
                    this._toggleRecord();
                    event.preventDefault();
                    this.refocusStage();
                }
                return;
            }
            const needControlForShortcuts = (this._doc.prefs.pressControlForShortcuts != event.getModifierState("CapsLock"));
            const canPlayNotes = (!event.ctrlKey && !event.metaKey && needControlForShortcuts);
            if (canPlayNotes)
                this._keyboardLayout.handleKeyEvent(event, true);
            switch (event.keyCode) {
                case 27:
                    if (!event.ctrlKey && !event.metaKey) {
                        new ChangePatternSelection(this._doc, 0, 0);
                        this._doc.selection.resetBoxSelection();
                    }
                    break;
                case 16:
                    this._patternEditor.shiftMode = true;
                    break;
                case 17:
                    this._patternEditor.controlMode = true;
                    break;
                case 32:
                    if (event.ctrlKey) {
                        this._toggleRecord();
                    }
                    else if (event.shiftKey) {
                        if (this._trackEditor.movePlayheadToMouse() || this._patternEditor.movePlayheadToMouse()) {
                            if (!this._doc.synth.playing)
                                this._doc.performance.play();
                        }
                        if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                            this._doc.synth.loopBarStart = -1;
                            this._doc.synth.loopBarEnd = -1;
                            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                        }
                    }
                    else {
                        this.togglePlay();
                    }
                    event.preventDefault();
                    this.refocusStage();
                    break;
                case 80:
                    if (canPlayNotes)
                        break;
                    if (event.ctrlKey || event.metaKey) {
                        this._toggleRecord();
                        this._doc.synth.loopBarStart = -1;
                        this._doc.synth.loopBarEnd = -1;
                        this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                        event.preventDefault();
                        this.refocusStage();
                    }
                    else if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey) && event.shiftKey) {
                        location.href = "player/#song=" + this._doc.song.toBase64String();
                        event.preventDefault();
                    }
                    break;
                case 192:
                    if (canPlayNotes)
                        break;
                    if (event.shiftKey) {
                        this._doc.goBackToStart();
                        this._doc.song.restoreLimiterDefaults();
                        for (const channel of this._doc.song.channels) {
                            channel.muted = false;
                            channel.name = "";
                        }
                        this._doc.record(new ChangeSong(this._doc, ""), false, true);
                    }
                    else {
                        if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                            this._openPrompt("songRecovery");
                        }
                    }
                    event.preventDefault();
                    break;
                case 90:
                    if (canPlayNotes)
                        break;
                    if (event.shiftKey) {
                        this._doc.redo();
                    }
                    else {
                        this._doc.undo();
                    }
                    event.preventDefault();
                    break;
                case 88:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.cutNotes();
                    event.preventDefault();
                    break;
                case 89:
                    if (canPlayNotes)
                        break;
                    this._doc.redo();
                    event.preventDefault();
                    break;
                case 66:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        if (event.shiftKey) {
                            this._openPrompt("beatsPerBar");
                        }
                        else {
                            if (this._doc.song.loopType == 1) {
                                const leftSel = Math.min(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
                                const rightSel = Math.max(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
                                if ((leftSel < this._doc.synth.loopBarStart || this._doc.synth.loopBarStart == -1)
                                    || (rightSel > this._doc.synth.loopBarEnd || this._doc.synth.loopBarEnd == -1)) {
                                    this._doc.synth.loopBarStart = leftSel;
                                    this._doc.synth.loopBarEnd = rightSel;
                                    if (!this._doc.synth.playing) {
                                        this._doc.synth.snapToBar();
                                        this._doc.performance.play();
                                    }
                                }
                                else {
                                    this._doc.synth.loopBarStart = -1;
                                    this._doc.synth.loopBarEnd = -1;
                                }
                                if (this._doc.bar != Math.floor(this._doc.synth.playhead) && this._doc.synth.loopBarStart != -1) {
                                    this._doc.synth.goToBar(this._doc.bar);
                                    this._doc.synth.snapToBar();
                                    this._doc.synth.initModFilters(this._doc.song);
                                    this._doc.synth.computeLatestModValues();
                                    if (this._doc.prefs.autoFollow) {
                                        this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                                    }
                                }
                                this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                            }
                        }
                    }
                    event.preventDefault();
                    break;
                case 67:
                    if (canPlayNotes)
                        break;
                    if (event.shiftKey) {
                        this._copyInstrument();
                    }
                    else {
                        this._doc.selection.copy();
                        this._doc.selection.resetBoxSelection();
                        this._doc.selection.selectionUpdated();
                    }
                    event.preventDefault();
                    break;
                case 13:
                    this._doc.synth.loopBarStart = -1;
                    this._doc.synth.loopBarEnd = -1;
                    this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                    if (event.shiftKey && !event.ctrlKey) {
                        const minusWidth = this._doc.selection.boxSelectionWidth;
                        this._doc.bar -= minusWidth;
                        this._doc.selection.boxSelectionX0 -= minusWidth;
                        this._doc.selection.boxSelectionX1 -= minusWidth;
                        this._doc.selection.insertBars();
                    }
                    else if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                        this._doc.selection.insertChannel();
                    }
                    else if (event.altKey) {
                        const channelIndex = this._doc.channel;
                        if (this._doc.song.channels[channelIndex].instruments.length < this._doc.song.getMaxInstrumentsPerChannel()) {
                            if (!this._doc.song.layeredInstruments && !this._doc.song.patternInstruments) {
                                this._doc.record(new ChangeInstrumentsFlags(this._doc, true, this._doc.song.patternInstruments));
                            }
                            this._doc.record(new ChangeAddChannelInstrument(this._doc));
                        }
                    }
                    else {
                        this._doc.selection.insertBars();
                    }
                    event.preventDefault();
                    break;
                case 8:
                    this._doc.synth.loopBarStart = -1;
                    this._doc.synth.loopBarEnd = -1;
                    this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                    if (event.ctrlKey || event.metaKey) {
                        this._doc.selection.deleteChannel();
                    }
                    else if (event.altKey) {
                        const channelIndex = this._doc.channel;
                        if (this._doc.song.channels[channelIndex].instruments.length > 1) {
                            if (!this._doc.song.layeredInstruments && !this._doc.song.patternInstruments) {
                                this._doc.record(new ChangeInstrumentsFlags(this._doc, true, this._doc.song.patternInstruments));
                            }
                            this._doc.record(new ChangeRemoveChannelInstrument(this._doc));
                        }
                    }
                    else {
                        this._doc.selection.deleteBars();
                    }
                    this._barScrollBar.animatePlayhead();
                    event.preventDefault();
                    break;
                case 65:
                    if (canPlayNotes)
                        break;
                    if (event.shiftKey) {
                        this._doc.selection.selectChannel();
                    }
                    else {
                        this._doc.selection.selectAll();
                    }
                    event.preventDefault();
                    break;
                case 68:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        if (event.shiftKey) {
                            this._openPrompt("songDetails");
                        }
                        else {
                            this._doc.selection.duplicatePatterns();
                            event.preventDefault();
                        }
                    }
                    break;
                case 69:
                    if (canPlayNotes)
                        break;
                    if (event.shiftKey) {
                        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                        if (!instrument.eqFilterType && this._doc.channel < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)
                            this._openPrompt("customEQFilterSettings");
                    }
                    else if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        this._openPrompt("generateEuclideanRhythm");
                        event.preventDefault();
                        break;
                    }
                    break;
                case 70:
                    if (canPlayNotes)
                        break;
                    if (this._doc.song.loopType == 1) {
                        if (event.shiftKey) {
                            this._doc.synth.loopBarStart = -1;
                            this._doc.synth.loopBarEnd = -1;
                            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                            this._doc.synth.goToBar(this._doc.song.loopStart);
                            this._doc.synth.snapToBar();
                            this._doc.synth.initModFilters(this._doc.song);
                            this._doc.synth.computeLatestModValues();
                            if (this._doc.prefs.autoFollow) {
                                this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                            }
                            event.preventDefault();
                        }
                        else if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                            this._doc.synth.loopBarStart = -1;
                            this._doc.synth.loopBarEnd = -1;
                            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                            this._doc.synth.snapToStart();
                            this._doc.synth.initModFilters(this._doc.song);
                            this._doc.synth.computeLatestModValues();
                            if (this._doc.prefs.autoFollow) {
                                this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                            }
                            event.preventDefault();
                        }
                    }
                    else if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        this._doc.synth.loopBarStart = -1;
                        this._doc.synth.loopBarEnd = -1;
                        this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                        this._doc.synth.snapToStart();
                        this._doc.synth.initModFilters(this._doc.song);
                        this._doc.synth.computeLatestModValues();
                        if (this._doc.prefs.autoFollow) {
                            this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                        }
                        event.preventDefault();
                    }
                    break;
                case 72:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        this._doc.synth.goToBar(this._doc.bar);
                        this._doc.synth.snapToBar();
                        this._doc.synth.initModFilters(this._doc.song);
                        this._doc.synth.computeLatestModValues();
                        if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                            this._doc.synth.loopBarStart = -1;
                            this._doc.synth.loopBarEnd = -1;
                            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                        }
                        if (this._doc.prefs.autoFollow) {
                            this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                        }
                        event.preventDefault();
                    }
                    break;
                case 74:
                    if (canPlayNotes)
                        break;
                    if (event.shiftKey && event.ctrlKey && event.altKey) {
                        this._doc.prefs.autoPlay = false;
                        this._doc.prefs.autoFollow = false;
                        this._doc.prefs.enableNotePreview = true;
                        this._doc.prefs.showFifth = true;
                        this._doc.prefs.notesOutsideScale = false;
                        this._doc.prefs.defaultScale = 0;
                        this._doc.prefs.showLetters = true;
                        this._doc.prefs.showChannels = true;
                        this._doc.prefs.showScrollBar = true;
                        this._doc.prefs.alwaysFineNoteVol = false;
                        this._doc.prefs.enableChannelMuting = true;
                        this._doc.prefs.displayBrowserUrl = true;
                        this._doc.prefs.displayVolumeBar = true;
                        this._doc.prefs.layout = "wide";
                        this._doc.prefs.visibleOctaves = 5;
                        this._doc.prefs.save();
                        event.preventDefault();
                        location.reload();
                    }
                    break;
                case 76:
                    if (canPlayNotes)
                        break;
                    if (event.shiftKey) {
                        this._openPrompt("limiterSettings");
                    }
                    else {
                        this._openPrompt("barCount");
                    }
                    break;
                case 77:
                    if (canPlayNotes)
                        break;
                    if (event.altKey) {
                        if (this._doc.prefs.enableChannelMuting) {
                            this._doc.selection.invertMuteChannels();
                            event.preventDefault();
                        }
                    }
                    else {
                        if ((needControlForShortcuts == (event.ctrlKey || event.metaKey))) {
                            if (this._doc.prefs.enableChannelMuting) {
                                this._doc.selection.muteChannels(event.shiftKey);
                                event.preventDefault();
                            }
                        }
                    }
                    break;
                case 78:
                    if (canPlayNotes)
                        break;
                    const group = new ChangeGroup();
                    if (event.shiftKey) {
                        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                        if (effectsIncludeNoteFilter(instrument.effects) && !instrument.noteFilterType && this._doc.channel < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)
                            this._openPrompt("customNoteFilterSettings");
                        break;
                    }
                    else if (event.ctrlKey) {
                        let nextEmpty = 0;
                        while (nextEmpty < this._doc.song.patternsPerChannel && this._doc.song.channels[this._doc.channel].patterns[nextEmpty].notes.length > 0)
                            nextEmpty++;
                        nextEmpty++;
                        if (nextEmpty <= Config.barCountMax) {
                            if (nextEmpty > this._doc.song.patternsPerChannel) {
                                group.append(new ChangePatternsPerChannel(this._doc, nextEmpty));
                            }
                            group.append(new ChangePatternNumbers(this._doc, nextEmpty, this._doc.bar, this._doc.channel, 1, 1));
                            if (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                                this._doc.viewedInstrument[this._doc.channel] = this._doc.recentPatternInstruments[this._doc.channel][0];
                            }
                            group.append(new ChangeSetPatternInstruments(this._doc, this._doc.channel, this._doc.recentPatternInstruments[this._doc.channel], this._doc.song.channels[this._doc.channel].patterns[nextEmpty - 1]));
                        }
                    }
                    else {
                        let nextUnused = 1;
                        while (this._doc.song.channels[this._doc.channel].bars.indexOf(nextUnused) != -1
                            && nextUnused <= this._doc.song.patternsPerChannel)
                            nextUnused++;
                        if (nextUnused <= Config.barCountMax) {
                            if (nextUnused > this._doc.song.patternsPerChannel) {
                                group.append(new ChangePatternsPerChannel(this._doc, nextUnused));
                            }
                            group.append(new ChangePatternNumbers(this._doc, nextUnused, this._doc.bar, this._doc.channel, 1, 1));
                            if (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                                this._doc.viewedInstrument[this._doc.channel] = this._doc.recentPatternInstruments[this._doc.channel][0];
                            }
                            group.append(new ChangeSetPatternInstruments(this._doc, this._doc.channel, this._doc.recentPatternInstruments[this._doc.channel], this._doc.song.channels[this._doc.channel].patterns[nextUnused - 1]));
                        }
                    }
                    this._doc.record(group);
                    event.preventDefault();
                    break;
                case 80:
                    if (canPlayNotes)
                        break;
                    if (event.ctrlKey || event.metaKey) {
                        this._toggleRecord();
                        this._doc.synth.loopBarStart = -1;
                        this._doc.synth.loopBarEnd = -1;
                        this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                        event.preventDefault();
                        this.refocusStage();
                    }
                    else if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey) && event.shiftKey) {
                        location.href = "player/#song=" + this._doc.song.toBase64String();
                        event.preventDefault();
                    }
                    break;
                case 81:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        if (event.shiftKey) {
                            this._openPrompt("addExternal");
                            event.preventDefault();
                            break;
                        }
                        else {
                            this._openPrompt("channelSettings");
                            event.preventDefault();
                            break;
                        }
                    }
                    break;
                case 83:
                    if (canPlayNotes)
                        break;
                    if (event.ctrlKey || event.metaKey) {
                        if (!event.shiftKey) {
                            this._openPrompt("export");
                        }
                        else {
                            this._openPrompt("quickExport");
                        }
                        event.preventDefault();
                    }
                    else {
                        if (this._doc.prefs.enableChannelMuting) {
                            if (event.shiftKey) {
                                this._doc.selection.muteChannels(false);
                            }
                            else {
                                this._doc.selection.soloChannels(false);
                            }
                            event.preventDefault();
                        }
                    }
                    break;
                case 79:
                    if (canPlayNotes)
                        break;
                    if (event.ctrlKey || event.metaKey) {
                        this._openPrompt("import");
                        event.preventDefault();
                    }
                    break;
                case 86:
                    if (canPlayNotes)
                        break;
                    if ((event.ctrlKey || event.metaKey) && event.shiftKey && !needControlForShortcuts) {
                        this._doc.selection.pasteNumbers();
                    }
                    else if (event.shiftKey) {
                        this._pasteInstrument();
                    }
                    else {
                        this._doc.selection.pasteNotes();
                    }
                    event.preventDefault();
                    break;
                case 87:
                    if (canPlayNotes)
                        break;
                    this._openPrompt("moveNotesSideways");
                    break;
                case 73:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey) && event.shiftKey) {
                        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                        const instrumentObject = instrument.toJsonObject();
                        delete instrumentObject["preset"];
                        delete instrumentObject["volume"];
                        delete instrumentObject["pan"];
                        const panningEffectIndex = instrumentObject["effects"].indexOf(Config.effectNames[2]);
                        if (panningEffectIndex != -1)
                            instrumentObject["effects"].splice(panningEffectIndex, 1);
                        for (let i = 0; i < instrumentObject["envelopes"].length; i++) {
                            const envelope = instrumentObject["envelopes"][i];
                            if (envelope["target"] == "panning" || envelope["target"] == "none" || envelope["envelope"] == "none") {
                                instrumentObject["envelopes"].splice(i, 1);
                                i--;
                            }
                        }
                        this._copyTextToClipboard(JSON.stringify(instrumentObject));
                        event.preventDefault();
                    }
                    break;
                case 82:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        if (event.shiftKey) {
                            this._randomGenerated();
                        }
                        else {
                            this._randomPreset();
                        }
                        event.preventDefault();
                    }
                    break;
                case 219:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        this._doc.synth.goToPrevBar();
                        this._doc.synth.initModFilters(this._doc.song);
                        this._doc.synth.computeLatestModValues();
                        if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                            this._doc.synth.loopBarStart = -1;
                            this._doc.synth.loopBarEnd = -1;
                            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                        }
                        if (this._doc.prefs.autoFollow) {
                            this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                        }
                        event.preventDefault();
                    }
                    break;
                case 221:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        this._doc.synth.goToNextBar();
                        this._doc.synth.initModFilters(this._doc.song);
                        this._doc.synth.computeLatestModValues();
                        if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                            this._doc.synth.loopBarStart = -1;
                            this._doc.synth.loopBarEnd = -1;
                            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                        }
                        if (this._doc.prefs.autoFollow) {
                            this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                        }
                        event.preventDefault();
                    }
                    break;
                case 189:
                case 173:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        this._doc.selection.transpose(false, event.shiftKey);
                        event.preventDefault();
                    }
                    break;
                case 187:
                case 61:
                case 171:
                    if (canPlayNotes)
                        break;
                    if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                        this._doc.selection.transpose(true, event.shiftKey);
                        event.preventDefault();
                    }
                    break;
                case 38:
                    if (event.ctrlKey || event.metaKey) {
                        this._doc.selection.swapChannels(-1);
                    }
                    else if (event.shiftKey) {
                        this._doc.selection.boxSelectionY1 = Math.max(0, this._doc.selection.boxSelectionY1 - 1);
                        this._doc.selection.scrollToEndOfSelection();
                        this._doc.selection.selectionUpdated();
                    }
                    else {
                        this._doc.selection.setChannelBar((this._doc.channel - 1 + this._doc.song.getChannelCount()) % this._doc.song.getChannelCount(), this._doc.bar);
                        this._doc.selection.resetBoxSelection();
                    }
                    event.preventDefault();
                    break;
                case 40:
                    if (event.ctrlKey || event.metaKey) {
                        this._doc.selection.swapChannels(1);
                    }
                    else if (event.shiftKey) {
                        this._doc.selection.boxSelectionY1 = Math.min(this._doc.song.getChannelCount() - 1, this._doc.selection.boxSelectionY1 + 1);
                        this._doc.selection.scrollToEndOfSelection();
                        this._doc.selection.selectionUpdated();
                    }
                    else {
                        this._doc.selection.setChannelBar((this._doc.channel + 1) % this._doc.song.getChannelCount(), this._doc.bar);
                        this._doc.selection.resetBoxSelection();
                    }
                    event.preventDefault();
                    break;
                case 37:
                    if (event.shiftKey) {
                        this._doc.selection.boxSelectionX1 = Math.max(0, this._doc.selection.boxSelectionX1 - 1);
                        this._doc.selection.scrollToEndOfSelection();
                        this._doc.selection.selectionUpdated();
                    }
                    else {
                        this._doc.selection.setChannelBar(this._doc.channel, (this._doc.bar + this._doc.song.barCount - 1) % this._doc.song.barCount);
                        this._doc.selection.resetBoxSelection();
                    }
                    event.preventDefault();
                    break;
                case 39:
                    if (event.shiftKey) {
                        this._doc.selection.boxSelectionX1 = Math.min(this._doc.song.barCount - 1, this._doc.selection.boxSelectionX1 + 1);
                        this._doc.selection.scrollToEndOfSelection();
                        this._doc.selection.selectionUpdated();
                    }
                    else {
                        this._doc.selection.setChannelBar(this._doc.channel, (this._doc.bar + 1) % this._doc.song.barCount);
                        this._doc.selection.resetBoxSelection();
                    }
                    event.preventDefault();
                    break;
                case 46:
                    this._doc.selection.digits = "";
                    this._doc.selection.nextDigit("0", false, false);
                    break;
                case 48:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("0", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 49:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("1", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 50:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("2", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 51:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("3", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 52:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("4", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 53:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("5", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 54:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("6", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 55:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("7", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 56:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("8", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                case 57:
                    if (canPlayNotes)
                        break;
                    this._doc.selection.nextDigit("9", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                    this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                    event.preventDefault();
                    break;
                default:
                    this._doc.selection.digits = "";
                    this._doc.selection.instrumentDigits = "";
                    break;
            }
            if (canPlayNotes) {
                this._doc.selection.digits = "";
                this._doc.selection.instrumentDigits = "";
            }
        };
        this._whenKeyReleased = (event) => {
            this._muteEditor.onKeyUp(event);
            if (!event.ctrlKey) {
                this._patternEditor.controlMode = false;
            }
            if (!event.shiftKey) {
                this._patternEditor.shiftMode = false;
            }
            this._ctrlHeld = event.ctrlKey;
            this._shiftHeld = event.shiftKey;
            this._keyboardLayout.handleKeyEvent(event, false);
        };
        this._whenPrevBarPressed = () => {
            this._doc.synth.goToPrevBar();
            this._barScrollBar.animatePlayhead();
            if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                this._doc.synth.loopBarStart = -1;
                this._doc.synth.loopBarEnd = -1;
                this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
            }
        };
        this._whenNextBarPressed = () => {
            this._doc.synth.goToNextBar();
            this._barScrollBar.animatePlayhead();
            if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                this._doc.synth.loopBarStart = -1;
                this._doc.synth.loopBarEnd = -1;
                this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
            }
        };
        this.togglePlay = () => {
            if (this._doc.synth.playing) {
                this._doc.performance.pause();
                this.outVolumeHistoricCap = 0;
            }
            else {
                this._doc.synth.snapToBar();
                this._doc.performance.play();
            }
        };
        this._toggleRecord = () => {
            if (this._doc.synth.playing) {
                this._doc.performance.pause();
            }
            else {
                this._doc.performance.record();
            }
        };
        this._displayPatternEditor = () => {
            this._menuMode = 1;
            this.whenUpdated();
        };
        this._displayTrackEditor = () => {
            this._menuMode = 2;
            this.whenUpdated();
        };
        this._displaySettingsEditor = () => {
            this._menuMode = 3;
            this.whenUpdated();
        };
        this._animate = () => {
            this._modSliderUpdate();
            if (this._doc.prefs.displayVolumeBar) {
                this._volumeUpdate();
            }
            this._barScrollBar.animatePlayhead();
            if (this._doc.synth.isFilterModActive(false, this._doc.channel, this._doc.getCurrentInstrument())) {
                this._eqFilterEditor.render(true, this._ctrlHeld || this._shiftHeld);
            }
            if (this._doc.synth.isFilterModActive(true, this._doc.channel, this._doc.getCurrentInstrument())) {
                this._noteFilterEditor.render(true, this._ctrlHeld || this._shiftHeld);
            }
            window.requestAnimationFrame(this._animate);
        };
        this._volumeUpdate = () => {
            this.outVolumeHistoricTimer--;
            if (this.outVolumeHistoricTimer <= 0) {
                this.outVolumeHistoricCap -= 0.03;
            }
            if (this._doc.song.outVolumeCap > this.outVolumeHistoricCap) {
                this.outVolumeHistoricCap = this._doc.song.outVolumeCap;
                this.outVolumeHistoricTimer = 50;
            }
            if (this._doc.song.outVolumeCap != this.lastOutVolumeCap) {
                this.lastOutVolumeCap = this._doc.song.outVolumeCap;
                this._animateVolume(this._doc.song.outVolumeCap, this.outVolumeHistoricCap);
            }
        };
        this._setVolumeSlider = () => {
            if ((this._ctrlHeld || this._shiftHeld) && this._doc.synth.playing) {
                const prevVol = this._doc.prefs.volume;
                this._doc.prefs.volume = Math.round(Number(this._volumeSlider.input.value) * 4 / 3);
                const changedPatterns = this._patternEditor.setModSettingsForChange(null, this);
                const useVol = this._doc.prefs.volume;
                window.clearTimeout(this._modRecTimeout);
                this._modRecTimeout = window.setTimeout(() => { this._recordVolumeSlider(useVol); }, 10);
                this._doc.recordingModulators = true;
                this._doc.prefs.volume = prevVol;
                this._volumeSlider.updateValue(this._doc.prefs.volume);
                if (changedPatterns)
                    this._trackEditor.render();
            }
            else {
                this._doc.setVolume(Number(this._volumeSlider.input.value));
                if (this._doc.recordingModulators) {
                    this._doc.recordingModulators = false;
                    this._doc.record(new ChangeHoldingModRecording(this._doc, null, null, null));
                }
            }
        };
        this._copyInstrument = () => {
            const channel = this._doc.song.channels[this._doc.channel];
            const instrument = channel.instruments[this._doc.getCurrentInstrument()];
            const instrumentCopy = instrument.toJsonObject();
            instrumentCopy["isDrum"] = this._doc.song.getChannelIsNoise(this._doc.channel);
            window.localStorage.setItem("instrumentCopy", JSON.stringify(instrumentCopy));
            this.refocusStage();
        };
        this._pasteInstrument = () => {
            const channel = this._doc.song.channels[this._doc.channel];
            const instrument = channel.instruments[this._doc.getCurrentInstrument()];
            const instrumentCopy = JSON.parse(String(window.localStorage.getItem("instrumentCopy")));
            if (instrumentCopy != null && instrumentCopy["isDrum"] == this._doc.song.getChannelIsNoise(this._doc.channel)) {
                this._doc.record(new ChangePasteInstrument(this._doc, instrument, instrumentCopy));
            }
            this.refocusStage();
        };
        this._exportInstruments = () => {
            this._openPrompt("exportInstrument");
        };
        this._importInstruments = () => {
            this._openPrompt("importInstrument");
        };
        this._whenSetTempo = () => {
            this._doc.record(new ChangeTempo(this._doc, -1, parseInt(this._tempoStepper.value) | 0));
        };
        this._whenSetOctave = () => {
            this._doc.record(new ChangeKeyOctave(this._doc, this._doc.song.octave, parseInt(this._octaveStepper.value) | 0));
            this._piano.forceRender();
        };
        this._whenSetScale = () => {
            if (isNaN(this._scaleSelect.value)) {
                switch (this._scaleSelect.value) {
                    case "forceScale":
                        this._doc.selection.forceScale();
                        break;
                    case "customize":
                        this._openPrompt("customScale");
                        break;
                }
                this._doc.notifier.changed();
            }
            else {
                this._doc.record(new ChangeScale(this._doc, this._scaleSelect.selectedIndex));
            }
        };
        this._whenSetKey = () => {
            if (isNaN(this._keySelect.value)) {
                switch (this._keySelect.value) {
                    case "detectKey":
                        this._doc.record(new ChangeDetectKey(this._doc));
                        break;
                }
                this._doc.notifier.changed();
            }
            else {
                this._doc.record(new ChangeKey(this._doc, Config.keys.length - 1 - this._keySelect.selectedIndex));
            }
        };
        this._whenSetRhythm = () => {
            if (isNaN(this._rhythmSelect.value)) {
                switch (this._rhythmSelect.value) {
                    case "forceRhythm":
                        this._doc.selection.forceRhythm();
                        break;
                }
                this._doc.notifier.changed();
            }
            else {
                this._doc.record(new ChangeRhythm(this._doc, this._rhythmSelect.selectedIndex));
            }
        };
        this._refocus = () => {
            var selfRef = this;
            setTimeout(function () { selfRef.mainLayer.focus(); }, 20);
        };
        this._whenSetPitchedPreset = () => {
            this._setPreset($('#pitchPresetSelect').val() + "");
        };
        this._whenSetDrumPreset = () => {
            this._setPreset($('#drumPresetSelect').val() + "");
        };
        this._whenSetFeedbackType = () => {
            this._doc.record(new ChangeFeedbackType(this._doc, this._feedbackTypeSelect.selectedIndex));
        };
        this._whenSetAlgorithm = () => {
            this._doc.record(new ChangeAlgorithm(this._doc, this._algorithmSelect.selectedIndex));
        };
        this._whenSet6OpFeedbackType = () => {
            this._doc.record(new Change6OpFeedbackType(this._doc, this._feedback6OpTypeSelect.selectedIndex));
            this._customAlgorithmCanvas.reset();
        };
        this._whenSet6OpAlgorithm = () => {
            this._doc.record(new Change6OpAlgorithm(this._doc, this._algorithm6OpSelect.selectedIndex));
            this._customAlgorithmCanvas.reset();
        };
        this._whenSelectInstrument = (event) => {
            if (event.target == this._instrumentAddButton) {
                this._doc.record(new ChangeAddChannelInstrument(this._doc));
            }
            else if (event.target == this._instrumentRemoveButton) {
                this._doc.record(new ChangeRemoveChannelInstrument(this._doc));
            }
            else {
                const index = this._instrumentButtons.indexOf(event.target);
                if (index != -1) {
                    this._doc.selection.selectInstrument(index);
                }
                if (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                    this._piano.forceRender();
                }
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], index, ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
            }
            this.refocusStage();
        };
        this._whenSetModChannel = (mod) => {
            let instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
            let previouslyUnset = (instrument.modulators[mod] == 0 || Config.modulators[instrument.modulators[mod]].forSong);
            this._doc.selection.setModChannel(mod, this._modChannelBoxes[mod].selectedIndex);
            const modChannel = Math.max(0, instrument.modChannels[mod]);
            if (this._doc.song.channels[modChannel].instruments.length > 1 && previouslyUnset && this._modChannelBoxes[mod].selectedIndex >= 2) {
                if (this._doc.song.channels[modChannel].bars[this._doc.bar] > 0) {
                    this._doc.selection.setModInstrument(mod, this._doc.song.channels[modChannel].patterns[this._doc.song.channels[modChannel].bars[this._doc.bar] - 1].instruments[0]);
                }
            }
            this._piano.forceRender();
        };
        this._whenSetModInstrument = (mod) => {
            this._doc.selection.setModInstrument(mod, this._modInstrumentBoxes[mod].selectedIndex);
            this._piano.forceRender();
        };
        this._whenSetModSetting = (mod, invalidIndex = false) => {
            let text = "none";
            if (this._modSetBoxes[mod].selectedIndex != -1) {
                text = this._modSetBoxes[mod].children[this._modSetBoxes[mod].selectedIndex].textContent;
                if (invalidIndex) {
                    this._modSetBoxes[mod].selectedOptions.item(0).style.setProperty("color", "red");
                    this._modSetBoxes[mod].classList.add("invalidSetting");
                    this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].invalidModulators[mod] = true;
                }
                else {
                    this._modSetBoxes[mod].classList.remove("invalidSetting");
                    this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].invalidModulators[mod] = false;
                }
            }
            if (!invalidIndex)
                this._doc.selection.setModSetting(mod, text);
            this._piano.forceRender();
        };
        this._whenClickModTarget = (mod) => {
            if (this._modChannelBoxes[mod].selectedIndex >= 2) {
                this._doc.selection.setChannelBar(this._modChannelBoxes[mod].selectedIndex - 2, this._doc.bar);
            }
        };
        this._whenClickJumpToModTarget = () => {
            const channelIndex = this._doc.channel;
            const instrumentIndex = this._doc.getCurrentInstrument();
            if (channelIndex < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                for (let modChannelIdx = this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount; modChannelIdx < this._doc.song.channels.length; modChannelIdx++) {
                    const modChannel = this._doc.song.channels[modChannelIdx];
                    const patternIdx = modChannel.bars[this._doc.bar];
                    if (patternIdx > 0) {
                        const modInstrumentIdx = modChannel.patterns[patternIdx - 1].instruments[0];
                        const modInstrument = modChannel.instruments[modInstrumentIdx];
                        for (let mod = 0; mod < Config.modCount; mod++) {
                            if (modInstrument.modChannels[mod] == channelIndex && (modInstrument.modInstruments[mod] == instrumentIndex || modInstrument.modInstruments[mod] >= this._doc.song.channels[channelIndex].instruments.length)) {
                                this._doc.selection.setChannelBar(modChannelIdx, this._doc.bar);
                                return;
                            }
                        }
                    }
                }
            }
        };
        this._whenSetModFilter = (mod) => {
            this._doc.selection.setModFilter(mod, this._modFilterBoxes[mod].selectedIndex);
        };
        this._whenSetChipWave = () => {
            this._doc.record(new ChangeChipWave(this._doc, this._chipWaveSelect.selectedIndex));
        };
        this._whenSetRMChipWave = () => {
            this._doc.record(new ChangeRMChipWave(this._doc, this._ringModWaveSelect.selectedIndex));
        };
        this._whenSetUseChipWaveAdvancedLoopControls = () => {
            this._doc.record(new ChangeChipWaveUseAdvancedLoopControls(this._doc, this._useChipWaveAdvancedLoopControlsBox.checked ? true : false));
        };
        this._whenSetChipWaveLoopMode = () => {
            this._doc.record(new ChangeChipWaveLoopMode(this._doc, this._chipWaveLoopModeSelect.selectedIndex));
        };
        this._whenSetChipWaveLoopStart = () => {
            this._doc.record(new ChangeChipWaveLoopStart(this._doc, parseInt(this._chipWaveLoopStartStepper.value) | 0));
        };
        this._whenSetChipWaveLoopEnd = () => {
            this._doc.record(new ChangeChipWaveLoopEnd(this._doc, parseInt(this._chipWaveLoopEndStepper.value) | 0));
        };
        this._whenSetChipWaveLoopEndToEnd = () => {
            const channel = this._doc.song.channels[this._doc.channel];
            const instrument = channel.instruments[this._doc.getCurrentInstrument()];
            const chipWave = Config.rawRawChipWaves[instrument.chipWave];
            const chipWaveLength = chipWave.samples.length;
            this._doc.record(new ChangeChipWaveLoopEnd(this._doc, chipWaveLength - 1));
        };
        this._whenSetChipWaveStartOffset = () => {
            this._doc.record(new ChangeChipWaveStartOffset(this._doc, parseInt(this._chipWaveStartOffsetStepper.value) | 0));
        };
        this._whenSetChipWavePlayBackwards = () => {
            this._doc.record(new ChangeChipWavePlayBackwards(this._doc, this._chipWavePlayBackwardsBox.checked));
        };
        this._whenSetNoiseWave = () => {
            this._doc.record(new ChangeNoiseWave(this._doc, this._chipNoiseSelect.selectedIndex));
        };
        this._whenSetTransition = () => {
            this._doc.record(new ChangeTransition(this._doc, this._transitionSelect.selectedIndex));
        };
        this._whenSetEffects = () => {
            const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
            const oldValue = instrument.effects;
            const toggleFlag = Config.effectOrder[this._effectsSelect.selectedIndex - 1];
            this._doc.record(new ChangeToggleEffects(this._doc, toggleFlag, null));
            this._effectsSelect.selectedIndex = 0;
            if (instrument.effects > oldValue) {
                this._doc.addedEffect = true;
            }
            this._doc.notifier.changed();
        };
        this._whenSetVibrato = () => {
            this._doc.record(new ChangeVibrato(this._doc, this._vibratoSelect.selectedIndex));
        };
        this._whenSetVibratoType = () => {
            this._doc.record(new ChangeVibratoType(this._doc, this._vibratoTypeSelect.selectedIndex));
        };
        this._whenSetUnison = () => {
            this._doc.record(new ChangeUnison(this._doc, this._unisonSelect.selectedIndex));
        };
        this._whenSetChord = () => {
            this._doc.record(new ChangeChord(this._doc, this._chordSelect.selectedIndex));
        };
        this._addNewEnvelope = () => {
            this._doc.record(new ChangeAddEnvelope(this._doc));
            this.refocusStage();
            this._doc.addedEnvelope = true;
        };
        this._zoomIn = () => {
            this._doc.prefs.visibleOctaves = Math.max(1, this._doc.prefs.visibleOctaves - 1);
            this._doc.prefs.save();
            this._doc.notifier.changed();
            this.refocusStage();
        };
        this._zoomOut = () => {
            this._doc.prefs.visibleOctaves = Math.min(Config.pitchOctaves, this._doc.prefs.visibleOctaves + 1);
            this._doc.prefs.save();
            this._doc.notifier.changed();
            this.refocusStage();
        };
        this._undo = () => {
            this._doc.undo();
        };
        this._redo = () => {
            this._doc.redo();
        };
        this._copy = () => {
            this._doc.selection.copy();
        };
        this._paste = () => {
            this._doc.selection.pasteNotes();
        };
        this._insertChannel = () => {
            this._doc.selection.insertChannel();
        };
        this._deleteChannel = () => {
            this._doc.selection.deleteChannel();
        };
        this._selectAll = () => {
            this._doc.selection.selectAll();
        };
        this._duplicate = () => {
            this._doc.selection.duplicatePatterns();
        };
        this._notesUp = () => {
            this._doc.selection.transpose(true, false);
        };
        this._notesDown = () => {
            this._doc.selection.transpose(false, false);
        };
        this._tempLoopBar = () => {
            const leftSel = Math.min(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
            const rightSel = Math.max(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
            if ((leftSel < this._doc.synth.loopBarStart || this._doc.synth.loopBarStart == -1)
                || (rightSel > this._doc.synth.loopBarEnd || this._doc.synth.loopBarEnd == -1)) {
                this._doc.synth.loopBarStart = leftSel;
                this._doc.synth.loopBarEnd = rightSel;
                if (!this._doc.synth.playing) {
                    this._doc.synth.snapToBar();
                    this._doc.performance.play();
                }
            }
            else {
                this._doc.synth.loopBarStart = -1;
                this._doc.synth.loopBarEnd = -1;
            }
            if (this._doc.bar != Math.floor(this._doc.synth.playhead) && this._doc.synth.loopBarStart != -1) {
                this._doc.synth.goToBar(this._doc.bar);
                this._doc.synth.snapToBar();
                this._doc.synth.initModFilters(this._doc.song);
                this._doc.synth.computeLatestModValues();
                if (this._doc.prefs.autoFollow) {
                    this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                }
            }
            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
        };
        this._goFullscreen = () => {
            this.isMobileFullscreen = !this.isMobileFullscreen;
            this._doc.notifier.changed();
        };
        this._fileMenuHandler = (event) => {
            switch (this._fileMenu.value) {
                case "new":
                    this._doc.goBackToStart();
                    this._doc.song.restoreLimiterDefaults();
                    for (const channel of this._doc.song.channels) {
                        channel.muted = false;
                        channel.name = "";
                    }
                    this._doc.record(new ChangeSong(this._doc, ""), false, true);
                    break;
                case "export":
                    this._openPrompt("export");
                    break;
                case "import":
                    this._openPrompt("import");
                    break;
                case "copyUrl":
                    this._copyTextToClipboard(new URL("#" + this._doc.song.toBase64String(), location.href).href);
                    break;
                case "shareUrl":
                    navigator.share({ url: new URL("#" + this._doc.song.toBase64String(), location.href).href });
                    break;
                case "shortenUrl":
                    let shortenerStrategy = "https://tinyurl.com/api-create.php?url=";
                    const localShortenerStrategy = window.localStorage.getItem("shortenerStrategySelect");
                    if (localShortenerStrategy == "isgd")
                        shortenerStrategy = "https://is.gd/create.php?format=simple&url=";
                    window.open(shortenerStrategy + encodeURIComponent(new URL("#" + this._doc.song.toBase64String(), location.href).href));
                    break;
                case "configureShortener":
                    this._openPrompt("configureShortener");
                    break;
                case "viewPlayer":
                    location.href = "player/#song=" + this._doc.song.toBase64String();
                    break;
                case "copyEmbed":
                    this._copyTextToClipboard(`<iframe width="384" height="60" style="border: none;" src="${new URL("player/#song=" + this._doc.song.toBase64String(), location.href).href}"></iframe>`);
                    break;
                case "songRecovery":
                    this._openPrompt("songRecovery");
                    break;
                case "openManual":
                    window.open("./manual.html");
                    break;
                case "openUpdate":
                    break;
            }
            this._fileMenu.selectedIndex = 0;
        };
        this._editMenuHandler = (event) => {
            switch (this._editMenu.value) {
                case "undo":
                    this._doc.undo();
                    break;
                case "redo":
                    this._doc.redo();
                    break;
                case "copy":
                    this._doc.selection.copy();
                    break;
                case "insertBars":
                    this._doc.selection.insertBars();
                    break;
                case "deleteBars":
                    this._doc.selection.deleteBars();
                    break;
                case "insertChannel":
                    this._doc.selection.insertChannel();
                    break;
                case "deleteChannel":
                    this._doc.selection.deleteChannel();
                    break;
                case "pasteNotes":
                    this._doc.selection.pasteNotes();
                    break;
                case "pasteNumbers":
                    this._doc.selection.pasteNumbers();
                    break;
                case "transposeUp":
                    this._doc.selection.transpose(true, false);
                    break;
                case "transposeDown":
                    this._doc.selection.transpose(false, false);
                    break;
                case "selectAll":
                    this._doc.selection.selectAll();
                    break;
                case "selectChannel":
                    this._doc.selection.selectChannel();
                    break;
                case "duplicatePatterns":
                    this._doc.selection.duplicatePatterns();
                    break;
                case "barCount":
                    this._openPrompt("barCount");
                    break;
                case "beatsPerBar":
                    this._openPrompt("beatsPerBar");
                    break;
                case "moveNotesSideways":
                    this._openPrompt("moveNotesSideways");
                    break;
                case "channelSettings":
                    this._openPrompt("channelSettings");
                    break;
                case "limiterSettings":
                    this._openPrompt("limiterSettings");
                    break;
                case "generateEuclideanRhythm":
                    this._openPrompt("generateEuclideanRhythm");
                    break;
                case "addExternal":
                    this._openPrompt("addExternal");
                    break;
                case "songTheme":
                    this._openPrompt("songTheme");
                    break;
                case "presetsPrompt":
                    this._openPrompt("presetsPrompt");
                    break;
            }
            this._editMenu.selectedIndex = 0;
        };
        this._optionsMenuHandler = (event) => {
            switch (this._optionsMenu.value) {
                case "autoPlay":
                    this._doc.prefs.autoPlay = !this._doc.prefs.autoPlay;
                    break;
                case "autoFollow":
                    this._doc.prefs.autoFollow = !this._doc.prefs.autoFollow;
                    break;
                case "enableNotePreview":
                    this._doc.prefs.enableNotePreview = !this._doc.prefs.enableNotePreview;
                    break;
                case "showLetters":
                    this._doc.prefs.showLetters = !this._doc.prefs.showLetters;
                    break;
                case "showFifth":
                    this._doc.prefs.showFifth = !this._doc.prefs.showFifth;
                    break;
                case "showThird":
                    this._doc.prefs.showThird = !this._doc.prefs.showThird;
                    break;
                case "advancedColorScheme":
                    this._doc.prefs.advancedColorScheme = !this._doc.prefs.advancedColorScheme;
                    break;
                case "notesOutsideScale":
                    this._doc.prefs.notesOutsideScale = !this._doc.prefs.notesOutsideScale;
                    break;
                case "setDefaultScale":
                    this._doc.prefs.defaultScale = this._doc.song.scale;
                    break;
                case "showChannels":
                    this._doc.prefs.showChannels = !this._doc.prefs.showChannels;
                    break;
                case "showScrollBar":
                    this._doc.prefs.showScrollBar = !this._doc.prefs.showScrollBar;
                    break;
                case "alwaysFineNoteVol":
                    this._doc.prefs.alwaysFineNoteVol = !this._doc.prefs.alwaysFineNoteVol;
                    break;
                case "enableChannelMuting":
                    this._doc.prefs.enableChannelMuting = !this._doc.prefs.enableChannelMuting;
                    for (const channel of this._doc.song.channels)
                        channel.muted = false;
                    this._doc.song.loopType == 1;
                    this._doc.synth.loopRepeatCount = -1;
                    this._loopEditor.container.style.display = "";
                    break;
                case "displayBrowserUrl":
                    this._doc.toggleDisplayBrowserUrl();
                    break;
                case "displayVolumeBar":
                    this._doc.prefs.displayVolumeBar = !this._doc.prefs.displayVolumeBar;
                    break;
                case "notesFlashWhenPlayed":
                    this._doc.prefs.notesFlashWhenPlayed = !this._doc.prefs.notesFlashWhenPlayed;
                    break;
                case "oldModNotes":
                    this._doc.prefs.oldModNotes = !this._doc.prefs.oldModNotes;
                    break;
                case "selectionCounter":
                    this._doc.prefs.selectionCounter = !this._doc.prefs.selectionCounter;
                    break;
                case "layout":
                    this._openPrompt("layout");
                    break;
                case "colorTheme":
                    this._openPrompt("theme");
                    break;
                case "customTheme":
                    this._openPrompt("custom");
                    break;
                case "customFont":
                    this._openPrompt("customFont");
                    break;
                case "recordingSetup":
                    this._openPrompt("recordingSetup");
                    break;
                case "showOscilloscope":
                    this._doc.prefs.showOscilloscope = !this._doc.prefs.showOscilloscope;
                    break;
                case "showDescription":
                    this._doc.prefs.showDescription = !this._doc.prefs.showDescription;
                    break;
                case "showInstrumentScrollbars":
                    this._doc.prefs.showInstrumentScrollbars = !this._doc.prefs.showInstrumentScrollbars;
                    break;
                case "showSampleLoadingStatus":
                    this._doc.prefs.showSampleLoadingStatus = !this._doc.prefs.showSampleLoadingStatus;
                    break;
                case "closePromptByClickoff":
                    this._doc.prefs.closePromptByClickoff = !this._doc.prefs.closePromptByClickoff;
                    break;
                case "promptSongDetails":
                    this._doc.prefs.promptSongDetails = !this._doc.prefs.promptSongDetails;
                    break;
                case "instrumentCopyPaste":
                    this._doc.prefs.instrumentCopyPaste = !this._doc.prefs.instrumentCopyPaste;
                    break;
                case "instrumentImportExport":
                    this._doc.prefs.instrumentImportExport = !this._doc.prefs.instrumentImportExport;
                    break;
                case "frostedGlassBackground":
                    this._doc.prefs.frostedGlassBackground = !this._doc.prefs.frostedGlassBackground;
                    break;
                case "displayShortcutButtons":
                    this._doc.prefs.displayShortcutButtons = !this._doc.prefs.displayShortcutButtons;
                    break;
                case "oldMobileLayout":
                    this._doc.prefs.oldMobileLayout = !this._doc.prefs.oldMobileLayout;
                    location.reload();
                    break;
                case "instrumentSettingsSimplifier":
                    this._doc.prefs.instrumentSettingsSimplifier = !this._doc.prefs.instrumentSettingsSimplifier;
                    break;
            }
            this._optionsMenu.selectedIndex = 0;
            this._doc.notifier.changed();
            this._doc.prefs.save();
        };
        this._customWavePresetHandler = (event) => {
            let customWaveArray = new Float32Array(64);
            let index = this._customWavePresetDrop.selectedIndex - 1;
            let maxValue = Number.MIN_VALUE;
            let minValue = Number.MAX_VALUE;
            let arrayPoint = 0;
            let arrayStep = (Config.chipWaves[index].samples.length - 1) / 64.0;
            for (let i = 0; i < 64; i++) {
                customWaveArray[i] = (Config.chipWaves[index].samples[Math.floor(arrayPoint)] - Config.chipWaves[index].samples[(Math.floor(arrayPoint) + 1)]) / arrayStep;
                if (customWaveArray[i] < minValue)
                    minValue = customWaveArray[i];
                if (customWaveArray[i] > maxValue)
                    maxValue = customWaveArray[i];
                arrayPoint += arrayStep;
            }
            for (let i = 0; i < 64; i++) {
                customWaveArray[i] -= minValue;
                customWaveArray[i] /= (maxValue - minValue);
                customWaveArray[i] *= 48.0;
                customWaveArray[i] -= 24.0;
                customWaveArray[i] = Math.ceil(customWaveArray[i]);
                this._customWaveDrawCanvas.newArray[i] = customWaveArray[i];
            }
            this._doc.record(new ChangeCustomWave(this._doc, customWaveArray));
            this._doc.record(new ChangeVolume(this._doc, +this._instrumentVolumeSlider.input.value, -Config.volumeRange / 2 + Math.round(Math.sqrt(Config.chipWaves[index].expression) * Config.volumeRange / 2)));
            this._customWavePresetDrop.selectedIndex = 0;
            this._doc.notifier.changed();
            this._doc.prefs.save();
        };
        this._doc.notifier.watch(this.whenUpdated);
        this._doc.modRecordingHandler = () => { this.handleModRecording(); };
        new MidiInputHandler(this._doc);
        window.addEventListener("resize", this.whenUpdated);
        window.requestAnimationFrame(this.updatePlayButton);
        window.requestAnimationFrame(this._animate);
        if (!("share" in navigator)) {
            this._fileMenu.removeChild(this._fileMenu.querySelector("[value='shareUrl']"));
        }
        this._scaleSelect.appendChild(optgroup({ label: "Edit" }, option({ value: "forceScale" }, "Snap Notes To Scale"), option({ value: "customize" }, "Edit Custom Scale")));
        this._keySelect.appendChild(optgroup({ label: "Edit" }, option({ value: "detectKey" }, "Detect Key")));
        this._rhythmSelect.appendChild(optgroup({ label: "Edit" }, option({ value: "forceRhythm" }, "Snap Notes To Rhythm")));
        this._vibratoSelect.appendChild(option({ hidden: true, value: 5 }, "custom"));
        this._unisonSelect.appendChild(option({ hidden: true, value: Config.unisons.length }, "custom"));
        this._showModSliders = new Array(Config.modulators.length);
        this._modSliderValues = new Array(Config.modulators.length);
        this._phaseModGroup.appendChild(div({ class: "selectRow", style: `color: ${ColorConfig.secondaryText}; height: 1em; margin-top: 0.5em;` }, div({ style: "margin-right: .1em; visibility: hidden;" }, 1 + "."), div({ style: "width: 3em; margin-right: .3em;", class: "tip", onclick: () => this._openPrompt("operatorFrequency") }, "Freq:"), div({ class: "tip", onclick: () => this._openPrompt("operatorVolume") }, "Volume:")));
        for (let i = 0; i < Config.operatorCount + 2; i++) {
            const operatorIndex = i;
            const operatorNumber = div({ style: "margin-right: 0px; color: " + ColorConfig.secondaryText + ";" }, i + 1 + "");
            const frequencySelect = buildOptions(select({ style: "width: 100%;", title: "Frequency" }), Config.operatorFrequencies.map(freq => freq.name));
            const amplitudeSlider = new Slider(input({ type: "range", min: "0", max: Config.operatorAmplitudeMax, value: "0", step: "1", title: "Volume" }), this._doc, (oldValue, newValue) => new ChangeOperatorAmplitude(this._doc, operatorIndex, oldValue, newValue), false);
            const waveformSelect = buildOptions(select({ style: "width: 100%;", title: "Waveform" }), Config.operatorWaves.map(wave => wave.name));
            const waveformDropdown = button({ style: "margin-left:0em; margin-right: 2px; height:1.5em; width: 8px; max-width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(4, i) }, "▼");
            const waveformDropdownHint = span({ class: "tip", style: "margin-left: 10px;", onclick: () => this._openPrompt("operatorWaveform") }, "Wave:");
            const waveformPulsewidthSlider = new Slider(input({ style: "margin-left: 10px; width: 85%;", type: "range", min: "0", max: Config.pwmOperatorWaves.length - 1, value: "0", step: "1", title: "Pulse Width" }), this._doc, (oldValue, newValue) => new ChangeOperatorPulseWidth(this._doc, operatorIndex, oldValue, newValue), true);
            const waveformDropdownRow = div({ class: "selectRow" }, waveformDropdownHint, waveformPulsewidthSlider.container, div({ class: "selectContainer", style: "width: 6em; margin-left: .3em;" }, waveformSelect));
            const waveformDropdownGroup = div({ class: "operatorRow" }, waveformDropdownRow);
            const row = div({ class: "selectRow" }, operatorNumber, waveformDropdown, div({ class: "selectContainer", style: "width: 3em; margin-right: .3em;" }, frequencySelect), amplitudeSlider.container);
            this._phaseModGroup.appendChild(row);
            this._operatorRows[i] = row;
            this._operatorAmplitudeSliders[i] = amplitudeSlider;
            this._operatorFrequencySelects[i] = frequencySelect;
            this._operatorDropdowns[i] = waveformDropdown;
            this._operatorWaveformHints[i] = waveformDropdownHint;
            this._operatorWaveformSelects[i] = waveformSelect;
            this._operatorWaveformPulsewidthSliders[i] = waveformPulsewidthSlider;
            this._operatorDropdownRows[i] = waveformDropdownRow;
            this._phaseModGroup.appendChild(waveformDropdownGroup);
            this._operatorDropdownGroups[i] = waveformDropdownGroup;
            this._openOperatorDropdowns[i] = false;
            waveformSelect.addEventListener("change", () => {
                this._doc.record(new ChangeOperatorWaveform(this._doc, operatorIndex, waveformSelect.selectedIndex));
            });
            frequencySelect.addEventListener("change", () => {
                this._doc.record(new ChangeOperatorFrequency(this._doc, operatorIndex, frequencySelect.selectedIndex));
            });
        }
        this._drumsetGroup.appendChild(div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("drumsetEnvelope") }, "Envelope:"), span({ class: "tip", onclick: () => this._openPrompt("drumsetSpectrum") }, "Spectrum:"), this._drumsetZoom));
        for (let i = Config.drumCount - 1; i >= 0; i--) {
            const drumIndex = i;
            const spectrumEditor = new SpectrumEditor(this._doc, drumIndex);
            spectrumEditor.container.addEventListener("mousedown", this.refocusStage);
            this._drumsetSpectrumEditors[i] = spectrumEditor;
            const envelopeSelect = buildOptions(select({ style: "width: 100%;", title: "Filter Envelope" }), Config.envelopes.map(envelope => envelope.name));
            this._drumsetEnvelopeSelects[i] = envelopeSelect;
            envelopeSelect.addEventListener("change", () => {
                this._doc.record(new ChangeDrumsetEnvelope(this._doc, drumIndex, envelopeSelect.selectedIndex));
            });
            const row = div({ class: "selectRow" }, div({ class: "selectContainer", style: "width: 5em; margin-right: .3em;" }, envelopeSelect), this._drumsetSpectrumEditors[i].container);
            this._drumsetGroup.appendChild(row);
        }
        this._modNameRows = [];
        this._modChannelBoxes = [];
        this._modInstrumentBoxes = [];
        this._modSetRows = [];
        this._modSetBoxes = [];
        this._modFilterRows = [];
        this._modFilterBoxes = [];
        this._modTargetIndicators = [];
        for (let mod = 0; mod < Config.modCount; mod++) {
            let modChannelBox = select({ style: "width: 100%; color: currentColor; text-overflow:ellipsis;" });
            let modInstrumentBox = select({ style: "width: 100%; color: currentColor;" });
            let modNameRow = div({ class: "operatorRow", style: "height: 1em; margin-bottom: 0.65em;" }, div({ class: "tip", style: "width: 10%; max-width: 5.4em;", id: "modChannelText" + mod, onclick: () => this._openPrompt("modChannel") }, "Ch:"), div({ class: "selectContainer", style: 'width: 35%;' }, modChannelBox), div({ class: "tip", style: "width: 1.2em; margin-left: 0.8em;", id: "modInstrumentText" + mod, onclick: () => this._openPrompt("modInstrument") }, "Ins:"), div({ class: "selectContainer", style: "width: 10%;" }, modInstrumentBox));
            let modSetBox = select();
            let modFilterBox = select();
            let modSetRow = div({ class: "selectRow", id: "modSettingText" + mod, style: "margin-bottom: 0.9em; color: currentColor;" }, span({ class: "tip", onclick: () => this._openPrompt("modSet") }, "Setting: "), span({ class: "tip", style: "font-size:x-small;", onclick: () => this._openPrompt("modSetInfo" + mod) }, "?"), div({ class: "selectContainer" }, modSetBox));
            let modFilterRow = div({ class: "selectRow", id: "modFilterText" + mod, style: "margin-bottom: 0.9em; color: currentColor;" }, span({ class: "tip", onclick: () => this._openPrompt("modFilter" + mod) }, "Target: "), div({ class: "selectContainer" }, modFilterBox));
            let modTarget = SVG.svg({ style: "transform: translate(0px, 1px);", width: "1.5em", height: "1em", viewBox: "0 0 200 200" }, [
                SVG.path({ d: "M90 155 l0 -45 -45 0 c-25 0 -45 -4 -45 -10 0 -5 20 -10 45 -10 l45 0 0 -45 c0 -25 5 -45 10 -45 6 0 10 20 10 45 l0 45 45 0 c25 0 45 5 45 10 0 6 -20 10 -45 10 l -45 0 0 45 c0 25 -4 45 -10 45 -5 0 -10 -20 -10 -45z" }),
                SVG.path({ d: "M42 158 c-15 -15 -16 -38 -2 -38 6 0 10 7 10 15 0 8 7 15 15 15 8 0 15 5 15 10 0 14 -23 13 -38 -2z" }),
                SVG.path({ d: "M120 160 c0 -5 7 -10 15 -10 8 0 15 -7 15 -15 0 -8 5 -15 10 -15 14 0 13 23 -2 38 -15 15 -38 16 -38 2z" }),
                SVG.path({ d: "M32 58 c3 -23 48 -40 48 -19 0 6 -7 11 -15 11 -8 0 -15 7 -15 15 0 8 -5 15 -11 15 -6 0 -9 -10 -7 -22z" }),
                SVG.path({ d: "M150 65 c0 -8 -7 -15 -15 -15 -8 0 -15 -4 -15 -10 0 -14 23 -13 38 2 15 15 16 38 2 38 -5 0 -10 -7 -10 -15z" })
            ]);
            this._modNameRows.push(modNameRow);
            this._modChannelBoxes.push(modChannelBox);
            this._modInstrumentBoxes.push(modInstrumentBox);
            this._modSetRows.push(modSetRow);
            this._modSetBoxes.push(modSetBox);
            this._modFilterRows.push(modFilterRow);
            this._modFilterBoxes.push(modFilterBox);
            this._modTargetIndicators.push(modTarget);
            this._modulatorGroup.appendChild(div({ style: "margin: 3px 0; font-weight: bold; margin-bottom: 0.7em; text-align: center; color: " + ColorConfig.secondaryText + "; background: " + ColorConfig.uiWidgetBackground + ";" }, ["Modulator " + (mod + 1), modTarget]));
            this._modulatorGroup.appendChild(modNameRow);
            this._modulatorGroup.appendChild(modSetRow);
            this._modulatorGroup.appendChild(modFilterRow);
        }
        this._pitchShiftSlider.container.style.setProperty("transform", "translate(0px, 3px)");
        this._pitchShiftSlider.container.style.setProperty("width", "100%");
        this._fileMenu.addEventListener("change", this._fileMenuHandler);
        this._editMenu.addEventListener("change", this._editMenuHandler);
        this._optionsMenu.addEventListener("change", this._optionsMenuHandler);
        this._customWavePresetDrop.addEventListener("change", this._customWavePresetHandler);
        this._tempoStepper.addEventListener("change", this._whenSetTempo);
        this._scaleSelect.addEventListener("change", this._whenSetScale);
        this._keySelect.addEventListener("change", this._whenSetKey);
        this._octaveStepper.addEventListener("change", this._whenSetOctave);
        this._rhythmSelect.addEventListener("change", this._whenSetRhythm);
        this._algorithmSelect.addEventListener("change", this._whenSetAlgorithm);
        this._instrumentsButtonBar.addEventListener("click", this._whenSelectInstrument);
        this._feedbackTypeSelect.addEventListener("change", this._whenSetFeedbackType);
        this._algorithm6OpSelect.addEventListener("change", this._whenSet6OpAlgorithm);
        this._feedback6OpTypeSelect.addEventListener("change", this._whenSet6OpFeedbackType);
        this._chipWaveSelect.addEventListener("change", this._whenSetChipWave);
        this._ringModWaveSelect.addEventListener("change", this._whenSetRMChipWave);
        this._useChipWaveAdvancedLoopControlsBox.addEventListener("input", this._whenSetUseChipWaveAdvancedLoopControls);
        this._chipWaveLoopModeSelect.addEventListener("change", this._whenSetChipWaveLoopMode);
        this._chipWaveLoopStartStepper.addEventListener("change", this._whenSetChipWaveLoopStart);
        this._chipWaveLoopEndStepper.addEventListener("change", this._whenSetChipWaveLoopEnd);
        this._setChipWaveLoopEndToEndButton.addEventListener("click", this._whenSetChipWaveLoopEndToEnd);
        this._chipWaveStartOffsetStepper.addEventListener("change", this._whenSetChipWaveStartOffset);
        this._chipWavePlayBackwardsBox.addEventListener("input", this._whenSetChipWavePlayBackwards);
        this._sampleLoadingStatusContainer.addEventListener("click", this._whenSampleLoadingStatusClicked);
        this._chipNoiseSelect.addEventListener("change", this._whenSetNoiseWave);
        this._transitionSelect.addEventListener("change", this._whenSetTransition);
        this._effectsSelect.addEventListener("change", this._whenSetEffects);
        this._unisonSelect.addEventListener("change", this._whenSetUnison);
        this._chordSelect.addEventListener("change", this._whenSetChord);
        this._vibratoSelect.addEventListener("change", this._whenSetVibrato);
        this._vibratoTypeSelect.addEventListener("change", this._whenSetVibratoType);
        this._playButton.addEventListener("click", this.togglePlay);
        this._pauseButton.addEventListener("click", this.togglePlay);
        this._mobilePlayButton.addEventListener("click", this.togglePlay);
        this._mobilePauseButton.addEventListener("click", this.togglePlay);
        this._mobilePatternButton.addEventListener("click", this._displayPatternEditor);
        this._mobileTrackButton.addEventListener("click", this._displayTrackEditor);
        this._mobileSettingsButton.addEventListener("click", this._displaySettingsEditor);
        this._muteEditor._loopButtonInput.addEventListener("click", this._loopTypeEvent);
        this._recordButton.addEventListener("click", this._toggleRecord);
        this._stopButton.addEventListener("click", this._toggleRecord);
        this._recordButton.addEventListener("contextmenu", (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                this._toggleRecord();
            }
        });
        this._stopButton.addEventListener("contextmenu", (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                this._toggleRecord();
            }
        });
        this._prevBarButton.addEventListener("click", this._whenPrevBarPressed);
        this._nextBarButton.addEventListener("click", this._whenNextBarPressed);
        this._mobilePrevBarButton.addEventListener("click", this._whenPrevBarPressed);
        this._mobileNextBarButton.addEventListener("click", this._whenNextBarPressed);
        this._volumeSlider.input.addEventListener("input", this._setVolumeSlider);
        this._zoomInButton.addEventListener("click", this._zoomIn);
        this._zoomOutButton.addEventListener("click", this._zoomOut);
        this._undoButton.addEventListener("click", this._undo);
        this._redoButton.addEventListener("click", this._redo);
        this._copyPatternButton.addEventListener("click", this._copy);
        this._pastePatternButton.addEventListener("click", this._paste);
        this._insertChannelButton.addEventListener("click", this._insertChannel);
        this._deleteChannelButton.addEventListener("click", this._deleteChannel);
        this._selectAllButton.addEventListener("click", this._selectAll);
        this._duplicateButton.addEventListener("click", this._duplicate);
        this._notesUpButton.addEventListener("click", this._notesUp);
        this._notesDownButton.addEventListener("click", this._notesDown);
        this._loopBarButton.addEventListener("click", this._tempLoopBar);
        this._fullscreenButton.addEventListener("click", this._goFullscreen);
        this._patternArea.addEventListener("mousedown", this._refocusStageNotEditing);
        this._trackArea.addEventListener("mousedown", this.refocusStage);
        this._patternArea.addEventListener('dragover', this._dropHandler);
        this._volumeSlider.container.style.setProperty("flex-grow", "1");
        this._volumeSlider.container.style.setProperty("display", "flex");
        this._volumeBarContainer.style.setProperty("flex-grow", "1");
        this._volumeBarContainer.style.setProperty("display", "flex");
        this._volumeSlider.container.style.setProperty("--mod-color", ColorConfig.multiplicativeModSlider);
        this._volumeSlider.container.style.setProperty("--mod-border-radius", "50%");
        this._instrumentVolumeSlider.container.style.setProperty("--mod-color", ColorConfig.multiplicativeModSlider);
        this._instrumentVolumeSlider.container.style.setProperty("--mod-border-radius", "50%");
        this._feedbackAmplitudeSlider.container.style.setProperty("--mod-color", ColorConfig.multiplicativeModSlider);
        this._feedbackAmplitudeSlider.container.style.setProperty("--mod-border-radius", "50%");
        for (let i = 0; i < Config.operatorCount + 2; i++) {
            this._operatorAmplitudeSliders[i].container.style.setProperty("--mod-color", ColorConfig.multiplicativeModSlider);
            this._operatorAmplitudeSliders[i].container.style.setProperty("--mod-border-radius", "50%");
        }
        let thisRef = this;
        for (let mod = 0; mod < Config.modCount; mod++) {
            this._modChannelBoxes[mod].addEventListener("change", function () { thisRef._whenSetModChannel(mod); });
            this._modInstrumentBoxes[mod].addEventListener("change", function () { thisRef._whenSetModInstrument(mod); });
            this._modSetBoxes[mod].addEventListener("change", function () { thisRef._whenSetModSetting(mod); });
            this._modFilterBoxes[mod].addEventListener("change", function () { thisRef._whenSetModFilter(mod); });
            this._modTargetIndicators[mod].addEventListener("click", function () { thisRef._whenClickModTarget(mod); });
        }
        this._jumpToModIndicator.addEventListener("click", function () { thisRef._whenClickJumpToModTarget(); });
        this._patternArea.addEventListener("mousedown", this.refocusStage);
        this._fadeInOutEditor.container.addEventListener("mousedown", this.refocusStage);
        this._spectrumEditor.container.addEventListener("mousedown", this.refocusStage);
        this._eqFilterEditor.container.addEventListener("mousedown", this.refocusStage);
        this._noteFilterEditor.container.addEventListener("mousedown", this.refocusStage);
        this._harmonicsEditor.container.addEventListener("mousedown", this.refocusStage);
        this._tempoStepper.addEventListener("keydown", this._tempoStepperCaptureNumberKeys, false);
        this._addEnvelopeButton.addEventListener("click", this._addNewEnvelope);
        this._patternArea.addEventListener("contextmenu", this._disableCtrlContextMenu);
        this._trackArea.addEventListener("contextmenu", this._disableCtrlContextMenu);
        this.mainLayer.addEventListener("keydown", this._whenKeyPressed);
        this.mainLayer.addEventListener("keyup", this._whenKeyReleased);
        this.mainLayer.addEventListener("focusin", this._onFocusIn);
        this._instrumentCopyButton.addEventListener("click", this._copyInstrument.bind(this));
        this._instrumentPasteButton.addEventListener("click", this._pasteInstrument.bind(this));
        this._instrumentExportButton.addEventListener("click", this._exportInstruments.bind(this));
        this._instrumentImportButton.addEventListener("click", this._importInstruments.bind(this));
        sampleLoadEvents.addEventListener("sampleloaded", this._updateSampleLoadingBar.bind(this));
        this._instrumentVolumeSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangeVolume(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].volume, Math.min(25.0, Math.max(-25.0, Math.round(+this._instrumentVolumeSliderInputBox.value))))); });
        this._panSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangePan(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].pan, Math.min(100.0, Math.max(0.0, Math.round(+this._panSliderInputBox.value))))); });
        this._pwmSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangePulseWidth(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].pulseWidth, Math.min(Config.pulseWidthRange, Math.max(1.0, Math.round(+this._pwmSliderInputBox.value))))); });
        this._detuneSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangeDetune(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].detune, Math.min(Config.detuneMax - Config.detuneCenter, Math.max(Config.detuneMin - Config.detuneCenter, Math.round(+this._detuneSliderInputBox.value))))); });
        this._rmHzOffsetSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangeRmHzOffset(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].rmHzOffset, Math.min(Config.rmHzOffsetMax - Config.rmHzOffsetCenter, Math.max(Config.rmHzOffsetMin - Config.rmHzOffsetCenter, Math.round(+this._rmHzOffsetSliderInputBox.value))))); });
        this._unisonVoicesInputBox.addEventListener("input", () => { this._doc.record(new ChangeUnisonVoices(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].unisonVoices, Math.min(Config.unisonVoicesMax, Math.max(Config.unisonVoicesMin, Math.round(+this._unisonVoicesInputBox.value))))); });
        this._unisonSpreadInputBox.addEventListener("input", () => { this._doc.record(new ChangeUnisonSpread(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].unisonSpread, Math.min(Config.unisonSpreadMax, Math.max(Config.unisonSpreadMin, +this._unisonSpreadInputBox.value)))); });
        this._unisonOffsetInputBox.addEventListener("input", () => { this._doc.record(new ChangeUnisonOffset(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].unisonOffset, Math.min(Config.unisonOffsetMax, Math.max(Config.unisonOffsetMin, +this._unisonOffsetInputBox.value)))); });
        this._unisonExpressionInputBox.addEventListener("input", () => { this._doc.record(new ChangeUnisonExpression(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].unisonExpression, Math.min(Config.unisonExpressionMax, Math.max(Config.unisonExpressionMin, +this._unisonExpressionInputBox.value)))); });
        this._unisonSignInputBox.addEventListener("input", () => { this._doc.record(new ChangeUnisonSign(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].unisonSign, Math.min(Config.unisonSignMax, Math.max(Config.unisonSignMin, +this._unisonSignInputBox.value)))); });
        this._unisonBuzzesBox.addEventListener("input", () => { this._doc.record(new ChangeUnisonBuzzing(this._doc, this._unisonBuzzesBox.checked)); });
        this._customWaveDraw.addEventListener("input", () => { this._doc.record(new ChangeCustomWave(this._doc, this._customWaveDrawCanvas.newArray)); });
        this._twoNoteArpBox.addEventListener("input", () => { this._doc.record(new ChangeFastTwoNoteArp(this._doc, this._twoNoteArpBox.checked)); });
        this._clicklessTransitionBox.addEventListener("input", () => { this._doc.record(new ChangeClicklessTransition(this._doc, this._clicklessTransitionBox.checked)); });
        this._aliasingBox.addEventListener("input", () => { this._doc.record(new ChangeAliasing(this._doc, this._aliasingBox.checked)); });
        this._invertWaveBox.addEventListener("input", () => { this._doc.record(new ChangeInvertWave(this._doc, this._invertWaveBox.checked)); });
        this._discreteEnvelopeBox.addEventListener("input", () => { this._doc.record(new ChangeDiscreteEnvelope(this._doc, this._discreteEnvelopeBox.checked)); });
        this._upperNoteLimitInputBox.addEventListener("input", () => { this._doc.record(new ChangeUpperLimit(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].upperNoteLimit, (Math.min(Config.maxPitch, Math.max(0.0, Math.round(+this._upperNoteLimitInputBox.value)))))); });
        this._lowerNoteLimitInputBox.addEventListener("input", () => { this._doc.record(new ChangeLowerLimit(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].lowerNoteLimit, (Math.min(Config.maxPitch, Math.max(0.0, Math.round(+this._lowerNoteLimitInputBox.value)))))); });
        this._songDetailsButton.addEventListener("click", this._openDetails);
        this._promptContainer.addEventListener("click", (event) => {
            if (this._doc.prefs.closePromptByClickoff === true) {
                if (this.prompt != null && this.prompt.gotMouseUp === true)
                    return;
                if (event.target == this._promptContainer) {
                    this._doc.undo();
                }
            }
        });
        this._trackAndMuteContainer.addEventListener("scroll", this._onTrackAreaScroll, { capture: false, passive: true });
        if (isMobile) {
            const autoPlayOption = this._optionsMenu.querySelector("[value=autoPlay]");
            autoPlayOption.disabled = true;
            autoPlayOption.setAttribute("hidden", "");
            const instOption = this._optionsMenu.querySelector("[value=instrumentSettingsSimplifier]");
            instOption.disabled = true;
            instOption.setAttribute("hidden", "");
        }
        else {
            const oldMobileLayoutOption = this._optionsMenu.querySelector("[value=oldMobileLayout]");
            oldMobileLayoutOption.disabled = true;
            oldMobileLayoutOption.setAttribute("hidden", "");
        }
        if (window.screen.availWidth < 710) {
            const layoutOption = this._optionsMenu.querySelector("[value=layout]");
            layoutOption.disabled = true;
            layoutOption.setAttribute("hidden", "");
            const MobileButtonOption = this._optionsMenu.querySelector("[value=displayShortcutButtons]");
            MobileButtonOption.disabled = true;
            MobileButtonOption.setAttribute("hidden", "");
            if (this._doc.prefs.oldMobileLayout == false) {
                const showDescOption = this._optionsMenu.querySelector("[value=showDescription]");
                showDescOption.disabled = true;
                showDescOption.setAttribute("hidden", "");
            }
        }
    }
    _updateSampleLoadingBar(_e) {
        const e = _e;
        let sampleNum = false;
        const percent = (e.totalSamples === 0
            ? 0
            : Math.floor((e.samplesLoaded / e.totalSamples) * 100));
        const failedPercent = (e.totalSamples === 0
            ? 0
            : Math.floor((e.samplesFailed / e.totalSamples) * 100));
        sampleNum = Boolean(percent > 0 && failedPercent > 0);
        this._sampleLoadingBar.style.width = `${percent}%`;
        this._sampleFailedBar.style.width = `${failedPercent + Number(sampleNum)}%`;
        if (e.totalSamples != 0) {
            this._sampleLoadingBarContainer.style.backgroundColor = "var(--indicator-secondary)";
        }
        else {
            this._sampleLoadingBarContainer.style.backgroundColor = "var(--empty-sample-bar, var(--indicator-secondary))";
        }
    }
    _toggleAlgorithmCanvas(e) {
        if (this._customAlgorithmCanvas.mode != "feedback") {
            this._customAlgorithmCanvas.mode = "feedback";
            e.target.textContent = "A";
            this._algorithmCanvasSwitch.value = "feedback";
        }
        else {
            this._customAlgorithmCanvas.mode = "algorithm";
            e.target.textContent = "F";
        }
        this._customAlgorithmCanvas.redrawCanvas();
    }
    _toggleDropdownMenu(dropdown, submenu = 0, subtype = null) {
        let target = this._vibratoDropdown;
        let group = this._vibratoDropdownGroup;
        switch (dropdown) {
            case 7:
                target = this._envelopeDropdown;
                this._openEnvelopeDropdown = this._openEnvelopeDropdown ? false : true;
                group = this._envelopeDropdownGroup;
                break;
            case 0:
                target = this._vibratoDropdown;
                this._openVibratoDropdown = this._openVibratoDropdown ? false : true;
                group = this._vibratoDropdownGroup;
                break;
            case 1:
                target = this._panDropdown;
                this._openPanDropdown = this._openPanDropdown ? false : true;
                group = this._panDropdownGroup;
                break;
            case 2:
                target = this._chordDropdown;
                this._openChordDropdown = this._openChordDropdown ? false : true;
                group = this._chordDropdownGroup;
                break;
            case 3:
                target = this._transitionDropdown;
                this._openTransitionDropdown = this._openTransitionDropdown ? false : true;
                group = this._transitionDropdownGroup;
                break;
            case 4:
                target = this._operatorDropdowns[submenu];
                this._openOperatorDropdowns[submenu] = this._openOperatorDropdowns[submenu] ? false : true;
                group = this._operatorDropdownGroups[submenu];
                break;
            case 5:
                target = this._pulseWidthDropdown;
                this._openPulseWidthDropdown = this._openPulseWidthDropdown ? false : true;
                group = this._pulseWidthDropdownGroup;
                break;
            case 6:
                target = this._unisonDropdown;
                this._openUnisonDropdown = this._openUnisonDropdown ? false : true;
                group = this._unisonDropdownGroup;
                break;
        }
        if (target.textContent == "▼") {
            let instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
            target.textContent = "▲";
            if (group != this._chordDropdownGroup) {
                group.style.display = "";
            }
            else if ((instrument.chord == Config.chords.dictionary["arpeggio"].index) || (instrument.chord == Config.chords.dictionary["strum"].index)) {
                group.style.display = "";
            }
            for (let i = 0; i < group.children.length; i++) {
                setTimeout(() => {
                    group.children[i].style.animationDelay = '0.17s';
                    group.children[i].style.opacity = '1';
                });
            }
        }
        else {
            for (let i = 0; i < group.children.length; i++) {
                group.children[i].style.animationDelay = '0s';
                group.children[i].style.opacity = '0';
            }
            target.textContent = "▼";
            group.style.display = "none";
        }
    }
    _modSliderUpdate() {
        if (!this._doc.synth.playing) {
            this._hasActiveModSliders = false;
            for (let setting = 0; setting < Config.modulators.length; setting++) {
                if (this._showModSliders[setting] == true) {
                    this._showModSliders[setting] = false;
                    this._newShowModSliders[setting] = false;
                    let slider = this.getSliderForModSetting(setting);
                    if (slider != null) {
                        slider.container.classList.remove("modSlider");
                    }
                }
            }
        }
        else {
            let instrument = this._doc.getCurrentInstrument();
            const anyModActive = this._doc.synth.isAnyModActive(this._doc.channel, instrument);
            if (anyModActive) {
                let instrument = this._doc.getCurrentInstrument();
                function updateModSlider(editor, slider, setting, channel, instrument) {
                    if (editor._doc.synth.isModActive(setting, channel, instrument)) {
                        let currentVal = (editor._doc.synth.getModValue(setting, channel, instrument, false) - Config.modulators[setting].convertRealFactor) / Config.modulators[setting].maxRawVol;
                        if (Config.modulators[setting].invertSliderIndicator == true) {
                            currentVal = 1 - currentVal;
                        }
                        if (currentVal != editor._modSliderValues[setting]) {
                            editor._modSliderValues[setting] = currentVal;
                            slider.container.style.setProperty("--mod-position", (currentVal * 96.0 + 2.0) + "%");
                        }
                        return true;
                    }
                    return false;
                }
                for (let setting = 0; setting < Config.modulators.length; setting++) {
                    this._newShowModSliders[setting] = this._showModSliders[setting];
                    let slider = this.getSliderForModSetting(setting);
                    if (slider != null) {
                        this._newShowModSliders[setting] = updateModSlider(this, slider, setting, this._doc.channel, instrument);
                    }
                }
            }
            else if (this._hasActiveModSliders) {
                for (let setting = 0; setting < Config.modulators.length; setting++) {
                    this._newShowModSliders[setting] = false;
                }
            }
            if (anyModActive || this._hasActiveModSliders) {
                let anySliderActive = false;
                for (let setting = 0; setting < Config.modulators.length; setting++) {
                    if (this._newShowModSliders[setting] != this._showModSliders[setting]) {
                        this._showModSliders[setting] = this._newShowModSliders[setting];
                        let slider = this.getSliderForModSetting(setting);
                        if (slider != null) {
                            if (this._showModSliders[setting] == true) {
                                slider.container.classList.add("modSlider");
                            }
                            else {
                                slider.container.classList.remove("modSlider");
                            }
                        }
                    }
                    if (this._newShowModSliders[setting] == true)
                        anySliderActive = true;
                }
                this._hasActiveModSliders = anySliderActive;
            }
        }
    }
    getSliderForModSetting(setting) {
        switch (setting) {
            case Config.modulators.dictionary["pan"].index:
                return this._panSlider;
            case Config.modulators.dictionary["detune"].index:
                return this._detuneSlider;
            case Config.modulators.dictionary["fm slider 1"].index:
                return this._operatorAmplitudeSliders[0];
            case Config.modulators.dictionary["fm slider 2"].index:
                return this._operatorAmplitudeSliders[1];
            case Config.modulators.dictionary["fm slider 3"].index:
                return this._operatorAmplitudeSliders[2];
            case Config.modulators.dictionary["fm slider 4"].index:
                return this._operatorAmplitudeSliders[3];
            case Config.modulators.dictionary["fm feedback"].index:
                return this._feedbackAmplitudeSlider;
            case Config.modulators.dictionary["pulse width"].index:
                return this._pulseWidthSlider;
            case Config.modulators.dictionary["decimal offset"].index:
                return this._decimalOffsetSlider;
            case Config.modulators.dictionary["reverb"].index:
                return this._reverbSlider;
            case Config.modulators.dictionary["distortion"].index:
                return this._distortionSlider;
            case Config.modulators.dictionary["ring modulation"].index:
                return this._ringModSlider;
            case Config.modulators.dictionary["ring mod hertz"].index:
                return this._ringModHzSlider;
            case Config.modulators.dictionary["note volume"].index:
                if (!this._showModSliders[Config.modulators.dictionary["mix volume"].index])
                    return this._instrumentVolumeSlider;
                return null;
            case Config.modulators.dictionary["mix volume"].index:
                return this._instrumentVolumeSlider;
            case Config.modulators.dictionary["vibrato depth"].index:
                return this._vibratoDepthSlider;
            case Config.modulators.dictionary["vibrato speed"].index:
                return this._vibratoSpeedSlider;
            case Config.modulators.dictionary["vibrato delay"].index:
                return this._vibratoDelaySlider;
            case Config.modulators.dictionary["arp speed"].index:
                return this._arpeggioSpeedSlider;
            case Config.modulators.dictionary["pan delay"].index:
                return this._panDelaySlider;
            case Config.modulators.dictionary["tempo"].index:
                return this._tempoSlider;
            case Config.modulators.dictionary["song volume"].index:
                return this._volumeSlider;
            case Config.modulators.dictionary["eq filt cut"].index:
                return this._eqFilterSimpleCutSlider;
            case Config.modulators.dictionary["eq filt peak"].index:
                return this._eqFilterSimplePeakSlider;
            case Config.modulators.dictionary["note filt cut"].index:
                return this._noteFilterSimpleCutSlider;
            case Config.modulators.dictionary["note filt peak"].index:
                return this._noteFilterSimplePeakSlider;
            case Config.modulators.dictionary["bit crush"].index:
                return this._bitcrusherQuantizationSlider;
            case Config.modulators.dictionary["freq crush"].index:
                return this._bitcrusherFreqSlider;
            case Config.modulators.dictionary["pitch shift"].index:
                return this._pitchShiftSlider;
            case Config.modulators.dictionary["chorus"].index:
                return this._chorusSlider;
            case Config.modulators.dictionary["echo"].index:
                return this._echoSustainSlider;
            case Config.modulators.dictionary["echo delay"].index:
                return this._echoDelaySlider;
            case Config.modulators.dictionary["sustain"].index:
                return this._stringSustainSlider;
            case Config.modulators.dictionary["fm slider 5"].index:
                return this._operatorAmplitudeSliders[4];
            case Config.modulators.dictionary["fm slider 6"].index:
                return this._operatorAmplitudeSliders[5];
            case Config.modulators.dictionary["envelope speed"].index:
                return this._envelopeSpeedSlider;
            case Config.modulators.dictionary["dynamism"].index:
                return this._supersawDynamismSlider;
            case Config.modulators.dictionary["spread"].index:
                return this._supersawSpreadSlider;
            case Config.modulators.dictionary["saw shape"].index:
                return this._supersawShapeSlider;
            case Config.modulators.dictionary["song panning"].index:
                return this._panSlider;
            case Config.modulators.dictionary["phaser"].index:
                return this._phaserMixSlider;
            case Config.modulators.dictionary["phaser frequency"].index:
                return this._phaserFreqSlider;
            case Config.modulators.dictionary["phaser feedback"].index:
                return this._phaserFeedbackSlider;
            case Config.modulators.dictionary["phaser stages"].index:
                return this._phaserStagesSlider;
            case Config.modulators.dictionary["granular"].index:
                return this._granularSlider;
            default:
                return null;
        }
    }
    _openPrompt(promptName) {
        this._doc.openPrompt(promptName);
        this._setPrompt(promptName);
    }
    _setPrompt(promptName) {
        if (this._currentPromptName == promptName)
            return;
        this._currentPromptName = promptName;
        if (this.prompt) {
            if (this._wasPlaying && !(this.prompt instanceof TipPrompt || this.prompt instanceof LimiterPrompt || this.prompt instanceof CustomScalePrompt || this.prompt instanceof CustomChipPrompt || this.prompt instanceof CustomFilterPrompt || this.prompt instanceof VisualLoopControlsPrompt || this.prompt instanceof SustainPrompt || this.prompt instanceof HarmonicsEditorPrompt || this.prompt instanceof SpectrumEditorPrompt)) {
                this._doc.performance.play();
            }
            this._wasPlaying = false;
            this._promptContainer.style.display = "none";
            this._promptContainerBG.style.display = "none";
            this._promptContainer.removeChild(this.prompt.container);
            this.prompt.cleanUp();
            this.prompt = null;
            this.refocusStage();
        }
        if (promptName) {
            switch (promptName) {
                case "export":
                    this.prompt = new ImportPrompt(this._doc);
                    break;
                case "quickExport":
                    this.prompt = new ImportPrompt(this._doc);
                    break;
                case "import":
                    this.prompt = new ImportPrompt(this._doc);
                    break;
                case "songRecovery":
                    this.prompt = new SongRecoveryPrompt(this._doc);
                    break;
                case "barCount":
                    this.prompt = new SongDurationPrompt(this._doc);
                    break;
                case "beatsPerBar":
                    this.prompt = new BeatsPerBarPrompt(this._doc);
                    break;
                case "moveNotesSideways":
                    this.prompt = new MoveNotesSidewaysPrompt(this._doc);
                    break;
                case "channelSettings":
                    this.prompt = new ChannelSettingsPrompt(this._doc);
                    break;
                case "limiterSettings":
                    this.prompt = new LimiterPrompt(this._doc, this);
                    break;
                case "customScale":
                    this.prompt = new CustomScalePrompt(this._doc);
                    break;
                case "customChipSettings":
                    this.prompt = new CustomChipPrompt(this._doc, this);
                    break;
                case "customEQFilterSettings":
                    this.prompt = new CustomFilterPrompt(this._doc, this, false);
                    break;
                case "customNoteFilterSettings":
                    this.prompt = new CustomFilterPrompt(this._doc, this, true);
                    break;
                case "harmonicsSettings":
                    this.prompt = new HarmonicsEditorPrompt(this._doc, this);
                    break;
                case "spectrumSettings":
                    this.prompt = new SpectrumEditorPrompt(this._doc, this, false);
                    break;
                case "drumsetSettings":
                    this.prompt = new SpectrumEditorPrompt(this._doc, this, true);
                    break;
                case "theme":
                    this.prompt = new ThemePrompt(this._doc);
                    break;
                case "customFont":
                    this.prompt = new FontPrompt(this._doc);
                    break;
                case "tutorial":
                    this.prompt = new TutorialPrompt(this._doc);
                    break;
                case "newUpdate":
                    break;
                case "custom":
                    this.prompt = new CustomPrompt(this._doc, this._patternEditor, this._trackArea, document.getElementById("beepboxEditorContainer"));
                    break;
                case "layout":
                    this.prompt = new LayoutPrompt(this._doc);
                    break;
                case "recordingSetup":
                    this.prompt = new RecordingSetupPrompt(this._doc);
                    break;
                case "exportInstrument":
                    this.prompt = new InstrumentExportPrompt(this._doc);
                    break;
                case "importInstrument":
                    this.prompt = new InstrumentImportPrompt(this._doc);
                    break;
                case "stringSustain":
                    this.prompt = new SustainPrompt(this._doc);
                    break;
                case "addExternal":
                    this.prompt = new AddSamplesPrompt(this._doc);
                    break;
                case "songTheme":
                    this.prompt = new SetThemePrompt(this._doc);
                    break;
                case "generateEuclideanRhythm":
                    this.prompt = new EuclideanRhythmPrompt(this._doc);
                    break;
                case "visualLoopControls":
                    this.prompt = new VisualLoopControlsPrompt(this._doc, this);
                    break;
                case "sampleLoadingStatus":
                    this.prompt = new SampleLoadingStatusPrompt(this._doc);
                    break;
                case "configureShortener":
                    this.prompt = new ShortenerConfigPrompt(this._doc);
                    break;
                case "songDetails":
                    this.prompt = new SongDetailsPrompt(this._doc);
                    break;
                case "presetsPrompt":
                    this.prompt = new PresetPrompt(this._doc);
                    break;
                default:
                    this.prompt = new TipPrompt(this._doc, promptName);
                    break;
            }
            if (this.prompt) {
                if (!(this.prompt instanceof TipPrompt || this.prompt instanceof LimiterPrompt || this.prompt instanceof CustomChipPrompt || this.prompt instanceof CustomFilterPrompt || this.prompt instanceof VisualLoopControlsPrompt || this.prompt instanceof SustainPrompt || this.prompt instanceof HarmonicsEditorPrompt || this.prompt instanceof SpectrumEditorPrompt)) {
                    this._wasPlaying = this._doc.synth.playing;
                    this._doc.performance.pause();
                }
                this._promptContainer.style.display = "";
                if (this._doc.prefs.frostedGlassBackground == true) {
                    this._promptContainerBG.style.display = "";
                    this._promptContainerBG.style.backgroundColor = "rgba(0,0,0, 0)";
                    this._promptContainerBG.style.backdropFilter = "brightness(0.9) blur(14px)";
                    this._promptContainerBG.style.opacity = "1";
                }
                else {
                    this._promptContainerBG.style.display = "";
                    this._promptContainerBG.style.backgroundColor = "var(--editor-background)";
                    this._promptContainerBG.style.backdropFilter = "";
                    this._promptContainerBG.style.opacity = "0.5";
                }
                this._promptContainer.appendChild(this.prompt.container);
                document.body.appendChild(this._promptContainerBG);
            }
        }
    }
    changeBarScrollPos(offset) {
        this._barScrollBar.changePos(offset);
    }
    static setMobileUi(name) {
        let mobileUI = this.mobileUI[name];
        if (mobileUI == undefined)
            mobileUI = this.mobileUI["horizontal"];
        this._mobileUIStyleElement.textContent = mobileUI;
    }
    static getMobileUi() {
        return this._mobileUIStyleElement.textContent;
    }
    handleModRecording() {
        window.clearTimeout(this._modRecTimeout);
        const lastChange = this._doc.checkLastChange();
        if ((this._ctrlHeld || this._shiftHeld) && lastChange != null && this._doc.synth.playing) {
            const changedPatterns = this._patternEditor.setModSettingsForChange(lastChange, this);
            if (this._doc.continuingModRecordingChange != null) {
                this._modRecTimeout = window.setTimeout(() => { this.handleModRecording(); }, 10);
                this._doc.recordingModulators = true;
                if (changedPatterns)
                    this._trackEditor.render();
            }
        }
        else if (this._doc.recordingModulators) {
            this._doc.recordingModulators = false;
            this._doc.record(new ChangeHoldingModRecording(this._doc, null, null, null));
        }
        if (this._doc.song.showSongDetails && EditorConfig.showSongDetailsAlert && this._doc.prefs.promptSongDetails) {
            alert((this._doc.song.title != "" ? this._doc.song.title : "Untitled") +
                (this._doc.song.author != "" ? "\n\nBy " + this._doc.song.author : "") +
                (this._doc.song.description != "" ? "\n\n\n" + this._doc.song.description : ""));
        }
        EditorConfig.showSongDetailsAlert = false;
    }
    _renderInstrumentBar(channel, instrumentIndex, colors) {
        if (this._doc.song.layeredInstruments || this._doc.song.patternInstruments) {
            this._instrumentsButtonRow.style.display = "";
            this._instrumentsButtonBar.style.setProperty("--text-color-lit", colors.primaryNote);
            this._instrumentsButtonBar.style.setProperty("--text-color-dim", colors.secondaryNote);
            this._instrumentsButtonBar.style.setProperty("--background-color-lit", colors.primaryChannel);
            this._instrumentsButtonBar.style.setProperty("--background-color-dim", colors.secondaryChannel);
            const maxInstrumentsPerChannel = this._doc.song.getMaxInstrumentsPerChannel();
            while (this._instrumentButtons.length < channel.instruments.length) {
                const instrumentButton = button(String(this._instrumentButtons.length + 1));
                this._instrumentButtons.push(instrumentButton);
                this._instrumentsButtonBar.insertBefore(instrumentButton, this._instrumentRemoveButton);
            }
            for (let i = this._renderedInstrumentCount; i < channel.instruments.length; i++) {
                this._instrumentButtons[i].style.display = "";
            }
            for (let i = channel.instruments.length; i < this._renderedInstrumentCount; i++) {
                this._instrumentButtons[i].style.display = "none";
            }
            this._renderedInstrumentCount = channel.instruments.length;
            while (this._instrumentButtons.length > maxInstrumentsPerChannel) {
                this._instrumentsButtonBar.removeChild(this._instrumentButtons.pop());
            }
            this._instrumentRemoveButton.style.display = (channel.instruments.length > Config.instrumentCountMin) ? "" : "none";
            this._instrumentAddButton.style.display = (channel.instruments.length < maxInstrumentsPerChannel) ? "" : "none";
            if (channel.instruments.length < maxInstrumentsPerChannel) {
                this._instrumentRemoveButton.classList.remove("last-button");
            }
            else {
                this._instrumentRemoveButton.classList.add("last-button");
            }
            if (channel.instruments.length > 1) {
                if (this._highlightedInstrumentIndex != instrumentIndex) {
                    const oldButton = this._instrumentButtons[this._highlightedInstrumentIndex];
                    if (oldButton != null)
                        oldButton.classList.remove("selected-instrument");
                    const newButton = this._instrumentButtons[instrumentIndex];
                    newButton.classList.add("selected-instrument");
                    this._highlightedInstrumentIndex = instrumentIndex;
                }
            }
            else {
                const oldButton = this._instrumentButtons[this._highlightedInstrumentIndex];
                if (oldButton != null)
                    oldButton.classList.remove("selected-instrument");
                this._highlightedInstrumentIndex = -1;
            }
            if (this._doc.song.layeredInstruments && this._doc.song.patternInstruments && (this._doc.channel < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)) {
                for (let i = 0; i < channel.instruments.length; i++) {
                    if (this._doc.recentPatternInstruments[this._doc.channel].indexOf(i) != -1) {
                        this._instrumentButtons[i].classList.remove("deactivated");
                    }
                    else {
                        this._instrumentButtons[i].classList.add("deactivated");
                    }
                }
                this._deactivatedInstruments = true;
            }
            else if (this._deactivatedInstruments || (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)) {
                for (let i = 0; i < channel.instruments.length; i++) {
                    this._instrumentButtons[i].classList.remove("deactivated");
                }
                this._deactivatedInstruments = false;
            }
            if ((this._doc.song.layeredInstruments && this._doc.song.patternInstruments) && channel.instruments.length > 1 && (this._doc.channel < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)) {
                for (let i = 0; i < channel.instruments.length; i++) {
                    this._instrumentButtons[i].classList.remove("no-underline");
                }
            }
            else {
                for (let i = 0; i < channel.instruments.length; i++) {
                    this._instrumentButtons[i].classList.add("no-underline");
                }
            }
        }
        else {
            this._instrumentsButtonRow.style.display = "none";
        }
    }
    _usageCheck(channelIndex, instrumentIndex) {
        var instrumentUsed = false;
        var patternUsed = false;
        var modUsed = false;
        const channel = this._doc.song.channels[channelIndex];
        if (channelIndex < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
            for (let modChannelIdx = this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount; modChannelIdx < this._doc.song.channels.length; modChannelIdx++) {
                const modChannel = this._doc.song.channels[modChannelIdx];
                const patternIdx = modChannel.bars[this._doc.bar];
                if (patternIdx > 0) {
                    const modInstrumentIdx = modChannel.patterns[patternIdx - 1].instruments[0];
                    const modInstrument = modChannel.instruments[modInstrumentIdx];
                    for (let mod = 0; mod < Config.modCount; mod++) {
                        if (modInstrument.modChannels[mod] == channelIndex && (modInstrument.modInstruments[mod] == instrumentIndex || modInstrument.modInstruments[mod] >= channel.instruments.length)) {
                            modUsed = true;
                        }
                    }
                }
            }
        }
        let lowestSelX = Math.min(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
        let highestSelX = Math.max(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
        let lowestSelY = Math.min(this._doc.selection.boxSelectionY0, this._doc.selection.boxSelectionY1);
        let highestSelY = Math.max(this._doc.selection.boxSelectionY0, this._doc.selection.boxSelectionY1);
        if (channel.bars[this._doc.bar] != 0) {
            for (let i = 0; i < this._doc.song.barCount; i++) {
                if (channel.bars[i] == channel.bars[this._doc.bar] && i != this._doc.bar &&
                    (i < lowestSelX || i > highestSelX || this._doc.channel < lowestSelY || this._doc.channel > highestSelY)) {
                    patternUsed = true;
                    i = this._doc.song.barCount;
                }
            }
        }
        for (let i = 0; i < this._doc.song.barCount; i++) {
            if (channel.bars[i] != 0 && channel.bars[i] != channel.bars[this._doc.bar] &&
                channel.patterns[channel.bars[i] - 1].instruments.includes(instrumentIndex) && i != this._doc.bar &&
                (i < lowestSelX || i > highestSelX || this._doc.channel < lowestSelY || this._doc.channel > highestSelY)) {
                instrumentUsed = true;
                i = this._doc.song.barCount;
            }
        }
        if (patternUsed) {
            this._usedPatternIndicator.style.setProperty("fill", ColorConfig.indicatorPrimary);
            this.patternUsed = true;
        }
        else {
            this._usedPatternIndicator.style.setProperty("fill", ColorConfig.indicatorSecondary);
            this.patternUsed = false;
        }
        if (instrumentUsed) {
            this._usedInstrumentIndicator.style.setProperty("fill", ColorConfig.indicatorPrimary);
        }
        else {
            this._usedInstrumentIndicator.style.setProperty("fill", ColorConfig.indicatorSecondary);
        }
        if (modUsed) {
            this._jumpToModIndicator.style.setProperty("display", "");
            this._jumpToModIndicator.style.setProperty("fill", ColorConfig.indicatorPrimary);
            this._jumpToModIndicator.classList.add("modTarget");
        }
        else if (channelIndex < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
            this._jumpToModIndicator.style.setProperty("display", "");
            this._jumpToModIndicator.style.setProperty("fill", ColorConfig.indicatorSecondary);
            this._jumpToModIndicator.classList.remove("modTarget");
        }
        else {
            this._jumpToModIndicator.style.setProperty("display", "none");
        }
    }
    _copyTextToClipboard(text) {
        let nav;
        nav = navigator;
        if (nav.clipboard && nav.clipboard.writeText) {
            nav.clipboard.writeText(text).catch(() => {
                window.prompt("Copy to clipboard:", text);
            });
            return;
        }
        const textField = document.createElement("textarea");
        textField.textContent = text;
        document.body.appendChild(textField);
        textField.select();
        const succeeded = document.execCommand("copy");
        textField.remove();
        this.refocusStage();
        if (!succeeded)
            window.prompt("Copy this:", text);
    }
    _animateVolume(outVolumeCap, historicOutCap) {
        this._outVolumeBar.setAttribute("width", "" + Math.min(144, outVolumeCap * 144));
        this._outVolumeCap.setAttribute("x", "" + (8 + Math.min(144, historicOutCap * 144)));
    }
    _recordVolumeSlider(useVol) {
        if ((this._ctrlHeld || this._shiftHeld) && this._doc.synth.playing) {
            const prevVol = this._doc.prefs.volume;
            this._doc.prefs.volume = useVol;
            this._patternEditor.setModSettingsForChange(null, this);
            window.clearTimeout(this._modRecTimeout);
            this._modRecTimeout = window.setTimeout(() => { this._recordVolumeSlider(useVol); }, 10);
            this._doc.recordingModulators = true;
            this._doc.prefs.volume = prevVol;
            this._volumeSlider.updateValue(this._doc.prefs.volume);
        }
        else {
            this._doc.setVolume(Number(this._volumeSlider.input.value));
            if (this._doc.recordingModulators) {
                this._doc.recordingModulators = false;
                this._doc.record(new ChangeHoldingModRecording(this._doc, null, null, null));
            }
        }
    }
    _switchEQFilterType(toSimple) {
        const channel = this._doc.song.channels[this._doc.channel];
        const instrument = channel.instruments[this._doc.getCurrentInstrument()];
        if (instrument.eqFilterType != toSimple) {
            this._doc.record(new ChangeEQFilterType(this._doc, instrument, toSimple));
        }
    }
    _switchNoteFilterType(toSimple) {
        const channel = this._doc.song.channels[this._doc.channel];
        const instrument = channel.instruments[this._doc.getCurrentInstrument()];
        if (instrument.noteFilterType != toSimple) {
            this._doc.record(new ChangeNoteFilterType(this._doc, instrument, toSimple));
        }
    }
    _randomPreset() {
        const isNoise = this._doc.song.getChannelIsNoise(this._doc.channel);
        this._doc.record(new ChangePreset(this._doc, pickRandomPresetValue(isNoise)));
    }
    _randomGenerated() {
        this._doc.record(new ChangeRandomGeneratedInstrument(this._doc));
    }
    _setPreset(preset) {
        if (isNaN(preset)) {
            switch (preset) {
                case "copyInstrument":
                    this._copyInstrument();
                    break;
                case "pasteInstrument":
                    this._pasteInstrument();
                    break;
                case "randomPreset":
                    this._randomPreset();
                    break;
                case "randomGenerated":
                    this._randomGenerated();
                    break;
            }
            this._doc.notifier.changed();
        }
        else {
            this._doc.record(new ChangePreset(this._doc, parseInt(preset)));
        }
    }
}
SongEditor._styleElement = document.head.appendChild(HTML.style({ type: "text/css" }));
SongEditor._setLoopIcon = {
    "1": `
        .songLoopButton::before {
              mask-image: var(--loop-within-bar-symbol);
              -webkit-mask-image: var(--loop-within-bar-symbol);
            }
        `,
    "2": `
        .songLoopButton::before {
            mask-image: var(--loop-full-song-symbol);
            -webkit-mask-image: var(--loop-full-song-symbol);
          }
        `,
    "3": `
        .songLoopButton::before {
            mask-image: var(--dont-loop-symbol);
            -webkit-mask-image: var(--dont-loop-symbol);
          }
        `,
};
SongEditor.mobileUI = {
    "landscape": `
            .mobileMenu {
                right: 0 !important;
                left: unset !important;
                height: 100vh !important;
                width: 15vw !important;

                display: flex;
                flex-direction: column;
            }

            .pattern-area {
                width: 74vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
            }

            #beepboxEditorContainer {
                max-width: 100vw !important;
            }

            .play-pause-area2 {
                height: 100vh !important;
                width: 4vw !important;
                bottom: 0 !important;
                right: 16vw !important;
                left: unset !important;
            }

            .playback-bar-controls2 {
                flex-direction: column !important;
            }
            
            .mobilePlayButton, .mobilePauseButton, .mobilePrevBarButton, .mobileNextBarButton {
                width: 100% !important;
                flex: 1;
            }

            .settings-area {
                grid-template-columns: 33% 34% 33% !important;
                grid-template-rows: min-content min-content min-content min-content 1fr !important;
                grid-template-areas: "version-area version-area version-area" "play-pause-area menu-area instrument-settings-area" "play-pause-area menu-area instrument-settings-area" "song-settings-area song-settings-area instrument-settings-area" "song-settings-area song-settings-area instrument-settings-area" !important;
                width: 78vw !important;
            }

            .track-area {
                width: 78vw !important;
            }

            .mobilePatternButton, .mobileTrackButton, .mobileSettingsButton {
                align-self: end;
                flex: 1;
            }

        `,
    "portrait": `

            .play-pause-area2 {
                height: unset !important;
                width: 100% !important
                bottom: 16vh !important;
                right: unset !important;
                left: 0 !important;
            }

            .mobileMenu {
                right: unset !important;
                left: unset !important;
                height: 15vh !important;
                width: 100vw !important;
                bottom: 0 !important;

                display: flex;
                flex-direction: row;
            }

            .pattern-area {
                width: 91vw !important;
                height: 70vh !important;
                max-height: 75vh;
            }

            #beepboxEditorContainer {
                max-width: 710px !important;
            }

            .playback-bar-controls2 {
                flex-direction: row !important;
                height: 3vh;
            }
            
            .mobilePlayButton, .mobilePauseButton, .mobilePrevBarButton, .mobileNextBarButton {
                height: 100% !important;
                flex: 1;
            }

            .settings-area {
                grid-template-columns: 50% 50% !important;
                grid-template-rows: min-content min-content min-content min-content 1fr !important;
                grid-template-areas: "version-area version-area" "play-pause-area instrument-settings-area" "play-pause-area instrument-settings-area" "menu-area instrument-settings-area" "song-settings-area instrument-settings-area" !important;
                width: 96vw !important;
            }

            .track-area {
                width: 98vw !important;
            }

            .mobilePatternButton, .mobileTrackButton, .mobileSettingsButton {
                align-self: end;
                flex: 1;
            }

        `
};
SongEditor._mobileUIStyleElement = document.head.appendChild(HTML.style({ type: "text/css" }));
//# sourceMappingURL=SongEditor.js.map