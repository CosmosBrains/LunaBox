import { Layout } from "./Layout";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
const { button, label, div, form, h2, input } = HTML;
export class LayoutPrompt {
    constructor(_doc) {
        this._doc = _doc;
        this._fileInput = input({ type: "file", accept: ".json,application/json,.mid,.midi,audio/midi,audio/x-midi" });
        this._okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay");
        this._cancelButton = button({ class: "cancelButton" });
        this._form = form({ style: "display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;" }, label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "small" }), SVG(`\
					<svg viewBox="-4 -1 28 22">
						<rect x="0" y="0" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="11" height="10" fill="currentColor"/>
						<rect x="14" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="2" y="13" width="11" height="5" fill="currentColor"/>
					</svg>
				`), div("Small")), label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "long" }), SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="12" height="10" fill="currentColor"/>
						<rect x="15" y="2" width="4" height="10" fill="currentColor"/>
						<rect x="20" y="2" width="4" height="10" fill="currentColor"/>
						<rect x="2" y="13" width="22" height="5" fill="currentColor"/>
					</svg>
				`), div("Long")), label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "tall" }), SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="11" y="2" width="8" height="16" fill="currentColor"/>
						<rect x="20" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="2" y="2" width="8" height="16" fill="currentColor"/>
					</svg>
				`), div("Tall")), label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "wide" }), SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="18" y="2" width="2.5" height="16" fill="currentColor"/>
						<rect x="21.5" y="2" width="2.5" height="16" fill="currentColor"/>
						<rect x="7" y="2" width="10" height="16" fill="currentColor"/>
					</svg>
				`), div("Wide (JB)")), label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "AbyssBox Special" }), SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="7" y="2" width="4" height="11" fill="currentColor"/>
						<rect x="2" y="2" width="4" height="11" fill="currentColor"/>
						<rect x="10" y="2" width="14" height="11" fill="currentColor"/>
						<rect x="2" y="14" width="22" height="4" fill="currentColor"/>
					</svg>
				`), div("Flipped (AB)")), label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "focus" }), SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="17" height="10" fill="currentColor"/>
						<rect x="20" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="2" y="13" width="17" height="5" fill="currentColor"/>
					</svg>
				`), div("Focus (AB)")), label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "long (AB)" }), SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="12" height="10" fill="currentColor"/>
						<rect x="15" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="20" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="2" y="13" width="12" height="5" fill="currentColor"/>
					</svg>
				`), div("Long (AB)")), label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "theatre" }), SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="22" height="10" fill="currentColor"></rect>
						<rect x="2" y="13" width="16" height="5" fill="currentColor"></rect>
						<rect x="19" y="13" width="2" height="5" fill="currentColor"></rect>
						<rect x="22" y="13" width="2" height="5" fill="currentColor"></rect>
					</svg>
				`), div("theatre (AB)")), label({ class: "layout-option" }, input({ type: "radio", name: "layout", value: "Upside Down" }), SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="7" y="8" width="17" height="10" fill="currentColor"/> /* pattern area */
						<rect x="2" y="2" width="4" height="16" fill="currentColor"/> /* settings area */
						<rect x="7" y="2" width="17" height="5" fill="currentColor"/> /* track area */
					</svg>
				`), div("Upturn (AB)")));
        this.container = div({ class: "prompt noSelection", style: "width: 300px;" }, div({ class: "promptTitle" }, h2({ class: "layoutExt", style: "text-align: inherit;" }, ""), h2({ class: "layoutTitle" }, "Layout")), this._form, div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._okayButton), this._cancelButton);
        this._close = () => {
            this._doc.undo();
        };
        this.cleanUp = () => {
            this._okayButton.removeEventListener("click", this._confirm);
            this._cancelButton.removeEventListener("click", this._close);
            this.container.removeEventListener("keydown", this._whenKeyPressed);
        };
        this._whenKeyPressed = (event) => {
            if (event.target.tagName != "BUTTON" && event.keyCode == 13) {
                this._confirm();
            }
        };
        this._confirm = () => {
            this._doc.prefs.layout = this._form.elements["layout"].value;
            this._doc.prefs.save();
            Layout.setLayout(this._doc.prefs.layout);
            this._close();
        };
        this._fileInput.select();
        setTimeout(() => this._fileInput.focus());
        this._okayButton.addEventListener("click", this._confirm);
        this._cancelButton.addEventListener("click", this._close);
        this.container.addEventListener("keydown", this._whenKeyPressed);
        this._form.elements["layout"].value = this._doc.prefs.layout;
    }
}
//# sourceMappingURL=LayoutPrompt.js.map