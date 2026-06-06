import { HTML } from "imperative-html/dist/esm/elements-strict";
const { button, div, h2, p, } = HTML;
export class TutorialPrompt {
    constructor(_doc) {
        this._doc = _doc;
        this._cancelButton = button({ class: "cancelButton", style: "display:none;" });
        this.okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay");
        this.yesButton1 = button({ class: "yesButton", style: "width:15%;" }, "Yes");
        this.noButton1 = button({ class: "noButton", style: "width:15%;" }, "No");
        this.yesButton2 = button({ class: "yesButton", style: "width:15%;" }, "Yes");
        this.noButton2 = button({ class: "noButton", style: "width:15%;" }, "No");
        this.yesButton3 = button({ class: "yesButton", style: "" }, "I am Certain");
        this.noButton3 = button({ class: "noButton", style: "" }, "Wait, I'll do it");
        this.learnBeepBox1 = button({ class: "tutorialButton", style: "margin:0.5em;" }, "This is my first time using Anything related to BeepBox.");
        this.learnJummBox1 = button({ class: "tutorialButton", style: "margin:0.5em;" }, "I have used BeepBox, but have never used any of its mods.");
        this.learnUltraBox1 = button({ class: "tutorialButton", style: "margin:0.5em;" }, "I have used BeepBox, and it's Mods, but I've never used UltraBox (The mod AbyssBox is built off of).");
        this.learnAbyssBox1 = button({ class: "tutorialButton", style: "margin:0.5em;" }, "I am familiar with BeepBox and its mods, but I'm new to AbyssBox.");
        this.learnBeepBox2 = button({ class: "tutorialButton", style: "margin:0.5em;" }, "Tell me more about BeepBox");
        this.learnJummBox2 = button({ class: "tutorialButton", style: "margin:0.5em;" }, "Tell me more about JummBox");
        this.learnUltraBox2 = button({ class: "tutorialButton", style: "margin:0.5em;" }, "Tell me more about UltraBox");
        this.learnAbyssBox2 = button({ class: "tutorialButton", style: "margin:0.5em;" }, "Tell me more about AbyssBox");
        this.learningBeepBoxButton1 = button({ class: "yesButton", style: "width:25%;" }, "Continue");
        this.learningBeepBoxPatternEditor = button({ class: "yesButton", style: "width:15%;" }, "Pattern Editor");
        this.learningBeepBoxTrackEditor = button({ class: "yesButton", style: "width:15%;" }, "Track Editor");
        this.learningBeepBoxSettingsEditor = button({ class: "yesButton", style: "width:15%;" }, "Settings Editor");
        this.startingContainer = div({ id: "tutorialPrompt" }, div({ class: "promptTitle" }, h2({ class: "tutorialExt", style: "text-align: inherit;" }, ""), h2({ class: "tutorialTitle", style: "margin-bottom: 0.5em;" }, "AbyssBox Tutorial")), p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }, "Is this your first time using AbyssBox?"), div({ style: "display:flex; flex-direction: row; justify-content: space-evenly;" }, this.yesButton1, this.noButton1));
        this.afterNo1Container = div({ id: "tutorialPrompt", style: "display:none;" }, div({ class: "promptTitle" }, h2({ class: "tutorialExt", style: "text-align: inherit;" }, ""), h2({ class: "tutorialTitle", style: "margin-bottom: 0.5em;" }, "AbyssBox Tutorial")), p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }, "Would you like to take the tutorial anyways?"), div({ style: "display:flex; flex-direction: row; justify-content: space-evenly; font-size: 15px;" }, this.yesButton2, this.noButton2));
        this.afterNo2Container = div({ id: "tutorialPrompt", style: "display:none;" }, div({ class: "promptTitle" }, h2({ class: "tutorialExt", style: "text-align: inherit;" }, ""), h2({ class: "tutorialTitle", style: "margin-bottom: 0.5em;" }, "AbyssBox Tutorial")), p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }, "Even if this is not your first time using AbyssBox, there might still be something worth learning from this. Are you certain you want to skip?"), div({ style: "display:flex; flex-direction: row; justify-content: space-evenly;" }, this.noButton3, this.yesButton3));
        this.afterYes1Container = div({ id: "tutorialPrompt", style: "display:none;" }, div({ class: "promptTitle" }, h2({ class: "tutorialExt", style: "text-align: inherit;" }, ""), h2({ class: "tutorialTitle", style: "margin-bottom: 0.5em;" }, "AbyssBox Tutorial")), p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }, "Since this is your first time using AbyssBox, we would like to ask how much do you know about BeepBox, its mods, or AbyssBox?"), div({ style: "display:flex; flex-direction: column; font-size: 15px;" }, this.learnBeepBox1, this.learnJummBox1, this.learnUltraBox1, this.learnAbyssBox1));
        this.afterYes3Container = div({ id: "tutorialPrompt", style: "display:none;" }, div({ class: "promptTitle" }, h2({ class: "tutorialExt", style: "text-align: inherit;" }, ""), h2({ class: "tutorialTitle", style: "margin-bottom: 0.5em;" }, "AbyssBox Tutorial")), p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }, "Even though this isn't your first time using AbyssBox, What would you like to learn about?"), div({ style: "display:flex; flex-direction: column; font-size: 15px;" }, this.learnBeepBox2, this.learnJummBox2, this.learnUltraBox2, this.learnAbyssBox2));
        this.learningBeepBox1 = div({ id: "tutorialPrompt" }, div({ class: "promptTitle" }, h2({ class: "tutorialExt", style: "text-align: inherit;" }, ""), h2({ class: "tutorialTitle", style: "margin-bottom: 0.5em;" }, "AbyssBox Tutorial")), p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }, "BeepBox is an online tool used to create songs, using simple shapes and sounds you can make many unique creations all within the editor. "), div({ style: "display:flex; flex-direction: row; justify-content: space-evenly;" }, this.learningBeepBoxButton1));
        this.learningBeepBox2 = div({ id: "tutorialPrompt" }, div({ class: "promptTitle" }, h2({ class: "tutorialExt", style: "text-align: inherit;" }, ""), h2({ class: "tutorialTitle", style: "margin-bottom: 0.5em;" }, "AbyssBox Tutorial")), p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }, "In BeepBox there are three major sections you will interact with throughout the entirety of your music making journey, these sections are:", p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }), "The Pattern Editor, The Track Editor, and the Settings Editor.", p({ style: "margin-bottom: 0.5em; text-align: center; font-size: 15px;" }), "Each of these areas are very important, which of these would you like to learn about first?"), div({ style: "display:flex; flex-direction: row; justify-content: space-evenly;" }, this.learningBeepBoxPatternEditor, this.learningBeepBoxTrackEditor, this.learningBeepBoxSettingsEditor));
        this.container = div({ class: "prompt noSelection", id: "tutorialContainerPrompt", style: "width: 350px;" }, this.startingContainer, this.afterNo1Container, this.afterNo2Container, this.afterYes1Container, this.afterYes3Container, this._cancelButton);
        this._close = () => {
            window.localStorage.setItem("tutorialComplete", "true");
            this._doc.prompt = null;
            this._doc.undo();
        };
        this._yes1 = () => {
            this.startingContainer.remove();
            this.afterNo1Container.remove();
            this.afterNo2Container.remove();
            this.afterYes3Container.remove();
            this.afterYes1Container.style.display = "unset";
            this._cancelButton.style.display = "unset";
        };
        this._yes2 = () => {
            this.startingContainer.remove();
            this.afterNo1Container.remove();
            this.afterNo2Container.remove();
            this.afterYes1Container.remove();
            this.afterYes3Container.style.display = "unset";
            this._cancelButton.style.display = "unset";
        };
        this._no1 = () => {
            this.startingContainer.remove();
            this.afterNo1Container.style.display = "unset";
        };
        this._no2 = () => {
            this.afterNo1Container.remove();
            this.afterNo2Container.style.display = "unset";
        };
        this.cleanUp = () => {
            this.okayButton.removeEventListener("click", this._close);
        };
        this._cancelButton.addEventListener("click", this._close);
        this.okayButton.addEventListener("click", this._close);
        this.yesButton1.addEventListener("click", this._yes1);
        this.yesButton2.addEventListener("click", this._yes2);
        this.noButton3.addEventListener("click", this._yes2);
        this.noButton1.addEventListener("click", this._no1);
        this.noButton2.addEventListener("click", this._no2);
        this.yesButton3.addEventListener("click", this._close);
    }
}
//# sourceMappingURL=TutorialPrompt.js.map