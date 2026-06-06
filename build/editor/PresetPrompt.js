import { HTML } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";
const textOnIcon = ColorConfig.getComputed("--text-enabled-icon") !== "" ? ColorConfig.getComputed("--text-enabled-icon") : "✓ ";
const textOffIcon = ColorConfig.getComputed("--text-disabled-icon") !== "" ? ColorConfig.getComputed("--text-disabled-icon") : "　";
const { button, div, h2, option, select, p } = HTML;
export var setPresets = new Array();
var storedPresets = localStorage.getItem("setPresets");
export var totalPresets = new Array("Retro Presets", "Keyboard Presets", "Idiophone Presets", "Guitar Presets", "Picked Bass Presets", "Picked String Presets", "Distortion Presets", "Bellows Presets", "String Presets", "Vocal Presets", "Brass Presets", "Reed Presets", "Flute Presets", "Pad Presets", "Drum Presets", "Novelty Presets", "Modbox Presets", "Sandbox Presets", "Blackbox Presets", "Todbox Presets", "Midbox Misc Presets", "Midbox Dubstep Presets", "Midbox Noise Presets", "UltraBox Presets", "AbyssBox 0.8 to 1.2 Presets", "AbyssBox 1.3+ Presets", "AbyssBox Spooky Presets");
if (storedPresets != null && storedPresets != undefined) {
    setPresets = JSON.parse(storedPresets);
}
else {
    setPresets.push("Retro Presets", "Keyboard Presets", "Idiophone Presets", "Guitar Presets", "Picked Bass Presets", "Picked String Presets", "Distortion Presets", "Bellows Presets", "String Presets", "Vocal Presets", "Brass Presets", "Reed Presets", "Flute Presets", "Pad Presets", "Drum Presets", "Novelty Presets", "UltraBox Presets", "AbyssBox 0.8 to 1.2 Presets", "AbyssBox 1.3+ Presets", "AbyssBox Spooky Presets");
}
export class PresetPrompt {
    constructor(_doc) {
        this._doc = _doc;
        this._cancelButton = button({ class: "cancelButton" });
        this._okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay");
        this._beepboxMenu = select({ style: "width: 100%; margin: 0.5em; margin-left:0;" }, option({ selected: true, disabled: true, hidden: false }, "BeepBox Presets"), option({ value: "Retro Presets" }, (setPresets.includes("Retro Presets") ? textOnIcon : textOffIcon) + "Retro Presets"), option({ value: "Keyboard Presets" }, (setPresets.includes("Keyboard Presets") ? textOnIcon : textOffIcon) + "Keyboard Presets"), option({ value: "Idiophone Presets" }, (setPresets.includes("Idiophone Presets") ? textOnIcon : textOffIcon) + "Idiophone Presets"), option({ value: "Guitar Presets" }, (setPresets.includes("Guitar Presets") ? textOnIcon : textOffIcon) + "Guitar Presets"), option({ value: "Picked Bass Presets" }, (setPresets.includes("Picked Bass Presets") ? textOnIcon : textOffIcon) + "Picked Bass Presets"), option({ value: "Picked String Presets" }, (setPresets.includes("Picked String Presets") ? textOnIcon : textOffIcon) + "Picked String Presets"), option({ value: "Distortion Presets" }, (setPresets.includes("Distortion Presets") ? textOnIcon : textOffIcon) + "Distortion Presets"), option({ value: "Bellows Presets" }, (setPresets.includes("Bellows Presets") ? textOnIcon : textOffIcon) + "Bellows Presets"), option({ value: "String Presets" }, (setPresets.includes("String Presets") ? textOnIcon : textOffIcon) + "String Presets"), option({ value: "Vocal Presets" }, (setPresets.includes("Vocal Presets") ? textOnIcon : textOffIcon) + "Vocal Presets"), option({ value: "Brass Presets" }, (setPresets.includes("Brass Presets") ? textOnIcon : textOffIcon) + "Brass Presets"), option({ value: "Reed Presets" }, (setPresets.includes("Reed Presets") ? textOnIcon : textOffIcon) + "Reed Presets"), option({ value: "Flute Presets" }, (setPresets.includes("Flute Presets") ? textOnIcon : textOffIcon) + "Flute Presets"), option({ value: "Drum Presets" }, (setPresets.includes("Drum Presets") ? textOnIcon : textOffIcon) + "Drum Presets"), option({ value: "Novelty Presets" }, (setPresets.includes("Novelty Presets") ? textOnIcon : textOffIcon) + "Novelty Presets"));
        this._otherMenu = select({ style: "width: 100%;" }, option({ selected: true, disabled: true, hidden: false }, "Other Mod Presets"), option({ value: "Modbox Presets" }, (setPresets.includes("Modbox Presets") ? textOnIcon : textOffIcon) + "Modbox Presets"), option({ value: "Sandbox Presets" }, (setPresets.includes("Sandbox Presets") ? textOnIcon : textOffIcon) + "Sandbox Presets"), option({ value: "Blackbox Presets" }, (setPresets.includes("Blackbox Presets") ? textOnIcon : textOffIcon) + "Blackbox Presets"), option({ value: "Todbox Presets" }, (setPresets.includes("Todbox Presets") ? textOnIcon : textOffIcon) + "Todbox Presets"), option({ value: "Midbox Misc Presets" }, (setPresets.includes("Midbox Misc Presets") ? textOnIcon : textOffIcon) + "Midbox Misc Presets"), option({ value: "Midbox Dubstep Presets" }, (setPresets.includes("Midbox Dubstep Presets") ? textOnIcon : textOffIcon) + "Midbox Dubstep Presets"), option({ value: "Midbox Noise Presets" }, (setPresets.includes("Midbox Noise Presets") ? textOnIcon : textOffIcon) + "Midbox Noise Presets"), option({ value: "UltraBox Presets" }, (setPresets.includes("UltraBox Presets") ? textOnIcon : textOffIcon) + "UltraBox Presets"), option({ value: "AbyssBox 0.8 to 1.2 Presets" }, (setPresets.includes("AbyssBox 0.8 to 1.2 Presets") ? textOnIcon : textOffIcon) + "AbyssBox 0.8 to 1.2 Presets"), option({ value: "AbyssBox 1.3+ Presets" }, (setPresets.includes("AbyssBox 1.3+ Presets") ? textOnIcon : textOffIcon) + "AbyssBox 1.3+ Presets"), option({ value: "AbyssBox Spooky Presets" }, (setPresets.includes("AbyssBox Spooky Presets") ? textOnIcon : textOffIcon) + "AbyssBox Spooky Presets"));
        this.container = div({ class: "prompt noSelection", id: "presetContainerPrompt", style: "width: 400px;" }, div({ class: "promptTitle" }, h2({ class: "presetExt", style: "text-align: inherit;" }, ""), h2({ class: "presetTitle", style: "margin-bottom: 0.5em;" }, "Select Presets")), p({ style: "margin-bottom: 1.5em; margin-top: 0; font-size: 16px; text-align: center;" }, 'Here you can select any preset category and make it visible or not. Which ones you would like are completely up to you.'), div({ style: "display: flex; flex-direction: column; align-items: center; height: 2em; justify-content: flex-end;" }, div({ class: "beepBox Presets", style: "width: 100%;" }, this._beepboxMenu), div({ class: "other Presets", style: "width: 100%;" }, this._otherMenu)), div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._okayButton), this._cancelButton);
        this._beepboxMenuHandler = (event) => {
            const setPresetValue = this._beepboxMenu.value;
            if (setPresets.includes(setPresetValue)) {
                const index = setPresets.indexOf(setPresetValue);
                if (index > -1) {
                    setPresets.splice(index, 1);
                }
            }
            else {
                setPresets.push(setPresetValue);
            }
            const setOption = this._beepboxMenu.querySelector('[value="' + setPresetValue + '"]');
            setOption.text = (setPresets.includes(setPresetValue) ? textOnIcon : textOffIcon) + setPresetValue;
            localStorage.setItem("setPresets", JSON.stringify(setPresets));
            this._beepboxMenu.selectedIndex = 0;
            this._doc.notifier.changed();
        };
        this._otherMenuHandler = (event) => {
            const setPresetValue = this._otherMenu.value;
            if (setPresets.includes(setPresetValue)) {
                const index = setPresets.indexOf(setPresetValue);
                if (index > -1) {
                    setPresets.splice(index, 1);
                }
            }
            else {
                setPresets.push(setPresetValue);
            }
            const setOption = this._otherMenu.querySelector('[value="' + setPresetValue + '"]');
            setOption.text = (setPresets.includes(setPresetValue) ? textOnIcon : textOffIcon) + setPresetValue;
            localStorage.setItem("setPresets", JSON.stringify(setPresets));
            this._otherMenu.selectedIndex = 0;
            this._doc.notifier.changed();
        };
        this._close = () => {
            this._doc.undo();
        };
        this.cleanUp = () => {
            this._okayButton.removeEventListener("click", this._close);
            this._cancelButton.removeEventListener("click", this._close);
        };
        this._cancelButton.addEventListener("click", this._close);
        this._okayButton.addEventListener("click", this._close);
        this._beepboxMenu.addEventListener("change", this._beepboxMenuHandler);
        this._otherMenu.addEventListener("change", this._otherMenuHandler);
    }
}
//# sourceMappingURL=PresetPrompt.js.map