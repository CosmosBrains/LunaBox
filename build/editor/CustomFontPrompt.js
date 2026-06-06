import { HTML } from "imperative-html/dist/esm/elements-strict";
import { CustomThemeBases } from "./CustomThemeBases";
const { button, div, h2, option, select, input } = HTML;
let doReload = false;
export class FontPrompt {
    constructor(_doc) {
        this._doc = _doc;
        this._fontSelect = select({ style: "width: 100%; margin: 0.5em 0;", id: "fontSelect" }, option({ selected: true, disabled: true, hidden: false }, "Pick a font"), option({ value: "none" }, "Default"), option({ value: "Roboto" }, "Roboto"), option({ value: "AbyssType" }, "AbyssType"), option({ value: "AbyssType Small" }, "AbyssType Small"), option({ value: "AbyssType Fusion" }, "AbyssType Fusion"), option({ value: "Doom 1993" }, "Doom 1993"), option({ value: "Tahoma Pixel" }, "Tahoma (Windows Xp)"), option({ value: "Tahoma" }, "Tahoma"), option({ value: "Trebuchet" }, "Trebuchet MS"), option({ value: "Monospace" }, "Monospace"), option({ value: "Frutiger" }, "Frutiger"), option({ value: "Workbench" }, "Workbench"), option({ value: "Varela" }, "Varela"), option({ value: "Arial" }, "Arial"), option({ value: "Comic Sans" }, "Comic Sans"), option({ value: "custom" }, "Custom"));
        this._cancelButton = button({ class: "cancelButton" });
        this._okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay");
        this.lastFont = window.localStorage.getItem("customFontName");
        this._fileInput = input({ type: "file", accept: ".otf, .ttf", text: "Choose Custom Font" });
        this._reload = div({ style: "display:none; font-size: 25px; margin-top: 10px;" }, "Reload Required! Press Okay!");
        this.container = div({ class: "prompt noSelection", id: "fontContainerPrompt", style: "width: 220px;" }, div({ class: "promptTitle" }, h2({ class: "fontExt", style: "text-align: inherit;" }, ""), h2({ class: "fontTitle", style: "margin-bottom: 0.5em;" }, "Set Font")), div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" }, div({ class: "selectContainer", style: "width: 100%;" }, this._fontSelect)), this._fileInput, this._reload, div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._okayButton), this._cancelButton);
        this._whenKeyPressed = (event) => {
            if (event.target.tagName != "BUTTON" && event.keyCode == 13) {
                this._saveChanges();
            }
        };
        this._whenFileSelected = () => {
            const file = this._fileInput.files[0];
            if (!file)
                return;
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
                let base64 = reader.result;
                window.localStorage.setItem("customFontFile", base64);
                const value = `url("${window.localStorage.getItem('customFontFile')}")`;
                console.log('setting', value);
                console.log('done');
            });
            reader.readAsDataURL(file);
            this._fontSelect.value = "custom";
            CustomThemeBases.setFont("custom");
            window.localStorage.setItem("customFontName", "custom");
            this._previewFont();
            doReload = true;
            this._reload.style.display = "unset";
        };
        this._saveChanges = () => {
            window.localStorage.setItem("customFontName", this._fontSelect.value);
            this._doc.prompt = null;
            this._doc.prefs.customFont = this._fontSelect.value;
            this._doc.undo();
            if (doReload) {
                setTimeout(() => { window.location.reload(); }, 50);
            }
        };
        this._previewFont = () => {
            CustomThemeBases.setFont(this._fontSelect.value);
            this._doc.notifier.changed();
        };
        this._close = () => {
            if (this.lastFont != null) {
                CustomThemeBases.setFont(this.lastFont);
            }
            else {
                CustomThemeBases.setFont("Roboto");
            }
            this._doc.undo();
            if (doReload) {
                setTimeout(() => { window.location.reload(); }, 50);
            }
        };
        this.cleanUp = () => {
            this._okayButton.removeEventListener("click", this._close);
            this._cancelButton.removeEventListener("click", this._close);
        };
        if (this.lastFont != null) {
            this._fontSelect.value = this.lastFont;
        }
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);
        this.container.addEventListener("keydown", this._whenKeyPressed);
        this._fontSelect.addEventListener("change", this._previewFont);
        this._fileInput.addEventListener("change", this._whenFileSelected);
    }
}
//# sourceMappingURL=CustomFontPrompt.js.map