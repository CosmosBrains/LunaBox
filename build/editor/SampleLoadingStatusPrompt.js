import { HTML } from "imperative-html/dist/esm/elements-strict";
import { sampleLoadingState, getSampleLoadingStatusName, Config } from "../synth/SynthConfig";
import { ColorConfig } from "./ColorConfig";
import { EditorConfig } from "./EditorConfig";
const { div, h2, span, input, button } = HTML;
export class SampleLoadingStatusPrompt {
    constructor(_doc) {
        this._intervalDuration = 2000;
        this._interval = null;
        this._renderedWhenAllHaveStoppedChanging = false;
        this._cancelButton = button({ class: "cancelButton" });
        this._statusesContainer = div();
        this._noSamplesMessage = div({ style: "margin-top: 0.5em; display: none;" }, "There's no custom samples in this song.");
        this.container = div({ class: "prompt noSelection", style: "width: 350px;" }, div(h2("Sample Loading Status"), div({ style: "display: flex; flex-direction: column; align-items: center; margin-bottom: 0.5em;" }, this._noSamplesMessage, div({ style: "width: 100%; max-height: 350px; overflow-y: scroll;" }, this._statusesContainer))), this._cancelButton);
        this._close = () => {
            this._doc.prompt = null;
            this._doc.undo();
        };
        this.cleanUp = () => {
            while (this._statusesContainer.firstChild !== null) {
                this._statusesContainer.removeChild(this._statusesContainer.firstChild);
            }
            this._cancelButton.removeEventListener("click", this._close);
            clearInterval(this._interval);
        };
        this._render = () => {
            const hasNoCustomSamples = EditorConfig.customSamples == null;
            if (hasNoCustomSamples) {
                this._noSamplesMessage.style.display = "";
            }
            if (hasNoCustomSamples || this._renderedWhenAllHaveStoppedChanging) {
                clearInterval(this._interval);
                return;
            }
            let allHaveStoppedChanging = true;
            for (let chipWaveIndex = 0; chipWaveIndex < Config.chipWaves.length; chipWaveIndex++) {
                const chipWave = Config.chipWaves[chipWaveIndex];
                if (chipWave.isCustomSampled !== true && chipWave.isSampled !== true)
                    continue;
                const loadingStatus = sampleLoadingState.statusTable[chipWaveIndex];
                if (loadingStatus === 0) {
                    allHaveStoppedChanging = false;
                    break;
                }
            }
            while (this._statusesContainer.firstChild !== null) {
                this._statusesContainer.removeChild(this._statusesContainer.firstChild);
            }
            for (let chipWaveIndex = 0; chipWaveIndex < Config.chipWaves.length; chipWaveIndex++) {
                const chipWave = Config.chipWaves[chipWaveIndex];
                if (chipWave.isCustomSampled !== true && chipWave.isSampled !== true)
                    continue;
                const sampleName = chipWave.name;
                const url = sampleLoadingState.urlTable[chipWaveIndex];
                const loadingStatus = getSampleLoadingStatusName(sampleLoadingState.statusTable[chipWaveIndex]);
                const urlDisplay = input({ style: `margin-left: 0.5em; color: ${ColorConfig.primaryText}; background-color: ${ColorConfig.editorBackground}; width: 100%; border: 1px solid ${ColorConfig.uiWidgetBackground}; -webkit-user-select: none; -webkit-touch-callout: none; -moz-user-select: none; -ms-user-select: none; user-select: none;`, value: url, title: url, disabled: true });
                const loadingStatusColor = loadingStatus === "loaded" ? ColorConfig.indicatorPrimary : ColorConfig.secondaryText;
                const loadingStatusDisplay = span({ style: `margin-left: 0.5em; color: ${loadingStatusColor}` }, loadingStatus);
                const chipWaveElement = div({ style: `padding: 0.6em; margin: 0.4em; border: 1px solid ${ColorConfig.uiWidgetBackground}; border-radius: 4px;` }, div({
                    class: "add-sample-prompt-sample-name",
                    style: `margin-bottom: 0.5em; color: ${ColorConfig.secondaryText}; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`,
                    title: sampleName,
                }, sampleName), div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: center; margin-bottom: 0.5em;" }, div({ style: `text-align: right; color: ${ColorConfig.primaryText};` }, "URL"), urlDisplay), div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: center; margin-bottom: 0.5em;" }, div({ style: `text-align: right; color: ${ColorConfig.primaryText};` }, "Status"), loadingStatusDisplay));
                this._statusesContainer.appendChild(chipWaveElement);
            }
            if (allHaveStoppedChanging) {
                this._renderedWhenAllHaveStoppedChanging = true;
            }
        };
        this._doc = _doc;
        this._interval = setInterval(() => this._render(), this._intervalDuration);
        this._render();
        this._cancelButton.addEventListener("click", this._close);
    }
}
//# sourceMappingURL=SampleLoadingStatusPrompt.js.map