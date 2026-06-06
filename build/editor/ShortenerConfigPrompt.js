import { HTML } from "imperative-html/dist/esm/elements-strict";
const { button, div, h2, select, option } = HTML;
export class ShortenerConfigPrompt {
    constructor(_doc) {
        this._doc = _doc;
        this._shortenerStrategySelect = select({ style: "width: 100%;" }, option({ value: "tinyurl" }, "tinyurl.com"), option({ value: "isgd" }, "is.gd"));
        this._cancelButton = button({ class: "cancelButton" });
        this._okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay");
        this.container = div({ class: "prompt noSelection", style: "width: 250px;" }, div({ class: "promptTitle" }, h2({ class: "configShortenerExt", style: "text-align: inherit;" }, ""), h2({ class: "configShortenerTitle" }, "Configure Shortener")), div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" }, div({ class: "selectContainer", style: "width: 100%;" }, this._shortenerStrategySelect)), div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._okayButton), this._cancelButton);
        this._close = () => {
            this._doc.undo();
        };
        this.cleanUp = () => {
            this._okayButton.removeEventListener("click", this._saveChanges);
            this._cancelButton.removeEventListener("click", this._close);
            this.container.removeEventListener("keydown", this._whenKeyPressed);
        };
        this._whenKeyPressed = (event) => {
            if (event.target.tagName != "BUTTON" && event.keyCode == 13) {
                this._saveChanges();
            }
        };
        this._saveChanges = () => {
            window.localStorage.setItem("shortenerStrategySelect", this._shortenerStrategySelect.value);
            this._doc.prompt = null;
            this._doc.undo();
        };
        const lastStrategy = window.localStorage.getItem("shortenerStrategySelect");
        if (lastStrategy != null) {
            this._shortenerStrategySelect.value = lastStrategy;
        }
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);
        this.container.addEventListener("keydown", this._whenKeyPressed);
    }
}
//# sourceMappingURL=ShortenerConfigPrompt.js.map