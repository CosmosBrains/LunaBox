import { HTML } from "imperative-html/dist/esm/elements-strict";
import { ChangeGroup } from "./Change";
import { ChangeSongAuthor, ChangeSongTitle, ChangeSongDescription, ChangeShowSongDetails } from "./changes";
const { button, div, h2, input, br, textarea } = HTML;
export class SongDetailsPrompt {
    constructor(_doc) {
        this._doc = _doc;
        this._cancelButton = button({ class: "cancelButton" });
        this._okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay");
        this._songTitle = input({ placeholder: "Enter Title Here", type: "text", style: "width: 100%;", value: this._doc.song.title, maxlength: 30, "autofocus": "autofocus" });
        this._songAuthor = input({ placeholder: "Enter Name Here", type: "text", style: "width: 100%;", value: this._doc.song.author, maxlength: 30 });
        this._songDescription = textarea({ placeholder: "Enter Description Here", style: "width: 100%; resize: none; background: var(--editor-background); color: white; height: 64px; border: 0.5px solid var(--input-box-outline); font-size: 14px;", maxlength: 1200 }, this._doc.song.description);
        this._showSongDetailsBox = input({ style: "width: 3em; margin-left: 1em;", type: "checkbox" });
        this._computedSamplesLabel = div({ style: "width: 10em;" }, new Text("0:00"));
        this._cantShortenLabel = div({}, "You cannot shorten this url!");
        this.container = div({ class: "prompt noSelection", style: "width: 250px;" }, h2("Song Details"), div({ style: "display: flex; flex-direction: row; align-items: baseline; gap: 10px;" }, "Title: ", this._songTitle), div({ style: "display: flex; flex-direction: row; align-items: baseline; gap: 10px;" }, "Author: ", this._songAuthor), div({ style: "display: flex; flex-direction: column; align-items: baseline;" }, "Description: ", this._songDescription), div({ style: "vertical-align: middle; align-items: center; justify-content: space-between;" }, "Show info on load: ", this._showSongDetailsBox), div({ style: "display: flex; flex-direction: column; align-items: baseline;" }, "Song Theme: ", this._doc.song.setSongTheme), div({ style: "text-align: left;" }, div({ style: "display:flex; gap: 3px; margin-bottom: 1em;" }, "Song Length: ", this._computedSamplesLabel), div({ style: "margin-bottom: 0.5em;" }, "Pitch Channels: " + this._doc.song.pitchChannelCount), div({ style: "margin-bottom: 0.5em;" }, "Noise Channels: " + this._doc.song.noiseChannelCount), div({}, "Mod Channels: " + this._doc.song.modChannelCount), br(), "URL Length: " + location.href.length, this._cantShortenLabel, br()), div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" }, this._okayButton), this._cancelButton);
        this._close = () => {
            this._doc.undo();
        };
        this.cleanUp = () => {
            this._okayButton.removeEventListener("click", this._saveChanges);
            this._cancelButton.removeEventListener("click", this._close);
        };
        this._saveChanges = () => {
            const group = new ChangeGroup();
            group.append(new ChangeSongTitle(this._doc, this._doc.song.title, this._songTitle.value));
            group.append(new ChangeSongAuthor(this._doc, this._doc.song.author, this._songAuthor.value));
            group.append(new ChangeSongDescription(this._doc, this._doc.song.description, this._songDescription.value));
            group.append(new ChangeShowSongDetails(this._doc, this._doc.song.showSongDetails, this._showSongDetailsBox.checked));
            this._doc.prompt = null;
            this._doc.record(group, true);
        };
        this._showSongDetailsBox.checked = this._doc.song.showSongDetails;
        this._cantShortenLabel.style.display = (location.href.length > (window.localStorage.getItem("shortenerStrategySelect") == "isgd" ? 5010 : 12233)) ? "" : "none";
        this._computedSamplesLabel.firstChild.textContent = this._doc.samplesToTime(this._doc.synth.getTotalSamples(true, true, 0));
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);
    }
}
//# sourceMappingURL=SongDetailsPrompt.js.map